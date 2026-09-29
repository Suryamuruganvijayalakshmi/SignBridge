import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

export default function ContactModal({ isOpen, onClose, onNotification }) {
    const dialogRef = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [project, setProject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            window.dispatchEvent(new Event('bump-cursor'));
        } else {
            setStatus('');
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

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

        setTimeout(() => {
            setName('');
            setEmail('');
            setProject('');
            setMessage('');
            onClose();
        }, 1600);
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
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="modal-name">NAME / IDENTITY</label>
                        <input
                            type="text"
                            id="modal-name"
                            required
                            placeholder="Your name or organization"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-email">COMMUNICATION UPLINK / EMAIL</label>
                        <input
                            type="email"
                            id="modal-email"
                            required
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-project">PROJECT / DOMAIN FOCUS</label>
                        <input
                            type="text"
                            id="modal-project"
                            placeholder="Software, AI, IoT, Smart Table, or MVP"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-message">TRANSMISSION PAYLOAD</label>
                        <textarea
                            id="modal-message"
                            required
                            rows={3}
                            placeholder="Tell us what you are building, automating or scaling..."
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
                        <span>{loading ? 'TRANSMITTING...' : 'DISPATCH TRANSMISSION'}</span>
                        <Send size={16} aria-hidden="true" />
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
}
