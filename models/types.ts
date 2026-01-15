import React from 'react';

// ==========================================
// DOMAINE EXISTANT (Questions)
// ==========================================

export interface Question {
  id: number | string;
  question: string;
  answer: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  type?: "theory" | "code";
}

// Le contrat que tout fournisseur de questions doit respecter (Principe Open/Closed)
export interface IQuestionProvider {
  /**
   * Génère des questions. 
   * @param context (Optionnel) Le contexte spécifique (ex: résumé d'un PDF uploadé)
   */
  getQuestions(context?: string): Promise<Question[]>;
}

export interface FicheContent {
  subtitle: string;
  points: string[];
  code?: string;
}

export interface Fiche {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: FicheContent[];
}

// ==========================================
// NOUVEAU DOMAINE (Chatbot Service)
// ==========================================

export interface Attachment {
  mimeType: string;
  data: string; // Base64 encoded string (raw, without prefix)
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

// Contrat du Microservice Chat
export interface IChatService {
  sendMessageStream(message: string, attachments?: Attachment[]): AsyncGenerator<string, void, unknown>;
  
  /**
   * Analyse des fichiers pour extraire un contexte global pour l'application
   */
  analyzeDocumentForContext(attachments: Attachment[]): Promise<string>;

  /**
   * Explique le contexte actuel à l'étudiant
   */
  explainLearningContext(context: string): Promise<string>;
  
  generateLearningMaterial(context: string): Promise<Fiche[]>;
  
  clearHistory(): void;
}