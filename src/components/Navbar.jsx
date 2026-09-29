import React, { useState } from 'react';
import { Zap, ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onOpenContact }) {
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
                <Zap className="logo-icon-zap" aria-hidden="true" />
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

            {/* Right: Sound Toggle & Contact CTA */}
            <div className="header-actions">


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
