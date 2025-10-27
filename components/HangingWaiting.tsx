import React from 'react';
import { HourglassIcon } from './icons';

const Card: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => {
    const parts = value.split(' ');
    const number = parts[0];
    const unit = parts.slice(1).join(' ');

    return (
        <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/50 flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-orange-500/10 mr-3 sm:mr-4">
                {icon}
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{title}</p>
                <p className="text-base sm:text-lg font-bold text-slate-100 break-words">
                    <span>{number}</span>
                    {unit && <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-1">{unit}</span>}
                </p>
            </div>
        </div>
    );
};

const HangingWaiting: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
            <Card title="Plan Waiting Time" value="5.1 Menit" icon={<HourglassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />} />
            <Card title="Aktual Waiting Time" value="6.3 Menit" icon={<HourglassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />} />
        </div>
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Detail Konten</h2>
        <p className="text-slate-400">
          Konten untuk halaman "Hanging dan Waiting HD by Plan vs Aktual" akan dijabarkan nanti.
          Area ini akan menampilkan data terkait waktu tunggu dan hambatan operasional.
        </p>
         <div className="mt-6 h-64 bg-slate-700/50 rounded-md flex items-center justify-center">
            <p className="text-slate-500">Placeholder untuk Analisis Waktu Tunggu</p>
        </div>
      </div>
    </div>
  );
};

export default HangingWaiting;