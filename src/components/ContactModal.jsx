import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, AlertCircle, CheckCircle2, RotateCw, ArrowUpRight } from 'lucide-react';
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

export default function ContactModal({ isOpen, onClose, onNotification }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '', mailtoFallback: null });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            window.dispatchEvent(new Event('bump-cursor'));
        } else {
            setStatus({ type: '', text: '', mailtoFallback: null });
            setErrors({});
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const validateForm = () => {
        const errs = {};
        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanMsg = sanitizeInput(message);

        if (!isValidName(cleanName)) {
            errs.name = 'Please provide a valid name (2-80 characters).';
        }

        if (!isValidEmail(cleanEmail)) {
            errs.email = 'Please provide a valid email address.';
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
            setStatus({
                type: 'success',
                text: '// TRANSMISSION DISPATCHED.',
                mailtoFallback: null
            });
            setTimeout(() => {
                setName('');
                setEmail('');
                setMessage('');
                onClose();
            }, 1200);
            return;
        }

        // 2. Client-side Validation
        if (!validateForm()) {
            setStatus({
                type: 'error',
                text: 'Please correct the highlighted fields before sending.',
                mailtoFallback: null
            });
            return;
        }

        // 3. Rate Limit Check
        const rateCheck = checkRateLimit('signbridge_modal_cooldown', 20);
        if (!rateCheck.allowed) {
            setStatus({
                type: 'error',
                text: `Rate limit: Please wait ${rateCheck.remainingSeconds}s before transmitting again.`,
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
            text: '// TRANSMITTING TELEMETRY TO SIGNBRIDGE CORE...',
            mailtoFallback: null
        });

        let isSuccess = false;
        let errorMessage = '';

        try {
            const supabase = await getSupabase();
            const insertPromise = supabase.from('contact_messages').insert({
                name: sanitizedName,
                email: sanitizedEmail,
                project: 'Modal Transmission',
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
            console.error('Modal submission error:', err);
            errorMessage = err.message || 'Direct database uplink could not be completed.';
        }

        setLoading(false);

        if (isSuccess) {
            recordSubmission('signbridge_modal_cooldown');
            setStatus({
                type: 'success',
                text: '// DISPATCH SUCCESSFUL: CONNECTION PROTOCOL INITIALIZED.',
                mailtoFallback: null
            });

            if (onNotification) {
                onNotification('// TRANSMISSION CONFIRMED: OUR TEAM WILL CONNECT SHORTLY.');
            }

            setTimeout(() => {
                setName('');
                setEmail('');
                setMessage('');
                setErrors({});
                onClose();
            }, 1600);
        } else {
            saveOfflineInquiry({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMsg,
                source: 'ContactModal'
            });

            const fallbackMailto = generateDirectMailto({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMsg,
                subject: 'Project Transmission via Direct Modal Uplink'
            });

            setStatus({
                type: 'error',
                text: `// UPLINK WARNING: ${errorMessage} Message cached locally.`,
                mailtoFallback: fallbackMailto
            });
        }
    };

    return (
        <div
            className={`modal-backdrop ${isOpen ? 'open' : ''}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`glass-modal ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
            >
                <div className="modal-header">
                    <div className="modal-header-left">
                        <span className="badge-dot" style={{ backgroundColor: 'var(--accent-lime)', boxShadow: '0 0 10px var(--accent-lime)' }} aria-hidden="true" />
                        <h2 id="contact-modal-title" className="modal-title">
                            START A PROJECT // TRANSMISSION
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-close-btn"
                        aria-label="Close Contact dialog"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="contact-form" noValidate>
                        {/* Hidden Bot Honeypot */}
                        <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                            <label htmlFor="hp_modal_url">Leave this empty</label>
                            <input
                                type="text"
                                id="hp_modal_url"
                                name="hp_modal_url"
                                tabIndex="-1"
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        {/* Name Field */}
                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="modal-name">NAME / IDENTITY</label>
                                {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                            </div>
                            <input
                                type="text"
                                id="modal-name"
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
                                <label htmlFor="modal-email">COMMUNICATION UPLINK / EMAIL</label>
                                {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
                            </div>
                            <input
                                type="email"
                                id="modal-email"
                                name="email"
                                required
                                maxLength={100}
                                placeholder="you@company.com"
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

                        {/* Message Brief Field (Unwanted 'Project / Domain Focus' text box cleanly eliminated) */}
                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="modal-message">TRANSMISSION PAYLOAD / BRIEF</label>
                                <div className="flex items-center gap-2">
                                    {errors.message && <span className="text-xs text-rose-500">{errors.message}</span>}
                                    <span className="text-xs text-slate-400 font-mono">
                                        {message.length}/2000
                                    </span>
                                </div>
                            </div>
                            <textarea
                                id="modal-message"
                                name="message"
                                required
                                rows={4}
                                maxLength={2000}
                                placeholder="Tell us what you are building, automating, or scaling..."
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
                                }}
                                className={`form-control ${errors.message ? 'border-rose-500' : ''}`}
                                disabled={loading}
                            />
                        </div>

                        {/* Status Feedback */}
                        {status.text && (
                            <div
                                className={`form-status p-3 rounded-lg text-xs font-mono flex items-start gap-2.5 ${status.type === 'error'
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
                                                <span>Send directly via email client</span>
                                                <ArrowUpRight size={13} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Security Assurance Tag */}
                        <div className="flex items-center gap-2 text-[11px] text-zinc-600 py-1 font-mono">
                            <ShieldCheck size={14} />
                            <span>Encrypted transmission · Anti-spam protected</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            id="modal-submit-btn"
                            disabled={loading}
                            className="btn-primary-lime"
                            style={{ width: '100%', marginTop: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            <span>{loading ? 'TRANSMITTING...' : 'DISPATCH TRANSMISSION'}</span>
                            <Send size={16} aria-hidden="true" className={loading ? 'animate-pulse' : ''} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
