import { useState, useEffect, useMemo } from 'react';
import { IQuestionProvider, Question, Fiche, Attachment } from '../models/types';
import { STATIC_FICHES } from '../models/data';
import { StaticQuestionProvider } from '../services/StaticQuestionProvider';
import { GeminiQuestionProvider } from '../services/GeminiQuestionProvider';
import { GeminiChatService } from '../services/ChatService';

export const useAppController = () => {
  const [activeTab, setActiveTab] = useState<'revision' | 'quiz' | 'context'>('revision');
  const [currentFicheId, setCurrentFicheId] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Quiz State
  const [useAI, setUseAI] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content State
  const [fiches, setFiches] = useState<Fiche[]>(STATIC_FICHES);
  const [globalContext, setGlobalContext] = useState<string>("");
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);

  const chatService = useMemo(() => new GeminiChatService(), []);
  const currentFiche = fiches.find(f => f.id === currentFicheId) || fiches[0];

  // Logic: Handle Context Update
  const handleContextUpdate = async (ctx: string) => {
    setGlobalContext(ctx);
    
    if (!ctx) {
      setFiches(STATIC_FICHES);
      setCurrentFicheId(1);
      return;
    }

    setIsGeneratingCourse(true);
    try {
      const dynamicFiches = await chatService.generateLearningMaterial(ctx);
      if (dynamicFiches.length > 0) {
        setFiches(dynamicFiches);
        setCurrentFicheId(1);
        setActiveTab('revision');
      }
    } catch (e) {
      console.error("Erreur génération cours", e);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  // Logic: Handle Explicit File Upload
  const handleExplicitUpload = async (files: FileList) => {
    setIsAnalyzingUpload(true);
    try {
      const attachments: Attachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const att = await new Promise<Attachment>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve({
              mimeType: file.type,
              data: result.split(',')[1],
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
        attachments.push(att);
      }

      const contextSummary = await chatService.analyzeDocumentForContext(attachments);
      if (contextSummary) {
        await handleContextUpdate(contextSummary);
        await chatService.explainLearningContext(contextSummary);
      }
    } catch (e) {
      console.error("Erreur upload:", e);
      alert("Erreur lors de l'analyse des fichiers.");
    } finally {
      setIsAnalyzingUpload(false);
    }
  };

  // Logic: Load Questions
  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    setQuestions([]); 

    try {
      let provider: IQuestionProvider;
      
      if (useAI) {
        provider = new GeminiQuestionProvider();
      } else {
        provider = new StaticQuestionProvider();
      }

      const fetchedQuestions = await provider.getQuestions(globalContext);
      setQuestions(fetchedQuestions);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      loadQuestions();
    }
  }, [activeTab, useAI, globalContext]); 

  return {
    activeTab, setActiveTab,
    currentFicheId, setCurrentFicheId,
    isSidebarOpen, setSidebarOpen,
    useAI, setUseAI,
    questions, isLoading, error, loadQuestions,
    fiches, globalContext,
    isGeneratingCourse, isAnalyzingUpload,
    chatService, currentFiche,
    handleContextUpdate, handleExplicitUpload
  };
};