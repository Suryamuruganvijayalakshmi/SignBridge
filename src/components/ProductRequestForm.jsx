import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, AlertCircle, CheckCircle2, RotateCw, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

export default function ProductRequestForm({ defaultRequestType = 'Buy' }) {
    const [requestType, setRequestType] = useState(defaultRequestType);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '', mailtoFallback: null });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setRequestType(defaultRequestType);
    }, [defaultRequestType]);

    const validateForm = () => {
        const errs = {};
        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);

        if (!isValidName(cleanName)) {
            errs.name = 'Please enter your name (2-80 characters).';
        }

        if (!isValidEmail(cleanEmail)) {
            errs.email = 'Please enter a valid email address.';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (honeypot) {
            setStatus({
                type: 'success',
                text: 'Request received. We will be in touch shortly.',
                mailtoFallback: null
            });
            setName('');
            setEmail('');
            setMessage('');
            return;
        }

        if (!validateForm()) {
            setStatus({
                type: 'error',
                text: 'Please check your name and email before submitting.',
                mailtoFallback: null
            });
            return;
        }

        const rateCheck = checkRateLimit('signbridge_product_cooldown', 20);
        if (!rateCheck.allowed) {
            setStatus({
                type: 'error',
                text: `Rate limit: Please wait ${rateCheck.remainingSeconds}s before sending another request.`,
                mailtoFallback: null
            });
            return;
        }

        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanMsg = sanitizeInput(message) || `Smart Table request (${requestType})`;

        setSubmitting(true);
        setStatus({
            type: 'loading',
            text: 'Transmitting order telemetry to SignBridge Core...',
            mailtoFallback: null
        });

        let isSuccess = false;
        let errorMessage = '';

        try {
            const insertPromise = supabase.from('contact_messages').insert({
                name: cleanName,
                email: cleanEmail,
                project: `Smart Table: ${requestType}`,
                message: cleanMsg
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Network gateway timeout')), 8000)
            );

            const result = await Promise.race([insertPromise, timeoutPromise]);

            if (result.error) {
                throw result.error;
            }

            isSuccess = true;
        } catch (err) {
            console.error('Smart Table request failed:', err);
            errorMessage = err.message || 'Transmission could not reach the server.';
        }

        setSubmitting(false);

        if (isSuccess) {
            recordSubmission('signbridge_product_cooldown');
            setStatus({
                type: 'success',
                text: 'Request successfully confirmed! Our team will dispatch order details within 24 hours.',
                mailtoFallback: null
            });
            setName('');
            setEmail('');
            setMessage('');
            setErrors({});
        } else {
            saveOfflineInquiry({
                name: cleanName,
                email: cleanEmail,
                requestType,
                message: cleanMsg,
                source: 'ProductRequestForm'
            });

            const fallbackMailto = generateDirectMailto({
                name: cleanName,
                email: cleanEmail,
                message: cleanMsg,
                subject: `Smart Table Order Request (${requestType})`
            });

            setStatus({
                type: 'error',
                text: `Notice: ${errorMessage} Your request was saved locally.`,
                mailtoFallback: fallbackMailto
            });
        }
    };

    return (
        <form className="contact-form product-request-form" onSubmit={handleSubmit} noValidate>
            {/* Hidden Bot Honeypot */}
            <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="hp_product_url">Leave empty</label>
                <input
                    type="text"
                    id="hp_product_url"
                    name="hp_product_url"
                    tabIndex="-1"
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="prod-request-type">REQUEST TYPE</label>
                <select
                    id="prod-request-type"
                    name="request_type"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="form-control"
                    disabled={submitting}
                >
                    <option value="Buy">Buy Starter Kit ($5 one-time)</option>
                    <option value="Demo">Book a 5-Minute Virtual Demo</option>
                    <option value="Custom">Custom Hospitality Enterprise Order</option>
                </select>
            </div>

            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="prod-name">NAME / RESTAURANT</label>
                    {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                </div>
                <input
                    type="text"
                    id="prod-name"
                    name="name"
                    required
                    maxLength={80}
                    placeholder="Your name or restaurant name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                    }}
                    className={`form-control ${errors.name ? 'border-rose-500' : ''}`}
                    disabled={submitting}
                    autoComplete="name"
                />
            </div>

            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="prod-email">COMMUNICATION UPLINK / EMAIL</label>
                    {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
                </div>
                <input
                    type="email"
                    id="prod-email"
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
                    disabled={submitting}
                    autoComplete="email"
                />
            </div>

            {/* Note / Requirements (unwanted phone and company fields removed) */}
            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="prod-notes">REQUIREMENTS / DELIVERY NOTES (OPTIONAL)</label>
                    <span className="text-xs text-slate-400 font-mono">{message.length}/1000</span>
                </div>
                <textarea
                    id="prod-notes"
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder="Number of tables, location, custom branding needs, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control"
                    disabled={submitting}
                />
            </div>

            {/* Status Feedback Alert */}
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
                                    <span>Send directly via email client</span>
                                    <ArrowUpRight size={13} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <ShieldCheck size={14} className="text-lime" />
                <span>Zero app required · Instant cloud sync · Secure dispatch</span>
            </div>

            <button
                type="submit"
                id="product-submit-btn"
                disabled={submitting}
                className="btn-primary-lime"
                style={{ width: '100%', marginTop: '0.5rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
                <span>{submitting ? 'SENDING TELEMETRY...' : 'SUBMIT PRODUCT REQUEST'}</span>
                <Send size={16} className={submitting ? 'animate-pulse' : ''} />
            </button>
        </form>
    );
}
