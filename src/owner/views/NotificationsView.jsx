import React, { useState, useEffect } from 'react';
import { Bell, Send, Mail, CheckCircle2, RefreshCw, MessageSquare, ExternalLink } from 'lucide-react';
import { useOwnerAuth } from '../OwnerAuthContext.jsx';

export default function NotificationsView() {
    const { authFetch } = useOwnerAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = () => {
        setLoading(true);
        authFetch('/api/owner/notifications')
            .then((res) => res.json())
            .then((data) => {
                if (data.notifications) setNotifications(data.notifications);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Notification Integrations Overview */}
            <div style={{
                background: '#ffffff',
                border: '1px solid var(--owner-border)',
                borderRadius: '14px',
                padding: '22px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
            }}>
                <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '14px' }}>Meta WhatsApp Business Cloud API</span>
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Authorized WhatsApp Business Account</span>
                            </div>
                        </div>
                        <span className="owner-badge paid">CONNECTED</span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                        Automated WhatsApp messages sent for order placement, payment verification, and live courier tracking links.
                    </div>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={16} />
                            </div>
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '14px' }}>Email Notification Gateway</span>
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Resend / Cloudflare Mail</span>
                            </div>
                        </div>
                        <span className="owner-badge paid">ACTIVE</span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                        Official tax invoices, order receipts, and digital NFC profile instructions emailed automatically.
                    </div>
                </div>
            </div>

            {/* Live Notification Delivery Logs */}
            <div className="owner-table-card">
                <div className="owner-table-toolbar">
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Customer Notification Delivery Logs</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Real-time audit log of all automated customer communications
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={loadNotifications}
                        className="owner-btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh Logs</span>
                    </button>
                </div>

                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Channel</th>
                                <th>Trigger Event</th>
                                <th>Order #</th>
                                <th>Customer Recipient</th>
                                <th>Delivery Status</th>
                                <th>Message Content</th>
                                <th>Dispatched At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                                        No customer notification logs found.
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: notif.channel === 'whatsapp' ? '#047857' : '#1d4ed8',
                                                background: notif.channel === 'whatsapp' ? '#ecfdf5' : '#eff6ff',
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                textTransform: 'uppercase',
                                                fontFamily: 'var(--owner-font-mono)'
                                            }}>
                                                {notif.channel === 'whatsapp' ? <MessageSquare size={11} /> : <Mail size={11} />}
                                                {notif.channel}
                                            </span>
                                        </td>
                                        <td>
                                            <strong style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                                                {notif.type?.replace(/_/g, ' ')}
                                            </strong>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'var(--owner-font-mono)', fontWeight: 700 }}>
                                                #{notif.order_number || '1001'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{notif.customer_name || 'Customer'}</span>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>{notif.recipient}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="owner-badge paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <CheckCircle2 size={11} />
                                                <span>Delivered</span>
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '12px', color: '#334155', maxWidth: '300px' }}>
                                            {notif.message_preview}
                                        </td>
                                        <td style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                            {new Date(notif.sent_at).toLocaleString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--owner-border)', fontSize: '12px', color: '#64748b', background: '#fafbfc' }}>
                    Total Notifications Dispatched: <strong>{notifications.length}</strong>
                </div>
            </div>
        </div>
    );
}
