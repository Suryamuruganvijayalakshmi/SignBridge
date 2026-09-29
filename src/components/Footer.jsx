import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="site-footer" style={{ pointerEvents: 'auto' }}>
            <div className="footer-inner">

                {/* ── Top Row: CTA left + Link columns right ── */}
                <div className="footer-top-row">

                    {/* Left: Big CTA block */}
                    <div className="footer-cta-block">
                        <h2 className="footer-cta-heading">
                            Ready to build<br />
                            <span className="footer-cta-accent">something beyond?</span>
                        </h2>
                        <p className="footer-cta-sub">
                            We transform ambitious ideas into intelligent, scalable digital products
                            through software engineering and AI.
                        </p>
                        <a
                            href="mailto:signbridge.aiauto@gmail.com"
                            className="footer-cta-btn"
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--accent-iris)';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.55)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#09090b';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Start a Project <ArrowUpRight size={18} />
                        </a>
                    </div>

                    {/* Right: Link columns */}
                    <div className="footer-link-columns">
                        <div className="footer-link-col">
                            <h4 className="footer-col-label">Expertise</h4>
                            <a href="#capabilities" className="footer-link">Software Engineering</a>
                            <a href="#capabilities" className="footer-link">Artificial Intelligence</a>
                            <a href="#capabilities" className="footer-link">Cloud &amp; IoT</a>
                        </div>
                        <div className="footer-link-col">
                            <h4 className="footer-col-label">Socials</h4>
                            <a
                                href="https://www.instagram.com/sign_bridgee/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link footer-link--magenta"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.linkedin.com/company/signbridgesurya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link footer-link--cyan"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Bottom: Massive brand name ── */}
                <div className="footer-brand-row">
                    <div className="footer-divider" />
                    <h1 className="footer-wordmark">SIGNBRIDGE</h1>
                    <div className="footer-meta-bar">
                        <span>© 2026 SIGNBRIDGE. ALL RIGHTS RESERVED.</span>
                        <span>BEYOND DIGITAL // INNOVATION STUDIO</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
