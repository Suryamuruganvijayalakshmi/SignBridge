import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';

export default function AudioController({ isMuted, onToggleMute, triggerToast }) {
    const audioRef = useRef(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const fadeTimerRef = useRef(null);

    // Fade volume smoothly
    const fadeVolume = useCallback((targetVol, duration = 600) => {
        const audio = audioRef.current;
        if (!audio) return;

        clearInterval(fadeTimerRef.current);
        const startVol = audio.volume;
        const startTime = Date.now();

        fadeTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease in out
            audio.volume = startVol + (targetVol - startVol) * progress;

            if (progress >= 1) {
                clearInterval(fadeTimerRef.current);
                if (targetVol === 0) {
                    audio.pause();
                }
            }
        }, 30);
    }, []);

    // Initialize audio on mount
    useEffect(() => {
        const audio = new Audio('/gigidelaromusic-soft-harmonic-breath-short-450972.mp3');
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0.55;
        audioRef.current = audio;

        const attemptPlay = () => {
            if (isMuted || !audioRef.current) return;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setHasInteracted(true);
                    })
                    .catch(() => {
                        // Browser autoplay policy prevented instant unmuted playback.
                        // Wait for first user interaction (click, touch, keydown, scroll)
                        const onFirstInteraction = () => {
                            if (!isMuted && audioRef.current) {
                                audioRef.current.play().then(() => {
                                    setIsPlaying(true);
                                    setHasInteracted(true);
                                }).catch(() => {});
                            }
                            cleanupListeners();
                        };

                        const cleanupListeners = () => {
                            window.removeEventListener('pointerdown', onFirstInteraction);
                            window.removeEventListener('click', onFirstInteraction);
                            window.removeEventListener('keydown', onFirstInteraction);
                            window.removeEventListener('touchstart', onFirstInteraction);
                            window.removeEventListener('scroll', onFirstInteraction);
                        };

                        window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('click', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
                    });
            }
        };

        const handleForcePlay = () => {
            attemptPlay();
        };

        window.addEventListener('signbridge-play-audio', handleForcePlay);
        attemptPlay();

        return () => {
            window.removeEventListener('signbridge-play-audio', handleForcePlay);
            clearInterval(fadeTimerRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isMuted]);

    // Handle mute / unmute state changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            fadeVolume(0, 400);
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    fadeVolume(0.55, 600);
                })
                .catch(() => {});
        }
    }, [isMuted, fadeVolume]);

    // Keyboard shortcut 'M' to toggle mute
    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.key === 'm' || e.key === 'M') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                onToggleMute();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onToggleMute]);

    return (
        <aside 
            className={`global-audio-hud ${isMuted ? 'is-muted' : 'is-playing'}`}
            aria-label="Soundtrack audio controller"
        >
            <button
                type="button"
                onClick={onToggleMute}
                className="audio-hud-btn"
                aria-label={isMuted ? "Unmute Ambient Soundtrack (Press M)" : "Mute Ambient Soundtrack (Press M)"}
                title={isMuted ? "Unmute Soundtrack (M)" : "Mute Soundtrack (M)"}
            >
                <div className="audio-icon-wrap">
                    {isMuted ? (
                        <VolumeX size={15} className="hud-vol-icon text-slate-400" />
                    ) : (
                        <Volume2 size={15} className="hud-vol-icon text-iris" />
                    )}
                </div>

                <div className="audio-visualizer-bars" aria-hidden="true">
                    <span className={`audio-bar bar-1 ${!isMuted ? 'animating' : ''}`} />
                    <span className={`audio-bar bar-2 ${!isMuted ? 'animating' : ''}`} />
                    <span className={`audio-bar bar-3 ${!isMuted ? 'animating' : ''}`} />
                    <span className={`audio-bar bar-4 ${!isMuted ? 'animating' : ''}`} />
                </div>

                <span className="audio-hud-label">
                    {isMuted ? 'SOUND // OFF' : 'SOUND // ON'}
                </span>
            </button>
        </aside>
    );
}
