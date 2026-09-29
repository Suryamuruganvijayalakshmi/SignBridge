import React from 'react';

export default function Footer() {
    return (
        <footer className="lumina-footer-wrapper" role="contentinfo">
            <div className="lumina-footer">
                {/* Left side: Clean brand identity */}
                <div className="footer-brand-meta">
                    <span className="footer-brand-title">SIGNBRIDGE</span>
                    <span className="footer-brand-sub">// BEYOND DIGITAL</span>
                </div>

                {/* Right side: Official Social Links */}
                <div className="social-links-right">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/sign_bridgee/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-btn icon-instagram"
                        aria-label="SignBridge on Instagram"
                        title="SignBridge on Instagram"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/company/signbridgesurya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-btn icon-linkedin"
                        aria-label="SignBridge on LinkedIn"
                        title="SignBridge on LinkedIn"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Bottom Credits Bar */}
            <div className="sub-footer-bar">
                <span>© 2026 SIGNBRIDGE. All rights reserved.</span>
                <span>Software · AI · Web · Cloud · IoT · Automation · Innovation</span>
            </div>
        </footer>
    );
}
