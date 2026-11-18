import React, { useState } from 'react';
import {
    X,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    RotateCw,
    XCircle,
    User,
    Mail,
    Phone,
    MapPin,
    Copy,
    Check,
    Send,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { useOwnerAuth } from '../OwnerAuthContext.jsx';

const COURIER_PARTNERS = [
    'Blue Dart Express',
    'Delhivery Surface',
    'DTDC Courier',
    'Speed Post / India Post',
    'Shadowfax',
    'Xpressbees',
    'Ekart Logistics',
    'Other / Hand Delivery'
];

export default function OrderDetailsModal({ order, isOpen, onClose, onOrderUpdated }) {
    const { authFetch } = useOwnerAuth();
    const [updating, setUpdating] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    // Form fields for shipping
    const [courier, setCourier] = useState(order?.shipping?.courier || COURIER_PARTNERS[0]);
    const [trackingId, setTrackingId] = useState(order?.shipping?.tracking_id || '');
    const [trackingUrl, setTrackingUrl] = useState(order?.shipping?.tracking_url || '');

    // Note form
    const [newNote, setNewNote] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    // Notification form
    const [notifSending, setNotifSending] = useState(false);
    const [notifSuccess, setNotifSuccess] = useState('');

    if (!isOpen || !order) return null;

    const handleCopy = (text, key) => {
        navigator.clipboard?.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Update Status Action
    const handleStatusChange = async (newStatus, noteText = '') => {
        setUpdating(true);
        try {
            const res = await authFetch(`/api/owner/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus, note: noteText }),
            });
            const data = await res.json();
            if (data.order) {
                onOrderUpdated(data.order);
            }
        } catch (err) {
            alert(err.message || 'Status update failed');
        } finally {
            setUpdating(false);
        }
    };

    // Save Shipping Information
    const handleSaveShipping = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const autoUrl = trackingUrl || (trackingId ? `https://www.trackcourier.in/track/${trackingId}` : '');
            const res = await authFetch(`/api/owner/orders/${order.id}/shipping`, {
                method: 'PATCH',
                body: JSON.stringify({ courier, tracking_id: trackingId, tracking_url: autoUrl }),
            });
            const data = await res.json();
            if (data.order) {
                onOrderUpdated(data.order);
                alert('Shipping details saved successfully!');
            }
        } catch (err) {
            alert(err.message || 'Failed to update shipping');
        } finally {
            setUpdating(false);
        }
    };

    // Add Internal Note
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setAddingNote(true);
        try {
            const res = await authFetch(`/api/owner/orders/${order.id}/notes`, {
                method: 'POST',
                body: JSON.stringify({ text: newNote.trim() }),
            });
            const data = await res.json();
            if (data.note) {
                const updatedOrder = {
                    ...order,
                    internal_notes: [...(order.internal_notes || []), data.note],
                };
                onOrderUpdated(updatedOrder);
                setNewNote('');
            }
        } catch (err) {
            alert(err.message || 'Failed to add note');
        } finally {
            setAddingNote(false);
        }
    };

    // Trigger Automated Customer Notification
    const handleSendNotification = async (channel, type) => {
        setNotifSending(true);
        setNotifSuccess('');
        try {
            const res = await authFetch(`/api/owner/orders/${order.id}/notify`, {
                method: 'POST',
                body: JSON.stringify({ channel, type }),
            });
            const data = await res.json();
            if (data.notification) {
                const updatedOrder = {
                    ...order,
                    notifications_log: [data.notification, ...(order.notifications_log || [])],
                };
                onOrderUpdated(updatedOrder);
                setNotifSuccess(`Notification dispatched via ${channel.toUpperCase()}!`);
                setTimeout(() => setNotifSuccess(''), 3000);
            }
        } catch (err) {
            alert(err.message || 'Failed to dispatch notification');
        } finally {
            setNotifSending(false);
        }
    };

    return (
        <div className="owner-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="owner-modal-card" style={{ maxWidth: '780px' }}>
                
                {/* Modal Header */}
                <div className="owner-modal-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="owner-modal-title">
                                Order #{order.order_number || order.id.slice(-6)}
                            </span>
                            <span className={`owner-badge ${order.order_status}`}>
                                {order.order_status}
                            </span>
                            <span className={`owner-badge ${order.payment_status}`}>
                                {order.payment_status}
                            </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Placed on {new Date(order.created_at).toLocaleString('en-IN')}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="owner-modal-body">
                    
                    {/* 1. Quick Workflow Status Bar */}
                    <div style={{
                        padding: '14px 18px',
                        background: '#f8fafc',
                        border: '1px solid var(--owner-border)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Quick Status Actions:
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('confirmed', 'Owner verified order details')}
                                disabled={updating || order.order_status === 'confirmed'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('processing', 'Chip encoded and laser engraved')}
                                disabled={updating || order.order_status === 'processing'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                                Set Processing
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('packed', 'Order boxed with verification seal')}
                                disabled={updating || order.order_status === 'packed'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                                Mark Packed
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('shipped', `Dispatched via ${courier} tracking ${trackingId || 'N/A'}`)}
                                disabled={updating || order.order_status === 'shipped'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                            >
                                <Truck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Mark Shipped
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('delivered', 'Confirmed delivery to customer')}
                                disabled={updating || order.order_status === 'delivered'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}
                            >
                                <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Mark Delivered
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel and refund this order?')) {
                                        handleStatusChange('cancelled', 'Order cancelled and refund queued by owner');
                                    }
                                }}
                                disabled={updating || order.order_status === 'cancelled'}
                                className="owner-btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                            >
                                <XCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Cancel / Refund
                            </button>
                        </div>
                    </div>

                    {/* 2. Customer & Product Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Customer Box */}
                        <div style={{ padding: '14px', border: '1px solid var(--owner-border)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                <User size={13} />
                                <span>Customer Information</span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{order.customer?.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                                <Mail size={12} />
                                <span>{order.customer?.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                                <Phone size={12} />
                                <span>{order.customer?.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#475569', marginTop: '6px' }}>
                                <MapPin size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span>{order.customer?.address}, PIN: {order.customer?.pincode}</span>
                            </div>
                        </div>

                        {/* Product & Payment Box */}
                        <div style={{ padding: '14px', border: '1px solid var(--owner-border)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                <Package size={13} />
                                <span>Product &amp; Laser Inscription</span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>
                                {order.items?.[0]?.product_name || 'SignBridge NFC Smart Card'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                                {order.items?.[0]?.package_label || 'Single Card'} (Quantity: {order.items?.[0]?.quantity || 1})
                            </div>
                            <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                                <strong>Laser Name:</strong> "{order.items?.[0]?.laser_engraved_name || order.customer?.name}"
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginTop: '8px' }}>
                                Total Paid: ₹{Number(order.amount).toFixed(2)} INR
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontFamily: 'var(--owner-font-mono)' }}>
                                RZP Payment ID: {order.razorpay_payment_id || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* 3. Shipping & Tracking Details Form */}
                    <form onSubmit={handleSaveShipping} style={{ padding: '16px', background: '#ffffff', border: '1px solid var(--owner-border)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                                <Truck size={14} />
                                <span>Shipping &amp; Courier Dispatch</span>
                            </div>
                            <button
                                type="submit"
                                disabled={updating}
                                className="owner-btn-primary"
                                style={{ width: 'auto', padding: '6px 14px', fontSize: '12px' }}
                            >
                                Save Courier Info
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="owner-field-group">
                                <label className="owner-label">Courier Partner</label>
                                <select
                                    className="owner-input"
                                    value={courier}
                                    onChange={(e) => setCourier(e.target.value)}
                                >
                                    {COURIER_PARTNERS.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="owner-field-group">
                                <label className="owner-label">Tracking Number / AWB</label>
                                <input
                                    type="text"
                                    className="owner-input"
                                    placeholder="e.g. BD982741920IN"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="owner-field-group">
                            <label className="owner-label">Direct Courier Tracking URL</label>
                            <input
                                type="url"
                                className="owner-input"
                                placeholder="https://www.trackcourier.in/track/..."
                                value={trackingUrl}
                                onChange={(e) => setTrackingUrl(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* 4. Automated Customer Notification Dispatcher */}
                    <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid var(--owner-border)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                                Trigger Customer Notifications
                            </span>
                            {notifSuccess && (
                                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>{notifSuccess}</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => handleSendNotification('whatsapp', 'shipped')}
                                disabled={notifSending}
                                className="owner-btn-secondary"
                                style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Send size={11} color="#059669" />
                                <span>Send WhatsApp Dispatch Update</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSendNotification('email', 'tracking')}
                                disabled={notifSending}
                                className="owner-btn-secondary"
                                style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Mail size={11} color="#2563eb" />
                                <span>Send Email Tracking Link</span>
                            </button>
                        </div>
                    </div>

                    {/* 5. Complete Order Status History / Audit Trail */}
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Order Status History &amp; Audit Trail
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(order.status_history || []).map((hist, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    padding: '8px 12px',
                                    background: '#f8fafc',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '7px',
                                    fontSize: '12px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className={`owner-badge ${hist.status}`} style={{ fontSize: '10px' }}>
                                            {hist.status}
                                        </span>
                                        <span>{hist.note}</span>
                                    </div>
                                    <span style={{ color: '#94a3b8', fontSize: '10.5px' }}>
                                        {new Date(hist.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {hist.actor}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 6. Internal Owner Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                            Internal Notes (Owner Only)
                        </div>
                        {(order.internal_notes || []).map((note) => (
                            <div key={note.id} style={{ padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '7px', fontSize: '12px', color: '#92400e' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                    <span>{note.author}</span>
                                    <span style={{ fontSize: '10px', color: '#b45309' }}>
                                        {new Date(note.created_at).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div style={{ marginTop: '3px' }}>{note.text}</div>
                            </div>
                        ))}

                        <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className="owner-input"
                                placeholder="Add private note for this order..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={addingNote || !newNote.trim()}
                                className="owner-btn-secondary"
                                style={{ flexShrink: 0 }}
                            >
                                {addingNote ? <Loader2 size={13} className="animate-spin" /> : 'Add Note'}
                            </button>
                        </form>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="owner-modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="owner-btn-secondary"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
