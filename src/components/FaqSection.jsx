import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: 'What kind of projects does SignBridge take on?',
            a: 'We engineer full-stack digital products, custom AI & machine learning systems, WebGL interactive 3D platforms, IoT and embedded hardware solutions, and rapid startup MVPs from concept to deployment.'
        },
        {
            q: 'Can you work with or upgrade an existing product?',
            a: 'Yes. We audit, redesign, accelerate performance, integrate custom AI models, or extend existing digital platforms and hardware architectures.'
        },
        {
            q: 'How do we get started on a collaboration?',
            a: 'Initiate a transmission via our contact form or email. We will arrange a focused architecture call to discuss your requirements, bottlenecks, and delivery milestones.'
        },
        {
            q: 'Can SignBridge develop on-device custom AI solutions?',
            a: 'Yes. We build embedded TinyML for microcontrollers (such as ESP32), computer vision models, real-time gesture & object recognition, and high-throughput cloud inference pipelines.'
        }
    ];

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? -1 : idx);
    };

    return (
        <section className="site-section section-faq" id="faq">
            <div className="section-frame faq-grid-layout !grid !grid-cols-1 lg:!grid-cols-2 !gap-12">
                <div className="faq-header-column">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> // 07 — PROTOCOL FAQ
                    </span>
                    <h2 className="section-main-heading">
                        Good to <br />
                        <span className="text-lime">know.</span>
                    </h2>
                    <p className="section-lead-text">
                        Clear answers on technical capability, collaboration workflows, and product deployment.
                    </p>
                </div>

                <div className="faq-accordion-list">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                                <button
                                    type="button"
                                    className="faq-question-btn"
                                    onClick={() => toggle(idx)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.q}</span>
                                    <span className="faq-icon-wrap">
                                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="faq-answer-content">
                                        <p>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
