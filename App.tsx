import React, { useState } from 'react';
import Header from './components/Sidebar';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'qna' | 'stopwatch_cs' | 'about'>('observasi');

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col lg:flex-row">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow flex flex-col lg:pl-72">
        <main className="flex-grow">
          <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
        <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-700/50 lg:hidden">
          &copy; 2025 by Julian Robin
        </footer>
      </div>
    </div>
  );
};

export default App;