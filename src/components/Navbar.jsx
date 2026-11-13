import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, Sparkles, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
    { label: '// CAPABILITIES', hash: '#capabilities' },
    { label: '// PRODUCTS', hash: '#products' },
    { label: '// R&D LAB', hash: '#research' },
    { label: '// PROCESS', hash: '#process' },
    { label: '// TEAM', hash: '#team' },
    { label: '// CONTACT', hash: '#contact' },
];

export default function Navbar({ soundEnabled, onToggleSound, onOpenContact, onReplayIntro }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    return (
        <header className="lumina-header" role="banner">
            {/* Left: SignBridge Logo */}
            <Link to="/" className="logo-container" aria-label="SIGNBRIDGE home">
                <img
                    src="/signbridge-emblem.webp"
                    alt="SignBridge Logo"
                    className="logo-emblem-img"
                    width="48"
                    height="18"
                    decoding="async"
                />
                <span className="logo-text">SIGNBRIDGE</span>
            </Link>

            {/* Center: Desktop Links */}
            <nav className="nav-links-center" aria-label="Primary Navigation">
                {NAV_ITEMS.map((item) => (
                    <Link key={item.label} to={`/${item.hash}`} className="nav-link">
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Right: Sound Toggle, Particle Intro & Contact CTA */}
            <div className="header-actions">
                <button
                    type="button"
                    onClick={onToggleSound}
                    className={`sound-toggle-btn ${soundEnabled ? 'is-playing' : 'is-muted'}`}
                    aria-label={soundEnabled ? 'Mute Ambient Soundtrack (M)' : 'Unmute Ambient Soundtrack (M)'}
                    title={soundEnabled ? 'Mute Soundtrack (M)' : 'Unmute Soundtrack (M)'}
                >
                    {soundEnabled ? (
                        <Volume2 size={16} className="text-iris" />
                    ) : (
                        <VolumeX size={16} className="text-slate-500" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={onReplayIntro}
                    className="sound-toggle-btn replay-intro-nav-btn"
                    aria-label="Replay Starting Loader"
                    title="Replay Starting Loader"
                >
                    <Sparkles size={16} />
                </button>

                <Link
                    to="/cloud-sky"
                    className="sound-toggle-btn cloudsky-nav-btn"
                    aria-label="Cloud Sky Atmospheric Experience"
                    title="Cloud Sky (Originkit)"
                >
                    <Cloud size={16} />
                </Link>

                <button
                    type="button"
                    onClick={onOpenContact}
                    className="btn-get-in-touch"
                    aria-haspopup="dialog"
                >
                    <span>Start a Project</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                </button>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            to={`/${item.hash}`}
                            className="mobile-nav-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        to="/cloud-sky"
                        className="mobile-nav-link"
                        onClick={() => setMobileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1' }}
                    >
                        <Cloud size={16} />
                        <span>// CLOUD SKY ATMOSPHERE</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen(false);
                            onReplayIntro?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#4f46e5' }}
                    >
                        <Sparkles size={16} />
                        <span>// INTRO LOADER</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onToggleSound?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: soundEnabled ? '#4f46e5' : '#475569' }}
                    >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        <span>{soundEnabled ? '// AMBIENT SOUND ON' : '// AMBIENT SOUND MUTED'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen(false);
                            onOpenContact();
                        }}
                        className="btn-primary-lime"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                        <span>Start a Project</span>
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            )}
        </header>
    );
}
