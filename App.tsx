import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initializeChat, sendMessageStream } from './services/geminiService';
import { Message, MessageRole, WidgetType } from './types';
import { INITIAL_GREETING, APP_NAME } from './constants';
import { MessageBubble } from './components/MessageBubble';
import { EmergencyModal } from './components/EmergencyModal';
import { ToolkitOverlay } from './components/ToolkitOverlay';
import { LivingBackground } from './components/LivingBackground';
import { Sidebar } from './components/Sidebar';
import { encryptMessage, decryptMessage } from './services/encryptionService';

// Extended Window interface for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const App: React.FC = () => {
  // Messages in state are now ENCRYPTED strings
  const [encryptedMessages, setEncryptedMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isBlurMode, setIsBlurMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize chat on mount without asking for key
  useEffect(() => {
    try {
      initializeChat();
      // Encrypt the initial greeting
      const encryptedGreeting = encryptMessage(INITIAL_GREETING);
      setEncryptedMessages([
        {
          id: uuidv4(),
          role: MessageRole.MODEL,
          text: encryptedGreeting,
          timestamp: new Date(),
          widget: WidgetType.NONE
        },
      ]);
    } catch (e) {
      console.error("Initialization error", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [encryptedMessages, isLoading]);

  // Voice Input Handler
  const startListening = async () => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const Recognition = SpeechRecognition || webkitSpeechRecognition;
    
    if (!Recognition) {
      alert("عذراً، متصفحك لا يدعم الأوامر الصوتية. يرجى استخدام Google Chrome.");
      return;
    }

    if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
    }

    // Explicitly request microphone permission first
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
    } catch (error) {
        console.error("Microphone permission denied:", error);
        alert("عذراً، يجب السماح باستخدام الميكروفون للتحدث.");
        return;
    }

    const recognition = new Recognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false; 
    recognition.interimResults = true; 

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
        setIsListening(false);
        inputRef.current?.focus();
    };
    
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            alert("عذراً، لا يمكن الوصول للميكروفون. يرجى التأكد من منح الصلاحية.");
        }
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
          setInput(prev => {
              const separator = prev.length > 0 ? ' ' : '';
              return prev + separator + finalTranscript;
          });
      }
    };

    recognitionRef.current = recognition;
    try {
        recognition.start();
    } catch (e) {
        console.error("Mic start error", e);
        setIsListening(false);
    }
  };

  const parseWidgetFromText = (text: string): { cleanText: string, widget: WidgetType } => {
    let widget = WidgetType.NONE;
    if (text.includes('<WIDGET:BREATHING>')) widget = WidgetType.BREATHING;
    if (text.includes('<WIDGET:AUDIO_RAIN>')) widget = WidgetType.AUDIO_RAIN;
    if (text.includes('<WIDGET:CHECKLIST_DEPRESSION>')) widget = WidgetType.CHECKLIST_Depression;
    
    return { cleanText: text, widget };
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setInput('');
    
    // Encrypt user message
    setEncryptedMessages((prev) => [...prev, {
      id: uuidv4(),
      role: MessageRole.USER,
      text: encryptMessage(userText),
      timestamp: new Date(),
    }]);
    
    setIsLoading(true);

    try {
      const responseId = uuidv4();
      // Initialize empty encrypted model message
      setEncryptedMessages((prev) => [...prev, {
        id: responseId,
        role: MessageRole.MODEL,
        text: encryptMessage(''),
        timestamp: new Date(),
      }]);

      const stream = sendMessageStream(userText);
      let fullTextBuffer = '';

      for await (const chunk of stream) {
        fullTextBuffer += chunk;
        
        const encryptedChunk = encryptMessage(fullTextBuffer);

        setEncryptedMessages((prev) => 
          prev.map((msg) => 
             msg.id === responseId ? { ...msg, text: encryptedChunk } : msg
          )
        );
      }

      const { widget } = parseWidgetFromText(fullTextBuffer);
      if (widget !== WidgetType.NONE) {
         setEncryptedMessages((prev) => 
          prev.map((msg) => 
             msg.id === responseId ? { ...msg, widget: widget } : msg
          )
        );
      }

    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMsg = "حدث انقطاع في الاتصال بالشبكة العصبية. حاول مجدداً.";
      
      if (error.message?.includes('API_KEY')) {
          errorMsg = "عذراً، لم يتم إعداد مفتاح النظام بشكل صحيح من المصدر.";
      }

      setEncryptedMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: MessageRole.MODEL,
          text: encryptMessage(errorMsg),
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDecryptedMessages = () => {
    return encryptedMessages.map(msg => ({
      ...msg,
      text: decryptMessage(msg.text)
    }));
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <LivingBackground />
      
      <div className={`relative flex flex-1 h-full z-10 transition-all duration-500 ${isBlurMode ? 'filter blur-xl scale-105' : ''}`}>
        
        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 h-full relative">
            
            {/* Header */}
            <header className="flex-none px-4 py-4 flex justify-between items-center z-30">
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu (Mobile Only) */}
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="lg:hidden p-2 text-[#64ffda] bg-[#112240] rounded-xl border border-[#233554] active:scale-95 transition-transform shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>

                    <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#64ffda] flex items-center justify-center glass shadow-[0_0_15px_rgba(100,255,218,0.2)]">
                             <img src="https://picsum.photos/seed/drhekma_v3/200/200" className="w-full h-full rounded-full opacity-80" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#64ffda] rounded-full shadow-[0_0_10px_#64ffda]"></span>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-[#e6f1ff] tracking-tight">{APP_NAME}</h1>
                        <p className="text-[9px] md:text-[10px] text-[#64ffda] uppercase tracking-widest flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          مشفّر | ملاذ آمن
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setIsBlurMode(!isBlurMode)}
                        className="p-2 rounded-full hover:bg-[#112240] text-gray-400 hover:text-white transition tooltip hidden sm:block"
                        title="وضع الخصوصية (تغبيش الشاشة)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setIsEmergencyOpen(true)}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold hover:bg-red-500/20 transition flex items-center gap-1.5"
                    >
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        طوارئ
                    </button>
                </div>
            </header>

            {/* Chat Scroller */}
            <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar scroll-smooth relative z-20">
                <div className="max-w-3xl mx-auto pt-4 pb-24">
                    {getDecryptedMessages().map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start w-full mb-8 animate-pulse">
                            <div className="flex items-center gap-2 text-[#64ffda] text-xs px-4">
                                <span className="w-1 h-1 bg-[#64ffda] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1 h-1 bg-[#64ffda] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1 h-1 bg-[#64ffda] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                دكتور حكمة يكتب...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Dock */}
            <footer className="flex-none p-4 z-30 mb-2">
                <div className="max-w-3xl mx-auto">
                    <div className="relative glass rounded-3xl p-2 flex items-end gap-2 shadow-2xl">
                         {/* Voice Button */}
                         <button 
                            onClick={startListening}
                            className={`p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-95 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_#ef4444]' : 'hover:bg-[#112240] text-[#64ffda]'}`}
                            title={isListening ? "جاري الاستماع... اضغط للإيقاف" : "اضغط للتحدث"}
                         >
                            {isListening ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                         </button>

                         <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "استمع إليك الآن..." : "اكتب ما تشعر به..."}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-[#e6f1ff] placeholder-gray-500 py-4 font-medium text-base md:text-lg max-h-32 overflow-y-auto resize-none outline-none"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`
                            mb-1 p-3 md:p-3.5 rounded-2xl flex-shrink-0 transition-all duration-300
                            ${!input.trim() || isLoading 
                                ? 'opacity-30 cursor-not-allowed' 
                                : 'bg-[#64ffda] text-[#0a192f] hover:bg-[#52dabb] shadow-[0_0_15px_#64ffda]'
                            }
                            `}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-center mt-3">
                         <p className="text-[9px] md:text-[10px] text-gray-500 font-medium tracking-wide flex items-center justify-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                           </svg>
                           مشفر من طرف لطرف. الذكاء الاصطناعي لا يستبدل الطبيب البشري.
                         </p>
                    </div>
                </div>
            </footer>
        </div>

        {/* Sidebar (Responsive) */}
        <Sidebar 
          onToolSelect={setActiveToolId} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Blur Mode Overlay Button (To unblur) */}
        {isBlurMode && (
            <button 
                onClick={() => setIsBlurMode(false)}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 text-white cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xl font-light tracking-widest">انقر للعودة</span>
            </button>
        )}
      </div>

      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
      
      {/* Tool Overlay */}
      <ToolkitOverlay activeToolId={activeToolId} onClose={() => setActiveToolId(null)} />
    </div>
  );
};

export default App;