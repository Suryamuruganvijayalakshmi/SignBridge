import React, { useEffect, useState, useCallback, useRef } from 'react';
import '../styles/uiverseLoader.css';

/**
 * UiverseLoader
 * From Uiverse.io by dexter-st
 * Animated letter-wave & glowing laser-track loader for SignBridge.
 */
export default function UiverseLoader({ onComplete, autoDismissMs = 3200 }) {
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
            {/* From Uiverse.io by dexter-st */}
            <div className="loader-wrapper">
                <span className="loader-letter">S</span>
                <span className="loader-letter">i</span>
                <span className="loader-letter">g</span>
                <span className="loader-letter">n</span>
                <span className="loader-letter">B</span>
                <span className="loader-letter">r</span>
                <span className="loader-letter">i</span>
                <span className="loader-letter">d</span>
                <span className="loader-letter">g</span>
                <span className="loader-letter">e</span>

                <div className="loader"></div>
            </div>

            <div className="uiverse-loader-skip-hint" aria-hidden="true">
                Click or press ESC to enter
            </div>
        </div>
    );
}
