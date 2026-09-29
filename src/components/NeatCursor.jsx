/**
 * NeatCursor Component
 * Minimalist luxury Baby Pink cursor effect designed for pure white backgrounds.
 * 
 * Features:
 * - Precision Core Dot: Razor-sharp Baby Pink dot (#ff75a0) tracking mouse with 0ms latency.
 * - Fluid Baby Pink Trailing Line: Silky, tapered streamline fading gracefully behind the cursor.
 * - No outer ring/circle (clean, neat and focused).
 * - Full white background contrast with crisp white rim and soft rose glow.
 */

import React, { useEffect, useRef, useState } from 'react';

export default function NeatCursor({ activePalette }) {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Baby Pink color constants
    const babyPink = '#ff75a0';        // Vibrant warm baby pink
    const softBabyPink = '#fbcfe8';    // Delicate pastel baby pink
    const babyPinkGlow = 'rgba(255, 117, 160, 0.45)';

    useEffect(() => {
        // Disable on touch-only devices for optimal mobile UX
        const isTouch = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
        if (isTouch) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        // Core coordinates state
        const mouse = { x: -100, y: -100, active: false };
        let isHovered = false;
        let isClicking = false;

        // Smooth tapered fluid trail (20 smooth chain nodes)
        const TRAIL_COUNT = 20;
        const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }));

        const onPointerMove = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;

            if (mouse.x < 0) {
                mouse.x = clientX;
                mouse.y = clientY;
                trail.forEach(p => { p.x = clientX; p.y = clientY; });
            }

            mouse.x = clientX;
            mouse.y = clientY;
            mouse.active = true;
            setIsVisible(true);

            // Detect interactive target hover for subtle dot scale
            const target = e.target;
            const interactive = target && (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.getAttribute('role') === 'button' ||
                target.closest('a, button, [role="button"], .interactive-hover, .btn-primary-lime, .btn-secondary-glass, .glass-card, .footer-interaction-status, .spectrum-pill-indicator')
            );

            isHovered = !!interactive;
        };

        const onPointerDown = () => {
            isClicking = true;
        };

        const onPointerUp = () => {
            isClicking = false;
        };

        const onPointerLeave = () => {
            mouse.active = false;
            setIsVisible(false);
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        document.addEventListener('mouseleave', onPointerLeave);

        // Smooth render loop
        const render = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            if (mouse.x > 0 && mouse.active) {
                // 1. Update trail nodes (silky spring chain)
                trail[0].x = mouse.x;
                trail[0].y = mouse.y;

                for (let i = 1; i < TRAIL_COUNT; i++) {
                    const prev = trail[i - 1];
                    const curr = trail[i];
                    curr.x += (prev.x - curr.x) * 0.44;
                    curr.y += (prev.y - curr.y) * 0.44;
                }

                // 2. Draw Smooth Baby Pink Trailing Line
                if (trail.length >= 3) {
                    ctx.save();
                    for (let i = 0; i < trail.length - 1; i++) {
                        const p0 = trail[i];
                        const p1 = trail[i + 1];
                        const progress = i / (trail.length - 1);
                        const alpha = (1 - progress) * 0.82;
                        const lineWidth = Math.max(0.8, (1 - progress) * 4.2);

                        ctx.beginPath();
                        ctx.moveTo(p0.x, p0.y);
                        ctx.lineTo(p1.x, p1.y);

                        // Gradient transition from rich baby pink at head to soft pastel at tail
                        ctx.strokeStyle = i < 8 ? babyPink : softBabyPink;
                        ctx.lineWidth = lineWidth;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.globalAlpha = alpha;
                        ctx.shadowColor = babyPinkGlow;
                        ctx.shadowBlur = 6;
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // 3. Draw Precision Baby Pink Pointer Dot (Zero Ring Around It)
                ctx.save();
                ctx.beginPath();
                const dotRadius = isClicking ? 2.8 : (isHovered ? 5.2 : 3.8);
                ctx.arc(mouse.x, mouse.y, dotRadius, 0, Math.PI * 2);

                // Baby pink core with glowing aura
                ctx.fillStyle = babyPink;
                ctx.shadowColor = babyPink;
                ctx.shadowBlur = 10;
                ctx.fill();

                // Crisp white border for razor-sharp definition on white background
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.4;
                ctx.stroke();
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('mouseleave', onPointerLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Ensure cursor is always in the #top-layer to appear above <dialog> modals
    useEffect(() => {
        const bumpToTop = () => {
            if (canvasRef.current && canvasRef.current.showPopover) {
                try {
                    // Hide then immediately show to push it to the very top of the top layer
                    canvasRef.current.hidePopover();
                    canvasRef.current.showPopover();
                } catch (e) {
                    // Ignore
                }
            }
        };

        // Initial bump
        if (canvasRef.current && canvasRef.current.showPopover) {
            try {
                canvasRef.current.showPopover();
            } catch (e) {
                // Ignore
            }
        }

        window.addEventListener('bump-cursor', bumpToTop);
        return () => window.removeEventListener('bump-cursor', bumpToTop);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="neat-cursor-canvas pointer-events-none"
            popover="manual"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 999999,
                pointerEvents: 'none',
                overflow: 'hidden',
                backgroundColor: 'transparent',
                border: 'none',
                margin: 0,
                padding: 0
            }}
            aria-hidden="true"
        />
    );
}
