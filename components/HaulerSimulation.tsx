import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, StopIcon, RotateCcwIcon, MiningTruckIcon, ClockIcon } from './icons';

interface HaulerSimulationProps {
  distance: number;
  actualHdCount: number;
  servingTime: number; // minutes
  aktualCycleTime: number; // minutes
}

interface SimHauler {
  id: number;
  state: 'queue' | 'loading' | 'traveling';
  progress: number; // minutes
  hasLoaded?: boolean;
}

export const HaulerSimulation: React.FC<HaulerSimulationProps> = ({
  distance,
  actualHdCount,
  servingTime,
  aktualCycleTime,
}) => {
  // Settings State
  const [simUnitCount, setSimUnitCount] = useState<number>(actualHdCount || 4);
  const [simDuration, setSimDuration] = useState<number>(60); // minutes
  const [simSpeed, setSimSpeed] = useState<number>(30); // Speed factor, e.g., 30x means 1s real = 30s sim

  // Running State
  const [isRunning, setIsRunning] = useState<boolean>(false);

  interface SimState {
    elapsedSimTime: number;
    totalRitasi: number;
    loaderIdleTime: number;
    totalQueueTime: number;
    haulers: SimHauler[];
    activeHaulerId: number | null;
  }

  const [simState, setSimState] = useState<SimState>({
    elapsedSimTime: 0,
    totalRitasi: 0,
    loaderIdleTime: 0,
    totalQueueTime: 0,
    haulers: [],
    activeHaulerId: null,
  });

  const {
    elapsedSimTime,
    totalRitasi,
    loaderIdleTime,
    totalQueueTime,
    haulers,
    activeHaulerId,
  } = simState;

  const travelDisposalTime = Math.max(0.1, aktualCycleTime - servingTime);

  // Initialize simulation
  const handleReset = () => {
    setIsRunning(false);

    const initialHaulers: SimHauler[] = [];
    for (let i = 1; i <= simUnitCount; i++) {
       if (i === 1) {
        initialHaulers.push({
          id: i,
          state: 'loading',
          progress: 0,
          hasLoaded: false,
        });
      } else {
        initialHaulers.push({
          id: i,
          state: 'queue',
          progress: 0,
          hasLoaded: false,
        });
      }
    }

    setSimState({
      elapsedSimTime: 0,
      totalRitasi: 0,
      loaderIdleTime: 0,
      totalQueueTime: 0,
      haulers: initialHaulers,
      activeHaulerId: simUnitCount > 0 ? 1 : null,
    });
  };

  // Keep settings synced with props when not running
  useEffect(() => {
    if (!isRunning) {
      setSimUnitCount(actualHdCount || 4);
    }
  }, [actualHdCount, isRunning]);

  // Re-init when active hd count or parameters change and simulation is reset
  useEffect(() => {
    if (simState.elapsedSimTime === 0) {
      handleReset();
    }
  }, [simUnitCount, servingTime, aktualCycleTime]);

  // Tick effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const tickRateMs = 100; // 10 ticks per second

    if (isRunning) {
      intervalId = setInterval(() => {
        const realSecsPerTick = tickRateMs / 1000;
        const simMinsPerTick = (realSecsPerTick * simSpeed) / 60;

        setSimState((prev) => {
          const nextTime = prev.elapsedSimTime + simMinsPerTick;
          if (nextTime >= simDuration) {
            setIsRunning(false);
            return {
              ...prev,
              elapsedSimTime: simDuration,
            };
          }

          let nextRitasiCount = 0;
          let newLoaderIdleTime = prev.loaderIdleTime;
          let currentLoadingId: number | null = null;
          let loaderFinishExcess = 0;
          let loaderJustFinished = false;

          // Deep copy haulers
          let updatedHaulers = prev.haulers.map((h) => ({ ...h }));

          // Calculate queue duration of haulers in this tick
          // Khusus untuk output Waktu HD Antri dihitung untuk 1 unit yang dibelakang aktivitas loading saja
          // Case khusus ketika baru memulai simulasi (cold start), waktu hd antri tidak dihitung (only count if they have been loaded at least once)
          const hasQueue = prev.haulers.some((h) => h.state === 'queue' && h.hasLoaded);
          const tickQueueTime = hasQueue ? simMinsPerTick : 0;
          const nextQueueTime = prev.totalQueueTime + tickQueueTime;

          // 1. Update progress and transition states
          updatedHaulers = updatedHaulers.map((h) => {
            if (h.state === 'traveling') {
              const nextProgress = h.progress + simMinsPerTick;
              if (nextProgress >= travelDisposalTime) {
                // Completed traveling, goes to back of queue
                return { ...h, state: 'queue' as const, progress: nextProgress - travelDisposalTime };
              }
              return { ...h, progress: nextProgress };
            } else if (h.state === 'loading') {
              const nextProgress = h.progress + simMinsPerTick;
              if (nextProgress >= servingTime) {
                // Completed loading, goes to traveling
                nextRitasiCount++;
                loaderJustFinished = true;
                loaderFinishExcess = nextProgress - servingTime;
                return { ...h, state: 'traveling' as const, progress: loaderFinishExcess, hasLoaded: true };
              }
              return { ...h, progress: nextProgress };
            } else if (h.state === 'queue') {
              // Just wait in queue, increment waiting time
              return { ...h, progress: h.progress + simMinsPerTick };
            }
            return h;
          });

          // 2. Manage Queue and Loader assigning
          const loadingActive = updatedHaulers.find((h) => h.state === 'loading');
          if (loadingActive) {
            currentLoadingId = loadingActive.id;
          } else {
            // Loader is free, who is next in line?
            // Sequential order is naturally preserved. Let's find queue haulers
            const waitingHaulers = updatedHaulers.filter((h) => h.state === 'queue');
            if (waitingHaulers.length > 0) {
              // Sort/find by progress descending to get the one who has waited the longest
              const nextInQueue = waitingHaulers.reduce((longest, current) => {
                return current.progress > longest.progress ? current : longest;
              }, waitingHaulers[0]);

              // Update this specific hauler to loading
              updatedHaulers = updatedHaulers.map((h) => {
                if (h.id === nextInQueue.id) {
                  let initialLoadProgress = 0;
                  if (loaderJustFinished) {
                    initialLoadProgress = loaderFinishExcess;
                  } else {
                    initialLoadProgress = nextInQueue.progress < simMinsPerTick ? nextInQueue.progress : 0;
                  }
                  return {
                    ...h,
                    state: 'loading' as const,
                    progress: Math.max(0, initialLoadProgress),
                  };
                }
                return h;
              });

              currentLoadingId = nextInQueue.id;
            } else {
              // No trucks in queue, loader is idle!
              newLoaderIdleTime += simMinsPerTick;
              currentLoadingId = null;
            }
          }

          return {
            elapsedSimTime: nextTime,
            totalRitasi: prev.totalRitasi + nextRitasiCount,
            loaderIdleTime: newLoaderIdleTime,
            totalQueueTime: nextQueueTime,
            haulers: updatedHaulers,
            activeHaulerId: currentLoadingId,
          };
        });
      }, tickRateMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, simSpeed, simDuration, servingTime, travelDisposalTime]);

  const progressPercent = Math.min(100, (elapsedSimTime / simDuration) * 100);

  // Helper format output
  const formatSimTime = (mins: number) => {
    const totalSecs = Math.round(mins * 60);
    const minPart = Math.floor(totalSecs / 60);
    const secPart = totalSecs % 60;
    return `${minPart}:${secPart.toString().padStart(2, '0')}`;
  };

  // Convert distance to productivity conversion code
  const getProductivityConversion = (dist: number): number | null => {
    if (dist <= 0) return null;
    if (dist <= 1.0) return 0.52;
    if (dist <= 1.5) return 0.58;
    if (dist <= 2.0) return 0.65;
    if (dist <= 2.5) return 0.72;
    if (dist <= 3.0) return 0.79;
    if (dist <= 3.5) return 0.86;
    if (dist <= 4.0) return 0.93;
    if (dist <= 4.5) return 1.02;
    if (dist <= 5.0) return 1.12;
    return 1.12 + (dist - 5.0) * 0.15; // Extrapolate
  };

  const currentHours = elapsedSimTime / 60;
  const conversionVal = getProductivityConversion(distance) || 1.0;

  // Running Productivity values
  const prodLoaderVal = currentHours > 0 ? (totalRitasi * 41) / currentHours : 0;
  const prodHaulerVal = (currentHours > 0 && simUnitCount > 0)
    ? (((totalRitasi / simUnitCount) * 41) / currentHours) / conversionVal
    : 0;

  const idlePercent = elapsedSimTime > 0 ? (loaderIdleTime / elapsedSimTime) * 100 : 0;

  // Render positions of haulers
  const getHaulerCoords = (h: SimHauler) => {
    // Width: 18% to 82%
    // Height: 25% (top) to 75% (bottom)
    const xMin = 18;
    const xMax = 82;
    const yMin = 25;
    const yMax = 75;
    const yMid = 50;

    if (h.state === 'loading') {
      return { x: xMin, y: yMid };
    }

    if (h.state === 'queue') {
      // Find position of this hauler in the current queue list
      const queueList = haulers.filter((x) => x.state === 'queue');
      const qIdx = queueList.findIndex((x) => x.id === h.id);
      
      // Line up vertically moving up from return lane (yMax) to loader (yMid)
      // 1st in queue: closer to loader (e.g., yMid + 8)
      // 2nd in queue: further away (e.g., yMid + 16), up to yMax (75)
      const queueY = Math.min(yMax, yMid + 8 + qIdx * 8);
      return { x: xMin, y: queueY };
    }

    // traveling (Full / Empty)
    const tVal = h.progress / travelDisposalTime; // 0 to 1

    if (tVal < 0.45) {
      // Hauling full (Stage 1: From left-mid, up to left-top, then right to right-top)
      const ratio = tVal / 0.45;
      if (ratio < 0.15) {
        // Move up from loader (yMid = 50) to top lane (yMin = 25)
        const subRatio = ratio / 0.15;
        return { x: xMin, y: yMid - subRatio * (yMid - yMin) };
      } else {
        // Move right along the top lane
        const subRatio = (ratio - 0.15) / 0.85;
        return { x: xMin + subRatio * (xMax - xMin), y: yMin };
      }
    } else if (tVal < 0.55) {
      // Dumping station (Stage 2: Right side, move from top-right to mid-right, and wait/dump)
      const ratio = (tVal - 0.45) / 0.1;
      if (ratio < 0.5) {
        // Move down from yMin (25) to yMid (50) at xMax (82)
        const subRatio = ratio / 0.5;
        return { x: xMax, y: yMin + subRatio * (yMid - yMin) };
      } else {
        // Parked at dumping platform
        return { x: xMax, y: yMid };
      }
    } else {
      // Returning empty (Stage 3: Move from mid-right, down to bottom-right, then left to bottom-left)
      const ratio = (tVal - 0.55) / 0.45;
      if (ratio < 0.15) {
        // Move down from yMid (50) to yMax (75) at xMax (82)
        const subRatio = ratio / 0.15;
        return { x: xMax, y: yMid + subRatio * (yMax - yMid) };
      } else {
        // Move left along the bottom lane
        const subRatio = (ratio - 0.15) / 0.85;
        return { x: xMax - subRatio * (xMax - xMin), y: yMax };
      }
    }
  };

  return (
    <div className="bg-slate-800/25 border border-slate-700/40 rounded-xl p-4 sm:p-5 shadow-xl text-left space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <MiningTruckIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">Simulasi Putaran Hauler</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-sans">
              Visualisasi real-time antrean dan sirkulasi armada fleet
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {elapsedSimTime >= simDuration ? (
            <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Selesai (Completed)
            </span>
          ) : isRunning ? (
            <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded animate-pulse">
              Simulation Active ({simSpeed}x)
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-slate-700 text-slate-400 rounded">
              Ready / Paused
            </span>
          )}
        </div>
      </div>

      {/* Control Panel: Settings */}
      <div className="bg-slate-900/20 p-3.5 sm:p-4 rounded-xl border border-slate-800/60 shadow-inner space-y-4">
        {/* Row 1: Parameter Inputs (Jumlah Unit & Durasi Observasi) dalam 1 baris */}
        <div className="grid grid-cols-2 gap-4">
          {/* Jumlah Unit */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Jumlah HD
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800/90 p-0.5 rounded-lg w-full justify-between h-[30px]">
              <button
                onClick={() => setSimUnitCount(prev => Math.max(1, prev - 1))}
                disabled={isRunning}
                className="w-7 h-6 flex items-center justify-center bg-slate-800/40 hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none rounded transition cursor-pointer text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-slate-200 text-center flex-1">
                {simUnitCount} HD
              </span>
              <button
                onClick={() => setSimUnitCount(prev => Math.min(15, prev + 1))}
                disabled={isRunning}
                className="w-7 h-6 flex items-center justify-center bg-slate-800/40 hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none rounded transition cursor-pointer text-slate-300 font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Durasi Observasi */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Durasi Observasi
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800/90 p-0.5 rounded-lg w-full justify-between h-[30px]">
              <button
                onClick={() => setSimDuration(prev => Math.max(10, prev - 10))}
                disabled={isRunning}
                className="w-7 h-6 flex items-center justify-center bg-slate-800/40 hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none rounded transition cursor-pointer text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-slate-200 text-center flex-1">
                {simDuration} m
              </span>
              <button
                onClick={() => setSimDuration(prev => Math.min(240, prev + 10))}
                disabled={isRunning}
                className="w-7 h-6 flex items-center justify-center bg-slate-800/40 hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none rounded transition cursor-pointer text-slate-300 font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Kecepatan & Kontrol Simulasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* Simulation Speed */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Kecepatan Simulasi
            </label>
            <div className="flex bg-slate-950 border border-slate-800/90 p-0.5 rounded-lg gap-0.5 text-[9px] font-bold font-sans h-[30px] items-center">
              {[5, 10, 30, 60, 120].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`flex-1 h-6 rounded transition-colors cursor-pointer flex items-center justify-center ${
                    simSpeed === spd
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Controller Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Kontrol Simulasi
            </label>
            <div className="flex items-center gap-1.5 h-[30px]">
              {isRunning ? (
                <button
                  onClick={() => setIsRunning(false)}
                  className="flex-1 h-[30px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-amber-500/10 border-none"
                >
                  <StopIcon className="h-3 w-3" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (elapsedSimTime >= simDuration) {
                      handleReset();
                    }
                    setIsRunning(true);
                  }}
                  className="flex-1 h-[30px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-indigo-500/10 border-none"
                >
                  <PlayIcon className="h-3.5 w-3.5" />
                  <span>Mulai</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex-1 h-[30px] bg-slate-700 text-slate-300 hover:bg-slate-650 hover:text-white font-semibold rounded-lg text-[11px] transition-all border border-slate-600/40 cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcwIcon className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Arena Map */}
      <div 
        className="bg-slate-950/45 rounded-xl border border-slate-800 p-4 h-[180px] relative overflow-hidden select-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(245,158,11,0.06) 0%, transparent 55%), radial-gradient(circle at 90% 50%, rgba(244,63,94,0.06) 0%, transparent 55%)'
        }}
      >
        {/* Loading Station Backdrop Label */}
        <div className="absolute left-[3%] top-[10%] text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          STASIUN MUAT (LOADING)
        </div>

        {/* Dumping Station Backdrop Label */}
        <div className="absolute right-[3%] top-[10%] text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">
          STASIUN BUANG (DUMPING)
        </div>

        {/* Road Track Circuit Contour Graphics (Connecting 18% to 82% coordinates) */}
        {/* Horizontal Lanes */}
        <div className="absolute left-[18%] right-[18%] top-[25%] h-[3px] bg-slate-800/80 rounded" />
        <div className="absolute left-[18%] right-[18%] top-[75%] h-[3px] bg-slate-800/80 rounded" />
        {/* Vertical Lanes */}
        <div className="absolute left-[18%] top-[25%] bottom-[25%] w-[3px] bg-slate-800/80 rounded" />
        <div className="absolute right-[18%] top-[25%] bottom-[25%] w-[3px] bg-slate-800/80 rounded" />
        
        {/* Dashed outer guideline circuit */}
        <div className="absolute left-[18%] right-[18%] top-[25%] bottom-[25%] border border-[1.5px] border-dashed border-slate-700/30 rounded-lg pointer-events-none" />

        {/* Direction Indicator road arrows */}
        <div className="absolute left-[50%] top-[13%] -translate-x-1/2 text-[9px] text-slate-500/80 tracking-widest uppercase font-mono font-semibold">
          {isRunning ? 'HAULING (FULL) >>>' : 'HAULING (FULL)'}
        </div>
        <div className="absolute left-[50%] bottom-[13%] -translate-x-1/2 text-[9px] text-slate-500/80 tracking-widest uppercase font-mono font-semibold">
          {isRunning ? '<<< RETURN (EMPTY)' : 'RETURN (EMPTY)'}
        </div>

        {/* Loader Excavator Platform - Left Symmetrical */}
        <div className="absolute left-[10%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-amber-500/35 bg-slate-900/90 flex items-center justify-center shadow-lg shadow-amber-500/5 z-20">
          <div className={`h-5 w-5 rounded text-amber-500 transition-transform ${activeHaulerId !== null ? 'animate-bounce' : ''}`}>
            {/* Direct Vector Excavator arm shape */}
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 18h16M7 18v-4h4v4M12 14l5-6 4 1" />
            </svg>
          </div>
          {activeHaulerId && (
            <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
        </div>

        {/* Dump Area Platform - Right Symmetrical */}
        <div className="absolute left-[90%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-rose-500/35 bg-slate-900/90 flex items-center justify-center shadow-lg shadow-rose-500/5 z-20">
          <span className="text-rose-550 text-rose-450 text-rose-500">
            <svg viewBox="0 0 24 24" className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21H3L5 11h14l2 10zM5 11l4-5h6l4 5" />
            </svg>
          </span>
        </div>

        {/* Draw Hauler Units moving */}
        {haulers.map((h) => {
          const { x, y } = getHaulerCoords(h);
          const isActive = h.state === 'loading';
          const isQueue = h.state === 'queue';
          const isReturning = h.state === 'traveling' && (h.progress / travelDisposalTime >= 0.55);

          return (
            <div
              key={h.id}
              className="absolute shrink-0 flex items-center gap-1.5 px-2 py-1 rounded border shadow-lg font-mono text-[9px] font-bold transition-all duration-200"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isQueue ? 10 : 30,
                borderColor: isActive 
                  ? 'rgba(245,158,11,0.85)' 
                  : isQueue 
                  ? 'rgba(99,102,241,0.6)' 
                  : isReturning
                  ? 'rgba(148,163,184,0.45)'
                  : 'rgba(52,211,153,0.85)',
                backgroundColor: isActive 
                  ? 'rgba(15,23,42,0.95)' 
                  : isQueue 
                  ? 'rgba(15,23,42,0.95)' 
                  : isReturning 
                  ? 'rgba(15,23,42,0.95)'
                  : 'rgba(15,23,42,0.95)',
                boxShadow: isActive
                  ? '0 4px 12px rgba(245,158,11,0.15)'
                  : isQueue
                  ? 'none'
                  : '0 4px 12px rgba(52,211,153,0.12)',
                color: isActive 
                  ? '#f59e0b' 
                  : isQueue 
                  ? '#818cf8' 
                  : isReturning 
                  ? '#94a3b8'
                  : '#34d399',
              }}
            >
              <MiningTruckIcon className={`h-3 w-3 ${isActive ? 'animate-pulse' : ''}`} />
              <span>HD-{h.id.toString().padStart(2, '0')}</span>
              <span className="text-[7.5px] scale-90 opacity-80 uppercase tracking-tight font-sans font-medium">
                ({isActive 
                  ? `muat: ${formatSimTime(Math.min(h.progress, servingTime))} / ${formatSimTime(servingTime)}` 
                  : isQueue 
                  ? `antre: ${formatSimTime(h.progress)}` 
                  : `travel: ${formatSimTime(Math.min(h.progress, travelDisposalTime))} / ${formatSimTime(travelDisposalTime)}`
                })
              </span>
            </div>
          );
        })}
      </div>

      {/* Output Panel: Metrics Area */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Metric 1: Loader Idle */}
        <div className="bg-slate-900/40 p-2 sm:p-3.5 rounded-lg border border-slate-800/60 font-sans text-left space-y-1">
          <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold block truncate">
            Loader Idle
          </span>
          <div className="text-[10px] min-[360px]:text-xs sm:text-base md:text-lg lg:text-xl font-bold text-slate-100 font-mono tracking-wide tabular-nums truncate">
            {formatSimTime(loaderIdleTime)} <span className="text-[8px] min-[360px]:text-[9px] sm:text-xs font-semibold text-slate-400">({idlePercent.toFixed(1)}%)</span>
          </div>
          <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight truncate">
            Menunggu armada
          </span>
        </div>

        {/* Metric 2: Waktu HD Antri */}
        <div className="bg-slate-900/40 p-2 sm:p-3.5 rounded-lg border border-slate-800/60 font-sans text-left space-y-1">
          <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold block truncate">
            Waktu HD Antri
          </span>
          <div className="text-[10px] min-[360px]:text-xs sm:text-base md:text-lg lg:text-xl font-bold text-indigo-400 font-mono tracking-wide tabular-nums truncate">
            {formatSimTime(totalQueueTime)}
          </div>
          <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight truncate">
            Unit di belakang loader
          </span>
        </div>

        {/* Metric 3: Ritasi */}
        <div className="bg-slate-900/40 p-2 sm:p-3.5 rounded-lg border border-slate-800/60 font-sans text-left space-y-1">
          <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold block truncate">
            Jumlah Ritasi
          </span>
          <div className="text-[10px] min-[360px]:text-xs sm:text-base md:text-lg lg:text-xl font-extrabold text-amber-500 font-mono tracking-wide tabular-nums truncate">
            {totalRitasi} <span className="text-[8px] min-[360px]:text-[9px] sm:text-xs font-semibold text-slate-400">Rit</span>
          </div>
          <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight truncate">
            Muatan selesai
          </span>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 font-semibold select-none">
          <span>PROGRESS SIMULASI: {formatSimTime(elapsedSimTime)}</span>
          <span>DURASI OBSERVASI: {simDuration}:00</span>
        </div>
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
