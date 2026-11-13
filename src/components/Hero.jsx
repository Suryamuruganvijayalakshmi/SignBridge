import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <main className="lumina-hero" id="home" role="main">
            {/* 1. Refined Executive Pill Badge */}
            <a href="#products" className="glass-pill-badge" id="badge-trigger">
                <span className="badge-dot" aria-hidden="true" />
                <span className="badge-text">Software Engineering &amp; AI Studio</span>
            </a>

            {/* 2. Bold Display H1 Heading */}
            <h1 className="hero-heading !text-[4.5rem] md:!text-[6.5rem] lg:!text-[8.5rem] 2xl:!text-[10.5rem] 3xl:!text-[13rem] !leading-[0.88]">
                <span className="line-one">BEYOND</span>
                <span className="line-two text-accent">DIGITAL</span>
            </h1>

            {/* 3. Refined Corporate Lead Paragraph */}
            <p className="hero-description">
                SignBridge transforms ambitious concepts into intelligent, scalable digital products through{' '}
                high-performance software engineering, AI, cloud systems, and contactless NFC hardware.
            </p>

            {/* 4. Action Row */}
            <div className="action-row">
                <a href="#products" className="btn-primary-action">
                    <span>Explore Products</span>
                    <ArrowRight className="btn-arrow" size={16} aria-hidden="true" />
                </a>
                <a href="#research" className="btn-secondary-action">
                    <span>Our R&amp;D Work</span>
                </a>
            </div>
        </main>
    );
}
