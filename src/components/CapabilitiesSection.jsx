import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Cpu, Cloud, Radio, Activity, Rocket } from 'lucide-react';

const CAPABILITIES = [
    {
        num: '01',
        icon: Terminal,
        title: 'Software Engineering',
        desc: 'Scalable web applications, APIs, backend architectures, dashboards, and digital platforms.',
        tags: ['HTML5', 'React', 'Next.js', 'Node.js', 'TypeScript']
    },
    {
        num: '02',
        icon: Cpu,
        title: 'AI & Machine Learning',
        desc: 'Intelligent systems using machine learning, computer vision, and real-time inference models.',
        tags: ['Python', 'TensorFlow', 'MediaPipe', 'TinyML', 'OpenCV']
    },
    {
        num: '03',
        icon: Cloud,
        title: 'Cloud & Backend',
        desc: 'Cloud-connected applications, authentication, databases, microservices, and real-time infrastructure.',
        tags: ['Firebase', 'Firestore', 'PostgreSQL', 'REST APIs']
    },
    {
        num: '04',
        icon: Radio,
        title: 'IoT & Embedded Systems',
        desc: 'Connected hardware systems combining sensors, microcontrollers, and intelligent edge computing.',
        tags: ['ESP32', 'Arduino', 'Raspberry Pi', 'MicroPython']
    },
    {
        num: '05',
        icon: Activity,
        title: 'Data & Signal Processing',
        desc: 'Real-time data telemetry processing, current-signal analysis, and machine-learning feature extraction.',
        tags: ['FFT', 'Signal Analysis', 'Telemetry', 'Visualization']
    },
    {
        num: '06',
        icon: Rocket,
        title: 'Product Development',
        desc: 'Transforming early concepts into functional prototypes, deployable MVPs, and production digital products.',
        tags: ['Rapid Prototyping', 'UI/UX', 'System Architecture']
    }
];

export default function CapabilitiesSection() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const beaconGroupRef = useRef(null);
    const cardRefs = useRef([]);

    // Cached layout metrics (never queried during scroll)
    const metricsRef = useRef({
        sectionTopDoc: 0,
        sectionHeight: 1,
        pathLength: 0,
        inView: false,
        lastActiveIdx: -1
    });

    const [pathD, setPathD] = useState('');
    const [waypoints, setWaypoints] = useState([]);
    const [activeCardIndex, setActiveCardIndex] = useState(-1);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let rafId = null;

        const measureLayout = () => {
            if (!containerRef.current || !sectionRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const sectionRect = sectionRef.current.getBoundingClientRect();

            metricsRef.current.sectionTopDoc = sectionRect.top + window.scrollY;
            metricsRef.current.sectionHeight = Math.max(sectionRect.height, 1);

            const cardPoints = [];
            cardRefs.current.forEach((cardEl, idx) => {
                if (!cardEl) return;
                const r = cardEl.getBoundingClientRect();
                cardPoints.push({
                    x: r.left - containerRect.left + 32,
                    y: r.top - containerRect.top + 30,
                    idx,
                    height: r.height,
                    top: r.top - containerRect.top
                });
            });

            if (cardPoints.length < 2) return;

            const startX = cardPoints[0].x;
            const startY = Math.max(10, cardPoints[0].y - 45);
            let d = `M ${startX} ${startY} L ${cardPoints[0].x} ${cardPoints[0].y}`;

            for (let i = 0; i < cardPoints.length - 1; i++) {
                const curr = cardPoints[i];
                const next = cardPoints[i + 1];

                if (Math.abs(curr.y - next.y) < 30) {
                    d += ` C ${curr.x + 40} ${curr.y}, ${next.x - 40} ${next.y}, ${next.x} ${next.y}`;
                } else {
                    const gapY = curr.top + curr.height + 15;
                    d += ` C ${curr.x + 30} ${curr.y + 40}, ${curr.x + 30} ${gapY}, ${curr.x - 20} ${gapY}`;
                    d += ` L ${next.x - 20} ${gapY}`;
                    d += ` C ${next.x - 20} ${gapY}, ${next.x - 20} ${next.y - 15}, ${next.x} ${next.y}`;
                }
            }

            setPathD(d);
            setWaypoints(cardPoints);
        };

        const updateFromScroll = () => {
            rafId = null;
            const m = metricsRef.current;
            const windowHeight = window.innerHeight;
            const rectTop = m.sectionTopDoc - window.scrollY;

            const startThreshold = windowHeight * 0.8;
            const endThreshold = windowHeight * 0.2;
            const totalDistance = m.sectionHeight + (startThreshold - endThreshold);
            const currentDistance = startThreshold - rectTop;

            const progress = prefersReducedMotion
                ? 1
                : Math.min(1, Math.max(0, currentDistance / totalDistance));

            const nextActiveIdx = Math.min(CAPABILITIES.length - 1, Math.floor(progress * CAPABILITIES.length));

            if (pathRef.current) {
                if (!m.pathLength) {
                    m.pathLength = pathRef.current.getTotalLength();
                    pathRef.current.style.strokeDasharray = `${m.pathLength}`;
                }
                pathRef.current.style.strokeDashoffset = `${m.pathLength * (1 - progress)}`;

                if (beaconGroupRef.current) {
                    if (progress > 0.01 && progress < 0.99 && m.pathLength > 0) {
                        const pt = pathRef.current.getPointAtLength(m.pathLength * progress);
                        beaconGroupRef.current.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
                        beaconGroupRef.current.style.opacity = '1';
                    } else {
                        beaconGroupRef.current.style.opacity = '0';
                    }
                }
            }

            if (nextActiveIdx !== m.lastActiveIdx) {
                m.lastActiveIdx = nextActiveIdx;
                setActiveCardIndex(nextActiveIdx);
            }
        };

        const onScroll = () => {
            if (!metricsRef.current.inView || rafId !== null) return;
            rafId = requestAnimationFrame(updateFromScroll);
        };

        const ro = new ResizeObserver(() => {
            metricsRef.current.pathLength = 0;
            requestAnimationFrame(() => {
                measureLayout();
                updateFromScroll();
            });
        });

        if (containerRef.current) {
            ro.observe(containerRef.current);
        }

        const io = new IntersectionObserver(
            (entries) => {
                metricsRef.current.inView = entries[0]?.isIntersecting ?? false;
                if (metricsRef.current.inView) {
                    requestAnimationFrame(updateFromScroll);
                }
            },
            { rootMargin: '180px 0px' }
        );

        if (sectionRef.current) {
            io.observe(sectionRef.current);
        }

        requestAnimationFrame(() => {
            measureLayout();
            updateFromScroll();
        });

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    // Recalculate SVG path length whenever pathD updates
    useEffect(() => {
        if (pathRef.current) {
            metricsRef.current.pathLength = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = `${metricsRef.current.pathLength}`;
        }
    }, [pathD]);

    return (
        <section ref={sectionRef} className="site-section section-capabilities" id="capabilities">
            <div ref={containerRef} className="section-frame capabilities-relative-frame">
                {/* Lightweight GPU-friendly SVG Connector Line */}
                <svg className="capabilities-journey-svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a5b4fc" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>

                    {pathD && (
                        <path
                            d={pathD}
                            fill="none"
                            stroke="rgba(99, 102, 241, 0.16)"
                            strokeWidth="2"
                            strokeDasharray="5 5"
                            strokeLinecap="round"
                        />
                    )}

                    {pathD && (
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none"
                            stroke="url(#journey-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    )}

                    {waypoints.map((wp, i) => {
                        const isReached = activeCardIndex >= i;
                        return (
                            <g key={i} transform={`translate(${wp.x}, ${wp.y})`}>
                                <circle
                                    r="6"
                                    fill={isReached ? '#ffffff' : '#f8fafc'}
                                    stroke={isReached ? '#6366f1' : 'rgba(99, 102, 241, 0.25)'}
                                    strokeWidth="2"
                                />
                                {isReached && <circle r="3" fill="#6366f1" />}
                            </g>
                        );
                    })}

                    <g ref={beaconGroupRef} style={{ opacity: 0 }}>
                        <circle r="10" fill="rgba(99, 102, 241, 0.22)" />
                        <circle r="4.5" fill="#6366f1" />
                        <circle r="2" fill="#ffffff" />
                    </g>
                </svg>

                {/* Section Header with Live Journey Telemetry */}
                <div className="section-header-block capabilities-header-flex">
                    <div>
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // 02 — CAPABILITIES &amp; JOURNEY
                        </span>
                        <h2 className="section-main-heading">
                            Technology that <br />
                            <span className="text-lime">builds the bridge.</span>
                        </h2>
                        <p className="section-lead-text">
                            A multidisciplinary engineering stack designed to move products from concept to deployment.
                        </p>
                    </div>
                </div>

                {/* Capability Cards Grid */}
                <div className="capability-grid !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-2 xl:!grid-cols-3 3xl:!grid-cols-4 !gap-6">
                    {CAPABILITIES.map((cap, index) => {
                        const IconComp = cap.icon;
                        const isActivated = activeCardIndex >= index;
                        return (
                            <article
                                key={cap.num}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`capability-card ${isActivated ? 'card-activated' : ''}`}
                            >
                                <div className="cap-card-header">
                                    <div className="cap-node-badge">
                                        <span className={`socket-dot ${isActivated ? 'socket-active' : ''}`} />
                                        <span className="socket-code">NODE // {cap.num}</span>
                                    </div>
                                    <div className="cap-icon-box" aria-hidden="true">
                                        <IconComp size={20} />
                                    </div>
                                </div>

                                <div className="cap-card-body">
                                    <h3 className="cap-title">{cap.title}</h3>
                                    <p className="cap-desc">{cap.desc}</p>
                                </div>

                                <div className="cap-card-footer">
                                    <div className="cap-tags-list">
                                        {cap.tags.map((tag) => (
                                            <span key={tag} className="cap-tag-chip">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
