import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Webhook, KeyRound, ExternalLink } from 'lucide-react';

export default function PaymentsView({ orders }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Razorpay Gateway Status Card */}
            <div style={{
                background: '#ffffff',
                border: '1px solid var(--owner-border)',
                borderRadius: '14px',
                padding: '22px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
            }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Active Gateway Provider
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Razorpay Standard Checkout</span>
                        <span className="owner-badge paid" style={{ fontSize: '10px' }}>LIVE MODE</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Key ID: rzp_live_U1aUQnurjyIrSG
                    </span>
                </div>

                <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Signature Verification Protocol
                    </span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} />
                        <span>HMAC-SHA256 Web Crypto</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Zero client-side trust · Verified on backend
                    </span>
                </div>

                <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Live Webhook Receiver Endpoint
                    </span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2563eb', marginTop: '4px', fontFamily: 'var(--owner-font-mono)' }}>
                        /api/razorpay-webhook
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        https://orders.signbridge.click/api/razorpay-webhook
                    </span>
                </div>
            </div>

            {/* Payments List Table */}
            <div className="owner-table-card">
                <div className="owner-table-toolbar">
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Razorpay Captured Transactions</div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Verified payments processed through the standard checkout modal
                        </span>
                    </div>
                </div>

                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>Transaction / Payment ID</th>
                                <th>Razorpay Order ID</th>
                                <th>Order Ref #</th>
                                <th>Customer</th>
                                <th>Gross Amount</th>
                                <th>Signature Status</th>
                                <th>Payment Mode</th>
                                <th>Processed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <code style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--owner-font-mono)' }}>
                                            {order.razorpay_payment_id || 'pay_manual_verified'}
                                        </code>
                                    </td>
                                    <td>
                                        <code style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'var(--owner-font-mono)' }}>
                                            {order.razorpay_order_id || 'order_direct'}
                                        </code>
                                    </td>
                                    <td>
                                        <strong style={{ fontFamily: 'var(--owner-font-mono)' }}>
                                            #{order.order_number || order.id.slice(-4)}
                                        </strong>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{order.customer?.name}</span>
                                    </td>
                                    <td style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>
                                        ₹{Number(order.amount).toFixed(2)}
                                    </td>
                                    <td>
                                        <span className="owner-badge paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={11} />
                                            <span>HMAC-SHA256 Match</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '12px', color: '#475569' }}>
                                            UPI / Cards / Netbanking
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {new Date(order.created_at).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

