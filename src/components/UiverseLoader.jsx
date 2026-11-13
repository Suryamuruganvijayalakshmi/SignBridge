import React, { useEffect, useState, useCallback, useRef } from 'react';
import '../styles/uiverseLoader.css';

/**
 * UiverseLoader
 * Created from Uiverse.io by kennyotsu
 * Modern spinning word loader used as the starting animation for SignBridge.
 */
export default function UiverseLoader({ onComplete, autoDismissMs = 3800 }) {
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
        }, 600);
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
            className={`uiverse-loader-overlay ${isFading ? 'fade-out' : ''}`}
            onClick={handleDismiss}
            role="status"
            aria-live="polite"
            aria-label="Loading SignBridge..."
            tabIndex={0}
        >
            {/* From Uiverse.io by kennyotsu */}
            <div className="card">
                <div className="loader">
                    <p>loading</p>
                    <div className="words">
                        <span className="word">buttons</span>
                        <span className="word">forms</span>
                        <span className="word">switches</span>
                        <span className="word">cards</span>
                        <span className="word">buttons</span>
                    </div>
                </div>
            </div>

            <div className="uiverse-loader-skip-hint" aria-hidden="true">
                Click or press ESC to enter
            </div>
        </div>
    );
}
