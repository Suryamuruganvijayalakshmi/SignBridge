import React, { useState, useEffect, useRef, useMemo } from 'react';
import CardSwap, { Card } from './CardSwap.jsx';
import { ArrowRight, ArrowUpRight, RotateCw, Mouse, Sparkles, Users, Layers, ShieldCheck, Terminal, Compass } from 'lucide-react';

export const CORE_TECHNICAL_TEAM = [
    // 1. Leadership
    {
        id: 0,
        num: '01',
        name: 'Surya V M',
        role: 'Founder & CEO',
        category: 'Leadership',
        badge: 'LEADERSHIP // FOUNDER',
        image: '/assets/surya.jpeg',
        portfolio: 'https://surya.signbridge.click',
        bio: 'Directing spatial product architecture, core engineering systems, AI-powered automation pipelines, and executive vision from concept to production.',
        skills: ['Executive Leadership', 'Spatial Product Architecture', 'Full-Stack Systems', 'AI & Emerging Tech']
    },
    // 2. Product, Data & Engineering
    {
        id: 1,
        num: '02',
        name: 'Surya S',
        role: 'Data & Product Engineer',
        category: 'Product & Data',
        badge: 'DATA & PRODUCT',
        image: '/assets/Surya s.jpeg',
        bio: 'Designing scalable data engineering pipelines, product telemetry systems, and turning complex metrics into high-impact product intelligence.',
        skills: ['Data Engineering', 'Product Analytics', 'ETL Pipelines', 'Data Modeling']
    },
    {
        id: 2,
        num: '03',
        name: 'Gowshika',
        role: 'Data & Product Engineer',
        category: 'Product & Data',
        badge: 'DATA & PRODUCT',
        image: '/assets/gowshika.jpeg',
        bio: 'Driving data science integrations, statistical modelling, data warehouse optimizations, and user telemetry architecture.',
        skills: ['Product Intelligence', 'Statistical Modeling', 'Feature Engineering', 'Data Systems']
    },
    // 3. Frontend & Branding
    {
        id: 3,
        num: '04',
        name: 'Logesh S M',
        role: 'Frontend Lead & Branding',
        category: 'Frontend & Brand',
        badge: 'FRONTEND // BRAND',
        image: '/assets/Logesh.jpeg',
        bio: 'Spearheading modern frontend systems, brand design language, responsive motion architectures, and interactive client-facing experiences.',
        skills: ['Frontend Architecture', 'Brand Identity', 'Interactive Motion', 'Design Systems']
    },
    // 4. Backend Engineering
    {
        id: 4,
        num: '05',
        name: 'Gopalakrishnan A S',
        role: 'Backend Developer',
        category: 'Backend',
        badge: 'BACKEND DEV',
        image: '/assets/Gopal.jpeg',
        bio: 'Architecting high-throughput microservices, robust server-side APIs, and distributed cloud backend infrastructure.',
        skills: ['Microservices', 'Distributed Systems', 'API Engineering', 'System Architecture']
    },
    {
        id: 5,
        num: '06',
        name: 'Laksana S',
        role: 'Backend Developer',
        category: 'Backend',
        badge: 'BACKEND DEV',
        image: '/assets/laksana.png',
        bio: 'Engineering resilient transactional databases, distributed cloud functions, schema architectures, and real-time synchronization pipelines.',
        skills: ['Database Optimization', 'PostgreSQL', 'Cloud Functions', 'Data Security']
    },
    {
        id: 6,
        num: '07',
        name: 'Sowbigasri S',
        role: 'Backend Developer',
        category: 'Backend',
        badge: 'BACKEND DEV',
        image: '/assets/sowbi.jpeg',
        bio: 'Developing scalable backend endpoints, secure enterprise authentication protocols, query optimizations, and robust API contracts.',
        skills: ['Server-Side Development', 'Auth Protocols', 'REST & GraphQL', 'Query Optimization']
    },
    // 5. DevOps & Cloud Engineering
    {
        id: 7,
        num: '08',
        name: 'Dhanusha D',
        role: 'DevOps & Cloud Engineer',
        category: 'DevOps & Cloud',
        badge: 'DEVOPS // CLOUD',
        image: '/assets/Dhanusha.jpeg',
        bio: 'Automating multi-cloud deployment pipelines, container orchestration, continuous integration, and infrastructure security.',
        skills: ['CI/CD Automation', 'Cloud Architecture', 'Docker & Kubernetes', 'Infrastructure as Code']
    },
    {
        id: 8,
        num: '09',
        name: 'Kamalesh S',
        role: 'DevOps & Cloud Engineer',
        category: 'DevOps & Cloud',
        badge: 'DEVOPS // CLOUD',
        image: '/assets/kamalesh.jpeg',
        bio: 'Deploying edge compute platforms, automated observability stacks, fault-tolerant clusters, and performance telemetry.',
        skills: ['Cloud Observability', 'Serverless Clusters', 'Edge Compute', 'DevSecOps']
    },
    // 6. UI/UX & Accessibility
    {
        id: 9,
        num: '10',
        name: 'Hariprasath',
        role: 'UI/UX & Accessibility Lead',
        category: 'UI/UX & A11y',
        badge: 'UI/UX // A11Y LEAD',
        image: '/assets/hariprasath.jpeg',
        bio: 'Championing universal web accessibility (WCAG AAA), human-centered design heuristics, design systems, and barrier-free digital experiences.',
        skills: ['WCAG Compliance', 'Accessibility Audits', 'Human Factors Design', 'Design Systems']
    },
    {
        id: 10,
        num: '11',
        name: 'Guhan',
        role: 'UI/UX & Accessibility Engineer',
        category: 'UI/UX & A11y',
        badge: 'UI/UX // A11Y',
        image: '/assets/guhan.jpeg',
        bio: 'Crafting assistive technology interaction patterns, keyboard navigation flows, screen-reader ergonomics, and inclusive UI components.',
        skills: ['Assistive Tech UX', 'A11y Interaction', 'Rapid Prototyping', 'Component Usability']
    },
    // 7. QA & Automation
    {
        id: 11,
        num: '12',
        name: 'Aswin',
        role: 'QA & Automation Engineer',
        category: 'QA & Automation',
        badge: 'QA // AUTOMATION',
        image: '/assets/aswin.jpeg',
        bio: 'Executing end-to-end automated regression suites, API test automation, performance profiling, and ensuring bulletproof software reliability.',
        skills: ['E2E Automation', 'Regression Testing', 'Performance Profiling', 'Quality Assurance']
    }
];

export const DEPARTMENT_CATEGORIES = [
    { id: 'all', label: 'ALL TEAMS', count: 12 },
    { id: 'Leadership', label: 'LEADERSHIP', count: 1 },
    { id: 'Product & Data', label: 'PRODUCT & DATA', count: 2 },
    { id: 'Frontend & Brand', label: 'FRONTEND & BRAND', count: 1 },
    { id: 'Backend', label: 'BACKEND', count: 3 },
    { id: 'DevOps & Cloud', label: 'DEVOPS & CLOUD', count: 2 },
    { id: 'UI/UX & A11y', label: 'UI/UX & A11Y', count: 2 },
    { id: 'QA & Automation', label: 'QA & AUTOMATION', count: 1 }
];

export default function TeamSection() {
    const sectionRef = useRef(null);
    const cardSwapRef = useRef(null);
    const lastScrollZoneRef = useRef(-1);
    const wheelAccumulatorRef = useRef(0);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeMemberId, setActiveMemberId] = useState(0);

    // Filter team based on selected category
    const filteredTeam = useMemo(() => {
        if (selectedCategory === 'all') return CORE_TECHNICAL_TEAM;
        return CORE_TECHNICAL_TEAM.filter(m => m.category === selectedCategory);
    }, [selectedCategory]);

    // Active member object
    const activeMember = useMemo(() => {
        const found = CORE_TECHNICAL_TEAM.find(m => m.id === activeMemberId);
        return found || filteredTeam[0] || CORE_TECHNICAL_TEAM[0];
    }, [activeMemberId, filteredTeam]);

    // Find index of active member within filtered team
    const activeIndexInFiltered = useMemo(() => {
        const idx = filteredTeam.findIndex(m => m.id === activeMember.id);
        return idx !== -1 ? idx : 0;
    }, [filteredTeam, activeMember.id]);

    // Responsive card dimensions to guarantee zero horizontal overflow and comfortable mobile viewing
    const [cardLayout, setCardLayout] = useState(() => {
        if (typeof window === 'undefined') return { width: 380, height: 480, distX: 24, distY: 22, isMobile: false };
        const w = window.innerWidth;
        if (w < 400) {
            return { width: Math.min(290, w - 36), height: 380, distX: 12, distY: 12, isMobile: true };
        } else if (w < 640) {
            return { width: Math.min(320, w - 48), height: 410, distX: 15, distY: 15, isMobile: true };
        } else if (w < 1024) {
            return { width: 345, height: 435, distX: 18, distY: 18, isMobile: true };
        } else {
            return { width: 380, height: 480, distX: 24, distY: 22, isMobile: false };
        }
    });

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 400) {
                setCardLayout({ width: Math.min(290, w - 36), height: 380, distX: 12, distY: 12, isMobile: true });
            } else if (w < 640) {
                setCardLayout({ width: Math.min(320, w - 48), height: 410, distX: 15, distY: 15, isMobile: true });
            } else if (w < 1024) {
                setCardLayout({ width: 345, height: 435, distX: 18, distY: 18, isMobile: true });
            } else {
                setCardLayout({ width: 380, height: 480, distX: 24, distY: 22, isMobile: false });
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWheelOverDeck = (e) => {
        wheelAccumulatorRef.current += e.deltaY;
        if (Math.abs(wheelAccumulatorRef.current) > 60) {
            const dir = Math.sign(wheelAccumulatorRef.current);
            wheelAccumulatorRef.current = 0;
            if (cardSwapRef.current) {
                if (dir > 0) {
                    cardSwapRef.current.next ? cardSwapRef.current.next() : cardSwapRef.current.swap();
                } else {
                    cardSwapRef.current.prev ? cardSwapRef.current.prev() : cardSwapRef.current.swap();
                }
            }
        }
    };

    const handleManualSwap = () => {
        if (cardSwapRef.current) {
            cardSwapRef.current.swap();
        }
    };

    const handleSelectCategory = (catId) => {
        setSelectedCategory(catId);
        const members = catId === 'all' 
            ? CORE_TECHNICAL_TEAM 
            : CORE_TECHNICAL_TEAM.filter(m => m.category === catId);
        if (members.length > 0) {
            const alreadyInCat = members.some(m => m.id === activeMemberId);
            if (!alreadyInCat) {
                setActiveMemberId(members[0].id);
            }
        }
    };

    return (
        <section ref={sectionRef} className="site-section section-team" id="team">
            <div className="section-frame">
                {/* 1. Header & Department Filters */}
                <div className="team-header-block mb-8">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-iris)' }} /> // 05 — CORE TECHNICAL TEAM
                    </span>

                    <h2 className="section-main-heading">
                        The people behind <br />
                        <span className="text-iris">SignBridge.</span>
                    </h2>

                    <p className="section-lead-text max-w-2xl mb-8">
                        12 specialists driving engineering excellence across executive leadership, product intelligence, frontend branding, scalable backends, multi-cloud DevOps, accessible UX, and automated QA.
                    </p>

                    {/* Department Filter Tabs */}
                    <div className="team-dept-filter-bar" role="tablist" aria-label="Filter team by department">
                        {DEPARTMENT_CATEGORIES.map((dept) => {
                            const isActive = selectedCategory === dept.id;
                            return (
                                <button
                                    key={dept.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => handleSelectCategory(dept.id)}
                                    className={`team-dept-tab ${isActive ? 'active' : ''}`}
                                >
                                    <span>{dept.label}</span>
                                    <span className="team-dept-tab-count">{dept.count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Spotlight Showcase Layout (3D Perspective Deck + Telemetry) */}
                <div className="team-showcase-layout !grid !grid-cols-1 lg:!grid-cols-2 !gap-12 items-center">
                    {/* Left Column: Spotlight Info & Telemetry */}
                    <div className="team-spotlight-info">
                        {/* Active Member Focus Card */}
                        <div className="active-member-spotlight">
                            <div className="spotlight-header">
                                <span className="spotlight-num text-iris font-mono font-bold">
                                    {activeMember.num} <span className="spotlight-denom text-slate-400">/ 12</span>
                                </span>
                                <span className="spotlight-badge">{activeMember.badge}</span>
                            </div>

                            <h3 className="spotlight-name">{activeMember.name}</h3>
                            <p className="spotlight-role text-iris font-semibold">{activeMember.role}</p>
                            <p className="spotlight-bio">{activeMember.bio}</p>

                            <div className="spotlight-skills">
                                {activeMember.skills.map((skill) => (
                                    <span key={skill} className="skill-chip">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {activeMember.portfolio && (
                                <div className="spotlight-portfolio-row">
                                    <a
                                        href={activeMember.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="spotlight-portfolio-link"
                                        aria-label={`Visit ${activeMember.name}'s portfolio at surya.signbridge.click`}
                                    >
                                        <span className="portfolio-link-icon">
                                            <ArrowUpRight size={13} />
                                        </span>
                                        <span className="portfolio-link-label">EXPLORE PORTFOLIO //</span>
                                        <span className="portfolio-link-url">surya.signbridge.click</span>
                                    </a>
                                </div>
                            )}
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

                            <div className="team-scroll-hint" title="Cycle through members">
                                <Mouse size={15} className="text-iris" />
                                <span>{cardLayout.isMobile ? 'SWIPE CARDS OR TAP PILLS' : 'SCROLL OR HOVER TO CYCLE'}</span>
                            </div>
                        </div>

                        {/* Quick Member Selector Pills for Filtered Group */}
                        <div className="member-quick-pills" role="tablist" aria-label="Select member to spotlight">
                            {filteredTeam.map((m, idx) => {
                                const isCurrent = m.id === activeMember.id;
                                return (
                                    <button
                                        key={m.num}
                                        type="button"
                                        role="tab"
                                        aria-selected={isCurrent}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveMemberId(m.id);
                                            if (cardSwapRef.current) {
                                                cardSwapRef.current.goTo(idx);
                                            }
                                        }}
                                        className={`member-pill-btn ${isCurrent ? 'active' : ''}`}
                                        title={`Spotlight ${m.name} (${m.role})`}
                                    >
                                        <span className="pill-dot" />
                                        <span className="pill-name">{m.num} {m.name}</span>
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
                            key={`${selectedCategory}-${cardLayout.width}`}
                            ref={cardSwapRef}
                            width={cardLayout.width}
                            height={cardLayout.height}
                            cardDistance={selectedCategory === 'all' ? cardLayout.distX : Math.round(cardLayout.distX * 1.35)}
                            verticalDistance={selectedCategory === 'all' ? cardLayout.distY : Math.round(cardLayout.distY * 1.25)}
                            delay={5000}
                            pauseOnHover={true}
                            skewAmount={cardLayout.isMobile ? 2 : 4}
                            easing="smooth"
                            onActiveIndexChange={(newIdx) => {
                                if (filteredTeam[newIdx]) {
                                    setActiveMemberId(filteredTeam[newIdx].id);
                                }
                            }}
                        >
                            {filteredTeam.map((member) => (
                                <Card key={member.id} className="team-swap-card">
                                    <div className="team-swap-inner">
                                        {/* Image Area */}
                                        <div className="team-card-image-wrap">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="team-card-img"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Fallback to high-contrast avatar placeholder if asset loading fails
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            <div className="card-scanline-overlay" />
                                            <span className="card-floating-badge">{member.badge}</span>
                                        </div>

                                        {/* Bottom Glass Info Bar */}
                                        <div className="team-card-bottom-bar">
                                            <div className="card-num-row">
                                                <span className="card-num-text">{member.num} // {member.category.toUpperCase()}</span>
                                                <span className="card-status-dot" />
                                            </div>
                                            <div className="card-name-row">
                                                <h4 className="card-member-name">{member.name}</h4>
                                                {member.portfolio && (
                                                    <a
                                                        href={member.portfolio}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="card-portfolio-pill"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Visit Surya's Portfolio (surya.signbridge.click)"
                                                    >
                                                        <span>PORTFOLIO</span>
                                                        <ArrowUpRight size={11} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="card-member-role text-iris">{member.role}</p>
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
