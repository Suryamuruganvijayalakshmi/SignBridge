import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Cpu, Cloud, Radio, Activity, Rocket } from 'lucide-react';

export default function CapabilitiesSection() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const bgPathRef = useRef(null);
    const cardRefs = useRef([]);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [pathD, setPathD] = useState('');
    const [beaconPos, setBeaconPos] = useState({ x: 0, y: 0 });
    const [waypoints, setWaypoints] = useState([]);
    const [activeCardIndex, setActiveCardIndex] = useState(-1);

    const capabilities = [
        {
            num: '01',
            icon: <Terminal size={20} />,
            title: 'Software Engineering',
            desc: 'Scalable web applications, APIs, backend architectures, dashboards, and digital platforms.',
            tags: ['HTML5', 'React', 'Next.js', 'Node.js', 'TypeScript']
        },
        {
            num: '02',
            icon: <Cpu size={20} />,
            title: 'AI & Machine Learning',
            desc: 'Intelligent systems using machine learning, computer vision, and real-time inference models.',
            tags: ['Python', 'TensorFlow', 'MediaPipe', 'TinyML', 'OpenCV']
        },
        {
            num: '03',
            icon: <Cloud size={20} />,
            title: 'Cloud & Backend',
            desc: 'Cloud-connected applications, authentication, databases, microservices, and real-time infrastructure.',
            tags: ['Firebase', 'Firestore', 'PostgreSQL', 'REST APIs']
        },
        {
            num: '04',
            icon: <Radio size={20} />,
            title: 'IoT & Embedded Systems',
            desc: 'Connected hardware systems combining sensors, microcontrollers, and intelligent edge computing.',
            tags: ['ESP32', 'Arduino', 'Raspberry Pi', 'MicroPython']
        },
        {
            num: '05',
            icon: <Activity size={20} />,
            title: 'Data & Signal Processing',
            desc: 'Real-time data telemetry processing, current-signal analysis, and machine-learning feature extraction.',
            tags: ['FFT', 'Signal Analysis', 'Telemetry', 'Visualization']
        },
        {
            num: '06',
            icon: <Rocket size={20} />,
            title: 'Product Development',
            desc: 'Transforming early concepts into functional prototypes, deployable MVPs, and production digital products.',
            tags: ['Rapid Prototyping', 'UI/UX', 'System Architecture']
        }
    ];

    // Compute the neat SVG journey line through card sockets
    const updatePath = () => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();

        const cardPoints = [];
        cardRefs.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const r = cardEl.getBoundingClientRect();
            // Target the node pin in the top-left of each card
            const x = r.left - containerRect.left + 32;
            const y = r.top - containerRect.top + 30;
            cardPoints.push({ x, y, idx, width: r.width, height: r.height, top: r.top - containerRect.top, left: r.left - containerRect.left });
        });

        if (cardPoints.length < 2) return;

        // Start point above Card 01
        const startX = cardPoints[0].x;
        const startY = Math.max(10, cardPoints[0].y - 45);

        let d = `M ${startX} ${startY}`;

        // Line to Card 01 socket
        d += ` L ${cardPoints[0].x} ${cardPoints[0].y}`;

        for (let i = 0; i < cardPoints.length - 1; i++) {
            const curr = cardPoints[i];
            const next = cardPoints[i + 1];

            // If on the same horizontal row (left to right)
            if (Math.abs(curr.y - next.y) < 30) {
                const midX = (curr.x + next.x) / 2;
                d += ` C ${curr.x + 40} ${curr.y}, ${next.x - 40} ${next.y}, ${next.x} ${next.y}`;
            } else {
                // Row break (e.g. Card 03 to Card 04)
                // Route neatly through the gutter between rows
                const gapY = curr.top + curr.height + 15;
                d += ` C ${curr.x + 30} ${curr.y + 40}, ${curr.x + 30} ${gapY}, ${curr.x - 20} ${gapY}`;
                d += ` L ${next.x - 20} ${gapY}`;
                d += ` C ${next.x - 20} ${gapY}, ${next.x - 20} ${next.y - 15}, ${next.x} ${next.y}`;
            }
        }

        setPathD(d);
        setWaypoints(cardPoints);
    };

    // Calculate Scroll Progress through Capabilities Section
    useEffect(() => {
        updatePath();

        const handleResize = () => {
            updatePath();
        };

        window.addEventListener('resize', handleResize, { passive: true });
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        let animationFrameId;
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start drawing when the section top enters at 80% of viewport
            // Finish drawing when section bottom reaches 20% of viewport
            const startThreshold = windowHeight * 0.8;
            const endThreshold = windowHeight * 0.2;
            const totalDistance = rect.height + (startThreshold - endThreshold);
            const currentDistance = startThreshold - rect.top;

            const progress = Math.min(1, Math.max(0, currentDistance / totalDistance));
            setScrollProgress(progress);

            // Update Path stroke-dashoffset and head position
            if (pathRef.current) {
                const totalLength = pathRef.current.getTotalLength();
                pathRef.current.style.strokeDasharray = `${totalLength}`;
                pathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

                // Position beacon at current tip
                const currentLen = totalLength * progress;
                if (currentLen > 0) {
                    const pt = pathRef.current.getPointAtLength(currentLen);
                    setBeaconPos({ x: pt.x, y: pt.y });
                }

                // Check which card is currently reached
                const activeIdx = Math.floor(progress * capabilities.length);
                setActiveCardIndex(Math.min(capabilities.length - 1, activeIdx));
            }
        };

        const onScrollTick = () => {
            animationFrameId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', onScrollTick, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', onScrollTick);
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [capabilities.length]);

    const percentText = Math.round(scrollProgress * 100);

    return (
        <section ref={sectionRef} className="site-section section-capabilities" id="capabilities">
            <div ref={containerRef} className="section-frame capabilities-relative-frame">
                {/* SVG Journey / Connector Line Canvas (pointer-events: none, aria-hidden for accessibility) */}
                <svg
                    className="capabilities-journey-svg"
                    aria-hidden="true"
                >
                    <defs>
                        {/* High-intensity Cyber Neon Lime Glow Filter */}
                        <filter id="journey-glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur1" />
                            <feGaussianBlur stdDeviation="8" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gradient for subtle forward light pulse */}
                        <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="40%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>

                    {/* Faint blueprint journey track (background guideline) */}
                    {pathD && (
                        <path
                            ref={bgPathRef}
                            d={pathD}
                            fill="none"
                            stroke="rgba(99, 102, 241, 0.18)"
                            strokeWidth="2.5"
                            strokeDasharray="5 5"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Animated drawing progress path based on user's scroll percentage */}
                    {pathD && (
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none"
                            stroke="url(#journey-gradient)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            filter="url(#journey-glow)"
                            style={{
                                transition: 'stroke-dashoffset 0.08s ease-out'
                            }}
                        />
                    )}

                    {/* Waypoint sockets at each card */}
                    {waypoints.map((wp, i) => {
                        const isReached = scrollProgress >= (i + 0.3) / waypoints.length;
                        return (
                            <g key={i} transform={`translate(${wp.x}, ${wp.y})`}>
                                <circle
                                    r="6"
                                    fill={isReached ? '#ffffff' : '#f8fafc'}
                                    stroke={isReached ? '#6366f1' : 'rgba(99, 102, 241, 0.25)'}
                                    strokeWidth="2"
                                    filter={isReached ? 'url(#journey-glow)' : 'none'}
                                />
                                {isReached && (
                                    <circle
                                        r="3"
                                        fill="#6366f1"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Pulsing Energy Beacon at the tip of the drawn line */}
                    {scrollProgress > 0.01 && scrollProgress < 0.99 && (
                        <g transform={`translate(${beaconPos.x}, ${beaconPos.y})`}>
                            <circle r="12" fill="rgba(99, 102, 241, 0.3)" className="beacon-aura" />
                            <circle r="4.5" fill="#6366f1" filter="url(#journey-glow)" />
                            <circle r="2" fill="#ffffff" />
                        </g>
                    )}
                </svg>

                {/* Section Header with Live Journey Telemetry */}
                <div className="section-header-block capabilities-header-flex">
                    <div>
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // 02 — CAPABILITIES & JOURNEY
                        </span>
                        <h2 className="section-main-heading">
                            Technology that <br />
                            <span className="text-lime">builds the bridge.</span>
                        </h2>
                        <p className="section-lead-text">
                            A multidisciplinary engineering stack designed to move products from concept to deployment.
                        </p>
                    </div>

                    {/* Live Telemetry Journey HUD Chip */}
                    <div className="journey-telemetry-hud" aria-label="Journey Progress">
                        <div className="hud-metric">
                            <span className="hud-label">CONNECTOR PROTOCOL</span>
                            <div className="hud-val-row">
                                <span className="hud-percent text-lime">{percentText}%</span>
                                <span className="hud-status">
                                    {scrollProgress >= 1 ? 'COMPLETE // 06' : `ACTIVE // NODE 0${activeCardIndex + 1}`}
                                </span>
                            </div>
                        </div>
                        <div className="hud-progress-bar">
                            <div
                                className="hud-progress-fill"
                                style={{ width: `${percentText}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Capability Cards Grid (Neat 3-column structured grid) */}
                <div className="capability-grid">
                    {capabilities.map((cap, index) => {
                        const isActivated = scrollProgress >= (index + 0.25) / capabilities.length;
                        return (
                            <article
                                key={cap.num}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`capability-card ${isActivated ? 'card-activated' : ''}`}
                            >
                                {/* Top Bar: Node Badge & Framed Icon Box */}
                                <div className="cap-card-header">
                                    <div className="cap-node-badge">
                                        <span className={`socket-dot ${isActivated ? 'socket-active' : ''}`} />
                                        <span className="socket-code">NODE // {cap.num}</span>
                                    </div>
                                    <div className="cap-icon-box" aria-hidden="true">
                                        {cap.icon}
                                    </div>
                                </div>

                                {/* Main Body: Title & Description */}
                                <div className="cap-card-body">
                                    <h3 className="cap-title">{cap.title}</h3>
                                    <p className="cap-desc">{cap.desc}</p>
                                </div>

                                {/* Footer: Clean Technology Pill Tags */}
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
