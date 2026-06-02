import React from 'react';
import { RouteIcon, ChartBarIcon, BookOpenIcon } from './icons';

const AnimatedBrainIcon: React.FC = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className="text-amber-500"
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
  activeTab: 'observasi' | 'prestasi' | 'referensi';
  setActiveTab: (tab: 'observasi' | 'prestasi' | 'referensi') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-20 backdrop-blur-sm">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-0 md:h-20 gap-4 md:gap-0">
          <div className="flex items-center">
            <AnimatedBrainIcon />
            <div className="ml-3">
                <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
                  AUTONOMIA!
                </h1>
                <p className="text-xs italic text-slate-400 -mt-1">Autonomous Learning for Operational Excellence</p>
            </div>
          </div>

          <div className="flex items-center w-full md:w-auto justify-center md:justify-end">
            <div className="inline-flex p-1 bg-slate-950/60 border border-slate-700/30 rounded-xl shadow-inner gap-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('observasi')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 sm:px-5 sm:py-2 font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'observasi'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <RouteIcon className="h-4 w-4 shrink-0" />
                <span>Observasi</span>
              </button>
              <button
                onClick={() => setActiveTab('prestasi')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 sm:px-5 sm:py-2 font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'prestasi'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 shrink-0" />
                <span>Prestasi</span>
              </button>
              <button
                onClick={() => setActiveTab('referensi')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 sm:px-5 sm:py-2 font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'referensi'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpenIcon className="h-4 w-4 shrink-0" />
                <span>Referensi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;