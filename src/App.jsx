import React, { useState, useEffect, useRef } from 'react';
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
    const [coords, setCoords] = useState({ x: null, y: null });

    const activePalette = RIBBON_SPECTRUMS[paletteIndex];
    const toastTimerRef = useRef(null);

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

    // Track mouse coordinates for footer telemetry
    useEffect(() => {
        let lastTime = 0;
        const onPointerMove = (e) => {
            const now = Date.now();
            if (now - lastTime > 60) {
                lastTime = now;
                setCoords({ x: e.clientX, y: e.clientY });
            }
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        return () => window.removeEventListener('pointermove', onPointerMove);
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
            {/* 1. Ultra-Clean Luxury Neat Cursor (Iris precision dot, magnetic glass follower & subtle comet streamline) */}
            <NeatCursor activePalette={activePalette} />

            {/* Subtle cyber grid texture on pure white background */}
            <div className="cyber-grid-overlay" aria-hidden="true" />

            {/* Floating Spectrum HUD Toast */}
            <SpectrumToast message={toastMessage} visible={toastVisible} />

            {/* 2. UI Content Layer */}
            <div className="lumina-viewport">
                <Navbar
                    onOpenContact={() => setContactOpen(true)}
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

                <Footer />
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
        </div>
    );
}
