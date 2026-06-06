
import React from 'react';
import CycleTime from './CycleTime';

interface MainContentProps {
  activeTab: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about';
  setActiveTab: (tab: 'observasi' | 'prestasi' | 'delay' | 'lapor_jalan' | 'referensi' | 'stopwatch_cs' | 'about') => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
        <CycleTime activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainContent;
