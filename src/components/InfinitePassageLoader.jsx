import React, { useEffect, useState, useCallback, useRef } from 'react';
import ZoomTextTunnel from './originkit/ui/infinite-text-passage';

/**
 * InfinitePassageLoader
 * Powered by Originkit Infinite Text Passage (ZoomTextTunnel).
 * Cinematic full-screen dark tunnel loading sequence that journeys through
 * foundational concepts and culminates with "SIGNBRIDGE" before revealing the site.
 */
export default function InfinitePassageLoader({ onComplete, autoDismissMs = 4800 }) {
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
        }, 650);
    }, [isFading, hasEnded]);

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
        <div
            className={`infinite-loader-overlay ${isFading ? 'fade-out' : ''}`}
            onClick={handleDismiss}
            role="status"
            aria-live="polite"
            aria-label="Loading SignBridge..."
        >
            {/* Ambient Background Glow */}
            <div className="infinite-loader-glow" aria-hidden="true" />

            {/* Central Tunnel Stage */}
            <div className="infinite-loader-stage">
                <ZoomTextTunnel
                    texts={['EXPLORE', 'INNOVATE', 'CREATE', 'SIGNBRIDGE']}
                    color="#FFFFFF"
                    hold={520}
                    maxScale={32}
                    transition={{
                        type: 'tween',
                        duration: 0.95,
                        ease: [0.7, 0, 0.25, 1],
                    }}
                    font={{
                        fontFamily: '"Instrument Serif", Georgia, serif',
                        fontSize: 'clamp(3.5rem, 11vw, 8.5rem)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        lineHeight: '1em',
                    }}
                />
            </div>

            {/* Subtle Skip Hint */}
            <div className="infinite-loader-footer" aria-hidden="true">
                <span className="infinite-loader-skip-pill">
                    CLICK ANYWHERE OR PRESS <b>ESC</b> TO ENTER
                </span>
            </div>
        </div>
    );
}
