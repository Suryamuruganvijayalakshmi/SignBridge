import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight, ShieldCheck, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import InteractiveDock from './InteractiveDock.jsx';
import { getSupabase } from '../lib/supabase.js';
import {
    sanitizeInput,
    isValidEmail,
    isValidName,
    isValidMessage,
    checkRateLimit,
    recordSubmission,
    saveOfflineInquiry,
    generateDirectMailto
} from '../lib/formSecurity.js';

export default function ContactSection({ onNotification }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // Anti-spam bot honeypot (invisible to humans)
    const [honeypot, setHoneypot] = useState('');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '', mailtoFallback: null });
    const [errors, setErrors] = useState({});

    // Clear status after 8 seconds if successful
    useEffect(() => {
        if (status.type === 'success') {
            const timer = setTimeout(() => {
                setStatus({ type: '', text: '', mailtoFallback: null });
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const validateForm = () => {
        const errs = {};
        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanMsg = sanitizeInput(message);

        if (!isValidName(cleanName)) {
            errs.name = 'Please provide a valid name (2-80 characters).';
        }

        if (!isValidEmail(cleanEmail)) {
            errs.email = 'Please provide a valid email address (e.g. name@domain.com).';
        }

        if (!isValidMessage(cleanMsg)) {
            errs.message = 'Please provide a message brief (minimum 5 characters).';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Bot Honeypot Check
        if (honeypot) {
            // Silently drop bot submissions without polluting DB
            setStatus({
                type: 'success',
                text: '// TRANSMISSION LOGGED — CONNECTION PROTOCOL INITIALIZED.',
                mailtoFallback: null
            });
            setName('');
            setEmail('');
            setMessage('');
            return;
        }

        // 2. Client-side Validation & Sanitization
        if (!validateForm()) {
            setStatus({
                type: 'error',
                text: 'Please correct the highlighted fields before sending.',
                mailtoFallback: null
            });
            return;
        }

        // 3. Anti-Spam Rate Limit Cooldown Check
        const rateCheck = checkRateLimit('signbridge_contact_cooldown', 20);
        if (!rateCheck.allowed) {
            setStatus({
                type: 'error',
                text: `Rate limit active: Please wait ${rateCheck.remainingSeconds}s before transmitting another message.`,
                mailtoFallback: null
            });
            return;
        }

        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedMsg = sanitizeInput(message);

        setLoading(true);
        setStatus({
            type: 'loading',
            text: '// SECURING TLS UPLINK & TRANSMITTING TELEMETRY...',
            mailtoFallback: null
        });

        let isSuccess = false;
        let errorMessage = '';

        try {
            const supabase = await getSupabase();
            // 8-second timeout promise race for high reliability
            const insertPromise = supabase.from('contact_messages').insert({
                name: sanitizedName,
                email: sanitizedEmail,
                project: 'Direct Transmission (Contact Form)',
                message: sanitizedMsg
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Network timeout: Gateway took too long to respond')), 8000)
            );

            const result = await Promise.race([insertPromise, timeoutPromise]);

            if (result.error) {
                throw result.error;
            }

            isSuccess = true;
        } catch (err) {
            console.error('Contact submission telemetry error:', err);
            errorMessage = err.message || 'Direct database uplink could not be completed.';
        }

        setLoading(false);

        if (isSuccess) {
            recordSubmission('signbridge_contact_cooldown');
            setStatus({
                type: 'success',
                text: '// TRANSMISSION CONFIRMED: Protocol dispatched to SignBridge Core. We will connect within 24 hours.',
                mailtoFallback: null
            });

            if (onNotification) {
                onNotification('// TRANSMISSION CONFIRMED: OUR TEAM WILL CONNECT SHORTLY.');
            }

            setName('');
            setEmail('');
            setMessage('');
            setErrors({});
        } else {
            // Save locally so no lead is lost
            saveOfflineInquiry({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMsg,
                source: 'ContactSection'
            });

            const fallbackMailto = generateDirectMailto({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMsg,
                subject: 'Project Inquiry via Direct Uplink'
            });

            setStatus({
                type: 'error',
                text: `// UPLINK WARNING: ${errorMessage} Your brief has been saved locally.`,
                mailtoFallback: fallbackMailto
            });
        }
    };

    return (
        <section className="site-section section-contact" id="contact">
            <div className="section-frame contact-grid-layout !grid !grid-cols-1 lg:!grid-cols-2 !gap-12">
                {/* Left: Contact Info & Protocol Channels */}
                <div className="contact-info-block">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" /> Contact &amp; Collaboration
                    </span>
                    <h2 className="section-main-heading">
                        Have an idea <br />
                        <span className="text-accent">worth building?</span>
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

                    {/* Interactive macOS Magnification Navigation Dock */}
                    <InteractiveDock />

                    {/* Security & Reliability SLA Assurance Pill */}
                    <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <ShieldCheck size={16} className="text-indigo-600" />
                        <span>256-Bit Encrypted Uplink · Anti-Spam Guard · 24h Response Protocol</span>
                    </div>
                </div>

                {/* Right: Streamlined, Secure Contact Form */}
                <div className="contact-form-card">
                    <form onSubmit={handleSubmit} className="contact-form" noValidate>
                        {/* Hidden Bot Honeypot Field */}
                        <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                            <label htmlFor="hp_contact_url">Leave this empty</label>
                            <input
                                type="text"
                                id="hp_contact_url"
                                name="hp_contact_url"
                                tabIndex="-1"
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        {/* Name Field */}
                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="contact-name-input">NAME / IDENTITY</label>
                                {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                            </div>
                            <input
                                type="text"
                                id="contact-name-input"
                                name="name"
                                required
                                maxLength={80}
                                placeholder="Your name or organization"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                                }}
                                className={`form-control ${errors.name ? 'border-rose-500' : ''}`}
                                autoComplete="name"
                                disabled={loading}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="contact-email-input">COMMUNICATION UPLINK / EMAIL</label>
                                {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
                            </div>
                            <input
                                type="email"
                                id="contact-email-input"
                                name="email"
                                required
                                maxLength={100}
                                placeholder="name@organization.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                                }}
                                className={`form-control ${errors.email ? 'border-rose-500' : ''}`}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        {/* Message Brief Field (Unwanted 'Project / Domain' text box cleanly eliminated) */}
                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="contact-msg-input">MESSAGE / PROJECT BRIEF</label>
                                <div className="flex items-center gap-2">
                                    {errors.message && <span className="text-xs text-rose-500">{errors.message}</span>}
                                    <span className="text-xs text-slate-400 font-mono">
                                        {message.length}/2000
                                    </span>
                                </div>
                            </div>
                            <textarea
                                id="contact-msg-input"
                                name="message"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe what you are building, timeline, goals, and technical parameters..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
                                }}
                                className={`form-control ${errors.message ? 'border-rose-500' : ''}`}
                                disabled={loading}
                            />
                        </div>

                        {/* Feedback / Status Alert */}
                        {status.text && (
                            <div
                                className={`form-status p-3 rounded-lg text-xs font-mono flex items-start gap-2.5 ${
                                    status.type === 'error'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : status.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                                role="status"
                            >
                                {status.type === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />}
                                {status.type === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />}
                                {status.type === 'loading' && <RotateCw size={16} className="shrink-0 mt-0.5 animate-spin text-indigo-600" />}
                                <div className="flex-1">
                                    <p>{status.text}</p>
                                    {status.mailtoFallback && (
                                        <div className="mt-2 pt-2 border-t border-rose-200">
                                            <a
                                                href={status.mailtoFallback}
                                                className="inline-flex items-center gap-1.5 font-bold underline hover:opacity-80"
                                            >
                                                <span>Click here to send immediately via email client</span>
                                                <ArrowUpRight size={13} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            id="contact-submit-btn"
                            disabled={loading}
                            className="btn-primary-lime"
                            style={{ width: '100%', marginTop: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            <span>{loading ? 'SECURING & TRANSMITTING...' : 'DISPATCH TRANSMISSION'}</span>
                            <Send size={16} className={loading ? 'animate-pulse' : ''} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
