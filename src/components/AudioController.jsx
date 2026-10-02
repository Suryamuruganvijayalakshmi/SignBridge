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

    // Initialize and attach to global audio element on mount
    useEffect(() => {
        let audio = document.getElementById('signbridge-global-audio');
        if (!audio) {
            audio = new Audio('/gigidelaromusic-soft-harmonic-breath-short-450972.mp3');
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.55;
        }
        audioRef.current = audio;

        const updatePlayingState = () => {
            if (audio && !audio.paused && !audio.muted && audio.volume > 0) {
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('play', updatePlayingState);
        audio.addEventListener('playing', updatePlayingState);
        audio.addEventListener('pause', updatePlayingState);
        audio.addEventListener('volumechange', updatePlayingState);

        const attemptPlay = () => {
            if (isMuted || !audioRef.current) return;
            audioRef.current.muted = false;
            audioRef.current.volume = 0.55;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setHasInteracted(true);
                    })
                    .catch(() => {
                        // Browser autoplay policy prevented unmuted playback.
                        // Play muted first so timeline is locked with the globe
                        if (audioRef.current) {
                            audioRef.current.muted = true;
                            audioRef.current.play().catch(() => {});
                        }

                        const onFirstInteraction = () => {
                            if (!isMuted && audioRef.current) {
                                audioRef.current.muted = false;
                                audioRef.current.volume = 0.55;
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
                            window.removeEventListener('mousemove', onFirstInteraction);
                        };

                        window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('click', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
                        window.addEventListener('mousemove', onFirstInteraction, { once: true, passive: true });
                    });
            }
        };

        const handleForcePlay = () => {
            attemptPlay();
        };

        window.addEventListener('signbridge-play-audio', handleForcePlay);
        window.__signbridge_play_audio = handleForcePlay;
        attemptPlay();

        return () => {
            window.removeEventListener('signbridge-play-audio', handleForcePlay);
            delete window.__signbridge_play_audio;
            clearInterval(fadeTimerRef.current);
            if (audio) {
                audio.removeEventListener('play', updatePlayingState);
                audio.removeEventListener('playing', updatePlayingState);
                audio.removeEventListener('pause', updatePlayingState);
                audio.removeEventListener('volumechange', updatePlayingState);
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
