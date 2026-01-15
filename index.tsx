import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Brain, HelpCircle, Menu, Sparkles, RefreshCw, AlertTriangle, FileText, Loader2, Upload } from 'lucide-react';

// Controller
import { useAppController } from './controllers/AppController';

// Views
import { ContentViewer, QuizCard, Drawer, ChapterList, ContextUploader } from './views/components';
import { ChatWidget } from './views/ChatWidget';

// ==========================================
// COMPOSITION ROOT (MAIN APP)
// ==========================================

const App = () => {
  // Le Controller gère toute la logique et l'état
  const ctrl = useAppController();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-900 relative">
      
      {/* DRAWER MOBILE NAVIGATION */}
      <Drawer 
        isOpen={ctrl.isSidebarOpen} 
        onClose={() => ctrl.setSidebarOpen(false)} 
        title={ctrl.globalContext ? 'Programme Adaptatif' : 'Chapitres Standard'}
      >
        <ChapterList 
          fiches={ctrl.fiches} 
          currentId={ctrl.currentFicheId} 
          onSelect={(id) => {
            ctrl.setCurrentFicheId(id);
            ctrl.setActiveTab('revision');
            ctrl.setSidebarOpen(false);
          }} 
        />
      </Drawer>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white p-2 rounded-lg shadow-lg shadow-brand-200">
              <Brain size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 hidden sm:block">
                VisionMaster
              </h1>
              {ctrl.globalContext && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium animate-in fade-in">
                  <FileText size={10} />
                  <span className="truncate max-w-[200px]">Cours personnalisé actif</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
            <button 
              onClick={() => ctrl.setActiveTab('revision')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${ctrl.activeTab === 'revision' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">Cours</span>
            </button>
            <button 
              onClick={() => ctrl.setActiveTab('quiz')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${ctrl.activeTab === 'quiz' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <HelpCircle size={18} />
              <span className="hidden sm:inline">Quiz</span>
            </button>
            <button 
              onClick={() => ctrl.setActiveTab('context')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${ctrl.activeTab === 'context' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Contexte</span>
            </button>
          </div>

          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => ctrl.setSidebarOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8">
        
        {ctrl.isGeneratingCourse && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
             <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
             <h2 className="text-xl font-bold text-gray-800">Adaptation du cours en cours...</h2>
             <p className="text-gray-500">VisionBot analyse vos documents et restructure les chapitres.</p>
          </div>
        )}

        {ctrl.activeTab === 'revision' && (
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
            <div className="hidden lg:block lg:w-1/3 flex-shrink-0">
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  {ctrl.globalContext ? 'Programme Adaptatif' : 'Chapitres Standard'}
                </h2>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                   <ChapterList 
                      fiches={ctrl.fiches} 
                      currentId={ctrl.currentFicheId} 
                      onSelect={ctrl.setCurrentFicheId} 
                    />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 h-full">
              {ctrl.currentFiche ? (
                <ContentViewer fiche={ctrl.currentFiche} />
              ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">Aucun contenu disponible.</div>
              )}
            </div>
          </div>
        )}

        {ctrl.activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mode Examen 🎓</h2>
              <p className="text-gray-500 mb-6">Testez vos compétences techniques.</p>
              
              {ctrl.globalContext && (
                 <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm mb-4 inline-block mx-auto max-w-lg">
                    <strong>Sujet détecté :</strong> Le générateur de Quiz utilise le contenu de vos fichiers.
                 </div>
              )}

              <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
                 <button
                  onClick={() => ctrl.setUseAI(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!ctrl.useAI ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Questions Statiques
                </button>
                <button
                  onClick={() => ctrl.setUseAI(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${ctrl.useAI ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-purple-600'}`}
                >
                  <Sparkles size={16} />
                  Générer avec Gemini AI
                </button>
              </div>
            </div>

            {ctrl.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                <AlertTriangle size={24} />
                <div>
                  <p className="font-bold">Erreur</p>
                  <p className="text-sm">{ctrl.error}</p>
                </div>
                <button onClick={ctrl.loadQuestions} className="ml-auto underline text-sm">Réessayer</button>
              </div>
            )}
            
            {ctrl.isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-4 text-brand-500" size={40} />
                <p className="font-medium text-gray-600">
                  {ctrl.useAI ? "L'IA analyse le sujet et prépare les questions..." : "Chargement..."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {ctrl.questions.map((q, idx) => (
                  <QuizCard key={q.id} question={q} idx={idx} />
                ))}
                
                {ctrl.questions.length > 0 && (
                  <div className="flex justify-center pt-8">
                    <button 
                       onClick={ctrl.loadQuestions}
                       className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 rounded-lg text-gray-700 font-medium transition-all"
                    >
                      <RefreshCw size={18} />
                      Générer une nouvelle série
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {ctrl.activeTab === 'context' && (
          <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in duration-500">
             <ContextUploader 
               onUpload={ctrl.handleExplicitUpload} 
               isAnalyzing={ctrl.isAnalyzingUpload} 
             />
          </div>
        )}

      </main>

      <ChatWidget 
        chatService={ctrl.chatService} 
        onContextUpdate={ctrl.handleContextUpdate} 
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);