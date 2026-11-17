import React, { useState, useEffect, useCallback } from 'react';
import LEDTicker from './originkit/ui/pixel-led-display';

/**
 * PixelLedLoader — Originkit "Pixel LED Display" Site Loading Experience
 * Pure light studio theme matching Hero 64 with ticker-driven brand introduction.
 */
export default function PixelLedLoader({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const finish = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onComplete?.();
        }, 550);
    }, [onComplete]);

    // Animate loading progress from 0 to 100% over ~2.8s
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finish();
                    return 100;
                }
                // Ease in-out progression
                const increment = Math.max(1, Math.floor((100 - prev) * 0.14) + 1);
                const next = Math.min(100, prev + increment);
                if (next >= 100) {
                    setTimeout(finish, 350);
                }
                return next;
            });
        }, 55);

        return () => clearInterval(interval);
    }, [finish]);

    // Keyboard shortcuts to skip immediately (ESC, Enter, Space)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                finish();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [finish]);

    return (
        <aside
            className={`pixel-led-loader-overlay ${isExiting ? 'is-exiting' : ''}`}
            onClick={finish}
            role="status"
            aria-live="polite"
            aria-label="Loading SignBridge"
        >
            {/* Soft Ambient Radial Peach Glow matching Hero 64 Meadow */}
            <div className="pixel-led-loader-glow" aria-hidden="true" />

            {/* Top Studio Brand Bar */}
            <header className="pixel-led-loader-header">
                <div className="pixel-loader-brand">
                    <img
                        src="/signbridge-emblem.webp"
                        alt="SignBridge Logo"
                        className="pixel-loader-emblem"
                        width="28"
                        height="18"
                    />
                    <span className="pixel-loader-brand-text">SignBridge<sup>®</sup></span>
                </div>
                <div className="pixel-loader-status-pill">
                    <span className="pixel-loader-pulse-dot" />
                    <span>SYSTEM MATRIX READY</span>
                </div>
            </header>

            {/* Center: Originkit Pixel LED Display */}
            <main className="pixel-led-stage">
                <div className="pixel-led-ticker-wrap">
                    <LEDTicker
                        items={['SIGNBRIDGE', 'AI & HARDWARE', 'RESEARCH LAB']}
                        separator="●"
                        speed={18}
                        direction="left"
                        textSize={isMobile ? 85 : 130}
                        dotSize={isMobile ? 10 : 15}
                        dotQuantity={10}
                        dotShape="round"
                        onColor="#18181b"
                        offColor="rgba(24, 24, 27, 0.055)"
                        glow={false}
                        flicker={false}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>

                <div className="pixel-led-subtitle">
                    <span>MULTIDISCIPLINARY ENGINEERING</span>
                    <b>·</b>
                    <span>INTELLIGENT SYSTEMS</span>
                    <b>·</b>
                    <span>SPATIAL COMPUTE</span>
                </div>
            </main>

            {/* Bottom Progress & Skip Control */}
            <footer className="pixel-led-loader-footer">
                <div className="pixel-progress-wrap">
                    <div className="pixel-progress-meta">
                        <span className="pixel-progress-label">INITIALIZING HARDWARE MATRIX</span>
                        <span className="pixel-progress-value">{String(progress).padStart(3, '0')}%</span>
                    </div>
                    <div className="pixel-progress-track">
                        <div
                            className="pixel-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="pixel-loader-skip-pill">
                    <span>Press <b>ESC</b> or click anywhere to enter</span>
                </div>
            </footer>
        </aside>
    );
}
