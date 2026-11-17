import React, { useEffect, useState, useCallback, useRef } from 'react';
import ZoomTextTunnel from './originkit/ui/infinite-text-passage';

const PASSAGE_WORDS = [
    'EXPLORE',
    'SOFTWARE',
    'INTELLIGENCE',
    'HARDWARE',
    'SIGNBRIDGE'
];

// Snappy, high-frame-rate performance: 260ms hold + 550ms smooth transition = 810ms per word
const HOLD_MS = 260;
const DURATION_S = 0.55;
// 4 transitions to reach SIGNBRIDGE (3240ms) + 850ms hold = 4090ms total
const TOTAL_DURATION_MS = 4090;

/**
 * InfinitePassageLoader — Ultra-Smooth & Snappy 60fps Minimal Loader
 * Hardware-accelerated, zero-lag performance displaying only the zooming words.
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
        }, 480);
    }, [isFading, hasEnded]);

    // Automatically transition after all words have played and SIGNBRIDGE held
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
            {/* Lightweight Ambient Glow without heavy blur filters */}
            <div className="infinite-loader-glow" aria-hidden="true" />

            {/* Purely the Central Tunnel Stage — Only the loader word is visible */}
            <main className="infinite-loader-stage">
                <ZoomTextTunnel
                    texts={PASSAGE_WORDS}
                    color="#18181b"
                    hold={HOLD_MS}
                    maxScale={7}
                    transition={{
                        type: 'tween',
                        duration: DURATION_S,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    font={{
                        fontFamily: '"Instrument Serif", Georgia, serif',
                        fontSize: 'clamp(3rem, 9vw, 6.5rem)',
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
