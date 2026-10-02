import React, { useState } from 'react';

export default function ProcessTimeline() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { num: '01', title: 'Problem', desc: 'Identify the real-world bottleneck or market friction.' },
        { num: '02', title: 'Research', desc: 'Study users, evaluate technology feasibility, and select the stack.' },
        { num: '03', title: 'Idea', desc: 'Define system architecture, data models, and technical direction.' },
        { num: '04', title: 'Prototype', desc: 'Build and validate the initial interactive experience or circuit.' },
        { num: '05', title: 'Build', desc: 'Develop production software, ML models, APIs, and infrastructure.' },
        { num: '06', title: 'Test', desc: 'Stress-test reliability, latency, edge performance, and security.' },
        { num: '07', title: 'MVP', desc: 'Package and deploy the minimal viable product for real users.' },
        { num: '08', title: 'Deploy', desc: 'Launch scalable cloud backends, IoT devices, and ongoing monitoring.' }
    ];

    return (
        <section className="site-section section-process" id="process">
            <div className="section-frame">
                <div className="section-header-block">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> // 04 — OUR PROCESS
                    </span>
                    <h2 className="section-main-heading">
                        From idea to <br />
                        <span className="text-lime">deployment.</span>
                    </h2>
                    <p className="section-lead-text">
                        A systematic engineering process for transforming complex requirements into production-ready digital and hardware products.
                    </p>
                </div>

                <div className="timeline-grid">
                    {steps.map((step, idx) => {
                        const isActive = idx === activeStep;
                        return (
                            <div
                                key={step.num}
                                className={`timeline-step-card ${isActive ? 'active' : ''}`}
                                onMouseEnter={() => setActiveStep(idx)}
                                onClick={() => setActiveStep(idx)}
                                role="button"
                            >
                                <div className="step-header">
                                    <span className="step-number">{step.num}</span>
                                    <span className="step-indicator" />
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
