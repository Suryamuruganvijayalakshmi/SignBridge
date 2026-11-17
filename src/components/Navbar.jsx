import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
    { label: 'Capabilities', hash: '#capabilities' },
    { label: 'Products', hash: '#products' },
    { label: 'R&D Lab', hash: '#research' },
    { label: 'Process', hash: '#process' },
    { label: 'Contact', hash: '#contact' },
];

export default function Navbar({ soundEnabled, onToggleSound, onOpenContact, onReplayIntro }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavClick = (hash) => (e) => {
        const id = hash.replace('#', '');
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `/${hash}`);
        }
    };

    const handleLogoClick = (e) => {
        if (window.location.pathname === '/' || window.location.pathname === '') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', '/');
        }
    };

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
            <Link to="/" onClick={handleLogoClick} className="logo-container" aria-label="SIGNBRIDGE home">
                <img
                    src="/signbridge-emblem.webp"
                    alt="SignBridge Logo"
                    className="logo-emblem-img"
                    width="32"
                    height="20"
                    decoding="async"
                />
                <span className="logo-text">SignBridge<sup>®</sup></span>
            </Link>

            {/* Center: Desktop Links */}
            <nav className="nav-links-center" aria-label="Primary Navigation">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.label}
                        to={`/${item.hash}`}
                        onClick={handleNavClick(item.hash)}
                        className="nav-link"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Right: Sound Toggle, Intro Loader & Contact CTA */}
            <div className="header-actions">
                <button
                    type="button"
                    onClick={onToggleSound}
                    className={`sound-toggle-btn ${soundEnabled ? 'is-playing' : 'is-muted'}`}
                    aria-label={soundEnabled ? 'Mute Ambient Soundtrack (M)' : 'Unmute Ambient Soundtrack (M)'}
                    title={soundEnabled ? 'Mute Soundtrack (M)' : 'Unmute Soundtrack (M)'}
                >
                    {soundEnabled ? (
                        <Volume2 size={16} />
                    ) : (
                        <VolumeX size={16} />
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

                <button
                    type="button"
                    onClick={onOpenContact}
                    className="btn-get-in-touch"
                    aria-haspopup="dialog"
                >
                    <span>Start a project</span>
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
                            onClick={(e) => {
                                setMobileOpen(false);
                                handleNavClick(item.hash)(e);
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen(false);
                            onReplayIntro?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#18181b' }}
                    >
                        <Sparkles size={16} />
                        <span>Intro Loader</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onToggleSound?.();
                        }}
                        className="mobile-nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: soundEnabled ? '#18181b' : '#71717a' }}
                    >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        <span>{soundEnabled ? 'Ambient Sound: On' : 'Ambient Sound: Muted'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen(false);
                            onOpenContact();
                        }}
                        className="btn-get-in-touch"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                        <span>Start a project</span>
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            )}
        </header>
    );
}
