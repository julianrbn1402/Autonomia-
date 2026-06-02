
import React from 'react';
import CycleTime from './CycleTime';

interface MainContentProps {
  activeTab: 'observasi' | 'prestasi' | 'delay' | 'referensi';
  setActiveTab: (tab: 'observasi' | 'prestasi' | 'delay' | 'referensi') => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
        <CycleTime activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default MainContent;
