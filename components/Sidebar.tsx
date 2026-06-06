import React from 'react';
import { RouteIcon, ChartBarIcon, BookOpenIcon, TimerIcon, HourglassIcon, LightbulbIcon, ClipboardIcon } from './icons';

const AnimatedBrainIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-amber-500 ${className || ''}`}
    aria-hidden="true"
  >
    <style>{`
      @keyframes ray-rotate {
        0% { transform: rotate(0deg); }
        105% { transform: rotate(360deg); }
      }
      @keyframes wing-breathe-left {
        0%, 100% { transform: translate(0px, 0px) scale(0.98); }
        55% { transform: translate(-1.5px, 0px) scale(1.02); }
      }
      @keyframes wing-breathe-right {
        0%, 100% { transform: translate(0px, 0px) scale(0.98); }
        55% { transform: translate(1.5px, 0px) scale(1.02); }
      }
      @keyframes central-glow {
        0%, 100% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4)); }
        50% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.85)); }
      }
      .animate-rays {
        transform-origin: 32px 32px;
        animation: ray-rotate 28s linear infinite;
      }
      .animate-wing-left {
        transform-origin: 23px 34px;
        animation: wing-breathe-left 2.5s ease-in-out infinite;
      }
      .animate-wing-right {
        transform-origin: 41px 34px;
        animation: wing-breathe-right 2.5s ease-in-out infinite;
      }
      .animate-central-brain {
        animation: central-glow 3s ease-in-out infinite;
      }
    `}</style>
    <g className="brain-ray-group animate-rays">
      <path d="M32 0 L 30 10 L 34 10 Z" fill="currentColor" opacity="0.8"/>
      <path d="M54.3 9.7 L 49.5 14.5 L 51.5 16.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M64 32 L 54 30 L 54 34 Z" fill="currentColor" opacity="0.8"/>
      <path d="M54.3 54.3 L 49.5 49.5 L 51.5 47.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M32 64 L 30 54 L 34 54 Z" fill="currentColor" opacity="0.8"/>
      <path d="M9.7 54.3 L 14.5 49.5 L 12.5 47.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M0 32 L 10 30 L 10 34 Z" fill="currentColor" opacity="0.8"/>
      <path d="M9.7 9.7 L 14.5 14.5 L 12.5 16.5 Z" fill="currentColor" opacity="0.8"/>
    </g>
    
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-central-brain">
        {/* Left Wing */}
        <g className="brain-wing-left animate-wing-left">
            <path d="M23 26 C 12 28, 12 40, 23 42 L 18 34 Z" fill="currentColor" />
        </g>
        
        {/* Right Wing */}
        <g className="brain-wing-right animate-wing-right">
             <path d="M41 26 C 52 28, 52 40, 41 42 L 46 34 Z" fill="currentColor" />
        </g>
        
        {/* Brain */}
        <path d="M32,22 C26,22 23,28 23,34 C23,42 28,46 32,46 C36,46 41,42 41,34 C41,28 38,22 32,22 Z" fill="#1e293b" strokeWidth="2.5" />
        <path d="M32,22 C34,28 34,32 32,46" strokeWidth="1.5"/>
        <path d="M28,24 C30,30 29,36 28,44" strokeWidth="1.5"/>
        <path d="M36,24 C34,30 35,36 36,44" strokeWidth="1.5"/>
    </g>
  </svg>
);

interface Spark {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  size: number;
}


interface HeaderProps {
  activeTab: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about';
  setActiveTab: (tab: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about') => void;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [sparks, setSparks] = React.useState<Spark[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleTriggerSparks = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isClick = e.type === 'click' || e.type === 'mousedown';
    const count = isClick ? 14 : 4; // click gets 14 sparks, hover gets 4 sparks

    const newSparks = Array.from({ length: count }).map((_, i) => {
      const angle = (i * (360 / count) + Math.random() * 25) * (Math.PI / 180);
      const intensity = isClick ? 80 : 40;
      const distance = 20 + Math.random() * intensity;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      return {
        id: Math.random() + Date.now() + i,
        x,
        y,
        tx,
        ty,
        rot: Math.random() * 360,
        size: isClick ? (3 + Math.random() * 6) : (2 + Math.random() * 3),
      };
    });

    setSparks((prev) => [...prev, ...newSparks].slice(-60));
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 'observasi', label: 'Observasi', icon: RouteIcon, desc: 'Pencatatan & Analisis Cycle Time' },
    { id: 'prestasi', label: 'Prestasi', icon: ChartBarIcon, desc: 'Evaluasi Produktivitas & Target' },
    { id: 'delay', label: 'Delay Cek Bugar', icon: TimerIcon, desc: 'Cek Bugar & Monitoring Idle Unit' },
    { id: 'lapor_jalan', label: 'Lapor Jalan', icon: ClipboardIcon, desc: 'Form Pelaporan Kondisi & Kerusakan Jalan' },
    { id: 'stopwatch_cs', label: 'Stopwatch CS Loader', icon: HourglassIcon, desc: 'Stopwatch & Unit Loader delay CS' },
    { id: 'referensi', label: 'Referensi', icon: BookOpenIcon, desc: 'Pedoman Formula & Petunjuk' },
    { id: 'about', label: 'About this Tools', icon: LightbulbIcon, desc: 'Latar Belakang & Manfaat Aplikasi' },
  ] as const;

  const getLabel = (id: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about') => {
    if (id === 'about') return 'About this Tools';
    if (id === 'stopwatch_cs') return 'Stopwatch CS Loader';
    if (id === 'delay') return 'Delay Cek Bugar';
    if (id === 'lapor_jalan') return 'Lapor Jalan';
    if (id === 'observasi') return 'Observasi';
    if (id === 'prestasi') return 'Prestasi';
    return 'Referensi';
  };

  const getIcon = (id: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about') => {
    if (id === 'about') return LightbulbIcon;
    if (id === 'stopwatch_cs') return HourglassIcon;
    if (id === 'observasi') return RouteIcon;
    if (id === 'prestasi') return ChartBarIcon;
    if (id === 'delay') return TimerIcon;
    if (id === 'lapor_jalan') return ClipboardIcon;
    return BookOpenIcon;
  };

  const ActiveIcon = getIcon(activeTab);

  return (
    <>
      {/* Mobile Top Header (100% Unchanged on Mobile for safety) */}
      <header className="lg:hidden bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md shadow-lg shadow-slate-950/10">
        <style>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes subtle-bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-1.5px) scale(1.02); }
          }
          @keyframes marquee-horizontal {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes gold-metallic-shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-autonomia {
            background-size: 200% auto;
            animation: gradient-shift 4s ease infinite, subtle-bounce 3s ease-in-out infinite;
            display: inline-block;
          }
          .animate-gold-shimmer {
            background: linear-gradient(
              120deg,
              #fdba74 0%,
              #fbbf24 25%,
              #fffbeb 50%,
              #fbbf24 75%,
              #fdba74 100%
            );
            background-size: 200% auto;
            animation: gold-metallic-shimmer 3s linear infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .animate-marquee-container {
            width: 220px;
            overflow: hidden;
            position: relative;
            mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          }
          @media (min-width: 640px) {
            .animate-marquee-container {
              width: 260px;
            }
          }
          .animate-marquee-text {
            display: inline-block;
            white-space: nowrap;
            animation: marquee-horizontal 12s linear infinite;
          }
          .animate-marquee-container:hover .animate-marquee-text {
            animation-play-state: paused;
          }
          @keyframes spark-float {
            0% {
              transform: translate(0, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
              opacity: 0;
            }
          }
          .animate-spark {
            animation: spark-float 1.0s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
          }
        `}</style>
        <div className="mx-auto px-4 py-2 sm:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Logo Brand: Centered brand text framed by logo iconography on both sides symmetrically */}
            <div 
              onMouseDown={handleTriggerSparks}
              onMouseEnter={handleTriggerSparks}
              className="flex items-center justify-center gap-3 w-full sm:w-auto relative overflow-visible cursor-pointer select-none group"
            >
              {/* Sparks render area */}
              {sparks.map((spark) => (
                <span
                  key={spark.id}
                  className="absolute pointer-events-none rounded-full bg-gradient-to-r from-amber-400 to-amber-300 animate-spark shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{
                    left: spark.x,
                    top: spark.y,
                    width: spark.size,
                    height: spark.size,
                    '--tx': `${spark.tx}px`,
                    '--ty': `${spark.ty}px`,
                    '--rot': `${spark.rot}deg`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50,
                  } as React.CSSProperties}
                />
              ))}

              <AnimatedBrainIcon size={38} className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-black tracking-[0.22em] font-mono leading-none animate-gold-shimmer transition-transform duration-300 group-hover:scale-102">
                    AUTONOMIA!
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] tracking-widest font-black uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 leading-none">
                    PRO
                  </span>
                </div>
                <div className="animate-marquee-container mt-1">
                  <span className="animate-marquee-text text-[10px] italic text-slate-400 font-sans tracking-wide leading-none">
                    Autonomous Learning for Operational Excellence
                  </span>
                </div>
              </div>

              <AnimatedBrainIcon size={38} className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
            </div>

            {/* Centered/Right-aligned Dropdown Menu Selector (Scroll Down Style) */}
            <div ref={dropdownRef} className="relative w-full sm:w-[260px] z-40">
              
              {/* The Select/Trigger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-950/80 border rounded-lg shadow-md transition-all duration-300 select-none cursor-pointer group ${
                  isOpen 
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/5' 
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
                id="menu-trigger-button"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded transition-colors duration-200 ${isOpen ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-amber-500'}`}>
                    <ActiveIcon className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="block text-[7px] uppercase tracking-wider font-bold text-slate-500 leading-none" style={{ fontSize: '7px' }}>Menu Navigasi</span>
                    <span className="block text-xs font-bold text-slate-200 tracking-wide group-hover:text-amber-400 transition-colors mt-0.5 leading-none">
                      {getLabel(activeTab)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-slate-400 bg-slate-900 border border-slate-800 px-1 py-0.5 rounded font-mono font-medium hidden sm:inline leading-none">
                    MENU
                  </span>
                  <ChevronDownIcon 
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180 text-amber-500' : 'group-hover:text-slate-300'
                    }`} 
                  />
                </div>
              </button>

              {/* Dropdown Menu List: "Scroll Down" Animated Panel */}
              <div 
                className={`absolute top-full left-0 right-0 mt-1.5 bg-slate-950/95 border border-slate-850 rounded-lg shadow-2xl z-50 backdrop-blur-md overflow-hidden transition-all duration-300 ease-out origin-top ${
                  isOpen 
                    ? 'opacity-100 scale-y-100 max-h-[350px] visible' 
                    : 'opacity-0 scale-y-95 max-h-0 invisible'
                }`}
                style={{ transitionProperty: 'opacity, transform, max-height, visibility' }}
                id="menu-dropdown-list"
              >
                <div className="p-1 space-y-0.5 font-sans">
                  {menuItems.map((item) => {
                    const ItemIcon = item.icon;
                    const itemTabId = item.id;
                    const isSelected = itemTabId === activeTab;
                    const labelStr = itemTabId === 'delay' ? 'Delay Cek Bugar' : item.label;
                    return (
                      <button
                        key={itemTabId}
                        onClick={() => {
                          setActiveTab(itemTabId);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-slate-950 text-amber-500' : 'bg-slate-900 text-slate-400'}`}>
                            <ItemIcon className="h-3.5 w-3.5 shrink-0" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold leading-none">{labelStr}</span>
                            <span className={`block text-[9px] mt-0.5 font-normal leading-tight ${isSelected ? 'text-slate-900/80' : 'text-slate-500'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="h-1 w-1 rounded-full bg-slate-950 animate-pulse mr-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* PC Left Navigation Sidebar (Extremely polished, executive design for desktop viewports) */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-72 bg-slate-950/70 border-r border-slate-800/60 z-30 backdrop-blur-md p-6 justify-between select-none font-sans overflow-y-auto">
        <div className="space-y-6">
          {/* Symmetrical Logo Frame */}
          <div 
            onMouseDown={handleTriggerSparks}
            onMouseEnter={handleTriggerSparks}
            className="flex flex-col items-center gap-3 border-b border-slate-800/50 pb-5 relative overflow-visible cursor-pointer select-none group"
          >
            {/* Sparks render area */}
            {sparks.map((spark) => (
              <span
                key={spark.id}
                className="absolute pointer-events-none rounded-full bg-gradient-to-r from-amber-400 to-amber-300 animate-spark shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                style={{
                  left: spark.x,
                  top: spark.y,
                  width: spark.size,
                  height: spark.size,
                  '--tx': `${spark.tx}px`,
                  '--ty': `${spark.ty}px`,
                  '--rot': `${spark.rot}deg`,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50,
                } as React.CSSProperties}
              />
            ))}

            <div className="flex items-center justify-center gap-3">
              <AnimatedBrainIcon size={34} className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h1 className="text-xl font-black tracking-[0.22em] font-mono leading-none animate-gold-shimmer transition-transform duration-300 group-hover:scale-105">
                AUTONOMIA!
              </h1>
            </div>
            
            <span className="px-2 py-0.5 text-[8.5px] tracking-widest font-black uppercase rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 leading-none flex items-center gap-1.5 transition-colors group-hover:border-amber-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              OPERATIONS ROOM PRO
            </span>
            
            <p className="text-[10px] italic text-slate-400 text-center font-sans tracking-wide leading-relaxed max-w-[210px] transition-colors group-hover:text-slate-300">
              Autonomous Learning for Operational Excellence
            </p>
          </div>

          {/* Navigation Items list */}
          <div className="space-y-2">
            <span className="text-[8.5px] font-mono tracking-widest uppercase font-black text-slate-500 block mb-2 px-1">
              Main Control Menu
            </span>
            
            {menuItems.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = item.id === activeTab;
              const labelStr = item.id === 'delay' ? 'Delay Cek Bugar' : item.label;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-left transition-all duration-200 group relative border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold shadow-md shadow-amber-500/5'
                      : 'text-slate-400 border-transparent hover:text-slate-100 hover:bg-slate-900/40 hover:border-slate-800/60'
                  }`}
                >
                  {/* Selected Indicator Light Bar */}
                  {isSelected && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r-md animate-fade-in" />
                  )}
                  
                  <div className={`p-2 rounded-lg transition-all duration-150 ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25' 
                      : 'bg-slate-900/80 text-slate-400 group-hover:text-amber-500'
                  }`}>
                    <ItemIcon className="h-4 w-4 shrink-0" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <span className="block text-xs font-bold leading-none truncate">{labelStr}</span>
                    <span className={`block text-[9px] font-normal leading-tight mt-1 truncate transition-colors ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info in PC Sidebar */}
        <div className="border-t border-slate-800/60 pt-4 mt-6 space-y-2">
          <div className="bg-slate-900/30 rounded-lg p-2.5 border border-slate-900 text-center">
            <span className="text-[7.5px] font-mono tracking-wide text-slate-500 block uppercase font-bold text-center">
              Current Session Active
            </span>
            <span className="text-[9.5px] font-semibold text-slate-300 font-mono block mt-1 text-center">
              Sat, June 6, 2026 UTC
            </span>
          </div>
          <p className="text-[9px] text-slate-600 text-center font-mono leading-none">
            &copy; 2025 by Julian Robin
          </p>
        </div>
      </aside>
    </>
  );
};

export default Header;