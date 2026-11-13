import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, AlertCircle, CheckCircle2, RotateCw, ArrowUpRight } from 'lucide-react';
import { getSupabase } from '../../lib/supabase.js';
import {
    sanitizeInput,
    isValidEmail,
    isValidName,
    isValidMessage,
    checkRateLimit,
    recordSubmission,
    saveOfflineInquiry,
    generateDirectMailto
} from '../../lib/formSecurity.js';

export default function ProductEnquiryForm({ productName, onNotification }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '', mailtoFallback: null });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setStatus({ type: '', text: '', mailtoFallback: null });
        setErrors({});
    }, [productName]);

    const validateForm = () => {
        const errs = {};
        if (!isValidName(sanitizeInput(name))) {
            errs.name = 'Please enter a valid name (2-80 characters).';
        }
        if (!isValidEmail(sanitizeInput(email))) {
            errs.email = 'Please enter a valid email address.';
        }
        if (!isValidMessage(sanitizeInput(message))) {
            errs.message = 'Please enter brief details about your enquiry (min 5 characters).';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (honeypot) {
            setStatus({
                type: 'success',
                text: '// ENQUIRY LOGGED — SIGNBRIDGE TEAM WILL CONNECT SHORTLY.',
                mailtoFallback: null
            });
            setName('');
            setEmail('');
            setOrganization('');
            setMessage('');
            return;
        }

        if (!validateForm()) {
            setStatus({
                type: 'error',
                text: 'Please correct the highlighted fields before submitting.',
                mailtoFallback: null
            });
            return;
        }

        const rateCheck = checkRateLimit('signbridge_product_detail_cooldown', 20);
        if (!rateCheck.allowed) {
            setStatus({
                type: 'error',
                text: `Please wait ${rateCheck.remainingSeconds}s before submitting another enquiry.`,
                mailtoFallback: null
            });
            return;
        }

        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanOrg = sanitizeInput(organization);
        const cleanMsg = sanitizeInput(message);
        const fullMessage = cleanOrg
            ? `[Organization/Role: ${cleanOrg}]\n${cleanMsg}`
            : cleanMsg;

        setLoading(true);
        setStatus({
            type: 'loading',
            text: `// DISPATCHING ${productName.toUpperCase()} ENQUIRY...`,
            mailtoFallback: null
        });

        let isSuccess = false;
        let errorMessage = '';

        try {
            const supabase = await getSupabase();
            const insertPromise = supabase.from('contact_messages').insert({
                name: cleanName,
                email: cleanEmail,
                project: `Product Enquiry: ${productName}`,
                message: fullMessage
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Network gateway timeout')), 8000)
            );

            const result = await Promise.race([insertPromise, timeoutPromise]);
            if (result.error) throw result.error;
            isSuccess = true;
        } catch (err) {
            errorMessage = err.message || 'Direct server uplink could not be completed.';
        }

        setLoading(false);

        if (isSuccess) {
            recordSubmission('signbridge_product_detail_cooldown');
            setStatus({
                type: 'success',
                text: `// ENQUIRY CONFIRMED: Your request regarding ${productName} has been sent. We will respond within 24 hours.`,
                mailtoFallback: null
            });
            if (onNotification) {
                onNotification(`// ${productName.toUpperCase()} ENQUIRY DISPATCHED.`);
            }
            setName('');
            setEmail('');
            setOrganization('');
            setMessage('');
            setErrors({});
        } else {
            saveOfflineInquiry({
                name: cleanName,
                email: cleanEmail,
                product: productName,
                message: fullMessage,
                source: 'ProductDetailPage'
            });

            const fallbackMailto = generateDirectMailto({
                name: cleanName,
                email: cleanEmail,
                message: fullMessage,
                subject: `${productName} Enquiry`
            });

            setStatus({
                type: 'error',
                text: `// UPLINK WARNING: ${errorMessage} Your enquiry was saved locally.`,
                mailtoFallback: fallbackMailto
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="hp_prod_detail">Leave empty</label>
                <input
                    type="text"
                    id="hp_prod_detail"
                    name="hp_prod_detail"
                    tabIndex="-1"
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />
            </div>

            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="pd-name">YOUR NAME</label>
                    {errors.name && <span className="text-xs text-rose-600">{errors.name}</span>}
                </div>
                <input
                    id="pd-name"
                    type="text"
                    required
                    maxLength={80}
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: null }));
                    }}
                    className={`form-control ${errors.name ? 'border-rose-500' : ''}`}
                    disabled={loading}
                    autoComplete="name"
                />
            </div>

            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="pd-email">EMAIL ADDRESS</label>
                    {errors.email && <span className="text-xs text-rose-600">{errors.email}</span>}
                </div>
                <input
                    id="pd-email"
                    type="email"
                    required
                    maxLength={100}
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: null }));
                    }}
                    className={`form-control ${errors.email ? 'border-rose-500' : ''}`}
                    disabled={loading}
                    autoComplete="email"
                />
            </div>

            <div className="form-group">
                <label htmlFor="pd-org">ORGANIZATION / ROLE (OPTIONAL)</label>
                <input
                    id="pd-org"
                    type="text"
                    maxLength={100}
                    placeholder="Company, institution, or student / developer role"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="form-control"
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <div className="flex justify-between items-center">
                    <label htmlFor="pd-message">ENQUIRY DETAILS</label>
                    {errors.message && <span className="text-xs text-rose-600">{errors.message}</span>}
                </div>
                <textarea
                    id="pd-message"
                    rows={4}
                    required
                    maxLength={2000}
                    placeholder={`Tell us about your requirements for ${productName}...`}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((p) => ({ ...p, message: null }));
                    }}
                    className={`form-control ${errors.message ? 'border-rose-500' : ''}`}
                    disabled={loading}
                />
            </div>

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

            <div className="flex items-center gap-2 text-[11px] text-zinc-600 font-mono">
                <ShieldCheck size={14} />
                <span>Encrypted transmission · Direct SignBridge studio response</span>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary-lime"
                style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                <span>{loading ? 'DISPATCHING...' : `ENQUIRE ABOUT ${productName.toUpperCase()}`}</span>
                <Send size={15} aria-hidden="true" />
            </button>
        </form>
    );
}
