import React from 'react';
import { ArrowRight, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="lumina-hero-wrapper" id="home">
            <main className="lumina-hero" role="main">
                {/* 1. Badge: Glass pill */}
                <div className="hero-badge-row">
                    <a href="#products" className="glass-pill-badge" id="badge-trigger">
                        <span className="badge-dot" aria-hidden="true" />
                        <span className="badge-text">// SOFTWARE ENGINEERING &amp; AI STUDIO</span>
                    </a>
                    <Link to="/cloud-sky" className="hero-meadow-pill" title="View Full-Screen Cloud Sky Atmosphere">
                        <Cloud size={13} className="text-iris" />
                        <span>CLOUD SKY PREVIEW</span>
                    </Link>
                </div>

                {/* 2. H1 Heading */}
                <h1 className="hero-heading !text-[4.5rem] md:!text-[6.5rem] lg:!text-[9rem] 2xl:!text-[11rem] 3xl:!text-[14rem] !leading-[0.85]">
                    <span className="line-one">BEYOND</span>
                    <span className="line-two text-lime">DIGITAL</span>
                </h1>

                {/* 3. Description */}
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
        </section>
    );
}
