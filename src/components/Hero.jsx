import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onOpenShowreel, onOpenContact }) {
    return (
        <main className="lumina-hero" id="home" role="main">
            {/* 1. Badge: Tiny magenta uppercase text inside a glass pill */}
            <a href="#capabilities" className="glass-pill-badge" id="badge-trigger">
                <span className="badge-dot" aria-hidden="true" />
                <span className="badge-text">// SOFTWARE ENGINEERING & AI STUDIO</span>
            </a>

            {/* 2. H1 Heading: Two-line giant text, tight tracking, leading-[0.85], second word lime green */}
            <h1 className="hero-heading">
                <span className="line-one">BEYOND</span>
                <span className="line-two text-lime">DIGITAL</span>
            </h1>

            {/* 3. Paragraph: Max-width 650px, font-weight light, color white/50, leading relaxed */}
            <p className="hero-description">
                SignBridge transforms ambitious ideas into intelligent, scalable digital products through 
                software engineering, AI, cloud, IoT and emerging technologies.
            </p>

            {/* 4. Action Row: Primary CTA */}
            <div className="action-row">
                {/* Primary CTA: Solid lime green with black text */}
                <a href="#research" className="btn-primary-lime">
                    <span>EXPLORE OUR WORK</span>
                    <ArrowRight className="btn-arrow" size={16} aria-hidden="true" />
                </a>
            </div>

        </main>
    );
}
