import React from 'react';

/**
 * VisionBanner — Clean Editorial Studio Manifesto
 * Matches Hero 64 aesthetic with pure white canvas, serif typography, and graceful spacing.
 */
export default function VisionBanner() {
    const pillars = [
        'Software Engineering',
        'Artificial Intelligence',
        'Computer Vision',
        'Edge Hardware',
        'Cloud Architecture',
        'Spatial Compute'
    ];

    return (
        <section className="vision-banner-section" aria-label="SignBridge Engineering Philosophy">
            <div className="section-frame">
                <div className="vision-editorial-container">
                    <span className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <span className="eyebrow-pip" /> Engineering Philosophy
                    </span>

                    <h2 className="vision-title">
                        Technology should <br />
                        <span className="vision-highlight">not just work.</span> <br />
                        <span className="text-accent">It should build the bridge forward.</span>
                    </h2>

                    <p className="vision-editorial-desc">
                        From low-level micro-telemetry and custom firmware to real-time machine intelligence, we engineer resilient systems that turn complex technical challenges into frictionless digital experiences.
                    </p>

                    <div className="vision-editorial-pills">
                        {pillars.map((item, idx) => (
                            <span key={item} className="vision-pillar-pill">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
