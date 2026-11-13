import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ onReplayIntro }) {
    return (
        <footer className="site-footer" style={{ pointerEvents: 'auto' }}>
            <div className="footer-inner">
                {/* Top Row: CTA left + Link columns right */}
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
                        >
                            Start a Project <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                    </div>

                    {/* Right: Link columns */}
                    <div className="footer-link-columns">
                        <div className="footer-link-col">
                            <h3 className="footer-col-label">Products</h3>
                            <Link to="/products/nfc-business-card" className="footer-link">NFC Business Card</Link>
                            <Link to="/products/nfc-portfolio-card" className="footer-link">NFC Portfolio Card</Link>
                            <Link to="/products/farmcargo" className="footer-link">FarmCargo</Link>
                        </div>
                        <div className="footer-link-col">
                            <h3 className="footer-col-label">Expertise</h3>
                            <Link to="/#capabilities" className="footer-link">Software Engineering</Link>
                            <Link to="/#capabilities" className="footer-link">Artificial Intelligence</Link>
                            <Link to="/#capabilities" className="footer-link">Cloud &amp; IoT</Link>
                            <Link to="/cloud-sky" className="footer-link" style={{ color: '#c084fc' }}>Cloud Sky Atmosphere</Link>
                        </div>
                        <div className="footer-link-col">
                            <h3 className="footer-col-label">Socials</h3>
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

                {/* Bottom: Brand wordmark + copyright */}
                <div className="footer-brand-row">
                    <div className="footer-divider" />
                    <p className="footer-wordmark" aria-hidden="true">SIGNBRIDGE</p>
                    <div className="footer-meta-bar">
                        <span>© 2026 SIGNBRIDGE. ALL RIGHTS RESERVED.</span>
                        {onReplayIntro && (
                            <button
                                type="button"
                                onClick={onReplayIntro}
                                className="footer-replay-link"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#a5b4fc',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '0.85rem'
                                }}
                                title="Replay starting loader animation"
                            >
                                ↺ Replay Starting Loader
                            </button>
                        )}
                        <span>BEYOND DIGITAL // INNOVATION STUDIO</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
