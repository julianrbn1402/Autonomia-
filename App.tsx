import React from 'react';
import Header from './components/Sidebar';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header />
      <main className="flex-grow">
        <MainContent />
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-700/50">
        &copy; 2025 by Julian Robin
      </footer>
    </div>
  );
};

export default App;