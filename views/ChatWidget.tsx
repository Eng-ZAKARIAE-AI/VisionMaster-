import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, User, Paperclip, FileText, Sparkles, ChevronRight } from 'lucide-react';
import { IChatService, ChatMessage, Attachment } from '../models/types';

interface ChatWidgetProps {
  chatService: IChatService;
  onContextUpdate?: (context: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ chatService, onContextUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour ! Je suis VisionBot 🤖. Téléversez vos cours (PDF, TXT) pour que je vous aide à réviser, ou posez-moi une question."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, attachments]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const reader = new FileReader();
        
        const filePromise = new Promise<Attachment>((resolve) => {
          reader.onload = (event) => {
            const result = event.target?.result as string;
            const base64Data = result.split(',')[1];
            resolve({
              mimeType: file.type,
              data: base64Data,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });

        newAttachments.push(await filePromise);
      }
      
      const allAttachments = [...attachments, ...newAttachments];
      setAttachments(allAttachments);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // --- NEW: Trigger Context Analysis and Explanation ---
      if (onContextUpdate) {
        setIsTyping(true);
        // On lance l'analyse en "background"
        chatService.analyzeDocumentForContext(newAttachments)
          .then(async (summary) => {
            if (summary) {
              console.log("Nouveau contexte extrait :", summary);
              onContextUpdate(summary);
              
              // On demande à l'IA d'expliquer ce contexte à l'utilisateur
              const explanation = await chatService.explainLearningContext(summary);
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: explanation
              }]);
            }
            setIsTyping(false);
          })
          .catch(() => setIsTyping(false));
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    const currentAttachments = [...attachments];
    const currentInput = input;

    setInput('');
    setAttachments([]);
    setIsTyping(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined
    };

    setMessages(prev => [...prev, userMsg]);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true }]);

    try {
      let fullResponse = "";
      for await (const chunk of chatService.sendMessageStream(userMsg.text, userMsg.attachments)) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
      ));
    } catch (e) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Désolé, une erreur est survenue.", 
        isStreaming: false 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    chatService.clearHistory();
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Mémoire effacée. Vous pouvez envoyer de nouveaux documents."
    }]);
    setAttachments([]);
    if (onContextUpdate) onContextUpdate(""); // Reset global context
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2 group ${isOpen ? 'translate-x-24 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium text-sm">
            Assistant IA
        </span>
      </button>

      {/* BACKDROP */}
      <div 
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* DRAWER SIDEBAR */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
                <Bot size={22} />
            </div>
            <div>
                <h3 className="font-bold text-base leading-tight">VisionBot IA</h3>
                <p className="text-xs text-indigo-100 opacity-90">Assistant Contextuel</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
                onClick={handleClear} 
                className="p-2 hover:bg-white/20 rounded-full text-indigo-100 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium" 
                title="Nouvelle conversation"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-white text-gray-600 border border-gray-100' : 'bg-indigo-100 text-indigo-600'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className={`flex items-center gap-2 text-xs p-2.5 rounded-lg border ${msg.role === 'user' ? 'bg-indigo-700 border-indigo-500 text-indigo-50' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                          <FileText size={14} className="shrink-0" />
                          <span className="truncate">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.text ? (
                    <div className="markdown-content">
                        {msg.text.split("```").map((part, index) => {
                            if (index % 2 === 1) return <code key={index} className="block bg-black/80 text-green-400 p-3 rounded-md my-2 font-mono text-xs overflow-x-auto border border-gray-700">{part}</code>;
                            return <span key={index} dangerouslySetInnerHTML={{__html: part.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded text-red-500 font-mono text-xs">$1</code>')}} />;
                        })}
                    </div>
                  ) : <span className="italic opacity-80 flex items-center gap-2"><FileText size={14}/> Document transmis pour analyse</span>}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 text-sm flex items-center gap-1 shadow-sm">
                   <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ATTACHMENT PREVIEW */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto shrink-0">
            {attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg pl-2 pr-1 py-1.5 text-xs text-gray-700 shadow-sm flex-shrink-0 group">
                <FileText size={14} className="text-indigo-500" />
                <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                <button onClick={() => removeAttachment(idx)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2">
            <input type="file" multiple accept=".pdf,.txt,.md,.py,.js" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                title="Joindre un fichier"
            >
                <Paperclip size={20} />
            </button>
            <div className="flex-1 bg-gray-100 focus-within:bg-white border border-transparent focus-within:border-indigo-300 rounded-xl px-4 py-3 transition-all">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder={attachments.length > 0 ? "Ajoutez une instruction pour ces fichiers..." : "Posez une question ou envoyez un PDF..."} 
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" 
                />
            </div>
            <button 
                type="submit" 
                disabled={(!input.trim() && attachments.length === 0) || isTyping} 
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
                <Send size={20} />
            </button>
          </form>
          <div className="text-[10px] text-center text-gray-400 mt-2">
            VisionBot peut faire des erreurs. Vérifiez les informations importantes.
          </div>
        </div>
      </div>
    </>
  );
};