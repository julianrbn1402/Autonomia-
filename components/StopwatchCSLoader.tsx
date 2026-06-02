import React, { useState, useEffect, useRef } from 'react';
import { TimerIcon, PlusIcon, TrashIcon, PlayIcon, StopIcon, RotateCcwIcon, ClockIcon } from './icons';

interface CSLoaderItem {
    id: string;
    unitName: string;
    elapsedMs: number;
    isRunning: boolean;
    startTime: number | null;
}

export const StopwatchCSLoader: React.FC = () => {
    const [loaders, setLoaders] = useState<CSLoaderItem[]>(() => {
        try {
            const saved = localStorage.getItem('autonomia_stopwatch_cs_loaders');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Reset startTime on reload so we don't drift, but keep accumulated times
                return parsed.map((item: any) => ({
                    ...item,
                    isRunning: false,
                    startTime: null,
                }));
            }
        } catch (e) {
            console.error('Failed to parse saved loaders:', e);
        }
        return [
            { id: '1', unitName: 'Loader EX-01', elapsedMs: 0, isRunning: false, startTime: null },
            { id: '2', unitName: 'Loader EX-02', elapsedMs: 0, isRunning: false, startTime: null },
        ];
    });

    // Save to localStorage whenever loaders change
    useEffect(() => {
        localStorage.setItem('autonomia_stopwatch_cs_loaders', JSON.stringify(loaders));
    }, [loaders]);

    // Timer effect using requestAnimationFrame/sub-second interval for real-time accuracy
    useEffect(() => {
        let timerId: any = null;
        const hasRunning = loaders.some(l => l.isRunning);

        if (hasRunning) {
            timerId = setInterval(() => {
                setLoaders(prev => prev.map(loader => {
                    if (loader.isRunning && loader.startTime !== null) {
                        const now = Date.now();
                        const diff = now - loader.startTime;
                        return {
                            ...loader,
                            elapsedMs: loader.elapsedMs + diff,
                            startTime: now
                        };
                    }
                    return loader;
                }));
            }, 50); // Tick every 50ms for smooth centisecond resolution
        }

        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [loaders]);

    // Format millisecond duration into: HH:MM:SS.CC (Hours, Minutes, Seconds, Centiseconds)
    const formatTime = (totalMs: number): string => {
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const cs = Math.floor((totalMs % 1000) / 10);

        const pad = (n: number) => n.toString().padStart(2, '0');

        if (h > 0) {
            return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
        }
        return `${pad(m)}:${pad(s)}.${pad(cs)}`;
    };

    // Actions
    const handleAddLoader = () => {
        const nextNum = loaders.length + 1;
        const newLoader: CSLoaderItem = {
            id: Date.now().toString(),
            unitName: `Loader EX-${nextNum.toString().padStart(2, '0')}`,
            elapsedMs: 0,
            isRunning: false,
            startTime: null
        };
        setLoaders(prev => [...prev, newLoader]);
    };

    const handleUpdateName = (id: string, name: string) => {
        setLoaders(prev => prev.map(l => l.id === id ? { ...l, unitName: name } : l));
    };

    const handleStart = (id: string) => {
        setLoaders(prev => prev.map(l => {
            if (l.id === id) {
                return {
                    ...l,
                    isRunning: true,
                    startTime: Date.now()
                };
            }
            return l;
        }));
    };

    const handlePause = (id: string) => {
        setLoaders(prev => prev.map(l => {
            if (l.id === id) {
                if (l.isRunning && l.startTime !== null) {
                    const diff = Date.now() - l.startTime;
                    return {
                        ...l,
                        isRunning: false,
                        elapsedMs: l.elapsedMs + diff,
                        startTime: null
                    };
                }
                return { ...l, isRunning: false, startTime: null };
            }
            return l;
        }));
    };

    const handleReset = (id: string) => {
        setLoaders(prev => prev.map(l => {
            if (l.id === id) {
                return {
                    ...l,
                    isRunning: false,
                    elapsedMs: 0,
                    startTime: null
                };
            }
            return l;
        }));
    };

    const handleDelete = (id: string) => {
        setLoaders(prev => prev.filter(l => l.id !== id));
    };

    const handleStartAll = () => {
        setLoaders(prev => prev.map(l => {
            if (!l.isRunning) {
                return { ...l, isRunning: true, startTime: Date.now() };
            }
            return l;
        }));
    };

    const handlePauseAll = () => {
        setLoaders(prev => prev.map(l => {
            if (l.isRunning && l.startTime !== null) {
                const diff = Date.now() - l.startTime;
                return { ...l, isRunning: false, elapsedMs: l.elapsedMs + diff, startTime: null };
            }
            return { ...l, isRunning: false, startTime: null };
        }));
    };

    const handleResetAll = () => {
        setLoaders(prev => prev.map(l => ({
            ...l,
            isRunning: false,
            elapsedMs: 0,
            startTime: null
        })));
    };

    return (
        <div className="animate-fade-in space-y-4 sm:space-y-6">

            {/* Controls panel */}
            <div className="flex flex-wrap items-center justify-between bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 gap-2.5">
                <div className="text-left flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">Stopwatch Loader</h3>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                    <button
                        onClick={handleResetAll}
                        disabled={loaders.length === 0}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider transition-all border border-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleAddLoader}
                        className="py-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-md shadow-amber-500/10 cursor-pointer"
                    >
                        <PlusIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>Add Loader</span>
                    </button>
                </div>
            </div>

            {/* Empty state or Bento Grid of loaders */}
            {loaders.length === 0 ? (
                <div className="bg-slate-800/20 border border-slate-800 p-12 sm:p-16 rounded-xl text-center max-w-md mx-auto space-y-4">
                    <TimerIcon className="h-10 w-10 text-slate-600 mx-auto animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-300">Belum ada Unit Loader CS</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-sans">
                        Klik tombol tambah untuk mendaftarkan Unit Loader yang mengalamai delay CS serta memonitor stopwatch waktunya secara langsung.
                    </p>
                    <button
                        onClick={handleAddLoader}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase transition cursor-pointer"
                    >
                        Tambah Loader Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    {loaders.map((loader) => {
                        return (
                            <div 
                                key={loader.id} 
                                className={`bg-slate-800/40 p-2 sm:p-3.5 rounded-lg sm:rounded-xl border transition-all duration-300 shadow-md flex flex-col justify-between ${
                                    loader.isRunning 
                                        ? 'border-amber-500/45 ring-1 ring-amber-500/20 bg-slate-800/50' 
                                        : 'border-slate-700/55 hover:border-slate-600'
                                }`}
                            >
                                {/* Header of each card: Input Name & Status */}
                                <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 pb-1.5 border-b border-slate-700/35">
                                    <div className="flex items-center gap-1 sm:gap-2 flex-grow min-w-0">
                                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${loader.isRunning ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                        <input
                                            type="text"
                                            value={loader.unitName}
                                            onChange={(e) => handleUpdateName(loader.id, e.target.value)}
                                            placeholder="Unit Loader"
                                            className="bg-transparent font-sans text-[10px] sm:text-xs font-bold text-slate-200 hover:bg-slate-950/40 focus:bg-slate-950/80 focus:ring-1 focus:ring-amber-500/30 rounded px-1 py-0.5 border-none outline-none w-full transition truncate"
                                            title="Klik untuk mengubah nama unit (Diisi Manual)"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(loader.id)}
                                        className="text-slate-500 hover:text-rose-455 p-0.5 sm:p-1 rounded hover:bg-slate-700/40 transition-colors shrink-0 cursor-pointer"
                                        title="Hapus unit loader"
                                    >
                                        <TrashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </button>
                                </div>

                                {/* Monospaced digital display */}
                                <div className="py-2.5 sm:py-4 text-center select-none font-sans">
                                    <div className="font-mono text-sm sm:text-xl md:text-2xl font-bold tracking-wider text-amber-400 tabular-nums">
                                        {formatTime(loader.elapsedMs)}
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-semibold block mt-0.5">
                                        {loader.isRunning ? 'Running' : 'Paused'}
                                    </span>
                                </div>

                                {/* Controls */}
                                <div className="grid grid-cols-2 gap-1 sm:gap-2 pt-1.5 border-t border-slate-700/20">
                                    <div>
                                        {loader.isRunning ? (
                                            <button
                                                onClick={() => handlePause(loader.id)}
                                                className="w-full flex items-center justify-center gap-0.5 sm:gap-1 py-1 px-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[9px] sm:text-[11px] transition-colors cursor-pointer"
                                            >
                                                <StopIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                                <span>Pause</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStart(loader.id)}
                                                className="w-full flex items-center justify-center gap-0.5 sm:gap-1 py-1 px-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[9px] sm:text-[11px] transition-colors cursor-pointer"
                                            >
                                                <PlayIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                                <span>Start</span>
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleReset(loader.id)}
                                            disabled={loader.elapsedMs === 0}
                                            className="w-full flex items-center justify-center gap-0.5 sm:gap-1 py-1 px-1 bg-slate-700 text-slate-300 hover:bg-slate-650 hover:text-slate-100 font-semibold rounded text-[9px] sm:text-[11px] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer border border-slate-650/35"
                                        >
                                            <RotateCcwIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                            <span>Reset</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
