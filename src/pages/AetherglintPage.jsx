import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wind, Sliders, RotateCcw } from 'lucide-react';
import StillCameraLooking, { AetherglintBase } from '../components/originkit/Aetherglint.jsx';

const PRESETS = [
    {
        id: 'originkit',
        name: 'Originkit Preset',
        bg: '#6D4991',
        grass: '#8A5789',
        tip: '#B8B0E8',
        flower: '#F600FF',
    },
    {
        id: 'signbridge-iris',
        name: 'SignBridge Electric Iris',
        bg: '#0c0a1a',
        grass: '#6366f1',
        tip: '#c7d2fe',
        flower: '#fbbf24',
    },
    {
        id: 'cyber-violet',
        name: 'Cyber Violet // Nebula',
        bg: '#120b24',
        grass: '#7c3aed',
        tip: '#e9d5ff',
        flower: '#f43f5e',
    },
    {
        id: 'deep-indigo',
        name: 'Deep Indigo // Lumina',
        bg: '#080d1a',
        grass: '#4338ca',
        tip: '#93c5fd',
        flower: '#38bdf8',
    }
];

export default function AetherglintPage() {
    const [presetIndex, setPresetIndex] = useState(0);
    const [speed, setSpeed] = useState(50);
    const [wind, setWind] = useState(90);
    const [density, setDensity] = useState(65);
    const [hudOpen, setHudOpen] = useState(false);

    const active = PRESETS[presetIndex];

    return (
        <div
            className="aetherglint-preview-page"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: active.bg,
                overflow: 'hidden',
                zIndex: 999999,
            }}
        >
            {/* Pure full-screen Aetherglint canvas */}
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <AetherglintBase
                    background={active.bg}
                    grassColor={active.grass}
                    tipColor={active.tip}
                    flowerColor={active.flower}
                    speed={speed}
                    wind={wind}
                    density={density}
                    scale={175}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Minimalist Floating Navigation Pill */}
            <div
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        letterSpacing: '0.12em',
                        textDecoration: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <ArrowLeft size={14} />
                    <span>BACK TO SIGNBRIDGE</span>
                </Link>

                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '9999px',
                        background: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#c7d2fe',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.14em',
                    }}
                >
                    <Sparkles size={13} className="text-iris" />
                    <span>AETHERGLINT // ORIGINKIT</span>
                </div>
            </div>

            {/* Bottom Floating Control Pill */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.6rem',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.2)',
                }}
            >
                {PRESETS.map((p, idx) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setPresetIndex(idx)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.45rem 0.95rem',
                            borderRadius: '9999px',
                            background: presetIndex === idx ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                            border: presetIndex === idx ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid transparent',
                            color: presetIndex === idx ? '#ffffff' : '#94a3b8',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: p.flower,
                                boxShadow: `0 0 8px ${p.flower}`,
                            }}
                        />
                        <span>{p.name}</span>
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => setHudOpen((prev) => !prev)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: hudOpen ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        cursor: 'pointer',
                    }}
                    title="Tuning Sliders"
                >
                    <Sliders size={14} />
                </button>
            </div>

            {/* Tuning Drawer */}
            {hudOpen && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '5rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        width: '320px',
                        background: 'rgba(15, 23, 42, 0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', letterSpacing: '0.12em', color: '#c7d2fe' }}>
                            WIND &amp; ENVIRONMENT
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setSpeed(50);
                                setWind(90);
                                setDensity(65);
                            }}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            title="Reset"
                        >
                            <RotateCcw size={12} />
                        </button>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Wind Intensity</span>
                            <span>{wind}%</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="180"
                            value={wind}
                            onChange={(e) => setWind(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#6366f1' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Animation Speed</span>
                            <span>{speed}%</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="120"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#6366f1' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Blade Density</span>
                            <span>{density}%</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="100"
                            value={density}
                            onChange={(e) => setDensity(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#6366f1' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

