import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight, ArrowDown, Mouse, RotateCcw } from 'lucide-react';

export default function IntroTickerScroll({ onComplete }) {
    const containerRef = useRef(null);
    const flexRowRef = useRef(null);
    const progressFillRef = useRef(null);
    const progressTextRef = useRef(null);
    const cueTextRef = useRef(null);

    const targetXRef = useRef(0);
    const currentXRef = useRef(0);
    const totalDistRef = useRef(0);
    const isExitingRef = useRef(false);
    const hasFinishedRef = useRef(false);
    const rafIdRef = useRef(null);
    const touchStartYRef = useRef(0);
    const touchStartXRef = useRef(0);

    // Calculate maximum horizontal travel distance
    const calcDistance = useCallback(() => {
        if (!flexRowRef.current) return 0;
        const rowWidth = flexRowRef.current.scrollWidth;
        const winWidth = window.innerWidth;
        return Math.max(0, rowWidth - winWidth + 180);
    }, []);

    // Dismiss the intro curtain smoothly to unveil the main website
    const handleDismiss = useCallback(() => {
        if (isExitingRef.current) return;
        isExitingRef.current = true;

        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });
    }, [onComplete]);

    // High-performance 120 FPS Inertial Lerp Render Loop (0 React re-renders during scroll)
    useEffect(() => {
        const totalDistance = calcDistance();
        totalDistRef.current = totalDistance;
        targetXRef.current = 0;
        currentXRef.current = 0;
        hasFinishedRef.current = false;

        if (flexRowRef.current) {
            flexRowRef.current.style.transform = 'translate3d(0px, 0, 0)';
        }

        const renderLoop = () => {
            const dist = totalDistRef.current;
            if (dist > 0 && flexRowRef.current) {
                // Smooth linear interpolation (lerp factor 0.12)
                currentXRef.current += (targetXRef.current - currentXRef.current) * 0.12;

                const x = currentXRef.current;
                flexRowRef.current.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

                const p = Math.min(1, Math.max(0, Math.abs(x) / dist));

                // Direct DOM updates for butter-smooth 120 FPS feedback
                if (progressFillRef.current) {
                    progressFillRef.current.style.width = `${(p * 100).toFixed(1)}%`;
                }
                if (progressTextRef.current) {
                    progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
                }

                // Completion trigger: user scrolled dialogue completely to end
                if (p >= 0.96 && !hasFinishedRef.current) {
                    hasFinishedRef.current = true;
                    if (cueTextRef.current) {
                        cueTextRef.current.innerHTML = '<span style="color: var(--accent-iris-light); font-weight: 700;">✓ DIALOGUE COMPLETE // UNVEILING SITE...</span>';
                    }
                    setTimeout(() => {
                        handleDismiss();
                    }, 450);
                }
            }

            if (!isExitingRef.current) {
                rafIdRef.current = requestAnimationFrame(renderLoop);
            }
        };

        rafIdRef.current = requestAnimationFrame(renderLoop);

        // Smooth Wheel Listener (accumulates target, lerp smooths motion)
        const onWheel = (e) => {
            if (isExitingRef.current) return;
            e.preventDefault();

            const delta = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 1.1;
            const newTarget = targetXRef.current - delta;
            targetXRef.current = Math.max(-totalDistRef.current, Math.min(0, newTarget));
        };

        // Touch gestures for mobile
        const onTouchStart = (e) => {
            if (e.touches.length > 0) {
                touchStartYRef.current = e.touches[0].clientY;
                touchStartXRef.current = e.touches[0].clientX;
            }
        };

        const onTouchMove = (e) => {
            if (isExitingRef.current) return;
            if (e.touches.length > 0) {
                const diffY = touchStartYRef.current - e.touches[0].clientY;
                const diffX = touchStartXRef.current - e.touches[0].clientX;
                const delta = (Math.abs(diffY) > Math.abs(diffX) ? diffY : diffX) * 1.2;

                touchStartYRef.current = e.touches[0].clientY;
                touchStartXRef.current = e.touches[0].clientX;

                const newTarget = targetXRef.current - delta;
                targetXRef.current = Math.max(-totalDistRef.current, Math.min(0, newTarget));
            }
        };

        // Keyboard navigation
        const onKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
                handleDismiss();
                return;
            }

            let delta = 0;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                delta = 160;
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
                delta = -160;
            }

            if (delta !== 0) {
                e.preventDefault();
                const newTarget = targetXRef.current - delta;
                targetXRef.current = Math.max(-totalDistRef.current, Math.min(0, newTarget));
            }
        };

        const containerEl = containerRef.current;
        if (containerEl) {
            containerEl.addEventListener('wheel', onWheel, { passive: false });
            containerEl.addEventListener('touchstart', onTouchStart, { passive: true });
            containerEl.addEventListener('touchmove', onTouchMove, { passive: true });
        }

        window.addEventListener('keydown', onKeyDown);

        const handleResize = () => {
            totalDistRef.current = calcDistance();
            targetXRef.current = 0;
            currentXRef.current = 0;
            hasFinishedRef.current = false;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            if (containerEl) {
                containerEl.removeEventListener('wheel', onWheel);
                containerEl.removeEventListener('touchstart', onTouchStart);
                containerEl.removeEventListener('touchmove', onTouchMove);
            }
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [calcDistance, handleDismiss]);

    const resetToBeginning = () => {
        targetXRef.current = 0;
        hasFinishedRef.current = false;
        if (cueTextRef.current) {
            cueTextRef.current.textContent = 'SCROLL DOWN OR SWIPE TO READ COMPLETE DIALOGUE';
        }
    };

    return (
        <aside
            ref={containerRef}
            className="intro-ticker-overlay theme-iris"
            aria-label="Welcome Dialogue Scroll Experience"
            role="dialog"
            aria-modal="true"
        >
            {/* Top Telemetry HUD Header */}
            <div className="ticker-hud-header">
                <div className="hud-header-left">
                    <span className="ticker-status-beacon beacon-iris" />
                    <span className="ticker-hud-code">// 00 — SCROLL TO UNLOCK SIGNBRIDGE</span>
                </div>

                <div className="hud-header-center">
                    <div className="ticker-progress-rail">
                        <div ref={progressFillRef} className="ticker-progress-fill fill-iris" style={{ width: '0%' }} />
                    </div>
                    <span ref={progressTextRef} className="ticker-progress-pct text-iris-glow">
                        0%
                    </span>
                </div>

                <div className="hud-header-right">
                    <button
                        type="button"
                        onClick={resetToBeginning}
                        className="ticker-hud-icon-btn btn-iris-icon"
                        title="Restart Dialogue"
                        aria-label="Restart Dialogue"
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="ticker-enter-btn btn-iris-solid"
                        id="enter-site-btn"
                    >
                        <span>ENTER SITE</span>
                        <ArrowDown size={14} className="enter-arrow-icon" />
                    </button>
                </div>
            </div>

            {/* Subtle background Iris atmospheric glow & watermark */}
            <div className="ticker-bg-glow glow-iris-ambient" aria-hidden="true" />
            <div className="ticker-grid-watermark" aria-hidden="true">
                <span className="watermark-text text-iris-subtle">SIGNBRIDGE // IRIS & WHITE ARCHITECTURE</span>
            </div>

            {/* Continuous Horizontal Dialogue Text Flow Track */}
            <div className="ticker-tape-scroll-track">
                {/* Single Continuous Flex Row with balanced phrase groups and compact inline punctuation */}
                <div ref={flexRowRef} className="ticker-tape-flex-row">

                    {/* Site Starter Badge */}
                    <div className="ticker-unit-badge">
                        <span className="ticker-origin-pill pill-iris">
                            <span className="pill-pulse pulse-iris" />
                            // 01 — VISION
                        </span>
                    </div>

                    {/* Phrase 1: "A technology-driven platform connecting people, ideas, and opportunities." */}
                    <div className="ticker-phrase-group">
                        <span className="ticker-word text-white">A technology-driven platform</span>

                        {/* Inline fluid Iris curve acting as comma */}
                        <svg className="ticker-inline-curve" width="54" height="22" viewBox="0 0 54 22" fill="none" aria-hidden="true">
                            <path d="M 3 11 C 18 2, 36 20, 51 11" stroke="var(--accent-iris)" strokeWidth="3" strokeLinecap="round" />
                        </svg>

                        <span className="ticker-word text-iris">connecting people,</span>

                        {/* Inline Iris sparkle */}
                        <span className="ticker-inline-sparkle sparkle-iris" aria-hidden="true">
                            <Sparkles size={16} className="text-iris-glow" />
                        </span>

                        <span className="ticker-word text-white">ideas,</span>

                        {/* Inline pulse wave curve */}
                        <svg className="ticker-inline-pulse" width="58" height="22" viewBox="0 0 58 22" fill="none" aria-hidden="true">
                            <path d="M 0 11 L 16 11 L 23 3 L 31 19 L 38 6 L 44 11 L 58 11" stroke="var(--accent-iris-glow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className="ticker-word text-white">and opportunities.</span>
                    </div>

                    {/* Elegant Phrase Delimiter */}
                    <div className="ticker-phrase-delimiter" aria-hidden="true">
                        <span className="delimiter-line" />
                        <span className="delimiter-diamond">✦</span>
                        <span className="delimiter-line" />
                    </div>

                    {/* Phrase 2: "Building digital solutions that create real-world impact." */}
                    <div className="ticker-phrase-group">
                        <span className="ticker-word text-gradient-iris">Building digital solutions</span>

                        {/* Inline kinetic Arrow */}
                        <span className="ticker-inline-arrow" aria-hidden="true">
                            <ArrowRight size={32} className="text-iris" />
                        </span>

                        <span className="ticker-word text-white-muted">that create</span>

                        <span className="ticker-word text-white text-glow-iris">real-world impact.</span>

                        {/* Inline pulsing Iris radar beacon */}
                        <span className="ticker-inline-radar radar-iris" aria-hidden="true">
                            <span className="radar-ring ring-iris r1" />
                            <span className="radar-ring ring-iris r2" />
                            <span className="radar-center-dot dot-iris" />
                        </span>
                    </div>

                    {/* Final Site Identity Tag */}
                    <div className="ticker-finale-tag">
                        <span className="ticker-quote-bracket">[ // ]</span>
                        <span className="ticker-finale-text">SIGNBRIDGE // BEYOND DIGITAL</span>
                        <span className="ticker-completion-pill pill-iris">
                            <span className="chip-symbol">✦</span>
                            <span>UNLOCKED</span>
                        </span>
                    </div>

                </div>
            </div>

            {/* Bottom HUD: Live Scroll Cue & Telemetry */}
            <div className="ticker-hud-footer">
                <div className="hud-footer-left">
                    <Mouse size={15} className="text-iris" style={{ animation: 'bounce 1.5s infinite' }} />
                    <span ref={cueTextRef} className="ticker-cue-text">
                        SCROLL DOWN OR SWIPE TO READ COMPLETE DIALOGUE
                    </span>
                </div>

                <div className="hud-footer-right">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="ticker-skip-link link-iris"
                    >
                        SKIP INTRO [ESC] →
                    </button>
                </div>
            </div>
        </aside>
    );
}
