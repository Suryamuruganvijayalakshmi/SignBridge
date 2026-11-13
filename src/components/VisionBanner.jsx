import React from 'react';

export default function VisionBanner() {
    return (
        <section className="vision-banner-section" aria-label="SignBridge Vision Statement">
            <div className="section-frame">
                <div className="vision-box">
                    <div className="vision-box-header">
                        <span className="vision-header-badge">VISION // CORE PHILOSOPHY</span>
                        <div className="window-dots" aria-hidden="true">
                            <span className="w-dot red" />
                            <span className="w-dot yellow" />
                            <span className="w-dot green" />
                        </div>
                    </div>
                    <div className="vision-box-body">
                        <span className="section-eyebrow" style={{ marginBottom: '1.5rem' }}>
                            <span className="eyebrow-pip" /> Our Engineering Philosophy
                        </span>
                        <h2 className="vision-title">
                            Technology should <br />
                            <span className="vision-highlight">not just work.</span> <br />
                            <span className="text-accent">It should move things forward.</span>
                        </h2>
                    </div>
                    <div className="vision-box-footer">
                        <div className="vision-pillars-row">
                            <span>Software</span>
                            <b>·</b>
                            <span>AI</span>
                            <b>·</b>
                            <span>Web</span>
                            <b>·</b>
                            <span>Cloud</span>
                            <b>·</b>
                            <span>IoT</span>
                            <b>·</b>
                            <span>Automation</span>
                            <b>·</b>
                            <span>Innovation</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
