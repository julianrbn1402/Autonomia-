import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    alpha: number;
    decay: number;
    size: number;
    gravity: number;
    drag: number;
}

interface Rocket {
    x: number;
    y: number;
    targetY: number;
    vx: number;
    vy: number;
    color: string;
    trail: { x: number; y: number; alpha: number }[];
    size: number;
}

export const AboutAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let rockets: Rocket[] = [];
        let particles: Particle[] = [];
        const maxRockets = 3;

        // Custom theme-aligned colors: Ambers, Emeralds, Blues
        const colors = [
            '#f59e0b', // Amber 500
            '#fbbf24', // Amber 400
            '#fcd34d', // Amber 300
            '#ef4444', // Red 500
            '#10b981', // Emerald 500
            '#34d399', // Emerald 400
            '#3b82f6', // Blue 500
            '#60a5fa', // Blue 400
            '#a78bfa', // Purple 400
        ];

        // Fit canvas to parent container or window
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || window.innerWidth;
            canvas.height = rect.height || 600;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // ResizeObserver to handle dynamically sized parent card
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        const createExplosion = (x: number, y: number, color: string) => {
            const particleCount = 40 + Math.floor(Math.random() * 30);
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3.5;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color,
                    alpha: 1,
                    decay: 0.015 + Math.random() * 0.02,
                    size: 1 + Math.random() * 2,
                    gravity: 0.05,
                    drag: 0.98,
                });
            }
        };

        const spawnRocket = () => {
            if (rockets.length >= maxRockets) return;

            const x = 50 + Math.random() * (canvas.width - 100);
            const y = canvas.height + 10;
            const targetY = 80 + Math.random() * (canvas.height * 0.5);
            const speed = 3.5 + Math.random() * 3.5;
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.15; // slightly angled up

            rockets.push({
                x,
                y,
                targetY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                trail: [],
                size: 2.5 + Math.random() * 1.5,
            });
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Chance to spawn new rocket
            if (Math.random() < 0.015) {
                spawnRocket();
            }

            // Update & Draw Rockets
            for (let i = rockets.length - 1; i >= 0; i--) {
                const r = rockets[i];
                r.x += r.vx;
                r.y += r.vy;

                // Fire trail particles local representation
                r.trail.push({ x: r.x, y: r.y, alpha: 1 });
                if (r.trail.length > 15) {
                    r.trail.shift();
                }

                // Draw fire tail
                r.trail.forEach((p, idx) => {
                    const ratio = idx / r.trail.length;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r.size * ratio * 0.7, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * ratio * 0.45})`; // Amber glow
                    ctx.fill();
                });

                // Spark / sparklers
                if (Math.random() < 0.4) {
                    particles.push({
                        x: r.x,
                        y: r.y - r.vy * 0.5,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5 + 1.2,
                        color: '#f59e0b',
                        alpha: 0.8,
                        decay: 0.08,
                        size: 0.8 + Math.random() * 1,
                        gravity: 0.01,
                        drag: 0.96,
                    });
                }

                // Draw Rocket Silhouette (Tech Vector Triangle / Rocket icon)
                ctx.save();
                ctx.translate(r.x, r.y);
                const angleRad = Math.atan2(r.vy, r.vx);
                ctx.rotate(angleRad + Math.PI / 2);

                // Fin shadow & body
                ctx.beginPath();
                ctx.moveTo(-r.size, r.size * 1.5);
                ctx.lineTo(0, -r.size * 2);
                ctx.lineTo(r.size, r.size * 1.5);
                ctx.closePath();
                ctx.fillStyle = r.color;
                ctx.fill();

                // Thrust engine flame
                ctx.beginPath();
                ctx.moveTo(-r.size * 0.5, r.size * 1.5);
                ctx.lineTo(0, r.size * (2.5 + Math.random() * 1.5));
                ctx.lineTo(r.size * 0.5, r.size * 1.5);
                ctx.closePath();
                ctx.fillStyle = '#ef4444'; // Hot red
                ctx.fill();

                ctx.restore();

                // Explode criteria
                if (r.y <= r.targetY || r.x < 0 || r.x > canvas.width || r.y < 0) {
                    createExplosion(r.x, r.y, r.color);
                    rockets.splice(i, 1);
                }
            }

            // Update & Draw Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                
                // Color formatting handling
                if (p.color.startsWith('#')) {
                    // Convert hex to rgba to apply dynamic alpha decay
                    const r = parseInt(p.color.slice(1, 3), 16);
                    const g = parseInt(p.color.slice(3, 5), 16);
                    const b = parseInt(p.color.slice(5, 7), 16);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
                } else {
                    ctx.fillStyle = p.color;
                }
                
                // Bloom/glow effect for particles
                ctx.shadowBlur = 4;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Interactive mouse triggers (click exploded firework)
        const handleCanvasClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Generate a fancy rocket heading directly towards click location or just explode directly
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            createExplosion(clickX, clickY, randomColor);

            // Also launch a rocket starting from bottom heading near that click x coordinate
            if (rockets.length < maxRockets + 2) {
                rockets.push({
                    x: clickX + (Math.random() - 0.5) * 60,
                    y: canvas.height + 10,
                    targetY: clickY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -4 - Math.random() * 4,
                    color: randomColor,
                    trail: [],
                    size: 3,
                });
            }
        };

        canvas.addEventListener('click', handleCanvasClick);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            resizeObserver.disconnect();
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto opacity-50 select-none rounded-2xl"
            style={{ zIndex: 0 }}
        />
    );
};
