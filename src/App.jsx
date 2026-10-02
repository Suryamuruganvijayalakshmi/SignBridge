import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage.jsx';
import NeatCursor from './components/NeatCursor.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DisciplinesMarquee from './components/DisciplinesMarquee.jsx';
import CapabilitiesSection from './components/CapabilitiesSection.jsx';
import SmartTableSection from './components/SmartTableSection.jsx';
import ResearchSection from './components/ResearchSection.jsx';
import ProcessTimeline from './components/ProcessTimeline.jsx';
import TeamSection from './components/TeamSection.jsx';
import VisionBanner from './components/VisionBanner.jsx';
import ContactSection from './components/ContactSection.jsx';
import FaqSection from './components/FaqSection.jsx';
import Footer from './components/Footer.jsx';
import ShowreelModal from './components/ShowreelModal.jsx';
import ContactModal from './components/ContactModal.jsx';
import SpectrumToast from './components/SpectrumToast.jsx';
import SignBridgeIntroStage from './components/ParticleGlobe/SignBridgeIntroStage.jsx';
import AudioController from './components/AudioController.jsx';

export const RIBBON_SPECTRUMS = [
    {
        id: 'iris-prime',
        name: 'ELECTRIC IRIS // PROTOCOL',
        colors: ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc'],
        accent: '#6366f1',
        dots: ['#6366f1', '#818cf8', '#4f46e5'],
    },
    {
        id: 'cyber-violet',
        name: 'CYBER VIOLET // NEBULA',
        colors: ['#7c3aed', '#9333ea', '#c084fc', '#6366f1'],
        accent: '#7c3aed',
        dots: ['#7c3aed', '#c084fc', '#6366f1'],
    },
    {
        id: 'deep-indigo',
        name: 'DEEP INDIGO // LUMINA',
        colors: ['#4338ca', '#4f46e5', '#6366f1', '#312e81'],
        accent: '#4f46e5',
        dots: ['#4338ca', '#4f46e5', '#6366f1'],
    },
    {
        id: 'soft-lavender',
        name: 'SOFT LAVENDER // ETHEREAL',
        colors: ['#818cf8', '#a5b4fc', '#c7d2fe', '#6366f1'],
        accent: '#818cf8',
        dots: ['#818cf8', '#c7d2fe', '#6366f1'],
    },
    {
        id: 'electric-cyan',
        name: 'ELECTRIC CYAN // QUANTUM',
        colors: ['#0284c7', '#0ea5e9', '#38bdf8', '#6366f1'],
        accent: '#0284c7',
        dots: ['#0284c7', '#38bdf8', '#6366f1'],
    },
    {
        id: 'royal-magenta',
        name: 'ROYAL MAGENTA // SYNAPSE',
        colors: ['#c026d3', '#d946ef', '#f472b6', '#7c3aed'],
        accent: '#c026d3',
        dots: ['#c026d3', '#f472b6', '#7c3aed'],
    },
    {
        id: 'vibrant-amber',
        name: 'VIBRANT AMBER // RADIANCE',
        colors: ['#d97706', '#f59e0b', '#fbbf24', '#6366f1'],
        accent: '#d97706',
        dots: ['#d97706', '#fbbf24', '#6366f1'],
    }
];

export default function App() {
    const [paletteIndex, setPaletteIndex] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [showreelOpen, setShowreelOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    // Globe animation is the definitive starter of the site on every opening
    const [introComplete, setIntroComplete] = useState(false);

    const activePalette = RIBBON_SPECTRUMS[paletteIndex];
    const toastTimerRef = useRef(null);
    const audioCtxRef = useRef(null);

    const handleReplayIntro = useCallback(() => {
        try {
            sessionStorage.removeItem('signbridge-intro-seen');
        } catch (e) {}
        setIntroComplete(false);
        triggerToast('// REPLAYING CINEMATIC PARTICLE INTRO');
        playSynthFeedback(660, 'sine');
    }, []);

    const handleIntroFinished = useCallback(() => {
        setIntroComplete(true);
    }, []);

    const playSynthFeedback = (freq = 520, type = 'sine') => {
        if (!soundEnabled) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch (e) {
            // Audio ignore
        }
    };

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setToastVisible(true);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setToastVisible(false);
        }, 2200);
    };

    const handleShiftSpectrum = () => {
        setPaletteIndex((prev) => {
            const nextIdx = (prev + 1) % RIBBON_SPECTRUMS.length;
            const next = RIBBON_SPECTRUMS[nextIdx];
            triggerToast(`// SPECTRUM SHIFTED: ${next.name}`);
            if (next.accent) {
                document.documentElement.style.setProperty('--current-accent', next.accent);
            }
            return nextIdx;
        });
    };

    const [isMuted, setIsMuted] = useState(false);
    const soundEnabled = !isMuted;

    const handleToggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            triggerToast(next ? '// SOUNDTRACK: MUTED' : '// SOUNDTRACK: AUDIO ON');
            return next;
        });
    }, []);

    // Spacebar shortcut to cycle spectrum
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                handleShiftSpectrum();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="signbridge-app">
            {/* Global Ambient Soundtrack Player with Autoplay & Mute Control */}
            <AudioController
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                triggerToast={triggerToast}
            />

            {/* 1. Ultra-Clean Luxury Neat Cursor (Active only when main website is visible) */}
            {introComplete && <NeatCursor activePalette={activePalette} />}

            {/* Subtle cyber grid texture on pure white background */}
            <div className="cyber-grid-overlay" aria-hidden="true" />

            {/* Floating Spectrum HUD Toast */}
            <SpectrumToast message={toastMessage} visible={toastVisible} />

            {/* 2. UI Content Layer - Hidden during intro starter, reveals seamlessly */}
            <div
                className="lumina-viewport"
                style={{
                    opacity: introComplete ? 1 : 0,
                    visibility: introComplete ? 'visible' : 'hidden',
                    pointerEvents: introComplete ? 'auto' : 'none',
                    transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.85s'
                }}
            >
                <Navbar
                    soundEnabled={soundEnabled}
                    onToggleSound={handleToggleMute}
                    onOpenContact={() => setContactOpen(true)}
                    onReplayIntro={handleReplayIntro}
                />

                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero
                                onOpenShowreel={() => setShowreelOpen(true)}
                                onOpenContact={() => setContactOpen(true)}
                            />

                            <DisciplinesMarquee />

                            <CapabilitiesSection />

                            <SmartTableSection
                                onOpenShowreel={() => setShowreelOpen(true)}
                                onOpenContact={() => setContactOpen(true)}
                            />

                            <ResearchSection onOpenContact={() => setContactOpen(true)} />

                            <ProcessTimeline />

                            <TeamSection />

                            <VisionBanner />

                            <ContactSection onNotification={triggerToast} />

                            <FaqSection />
                        </>
                    } />
                    <Route path="/product" element={<ProductPage />} />
                </Routes>

                <Footer onReplayIntro={handleReplayIntro} />
            </div>

            {/* 3. Top-Layer Dialog Modals */}
            <ShowreelModal
                isOpen={showreelOpen}
                onClose={() => setShowreelOpen(false)}
            />

            <ContactModal
                isOpen={contactOpen}
                onClose={() => setContactOpen(false)}
                onNotification={triggerToast}
            />

            {/* 4. Full-Screen Cinematic Particle Intro Animation (Visible first on entry) */}
            {!introComplete && (
                <SignBridgeIntroStage onComplete={handleIntroFinished} />
            )}
        </div>
    );
}
