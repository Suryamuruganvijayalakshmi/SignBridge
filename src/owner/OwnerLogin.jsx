import React, { useState } from 'react';
import { Lock, UserCheck, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useOwnerAuth } from './OwnerAuthContext.jsx';
import StillSunsetMeadow from '../components/originkit/ui/hero-64/still-sunset-meadow';

export default function OwnerLogin({ onForgotPassword }) {
    const { login } = useOwnerAuth();
    const [ownerId, setOwnerId] = useState('177330');
    const [password, setPassword] = useState('177330');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!ownerId.trim() || !password.trim()) {
            setError('Please enter your Owner ID and Password.');
            return;
        }

        setLoading(true);
        try {
            await login(ownerId.trim(), password.trim());
        } catch (err) {
            setError(err.message || 'Invalid Owner ID or Password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="owner-login-viewport">
            {/* Hero 64 Interactive 3D Meadow Flowers Effect */}
            <div className="owner-login-scene" aria-hidden="true">
                <StillSunsetMeadow
                    sky={{ top: "#FFFFFF", horizon: "#F8B9A4", glow: "#FFD9A8" }}
                    haze={4}
                    speed={20}
                    hover={20}
                    cloudSpeed={6}
                />
                <div className="owner-login-scene-fade" />
            </div>

            <div className="owner-login-card">

                {/* Header */}
                <div className="owner-login-header">
                    <img
                        src="/signbridge-emblem.webp"
                        alt="SignBridge Logo"
                        className="owner-login-logo"
                    />
                    <div>
                        <h1 className="owner-login-title">SignBridge Owner Portal</h1>
                        <p className="owner-login-subtitle">Private Order &amp; Fulfillment Management System</p>
                    </div>
                    <div className="owner-login-badge">
                        <Lock size={11} />
                        <span>Owner Restricted Area</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="owner-login-form">
                    {error && (
                        <div style={{
                            padding: '10px 14px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            color: '#b91c1c',
                            fontSize: '12.5px',
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="owner-field-group">
                        <label className="owner-label" htmlFor="owner-id">
                            Owner ID
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="owner-id"
                                type="text"
                                className="owner-input"
                                value={ownerId}
                                onChange={(e) => setOwnerId(e.target.value)}
                                placeholder="177330"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="owner-field-group">
                        <div className="owner-label">
                            <label htmlFor="owner-password">Password</label>
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '11.5px',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="owner-password"
                                type={showPassword ? 'text' : 'password'}
                                className="owner-input"
                                style={{ paddingRight: '40px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="owner-btn-primary"
                        style={{ marginTop: '8px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Verifying Owner Credentials...</span>
                            </>
                        ) : (
                            <>
                                <Lock size={15} />
                                <span>Access Owner Dashboard</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Security Footer */}
                <div className="owner-security-note">
                    <ShieldCheck size={14} color="#059669" />
                    <span>Owner ID Authentication · 256-Bit SSL Encrypted</span>
                </div>
            </div>
        </div>
    );
}
