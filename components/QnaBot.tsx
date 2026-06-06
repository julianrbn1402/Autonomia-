import React, { useState, useRef, useEffect } from 'react';
import { RouteIcon, LightbulbIcon, SendIcon, TrashIcon } from './icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AutonomiaAvatar: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <div 
      className={`relative rounded-full overflow-hidden select-none shrink-0 border border-amber-500/30 bg-slate-950 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background gradient (Cloudy/Blue sky matching the photo) */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="vestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <circle cx="50" cy="50" r="50" fill="url(#skyGradient)" />

        {/* Gray roof beam in background (angled metal structure from photo) */}
        <path d="M-10 75 L110 50 L110 65 L-10 90 Z" fill="#334155" opacity="0.3" />

        {/* Blue Work Shirt Body */}
        <path d="M20 90 C20 80 30 75 50 75 C70 75 80 80 80 90 L85 105 L15 105 Z" fill="#60a5fa" />
        <path d="M40 76 L50 88 L60 76 Z" fill="#3b82f6" opacity="0.8" />

        {/* Safety Vest (Neon Green) */}
        <path d="M12 90 C12 80 22 75 35 75 L38 92 L20 102 Z" fill="url(#vestGrad)" />
        <path d="M88 90 C88 80 78 75 65 75 L62 92 L80 102 Z" fill="url(#vestGrad)" />

        {/* Reflective Strips on Safety Vest */}
        <path d="M24 76 L28 100" stroke="#f1f5f9" strokeWidth="3" opacity="0.9" />
        <path d="M76 76 L72 100" stroke="#f1f5f9" strokeWidth="3" opacity="0.9" />

        {/* Neck */}
        <path d="M40 68 C40 68 40 78 50 78 C60 78 60 68 60 68 Z" fill="#1e293b" />

        {/* Face Mask (Buff) - Dark Charcoal covering lower face */}
        <path d="M28 50 C28 50 30 74 50 74 C70 74 72 50 72 50 C72 50 63 60 50 60 C37 60 28 50 28 50 Z" fill="#0f172a" />
        <path d="M30 46 Q50 56 70 46 L71 52 C71 52 64 68 50 68 C36 68 29 52 29 52 Z" fill="#1e293b" />

        {/* Nose / Face Bridge underneath Mask */}
        <path d="M45 42 Q50 38 55 42 L55 48 Q50 50 45 48 Z" fill="#0f172a" opacity="0.95" />

        {/* Dark Sunglasses */}
        <path d="M26 36 C26 31 38 31 46 36 C45 44 34 47 28 42 Z" fill="url(#lensGrad)" stroke="#64748b" strokeWidth="1" strokeLinejoin="round" />
        <path d="M74 36 C74 31 62 31 54 36 C55 44 66 47 72 42 Z" fill="url(#lensGrad)" stroke="#64748b" strokeWidth="1" strokeLinejoin="round" />
        <path d="M44 34 L56 34" stroke="#475569" strokeWidth="1.5" />
        <path d="M30 33 L38 37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M58 33 L66 37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* White Safety Helmet */}
        <path d="M22 28 C22 10 32 6 50 6 C68 6 78 10 78 28 Z" fill="url(#helmetGrad)" />
        <path d="M16 28 C16 26 25 24 50 24 C75 24 84 26 84 28 C84 31 75 32 50 32 C25 32 16 31 16 28 Z" fill="#f8fafc" />
        <path d="M20 29 C20 29 35 31 50 31 C65 31 80 29 80 29 C80 29 70 33 50 33 C30 33 20 29 20 29 Z" fill="#cbd5e1" opacity="0.5" />

        {/* Helmet Yellow Side Stripes */}
        <path d="M24 20 C24 20 26 14 31 14 L34 21 Z" fill="#f59e0b" />
        <path d="M76 20 C76 20 74 14 69 14 L66 21 Z" fill="#f59e0b" />

        {/* Center Logo Design (Trapezoid & Yellow Triangle) */}
        <path d="M44 11 H56 L55 20 L50 22 L45 20 Z" fill="#1d4ed8" />
        <path d="M50 12 L47 19 L53 19 Z" fill="#fbbf24" />
        <rect x="36" y="21" width="28" height="2" rx="0.5" fill="#eab308" />
        <rect x="42" y="22.2" width="16" height="1" rx="0.2" fill="#fff" opacity="0.8" />
      </svg>
    </div>
  );
};


// Custom simple formatter for bold text styling **text** and lists
const formatResponseText = (text: string) => {
  if (!text) return '';
  
  // Split into lines
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let content: React.ReactNode = line;
    
    // Check if line starts with bullet point (* or -)
    const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
    let cleanLine = line;
    if (isBullet) {
      cleanLine = line.trim().substring(2);
    }
    
    // Regex replace for **bold**
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const formattedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="text-amber-300 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc text-slate-300 my-1 font-sans text-xs sm:text-sm leading-relaxed">
          {formattedParts}
        </li>
      );
    }

    return (
      <p key={idx} className="text-slate-300 font-sans text-xs sm:text-sm my-1.5 leading-relaxed min-h-[1rem]">
        {formattedParts}
      </p>
    );
  });
};

export const QnaBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo Rangers! Saya **AUTONOMIA AI**, asisten pribadi Anda. Tanyakan sesuatu kepada saya..',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: "Bagaimana cara meningkatkan Match Factor agar mendekati 1.0?", category: "Match Factor" },
    { text: "Bagaimana memantau delay Cek Bugar pada changeshift secara efektif?", category: "Delay Unit" },
    { text: "Apa dampak jarak angkut terhadap kapasitas produktivitas fleet?", category: "Jalur & Siklus" },
    { text: "Bagaimana menyusun form pelaporan kerusakan jalan tambang?", category: "Lapor Jalan" }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Keep only last 10 messages for context efficiency
      const historyToSend = [...messages, userMessage].slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch('/api/qna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: historyToSend })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem.');
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Koneksi gagal. Silahkan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Halo kembali! Saya **AUTONOMIA AI** siap membantu Anda menganalisis operasional fleet pertambangan Anda. Ada kendala produktivitas di lapangan hari ini?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-left shadow-xl backdrop-blur-md animate-fade-in font-sans flex flex-col h-[75vh]">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <AutonomiaAvatar size={42} className="shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-2 ring-amber-500/20" />
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wide text-slate-100 flex items-center gap-1.5 font-mono">
              AUTONOMIA AI <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-black tracking-widest font-mono">Assistant</span>
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Your Personal Assistant</p>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-900/60 border border-slate-800 hover:border-rose-500/30 transition-all duration-200 cursor-pointer"
          title="Reset Percakapan"
        >
          <TrashIcon className="h-3 w-3" />
          <span className="hidden sm:inline">Hapus Riwayat</span>
        </button>
      </div>

      {/* Main Chat Scroll Section */}
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 pb-2 select-text custom-scrollbar">
        {messages.map((message) => {
          const isBot = message.role === 'assistant';
          return (
            <div 
              key={message.id} 
              className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              {isBot ? (
                <AutonomiaAvatar size={34} className="ring-1 ring-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
              ) : (
                <div className="w-8.5 h-8.5 rounded-full shrink-0 flex items-center justify-center border font-mono text-[10px] font-bold bg-slate-950 text-indigo-400 border-slate-800">
                  OP
                </div>
              )}

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-2xl relative ${
                isBot 
                  ? 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-none' 
                  : 'bg-amber-500/10 border border-amber-500/20 text-slate-100 rounded-tr-none'
              }`}>
                <div className="space-y-1">
                  {formatResponseText(message.content)}
                </div>
                
                {/* Time log */}
                <span className="text-[8px] text-slate-500 font-mono block mt-1.5 text-right uppercase">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <AutonomiaAvatar size={34} className="ring-1 ring-amber-500/20" />
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-405 bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>AUTONOMIA AI sedang memikirkan solusi terbaik...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/25 border border-red-900/30 rounded-xl text-rose-450 text-xs text-rose-400 text-center font-mono py-2.5">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length === 1 && (
        <div className="space-y-1.5 shrink-0 border-t border-slate-800/20 pt-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <span className="w-1 h-2 rounded bg-amber-500" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-450 text-slate-400 font-bold">
              Pertanyaan Cepat:
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {suggestedQuestions.map((q, qidx) => (
              <button
                key={qidx}
                type="button"
                onClick={() => handleSendMessage(q.text)}
                className="shrink-0 px-3 py-1.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-850 hover:border-amber-500/30 rounded-full text-[10px] sm:text-xs text-slate-300 hover:text-amber-400 cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <span className="text-[8px] font-mono text-amber-500 font-black tracking-wider uppercase bg-amber-500/5 px-1 py-0.5 rounded">
                  {q.category}
                </span>
                <span className="font-medium max-w-[180px] sm:max-w-xs truncate">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex gap-2 shrink-0 border-t border-slate-800/40 pt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu pada AUTONOMIA AI..."
          className="flex-grow bg-slate-900/80 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/40 placeholder-slate-500 transition-all font-sans"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2.5 sm:px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          disabled={isLoading || !input.trim()}
        >
          <SendIcon className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-black uppercase font-mono tracking-wider">Kirim</span>
        </button>
      </form>
    </div>
  );
};
