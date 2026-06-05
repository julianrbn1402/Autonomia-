import React, { useState, useEffect } from 'react';
import { ClipboardIcon, TrashIcon, PlusIcon, WhatsappIcon, PlayIcon, PauseIcon, RotateCcwIcon } from './icons';

interface RoadReport {
  id: string;
  namaGL: string;
  lokasi: string;
  hariTanggal: string;
  segmenJalan: string;
  panjangSegmen?: string;
  jenisKerusakan: string;
  action: string;
  statusRambu: 'Terpasang' | 'Belum Terpasang' | 'Perlu Ditambah';
  timeStamp: string;
  fotoBefore?: string;
  fotoAfter?: string;
  beforeStopwatch?: number; // seconds
  afterStopwatch?: number; // seconds
  beforeSpeed?: number;     // km/h
  afterSpeed?: number;      // km/h
}

const DAMAGE_TYPES = [
  'Jalan Berlubang (Potholes)',
  'Jalan Amblas / Bergelombang (Cracks/Deformation)',
  'Jalan Licin (Slippery Road)',
  'Jalan Berdebu (Dusty)',
  'Penyempitan Jalan (Narrow Road)',
  'Tanggul/Bund Wall Rusak',
  'Crossdrain Tersumbat/Rusak',
  'Lain-lain'
];

const SIGN_STATUSES = [
  { value: 'Terpasang', label: 'Sudah Terpasang', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'Belum Terpasang', label: 'Belum Terpasang', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { value: 'Perlu Ditambah', label: 'Perlu Ditambah', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
] as const;

// Helper to format seconds safely
const formatStopwatchTime = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Formula: (Panjang segmen dikonversi ke km) / (Waktu stopwatch dikonversi ke jam)
const calculateSpeed = (panjangStr: string, secondsCount: number): number => {
  const d = parseFloat(panjangStr);
  if (isNaN(d) || d <= 0 || secondsCount <= 0) return 0;
  const km = d / 1000;
  const hours = secondsCount / 3600;
  return km / hours;
};

// Helper for rounded rectangles inside canvas
const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

// Text-wrapping helper for canvas
const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
};

// Image-loader helper with promise
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

// Convert base64 dataURI to File object for direct sharing
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Image fit-cover helper
const drawImageProp = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX: number = 0.5,
  offsetY: number = 0.5
) => {
  const iw = img.width;
  const ih = img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx, cy, cw, ch, ar = 1;

  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
};

// Generates an exact clone image representing the Mobile List Card Layout item
const generateReportImage = async (report: RoadReport): Promise<string> => {
  const width = 500;
  
  // Dynamic height calculation
  let drawY = 24; // starting top padding
  
  // 1. Segmen Jalan (Title Height estimation)
  drawY += 24; 
  
  // 2. Lokasi
  drawY += 18; 
  
  // Separator 1
  drawY += 12; 
  
  // 3. Meta: GL & Waktu Melapor
  drawY += 36; 
  
  // Separator 2
  drawY += 12;

  // 4. Jenis Kerusakan
  drawY += 34;

  // 5. Action quote container height estimation
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.font = 'italic 11px system-ui, -apple-system, sans-serif';
  const wrappedActionLines = getWrappedLines(tempCtx, `“${report.action}”`, 420);
  const actionContainerHeight = 24 + (wrappedActionLines.length * 16) + 12;
  drawY += actionContainerHeight + 14;

  // 6. Double Photo & Stopwatches Display
  const hasPhotosOrStopwatches = !!(report.fotoBefore || report.fotoAfter || report.beforeStopwatch !== undefined || report.afterStopwatch !== undefined);
  let photoSectionHeight = 0;
  if (hasPhotosOrStopwatches) {
    photoSectionHeight += 20; // section header label + margin
    
    // Grid side-by-side height
    const beforeHasStopwatch = report.beforeStopwatch !== undefined;
    const afterHasStopwatch = report.afterStopwatch !== undefined;
    
    let leftSubHeight = 12; // before label
    if (beforeHasStopwatch) leftSubHeight += 22; // badge height
    leftSubHeight += 160; // image display height
    
    let rightSubHeight = 12; // after label
    if (afterHasStopwatch) rightSubHeight += 22; // badge height
    rightSubHeight += 160; // image display height
    
    photoSectionHeight += Math.max(leftSubHeight, rightSubHeight) + 16;
  }
  drawY += photoSectionHeight;

  // 7. Status Rambu (Bottom row)
  drawY += 36;

  // 8. Watermark Footer
  drawY += 24;

  const height = drawY + 24; // bottom padding

  // Prepare Real Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // Smooth drawing styling
  ctx.textBaseline = 'top';

  // Background Dark Slate Blue Color
  ctx.fillStyle = '#060b17';
  ctx.fillRect(0, 0, width, height);

  // Outer Stroke border mimicking Card layout
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // Safe left accent bar
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, 4, height);

  let y = 24;

  // --- 1. SEGMENT JALAN TITLE & OPTIONAL METER BADGE ---
  let rightOffset = 476; // width - 24
  if (report.panjangSegmen) {
    const badgeText = `P: ${report.panjangSegmen} meter`;
    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    const badgeTextWidth = ctx.measureText(badgeText).width;
    const badgeW = badgeTextWidth + 12;
    const badgeH = 18;
    const badgeX = 476 - badgeW;
    const badgeY = y + 1;

    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.fillText(badgeText, badgeX + 6, badgeY + 4);

    rightOffset = badgeX - 10;
  }

  // Draw Title text
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 14.5px system-ui, -apple-system, sans-serif';
  const wrappedTitle = getWrappedLines(ctx, report.segmenJalan, rightOffset - 24);
  wrappedTitle.forEach((line) => {
    ctx.fillText(line, 24, y);
    y += 18;
  });

  // --- 2. LOKASI ---
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'semibold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(report.lokasi, 24, y);
  y += 18;

  // Separator 1
  ctx.strokeStyle = '#131c31';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y + 6);
  ctx.lineTo(476, y + 6);
  ctx.stroke();
  y += 14;

  // --- 3. META SECTION ---
  // Left: GL
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
  ctx.fillText('GROUP LEADER (GL)', 24, y);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(report.namaGL, 24, y + 12);

  // Right: Waktu Melapor
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
  ctx.fillText('WAKTU MELAPOR', 264, y);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  const waktuStr = `${report.hariTanggal.split(',')[0]}, ${report.timeStamp}`;
  ctx.fillText(waktuStr, 264, y + 12);

  y += 32;

  // Separator 2
  ctx.strokeStyle = '#131c31';
  ctx.beginPath();
  ctx.moveTo(24, y + 6);
  ctx.lineTo(476, y + 6);
  ctx.stroke();
  y += 14;

  // --- 4. JENIS KERUSAKAN ---
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
  ctx.fillText('JENIS KERUSAKAN', 24, y);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
  ctx.fillText(report.jenisKerusakan, 24, y + 12);

  y += 30;

  // --- 5. ACTION BOX CONTAINER ---
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  drawRoundRect(ctx, 24, y, 452, actionContainerHeight, 8);
  ctx.fill();
  ctx.strokeStyle = '#131c31';
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
  ctx.fillText('ACTION:', 34, y + 8);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
  wrappedActionLines.forEach((line, idx) => {
    ctx.fillText(line, 34, y + 22 + (idx * 16));
  });

  y += actionContainerHeight + 14;

  // --- 6. DOCUMENTATION SIDE-BY-SIDE GRID ---
  if (hasPhotosOrStopwatches) {
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
    ctx.fillText('📸 LAMPIRAN FOTO & DOKUMENTASI WAKTU', 24, y);
    y += 14;

    const colW = 214;
    const colH = 160;

    // --- LEFT: BEFORE COLUMN ---
    let leftY = y;
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
    ctx.fillText('BEFORE IMAGE', 24, leftY);
    leftY += 12;

    if (report.beforeStopwatch !== undefined) {
      const timerText = `⏱️ ${formatStopwatchTime(report.beforeStopwatch)}`;
      const speedVal = report.beforeSpeed !== undefined ? report.beforeSpeed : (report.panjangSegmen ? parseFloat(calculateSpeed(report.panjangSegmen, report.beforeStopwatch).toFixed(1)) : 0);
      const speedText = `🚗 ${speedVal.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km/j`;

      ctx.font = 'bold 8.5px SFMono-Regular, Consolas, monospace';
      const timerWidth = ctx.measureText(timerText).width + 10;

      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      drawRoundRect(ctx, 24, leftY, timerWidth, 18, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.fillText(timerText, 29, leftY + 4);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(speedText, 24 + timerWidth + 8, leftY + 4);
      leftY += 22;
    }

    if (report.fotoBefore) {
      try {
        const imgBefore = await loadImage(report.fotoBefore);
        ctx.save();
        drawRoundRect(ctx, 24, leftY, colW, colH, 6);
        ctx.clip();
        drawImageProp(ctx, imgBefore, 24, leftY, colW, colH);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = '#111827';
        drawRoundRect(ctx, 24, leftY, colW, colH, 6);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.font = 'italic 8.5px system-ui, sans-serif';
        ctx.fillText('Gagal memuat foto before', 65, leftY + 74);
      }
    } else {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      drawRoundRect(ctx, 24, leftY, colW, colH, 6);
      ctx.stroke();
      
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 8.5px system-ui, sans-serif';
      ctx.fillText('Tanpa foto before', 82, leftY + 74);
    }

    // --- RIGHT: AFTER COLUMN ---
    let rightY = y;
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
    ctx.fillText('AFTER IMAGE', 262, rightY);
    rightY += 12;

    if (report.afterStopwatch !== undefined) {
      const timerText = `⏱️ ${formatStopwatchTime(report.afterStopwatch)}`;
      const speedVal = report.afterSpeed !== undefined ? report.afterSpeed : (report.panjangSegmen ? parseFloat(calculateSpeed(report.panjangSegmen, report.afterStopwatch).toFixed(1)) : 0);
      const speedText = `🚗 ${speedVal.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km/j`;

      ctx.font = 'bold 8.5px SFMono-Regular, Consolas, monospace';
      const timerWidth = ctx.measureText(timerText).width + 10;

      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      drawRoundRect(ctx, 262, rightY, timerWidth, 18, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.fillText(timerText, 267, rightY + 4);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(speedText, 262 + timerWidth + 8, rightY + 4);
      rightY += 22;
    }

    if (report.fotoAfter) {
      try {
        const imgAfter = await loadImage(report.fotoAfter);
        ctx.save();
        drawRoundRect(ctx, 262, rightY, colW, colH, 6);
        ctx.clip();
        drawImageProp(ctx, imgAfter, 262, rightY, colW, colH);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = '#111827';
        drawRoundRect(ctx, 262, rightY, colW, colH, 6);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.font = 'italic 8.5px system-ui, sans-serif';
        ctx.fillText('Gagal memuat foto after', 305, rightY + 74);
      }
    } else {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      drawRoundRect(ctx, 262, rightY, colW, colH, 6);
      ctx.stroke();
      
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 8.5px system-ui, sans-serif';
      ctx.fillText('Tanpa foto after', 320, rightY + 74);
    }

    y += Math.max(leftY + colH, rightY + colH) - y + 16;
  }

  // --- 7. STATUS RAMBU ---
  ctx.strokeStyle = '#131c31';
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(476, y);
  ctx.stroke();
  y += 10;

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
  ctx.fillText('STATUS RAMBU:', 24, y + 4);

  const labelText = report.statusRambu.toUpperCase();
  ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
  const labelW = ctx.measureText(labelText).width + 12;
  const labelH = 18;
  const labelX = 476 - labelW;
  const labelY = y;

  let badgeBg = 'rgba(239, 68, 68, 0.08)';
  let badgeBorder = 'rgba(239, 68, 68, 0.2)';
  let badgeTextC = '#ef4444';

  if (report.statusRambu === 'Terpasang') {
    badgeBg = 'rgba(16, 185, 129, 0.08)';
    badgeBorder = 'rgba(16, 185, 129, 0.2)';
    badgeTextC = '#10b981';
  } else if (report.statusRambu === 'Perlu Ditambah') {
    badgeBg = 'rgba(245, 158, 11, 0.08)';
    badgeBorder = 'rgba(245, 158, 11, 0.2)';
    badgeTextC = '#f59e0b';
  }

  ctx.fillStyle = badgeBg;
  drawRoundRect(ctx, labelX, labelY, labelW, labelH, 4);
  ctx.fill();
  ctx.strokeStyle = badgeBorder;
  ctx.stroke();

  ctx.fillStyle = badgeTextC;
  ctx.fillText(labelText, labelX + 6, labelY + 4);

  y += 24;

  // --- 8. FOOTER / WATERMARK ---
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 7.5px SFMono-Regular, Consolas, monospace';
  ctx.fillText('AUTONOMIA! ROAD TO CYCLE TIME COMPLIANCE! • LAPORAN DATA TAMBANG', 24, y);

  return canvas.toDataURL('image/png');
};

export const LaporJalan: React.FC = () => {
  const [reports, setReports] = useState<RoadReport[]>([]);
  
  // Share States
  const [shareTargetReport, setShareTargetReport] = useState<RoadReport | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form State
  const [namaGL, setNamaGL] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [hariTanggal, setHariTanggal] = useState('');
  const [segmenJalan, setSegmenJalan] = useState('');
  const [panjangSegmen, setPanjangSegmen] = useState('');
  const [jenisKerusakan, setJenisKerusakan] = useState('');
  const [action, setAction] = useState('');
  const [statusRambu, setStatusRambu] = useState<'Terpasang' | 'Belum Terpasang' | 'Perlu Ditambah'>('Belum Terpasang');
  
  // New States: Photos & Stopwatches
  const [fotoBefore, setFotoBefore] = useState<string>('');
  const [fotoAfter, setFotoAfter] = useState<string>('');
  
  const [beforeTime, setBeforeTime] = useState<number>(0);
  const [beforeIsActive, setBeforeIsActive] = useState<boolean>(false);
  
  const [afterTime, setAfterTime] = useState<number>(0);
  const [afterIsActive, setAfterIsActive] = useState<boolean>(false);

  // Before Stopwatch Ticker
  useEffect(() => {
    let interval: any = null;
    if (beforeIsActive) {
      interval = setInterval(() => {
        setBeforeTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [beforeIsActive]);

  // After Stopwatch Ticker
  useEffect(() => {
    let interval: any = null;
    if (afterIsActive) {
      interval = setInterval(() => {
        setAfterTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [afterIsActive]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('autonomia_road_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing reports from localStorage', e);
      }
    }

    // Default current day and date (e.g. "Jumat, 05 Juni 2026")
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateNum = now.getDate().toString().padStart(2, '0');
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    setHariTanggal(`${dayName}, ${dateNum} ${monthName} ${year}`);
  }, []);

  // Save to localStorage whenever report list changes
  const saveReports = (updated: RoadReport[]) => {
    setReports(updated);
    localStorage.setItem('autonomia_road_reports', JSON.stringify(updated));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit 2MB for safe localStorage capacity)
      if (file.size > 2 * 1024 * 1024) {
        alert('File gambar terlalu besar (Maksimal 2MB)! Mohon kompres atau gunakan gambar lain.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') {
          setFotoBefore(reader.result as string);
        } else {
          setFotoAfter(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGL.trim() || !lokasi.trim() || !segmenJalan.trim() || !panjangSegmen.trim() || !jenisKerusakan.trim() || !action.trim()) {
      alert('Mohon lengkapi semua field formulir!');
      return;
    }

    const newReport: RoadReport = {
      id: 'REP-' + Date.now(),
      namaGL,
      lokasi,
      hariTanggal,
      segmenJalan,
      panjangSegmen: panjangSegmen.trim() || undefined,
      jenisKerusakan: jenisKerusakan.trim(),
      action,
      statusRambu,
      timeStamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      fotoBefore: fotoBefore || undefined,
      fotoAfter: fotoAfter || undefined,
      beforeStopwatch: beforeTime > 0 ? beforeTime : undefined,
      afterStopwatch: afterTime > 0 ? afterTime : undefined,
      beforeSpeed: beforeTime > 0 ? parseFloat(calculateSpeed(panjangSegmen, beforeTime).toFixed(2)) : undefined,
      afterSpeed: afterTime > 0 ? parseFloat(calculateSpeed(panjangSegmen, afterTime).toFixed(2)) : undefined
    };

    const updated = [newReport, ...reports];
    saveReports(updated);

    // Reset Form
    setLokasi('');
    setSegmenJalan('');
    setPanjangSegmen('');
    setAction('');
    setStatusRambu('Belum Terpasang');
    setJenisKerusakan('');
    setFotoBefore('');
    setFotoAfter('');
    setBeforeTime(0);
    setBeforeIsActive(false);
    setAfterTime(0);
    setAfterIsActive(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      const updated = reports.filter((r) => r.id !== id);
      saveReports(updated);
    }
  };

  const handleShareWhatsApp = async (report: RoadReport) => {
    setShareTargetReport(report);
    setIsGenerating(true);
    try {
      const dataUrl = await generateReportImage(report);
      setGeneratedImage(dataUrl);

      // Attempt to share file directly using the standard Web Share API on mobile devices
      const safeFileName = `Laporan_Perbaikan_Jalan_${report.segmenJalan.replace(/\s+/g, '_')}.png`;
      const file = dataURLtoFile(dataUrl, safeFileName);

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Laporan Perbaikan Jalan',
            text: 'Laporan Perbaikan Jalan'
          });
          // Shared successfully. Clear target so we don't block user with secondary manual guidelines.
          setShareTargetReport(null);
          setGeneratedImage(null);
          return;
        } catch (shareError) {
          console.log('Mobile share cancelled or intercepted, using manual backup popup.', shareError);
        }
      }

      // Trigger automatic backup download for manual attachment
      const link = document.createElement('a');
      link.download = safeFileName;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Error generating report image', e);
      alert('Gagal menghasilkan gambar laporan. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      <div className="bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
            <ClipboardIcon className="h-5 w-5 shrink-0" />
          </div>
          <div>
            <span className="block">Lapor Jalan Tambang</span>
            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Form Pelaporan Kondisi &amp; Komitmen Perbaikan Jalan</span>
          </div>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nama GL */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Nama GL (Group Leader) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaGL}
                onChange={(e) => setNamaGL(e.target.value)}
                placeholder="Masukkan Nama/ID Supervisor"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            {/* Hari & Tanggal */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Hari &amp; Tanggal
              </label>
              <input
                type="text"
                value={hariTanggal}
                onChange={(e) => setHariTanggal(e.target.value)}
                placeholder="Hari, Tanggal Bulan Tahun"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 text-sm text-slate-300 rounded-lg transition-colors font-medium"
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Lokasi Tambang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Pit Ara, Disposal Timur, Bypass C"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            {/* Segmen Jalan */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Segmen Jalan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={segmenJalan}
                onChange={(e) => setSegmenJalan(e.target.value)}
                placeholder="Contoh: Segmen Ramp 2, Sta 100-200"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            {/* Panjang Segmen */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Panjang Segmen <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={panjangSegmen}
                  onChange={(e) => {
                    // Force strictly positive numbers only
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPanjangSegmen(val);
                  }}
                  placeholder="Contoh: 150"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 pr-16 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium font-sans"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-xs font-semibold text-slate-500">meter</span>
                </div>
              </div>
            </div>

            {/* Jenis Kerusakan */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Jenis Kerusakan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={jenisKerusakan}
                onChange={(e) => setJenisKerusakan(e.target.value)}
                placeholder="Contoh: Jalan Berlubang, Licin, Amblas"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            {/* Status Rambu */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Status Rambu Pengaman (Safety Sign)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SIGN_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setStatusRambu(status.value as any)}
                    className={`p-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                      statusRambu === status.value
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/5'
                        : 'border-slate-800/90 bg-slate-950 text-slate-400 hover:border-slate-700/80'
                    }`}
                  >
                    {status.value}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action / Tindakan Korektif */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Action / Tindakan Perbaikan <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Contoh: Scrub Grader, Resheeting, dsb"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/10 p-2.5 text-sm text-slate-100 rounded-lg transition-colors placeholder:text-slate-600 font-medium font-sans"
              required
            ></textarea>
          </div>

          {/* PHOTO UPLOADS & STOPWATCHES */}
          <div className="border-t border-slate-700/35 pt-5 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <span>⏱️</span> Lampiran Foto &amp; Stopwatches
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Photo & Stopwatch: BEFORE */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Foto Kondisi SEBELUM (Before)
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-450 border border-rose-500/20 font-bold self-start">
                      Timer Temuan
                    </span>
                  </div>

                  {/* Stopwatch Area */}
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-900 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${beforeIsActive ? 'bg-rose-500/10 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Waktu Berjalan</span>
                        <span className="text-xs sm:text-sm font-mono font-black text-slate-200 tracking-wider">
                          {formatStopwatchTime(beforeTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setBeforeIsActive(!beforeIsActive)}
                        className={`py-1 px-2.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          beforeIsActive 
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                      >
                        {beforeIsActive ? <PauseIcon className="h-2.5 w-2.5 shrink-0" /> : <PlayIcon className="h-2.5 w-2.5 shrink-0" />}
                        {beforeIsActive ? 'Pause' : 'Start'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setBeforeIsActive(false); setBeforeTime(0); }}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Reset Timer Before"
                      >
                        <RotateCcwIcon className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Speed Form Field */}
                  <div className="space-y-1 mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Speed Before
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={beforeTime > 0 && panjangSegmen ? calculateSpeed(panjangSegmen, beforeTime).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '0'}
                        className="w-full bg-slate-950/60 border border-slate-800/80 p-2 pr-16 text-xs sm:text-sm text-slate-300 rounded-lg font-mono font-bold cursor-not-allowed select-none"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-500">km/jam</span>
                      </div>
                    </div>
                    <div className="text-[8.5px] text-slate-500/80 italic">
                      Rumus: ({((parseFloat(panjangSegmen) || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 3 })} km) ÷ {(beforeTime / 3600).toFixed(5)} jam
                    </div>
                  </div>

                  {/* Photo Input / Preview Area */}
                  {fotoBefore ? (
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img src={fotoBefore} alt="Before Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFotoBefore('')}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-slate-100 text-xs font-bold rounded-md flex items-center gap-1 shadow-md cursor-pointer transition-colors"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Hapus Foto Before
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-950/85 hover:border-slate-500 transition-all rounded-lg p-3 cursor-pointer py-6 min-h-[130px]">
                      <svg className="mx-auto h-7 w-7 text-slate-500 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-slate-400 block text-center">Pilih / Upload Foto Before</span>
                      <span className="text-[8px] text-slate-500 block mt-0.5 text-center">Format JPEG/PNG, Maksimal 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'before')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Photo & Stopwatch: AFTER */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Foto Kondisi SESUDAH (After)
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-405 border border-emerald-500/20 font-bold self-start">
                      Timer Repair
                    </span>
                  </div>

                  {/* Stopwatch Area */}
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-900 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${afterIsActive ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold leading-none">Waktu Berjalan</span>
                        <span className="text-xs sm:text-sm font-mono font-black text-slate-200 tracking-wider">
                          {formatStopwatchTime(afterTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAfterIsActive(!afterIsActive)}
                        className={`py-1 px-2.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          afterIsActive 
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                      >
                        {afterIsActive ? <PauseIcon className="h-2.5 w-2.5 shrink-0" /> : <PlayIcon className="h-2.5 w-2.5 shrink-0" />}
                        {afterIsActive ? 'Pause' : 'Start'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAfterIsActive(false); setAfterTime(0); }}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Reset Timer After"
                      >
                        <RotateCcwIcon className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Speed Form Field */}
                  <div className="space-y-1 mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Speed After
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={afterTime > 0 && panjangSegmen ? calculateSpeed(panjangSegmen, afterTime).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '0'}
                        className="w-full bg-slate-950/60 border border-slate-800/80 p-2 pr-16 text-xs sm:text-sm text-slate-300 rounded-lg font-mono font-bold cursor-not-allowed select-none"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-500">km/jam</span>
                      </div>
                    </div>
                    <div className="text-[8.5px] text-slate-500/80 italic">
                      Rumus: ({((parseFloat(panjangSegmen) || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 3 })} km) ÷ {(afterTime / 3600).toFixed(5)} jam
                    </div>
                  </div>

                  {/* Photo Input / Preview Area */}
                  {fotoAfter ? (
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img src={fotoAfter} alt="After Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFotoAfter('')}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-slate-100 text-xs font-bold rounded-md flex items-center gap-1 shadow-md cursor-pointer transition-colors"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Hapus Foto After
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-950/85 hover:border-slate-500 transition-all rounded-lg p-3 cursor-pointer py-6 min-h-[130px]">
                      <svg className="mx-auto h-7 w-7 text-slate-500 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-slate-400 block text-center">Pilih / Upload Foto After</span>
                      <span className="text-[8px] text-slate-500 block mt-0.5 text-center">Format JPEG/PNG, Maksimal 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'after')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 select-none text-xs sm:text-sm cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 stroke-[3]" />
            Kirim Laporan Jalan
          </button>
        </form>
      </div>

      {/* Reports History */}
      <div className="bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-200">Daftar Pelaporan Masuk ({reports.length})</h3>
          {reports.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Hapus semua riwayat pelaporan?')) {
                  saveReports([]);
                }
              }}
              className="text-[10px] sm:text-xs text-rose-450 hover:text-rose-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <TrashIcon className="h-3 w-3" />
              Reset Semua
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
            <ClipboardIcon className="h-8 w-8 text-slate-600 mx-auto opacity-40 mb-3" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Belum ada laporan kerusakan jalan tambang.</p>
            <p className="text-[10px] sm:text-xs text-slate-600 mt-1">Silakan isi formulir di atas untuk mengumpulkan laporan baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => {
              const signStyle = SIGN_STATUSES.find(s => s.value === report.statusRambu) || SIGN_STATUSES[1];
              return (
                <div key={report.id} className="bg-slate-950/65 p-4 rounded-xl border border-slate-800/90 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                  
                  {/* Card Header & Main Data */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                          {report.segmenJalan}
                          {report.panjangSegmen && (
                            <span className="text-[9px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                              P: {report.panjangSegmen} meter
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold block">{report.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleShareWhatsApp(report)}
                          className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-slate-950 transition-all cursor-pointer"
                          title="Hubungkan & Kirim WA"
                        >
                          <WhatsappIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-450 hover:bg-rose-500 hover:text-slate-950 transition-all cursor-pointer"
                          title="Hapus Laporan"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta Section */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] sm:text-xs border-t border-slate-900 pt-2 text-slate-400 font-sans">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">Group Leader (GL)</span>
                        <span className="font-semibold text-slate-300">{report.namaGL}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">Waktu Melapor</span>
                        <span className="font-semibold text-slate-300">{report.hariTanggal.split(',')[0]}, {report.timeStamp}</span>
                      </div>
                    </div>

                    {/* Damage & Status Detail */}
                    <div className="space-y-1.5 mt-2">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">Jenis Kerusakan</span>
                        <span className="text-[11.5px] sm:text-xs font-bold text-rose-450 block leading-normal">{report.jenisKerusakan}</span>
                      </div>

                      <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900 mt-2 text-xs text-slate-350 italic">
                        <span className="text-[8px] text-slate-500 uppercase font-black not-italic block mb-0.5">Action:</span>
                        &ldquo;{report.action}&rdquo;
                      </div>
                    </div>

                    {/* Double Photo & Stopwatches Display */}
                    {(report.fotoBefore || report.fotoAfter || report.beforeStopwatch !== undefined || report.afterStopwatch !== undefined) && (
                      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-900/60 font-sans">
                        
                        {/* Before Side */}
                        <div className="space-y-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-500 uppercase font-black">Before Image</span>
                            {report.beforeStopwatch !== undefined && (
                              <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
                                <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded font-bold">
                                  ⏱️ {formatStopwatchTime(report.beforeStopwatch)}
                                </span>
                                <span className="text-[9px] font-mono font-extrabold text-slate-300">
                                  🚗 {(report.beforeSpeed !== undefined ? report.beforeSpeed : (report.panjangSegmen ? calculateSpeed(report.panjangSegmen, report.beforeStopwatch) : 0)).toLocaleString('id-ID', { maximumFractionDigits: 1 })} km/j
                                </span>
                              </div>
                            )}
                          </div>
                          {report.fotoBefore ? (
                            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                              <img src={report.fotoBefore} alt="Before Observation" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex items-center justify-center text-center p-1">
                              <span className="text-[8.5px] text-slate-600 font-semibold italic">Tanpa foto before</span>
                            </div>
                          )}
                        </div>

                        {/* After Side */}
                        <div className="space-y-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-500 uppercase font-black">After Image</span>
                            {report.afterStopwatch !== undefined && (
                              <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
                                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded font-bold">
                                  ⏱️ {formatStopwatchTime(report.afterStopwatch)}
                                </span>
                                <span className="text-[9px] font-mono font-extrabold text-slate-300">
                                  🚗 {(report.afterSpeed !== undefined ? report.afterSpeed : (report.panjangSegmen ? calculateSpeed(report.panjangSegmen, report.afterStopwatch) : 0)).toLocaleString('id-ID', { maximumFractionDigits: 1 })} km/j
                                </span>
                              </div>
                            )}
                          </div>
                          {report.fotoAfter ? (
                            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                              <img src={report.fotoAfter} alt="After Remediation" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex items-center justify-center text-center p-1">
                              <span className="text-[8.5px] text-slate-600 font-semibold italic">Tanpa foto after</span>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>

                  {/* Rambu Badge */}
                  <div className="flex items-center justify-between border-t border-slate-900/80 pt-2 shrink-0">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Status Rambu:</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border font-sans tracking-wide leading-none ${signStyle.color}`}>
                      {report.statusRambu}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Share WhatsApp */}
      {shareTargetReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <span className="p-1 px-1.5 bg-teal-500/10 text-teal-400 rounded-md">
                  <WhatsappIcon className="h-4 w-4 inline-block" />
                </span>
                Bagikan Laporan Gambar
              </h3>
              <button
                onClick={() => {
                  setShareTargetReport(null);
                  setGeneratedImage(null);
                }}
                className="text-slate-400 hover:text-slate-100 font-bold text-lg p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 font-sans">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-300 font-bold">Sedang Menghasilkan Gambar Laporan...</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Gambar laporan berhasil di-generate secara otomatis! 
                    <span className="block mt-1 font-bold text-amber-400">Silakan kirim atau lampirkan berkas gambar yang telah terdownload ke WhatsApp.</span>
                  </p>

                  {generatedImage && (
                    <div className="border border-slate-800 bg-slate-950 p-2 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
                      <img src={generatedImage} alt="Report Preview" className="max-w-full max-h-[300px] rounded object-contain border border-slate-800" />
                    </div>
                  )}

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-[10px] sm:text-[11px] leading-relaxed text-slate-400 space-y-1">
                    <strong className="text-xs text-slate-300 block mb-1">💡 Langkah Pengiriman:</strong>
                    <div className="flex gap-2">
                      <span className="font-bold text-amber-500">1.</span>
                      <span>Gambar laporan telah diunduh ke perangkat Anda. Jika belum terdownload otomatis, klik tombol <strong>Unduh Gambar</strong> di bawah.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-amber-500">2.</span>
                      <span>Klik tombol <strong>Kirim ke WhatsApp</strong> untuk membuka aplikasi WhatsApp dengan caption default.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-amber-500">3.</span>
                      <span>Kirim gambar laporan yang baru terdownload tadi, lalu bumbui caption "Laporan Perbaikan Jalan".</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isGenerating && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => {
                    if (generatedImage && shareTargetReport) {
                      const link = document.createElement('a');
                      link.download = `Laporan_Perbaikan_Jalan_${shareTargetReport.segmenJalan.replace(/\s+/g, '_')}.png`;
                      link.href = generatedImage;
                      link.click();
                    }
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-250 transition-colors text-center cursor-pointer select-none"
                >
                  📥 Unduh Gambar
                </button>
                <button
                  onClick={() => {
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent('Laporan Perbaikan Jalan')}`;
                    window.open(url, '_blank');
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/10 select-none"
                >
                  <WhatsappIcon className="h-3.5 w-3.5 shrink-0" />
                  Kirim ke WA
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
