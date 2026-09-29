import React from 'react';

export default function VisionBanner() {
    return (
        <section className="vision-banner-section" aria-label="SignBridge Vision Statement">
            <div className="section-frame">
                <div className="vision-box">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> // THE SIGNAL
                    </span>
                    <h2 className="vision-title">
                        Technology should <br />
                        <span className="text-white">not just work.</span> <br />
                        <span className="text-lime text-glow">It should move things forward.</span>
                    </h2>
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
        </section>
    );
}
