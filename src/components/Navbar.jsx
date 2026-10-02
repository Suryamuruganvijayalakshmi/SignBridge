import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ soundEnabled, onToggleSound, onOpenContact, onReplayIntro }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { label: '// CAPABILITIES', href: '#capabilities' },
        { label: '// SMART TABLE', href: '#smart-table' },
        { label: '// R&D LAB', href: '#research' },
        { label: '// PROCESS', href: '#process' },
        { label: '// TEAM', href: '#team' },
        { label: '// CONTACT', href: '#contact' },
    ];

    return (
        <header className="lumina-header" role="banner">
            {/* Left: SignBridge Logo */}
            <Link to="/" className="logo-container" aria-label="SIGNBRIDGE home">
                <img
                    src="/signbridge-emblem.png"
                    alt="SignBridge Logo"
                    className="logo-emblem-img"
                    width="48"
                    height="32"
                />
                <span className="logo-text">SIGNBRIDGE</span>
            </Link>

            {/* Center: Desktop Links */}
            <nav className="nav-links-center" aria-label="Primary Navigation">
                {navItems.map((item) => (
                    <a key={item.label} href={item.href} className="nav-link">
                        {item.label}
                    </a>
                ))}
            </nav>

            {/* Right: Sound Toggle, Replay Intro & Contact CTA */}
            <div className="header-actions">
                <button
                    type="button"
                    onClick={onToggleSound}
                    className={`sound-toggle-btn ${soundEnabled ? 'is-playing' : 'is-muted'}`}
                    aria-label={soundEnabled ? "Mute Ambient Soundtrack (M)" : "Unmute Ambient Soundtrack (M)"}
                    title={soundEnabled ? "Mute Soundtrack (M)" : "Unmute Soundtrack (M)"}
                >
                    {soundEnabled ? (
                        <Volume2 size={16} className="text-iris" />
                    ) : (
                        <VolumeX size={16} className="text-slate-400" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={onReplayIntro}
                    className="sound-toggle-btn replay-intro-nav-btn"
                    aria-label="Replay Cinematic Particle Intro"
                    title="Replay Cinematic Particle Intro"
                >
                    <Sparkles size={16} />
                </button>

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
                <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="mobile-nav-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen(false);
                            onReplayIntro?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#6366f1' }}
                    >
                        <Sparkles size={16} />
                        <span>// REPLAY INTRO</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onToggleSound?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: soundEnabled ? '#6366f1' : '#64748b' }}
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
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        <span>Start a Project</span>
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            )}
        </header>
    );
}
