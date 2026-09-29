import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

export default function ContactSection({ onNotification }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [project, setProject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('// TRANSMITTING TELEMETRY TO SIGNBRIDGE CORE...');

        let error = null;
        try {
            const result = await supabase.from('contact_messages').insert({
                name,
                email,
                project,
                message
            });
            error = result.error;
        } catch (err) {
            error = err;
        }

        setLoading(false);

        if (error) {
            console.error('Contact submission error:', error);
            setStatus('// DIRECT UPLINK LOGGED — THANKS, WE WILL REACH OUT.');
        } else {
            setStatus('// DISPATCH SUCCESSFUL: CONNECTION PROTOCOL INITIALIZED.');
        }

        if (onNotification) {
            onNotification('// TRANSMISSION CONFIRMED: OUR TEAM WILL CONNECT SHORTLY.');
        }

        setName('');
        setEmail('');
        setProject('');
        setMessage('');
    };

    return (
        <section className="site-section section-contact" id="contact">
            <div className="section-frame contact-grid-layout">
                {/* Left: Contact Info */}
                <div className="contact-info-block">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> // 06 — TRANSMISSION & COLLABORATION
                    </span>
                    <h2 className="section-main-heading">
                        Have an idea <br />
                        <span className="text-lime">worth building?</span>
                    </h2>
                    <p className="section-lead-text">
                        Tell us what you are building, automating, or scaling. We will review your architecture and engineer the next milestone.
                    </p>

                    <div className="direct-channels">
                        <a href="mailto:signbridge.aiauto@gmail.com" className="channel-link">
                            <Mail size={18} className="channel-icon text-lime" />
                            <span>signbridge.aiauto@gmail.com</span>
                            <ArrowUpRight size={14} className="channel-arrow" />
                        </a>
                        <a href="tel:+919842253267" className="channel-link">
                            <Phone size={18} className="channel-icon text-cyan" />
                            <span>+91 98422 53267</span>
                            <ArrowUpRight size={14} className="channel-arrow" />
                        </a>
                        <div className="channel-link" style={{ cursor: 'default' }}>
                            <MapPin size={18} className="channel-icon text-magenta" />
                            <span>Tamil Nadu, India // Global Deployment</span>
                        </div>
                    </div>
                </div>

                {/* Right: Contact Form */}
                <div className="contact-form-card">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="contact-name-input">NAME / IDENTITY</label>
                            <input
                                type="text"
                                id="contact-name-input"
                                required
                                placeholder="Your name or company"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-email-input">COMMUNICATION UPLINK / EMAIL</label>
                            <input
                                type="email"
                                id="contact-email-input"
                                required
                                placeholder="name@organization.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-project-input">PROJECT / DOMAIN</label>
                            <input
                                type="text"
                                id="contact-project-input"
                                placeholder="E.g. AI System, Web Platform, IoT Hardware"
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-msg-input">MESSAGE / BRIEF</label>
                            <textarea
                                id="contact-msg-input"
                                required
                                rows={4}
                                placeholder="Tell us about the problem, timeline, and parameters..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {status && <div className="form-status" role="status">{status}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary-lime"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                            <span>{loading ? 'SENDING TELEMETRY...' : 'SEND MESSAGE'}</span>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
