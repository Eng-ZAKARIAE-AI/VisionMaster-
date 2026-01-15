import { IChatService, Attachment, Fiche } from '../models/types';
import React from 'react';
import { BookOpen, Code, Layers, Zap, PenTool } from 'lucide-react';

// ==========================================
// INFRASTRUCTURE : CHAT MICROSERVICE (OpenRouter)
// ==========================================

interface OpenRouterMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class GeminiChatService implements IChatService {
  private apiKey: string;
  private modelId: string = "openai/gpt-3.5-turbo";
  private conversationHistory: OpenRouterMessage[] = [];
  private apiUrl: string = "https://openrouter.ai/api/v1/chat/completions";
  
  private systemInstruction: string = `Tu es "VisionBot", un assistant pédagogique.

RÈGLES D'INTERACTION :
- Si l'utilisateur envoie un document, utilise-le comme source principale de vérité.
- Sois concis et pédagogique.
- Utilise le format Markdown.`;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  }

  async *sendMessageStream(message: string, attachments?: Attachment[]): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) {
      yield "Erreur : Clé API manquante ou service indisponible.";
      return;
    }

    try {
      // Add message to conversation history
      let userMessage = message;
      if (attachments && attachments.length > 0) {
        userMessage += "\n\n[Attachments provided but not directly processed in streaming mode]";
      }
      
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VisionBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            { role: 'system', content: this.systemInstruction },
            ...this.conversationHistory
          ],
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  yield content;
                }
              } catch (e) {
                // Ignore JSON parse errors for incomplete messages
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Add assistant response to history
      if (assistantMessage) {
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage
        });
      }
    } catch (error: any) {
      console.error("Chat Error:", error?.message || error);
      yield "\n\n[Erreur de connexion: " + (error?.message || "Impossible de communiquer avec l'API.") + "]";
    }
  }

  async analyzeDocumentForContext(attachments: Attachment[]): Promise<string> {
    if (!attachments || attachments.length === 0) return "";
    
    try {
      const prompt = `You are the Context Engine of an adaptive learning application.

Your task is to dynamically generate and update the GLOBAL LEARNING CONTEXT based on the provided documents.

Your responsibilities:
1. Identify the academic domain
2. Extract the main topics and subtopics
3. Detect the current learning focus
4. Produce an exam-oriented context
5. Keep the context concise and reusable

Rules:
- The context MUST change when the content changes
- Do NOT reuse previous context if new information is provided
- Avoid generic or static domains
- Focus on what the student should be examined on

Return ONLY a structured context in this format:

Domain: [Domain Name]
Main Topics:
- [Topic 1]
- ...

Subtopics:
- [Subtopic 1]
- ...

Exam Focus:
- [Specific Concept to Test]
- ...

Difficulty Level:
(beginner | intermediate | advanced)`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VisionBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            { role: 'system', content: this.systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (e) {
      console.error("Erreur analyse contexte:", e);
      return "";
    }
  }

  async explainLearningContext(context: string): Promise<string> {
    if (!context) return "";

    const prompt = `You are the Context Explanation Engine of an adaptive learning application.

Your role is to explain to the user what the application has understood
as the CURRENT LEARNING CONTEXT.

Input Context:
${context}

Instructions:
- Explain the context in a clear, student-friendly way
- Be concise and structured
- Focus on exam preparation
- Do NOT introduce new topics
- Do NOT repeat raw technical data

Return the result in the following format:

📘 Current Learning Domain:
<short description>

🎯 Active Topics:
- ...
- ...

🧠 What you should focus on:
- ...

❓ Typical exam questions:
- ...

⚠️ Common mistakes to avoid:
- ...`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VisionBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            { role: 'system', content: this.systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Impossible d'expliquer le contexte.";
    } catch (error) {
      console.error("Erreur explication contexte:", error);
      return "";
    }
  }

  async generateLearningMaterial(context: string): Promise<Fiche[]> {
    if (!context) return [];

    const prompt = `CONTEXTE PÉDAGOGIQUE :
${context}

TÂCHE : Tu es un ingénieur pédagogique. Crée un plan de cours structuré en 3 à 5 chapitres ("Fiches") basés strictement sur le contexte structuré fourni ci-dessus.

CONTRAINTES :
- Utilise les "Main Topics" et "Subtopics" du contexte pour définir les chapitres.
- Chaque fiche doit avoir un titre, une couleur (classes Tailwind CSS comme "bg-blue-100 text-blue-700"), et du contenu.
- Le contenu doit inclure des points clés et, si pertinent, un court snippet de code (Python/Pseudocode).
- Réponds UNIQUEMENT en JSON.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VisionBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            { role: 'system', content: this.systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const textContent = data.choices?.[0]?.message?.content || "[]";
      const rawFiches = JSON.parse(textContent);

      return rawFiches.map((f: any, index: number) => ({
        id: index + 1,
        title: f.title,
        color: f.color || "bg-gray-100 text-gray-700",
        icon: this.getIconForTitle(f.title),
        content: f.content
      }));

    } catch (error) {
      console.error("Erreur génération cours:", error);
      return [];
    }
  }

  private getIconForTitle(title: string): React.ReactNode {
    const t = title.toLowerCase();
    if (t.includes("code") || t.includes("python") || t.includes("impl")) return React.createElement(Code, { size: 24 });
    if (t.includes("base") || t.includes("intro")) return React.createElement(BookOpen, { size: 24 });
    if (t.includes("math") || t.includes("calc")) return React.createElement(Zap, { size: 24 });
    if (t.includes("ex") || t.includes("tp")) return React.createElement(PenTool, { size: 24 });
    return React.createElement(Layers, { size: 24 });
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}