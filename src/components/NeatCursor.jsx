import React, { useEffect, useRef } from 'react';

export default function NeatCursor() {
    const canvasRef = useRef(null);

    const cursorAccent = '#4f46e5';
    const cursorSoft = '#c7d2fe';

    useEffect(() => {
        const isTouch =
            window.matchMedia('(pointer: coarse)').matches &&
            !window.matchMedia('(pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isTouch || prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId = null;
        let isLoopActive = false;
        let viewW = window.innerWidth;
        let viewH = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            viewW = window.innerWidth;
            viewH = window.innerHeight;
            canvas.width = viewW * dpr;
            canvas.height = viewH * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const mouse = { x: -100, y: -100, active: false };
        let isHovered = false;
        let isClicking = false;
        let isOverInput = false;

        const TRAIL_COUNT = 16;
        const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }));

        const startLoop = () => {
            if (!isLoopActive) {
                isLoopActive = true;
                animationFrameId = requestAnimationFrame(render);
            }
        };

        const onPointerMove = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;

            if (mouse.x < 0) {
                mouse.x = clientX;
                mouse.y = clientY;
                for (let i = 0; i < TRAIL_COUNT; i++) {
                    trail[i].x = clientX;
                    trail[i].y = clientY;
                }
            }

            mouse.x = clientX;
            mouse.y = clientY;
            mouse.active = true;

            const target = e.target;
            isOverInput = !!(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'));
            isHovered = !!(
                target &&
                (target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.getAttribute('role') === 'button' ||
                    target.closest('a, button, [role="button"], .interactive-hover, .btn-primary-lime, .btn-secondary-glass'))
            );

            startLoop();
        };

        const onPointerDown = () => {
            isClicking = true;
            startLoop();
        };

        const onPointerUp = () => {
            isClicking = false;
            startLoop();
        };

        const onPointerLeave = () => {
            mouse.active = false;
            ctx.clearRect(0, 0, viewW, viewH);
            isLoopActive = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        document.addEventListener('mouseleave', onPointerLeave);

        const render = () => {
            ctx.clearRect(0, 0, viewW, viewH);

            if (!mouse.active || mouse.x < 0 || isOverInput) {
                isLoopActive = false;
                animationFrameId = null;
                return;
            }

            trail[0].x = mouse.x;
            trail[0].y = mouse.y;

            let maxDelta = 0;
            for (let i = 1; i < TRAIL_COUNT; i++) {
                const prev = trail[i - 1];
                const curr = trail[i];
                const dx = (prev.x - curr.x) * 0.44;
                const dy = (prev.y - curr.y) * 0.44;
                curr.x += dx;
                curr.y += dy;
                maxDelta = Math.max(maxDelta, Math.abs(dx) + Math.abs(dy));
            }

            // Draw fluid tapered trail without costly per-segment shadowBlur
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let i = 0; i < TRAIL_COUNT - 1; i++) {
                const p0 = trail[i];
                const p1 = trail[i + 1];
                const progress = i / (TRAIL_COUNT - 1);
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.strokeStyle = i < 7 ? cursorAccent : cursorSoft;
                ctx.lineWidth = Math.max(0.8, (1 - progress) * 3.5);
                ctx.globalAlpha = (1 - progress) * 0.65;
                ctx.stroke();
            }
            ctx.restore();

            // Precision pointer dot
            ctx.save();
            ctx.beginPath();
            const dotRadius = isClicking ? 2.8 : isHovered ? 5.0 : 3.8;
            ctx.arc(mouse.x, mouse.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = cursorAccent;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.restore();

            // Stop RAF loop once trail catches up to stationary cursor
            if (maxDelta > 0.08 || isClicking) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                isLoopActive = false;
                animationFrameId = null;
            }
        };

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('mouseleave', onPointerLeave);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const bumpToTop = () => {
            if (canvasRef.current && canvasRef.current.showPopover) {
                try {
                    canvasRef.current.hidePopover();
                    canvasRef.current.showPopover();
                } catch (e) {
                    // Ignore
                }
            }
        };

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
