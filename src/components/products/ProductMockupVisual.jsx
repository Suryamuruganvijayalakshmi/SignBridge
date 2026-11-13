import React from 'react';
import {
    Wifi,
    Building2,
    MessageCircle,
    Mail,
    Globe,
    FileDown,
    User,
    Code2,
    BarChart3,
    Warehouse,
    Ticket,
    Scale,
    CheckCircle2,
    ArrowUpRight
} from 'lucide-react';

function GitHubMark() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.51.47-3.16-.63-3.36-1.2-.11-.3-.6-1.2-1.02-1.44-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
    );
}

function LinkedInMark() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

export default function ProductMockupVisual({ type, detailed = false }) {
    if (type === 'nfc-business') {
        return (
            <div className={`pmock pmock-nfc-business ${detailed ? 'pmock-detailed' : ''}`} aria-hidden="true">
                {/* Physical NFC Business Card */}
                <div className="pmock-card-physical">
                    <div className="pmock-card-top">
                        <span className="pmock-card-brand">SIGNBRIDGE // ID</span>
                        <Wifi size={15} className="pmock-nfc-wave" />
                    </div>
                    <div className="pmock-card-chip" />
                    <div className="pmock-card-bottom">
                        <span className="pmock-card-label">BUSINESS CARD</span>
                        <span className="pmock-card-sub">TAP TO CONNECT</span>
                    </div>
                </div>

                {/* NFC Tap Pulse Ring */}
                <div className="pmock-tap-signal">
                    <span className="pmock-tap-ring" />
                    <span className="pmock-tap-dot" />
                </div>

                {/* Smartphone Digital Company Profile */}
                <div className="pmock-phone">
                    <div className="pmock-phone-notch" />
                    <div className="pmock-phone-screen">
                        <div className="pmock-profile-banner">
                            <div className="pmock-company-avatar">
                                <Building2 size={14} />
                            </div>
                            <div>
                                <div className="pmock-ui-title">Your Company</div>
                                <div className="pmock-ui-sub">Digital Business Profile</div>
                            </div>
                        </div>

                        <div className="pmock-ui-section-label">SERVICES &amp; SHOWCASE</div>
                        <div className="pmock-ui-chips">
                            <span>Consulting</span>
                            <span>Solutions</span>
                            <span>Catalog</span>
                        </div>

                        <div className="pmock-ui-actions">
                            <span className="pmock-ui-btn pmock-ui-btn-primary">
                                <MessageCircle size={11} />
                                WhatsApp
                            </span>
                            <span className="pmock-ui-btn">
                                <Mail size={11} />
                                Email
                            </span>
                            <span className="pmock-ui-btn">
                                <Globe size={11} />
                                Web
                            </span>
                        </div>

                        <div className="pmock-ui-cta-bar">
                            <span>Enquiry &amp; Lead Capture</span>
                            <ArrowUpRight size={11} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'nfc-portfolio') {
        return (
            <div className={`pmock pmock-nfc-portfolio ${detailed ? 'pmock-detailed' : ''}`} aria-hidden="true">
                {/* Smartphone Personal Portfolio */}
                <div className="pmock-phone pmock-phone-wide">
                    <div className="pmock-phone-notch" />
                    <div className="pmock-phone-screen">
                        <div className="pmock-url-bar">
                            <span className="pmock-url-dot" />
                            <span>signbridge.click/u/portfolio</span>
                        </div>

                        <div className="pmock-portfolio-head">
                            <div className="pmock-person-avatar">
                                <User size={15} />
                            </div>
                            <div>
                                <div className="pmock-ui-title">Personal Identity</div>
                                <div className="pmock-ui-sub">Developer · Designer · Creator</div>
                            </div>
                        </div>

                        <div className="pmock-ui-section-label">SKILLS &amp; PROJECTS</div>
                        <div className="pmock-ui-chips">
                            <span><Code2 size={9} /> Full-Stack</span>
                            <span>UI/UX</span>
                            <span>Achievements</span>
                        </div>

                        <div className="pmock-portfolio-links">
                            <span className="pmock-ui-btn pmock-ui-btn-cyan">
                                <FileDown size={11} />
                                Resume PDF
                            </span>
                            <span className="pmock-ui-btn">
                                <GitHubMark />
                                GitHub
                            </span>
                            <span className="pmock-ui-btn">
                                <LinkedInMark />
                                LinkedIn
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compact Personal NFC Card Badge */}
                <div className="pmock-id-badge">
                    <Wifi size={14} className="pmock-nfc-wave-cyan" />
                    <div>
                        <span className="pmock-id-title">PORTFOLIO CARD</span>
                        <span className="pmock-id-sub">UNIQUE URL · 1 TAP</span>
                    </div>
                </div>
            </div>
        );
    }

    // FarmCargo Visual
    return (
        <div className={`pmock pmock-farmcargo ${detailed ? 'pmock-detailed' : ''}`} aria-hidden="true">
            <div className="pmock-fc-window">
                <div className="pmock-fc-topbar">
                    <div className="pmock-fc-brand">
                        <span className="pmock-fc-dot" />
                        <span>FARMCARGO // OPS</span>
                    </div>
                    <span className="pmock-fc-pill">PRE-HARVEST → INTAKE</span>
                </div>

                <div className="pmock-fc-grid">
                    {/* Crop Arrival Prediction Chart */}
                    <div className="pmock-fc-panel pmock-fc-chart-panel">
                        <div className="pmock-fc-panel-head">
                            <span><BarChart3 size={11} /> Crop Arrival Prediction</span>
                            <small>Forecast</small>
                        </div>
                        <div className="pmock-fc-bars">
                            <div className="pmock-fc-bar-col">
                                <span style={{ height: '38%' }} />
                                <small>W1</small>
                            </div>
                            <div className="pmock-fc-bar-col">
                                <span style={{ height: '62%' }} />
                                <small>W2</small>
                            </div>
                            <div className="pmock-fc-bar-col is-peak">
                                <span style={{ height: '88%' }} />
                                <small>W3</small>
                            </div>
                            <div className="pmock-fc-bar-col">
                                <span style={{ height: '70%' }} />
                                <small>W4</small>
                            </div>
                            <div className="pmock-fc-bar-col">
                                <span style={{ height: '46%' }} />
                                <small>W5</small>
                            </div>
                        </div>
                    </div>

                    {/* Right Telemetry Column */}
                    <div className="pmock-fc-side">
                        <div className="pmock-fc-mini">
                            <div className="pmock-fc-mini-head">
                                <Warehouse size={11} />
                                <span>Rice Warehouse Capacity</span>
                            </div>
                            <div className="pmock-fc-meter">
                                <span className="pmock-fc-meter-fill" />
                            </div>
                        </div>

                        <div className="pmock-fc-mini">
                            <div className="pmock-fc-mini-head">
                                <Ticket size={11} />
                                <span>Token &amp; Slot Queue</span>
                            </div>
                            <span className="pmock-fc-status">Scheduled Windows</span>
                        </div>
                    </div>
                </div>

                <div className="pmock-fc-footer">
                    <span><CheckCircle2 size={10} /> Quality Check</span>
                    <span><Scale size={10} /> Weighing</span>
                    <span>Receipts &amp; Payouts</span>
                </div>
            </div>
        </div>
    );
}
