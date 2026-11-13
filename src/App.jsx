import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NeatCursor from './components/NeatCursor.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DisciplinesMarquee from './components/DisciplinesMarquee.jsx';
import CapabilitiesSection from './components/CapabilitiesSection.jsx';
import ProductsSection from './components/products/ProductsSection.jsx';
import ResearchSection from './components/ResearchSection.jsx';
import ProcessTimeline from './components/ProcessTimeline.jsx';
import VisionBanner from './components/VisionBanner.jsx';
import FaqSection from './components/FaqSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import SpectrumToast from './components/SpectrumToast.jsx';
import AudioController from './components/AudioController.jsx';
import UiverseLoader from './components/UiverseLoader.jsx';

// Lazy-loaded heavy routes and modals
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const ContactModal = lazy(() => import('./components/ContactModal.jsx'));

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

function ScrollToHash() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.slice(1);
            const timer = setTimeout(() => {
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 60);
            return () => clearTimeout(timer);
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [pathname, hash]);

    return null;
}

export default function App() {
    const [paletteIndex, setPaletteIndex] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    // Starting animation: Uiverse spinning words loader shows on initial site visit
    const [introComplete, setIntroComplete] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const activePalette = RIBBON_SPECTRUMS[paletteIndex];
    const toastTimerRef = useRef(null);
    const audioCtxRef = useRef(null);
    const soundEnabled = !isMuted;

    const triggerToast = useCallback((msg) => {
        setToastMessage(msg);
        setToastVisible(true);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setToastVisible(false);
        }, 2200);
    }, []);

    const playSynthFeedback = useCallback((freq = 520, type = 'sine') => {
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
    }, [soundEnabled]);

    const handleReplayIntro = useCallback(() => {
        setIntroComplete(false);
        triggerToast('// REPLAYING INTRO LOADER');
        playSynthFeedback(660, 'sine');
    }, [triggerToast, playSynthFeedback]);

    const handleIntroFinished = useCallback(() => {
        setIntroComplete(true);
    }, []);

    const handleShiftSpectrum = useCallback(() => {
        setPaletteIndex((prev) => {
            const nextIdx = (prev + 1) % RIBBON_SPECTRUMS.length;
            const next = RIBBON_SPECTRUMS[nextIdx];
            triggerToast(`// SPECTRUM SHIFTED: ${next.name}`);
            if (next.accent) {
                document.documentElement.style.setProperty('--current-accent', next.accent);
            }
            return nextIdx;
        });
    }, [triggerToast]);

    const handleToggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            triggerToast(next ? '// SOUNDTRACK: MUTED' : '// SOUNDTRACK: AUDIO ON');
            return next;
        });
    }, [triggerToast]);

    // Spacebar shortcut to cycle spectrum
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                handleShiftSpectrum();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleShiftSpectrum]);

    return (
        <div className="signbridge-app">
            <ScrollToHash />

            {/* Global Ambient Soundtrack Player */}
            <AudioController
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
            />

            {/* Precision Luxury Cursor */}
            {introComplete && <NeatCursor activePalette={activePalette} />}

            {/* Subtle cyber grid texture on background */}
            <div className="cyber-grid-overlay" aria-hidden="true" />

            {/* Floating Spectrum HUD Toast */}
            <SpectrumToast message={toastMessage} visible={toastVisible} />

            {/* Main UI Layer */}
            <div
                className="lumina-viewport"
                style={{
                    opacity: introComplete ? 1 : 0,
                    visibility: introComplete ? 'visible' : 'hidden',
                    pointerEvents: introComplete ? 'auto' : 'none',
                    transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <Navbar
                    soundEnabled={soundEnabled}
                    onToggleSound={handleToggleMute}
                    onOpenContact={() => setContactOpen(true)}
                    onReplayIntro={handleReplayIntro}
                />

                <Suspense fallback={<div style={{ minHeight: '60vh' }} aria-busy="true" />}>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Hero />

                                <DisciplinesMarquee />

                                <CapabilitiesSection />

                                <ProductsSection />

                                <ResearchSection onOpenContact={() => setContactOpen(true)} />

                                <ProcessTimeline />

                                <VisionBanner />

                                <FaqSection />

                                <ContactSection onNotification={triggerToast} />
                            </>
                        } />
                        <Route path="/products/:slug" element={<ProductDetailPage onNotification={triggerToast} />} />
                    </Routes>
                </Suspense>

                <Footer onReplayIntro={handleReplayIntro} />
            </div>

            {/* Lazy-loaded Top-Layer Modals */}
            {contactOpen && (
                <Suspense fallback={null}>
                    <ContactModal
                        isOpen={contactOpen}
                        onClose={() => setContactOpen(false)}
                        onNotification={triggerToast}
                    />
                </Suspense>
            )}

            {/* Starting animation: Uiverse spinning words loader */}
            {!introComplete && (
                <UiverseLoader onComplete={handleIntroFinished} />
            )}
        </div>
    );
}
