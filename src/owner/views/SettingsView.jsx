import React, { useState, useEffect } from 'react';
import { Settings, Shield, Lock, Save, CheckCircle2, MessageSquare, Mail, Truck, Loader2 } from 'lucide-react';
import { useOwnerAuth } from '../OwnerAuthContext.jsx';

export default function SettingsView() {
    const { user, authFetch } = useOwnerAuth();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdSuccess, setPwdSuccess] = useState('');
    const [pwdError, setPwdError] = useState('');

    // System settings
    const [settings, setSettings] = useState({
        whatsapp_provider: 'Meta WhatsApp Business Cloud API',
        whatsapp_phone_number_id: '109283746192837',
        whatsapp_status: 'connected',
        email_provider: 'Resend / Cloudflare Mail',
        email_status: 'active',
        auto_notify_customer: true,
        courier_partner: 'Blue Dart / Delhivery',
    });
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState('');

    useEffect(() => {
        authFetch('/api/owner/settings')
            .then((res) => res.json())
            .then((data) => {
                if (data.settings) setSettings(data.settings);
            })
            .catch(() => {});
    }, [authFetch]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwdError('');
        setPwdSuccess('');

        if (newPassword !== confirmPassword) {
            setPwdError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setPwdError('New password must be at least 8 characters');
            return;
        }

        setPwdLoading(true);
        try {
            const res = await authFetch('/api/owner/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to update password');
            }
            setPwdSuccess('Owner password successfully updated!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPwdError(err.message);
        } finally {
            setPwdLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        setSettingsSuccess('');
        try {
            const res = await authFetch('/api/owner/settings', {
                method: 'POST',
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                setSettingsSuccess('System settings saved successfully!');
                setTimeout(() => setSettingsSuccess(''), 3000);
            }
        } catch (err) {
            alert(err.message || 'Failed to save settings');
        } finally {
            setSavingSettings(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            
            {/* 1. Owner Profile Card */}
            <div className="owner-table-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--owner-border)', paddingBottom: '16px' }}>
                    <div className="owner-avatar" style={{ width: '44px', height: '44px', fontSize: '18px' }}>
                        <Shield size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{user?.name || 'SignBridge Owner'}</div>
                        <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                            Authorized Administrator · {user?.email}
                        </span>
                    </div>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordChange} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                        Change Owner Password
                    </div>

                    {pwdError && (
                        <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '7px', color: '#b91c1c', fontSize: '12px' }}>
                            {pwdError}
                        </div>
                    )}
                    {pwdSuccess && (
                        <div style={{ padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '7px', color: '#047857', fontSize: '12px' }}>
                            {pwdSuccess}
                        </div>
                    )}

                    <div className="owner-field-group">
                        <label className="owner-label">Current Password</label>
                        <input
                            type="password"
                            className="owner-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="owner-field-group">
                            <label className="owner-label">New Password</label>
                            <input
                                type="password"
                                className="owner-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                required
                            />
                        </div>
                        <div className="owner-field-group">
                            <label className="owner-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="owner-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={pwdLoading}
                        className="owner-btn-primary"
                        style={{ width: 'fit-content', padding: '9px 18px', marginTop: '6px' }}
                    >
                        {pwdLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                        <span>Update Password</span>
                    </button>
                </form>
            </div>

            {/* 2. Automated Integrations & Shipping Preferences */}
            <form onSubmit={handleSaveSettings} className="owner-table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--owner-border)', paddingBottom: '14px' }}>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Dispatch &amp; Automation Preferences</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Configure WhatsApp notifications, email dispatch, and default courier
                        </span>
                    </div>
                    {settingsSuccess && (
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{settingsSuccess}</span>
                    )}
                </div>

                <div className="owner-field-group">
                    <label className="owner-label">Primary Courier Dispatch Partner</label>
                    <input
                        type="text"
                        className="owner-input"
                        value={settings.courier_partner || 'Blue Dart Express / Delhivery'}
                        onChange={(e) => setSettings({ ...settings, courier_partner: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <input
                        type="checkbox"
                        id="auto-notify"
                        checked={settings.auto_notify_customer || false}
                        onChange={(e) => setSettings({ ...settings, auto_notify_customer: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="auto-notify" style={{ fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                        Automatically dispatch WhatsApp and Email notifications on order confirmation and dispatch
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={savingSettings}
                    className="owner-btn-primary"
                    style={{ width: 'fit-content', padding: '9px 18px', marginTop: '10px' }}
                >
                    <Save size={15} />
                    <span>{savingSettings ? 'Saving...' : 'Save Preferences'}</span>
                </button>
            </form>
        </div>
    );
}
