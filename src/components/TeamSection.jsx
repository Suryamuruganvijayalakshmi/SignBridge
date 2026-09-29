import React, { useState, useEffect, useRef } from 'react';
import CardSwap, { Card } from './CardSwap.jsx';
import { ArrowRight, RotateCw, Mouse, Sparkles } from 'lucide-react';

export default function TeamSection() {
    const sectionRef = useRef(null);
    const cardSwapRef = useRef(null);
    const lastScrollZoneRef = useRef(-1);
    const wheelAccumulatorRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(0);

    const team = [
        {
            id: 0,
            num: '01',
            name: 'Surya V M',
            role: 'Founder & Lead Product Designer',
            badge: 'FOUNDER // LEAD',
            image: '/Surya.jpeg',
            bio: 'Directing spatial product architecture, UX systems, and full-stack software engineering from concept to deployment.',
            skills: ['Spatial Product Architecture', 'Full-Stack Engineering', 'UX Design', 'Hardware Systems']
        },
        {
            id: 1,
            num: '02',
            name: 'Sowbigasri S',
            role: 'UI/UX Designer',
            badge: 'DESIGN SYSTEM',
            image: '/Sowbi.jpeg',
            bio: 'Crafting intuitive user interfaces, visual design systems, and responsive digital product interaction flows.',
            skills: ['Visual Design', 'Design Systems', 'User Research', 'Prototyping']
        },
        {
            id: 2,
            num: '03',
            name: 'Laksana S',
            role: 'Database Engineer',
            badge: 'DATA SYSTEMS',
            image: '/Laksana.png',
            bio: 'Architecting high-performance database schemas, data telemetry pipelines, and real-time synchronization.',
            skills: ['Database Architecture', 'Telemetry Pipelines', 'PostgreSQL', 'Cloud Infrastructure']
        },
        {
            id: 3,
            num: '04',
            name: 'Kamalesh S',
            role: 'Software Developer',
            badge: 'ENGINEERING',
            image: '/Kamalesh.jpeg',
            bio: 'Full-stack software developer engineering scalable cloud APIs, web platforms, and intelligent edge compute.',
            skills: ['Full-Stack Development', 'API Engineering', 'Edge AI', 'Microservices']
        }
    ];

    // Scroll-driven card swapping:
    // As the user scrolls through the team section, trigger card changes
    useEffect(() => {
        let lastTime = 0;

        const onScroll = () => {
            const now = Date.now();
            if (now - lastTime < 50) return;
            lastTime = now;

            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Only trigger when the team section is actively visible in viewport
            if (rect.top <= windowHeight * 0.6 && rect.bottom >= windowHeight * 0.3) {
                const sectionHeight = rect.height;
                const scrolledIntoSection = (windowHeight * 0.6) - rect.top;
                const progress = Math.min(1, Math.max(0, scrolledIntoSection / sectionHeight));

                // Divide into 4 scroll zones for the 4 team members
                const currentZone = Math.floor(progress * team.length);

                if (currentZone !== lastScrollZoneRef.current && currentZone >= 0 && currentZone < team.length) {
                    lastScrollZoneRef.current = currentZone;
                    if (cardSwapRef.current) {
                        cardSwapRef.current.swap();
                    }
                }
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [team.length]);

    // Wheel event over showcase: scrolling over the deck directly triggers card swap
    const handleWheelOverDeck = (e) => {
        wheelAccumulatorRef.current += e.deltaY;
        if (Math.abs(wheelAccumulatorRef.current) > 70) {
            wheelAccumulatorRef.current = 0;
            if (cardSwapRef.current) {
                cardSwapRef.current.swap();
            }
        }
    };

    const handleManualSwap = () => {
        if (cardSwapRef.current) {
            cardSwapRef.current.swap();
        }
    };

    const activeMember = team[activeIndex] || team[0];

    return (
        <section ref={sectionRef} className="site-section section-team" id="team">
            <div className="section-frame">
                <div className="team-showcase-layout">
                    {/* Left Column: Spotlight Info & Telemetry */}
                    <div className="team-spotlight-info">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-lime)' }} /> // 05 — THE TEAM
                        </span>

                        <h2 className="section-main-heading">
                            The people behind <br />
                            <span className="text-lime">SignBridge.</span>
                        </h2>

                        <p className="section-lead-text">
                            A multidisciplinary team combining product thinking, spatial design, software engineering, and data systems.
                        </p>

                        {/* Active Member Focus Card */}
                        <div className="active-member-spotlight">
                            <div className="spotlight-header">
                                <span className="spotlight-num text-lime">
                                    {activeMember.num} <span className="spotlight-denom">/ 04</span>
                                </span>
                                <span className="spotlight-badge">{activeMember.badge}</span>
                            </div>

                            <h3 className="spotlight-name">{activeMember.name}</h3>
                            <p className="spotlight-role text-lime">{activeMember.role}</p>
                            <p className="spotlight-bio">{activeMember.bio}</p>

                            <div className="spotlight-skills">
                                {activeMember.skills.map((skill) => (
                                    <span key={skill} className="skill-chip">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Controls & Scroll Cue */}
                        <div className="team-controls-row">
                            <button
                                type="button"
                                onClick={handleManualSwap}
                                className="btn-secondary-glass"
                                style={{ padding: '0.65rem 1.4rem', fontSize: '13px' }}
                            >
                                <RotateCw size={15} className="play-icon" />
                                <span>CYCLE NEXT MEMBER</span>
                            </button>

                            <div className="team-scroll-hint" title="Scroll down or wheel over cards to change">
                                <Mouse size={16} className="text-lime" />
                                <span>SCROLL TO CHANGE CARD</span>
                            </div>
                        </div>

                        {/* Quick Member Selector Pills */}
                        <div className="member-quick-pills">
                            {team.map((m, idx) => {
                                const isCurrent = idx === activeIndex;
                                return (
                                    <button
                                        key={m.num}
                                        type="button"
                                        onClick={handleManualSwap}
                                        className={`member-pill-btn ${isCurrent ? 'active' : ''}`}
                                    >
                                        <span className="pill-dot" />
                                        <span>{m.num} {m.name.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: 3D Perspective CardSwap Deck */}
                    <div
                        className="team-cardswap-wrapper"
                        onWheel={handleWheelOverDeck}
                    >
                        <div className="deck-ambient-glow" aria-hidden="true" />

                        <CardSwap
                            ref={cardSwapRef}
                            width={390}
                            height={490}
                            cardDistance={42}
                            verticalDistance={38}
                            delay={4500}
                            pauseOnHover={true}
                            skewAmount={5}
                            easing="elastic"
                            onActiveIndexChange={(newIdx) => setActiveIndex(newIdx)}
                        >
                            {team.map((member) => (
                                <Card key={member.id} className="team-swap-card">
                                    <div className="team-swap-inner">
                                        {/* Image Area */}
                                        <div className="team-card-image-wrap">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="team-card-img"
                                                loading="lazy"
                                            />
                                            <div className="card-scanline-overlay" />
                                            <span className="card-floating-badge">{member.badge}</span>
                                        </div>

                                        {/* Bottom Glass Info Bar */}
                                        <div className="team-card-bottom-bar">
                                            <div className="card-num-row">
                                                <span className="card-num-text">{member.num} // TEAM</span>
                                                <span className="card-status-dot" />
                                            </div>
                                            <h4 className="card-member-name">{member.name}</h4>
                                            <p className="card-member-role text-lime">{member.role}</p>
                                        </div>

                                        {/* Cyber Crosshair Accents */}
                                        <span className="corner-crosshair top-left">+</span>
                                        <span className="corner-crosshair top-right">+</span>
                                        <span className="corner-crosshair bottom-left">+</span>
                                        <span className="corner-crosshair bottom-right">+</span>
                                    </div>
                                </Card>
                            ))}
                        </CardSwap>
                    </div>
                </div>
            </div>
        </section>
    );
}
