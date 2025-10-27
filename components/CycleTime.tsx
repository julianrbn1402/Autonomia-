import React, { useState, useEffect } from 'react';
import { ClockIcon, HourglassIcon, ChartBarIcon, GearIcon, RouteIcon, MiningTruckIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon } from './icons';

type Status = 'good' | 'bad' | 'neutral';

const Card: React.FC<{
    title: string;
    value: string;
    icon?: React.ReactNode;
    status?: Status;
    align?: 'left' | 'center';
}> = ({ title, value, icon, status, align = 'left' }) => {
    const parts = value.split(' ');
    const number = parts[0];
    const unit = parts.slice(1).join(' ');

    // Specifically reduce unit font size for productivity cards which have long units
    const isProductivityCard = title.includes('Productivity');
    const unitClassName = isProductivityCard
        ? "text-[8px] sm:text-[10px] font-normal text-slate-400 ml-1"
        : "text-[10px] sm:text-xs font-normal text-slate-400 ml-1";

    const isCentered = align === 'center';
    const containerClasses = `bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700/50 flex items-center ${isCentered ? 'justify-center' : ''}`;
    const textContainerClasses = isCentered ? `overflow-hidden ${!icon ? 'text-center' : ''}` : 'flex-grow overflow-hidden';

    return (
        <div className={containerClasses}>
            {icon && (
                <div className="p-2 sm:p-3 rounded-full bg-amber-500/10 mr-3 sm:mr-4">
                    {icon}
                </div>
            )}
            <div className={textContainerClasses}>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{title}</p>
                <div className={`flex items-baseline gap-2 ${isCentered && !icon ? 'justify-center' : ''}`}>
                    <p className="text-base sm:text-lg font-bold text-slate-100 break-words">
                        <span>{number}</span>
                        {unit && <span className={unitClassName}>{unit}</span>}
                    </p>
                    {status === 'good' && <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />}
                    {status === 'bad' && <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />}
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit: string;
}> = ({ id, label, value, onChange, unit }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
        <div className="relative">
            <input
                type="text"
                inputMode="decimal"
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-3 pr-16 text-slate-200 focus:ring-amber-500 focus:border-amber-500 transition appearance-none"
                placeholder="0"
                aria-label={label}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 text-sm" aria-hidden="true">{unit}</span>
        </div>
    </div>
);

const SuggestionsBox: React.FC<{ suggestions: string[] }> = ({ suggestions }) => {
    if (suggestions.length === 0) {
        return null; // Don't render if there are no suggestions yet
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
                <LightbulbIcon className="h-6 w-6 text-yellow-400 mr-3" />
                Keterangan
            </h2>
            <ul className="space-y-3 list-disc list-inside text-slate-300">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};

const planSpeedData = [
    { distance: 0.1, speed: 14.31 }, { distance: 0.2, speed: 15.37 },
    { distance: 0.3, speed: 16.43 }, { distance: 0.4, speed: 17.49 },
    { distance: 0.5, speed: 18.55 }, { distance: 0.6, speed: 19.61 },
    { distance: 0.7, speed: 20.49 }, { distance: 0.8, speed: 21.17 },
    { distance: 0.9, speed: 21.72 }, { distance: 1.0, speed: 22.20 },
    { distance: 1.1, speed: 22.65 }, { distance: 1.2, speed: 23.02 },
    { distance: 1.3, speed: 23.34 }, { distance: 1.4, speed: 23.63 },
    { distance: 1.5, speed: 23.88 }, { distance: 1.6, speed: 24.13 },
    { distance: 1.7, speed: 24.33 }, { distance: 1.8, speed: 24.51 },
    { distance: 1.9, speed: 24.67 }, { distance: 2.0, speed: 24.82 },
    { distance: 2.1, speed: 24.96 }, { distance: 2.2, speed: 25.08 },
    { distance: 2.3, speed: 25.20 }, { distance: 2.4, speed: 25.31 },
    { distance: 2.5, speed: 25.14 }, { distance: 2.6, speed: 25.19 },
    { distance: 2.7, speed: 25.29 }, { distance: 2.8, speed: 25.36 },
    { distance: 2.9, speed: 25.04 }, { distance: 3.0, speed: 25.14 },
    { distance: 3.1, speed: 25.17 }, { distance: 3.2, speed: 25.24 },
    { distance: 3.3, speed: 25.31 }, { distance: 3.4, speed: 25.36 },
    { distance: 3.5, speed: 25.41 }, { distance: 3.6, speed: 25.47 },
    { distance: 3.7, speed: 25.51 }, { distance: 3.8, speed: 25.56 },
    { distance: 3.9, speed: 25.58 }, { distance: 4.0, speed: 25.62 },
    { distance: 4.1, speed: 25.70 }, { distance: 4.2, speed: 25.71 },
    { distance: 4.3, speed: 25.73 }, { distance: 4.4, speed: 25.76 },
    { distance: 4.5, speed: 25.80 }, { distance: 4.6, speed: 25.85 },
    { distance: 4.7, speed: 25.85 }, { distance: 4.8, speed: 25.89 },
    { distance: 4.9, speed: 25.93 }, { distance: 5.0, speed: 25.94 },
    { distance: 5.1, speed: 25.97 }, { distance: 5.2, speed: 25.99 },
    { distance: 5.3, speed: 26.02 }, { distance: 5.4, speed: 26.04 },
    { distance: 5.5, speed: 26.04 }, { distance: 5.6, speed: 26.08 },
    { distance: 5.7, speed: 26.12 }, { distance: 5.8, speed: 26.11 },
    { distance: 5.9, speed: 26.12 }, { distance: 6.0, speed: 26.14 },
    { distance: 6.1, speed: 26.16 }, { distance: 6.2, speed: 26.19 },
    { distance: 6.3, speed: 26.20 }, { distance: 6.4, speed: 26.21 },
    { distance: 6.5, speed: 26.24 }, { distance: 6.6, speed: 26.24 },
    { distance: 6.7, speed: 26.26 }, { distance: 6.8, speed: 26.27 },
    { distance: 6.9, speed: 26.28 }, { distance: 7.0, speed: 26.29 },
    { distance: 7.1, speed: 26.30 }, { distance: 7.2, speed: 26.31 },
    { distance: 7.3, speed: 26.35 }, { distance: 7.4, speed: 26.34 },
    { distance: 7.5, speed: 26.34 }, { distance: 7.6, speed: 26.36 },
    { distance: 7.7, speed: 26.37 }, { distance: 7.8, speed: 26.39 },
    { distance: 7.9, speed: 26.40 }, { distance: 8.0, speed: 26.39 },
    { distance: 8.1, speed: 26.41 }, { distance: 8.2, speed: 26.42 },
    { distance: 8.3, speed: 26.43 }, { distance: 8.4, speed: 26.44 },
    { distance: 8.6, speed: 26.45 }, { distance: 8.7, speed: 26.46 },
    { distance: 8.8, speed: 26.46 }, { distance: 8.9, speed: 26.47 },
    { distance: 9.0, speed: 26.47 }, { distance: 9.1, speed: 26.48 },
    { distance: 9.2, speed: 26.48 }, { distance: 9.3, speed: 26.49 },
    { distance: 9.4, speed: 26.49 }, { distance: 9.5, speed: 26.50 },
    { distance: 9.6, speed: 26.52 }, { distance: 9.7, speed: 26.52 },
    { distance: 9.8, speed: 26.52 }, { distance: 9.9, speed: 26.52 },
    { distance: 10.0, speed: 26.53 },
];

const getPlanSpeed = (distance: number): number => {
    if (distance <= 0) return 0;
    for (const item of planSpeedData) {
        if (distance <= item.distance) {
            return item.speed;
        }
    }
    // For distances greater than the max in our table, return the last speed
    if (planSpeedData.length > 0) {
        return planSpeedData[planSpeedData.length - 1].speed;
    }
    return 0;
};

const planSpeedTableData = planSpeedData.map(item => ({
    range: item.distance.toFixed(1),
    speed: item.speed,
}));


const productivityConversionData = [
    { distance: 0.2, conversion: 2.160 }, { distance: 0.3, conversion: 1.830 },
    { distance: 0.4, conversion: 1.600 }, { distance: 0.5, conversion: 1.482 },
    { distance: 0.6, conversion: 1.320 }, { distance: 0.7, conversion: 1.231 },
    { distance: 0.8, conversion: 1.140 }, { distance: 0.9, conversion: 1.064 },
    { distance: 1.0, conversion: 1.000 }, { distance: 1.1, conversion: 0.945 },
    { distance: 1.2, conversion: 0.898 }, { distance: 1.3, conversion: 0.856 },
    { distance: 1.4, conversion: 0.820 }, { distance: 1.5, conversion: 0.787 },
    { distance: 1.6, conversion: 0.758 }, { distance: 1.7, conversion: 0.732 },
    { distance: 1.8, conversion: 0.708 }, { distance: 1.9, conversion: 0.687 },
    { distance: 2.0, conversion: 0.667 }, { distance: 2.1, conversion: 0.649 },
    { distance: 2.2, conversion: 0.632 }, { distance: 2.3, conversion: 0.617 },
    { distance: 2.4, conversion: 0.603 }, { distance: 2.5, conversion: 0.590 },
    { distance: 2.6, conversion: 0.578 }, { distance: 2.7, conversion: 0.566 },
    { distance: 2.8, conversion: 0.555 }, { distance: 2.9, conversion: 0.545 },
    { distance: 3.0, conversion: 0.536 }, { distance: 3.1, conversion: 0.527 },
    { distance: 3.2, conversion: 0.519 }, { distance: 3.3, conversion: 0.511 },
    { distance: 3.4, conversion: 0.504 }, { distance: 3.5, conversion: 0.497 },
    { distance: 3.6, conversion: 0.490 }, { distance: 3.7, conversion: 0.483 },
    { distance: 3.8, conversion: 0.477 }, { distance: 3.9, conversion: 0.469 },
    { distance: 4.0, conversion: 0.461 }, { distance: 4.1, conversion: 0.454 },
    { distance: 4.2, conversion: 0.447 }, { distance: 4.3, conversion: 0.440 },
    { distance: 4.4, conversion: 0.433 }, { distance: 4.5, conversion: 0.427 },
    { distance: 4.6, conversion: 0.420 }, { distance: 4.7, conversion: 0.412 },
    { distance: 4.8, conversion: 0.405 }, { distance: 4.9, conversion: 0.399 },
    { distance: 5.0, conversion: 0.392 }, { distance: 5.1, conversion: 0.386 },
    { distance: 5.2, conversion: 0.379 }, { distance: 5.3, conversion: 0.373 },
    { distance: 5.4, conversion: 0.368 }, { distance: 5.5, conversion: 0.362 },
    { distance: 5.6, conversion: 0.357 }, { distance: 5.7, conversion: 0.352 },
    { distance: 5.8, conversion: 0.347 }, { distance: 5.9, conversion: 0.342 },
    { distance: 6.0, conversion: 0.337 }, { distance: 6.1, conversion: 0.332 },
    { distance: 6.2, conversion: 0.328 }
];

const getProductivityConversion = (distance: number): number | null => {
    if (distance <= 0) return null;
    let bestMatch = null;
    for (const item of productivityConversionData) {
        if (distance >= item.distance) {
            bestMatch = item.conversion;
        } else {
            break;
        }
    }
    if (bestMatch === null && productivityConversionData.length > 0) {
        return productivityConversionData[0].conversion;
    }
    return bestMatch;
};


const calculatePlanCycleTime = (distance: number): number => {
    if (distance <= 0) return 0;
    const speed = getPlanSpeed(distance);
    if (speed === 0) return 0;
    // New formula: (120 * Jarak / Plan Speed) + 3.73 + 1.3 + 1
    return (120 * distance / speed) + 3.73 + 1.3 + 1;
};

const SpeedTable: React.FC = () => (
    <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg" role="table" aria-label="Tabel Plan Speed berdasarkan Jarak">
        <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-700 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Jarak (km)</th>
                    <th scope="col" className="px-6 py-3">Plan Speed (km/h)</th>
                </tr>
            </thead>
            <tbody>
                {planSpeedTableData.map((row) => (
                    <tr key={row.range} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-3 font-medium text-slate-200 whitespace-nowrap">{row.range}</td>
                        <td className="px-6 py-3">{row.speed.toFixed(1)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ProductivityTable: React.FC = () => (
    <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg" role="table" aria-label="Tabel Konversi Produktivitas HD by Jarak">
        <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-700 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Jarak (km)</th>
                    <th scope="col" className="px-6 py-3">Konversi Produktivitas</th>
                </tr>
            </thead>
            <tbody>
                {productivityConversionData.map((row) => (
                    <tr key={row.distance} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-3 font-medium text-slate-200 whitespace-nowrap">{row.distance.toFixed(1)}</td>
                        <td className="px-6 py-3">{row.conversion.toFixed(3)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const CycleTime: React.FC = () => {
    const [jarak, setJarak] = useState('');
    const [jumlahHD, setJumlahHD] = useState('');
    const [servingTime, setServingTime] = useState('');
    const [aktualCycleTime, setAktualCycleTime] = useState(''); // This is "Front-Disposal-Front Time"
    const [totalAktualCycleTime, setTotalAktualCycleTime] = useState<number | null>(null);
    const [planCycleTime, setPlanCycleTime] = useState<number | null>(null);
    const [rekomendasiWaktuTravel, setRekomendasiWaktuTravel] = useState<number | null>(null);
    const [potensialHangingActual, setPotensialHangingActual] = useState<number | null>(null);
    const [predictiveRitasi, setPredictiveRitasi] = useState<number | null>(null);
    const [mfMikro, setMfMikro] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [predictiveProductivityLoader, setPredictiveProductivityLoader] = useState<number | null>(null);
    const [predictiveProductivityHauler, setPredictiveProductivityHauler] = useState<number | null>(null);
    
    // Status states
    const [cycleTimeStatus, setCycleTimeStatus] = useState<Status>('neutral');
    const [servingTimeStatus, setServingTimeStatus] = useState<Status>('neutral');
    const [hangingStatus, setHangingStatus] = useState<Status>('neutral');
    const [ritasiStatus, setRitasiStatus] = useState<Status>('neutral');
    const [mfMikroStatus, setMfMikroStatus] = useState<Status>('neutral');
    const [loaderProductivityStatus, setLoaderProductivityStatus] = useState<Status>('neutral');
    const [haulerProductivityStatus, setHaulerProductivityStatus] = useState<Status>('neutral');

    const handleDecimalChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const sanitized = value
            .replace(',', '.')
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');
        setter(sanitized);
    };
    
    const handleIntegerChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value.replace(/[^0-9]/g, ''));
    };

    useEffect(() => {
        const servTime = parseFloat(servingTime);
        const fdfTime = parseFloat(aktualCycleTime); // Front-Disposal-Front Time

        if (!isNaN(servTime) && servTime > 0 && !isNaN(fdfTime) && fdfTime > 0) {
            setTotalAktualCycleTime(servTime + fdfTime);
        } else {
            setTotalAktualCycleTime(null);
        }
    }, [servingTime, aktualCycleTime]);

    useEffect(() => {
        const distance = parseFloat(jarak);
        if (!isNaN(distance) && distance > 0) {
            setPlanCycleTime(calculatePlanCycleTime(distance));
        } else {
            setPlanCycleTime(null);
        }
    }, [jarak]);

    useEffect(() => {
        if (planCycleTime !== null) {
            const recommendedTime = planCycleTime - 3.73;
            setRekomendasiWaktuTravel(recommendedTime > 0 ? recommendedTime : null);
        } else {
            setRekomendasiWaktuTravel(null);
        }
    }, [planCycleTime]);

    useEffect(() => {
        const actCycleTimeNum = totalAktualCycleTime;
        const hdCount = parseInt(jumlahHD, 10);
        const servTime = parseFloat(servingTime);

        if (
            actCycleTimeNum !== null && actCycleTimeNum > 0 &&
            !isNaN(hdCount) && hdCount > 0 &&
            !isNaN(servTime) && servTime > 0
        ) {
            const numerator = actCycleTimeNum - (hdCount * servTime);
            const hangingValue = numerator < 0 ? 0 : numerator / hdCount;
            setPotensialHangingActual(hangingValue);
            
            const calculatedMfMikro = (hdCount * servTime) / actCycleTimeNum;
            setMfMikro(calculatedMfMikro);

        } else {
            setPotensialHangingActual(null);
            setMfMikro(null);
        }
    }, [totalAktualCycleTime, jumlahHD, servingTime]);
    
    useEffect(() => {
        const servTime = parseFloat(servingTime);
        const potHanging = potensialHangingActual;

        if (!isNaN(servTime) && servTime > 0 && potHanging !== null) {
            const denominator = servTime + potHanging;
            if (denominator > 0) {
                const ritasi = 60 / denominator; // Calculate for one hour
                setPredictiveRitasi(ritasi);
            } else {
                 setPredictiveRitasi(null);
            }
        } else {
            setPredictiveRitasi(null);
        }
    }, [servingTime, potensialHangingActual]);

     useEffect(() => {
        if (predictiveRitasi !== null && predictiveRitasi > 0) {
            const loaderProductivity = predictiveRitasi * 41;
            setPredictiveProductivityLoader(loaderProductivity);
        } else {
            setPredictiveProductivityLoader(null);
        }
    }, [predictiveRitasi]);

    useEffect(() => {
        const ritasi = predictiveRitasi;
        const hdCount = parseInt(jumlahHD, 10);
        const distance = parseFloat(jarak);
        const conversion = getProductivityConversion(distance);

        if (ritasi !== null && ritasi > 0 && !isNaN(hdCount) && hdCount > 0 && conversion !== null && conversion > 0) {
            const haulerProductivity = (ritasi / hdCount * 41) / conversion;
            setPredictiveProductivityHauler(haulerProductivity);
        } else {
            setPredictiveProductivityHauler(null);
        }
    }, [predictiveRitasi, jumlahHD, jarak]);

    useEffect(() => {
        // Ritasi Status (Plan >= 14)
        let currentRitasiStatus: Status = 'neutral';
        if (predictiveRitasi !== null) {
            currentRitasiStatus = predictiveRitasi >= 14 ? 'good' : 'bad';
        }
        setRitasiStatus(currentRitasiStatus);
    
        // Cycle Time Status (Actual <= Plan)
        if (totalAktualCycleTime !== null && planCycleTime !== null) {
            setCycleTimeStatus(totalAktualCycleTime <= planCycleTime ? 'good' : 'bad');
        } else {
            setCycleTimeStatus('neutral');
        }
    
        // Serving Time Status (Actual <= 3.73)
        const servTime = parseFloat(servingTime);
        if (!isNaN(servTime)) {
            setServingTimeStatus(servTime <= 3.73 ? 'good' : 'bad');
        } else {
            setServingTimeStatus('neutral');
        }
    
        // Hanging/Waiting Status (Special Logic)
        if (currentRitasiStatus === 'good') {
            setHangingStatus('good');
        } else if (potensialHangingActual !== null) {
            setHangingStatus(potensialHangingActual <= 0.35 ? 'good' : 'bad');
        } else {
            setHangingStatus('neutral');
        }
        
        // MF Mikro Status (0.9 <= Actual <= 1.0)
        if (mfMikro !== null) {
            setMfMikroStatus(mfMikro >= 0.9 && mfMikro <= 1.0 ? 'good' : 'bad');
        } else {
            setMfMikroStatus('neutral');
        }
    
        // Loader Productivity Status (Actual >= 540)
        if (predictiveProductivityLoader !== null) {
            setLoaderProductivityStatus(predictiveProductivityLoader >= 540 ? 'good' : 'bad');
        } else {
            setLoaderProductivityStatus('neutral');
        }
    
        // Hauler Productivity Status (Actual >= 231)
        if (predictiveProductivityHauler !== null) {
            setHaulerProductivityStatus(predictiveProductivityHauler >= 231 ? 'good' : 'bad');
        } else {
            setHaulerProductivityStatus('neutral');
        }
    
    }, [
        totalAktualCycleTime, planCycleTime, servingTime, potensialHangingActual,
        predictiveRitasi, mfMikro, predictiveProductivityLoader, predictiveProductivityHauler
    ]);

     useEffect(() => {
        const newSuggestions: string[] = [];
        const distance = parseFloat(jarak);
        const hdCount = parseInt(jumlahHD, 10);
        const servTime = parseFloat(servingTime);
        const actCycleTime = totalAktualCycleTime;
        let planUnitHD: number | null = null;

        if (mfMikro !== null) {
            if (mfMikro < 0.9) {
                newSuggestions.push(`MF Mikro (${mfMikro.toFixed(2)}) di bawah target ideal (0.9-1.0). Ini mengindikasikan adanya potensi waktu tunggu pada alat muat (loader menunggu HD). Pertimbangkan untuk mengevaluasi waktu tempuh atau jumlah HD untuk memastikan alat muat bekerja optimal.`);
            } else if (mfMikro > 1.0) {
                 newSuggestions.push(`MF Mikro (${mfMikro.toFixed(2)}) di atas target ideal (0.9-1.0). Ini menunjukkan adanya antrian HD di area pemuatan (HD menunggu loader). Evaluasi apakah jumlah HD terlalu banyak untuk alat muat yang ada.`);
            }
        }

        if (predictiveRitasi !== null) {
            if (predictiveRitasi < 14) {
                newSuggestions.push(`Predictive Ritasi per Jam (${predictiveRitasi.toFixed(1)} Rit) di bawah target (14 Rit). Fokus pada pengurangan cycle time.`);
                if (potensialHangingActual !== null && potensialHangingActual > 0.35) {
                    newSuggestions.push(`Potensial Hanging/Waiting HD (${potensialHangingActual.toFixed(1)} Menit/Rit) melebihi toleransi (0.35) saat ritasi rendah. Prioritaskan pengurangan waktu tunggu.`);
                }
            } else {
                if (potensialHangingActual !== null && predictiveRitasi !== null) {
                    const totalWaitMinutes = potensialHangingActual * predictiveRitasi;
                    if (totalWaitMinutes > 0) {
                         newSuggestions.push(`Ritasi tercapai. Untuk mengurangi delay "wait equipment" sebesar ${totalWaitMinutes.toFixed(1)} menit dalam satu jam, disarankan untuk tidak mematikan engine selama waktu tunggu tersebut.`);
                    }
                }
            }
        }

        if (!isNaN(servTime) && servTime > 0) {
            if (servTime > 3.73) {
                newSuggestions.push(`Serving Time Aktual (${servTime.toFixed(1)} menit) lebih tinggi dari target (3.73 menit). Evaluasi proses pemuatan untuk efisiensi.`);
            }
        }

        if (actCycleTime !== null && actCycleTime > 0 && planCycleTime !== null) {
            if (actCycleTime > planCycleTime) {
                newSuggestions.push(`Cycle Time HD Aktual (${actCycleTime.toFixed(1)} menit) lebih tinggi dari plan (${planCycleTime.toFixed(1)} menit). Identifikasi bottleneck dalam siklus (travel, dump, antrian).`);
            }
        }
        
        const hdSuggestions: string[] = [];
        if (!isNaN(distance) && distance > 0 && !isNaN(hdCount)) {
            const conversionFactor = getProductivityConversion(distance);
            if (conversionFactor) {
                const calculatedPlanUnitHD = 540 / (231 * conversionFactor);
                planUnitHD = calculatedPlanUnitHD;
                if (hdCount > Math.ceil(planUnitHD)) {
                    if (mfMikro !== null && mfMikro < 1) {
                         hdSuggestions.push(`Jumlah HD aktual (${hdCount}) lebih tinggi dari plan (${planUnitHD.toFixed(0)} unit), namun alat muat masih menunggu (MF Mikro < 1). Ini mengindikasikan inefisiensi operasional dan biaya yang signifikan. Evaluasi alokasi unit dan identifikasi bottleneck lain dalam siklus.`);
                    } else {
                        hdSuggestions.push(`Jumlah HD aktual (${hdCount}) lebih tinggi dari plan (${planUnitHD.toFixed(0)} unit) untuk jarak ini. Hal ini berpotensi menyebabkan antrian dan menurunkan efisiensi biaya operasional. Evaluasi apakah kelebihan unit dapat dialokasikan ke area lain.`);
                    }
                } else if (hdCount < Math.floor(planUnitHD)) {
                     hdSuggestions.push(`Jumlah HD aktual (${hdCount}) lebih rendah dari plan (${planUnitHD.toFixed(0)} unit) untuk jarak ini. Ini berpotensi menyebabkan waktu tunggu alat muat (loader), yang mungkin tercermin pada nilai MF Mikro.`);
                }
            }
        }
        newSuggestions.push(...hdSuggestions);
        
        const ritasiSuggestions: string[] = [];
        if (predictiveRitasi !== null && predictiveRitasi >= 14) {
             if (potensialHangingActual !== null && !isNaN(servTime) && servTime > 0 && (potensialHangingActual * predictiveRitasi) > servTime) {
                if (planUnitHD !== null && hdCount < Math.floor(planUnitHD)) {
                    ritasiSuggestions.push(`Produktivitas tinggi, namun ada potensi lebih. Pertimbangkan untuk menambah jumlah HD untuk memanfaatkan waktu tunggu dan meningkatkan total ritasi.`);
                }
            }
        }
         newSuggestions.push(...ritasiSuggestions);

        if (newSuggestions.length === 0 && jarak && jumlahHD && servingTime && aktualCycleTime) {
            newSuggestions.push("Semua metrik utama berada dalam rentang target. Kinerja operasional sangat baik! Pertahankan.");
        }
        
        setSuggestions(newSuggestions);
    }, [mfMikro, predictiveRitasi, potensialHangingActual, servingTime, totalAktualCycleTime, planCycleTime, jarak, jumlahHD, aktualCycleTime]);


    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Input & Results */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                    <h2 className="text-xl font-semibold mb-6 text-slate-200">Input Data Aktual</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField id="jarak" label="Jarak" value={jarak} onChange={handleDecimalChange(setJarak)} unit="km" />
                        <InputField id="jumlahHD" label="Jumlah HD" value={jumlahHD} onChange={handleIntegerChange(setJumlahHD)} unit="unit" />
                        <InputField id="servingTime" label="Serving Time" value={servingTime} onChange={handleDecimalChange(setServingTime)} unit="menit" />
                        <InputField id="aktualCycleTime" label="Front-Disposal-Front Time" value={aktualCycleTime} onChange={handleDecimalChange(setAktualCycleTime)} unit="menit" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="col-span-2">
                        <Card 
                            title="Rekomendasi Waktu Travel" 
                            value={rekomendasiWaktuTravel !== null ? `${rekomendasiWaktuTravel.toFixed(1)} Menit` : '-'} 
                            align="center"
                        />
                    </div>
                    <Card title="Jarak" value={jarak ? `${jarak} km` : '-'} icon={<RouteIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />} />
                    <Card title="Jumlah HD" value={jumlahHD ? `${jumlahHD} Unit` : '-'} icon={<MiningTruckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />} />
                    <Card title="Plan Cycle Time by Jarak" value={planCycleTime ? `${planCycleTime.toFixed(1)} Menit` : '-'} icon={<ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />} />
                    <Card title="Cycle Time HD Aktual" value={totalAktualCycleTime ? `${totalAktualCycleTime.toFixed(1)} Menit` : '-'} icon={<ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />} status={cycleTimeStatus} />
                    <Card title="Serving Time Plan" value="3,73 Menit" icon={<ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />} />
                    <Card title="Serving Time Aktual" value={servingTime ? `${servingTime} Menit` : '-'} icon={<ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />} status={servingTimeStatus} />
                    <Card title="Toleransi Hanging/Waiting HD" value="0,35 Menit/Rit" icon={<HourglassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />} />
                    <Card title="Potensial Hanging/Waiting HD Aktual" value={potensialHangingActual !== null ? `${potensialHangingActual.toFixed(1)} Menit/Rit` : '-'} icon={<HourglassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />} status={hangingStatus} />
                    <Card title="Predictive Ritasi per Jam" value={predictiveRitasi ? `${predictiveRitasi.toFixed(1)} Rit` : '-'} icon={<ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />} status={ritasiStatus} />
                    <Card title="MF Mikro" value={mfMikro !== null ? mfMikro.toFixed(2) : '-'} icon={<GearIcon className="h-5 w-5 sm:h-6 sm:w-6 text-teal-400" />} status={mfMikroStatus} />
                    <Card title="Predictive Productivity Loader" value={predictiveProductivityLoader !== null ? `${predictiveProductivityLoader.toFixed(1)}` : '-'} icon={<ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-rose-400" />} status={loaderProductivityStatus} />
                    <Card title="Predictive Productivity Hauler" value={predictiveProductivityHauler !== null ? `${predictiveProductivityHauler.toFixed(1)}` : '-'} icon={<ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-fuchsia-400" />} status={haulerProductivityStatus} />
                </div>
                <SuggestionsBox suggestions={suggestions} />
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-1">
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                    <h2 className="text-xl font-semibold text-slate-200 mb-6">Detail Konten</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Tabel Plan Speed by Jarak</h3>
                            <SpeedTable />
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Tabel Konversi Produktivitas HD by Jarak</h3>
                            <ProductivityTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CycleTime;