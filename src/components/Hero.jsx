import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <main className="lumina-hero" id="home" role="main">
            {/* 1. Badge: Tiny magenta uppercase text inside a glass pill */}
            <a href="#products" className="glass-pill-badge" id="badge-trigger">
                <span className="badge-dot" aria-hidden="true" />
                <span className="badge-text">// SOFTWARE ENGINEERING &amp; AI STUDIO</span>
            </a>

            {/* 2. H1 Heading */}
            <h1 className="hero-heading !text-[4.5rem] md:!text-[6.5rem] lg:!text-[9rem] 2xl:!text-[11rem] 3xl:!text-[14rem] !leading-[0.85]">
                <span className="line-one">BEYOND</span>
                <span className="line-two text-lime">DIGITAL</span>
            </h1>

            {/* 3. Paragraph */}
            <p className="hero-description">
                SignBridge transforms ambitious ideas into intelligent, scalable digital products through{' '}
                software engineering, AI, cloud, IoT and emerging technologies.
            </p>

            {/* 4. Action Row */}
            <div className="action-row">
                <a href="#products" className="btn-primary-lime">
                    <span>EXPLORE PRODUCTS</span>
                    <ArrowRight className="btn-arrow" size={16} aria-hidden="true" />
                </a>
                <a href="#research" className="btn-secondary-glass">
                    <span>OUR R&amp;D WORK</span>
                </a>
            </div>
        </main>
    );
}
