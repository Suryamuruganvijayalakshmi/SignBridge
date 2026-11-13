import React from 'react';
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
    return (
        <section className="site-section section-capabilities" id="capabilities">
            <div className="section-frame">
                {/* Section Header */}
                <div className="section-header-block capabilities-header-flex">
                    <div>
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> Capabilities &amp; Journey
                        </span>
                        <h2 className="section-main-heading">
                            Technology that <br />
                            <span className="text-accent">builds the bridge.</span>
                        </h2>
                        <p className="section-lead-text">
                            A multidisciplinary engineering stack designed to move products from concept to deployment.
                        </p>
                    </div>
                </div>

                {/* Capability Cards Grid */}
                <div className="capability-grid !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-2 xl:!grid-cols-3 3xl:!grid-cols-4 !gap-6">
                    {CAPABILITIES.map((cap) => {
                        const IconComp = cap.icon;
                        return (
                            <article key={cap.num} className="capability-card">
                                <div className="cap-card-header">
                                    <div className="cap-node-badge">
                                        <span className="socket-code">0{cap.num} // CORE</span>
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
