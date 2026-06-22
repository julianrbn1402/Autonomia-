import React, { useState, useEffect, useRef } from 'react';
import { TimerIcon, PlusIcon, TrashIcon, PlayIcon, StopIcon, RotateCcwIcon, ClockIcon, WhatsappIcon } from './icons';
import html2canvas from 'html2canvas';

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

    const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);
    const [screenshotResult, setScreenshotResult] = useState<string | null>(null);
    const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [copiedSuccess, setCopiedSuccess] = useState(false);
    const [copyError, setCopyError] = useState(false);

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

    const handleResetAll = () => {
        setLoaders(prev => prev.map(l => ({
            ...l,
            isRunning: false,
            elapsedMs: 0,
            startTime: null
        })));
    };

    // Helper function to convert base64 image data to a native Blob synchronously
    const dataURItoBlob = (dataURI: string) => {
        try {
            const splitData = dataURI.split(',');
            const byteString = atob(splitData[1]);
            const mimeString = splitData[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        } catch (e) {
            console.error('Error converting data URI to Blob:', e);
            return null;
        }
    };

    // Capture area callback using a layout-stabilized off-screen template
    const handleShareToWhatsApp = async () => {
        setIsGeneratingScreenshot(true);
        let container: HTMLDivElement | null = null;
        try {
            // Create a temporary container for perfect high-definition representation
            container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '0';
            container.style.top = '0';
            container.style.zIndex = '-9999';
            container.style.width = '620px'; // Stabilized width for beautiful layout
            container.style.backgroundColor = '#0b0f19'; // Deep rich blue-black
            container.style.padding = '28px';
            container.style.borderRadius = '24px';
            container.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
            container.style.color = '#f8fafc'; // Slate 50
            container.style.border = '2px solid #1e293b'; // Slate 800 premium outline
            container.style.boxSizing = 'border-box';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '24px';
            container.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';

            // 1. Header Banner of AUTONOMIA (Symmetrically Centered Layout)
            const header = document.createElement('div');
            header.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.5) 100%)';
            header.style.padding = '24px 20px';
            header.style.borderRadius = '16px';
            header.style.border = '1.5px solid rgba(245, 158, 11, 0.25)';
            header.style.display = 'flex';
            header.style.flexDirection = 'column'; // Center-aligned stacked layout for absolute symmetry
            header.style.alignItems = 'center';
            header.style.justifyContent = 'center';
            header.style.gap = '8px';
            header.style.textAlign = 'center';
            header.style.boxSizing = 'border-box';

            const logoContainer = document.createElement('div');
            logoContainer.style.display = 'flex';
            logoContainer.style.alignItems = 'center';
            logoContainer.style.justifyContent = 'center';
            logoContainer.style.gap = '10px';

            const pulseDot = document.createElement('span');
            pulseDot.style.height = '10px';
            pulseDot.style.width = '10px';
            pulseDot.style.borderRadius = '50%';
            pulseDot.style.backgroundColor = '#f59e0b'; // amber-500
            pulseDot.style.boxShadow = '0 0 12px #f59e0b';
            pulseDot.style.display = 'inline-block';

            const title = document.createElement('h2');
            title.innerText = 'AUTONOMIA';
            title.style.fontSize = '28px'; // Enlarged and prominent like the big application title
            title.style.fontWeight = '900';
            title.style.letterSpacing = '0.18em';
            // We use solid amber-400 to guarantee perfect high-contrast rendering since gradients are highly broken in html2canvas!
            title.style.color = '#fbbf24'; 
            title.style.fontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
            title.style.margin = '0';
            title.style.textShadow = '0 2px 5px rgba(0,0,0,0.4)';

            logoContainer.appendChild(pulseDot);
            logoContainer.appendChild(title);

            const subtitle = document.createElement('p');
            subtitle.innerText = 'Multi Stopwatch • Monitoring Operational';
            subtitle.style.fontSize = '12px';
            subtitle.style.color = '#cbd5e1'; // Slate 300 for crisp readability
            subtitle.style.margin = '0';
            subtitle.style.fontWeight = '600';
            subtitle.style.letterSpacing = '0.04em';
            subtitle.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            subtitle.style.textTransform = 'uppercase';

            const timestamp = document.createElement('div');
            const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            timestamp.innerText = `${dateStr}  •  ${timeStr}`;
            timestamp.style.fontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
            timestamp.style.fontSize = '11px';
            timestamp.style.fontWeight = '700';
            timestamp.style.color = '#94a3b8'; // Slate 400
            timestamp.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; // slate-900 background shadow
            timestamp.style.padding = '6px 14px';
            timestamp.style.borderRadius = '8px';
            timestamp.style.border = '1px solid #1e293b'; // slate-800
            timestamp.style.marginTop = '4px';

            header.appendChild(logoContainer);
            header.appendChild(subtitle);
            header.appendChild(timestamp);
            container.appendChild(header);

            // 2. Stopwatch grid
            const cardsContainer = document.createElement('div');
            cardsContainer.style.display = 'grid';
            if (loaders.length === 1) {
                cardsContainer.style.gridTemplateColumns = '1fr';
            } else {
                cardsContainer.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
            }
            cardsContainer.style.gap = '14px';
            cardsContainer.style.boxSizing = 'border-box';

            loaders.forEach((loader, index) => {
                const card = document.createElement('div');
                card.style.backgroundColor = '#0f172a'; // Slate 900 solid for maximum text contrast
                card.style.padding = '20px';
                card.style.borderRadius = '16px';
                // Use a consistent border width of 2px to ensure perfect visual alignment and prevent asymmetric sizing shifts!
                card.style.border = loader.isRunning ? '2px solid rgba(245, 158, 11, 0.45)' : '2px solid #1e293b'; 
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.justifyContent = 'space-between';
                card.style.boxSizing = 'border-box';
                card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';

                // Span full columns if there is an odd number and this is the last card (preserves perfect visual balance!)
                if (loaders.length > 1 && loaders.length % 2 !== 0 && index === loaders.length - 1) {
                    card.style.gridColumn = 'span 2';
                }

                // Item Header
                const itemHeader = document.createElement('div');
                itemHeader.style.display = 'flex';
                itemHeader.style.alignItems = 'center';
                itemHeader.style.gap = '10px';
                itemHeader.style.paddingBottom = '12px';
                itemHeader.style.borderBottom = '1px solid #1e293b';

                const itemDot = document.createElement('div');
                itemDot.style.height = '8px';
                itemDot.style.width = '8px';
                itemDot.style.borderRadius = '50%';
                itemDot.style.backgroundColor = loader.isRunning ? '#10b981' : '#64748b'; // Emerald active green or slate
                itemDot.style.boxShadow = loader.isRunning ? '0 0 8px #10b981' : 'none';

                const itemName = document.createElement('span');
                itemName.innerText = loader.unitName || 'Unit Loader';
                itemName.style.fontSize = '16px'; // Dynamic large label
                itemName.style.fontWeight = '800'; // Super bold for maximum legibility!
                itemName.style.color = '#ffffff'; // Pure white
                itemName.style.whiteSpace = 'normal';
                itemName.style.wordBreak = 'break-word';
                itemName.style.flex = '1';
                itemName.style.minWidth = '0';
                itemName.style.letterSpacing = '0.01em';

                itemHeader.appendChild(itemDot);
                itemHeader.appendChild(itemName);
                card.appendChild(itemHeader);

                // Time Display
                const timeDisplay = document.createElement('div');
                timeDisplay.style.padding = '20px 0 10px 0';
                timeDisplay.style.textAlign = 'center';

                const timeValue = document.createElement('div');
                timeValue.innerText = formatTime(loader.elapsedMs);
                timeValue.style.fontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
                timeValue.style.fontSize = '26px'; // Perfect crisp size
                timeValue.style.fontWeight = '700';
                timeValue.style.letterSpacing = '0.04em';
                timeValue.style.color = '#fbbf24'; // Amber-400
                timeValue.style.textShadow = '0 1px 2px rgba(0,0,0,0.6)';

                const statusLabel = document.createElement('span');
                statusLabel.innerText = loader.isRunning ? '● RUNNING' : '■ PAUSED';
                statusLabel.style.fontSize = '10px';
                statusLabel.style.fontWeight = '800';
                statusLabel.style.letterSpacing = '0.12em';
                statusLabel.style.color = loader.isRunning ? '#34d399' : '#94a3b8'; // clear colored state
                statusLabel.style.display = 'inline-block';
                statusLabel.style.marginTop = '8px';
                statusLabel.style.backgroundColor = loader.isRunning ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)';
                statusLabel.style.padding = '4px 10px';
                statusLabel.style.borderRadius = '20px';

                timeDisplay.appendChild(timeValue);
                timeDisplay.appendChild(statusLabel);
                card.appendChild(timeDisplay);

                cardsContainer.appendChild(card);
            });

            container.appendChild(cardsContainer);

            // 3. Mini Footer Branding at bottom of Image
            const footerBranding = document.createElement('div');
            footerBranding.style.textAlign = 'center';
            footerBranding.style.paddingTop = '10px';
            footerBranding.style.borderTop = '1px solid #1e293b';
            footerBranding.style.color = '#475569';
            footerBranding.style.fontSize = '11px';
            footerBranding.style.fontWeight = '600';
            footerBranding.style.letterSpacing = '0.05em';
            footerBranding.innerText = 'DIBUAT SECARA OTOMATIS OLEH APLIKASI WEB AUTONOMIA';
            container.appendChild(footerBranding);

            // Append to body to get rendered correctly by browser DOM engine
            document.body.appendChild(container);

            // Short timeout to let layout settle perfectly in browser DOM
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture screenshot of the dedicated container (scale 2.0 is highly optimized and memory-friendly in iframe)
            const canvas = await html2canvas(container, {
                backgroundColor: '#070a13', // Deep navy black match
                scale: 2.0, // Reduced from 2.5 to avoid memory allocation or out-of-memory crashes on mobile/iframe
                logging: false,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
            });

            const dataUrl = canvas.toDataURL('image/png');
            setScreenshotResult(dataUrl);

            const blob = dataURItoBlob(dataUrl);
            setScreenshotBlob(blob);

            setShowModal(true);
        } catch (error) {
            console.error('Offscreen canvas capture failed, retrying on visible element...', error);

            // FALLBACK: Try to capture the live element on the screen directly!
            try {
                const liveElement = document.getElementById('autonomia-stopwatch-results');
                if (liveElement) {
                    const canvas = await html2canvas(liveElement, {
                        backgroundColor: '#020617', // Match slate-950
                        scale: 2.0,
                        logging: false,
                        useCORS: true,
                        allowTaint: true,
                    });
                    const dataUrl = canvas.toDataURL('image/png');
                    setScreenshotResult(dataUrl);

                    const blob = dataURItoBlob(dataUrl);
                    setScreenshotBlob(blob);

                    setShowModal(true);
                } else {
                    alert('Gagal mengambil screenshot: Elemen tidak ditemukan.');
                }
            } catch (fallbackError) {
                console.error('Fallback capture also failed:', fallbackError);
                alert('Gagal membuat screenshot gambar. Silakan coba lagi.');
            }
        } finally {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            setIsGeneratingScreenshot(false);
        }
    };

    // Copy captured image to clipboard (fully synchronous & direct gesture friendly)
    const handleCopyImage = async () => {
        let blobToCopy = screenshotBlob;

        // If not already preloaded, generate it synchronously from the data URI
        if (!blobToCopy && screenshotResult) {
            blobToCopy = dataURItoBlob(screenshotResult);
        }

        if (!blobToCopy) return;

        try {
            if (typeof ClipboardItem !== 'undefined') {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blobToCopy.type]: blobToCopy
                    })
                ]);
                setCopiedSuccess(true);
                setCopyError(false);
                setTimeout(() => setCopiedSuccess(false), 3000);
            } else {
                throw new Error('ClipboardItem API not supported on this browser');
            }
        } catch (err) {
            console.warn('Direct fast-copy failed:', err);
            // Show custom manual copy warning inside the modal
            setCopyError(true);
            setTimeout(() => setCopyError(false), 8000);
        }
    };

    // Download captured image file
    const handleDownloadImage = () => {
        if (!screenshotResult) return;
        const link = document.createElement('a');
        link.download = `AUTONOMIA-Stopwatch-${Date.now()}.png`;
        link.href = screenshotResult;
        link.click();
    };

    // Open WhatsApp directly without any caption text (image-only sharing via paste)
    const getWhatsAppUrl = () => {
        // Enforce safe API redirect by passing a non-empty space parameter. 
        // Bypasses the "couldn't open this chat link" WhatsApp API validation error.
        return `https://api.whatsapp.com/send?text=%20`;
    };

    // Advanced, frictionless sharing to WhatsApp: Attempt native Web Share first (great for mobile),
    // otherwise auto-copy the screenshot image to clipboard and automatically open WhatsApp chat!
    const handleWhatsAppShareWithAutoCopy = async () => {
        let blobToCopy = screenshotBlob;
        if (!blobToCopy && screenshotResult) {
            blobToCopy = dataURItoBlob(screenshotResult);
        }

        if (!blobToCopy) {
            alert('Gambar belum siap, silakan tunggu sebentar atau klik "Salin Gambar" secara manual.');
            return;
        }

        const file = new File([blobToCopy], 'autonomia-stopwatch.png', { type: 'image/png' });

        // Phase 1: Try Native system share API (Outstanding for mobile WA, attaches image natively!)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'AUTONOMIA - Multi Stopwatch',
                });
                return; // Shared natively with success!
            } catch (shareErr) {
                console.warn('Native Web Share aborted/failed, using copy+redirect fallback:', shareErr);
            }
        }

        // Phase 2: Copy image programmatically to clipboard
        let isCopied = false;
        try {
            if (typeof ClipboardItem !== 'undefined') {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blobToCopy.type]: blobToCopy
                    })
                ]);
                isCopied = true;
                setCopiedSuccess(true);
                setCopyError(false);
                setTimeout(() => setCopiedSuccess(false), 4000);
            }
        } catch (copyErr) {
            console.warn('Auto copy within share failed:', copyErr);
            setCopyError(true);
            setTimeout(() => setCopyError(false), 8000);
        }

        // Phase 3: Redirect to WhatsApp Web/App
        const waUrl = getWhatsAppUrl();
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="animate-fade-in space-y-4 sm:space-y-6">

            {/* Container to capture (Including AUTONOMIA title at the top and stopwatch data) */}
            <div id="autonomia-stopwatch-results" className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4">
                
                {/* Header Banner - AUTONOMIA */}
                <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/5 to-transparent p-4 rounded-xl border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 decoration-clone">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 font-mono">
                                AUTONOMIA
                            </h2>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-sans tracking-wide font-medium">
                            Multi Stopwatch • Monitoring Operational
                        </p>
                    </div>
                    {/* Timestamp for screenshot validity */}
                    <div className="text-right text-[9px] sm:text-[10px] font-mono text-slate-500 bg-slate-900/40 px-2 py-1 rounded border border-slate-800">
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {/* Empty state or Bento Grid of loaders */}
                {loaders.length === 0 ? (
                    <div className="bg-slate-850/20 border border-slate-900 p-12 sm:p-16 rounded-xl text-center max-w-sm mx-auto space-y-4">
                        <TimerIcon className="h-10 w-10 text-slate-750 mx-auto animate-pulse" />
                        <h3 className="text-sm font-bold text-slate-300">Belum ada Unit Loader CS</h3>
                        <p className="text-slate-500 text-xs leading-relaxed font-sans">
                            Klik tombol tambah untuk mendaftarkan Unit Loader yang mengalami delay CS serta memonitor stopwatch waktunya secara langsung.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {loaders.map((loader) => {
                            return (
                                <div 
                                    key={loader.id} 
                                    className={`bg-slate-900/50 p-2 sm:p-3.5 rounded-lg sm:rounded-xl border transition-all duration-300 shadow-md flex flex-col justify-between ${
                                        loader.isRunning 
                                            ? 'border-amber-500/40 ring-1 ring-amber-500/10 bg-slate-900/70' 
                                            : 'border-slate-800/80 hover:border-slate-700/80'
                                    }`}
                                >
                                    {/* Header of each card: Input Name & Status */}
                                    <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 pb-1.5 border-b border-slate-800/85">
                                        <div className="flex items-center gap-1 sm:gap-2 flex-grow min-w-0">
                                            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${loader.isRunning ? 'bg-amber-500 animate-pulse' : 'bg-slate-650'}`}></div>
                                            <input
                                                type="text"
                                                value={loader.unitName}
                                                onChange={(e) => handleUpdateName(loader.id, e.target.value)}
                                                placeholder="Unit Loader"
                                                className="bg-transparent font-sans text-[10px] sm:text-xs font-bold text-slate-200 hover:bg-slate-950/40 focus:bg-slate-950/80 focus:ring-1 focus:ring-amber-500/30 rounded px-1 py-0.5 border-none outline-none w-full transition truncate"
                                                title="Klik untuk mengubah nama unit (Diisi Manual)"
                                            />
                                        </div>
                                        {/* Button outside captured bounds inside UI visually or we allow it to be captured */}
                                        <button
                                            onClick={() => handleDelete(loader.id)}
                                            className="text-slate-500 hover:text-rose-400 p-0.5 sm:p-1 rounded hover:bg-slate-800/50 transition-colors shrink-0 cursor-pointer"
                                            title="Hapus unit loader"
                                            data-html2canvas-ignore="true" // Excludes Delete button from screenshot for a super clean print!
                                        >
                                            <TrashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </button>
                                    </div>

                                    {/* Monospaced digital display */}
                                    <div className="py-2.5 sm:py-4 text-center select-none font-sans">
                                        <div className="font-mono text-xs sm:text-lg md:text-xl font-bold tracking-wider text-amber-400 tabular-nums">
                                            {formatTime(loader.elapsedMs)}
                                        </div>
                                        <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-semibold block mt-0.5">
                                            {loader.isRunning ? 'Running' : 'Paused'}
                                        </span>
                                    </div>

                                    {/* Controls (Excluded from screenshots for cleaner files) */}
                                    <div className="grid grid-cols-2 gap-1 sm:gap-2 pt-1.5 border-t border-slate-800/60" data-html2canvas-ignore="true">
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
                                                className="w-full flex items-center justify-center gap-0.5 sm:gap-1 py-1 px-1 bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-slate-100 font-semibold rounded text-[9px] sm:text-[11px] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer border border-slate-700/30"
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

            {/* Controls panel (Add unit, Reset All, and WhatsApp Screenshot Share button) */}
            <div className="flex flex-wrap items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 gap-3">
                <div className="text-left flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">Aksi Stopwatch</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                    <button
                        onClick={handleResetAll}
                        disabled={loaders.length === 0}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider transition-all border border-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleAddLoader}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                        <PlusIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>Unit</span>
                    </button>
                    
                    {/* Share to WhatsApp Button */}
                    <button
                        onClick={handleShareToWhatsApp}
                        disabled={loaders.length === 0 || isGeneratingScreenshot}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 text-white font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer disabled:pointer-events-none"
                    >
                        {isGeneratingScreenshot ? (
                            <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <WhatsappIcon className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span>{isGeneratingScreenshot ? 'Processing...' : 'Share WA'}</span>
                    </button>
                </div>
            </div>

            {/* Modal Dialog for Screenshot Sharing */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800/80 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] ring-1 ring-emerald-500/15">
                        
                        {/* Modal Header */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/30 to-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                                    <WhatsappIcon className="h-5 w-5 shrink-0" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-slate-100 tracking-wide font-sans">Share ke WhatsApp</h3>
                                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">BAGIKAN PRESTASI & MONITORING OPERATOR SECARA MUDAH</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setScreenshotResult(null);
                                }}
                                className="text-slate-400 hover:text-white transition-colors text-xl font-bold p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left">
                            {/* Browser/Iframe Context Checker */}
                            {typeof window !== 'undefined' && window.self !== window.top && (
                                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3.5 rounded-xl text-[11px] leading-relaxed font-sans flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
                                        <span>⚠️</span> DETEKSI MODE PREVIEW IFRAME
                                    </div>
                                    <p>
                                        Browser melarang pengambilan Clipboard otomatis di dalam Frame ini. Untuk kenyamanan fitur <strong>Auto-Salin + Auto-Buka</strong>, Anda disarankan membuka aplikasi di:
                                    </p>
                                    <a 
                                        href={window.location.href} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="self-start inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-colors mt-1"
                                    >
                                        Buka di Tab Baru ↗
                                    </a>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-slate-950 to-slate-900/80 p-4 rounded-xl border border-slate-800/90 text-xs text-slate-350 space-y-2.5 font-sans leading-relaxed">
                                <p className="font-bold text-amber-400 flex items-center gap-1.5 text-xs sm:text-sm mb-1 uppercase tracking-wide">
                                    <span>💡</span> CARA PASTI BERHASIL BERBAGI KE WHATSAPP:
                                </p>
                                <div className="flex items-start gap-2">
                                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-800 text-[10px] shrink-0 text-white font-bold font-mono">1</span>
                                    <p>Klik tombol hijau <strong className="text-emerald-400 font-semibold underline">Auto-Salin & Buka WhatsApp</strong> di bawah. Gambar akan disalin otomatis & WhatsApp akan terbuka.</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-800 text-[10px] shrink-0 text-white font-bold font-mono">2</span>
                                    <p>Di ruang obrolan WhatsApp, cukup tekan tombol <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl + V</strong> (atau klik kanan lalu pilih <strong>Paste/Tempel</strong>) untuk langsung mengirimkan gambar stopwatch!</p>
                                </div>
                                <div className="flex items-start gap-2 text-slate-455 border-t border-slate-800/60 pt-2 mt-1">
                                    <span className="text-[11px]">🔧</span>
                                    <p><strong className="text-slate-250">Gagal salin otomatis?</strong> Cukup <strong className="text-amber-400 font-semibold">klik kanan / tekan lama</strong> pada foto preview di bawah ini, lalu pilih <strong className="text-white">Salin Gambar (Copy Image)</strong>, selanjutnya Paste di WhatsApp.</p>
                                </div>
                            </div>

                            {/* Captured Image Preview */}
                            {screenshotResult && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-sans">
                                            Hasil Akhir Screenshot Gambar:
                                        </span>
                                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">HD QUALITY</span>
                                    </div>
                                    <div className="border border-slate-800 p-2.5 bg-slate-950 rounded-xl overflow-hidden select-none max-h-72 flex items-center justify-center relative group">
                                        <img 
                                            src={screenshotResult} 
                                            alt="AUTONOMIA Stopwatch Screenshot Preview" 
                                            className="max-h-64 max-w-full rounded-lg border border-slate-800 shadow-md object-contain transition group-hover:scale-[1.01] duration-300"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 py-2 bg-slate-950/90 text-[10px] text-slate-400 text-center font-medium border-t border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Preview resolusi aslinya sangat tajam & terbaca
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Toast alerts for status validation */}
                            {copiedSuccess && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-center animate-fade-in shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2">
                                    <span>✓</span> <span>Gambar berhasil disalin ke clipboard! Silakan paste ke WhatsApp.</span>
                                </div>
                            )}
                            
                            {copyError && (
                                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl text-[11px] sm:text-xs leading-relaxed animate-fade-in">
                                    ⚠️ Platform membatasi clipboard otomatis. Silakan klik kanan gambar pratinjau di atas, pilih <strong className="text-white font-semibold">Salin Gambar (Copy Image)</strong>, atau gunakan tombol download di bawah ini.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800/80 flex flex-col gap-2.5">
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    onClick={handleCopyImage}
                                    className="py-3 px-4 bg-slate-900 hover:bg-slate-850 active:scale-[0.98] text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600 shadow-sm font-sans"
                                >
                                    <span>✂ Salin Gambar (Clipboard)</span>
                                </button>
                                <button
                                    onClick={handleDownloadImage}
                                    className="py-3 px-4 bg-slate-900 hover:bg-slate-850 active:scale-[0.98] text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700/50 hover:border-slate-600 shadow-sm font-sans"
                                >
                                    <span>📥 Download Gambar PNG</span>
                                </button>
                            </div>

                            <button
                                onClick={handleWhatsAppShareWithAutoCopy}
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 text-center font-sans"
                            >
                                <WhatsappIcon className="h-5 w-5 shrink-0 fill-current" />
                                <span>Auto-Salin & Buka WhatsApp</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

