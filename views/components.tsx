import React, { useState, useRef } from 'react';
import { ChevronRight, Code, CheckCircle, HelpCircle, Eye, X, Upload, FileText, Image as ImageIcon, FileType } from 'lucide-react';
import { Fiche, Question, Attachment } from '../models/types';

// ==========================================
// COUCHE PRÉSENTATION (UI COMPONENTS)
// ==========================================

// --- Composant: Zone d'Upload de Contexte ---
export const ContextUploader: React.FC<{ 
  onUpload: (files: FileList) => void, 
  isAnalyzing: boolean 
}> = ({ onUpload, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Changez de Module 📚</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          VisionBot peut générer un cours entier et des quiz à partir de vos documents.
          Envoyez vos supports pour commencer.
        </p>
      </div>

      <div 
        className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer group
          ${isDragging 
            ? 'border-brand-500 bg-brand-50 scale-[1.02]' 
            : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
          }
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'opacity-100'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept=".pdf,.txt,.md,.png,.jpg,.jpeg" 
          onChange={(e) => e.target.files && onUpload(e.target.files)} 
        />
        
        <div className="flex justify-center mb-6">
          <div className={`p-6 rounded-full transition-colors ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
            <Upload size={48} strokeWidth={1.5} />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Glissez vos fichiers ici
        </h3>
        <p className="text-gray-500 mb-6">
          ou cliquez pour parcourir
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
          <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded"><FileText size={12} /> PDF</span>
          <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded"><ImageIcon size={12} /> PNG/JPG</span>
          <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded"><FileType size={12} /> TXT/MD</span>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600 mb-4"></div>
            <p className="text-brand-700 font-bold animate-pulse">Analyse des documents en cours...</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
          <div className="text-2xl mb-2">🧠</div>
          <h4 className="font-bold text-gray-800 text-sm">Compréhension</h4>
          <p className="text-xs text-gray-500 mt-1">L'IA analyse la sémantique de vos cours.</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
          <div className="text-2xl mb-2">📝</div>
          <h4 className="font-bold text-gray-800 text-sm">Structuration</h4>
          <p className="text-xs text-gray-500 mt-1">Génération automatique de fiches de révision.</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="font-bold text-gray-800 text-sm">Évaluation</h4>
          <p className="text-xs text-gray-500 mt-1">Création de quiz ciblés sur le contenu.</p>
        </div>
      </div>
    </div>
  );
};

// --- Composant: Carte de Chapitre ---
export const FicheCard: React.FC<{ fiche: Fiche, isActive: boolean, onClick: () => void }> = ({ fiche, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 mb-3 transition-all duration-200 border-2 ${isActive ? 'border-brand-500 bg-white shadow-md' : 'border-transparent bg-white hover:bg-gray-50'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${fiche.color}`}>
            {fiche.icon}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{fiche.title}</h3>
            <p className="text-sm text-gray-500">Chapitre {fiche.id}</p>
          </div>
        </div>
        {isActive && <ChevronRight className="text-brand-500" />}
      </div>
    </div>
  );
};

// --- Composant: Liste de Chapitres (Réutilisable) ---
export const ChapterList: React.FC<{ fiches: Fiche[], currentId: number, onSelect: (id: number) => void }> = ({ fiches, currentId, onSelect }) => (
  <div className="space-y-2">
    {fiches.map(fiche => (
      <FicheCard 
        key={fiche.id} 
        fiche={fiche} 
        isActive={fiche.id === currentId} 
        onClick={() => onSelect(fiche.id)}
      />
    ))}
  </div>
);

// --- Composant: App Drawer (Navigation Mobile) ---
export const Drawer: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
       {/* Backdrop */}
       <div 
         className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
         onClick={onClose}
       />
       {/* Panel */}
       <div className={`absolute top-0 bottom-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-lg text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
            {children}
          </div>
       </div>
    </div>
  );
};

// --- Composant: Visualiseur de Cours ---
export const ContentViewer = ({ fiche }: { fiche: Fiche }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col animate-in fade-in duration-300">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className={`p-2 rounded-md ${fiche.color} bg-opacity-20`}>{fiche.icon}</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Fiche de révision</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800">{fiche.title}</h2>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 space-y-8">
        {fiche.content.map((section, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{animationDelay: `${idx * 100}ms`}}>
            <h3 className="text-xl font-bold text-brand-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="text-brand-500">#</span> {section.subtitle}
            </h3>
            <ul className="space-y-3 mb-4">
              {section.points.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0"></span>
                  <span dangerouslySetInnerHTML={{ 
                    __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                                 .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>') 
                  }} />
                </li>
              ))}
            </ul>
            {section.code && (
              <div className="bg-slate-800 rounded-lg p-4 shadow-inner mt-4 overflow-x-auto group">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">python</span>
                </div>
                <pre className="text-sm font-mono text-slate-200">
                  <code>{section.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Composant: Carte Quiz ---
export const QuizCard: React.FC<{ question: Question, idx: number }> = ({ question, idx }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 card-hover">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
              Q{idx + 1}
            </span>
            {question.type === 'code' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 gap-1">
                <Code size={12} /> Code
              </span>
            )}
          </div>
         
          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
            question.difficulty === 'Facile' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 leading-relaxed whitespace-pre-wrap">{question.question}</h3>
        
        {revealed ? (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 animate-in fade-in zoom-in-95 duration-300">
            <h4 className="text-green-800 font-bold text-sm mb-1 flex items-center gap-2">
              <CheckCircle size={16} /> Réponse correcte
            </h4>
            <div className="text-gray-800 whitespace-pre-wrap">{question.answer}</div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <HelpCircle size={32} className="text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm mb-4">La réponse est masquée</p>
            <button 
              onClick={() => setRevealed(true)}
              className="px-4 py-2 bg-white border border-gray-300 shadow-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-brand-600 hover:border-brand-300 transition-colors flex items-center gap-2"
            >
              <Eye size={18} /> Révéler la réponse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};