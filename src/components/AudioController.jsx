import React, { useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioController({ isMuted, onToggleMute }) {
    const audioRef = useRef(null);
    const fadeTimerRef = useRef(null);

    const fadeVolume = useCallback((targetVol, duration = 450) => {
        const audio = audioRef.current;
        if (!audio) return;

        clearInterval(fadeTimerRef.current);
        const startVol = audio.volume;
        const startTime = Date.now();

        fadeTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            audio.volume = startVol + (targetVol - startVol) * progress;

            if (progress >= 1) {
                clearInterval(fadeTimerRef.current);
                if (targetVol === 0) {
                    audio.pause();
                }
            }
        }, 30);
    }, []);

    useEffect(() => {
        let audio = document.getElementById('signbridge-global-audio');
        if (!audio) {
            audio = new Audio('/gigidelaromusic-soft-harmonic-breath-short-450972.mp3');
            audio.loop = true;
            audio.preload = 'none';
            audio.volume = 0.55;
        }
        audioRef.current = audio;

        const handleForcePlay = () => {
            if (!isMuted && audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.55;
                audioRef.current.play().catch(() => {});
            }
        };

        window.addEventListener('signbridge-play-audio', handleForcePlay);
        window.__signbridge_play_audio = handleForcePlay;

        return () => {
            window.removeEventListener('signbridge-play-audio', handleForcePlay);
            delete window.__signbridge_play_audio;
            clearInterval(fadeTimerRef.current);
        };
    }, [isMuted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            fadeVolume(0, 350);
        } else {
            audio.muted = false;
            audio.play()
                .then(() => {
                    fadeVolume(0.55, 500);
                })
                .catch(() => {});
        }
    }, [isMuted, fadeVolume]);

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
                aria-label={isMuted ? 'Unmute Ambient Soundtrack (Press M)' : 'Mute Ambient Soundtrack (Press M)'}
                title={isMuted ? 'Unmute Soundtrack (M)' : 'Mute Soundtrack (M)'}
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
