import React from 'react';
import { ArrowUpRight, Activity, Satellite } from 'lucide-react';

export default function ResearchSection({ onOpenContact }) {
    return (
        <section className="site-section section-research" id="research">
            <div className="section-frame">
                <div className="section-header-block">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> // 03 — R&D LAB
                    </span>
                    <h2 className="section-main-heading">
                        Exploring what <br />
                        <span className="text-lime">comes next.</span>
                    </h2>
                    <p className="section-lead-text">
                        Our R&D work explores the intersection of software engineering, artificial intelligence, 
                        IoT, edge computing, and emerging spatial technologies.
                    </p>
                </div>

                <div className="project-grid !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-2 xl:!grid-cols-3 3xl:!grid-cols-4 !gap-6">
                    {/* Project 1: ShopCart */}
                    <article className="project-card">
                        <div className="project-visual-frame">
                            <img
                                src="/assets/shopcart.png"
                                alt="ShopCart student technology marketplace interface"
                                className="project-img"
                                loading="lazy"
                            />
                        </div>
                        <div className="project-info">
                            <span className="project-domain">01 // WEB & COMMERCE</span>
                            <h3 className="project-title">ShopCart</h3>
                            <p className="project-tagline">Student technology marketplace and shopping experience</p>
                            <div className="project-tags">
                                <span className="tag">Product UI</span>
                                <span className="tag">Responsive Web</span>
                                <span className="tag">E-Commerce</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenContact}
                                className="project-link"
                            >
                                <span>Explore Project</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </article>

                    {/* Project 2: IndianOil Lube Sales Hub */}
                    <article className="project-card">
                        <div className="project-visual-frame">
                            <img
                                src="/assets/salestracker.png"
                                alt="IndianOil lubricant sales dashboard"
                                className="project-img"
                                loading="lazy"
                            />
                        </div>
                        <div className="project-info">
                            <span className="project-domain">02 // RETAIL OPERATIONS</span>
                            <h3 className="project-title">IndianOil Sales Hub</h3>
                            <p className="project-tagline">Sales reporting, filtering, and automated business intelligence</p>
                            <div className="project-tags">
                                <span className="tag">Dashboard UI</span>
                                <span className="tag">Data Tables</span>
                                <span className="tag">Reporting</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenContact}
                                className="project-link"
                            >
                                <span>Explore Project</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </article>

                    {/* Project 3: EcoClamp */}
                    <article className="project-card">
                        <div className="project-visual-frame cyber-graphic-frame">
                            <div className="eco-waveform-visual">
                                <Activity className="waveform-icon text-lime" size={48} />
                                <div className="chip-badge">
                                    <span>ESP32</span>
                                    <strong className="text-lime">TinyML Edge</strong>
                                </div>
                            </div>
                        </div>
                        <div className="project-info">
                            <span className="project-domain">03 // IoT & EDGE AI</span>
                            <h3 className="project-title">EcoClamp</h3>
                            <p className="project-tagline">Smart motor-monitoring system using localized TinyML anomaly detection</p>
                            <div className="project-tags">
                                <span className="tag">ESP32</span>
                                <span className="tag">FFT Signal</span>
                                <span className="tag">Predictive Maint</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenContact}
                                className="project-link"
                            >
                                <span>Explore Project</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </article>

                    {/* Project 4: Autonomous Space-Debris Protection */}
                    <article className="project-card">
                        <div className="project-visual-frame cyber-graphic-frame">
                            <div className="space-orbital-visual">
                                <div className="orbit-ring-graphic" />
                                <Satellite className="satellite-icon text-cyan" size={44} />
                            </div>
                        </div>
                        <div className="project-info">
                            <span className="project-domain">04 // AEROSPACE TECHNOLOGY</span>
                            <h3 className="project-title">Autonomous Space Debris</h3>
                            <p className="project-tagline">Sensor fusion, trajectory prediction, and companion spacecraft architecture</p>
                            <div className="project-tags">
                                <span className="tag">Sensor Fusion</span>
                                <span className="tag">AI Tracking</span>
                                <span className="tag">Orbital Kinematics</span>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenContact}
                                className="project-link"
                            >
                                <span>Explore Project</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
