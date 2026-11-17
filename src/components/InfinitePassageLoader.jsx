import React, { useEffect, useState, useCallback, useRef } from 'react';
import ZoomTextTunnel from './originkit/ui/infinite-text-passage';

const PASSAGE_WORDS = [
    'EXPLORE',
    'SOFTWARE',
    'INTELLIGENCE',
    'HARDWARE',
    'SIGNBRIDGE'
];

// Silky smooth transition timing: 400ms hold + 1000ms transition = 1400ms per word
const HOLD_MS = 400;
const DURATION_S = 1.0;
// 4 transitions to reach SIGNBRIDGE (5600ms) + 1400ms grand hold = 7000ms total
const TOTAL_DURATION_MS = 7000;

/**
 * InfinitePassageLoader — Ultra-Minimal & Silky Smooth White Loader
 * Only the zooming word is visible. Completely distraction-free pure studio aesthetic.
 */
export default function InfinitePassageLoader({ onComplete, autoDismissMs = TOTAL_DURATION_MS }) {
    const [isFading, setIsFading] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

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
        }, 750);
    }, [isFading, hasEnded]);

    // Automatically transition smoothly after all words have played and SIGNBRIDGE held
    useEffect(() => {
        if (autoDismissMs > 0) {
            const timer = setTimeout(handleDismiss, autoDismissMs);
            return () => clearTimeout(timer);
        }
    }, [autoDismissMs, handleDismiss]);

    // Invisible click or keyboard listener to enter immediately
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
            {/* Soft Ambient Radial Peach Glow matching Hero 64 */}
            <div className="infinite-loader-glow" aria-hidden="true" />

            {/* Purely the Central Tunnel Stage — Only the loader word is visible */}
            <main className="infinite-loader-stage">
                <ZoomTextTunnel
                    texts={PASSAGE_WORDS}
                    color="#18181b"
                    hold={HOLD_MS}
                    maxScale={28}
                    transition={{
                        type: 'tween',
                        duration: DURATION_S,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    font={{
                        fontFamily: '"Instrument Serif", Georgia, serif',
                        fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        lineHeight: '1em',
                    }}
                />
            </main>
        </aside>
    );
}
