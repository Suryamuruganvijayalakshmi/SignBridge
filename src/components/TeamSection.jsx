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

    // Scroll-driven card swapping:
    useEffect(() => {
        let lastTime = 0;

        const onScroll = () => {
            const now = Date.now();
            if (now - lastTime < 60) return;
            lastTime = now;

            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top <= windowHeight * 0.6 && rect.bottom >= windowHeight * 0.3) {
                const sectionHeight = rect.height;
                const scrolledIntoSection = (windowHeight * 0.6) - rect.top;
                const progress = Math.min(1, Math.max(0, scrolledIntoSection / sectionHeight));

                const currentZone = Math.floor(progress * filteredTeam.length);

                if (currentZone !== lastScrollZoneRef.current && currentZone >= 0 && currentZone < filteredTeam.length) {
                    lastScrollZoneRef.current = currentZone;
                    const targetMember = filteredTeam[currentZone];
                    if (targetMember) {
                        setActiveMemberId(targetMember.id);
                        if (cardSwapRef.current) {
                            cardSwapRef.current.goTo(currentZone);
                        }
                    }
                }
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [filteredTeam]);

    const handleWheelOverDeck = (e) => {
        wheelAccumulatorRef.current += e.deltaY;
        if (Math.abs(wheelAccumulatorRef.current) > 70) {
            const dir = Math.sign(wheelAccumulatorRef.current);
            wheelAccumulatorRef.current = 0;
            if (cardSwapRef.current) {
                const total = cardSwapRef.current.getTotal();
                const current = cardSwapRef.current.getActiveIndex();
                let nextIdx = current + dir;
                if (nextIdx >= total) nextIdx = 0;
                if (nextIdx < 0) nextIdx = total - 1;
                cardSwapRef.current.goTo(nextIdx);
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
            setActiveMemberId(members[0].id);
        }
    };

    const handleSpotlightMember = (member) => {
        setActiveMemberId(member.id);
        // If the member is in the current filtered view, navigate 3D deck to their index
        const idx = filteredTeam.findIndex(m => m.id === member.id);
        if (idx !== -1 && cardSwapRef.current) {
            cardSwapRef.current.goTo(idx);
        } else {
            // Switch category to show them in the 3D deck
            setSelectedCategory(member.category);
        }

        // Smoothly scroll spotlight into view if clicking from roster below
        if (sectionRef.current) {
            const topPos = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
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

                            <div className="team-scroll-hint" title="Scroll down or wheel over cards to change">
                                <Mouse size={16} className="text-iris" />
                                <span>SCROLL OR HOVER TO CYCLE</span>
                            </div>
                        </div>

                        {/* Quick Member Selector Pills for Filtered Group */}
                        <div className="member-quick-pills">
                            {filteredTeam.map((m, idx) => {
                                const isCurrent = m.id === activeMember.id;
                                return (
                                    <button
                                        key={m.num}
                                        type="button"
                                        onClick={() => {
                                            setActiveMemberId(m.id);
                                            if (cardSwapRef.current) cardSwapRef.current.goTo(idx);
                                        }}
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
                            key={selectedCategory}
                            ref={cardSwapRef}
                            width={390}
                            height={490}
                            cardDistance={selectedCategory === 'all' ? 24 : 40}
                            verticalDistance={selectedCategory === 'all' ? 22 : 36}
                            delay={4500}
                            pauseOnHover={true}
                            skewAmount={4}
                            easing="elastic"
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

                {/* 3. Comprehensive Core Technical Team Roster Grid (All 12 Members) */}
                <div className="team-roster-section">
                    <div className="team-roster-header">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-iris)' }} /> // COMPLETE ROSTER
                        </span>
                        <h3 className="team-roster-title">
                            Full Engineering &amp; Design Roster <span className="text-iris font-mono text-xl">({CORE_TECHNICAL_TEAM.length})</span>
                        </h3>
                        <p className="text-slate-500 text-sm max-w-xl">
                            Select any team member to view their complete telemetry, technical domain focus, and 3D deck spotlight.
                        </p>
                    </div>

                    <div className="team-roster-grid">
                        {CORE_TECHNICAL_TEAM.map((m) => {
                            const isSelected = m.id === activeMember.id;
                            return (
                                <div
                                    key={m.id}
                                    className={`team-roster-card ${isSelected ? 'is-active-spotlight' : ''}`}
                                    onClick={() => handleSpotlightMember(m)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSpotlightMember(m);
                                        }
                                    }}
                                    aria-label={`View ${m.name}, ${m.role}`}
                                >
                                    <div className="team-roster-card-image-wrap">
                                        <img
                                            src={m.image}
                                            alt={m.name}
                                            className="team-roster-card-img"
                                            loading="lazy"
                                        />
                                        <span className="team-roster-card-badge">{m.badge}</span>
                                    </div>

                                    <div className="team-roster-card-body">
                                        <div className="team-roster-meta-row">
                                            <span className="team-roster-num">{m.num} // SB</span>
                                            <span className="team-roster-dept-tag">{m.category}</span>
                                        </div>

                                        <h4 className="team-roster-name">{m.name}</h4>
                                        <p className="team-roster-role">{m.role}</p>

                                        <div className="team-roster-skills">
                                            {m.skills.slice(0, 3).map((sk) => (
                                                <span key={sk} className="team-roster-skill-chip">
                                                    {sk}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="team-roster-actions">
                                            <button
                                                type="button"
                                                className="team-spotlight-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSpotlightMember(m);
                                                }}
                                            >
                                                <span>SPOTLIGHT IN 3D</span>
                                                <ArrowRight size={11} />
                                            </button>

                                            {m.portfolio && (
                                                <a
                                                    href={m.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="card-portfolio-pill"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Visit Founder Portfolio"
                                                >
                                                    <span>PORTFOLIO</span>
                                                    <ArrowUpRight size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
