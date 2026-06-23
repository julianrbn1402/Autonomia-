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
    <defs>
      <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="25%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#fffbeb" />
        <stop offset="75%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      
      <linearGradient id="royalSapphire" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      
      <radialGradient id="royalGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
      </radialGradient>

      <filter id="royalShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <style>{`
      @keyframes ray-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes wing-breathe-left {
        0%, 100% { transform: translate(0px, 0px) scale(0.97) rotate(0deg); }
        50% { transform: translate(-2px, 0.5px) scale(1.03) rotate(-2deg); }
      }
      @keyframes wing-breathe-right {
        0%, 100% { transform: translate(0px, 0px) scale(0.97) rotate(0deg); }
        50% { transform: translate(2px, 0.5px) scale(1.03) rotate(2deg); }
      }
      @keyframes central-glow {
        0%, 100% { filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.5)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.2)); }
        50% { filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 4px rgba(251, 191, 36, 0.6)); }
      }
      @keyframes gear-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes gear-rotate-reverse {
        0% { transform: rotate(360deg); }
        100% { transform: rotate(0deg); }
      }
      .animate-rays {
        transform-origin: 32px 32px;
        animation: ray-rotate 32s linear infinite;
      }
      .animate-wing-left {
        transform-origin: 23px 34px;
        animation: wing-breathe-left 2.8s ease-in-out infinite;
      }
      .animate-wing-right {
        transform-origin: 41px 34px;
        animation: wing-breathe-right 2.8s ease-in-out infinite;
      }
      .animate-central-brain {
        animation: central-glow 2.5s ease-in-out infinite;
      }
      .animate-outer-gear {
        transform-origin: 32px 32px;
        animation: gear-rotate 45s linear infinite;
      }
      .animate-inner-gear {
        transform-origin: 32px 32px;
        animation: gear-rotate-reverse 25s linear infinite;
      }
    `}</style>
    
    {/* Outer luxury orbits */}
    <circle cx="32" cy="32" r="30" fill="none" stroke="url(#luxuryGold)" strokeWidth="0.75" opacity="0.6" strokeDasharray="5, 3" className="animate-outer-gear" />
    <circle cx="32" cy="32" r="27.5" fill="none" stroke="url(#luxuryGold)" strokeWidth="0.5" opacity="0.35" strokeDasharray="1, 5" className="animate-inner-gear" />
    
    {/* Ambient center glow */}
    <circle cx="32" cy="32" r="20" fill="url(#royalGlow)" pointerEvents="none" />

    {/* Golden rays rotating in background */}
    <g className="brain-ray-group animate-rays">
      <path d="M32 0 L 29.5 9.5 L 34.5 9.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M54.3 9.7 L 48.5 13.5 L 50.5 15.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M64 32 L 54.5 29.5 L 54.5 34.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M54.3 54.3 L 48.5 50.5 L 50.5 48.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M32 64 L 29.5 54.5 L 34.5 54.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M9.7 54.3 L 15.5 50.5 L 13.5 48.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M0 32 L 9.5 29.5 L 9.5 34.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
      <path d="M9.7 9.7 L 15.5 13.5 L 13.5 15.5 Z" fill="url(#luxuryGold)" opacity="0.85"/>
    </g>
    
    {/* Luxury glowing brain unit */}
    <g stroke="url(#luxuryGold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-central-brain">
        {/* Breathing Golden Wings */}
        <g className="brain-wing-left animate-wing-left">
            <path d="M23 26 C 11 27, 11 41, 23 42 L 17 34 Z" fill="url(#luxuryGold)" filter="url(#royalShadow)" />
        </g>
        
        <g className="brain-wing-right animate-wing-right">
             <path d="M41 26 C 53 27, 53 41, 41 42 L 47 34 Z" fill="url(#luxuryGold)" filter="url(#royalShadow)" />
        </g>
        
        {/* Core brain piece with deep midnight blue background and gold border */}
        <path d="M32,22 C26,22 23,28 23,34 C23,42 28,46 32,46 C36,46 41,42 41,34 C41,28 38,22 32,22 Z" fill="url(#royalSapphire)" stroke="url(#luxuryGold)" strokeWidth="2.5" filter="url(#royalShadow)" />
        <path d="M32,22 C34,28 34,32 32,46" stroke="url(#luxuryGold)" strokeWidth="1.5"/>
        <path d="M28,24 C30,30 29,36 28,44" stroke="url(#luxuryGold)" strokeWidth="1.25"/>
        <path d="M36,24 C34,30 35,36 36,44" stroke="url(#luxuryGold)" strokeWidth="1.25"/>
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
  colorClass: string;
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

    const sparkColorClasses = [
      'from-amber-400 to-amber-200', // Gold
      'from-yellow-300 to-amber-100', // Light Gold
      'from-white to-amber-300', // Bright Diamond Gold
      'from-amber-500 to-yellow-100', // Rich Amber
      'from-sky-400 to-yellow-200', // Elegant Sapphire Spark
    ];

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
        colorClass: sparkColorClasses[Math.floor(Math.random() * sparkColorClasses.length)],
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
    { id: 'stopwatch_cs', label: 'Multi Stopwatch', icon: HourglassIcon, desc: 'Stopwatch Serbaguna' },
    { id: 'referensi', label: 'Referensi', icon: BookOpenIcon, desc: 'Pedoman Formula & Petunjuk' },
    { id: 'about', label: 'About this Tools', icon: LightbulbIcon, desc: 'Latar Belakang & Manfaat Aplikasi' },
  ] as const;

  const getLabel = (id: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about') => {
    if (id === 'about') return 'About this Tools';
    if (id === 'stopwatch_cs') return 'Multi Stopwatch';
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
              135deg,
              #b45309 0%,
              #fbbf24 25%,
              #fffbeb 50%,
              #f59e0b 75%,
              #b45309 100%
            );
            background-size: 200% auto;
            animation: gold-metallic-shimmer 3.5s ease-in-out infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.45)) drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.3));
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
              className="flex items-center justify-center gap-3 w-full sm:w-auto relative overflow-visible cursor-pointer select-none group px-3 py-1.5 rounded-xl border border-transparent hover:border-amber-500/10 hover:bg-amber-500/[0.02] transition-all duration-500"
            >
              {/* Luxury ambient radial backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md pointer-events-none" />

              {/* Sparks render area */}
              {sparks.map((spark) => (
                <span
                  key={spark.id}
                  className={`absolute pointer-events-none rounded-full bg-gradient-to-r ${spark.colorClass || 'from-amber-400 to-amber-300'} animate-spark shadow-[0_0_8px_rgba(245,158,11,0.8)]`}
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

              <AnimatedBrainIcon size={38} className="shrink-0 transition-transform duration-500 group-hover:scale-115 group-hover:rotate-12 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]" />
              
              <div className="text-center flex flex-col items-center relative z-10">
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-black tracking-[0.24em] font-mono leading-none animate-gold-shimmer transition-transform duration-300 group-hover:scale-105">
                    AUTONOMIA!
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] tracking-widest font-black uppercase rounded bg-gradient-to-r from-amber-500/10 to-yellow-500/15 text-amber-400 border border-amber-500/30 leading-none shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                    PRO
                  </span>
                </div>
                <div className="animate-marquee-container mt-0.5">
                  <span className="animate-marquee-text text-[10px] italic text-slate-400 font-sans tracking-wide leading-none group-hover:text-amber-200/80 transition-colors">
                    Autonomous Learning for Operational Excellence
                  </span>
                </div>
              </div>

              <AnimatedBrainIcon size={38} className="shrink-0 transition-transform duration-500 group-hover:scale-115 group-hover:-rotate-12 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]" />
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
          {/* Symmetrical Logo Frame - Luxury glassmorphic golden plaque */}
          <div 
            onMouseDown={handleTriggerSparks}
            onMouseEnter={handleTriggerSparks}
            className="flex flex-col items-center gap-2 border border-slate-800/40 bg-gradient-to-b from-amber-500/[0.02] to-slate-950/30 rounded-2xl p-5 relative overflow-hidden cursor-pointer select-none group transition-all duration-700 hover:border-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]"
          >
            {/* Elegant luxury ambient radial aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />

            {/* Sparks render area */}
            {sparks.map((spark) => (
              <span
                key={spark.id}
                className={`absolute pointer-events-none rounded-full bg-gradient-to-r ${spark.colorClass || 'from-amber-400 to-amber-300'} animate-spark shadow-[0_0_8px_rgba(245,158,11,0.8)]`}
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

            <div className="flex items-center justify-center gap-3 relative z-10">
              <AnimatedBrainIcon size={36} className="shrink-0 transition-transform duration-500 group-hover:scale-115 group-hover:rotate-12 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]" />
              <h1 className="text-xl font-black tracking-[0.24em] font-mono leading-none animate-gold-shimmer transition-transform duration-300 group-hover:scale-105">
                AUTONOMIA!
              </h1>
            </div>
            
            <span className="px-2.5 py-0.5 text-[8px] tracking-widest font-black uppercase rounded bg-gradient-to-r from-amber-500/10 to-yellow-500/15 text-amber-500 border border-amber-500/20 leading-none flex items-center gap-1.5 transition-all duration-300 group-hover:border-amber-400/40 group-hover:text-amber-400 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.15)] relative z-10 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              OPERATIONS ROOM PRO
            </span>
            
            <p className="text-[10px] italic text-slate-400 text-center font-sans tracking-wide leading-relaxed max-w-[210px] transition-colors group-hover:text-amber-100/70 relative z-10 -mt-0.5">
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