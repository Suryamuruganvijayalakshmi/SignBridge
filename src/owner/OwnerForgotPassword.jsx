import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function OwnerForgotPassword({ isOpen, onClose }) {
    const [email, setEmail] = useState('connect.pilotsurya@gmail.com');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/owner/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            setSuccessMessage(data.message || 'Password reset link sent to your registered inbox.');
        } catch {
            setSuccessMessage('Password recovery request registered. Please check authorized email inbox.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="owner-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="owner-modal-card" style={{ maxWidth: '440px' }}>
                <div className="owner-modal-header">
                    <span className="owner-modal-title">Reset Owner Password</span>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="owner-modal-body">
                    {successMessage ? (
                        <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={28} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Recovery Protocol Dispatched</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                {successMessage}
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="owner-btn-primary"
                                style={{ marginTop: '10px' }}
                            >
                                Return to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                Enter the registered SignBridge Owner email address. A one-time verification token and instructions will be sent.
                            </p>

                            <div className="owner-field-group">
                                <label className="owner-label" htmlFor="forgot-email">Owner Email</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    className="owner-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="owner-btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Dispatching Reset Link...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Password Reset Link</span>
                                        <ArrowRight size={15} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

