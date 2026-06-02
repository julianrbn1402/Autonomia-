import React from 'react';
import { RouteIcon, ChartBarIcon, BookOpenIcon, TimerIcon } from './icons';

const AnimatedBrainIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-amber-500 ${className || ''}`}
    aria-hidden="true"
  >
    <g className="brain-ray-group">
      <path d="M32 0 L 30 10 L 34 10 Z" fill="currentColor" opacity="0.8"/>
      <path d="M54.3 9.7 L 49.5 14.5 L 51.5 16.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M64 32 L 54 30 L 54 34 Z" fill="currentColor" opacity="0.8"/>
      <path d="M54.3 54.3 L 49.5 49.5 L 51.5 47.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M32 64 L 30 54 L 34 54 Z" fill="currentColor" opacity="0.8"/>
      <path d="M9.7 54.3 L 14.5 49.5 L 12.5 47.5 Z" fill="currentColor" opacity="0.8"/>
      <path d="M0 32 L 10 30 L 10 34 Z" fill="currentColor" opacity="0.8"/>
      <path d="M9.7 9.7 L 14.5 14.5 L 12.5 16.5 Z" fill="currentColor" opacity="0.8"/>
    </g>
    
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Wing */}
        <g className="brain-wing-left">
            <path d="M23 26 C 12 28, 12 40, 23 42 L 18 34 Z" fill="currentColor" />
        </g>
        
        {/* Right Wing */}
        <g className="brain-wing-right">
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


interface HeaderProps {
  activeTab: 'observasi' | 'prestasi' | 'delay' | 'referensi';
  setActiveTab: (tab: 'observasi' | 'prestasi' | 'delay' | 'referensi') => void;
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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
    { id: 'referensi', label: 'Referensi', icon: BookOpenIcon, desc: 'Pedoman Formula & Petunjuk' },
  ] as const;

  const getLabel = (id: 'observasi' | 'prestasi' | 'delay' | 'referensi') => {
    if (id === 'delay') return 'Delay Cek Bugar';
    if (id === 'observasi') return 'Observasi';
    if (id === 'prestasi') return 'Prestasi';
    return 'Referensi';
  };

  const getIcon = (id: 'observasi' | 'prestasi' | 'delay' | 'referensi') => {
    if (id === 'observasi') return RouteIcon;
    if (id === 'prestasi') return ChartBarIcon;
    if (id === 'delay') return TimerIcon;
    return BookOpenIcon;
  };

  const ActiveIcon = getIcon(activeTab);

  return (
    <header className="bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md shadow-lg shadow-slate-950/10">
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
        .animate-autonomia {
          background-size: 200% auto;
          animation: gradient-shift 4s ease infinite, subtle-bounce 3s ease-in-out infinite;
          display: inline-block;
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
      `}</style>
      <div className="mx-auto px-4 py-2 sm:px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo Brand: Centered brand text framed by logo iconography on both sides symmetrically */}
          <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
            <AnimatedBrainIcon size={38} className="shrink-0" />
            
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-[0.22em] font-mono bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent leading-none animate-autonomia">
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

            <AnimatedBrainIcon size={38} className="shrink-0" />
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
  );
};

export default Header;