import React, { useState, useEffect } from 'react';
import { StopwatchCSLoader } from './StopwatchCSLoader';
import { ClockIcon, HourglassIcon, ChartBarIcon, GearIcon, RouteIcon, MiningTruckIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon, TimerIcon, TrashIcon, PlusIcon, PlayIcon, StopIcon, RotateCcwIcon, WhatsappIcon } from './icons';

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
    const conversion = getProductivityConversion(distance);
    if (conversion === null || conversion <= 0) return 0;
    // New formula: 60 / ((Konversi Productivity HD by Jarak * 231) / 41)
    return 60 / ((conversion * 231) / 41);
};

const PlanCycleTimeTable: React.FC = () => (
    <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg" role="table" aria-label="Tabel Plan Cycle Time by Jarak">
        <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-700 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Jarak (km)</th>
                    <th scope="col" className="px-6 py-3">Plan Cycle Time (Menit)</th>
                </tr>
            </thead>
            <tbody>
                {productivityConversionData.map((row) => (
                    <tr key={row.distance} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-3 font-medium text-slate-200 whitespace-nowrap">{row.distance.toFixed(1)}</td>
                        <td className="px-6 py-3">{calculatePlanCycleTime(row.distance).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

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


interface CycleTimeProps {
    activeTab: 'observasi' | 'prestasi' | 'delay' | 'referensi' | 'stopwatch_cs' | 'about';
    setActiveTab: (tab: 'observasi' | 'prestasi' | 'delay' | 'referensi' | 'stopwatch_cs' | 'about') => void;
}

const CycleTime: React.FC<CycleTimeProps> = ({ activeTab, setActiveTab }) => {
    interface HDUnit {
        id: string;
        unitName: string;
        time: number; // in ms
        isRunning: boolean;
        startTime: number | null;
    }

    const [loaders, setLoaders] = useState<Array<{
        id: string;
        name: string;
        jumlahHD: string;
        servingTime: string;
        cycleTimeHD: string;
        showDetails: boolean;
        showStopwatches?: boolean;
        hdUnits?: HDUnit[];
    }>>([]);

    const handleAddLoader = () => {
        const nextIdNum = Math.max(...loaders.map(l => parseInt(l.id) || 0), 0) + 1;
        const nextId = nextIdNum.toString();
        const nextNumber = 1216 + nextIdNum;
        const defaultName = `EX${nextNumber}`;
        setLoaders([
            ...loaders,
            { id: nextId, name: defaultName, jumlahHD: '', servingTime: '', cycleTimeHD: '', showDetails: false, showStopwatches: true, hdUnits: [] }
        ]);
    };

    const handleRemoveLoader = (id: string) => {
        setLoaders(loaders.filter(l => l.id !== id));
    };

    const handleToggleDetails = (id: string) => {
        setLoaders(loaders.map(loader => {
            if (loader.id === id) {
                return { ...loader, showDetails: !loader.showDetails };
            }
            return loader;
        }));
    };

    const handleToggleStopwatches = (id: string) => {
        setLoaders(loaders.map(loader => {
            if (loader.id === id) {
                return { ...loader, showStopwatches: loader.showStopwatches === false ? true : false };
            }
            return loader;
        }));
    };

    const handleUpdateLoader = (id: string, field: 'name' | 'jumlahHD' | 'servingTime' | 'cycleTimeHD', value: string) => {
        setLoaders(loaders.map(loader => {
            if (loader.id === id) {
                const updatedLoader = { ...loader, [field]: value };
                
                if (field === 'jumlahHD') {
                    const count = parseInt(value) || 0;
                    let units: HDUnit[] = loader.hdUnits ? [...loader.hdUnits] : [];
                    
                    if (units.length < count) {
                        for (let i = units.length; i < count; i++) {
                            const startingNumber = 1230 + i + 1;
                            units.push({
                                id: i.toString(),
                                unitName: `HD${startingNumber}`,
                                time: 0,
                                isRunning: false,
                                startTime: null
                            });
                        }
                    } else if (units.length > count) {
                        units = units.slice(0, count);
                    }
                    updatedLoader.hdUnits = units;
                }
                
                return updatedLoader;
            }
            return loader;
        }));
    };

    const handleUpdateLoaderDecimal = (id: string, field: 'servingTime' | 'cycleTimeHD', value: string) => {
        const sanitized = value
            .replace(',', '.')
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');
        handleUpdateLoader(id, field, sanitized);
    };

    const handleUpdateLoaderInteger = (id: string, field: 'jumlahHD', value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        handleUpdateLoader(id, field, sanitized);
    };

    const handleUpdateHDName = (loaderId: string, hdId: string, name: string) => {
        setLoaders(prev => prev.map(loader => {
            if (loader.id === loaderId && loader.hdUnits) {
                return {
                    ...loader,
                    hdUnits: loader.hdUnits.map(hd => {
                        if (hd.id === hdId) {
                            return { ...hd, unitName: name };
                        }
                        return hd;
                    })
                };
            }
            return loader;
        }));
    };

    const handleStartStopwatch = (loaderId: string, hdId: string) => {
        setLoaders(prev => prev.map(loader => {
            if (loader.id === loaderId && loader.hdUnits) {
                return {
                    ...loader,
                    hdUnits: loader.hdUnits.map(hd => {
                        if (hd.id === hdId) {
                            return {
                                ...hd,
                                isRunning: true,
                                startTime: Date.now()
                            };
                        }
                        return hd;
                    })
                };
            }
            return loader;
        }));
    };

    const handleStopStopwatch = (loaderId: string, hdId: string) => {
        setLoaders(prev => prev.map(loader => {
            if (loader.id === loaderId && loader.hdUnits) {
                return {
                    ...loader,
                    hdUnits: loader.hdUnits.map(hd => {
                        if (hd.id === hdId) {
                            const now = Date.now();
                            const elapsed = hd.startTime ? (now - hd.startTime) : 0;
                            return {
                                ...hd,
                                isRunning: false,
                                time: hd.time + elapsed,
                                startTime: null
                            };
                        }
                        return hd;
                    })
                };
            }
            return loader;
        }));
    };

    const handleResetStopwatch = (loaderId: string, hdId: string) => {
        setLoaders(prev => prev.map(loader => {
            if (loader.id === loaderId && loader.hdUnits) {
                return {
                    ...loader,
                    hdUnits: loader.hdUnits.map(hd => {
                        if (hd.id === hdId) {
                            return {
                                ...hd,
                                isRunning: false,
                                startTime: null,
                                time: 0
                            };
                        }
                        return hd;
                    })
                };
            }
            return loader;
        }));
    };

    const formatStopwatch = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        const tenths = Math.floor((ms % 1000) / 100);
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        
        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${tenths}`;
        }
        return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
    };

    // Ticking stopwatches
    useEffect(() => {
        let intervalId: any = null;
        const hasRunning = loaders.some(l => l.hdUnits && l.hdUnits.some(hd => hd.isRunning));
        
        if (hasRunning) {
            intervalId = setInterval(() => {
                setLoaders(prev => prev.map(loader => {
                    if (!loader.hdUnits) return loader;
                    const updated = loader.hdUnits.map(hd => {
                        if (hd.isRunning && hd.startTime !== null) {
                            const now = Date.now();
                            const diff = now - hd.startTime;
                            return {
                                ...hd,
                                time: hd.time + diff,
                                startTime: now
                            };
                        }
                        return hd;
                    });
                    return { ...loader, hdUnits: updated };
                }));
            }, 100);
        }
        
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [loaders]);

    const [jarak, setJarak] = useState('');
    const [jumlahHD, setJumlahHD] = useState('');
    const [servingTime, setServingTime] = useState('');
    const [aktualCycleTime, setAktualCycleTime] = useState(''); // This is "Travel Time + Dumping"
    const [totalAktualCycleTime, setTotalAktualCycleTime] = useState<number | null>(null);
    const [planCycleTime, setPlanCycleTime] = useState<number | null>(null);
    const [rekomendasiWaktuTravel, setRekomendasiWaktuTravel] = useState<number | null>(null);
    const [potensialHangingActual, setPotensialHangingActual] = useState<number | null>(null);
    const [predictiveRitasi, setPredictiveRitasi] = useState<number | null>(null);
    const [mfMikro, setMfMikro] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [predictiveProductivityLoader, setPredictiveProductivityLoader] = useState<number | null>(null);
    const [predictiveProductivityHauler, setPredictiveProductivityHauler] = useState<number | null>(null);
    const [showInputData, setShowInputData] = useState(true);
    
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
        const fdfTime = parseFloat(aktualCycleTime); // Travel Time + Dumping

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
            // Updated plan serving time to 3.73
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


    // Tab "Prestasi" calculations
    const distanceVal = parseFloat(jarak);
    const hdCountVal = parseInt(jumlahHD, 10);
    const servTimeVal = parseFloat(servingTime);
    const actCycleTimeNum = totalAktualCycleTime;

    const isDataValid = !isNaN(distanceVal) && distanceVal > 0 &&
                        !isNaN(hdCountVal) && hdCountVal > 0 &&
                        !isNaN(servTimeVal) && servTimeVal > 0 &&
                        actCycleTimeNum !== null && actCycleTimeNum > 0;

    const getRowData = (rowHD: number) => {
        const numerator = actCycleTimeNum - (rowHD * servTimeVal);
        const hangingValue = numerator < 0 ? 0 : numerator / rowHD;
        
        const mf = (rowHD * servTimeVal) / actCycleTimeNum;
        
        const denominator = servTimeVal + hangingValue;
        const ritasi = denominator > 0 ? (60 / denominator) : 0;
        
        const loaderProductivity = ritasi * 41;
        const conversionVal = getProductivityConversion(distanceVal);
        const haulerProductivity = conversionVal && conversionVal > 0 
            ? ((ritasi / rowHD * 41) / conversionVal) 
            : 0;

        return {
            mf,
            ritasi,
            loaderProductivity,
            haulerProductivity,
        };
    };

    // Calculate row variations around actual HD count: from -2 to +3
    const prestasiRows = isDataValid
        ? [-2, -1, 0, 1, 2, 3]
            .map((offset) => {
                const rowHD = hdCountVal + offset;
                return {
                    offset,
                    rowHD,
                    ...getRowData(rowHD),
                };
            })
            .filter((row) => row.rowHD > 0)
        : [];

    return (
        <div className="space-y-4">
            {activeTab === 'observasi' && (
                <div className="animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Input Data */}
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/40">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                            </svg>
                                        </div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-200">Input Data Aktual</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowInputData(!showInputData)}
                                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer select-none"
                                        title={showInputData ? "Sembunyikan Form" : "Tampilkan Form"}
                                    >
                                        {showInputData ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                <span>Hide</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>
                                                </svg>
                                                <span>Show</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {showInputData ? (
                                    <div className="animate-fade-in space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <InputField id="jarak" label="Jarak" value={jarak} onChange={handleDecimalChange(setJarak)} unit="km" />
                                            <InputField id="jumlahHD" label="Jumlah HD" value={jumlahHD} onChange={handleIntegerChange(setJumlahHD)} unit="unit" />
                                            <InputField id="servingTime" label="Serving Time" value={servingTime} onChange={handleDecimalChange(setServingTime)} unit="menit" />
                                            <InputField id="aktualCycleTime" label="Travel Time + Dumping" value={aktualCycleTime} onChange={handleDecimalChange(setAktualCycleTime)} unit="menit" />
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('prestasi')}
                                            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
                                        >
                                            <ChartBarIcon className="h-4 w-4" />
                                            <span>Lihat Prestasi</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-3.5 bg-slate-900/60 rounded-lg text-slate-400 text-xs border border-slate-700/30 font-sans space-y-3">
                                        <div className="flex items-center gap-2 text-slate-300 font-medium pb-2 border-b border-slate-800">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                            <span>Parameter Aktif (Tersembunyi)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] bg-slate-950/40 p-2.5 rounded border border-slate-900">
                                            <div>Jarak: <span className="font-mono text-amber-400 font-bold">{jarak ? `${jarak} km` : '-'}</span></div>
                                            <div>Jumlah HD: <span className="font-mono text-amber-400 font-bold">{jumlahHD ? `${jumlahHD} unit` : '-'}</span></div>
                                            <div>Serving Time: <span className="font-mono text-amber-400 font-bold">{servingTime ? `${servingTime} m` : '-'}</span></div>
                                            <div>Travel + Dump: <span className="font-mono text-amber-400 font-bold">{aktualCycleTime ? `${aktualCycleTime} m` : '-'}</span></div>
                                        </div>
                                        <button 
                                            onClick={() => setShowInputData(true)}
                                            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-amber-500 hover:text-amber-400 rounded text-[11px] font-bold text-center transition cursor-pointer border border-slate-700/40"
                                        >
                                            Expand Form Input
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Output Cards */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                        </div>
                    </div>
                    {/* Suggestions (Keterangan) at the very bottom, spanning full width */}
                    <SuggestionsBox suggestions={suggestions} />
                </div>
            )}

            {activeTab === 'prestasi' && (
                <div className="animate-fade-in space-y-4">
                    {!isDataValid ? (
                        <div className="bg-slate-800/30 border border-slate-700/50 p-6 sm:p-8 rounded-lg text-center max-w-xl mx-auto space-y-4">
                            <HourglassIcon className="h-10 w-10 text-amber-500/50 mx-auto animate-pulse" />
                            <h3 className="text-base font-semibold text-slate-200">Data Observasi Belum Lengkap</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Silakan lengkapi input data aktual (**Jarak, Jumlah HD, Serving Time, dan Travel Time + Dumping**) di tab <span className="font-semibold text-amber-500">Observasi</span> terlebih dahulu untuk melihat analisis dan simulasi perbandingan performa ("Prestasi") alat angkut.
                            </p>
                            <button
                                onClick={() => setActiveTab('observasi')}
                                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-md font-medium text-xs transition-all border border-amber-500/30 cursor-pointer"
                            >
                                Lengkapi Data Sekarang
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Prestasi Table Container */}
                            <div className="overflow-x-auto border border-slate-700/50 rounded-lg shadow-xl bg-slate-900/50 md:overflow-x-visible">
                                <table className="w-full text-[10px] sm:text-xs md:text-sm text-left text-slate-300">
                                    <thead className="text-[9px] sm:text-xs text-slate-200 uppercase bg-slate-800 border-b border-slate-700">
                                        <tr>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">Jarak<br/><span className="text-[8px] sm:text-[9px] font-normal text-slate-400 lowercase">(km)</span></th>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                <span className="hidden sm:inline">Cycle Time</span>
                                                <span className="sm:hidden">CT</span> Aktual
                                                <br/>
                                                <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 lowercase">(menit)</span>
                                            </th>
                                            <th scope="col" className="px-1.5 py-1.5 sm:px-4 sm:py-2.5 text-center font-semibold bg-slate-800/80 border-x border-slate-700/50">
                                                <span className="hidden sm:inline">Simulasi jumlah HD</span>
                                                <span className="sm:hidden">Simulasi HD</span>
                                            </th>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">MF<span className="hidden sm:inline"> Aktual</span></th>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                <span className="hidden md:inline">Predictive </span>Ritasi
                                                <br/>
                                                <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 lowercase">(rit/jam)</span>
                                            </th>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                <span className="hidden md:inline">Predictive </span>Loader
                                                <br/>
                                                <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 lowercase">(bcm/jam)</span>
                                            </th>
                                            <th scope="col" className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                <span className="hidden md:inline">Predictive </span>Hauler
                                                <br/>
                                                <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 lowercase">(bcm/jam)</span>
                                            </th>
                                        </tr>
                                    </thead>
                                                                        <tbody className="divide-y divide-slate-800">
                                         {prestasiRows.map((row, idx) => {
                                             const isActualRow = row.offset === 0;
                                             return (
                                                 <tr 
                                                     key={row.rowHD} 
                                                     className={`hover:bg-slate-800/60 transition ${
                                                         isActualRow 
                                                             ? 'bg-amber-500/10 border-y border-amber-500/30 font-semibold text-slate-100' 
                                                             : idx % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                                                     }`}
                                                 >
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-medium">
                                                         {distanceVal.toFixed(1)}
                                                     </td>
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-medium">
                                                         {actCycleTimeNum.toFixed(1)}
                                                     </td>
                                                     <td className={`px-1.5 py-1.5 sm:px-4 sm:py-2.5 text-center font-bold text-xs sm:text-base border-x border-slate-800/50 ${
                                                         isActualRow ? 'text-amber-400 bg-amber-500/10' : 'text-slate-100 bg-slate-800/10'
                                                     }`}>
                                                         <div className="flex items-center justify-center gap-1">
                                                             <span>{row.rowHD}</span>
                                                             {isActualRow && (
                                                                 <>
                                                                     <span className="px-1 py-0.5 text-[8px] font-semibold text-amber-900 bg-amber-400 rounded hidden sm:inline-block">Aktual</span>
                                                                     <span className="h-1.5 w-1.5 rounded-full bg-amber-400 sm:hidden inline-block ml-0.5 animate-pulse" title="Aktual" />
                                                                 </>
                                                             )}
                                                         </div>
                                                     </td>
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center">
                                                         <div className="flex justify-center">
                                                             {row.mf >= 0.9 && row.mf <= 1.0 ? (
                                                                 <span className="px-1 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-sm flex items-center justify-center gap-0.5 sm:gap-1">
                                                                     <CheckCircleIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 hidden sm:inline-block" /> {row.mf.toFixed(2)}
                                                                 </span>
                                                             ) : row.mf > 1.0 ? (
                                                                 <span className="px-1 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-semibold text-yellow-500 bg-yellow-500/10 rounded-full border border-yellow-500/20 shadow-sm">
                                                                      {row.mf.toFixed(2)}
                                                                      <span className="hidden sm:inline"> (Queue)</span>
                                                                      <span className="sm:hidden text-[8px]"> (Q)</span>
                                                                 </span>
                                                             ) : (
                                                                 <span className="px-1 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-full border border-rose-500/20 shadow-sm">
                                                                      {row.mf.toFixed(2)}
                                                                      <span className="hidden sm:inline"> (Idle)</span>
                                                                      <span className="sm:hidden text-[8px]"> (I)</span>
                                                                 </span>
                                                             )}
                                                         </div>
                                                     </td>
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                         <span className={row.ritasi >= 14 ? 'text-emerald-400' : 'text-rose-500'}>
                                                             {row.ritasi.toFixed(1)}
                                                         </span>
                                                     </td>
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                         <span className={row.loaderProductivity >= 540 ? 'text-emerald-400' : 'text-rose-500'}>
                                                             {row.loaderProductivity.toFixed(1)}
                                                         </span>
                                                     </td>
                                                     <td className="px-1 py-1.5 sm:px-3 sm:py-2.5 text-center font-semibold">
                                                         <span className={row.haulerProductivity >= 231 ? 'text-emerald-400' : 'text-rose-500'}>
                                                             {row.haulerProductivity.toFixed(1)}
                                                         </span>
                                                     </td>
                                                 </tr>
                                             );
                                         })}
                                     </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'delay' && (
                <div className="animate-fade-in space-y-6">
                    {/* Header with actions */}
                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-550 bg-amber-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-slate-300 font-sans">Delay &amp; Cek Bugar Dashboard</span>
                        </div>
                        <button
                            onClick={handleAddLoader}
                            className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
                        >
                            <PlusIcon className="h-3.5 w-3.5 shrink-0" />
                            <span>Tambah Unit Loader</span>
                        </button>
                    </div>

                    {loaders.length === 0 ? (
                        <div className="bg-slate-800/30 border border-slate-700/50 p-12 rounded-lg text-center max-w-lg mx-auto space-y-4">
                            <TimerIcon className="h-12 w-12 text-slate-500 mx-auto animate-pulse" />
                            <h3 className="text-base font-semibold text-slate-300">Belum ada Unit Loader</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Klik tombol di bawah ini untuk menambahkan unit loader baru dan memonitor nilai Delay/Idle-nya.
                            </p>
                            <button
                                onClick={handleAddLoader}
                                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition-all hover:bg-amber-600 cursor-pointer"
                            >
                                Tambah Loader Pertama
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                            {/* Left Column: Loader configuration + Cek Bugar stopwatches */}
                            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                                {loaders.map((loader) => {
                                    const hdCount = parseFloat(loader.jumlahHD) || 0;
                                    const servTime = parseFloat(loader.servingTime) || 0;
                                    const cycTime = parseFloat(loader.cycleTimeHD) || 0;

                                    // Formulas:
                                    // MF Aktual = (Jumlah HD * Serving Time) / Cycle Time HD
                                    const mfAktual = cycTime > 0 ? (hdCount * servTime) / cycTime : 0;
                                    // Lama loader idle = 60 - (MF Aktual * 60)
                                    const loaderIdle = mfAktual >= 1 ? 0 : 60 - (mfAktual * 60);

                                    // Visual Indicator states:
                                    let percentageColor = 'bg-slate-700';

                                    if (hdCount > 0 && servTime > 0 && cycTime > 0) {
                                        if (mfAktual < 0.9) {
                                            percentageColor = 'bg-amber-500';
                                        } else if (mfAktual >= 0.9 && mfAktual <= 1.1) {
                                            percentageColor = 'bg-emerald-500';
                                        } else {
                                            percentageColor = 'bg-rose-500';
                                        }
                                    }

                                    // Visual progress percentage of idle time in an hour
                                    const idlePercentage = Math.max(0, Math.min(100, (loaderIdle / 60) * 100));
                                    const hdUnits = loader.hdUnits || [];

                                    return (
                                        <div 
                                            key={loader.id} 
                                            className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 shadow-lg space-y-4 text-left"
                                        >
                                            {/* Loader Header */}
                                            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-700/40">
                                                <div className="flex items-center gap-2 max-w-[50%]">
                                                    <input
                                                        type="text"
                                                        value={loader.name}
                                                        onChange={(e) => handleUpdateLoader(loader.id, 'name', e.target.value)}
                                                        className="bg-transparent font-bold text-sm sm:text-base text-slate-105 text-slate-100 hover:bg-slate-700/40 focus:bg-slate-700/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40 rounded px-1.5 py-0.5 w-full transition-all font-mono uppercase tracking-wide"
                                                        placeholder="EX1217"
                                                    />
                                                </div>

                                                {/* Compact Badges shown only when details are collapsed */}
                                                <div className="flex items-center gap-1.5">
                                                    {!loader.showDetails && hdCount > 0 && servTime > 0 && cycTime > 0 && (
                                                        <div className="hidden sm:flex items-center gap-1.5">
                                                            <span className="text-[10px] bg-slate-900/60 text-slate-300 border border-slate-805/45 px-1.5 py-0.5 rounded font-sans">
                                                                {hdUnits.length} HD
                                                            </span>
                                                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-medium">
                                                                MF: {mfAktual.toFixed(2)}
                                                            </span>
                                                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-medium">
                                                                Idle: {loaderIdle.toFixed(1)}m
                                                            </span>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => handleToggleDetails(loader.id)}
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer select-none ${
                                                            loader.showDetails
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                                : 'bg-slate-800 text-slate-305 hover:bg-slate-700 border border-slate-700/50'
                                                        }`}
                                                    >
                                                        {loader.showDetails ? 'Tutup Parameter' : 'Ubah Parameter'}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleRemoveLoader(loader.id)}
                                                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                                                        title="Hapus Loader"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Details & Calculations (Collapsible) */}
                                            {loader.showDetails && (
                                                <div className="space-y-4 animate-fade-in text-left bg-slate-900/30 p-3.5 rounded-lg border border-slate-800/80">
                                                    {/* Compact inputs */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {/* Jumlah HD */}
                                                        <div>
                                                            <label className="block text-[10px] font-medium text-slate-400 mb-1 font-sans">Jumlah HD</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    value={loader.jumlahHD}
                                                                    onChange={(e) => handleUpdateLoaderInteger(loader.id, 'jumlahHD', e.target.value)}
                                                                    className="w-full bg-slate-950/65 border border-slate-700 rounded py-1 pl-2 pr-6 text-xs text-slate-205 text-slate-200 focus:ring-amber-500 focus:border-amber-500 transition font-sans"
                                                                    placeholder="0"
                                                                />
                                                                <span className="absolute inset-y-0 right-1.5 flex items-center text-[8px] text-slate-500 font-sans">Unit</span>
                                                            </div>
                                                        </div>

                                                        {/* Serving Time */}
                                                        <div>
                                                            <label className="block text-[10px] font-medium text-slate-400 mb-1 font-sans">Serving Time</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    value={loader.servingTime}
                                                                    onChange={(e) => handleUpdateLoaderDecimal(loader.id, 'servingTime', e.target.value)}
                                                                    className="w-full bg-slate-950/65 border border-slate-700 rounded py-1 pl-2 pr-6 text-xs text-slate-205 text-slate-200 focus:ring-amber-500 focus:border-amber-500 transition font-sans"
                                                                    placeholder="0.0"
                                                                />
                                                                <span className="absolute inset-y-0 right-1.5 flex items-center text-[8px] text-slate-500 font-sans">Min</span>
                                                            </div>
                                                        </div>

                                                        {/* Cycle Time HD */}
                                                        <div>
                                                            <label className="block text-[10px] font-medium text-slate-400 mb-1 font-sans truncate">Cycle Time HD</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    value={loader.cycleTimeHD}
                                                                    onChange={(e) => handleUpdateLoaderDecimal(loader.id, 'cycleTimeHD', e.target.value)}
                                                                    className="w-full bg-slate-950/65 border border-slate-700 rounded py-1 pl-2 pr-6 text-xs text-slate-205 text-slate-200 focus:ring-amber-500 focus:border-amber-500 transition font-sans"
                                                                    placeholder="0.0"
                                                                />
                                                                <span className="absolute inset-y-0 right-1.5 flex items-center text-[8px] text-slate-500 font-sans">Min</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Result calculations panel inside */}
                                                    <div className="grid grid-cols-2 gap-2.5 font-sans">
                                                        {/* Match Factor Result */}
                                                        <div className="bg-slate-950/50 p-2 rounded border border-slate-900">
                                                            <span className="text-[9px] text-slate-500 uppercase font-semibold block font-sans">MF Status</span>
                                                            <span className="text-sm font-extrabold text-slate-100 block mt-0.5">
                                                                {hdCount && servTime && cycTime ? mfAktual.toFixed(2) : '-'}
                                                            </span>
                                                            <span className="text-[8px] text-slate-500 block font-mono leading-tight mt-0.5">
                                                                ({hdCount.toFixed(0)} × {servTime.toFixed(1)}) / {cycTime.toFixed(1)}
                                                            </span>
                                                        </div>

                                                        {/* Loader Idle Result */}
                                                        <div className="bg-slate-950/50 p-2 rounded border border-slate-900">
                                                            <span className="text-[9px] text-slate-500 uppercase font-semibold block font-sans">Lama Loader Idle</span>
                                                            <span className="text-sm font-extrabold text-slate-100 block mt-0.5">
                                                                {hdCount && servTime && cycTime ? `${loaderIdle.toFixed(1)} Menit` : '-'}
                                                            </span>
                                                            <span className="text-[8px] text-slate-500 block font-mono leading-tight mt-0.5">
                                                                60 - ({hdCount && servTime && cycTime ? mfAktual.toFixed(2) : '-'} × 60)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress ratio */}
                                                    {hdCount > 0 && servTime > 0 && cycTime > 0 && (
                                                        <div className="space-y-0.5 text-[10px]">
                                                            <div className="flex justify-between text-slate-400">
                                                                <span className="font-sans">Rasio Loader Wait/Idle</span>
                                                                <span className="font-sans">{loaderIdle > 0 ? `${idlePercentage.toFixed(0)}% dari 1 jam` : '0% (Tidak idle)'}</span>
                                                            </div>
                                                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full transition-all duration-300 ${percentageColor}`} 
                                                                    style={{ width: `${loaderIdle > 0 ? idlePercentage : 0}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Monitoring Cek Bugar section inside loader card */}
                                            <div className="space-y-2 pt-2 border-t border-slate-700/20">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <ClockIcon className="h-4 w-4 text-amber-500" />
                                                        <span className="text-xs font-bold text-slate-205 text-slate-200">Monitoring Cek Bugar</span>
                                                        <span className="text-[10px] text-amber-500/85 italic font-medium">
                                                            * HD wajib bergantian masuk changeshift
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                                                        <span className="text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono font-medium">
                                                            {hdUnits.length} Unit HD
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleStopwatches(loader.id)}
                                                            className="text-[10px] text-slate-405 text-slate-400 hover:text-slate-200 underline cursor-pointer select-none"
                                                        >
                                                            {loader.showStopwatches !== false ? 'Sembunyikan' : 'Tampilkan'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Stopwatch list */}
                                                {loader.showStopwatches !== false && (
                                                    hdUnits.length === 0 ? (
                                                        <div className="text-center py-2.5 bg-slate-950/20 rounded border border-dashed border-slate-800/80">
                                                            <p className="text-[10px] text-slate-500 italic">
                                                                Silakan isi "Jumlah HD" di parameter di atas untuk memulai monitoring.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in text-left">
                                                            {hdUnits.map((hd) => {
                                                                const rawTime = hd.time + (hd.isRunning && hd.startTime ? (Date.now() - hd.startTime) : 0);
                                                                return (
                                                                    <div 
                                                                        key={`${loader.id}-hd-${hd.id}`}
                                                                        className="grid grid-cols-12 items-center bg-slate-950/40 p-1.5 rounded border border-slate-800/80 hover:border-slate-705 transition-all gap-2"
                                                                    >
                                                                        {/* Name input */}
                                                                        <div className="col-span-5 flex items-center gap-1">
                                                                            <span className="text-[9px] text-slate-500 font-mono shrink-0">Unit:</span>
                                                                            <input
                                                                                type="text"
                                                                                value={hd.unitName}
                                                                                onChange={(e) => handleUpdateHDName(loader.id, hd.id, e.target.value)}
                                                                                className="bg-slate-950 border border-slate-850 rounded px-1.5 py-0.5 text-[10px] text-indigo-400 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-full"
                                                                                placeholder="HD1234"
                                                                            />
                                                                        </div>

                                                                        {/* Timer and action buttons */}
                                                                        <div className="col-span-7 flex items-center justify-between gap-1">
                                                                            {/* Timer */}
                                                                            <div className="bg-slate-950 px-1 py-0.5 border border-slate-850 rounded font-mono text-[11px] font-bold text-emerald-400 tracking-tight text-center flex-grow select-none">
                                                                                {formatStopwatch(rawTime)}
                                                                            </div>

                                                                            {/* Controls */}
                                                                            <div className="flex items-center gap-0.5 shrink-0">
                                                                                {hd.isRunning ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleStopStopwatch(loader.id, hd.id)}
                                                                                        className="p-1 bg-red-650/20 hover:bg-red-650/30 text-rose-500 border border-red-500/20 rounded transition-all active:scale-[0.98] select-none cursor-pointer"
                                                                                        title="STOP"
                                                                                    >
                                                                                        <StopIcon className="h-2.5 w-2.5" />
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleStartStopwatch(loader.id, hd.id)}
                                                                                        className="p-1 bg-emerald-650/20 hover:bg-emerald-650/30 text-emerald-400 border border-emerald-500/20 rounded transition-all active:scale-[0.98] select-none cursor-pointer"
                                                                                        title="START"
                                                                                    >
                                                                                        <PlayIcon className="h-2.5 w-2.5" />
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleResetStopwatch(loader.id, hd.id)}
                                                                                    className="p-1 bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700/20 rounded transition-all active:scale-[0.98] select-none cursor-pointer"
                                                                                    title="RESET"
                                                                                >
                                                                                    <RotateCcwIcon className="h-2.5 w-2.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                             })}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Column: Sticky Resume Card */}
                            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 lg:self-start">
                                <div className="bg-slate-800/20 rounded-xl border border-slate-700/40 p-2.5 sm:p-4 space-y-3 sm:space-y-4 animate-fade-in shadow-xl text-left">
                                    <div className="border-b border-slate-700/40 pb-1.5 sm:pb-2 flex items-center justify-between">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1 sm:gap-1.5">
                                            <ChartBarIcon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-amber-500" />
                                            <span>Resume Delay &amp; Idle</span>
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto select-none">
                                        <table className="w-full text-left text-[11px] sm:text-xs font-sans text-slate-300">
                                            <thead>
                                                <tr className="border-b border-slate-800 text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-tight font-semibold">
                                                    <th className="py-1.5 sm:py-2.5 px-0.5 sm:px-1">Unit Loader</th>
                                                    <th className="py-1.5 sm:py-2.5 px-0.5 sm:px-1 text-center font-normal">Idle by MF (m)</th>
                                                    <th className="py-1.5 sm:py-2.5 px-0.5 sm:px-1 text-center font-normal text-indigo-400">Delay CS (m)</th>
                                                    <th className="py-1.5 sm:py-2.5 px-0.5 sm:px-1 text-right text-amber-400 font-bold whitespace-nowrap">Total Idle (m)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/40">
                                                {loaders.map((loader) => {
                                                    const count = parseFloat(loader.jumlahHD) || 0;
                                                    const servTime = parseFloat(loader.servingTime) || 0;
                                                    const cycTime = parseFloat(loader.cycleTimeHD) || 0;

                                                    let mfAktual = 0;
                                                    let loaderIdle = 0;
                                                    let delayCS = 0;
                                                    let totalPCIdle = 0;
                                                    let totalTimeMs = 0;

                                                    if (count > 0 && servTime > 0 && cycTime > 0) {
                                                        mfAktual = (count * servTime) / cycTime;
                                                        loaderIdle = mfAktual >= 1 ? 0 : 60 - (mfAktual * 60);

                                                        totalTimeMs = loader.hdUnits
                                                            ? loader.hdUnits.reduce((acc, hd) => {
                                                                const rawTime = hd.time + (hd.isRunning && hd.startTime ? (Date.now() - hd.startTime) : 0);
                                                                return acc + rawTime;
                                                            }, 0)
                                                            : 0;
                                                        const totalTimeMinutes = totalTimeMs / (1000 * 60);

                                                        const fraction = 1 - (((count - 1) * servTime) / cycTime);
                                                        delayCS = fraction * totalTimeMinutes;
                                                        totalPCIdle = delayCS + ((1 - mfAktual) * (60 - totalTimeMinutes));
                                                    }

                                                    return (
                                                        <tr key={`resume-${loader.id}`} className="hover:bg-slate-800/5 transition-colors font-sans text-[10px] sm:text-[11px]">
                                                            <td className="py-1.5 sm:py-2.5 px-0.5 sm:px-1 font-semibold text-slate-200 font-mono uppercase">
                                                                {loader.name || `EX${1216 + parseInt(loader.id)}`}
                                                            </td>
                                                            <td className="py-1.5 sm:py-2 px-0.5 sm:px-1 text-center font-mono text-slate-300">
                                                                {loaderIdle.toFixed(2)}
                                                            </td>
                                                            <td className="py-1.5 sm:py-2 px-0.5 sm:px-1 text-center font-mono text-indigo-400">
                                                                {delayCS.toFixed(2)}
                                                                <span className="text-[7.5px] sm:text-[9px] text-slate-500 block leading-tight">
                                                                    ({((totalTimeMs || 0)/(60000)).toFixed(1)}m × {(1 - (((count - 1) * servTime) / cycTime)).toFixed(2)})
                                                                </span>
                                                            </td>
                                                            <td className="py-1.5 sm:py-2.5 px-0.5 sm:px-1 text-right font-mono font-bold text-amber-400 bg-amber-500/5 rounded">
                                                                {totalPCIdle.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'referensi' && (
                <div className="animate-fade-in">
                    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                        <h2 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                            <BookOpenIcon className="h-5 w-5 text-amber-500" />
                            <span>Referensi Standar &amp; Parameter Ideal</span>
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-200 mb-3 text-center">Tabel Plan Cycle Time by Jarak</h3>
                                <PlanCycleTimeTable />
                            </div>
                            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-200 mb-3 text-center">Tabel Plan Speed by Jarak</h3>
                                <SpeedTable />
                            </div>
                            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-200 mb-3 text-center">Tabel Konversi Produktivitas by Jarak</h3>
                                <ProductivityTable />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'stopwatch_cs' && (
                <StopwatchCSLoader />
            )}

            {activeTab === 'about' && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 text-left shadow-xl backdrop-blur-md animate-fade-in font-sans">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                        <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                            <LightbulbIcon className="h-6 w-6 shrink-0" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">About this Tools</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Autonomous Learning for Operational Excellence</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                        <p>
                            Efisiensi operasional alat berat merupakan faktor kritis dalam pencapaian target produksi tambang. Setiap waktu tidak produktif pada loader maupun hauler berdampak langsung pada ritase dan nilai produksi secara keseluruhan. Namun dalam praktik di lapangan, pengukuran dan analisis produktivitas fleet masih sering dilakukan secara manual, membutuhkan waktu lama, dan rentan terhadap kesalahan perhitungan yang dapat memperlambat pengambilan keputusan.
                        </p>
                        <p>
                            Tools ini hadir untuk menjawab tantangan tersebut dengan memanfaatkan teknologi kecerdasan buatan yang mampu memproses data lapangan secara cepat dan akurat. Mulai dari perhitungan Match Factor per fleet, analisis delay loader akibat changeshift, hingga evaluasi utilisasi alat dalam satu periode observasi — semua dapat diselesaikan dalam hitungan detik. Dengan demikian, pengawas lapangan dan manajemen operasional dapat mengambil keputusan berbasis data secara real-time demi peningkatan produktivitas yang konsisten dan berkelanjutan.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-slate-700/30 flex flex-col items-center justify-center gap-6">
                        <div className="flex flex-col items-center text-center gap-3 max-w-md w-full mx-auto">
                            <span className="text-xs sm:text-sm text-slate-400 font-medium">Jika ada pertanyaan, atau request fitur silahkan hubungi:</span>
                            <a 
                                href="https://wa.me/6282123781040" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/30 rounded-xl transition-all duration-300 font-bold cursor-pointer text-sm shadow-md hover:scale-102 active:scale-98"
                                title="Hubungi via WhatsApp"
                            >
                                <WhatsappIcon className="h-5 w-5 text-emerald-400 animate-pulse" />
                                <span>Hubungi via WhatsApp</span>
                            </a>
                        </div>
                        <div className="flex flex-col items-center w-full pt-4 border-t border-slate-700/10">
                            <span className="text-xs text-slate-500">Salam hangat,</span>
                            <span className="text-sm font-bold text-amber-400 mt-0.5 font-sans">Developer</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CycleTime;