import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wind, Sliders, RotateCcw, Cloud, Sun } from 'lucide-react';
import CloudSky, { OriginkitBase_CloudSky } from '../components/originkit/CloudSky.jsx';

const PRESETS = [
    {
        id: 'dark-nocturnal',
        name: 'Dark Nocturnal Void (Default)',
        bg: '#070414',
        horizon: '#150a2e',
        cloud: '#3e2d61',
        sunGlow: 'rgba(180, 195, 255, 0.35)',
        sunX: 85,
        sunY: 90,
        density: 95,
        speed: 46,
        size: 135,
        cirrus: 50,
        shadow: 115,
        softness: 190,
    },
    {
        id: 'cyber-noir-storm',
        name: 'Cyber Noir Storm',
        bg: '#06070a',
        horizon: '#10141d',
        cloud: '#262d3d',
        sunGlow: 'rgba(56, 189, 248, 0.35)',
        sunX: 80,
        sunY: 88,
        density: 100,
        speed: 50,
        size: 140,
        cirrus: 40,
        shadow: 120,
        softness: 180,
    },
    {
        id: 'deep-indigo-nebula',
        name: 'Deep Indigo Nebula',
        bg: '#07061a',
        horizon: '#131138',
        cloud: '#312e6b',
        sunGlow: 'rgba(147, 130, 250, 0.4)',
        sunX: 90,
        sunY: 92,
        density: 90,
        speed: 42,
        size: 130,
        cirrus: 60,
        shadow: 100,
        softness: 200,
    },
    {
        id: 'originkit-preset',
        name: 'Originkit Daylight (Electric Violet)',
        bg: '#8100FF',
        horizon: '#B4D2F0',
        cloud: '#FFFFFF',
        sunGlow: '#FFFFFF',
        sunX: 100,
        sunY: 100,
        density: 100,
        speed: 64,
        size: 130,
        cirrus: 100,
        shadow: 70,
        softness: 200,
    }
];

export default function CloudSkyPage() {
    const [presetIndex, setPresetIndex] = useState(0);
    const [speed, setSpeed] = useState(46);
    const [density, setDensity] = useState(95);
    const [size, setSize] = useState(135);
    const [cirrus, setCirrus] = useState(50);
    const [hudOpen, setHudOpen] = useState(false);

    const active = PRESETS[presetIndex];

    return (
        <div
            className="cloud-sky-preview-page"
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
            {/* Pure full-screen CloudSky canvas */}
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <OriginkitBase_CloudSky
                    background={active.bg}
                    baseColor={active.horizon}
                    accentColor={active.cloud}
                    density={density}
                    speed={speed}
                    size={size}
                    clouds={{
                        cirrus: cirrus,
                        shadow: active.shadow,
                        softness: active.softness,
                    }}
                    sun={{
                        x: active.sunX,
                        y: active.sunY,
                        glow: active.sunGlow,
                    }}
                    pointer={{
                        wind: 300,
                        damping: 50,
                        parallax: 300,
                    }}
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
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textDecoration: 'none',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                    }}
                >
                    <ArrowLeft size={14} />
                    <span>RETURN TO SIGNBRIDGE</span>
                </Link>

                <button
                    type="button"
                    onClick={() => setHudOpen((prev) => !prev)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        background: hudOpen ? '#6366f1' : 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                    }}
                >
                    <Sliders size={14} />
                    <span>{hudOpen ? 'CLOSE ATMOSPHERE HUD' : 'ATMOSPHERE HUD'}</span>
                </button>
            </div>

            {/* Interactive Control HUD Drawer */}
            {hudOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '4.5rem',
                        left: '1.5rem',
                        zIndex: 10,
                        width: '340px',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        background: 'rgba(15, 12, 34, 0.88)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        color: '#ffffff',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
                        fontFamily: 'var(--font-body, sans-serif)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10.5px', letterSpacing: '0.2em', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>
                            // ORIGINKIT CLOUD SKY CONTROLS
                        </span>
                        <Cloud size={15} style={{ color: '#c084fc' }} />
                    </div>

                    {/* Presets */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            Colorway Presets
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
                            {PRESETS.map((p, idx) => {
                                const isSelected = idx === presetIndex;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                            setPresetIndex(idx);
                                            setSpeed(p.speed);
                                            setDensity(p.density);
                                            setSize(p.size);
                                            setCirrus(p.cirrus);
                                        }}
                                        style={{
                                            padding: '0.55rem 0.85rem',
                                            borderRadius: '10px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                                            border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                            color: isSelected ? '#ffffff' : '#cbd5e1',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span>{p.name}</span>
                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.bg, border: '1px solid rgba(255,255,255,0.4)' }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                                <span>SPEED</span>
                                <span>{speed}%</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={100}
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#6366f1' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                                <span>CLOUD DENSITY</span>
                                <span>{density}%</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={100}
                                value={density}
                                onChange={(e) => setDensity(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#6366f1' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                                <span>CLOUD SCALE</span>
                                <span>{size}</span>
                            </div>
                            <input
                                type="range"
                                min={50}
                                max={250}
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#6366f1' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                                <span>CIRRUS VEIL</span>
                                <span>{cirrus}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={cirrus}
                                onChange={(e) => setCirrus(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#6366f1' }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setPresetIndex(0);
                            setSpeed(64);
                            setDensity(100);
                            setSize(130);
                            setCirrus(100);
                        }}
                        style={{
                            marginTop: '1.25rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.45rem',
                            padding: '0.55rem',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        <RotateCcw size={12} />
                        <span>RESET TO ORIGINKIT PRESET</span>
                    </button>
                </div>
            )}

            {/* Bottom info pill */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    padding: '0.55rem 1.4rem',
                    borderRadius: '9999px',
                    background: 'rgba(15, 12, 34, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    pointerEvents: 'none',
                }}
            >
                <Sun size={13} style={{ color: '#ffffff' }} />
                <span>ORIGINKIT CLOUD SKY // PROCEDURAL FBM VOLUMETRIC CUMULUS // DRAG OR MOVE MOUSE FOR WIND</span>
            </div>
        </div>
    );
}

