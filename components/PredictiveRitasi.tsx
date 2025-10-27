import React from 'react';
import { ChartBarIcon } from './icons';

const Card: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => {
    const parts = value.split(' ');
    const number = parts[0];
    const unit = parts.slice(1).join(' ');

    return (
        <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/50 flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-sky-500/10 mr-3 sm:mr-4">
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


const PredictiveRitasi: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
            <Card title="Target Ritasi Harian" value="1,250 Rit" icon={<ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />} />
            <Card title="Prediksi Ritasi Hari Ini" value="1,198 Rit" icon={<ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />} />
        </div>
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Detail Konten</h2>
        <p className="text-slate-400">
          Konten untuk halaman "Predictive Ritasi" akan dijabarkan nanti.
          Area ini akan menampilkan model prediksi untuk jumlah ritasi (perjalanan angkut) harian.
        </p>
        <div className="mt-6 h-64 bg-slate-700/50 rounded-md flex items-center justify-center">
            <p className="text-slate-500">Placeholder untuk Grafik Prediksi</p>
        </div>
      </div>
    </div>
  );
};

export default PredictiveRitasi;