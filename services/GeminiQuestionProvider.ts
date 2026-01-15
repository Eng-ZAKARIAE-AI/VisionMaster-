import { IQuestionProvider, Question } from '../models/types';

// ==========================================
// INFRASTRUCTURE : OPENROUTER QUESTION PROVIDER
// ==========================================

export class GeminiQuestionProvider implements IQuestionProvider {
  private apiKey: string;
  private modelId: string = "openai/gpt-3.5-turbo";
  private apiUrl: string = "https://openrouter.ai/api/v1/chat/completions";

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  }

  async getQuestions(context?: string): Promise<Question[]> {
    if (!this.apiKey) {
      throw new Error("Clé API manquante. Veuillez configurer l'API Key.");
    }

    // Extract subject/domain from context
    const getSubject = (ctx?: string): string => {
      if (!ctx) return "Veuillez fournir un contexte pour générer des questions pertinentes.";
      
      // Extract domain if context follows standard format (Domain: ...)
      const domainMatch = ctx.match(/Domain:\s*(.+?)(?:\n|$)/i);
      if (domainMatch) {
        return domainMatch[1].trim();
      }
      
      // Otherwise use first line as subject
      return ctx.split('\n')[0].trim();
    };

    const subject = getSubject(context);
    const contextInstruction = context 
      ? `SUJET : ${subject}\n\nBASE DE CONNAISSANCES :\n${context}\n\nGénère des questions EXCLUSIVEMENT basées sur ces sujets.`
      : `Impossible de générer des questions sans contexte. ${subject}`;

    const prompt = `${contextInstruction}

TÂCHE : Génère 3 questions d'examen difficiles et techniques.

CONTRAINTES :
- Au moins une question doit demander d'écrire ou d'analyser du code (si pertinent selon le sujet).
- Au moins une question doit être conceptuelle ou mathématique.
- Les réponses doivent être concises, pédagogiques et précises.

Réponds UNIQUEMENT avec un tableau JSON array (pas de texte avant ou après). Format:
[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "Facile|Moyen|Difficile",
    "type": "code|theory"
  }
]`;

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
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      
      if (!rawText) throw new Error("Réponse vide de l'IA");

      const parsed = JSON.parse(rawText);
      
      return parsed.map((q: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty,
        type: q.type
      }));

    } catch (error) {
      console.error("Erreur OpenRouter Provider:", error);
      throw new Error("Impossible de générer des questions via l'IA.");
    }
  }
}