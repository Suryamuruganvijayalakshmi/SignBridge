import React, { useEffect, useState, useCallback, useRef } from 'react';
import ZoomTextTunnel from './originkit/ui/infinite-text-passage';

const PASSAGE_WORDS = [
    'EXPLORE',
    'SOFTWARE',
    'INTELLIGENCE',
    'HARDWARE',
    'SIGNBRIDGE'
];

// 450ms hold + 800ms tween duration = 1250ms per word cycle
const WORD_INTERVAL_MS = 1250;
// 4 transitions to reach SIGNBRIDGE (5000ms) + 1200ms grand hold = 6200ms total
const TOTAL_PASSAGE_DURATION_MS = 6200;

/**
 * InfinitePassageLoader
 * Powered by Originkit Infinite Text Passage (ZoomTextTunnel) in pure White Theme.
 * Every word executes its full tunnel zoom animation, concluding with a grand hold on SIGNBRIDGE.
 */
export default function InfinitePassageLoader({ onComplete, autoDismissMs = TOTAL_PASSAGE_DURATION_MS }) {
    const [isFading, setIsFading] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const handleDismiss = useCallback(() => {
        if (isFading || hasEnded) return;
        setIsFading(true);
        setTimeout(() => {
            setHasEnded(true);
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, 650);
    }, [isFading, hasEnded]);

    // Track active word in real time
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < PASSAGE_WORDS.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, WORD_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    // Dismiss only after EVERY word has completed its full entrance and SIGNBRIDGE has held
    useEffect(() => {
        if (autoDismissMs > 0) {
            const timer = setTimeout(handleDismiss, autoDismissMs);
            return () => clearTimeout(timer);
        }
    }, [autoDismissMs, handleDismiss]);

    // Keyboard shortcuts to skip (Esc, Enter, Space)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDismiss();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleDismiss]);

    if (hasEnded) return null;

    return (
        <aside
            className={`infinite-loader-overlay ${isFading ? 'fade-out' : ''}`}
            onClick={handleDismiss}
            role="status"
            aria-live="polite"
            aria-label="Loading SignBridge..."
        >
            {/* Ambient Background Glow in Warm Sunset Peach */}
            <div className="infinite-loader-glow" aria-hidden="true" />

            {/* Top Brand & Word Phase Bar */}
            <header className="infinite-loader-topbar">
                <div className="infinite-loader-brand">
                    <img
                        src="/signbridge-emblem.webp"
                        alt="SignBridge Logo"
                        className="infinite-loader-emblem"
                        width="28"
                        height="18"
                    />
                    <span className="infinite-loader-brand-text">SignBridge<sup>®</sup></span>
                </div>

                <div className="infinite-loader-step-pill">
                    <div className="infinite-loader-dots" aria-hidden="true">
                        {PASSAGE_WORDS.map((w, idx) => (
                            <span
                                key={w}
                                className={`infinite-step-dot ${currentStep >= idx ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                    <span>0{currentStep + 1} // {PASSAGE_WORDS[currentStep]}</span>
                </div>
            </header>

            {/* Central Tunnel Stage with ZoomTextTunnel */}
            <main className="infinite-loader-stage">
                <ZoomTextTunnel
                    texts={PASSAGE_WORDS}
                    color="#18181b"
                    hold={450}
                    maxScale={34}
                    transition={{
                        type: 'tween',
                        duration: 0.8,
                        ease: [0.7, 0, 0.25, 1],
                    }}
                    font={{
                        fontFamily: '"Instrument Serif", Georgia, serif',
                        fontSize: 'clamp(2.8rem, 8.5vw, 6.8rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        lineHeight: '1em',
                    }}
                />
            </main>

            {/* Subtle Skip Hint */}
            <footer className="infinite-loader-footer" aria-hidden="true">
                <span className="infinite-loader-skip-pill">
                    CLICK ANYWHERE OR PRESS <b>ESC</b> TO ENTER
                </span>
            </footer>
        </aside>
    );
}
