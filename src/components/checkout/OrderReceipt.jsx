import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Printer,
    Copy,
    Check,
    ShieldCheck,
    PackageCheck,
    Truck,
    Cpu,
    Clock,
    Sparkles,
    MapPin,
    Mail,
    Phone,
    User,
    ArrowRight
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../lib/celebrateConfetti.js';

export default function OrderReceipt({
    paymentData,
    customer,
    selectedPack,
    onClose,
}) {
    const [copiedKey, setCopiedKey] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // Blow colored paper confetti from bottom to top upon receipt display
        fireCelebrationConfetti();

        // Format clean date
        try {
            const now = new Date();
            setFormattedDate(
                now.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        } catch {
            setFormattedDate('Today');
        }
    }, []);

    const handleCopy = (text, key) => {
        if (!text) return;
        navigator.clipboard?.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2200);
    };

    const handlePrint = () => {
        window.print();
    };

    const orderId = paymentData?.orderId || `ORD_${Date.now()}`;
    const paymentId = paymentData?.paymentId || `PAY_${Date.now()}`;
    const unitPrice = selectedPack?.price ? selectedPack.price / (selectedPack.qty || 1) : 10;
    const grandTotal = selectedPack?.price || 10;

    return (
        <div className="receipt-view-wrapper">
            {/* Top Celebration Banner */}
            <div className="receipt-celebration-banner">
                <div className="receipt-celebration-badge">
                    <Sparkles size={14} className="receipt-sparkle-icon" />
                    <span>PAYMENT CONFIRMED · ORDER DISPATCH QUEUED</span>
                </div>
                <h3 className="receipt-celebration-title">Thank You For Your Order!</h3>
                <p className="receipt-celebration-sub">
                    Your <strong>SignBridge NFC Smart Card</strong> has been verified. A copy of this receipt and your NFC cloud portal access link have been dispatched to <strong>{customer.email}</strong>.
                </p>
                <button
                    type="button"
                    onClick={() => fireCelebrationConfetti()}
                    className="receipt-confetti-btn"
                    title="Blow more confetti!"
                >
                    🎉 Blow Confetti Again
                </button>
            </div>

            {/* Official Tax Invoice & Order Receipt Document */}
            <div className="receipt-document-card" id="signbridge-printable-receipt">
                
                {/* Official Receipt Header */}
                <div className="receipt-doc-header">
                    <div className="receipt-brand-col">
                        <div className="receipt-brand-row">
                            <img
                                src="/signbridge-emblem.webp"
                                alt="SignBridge Official Emblem"
                                className="receipt-brand-logo"
                                width="36"
                                height="22"
                            />
                            <div>
                                <h2 className="receipt-brand-name">
                                    SignBridge<sup>®</sup>
                                </h2>
                                <span className="receipt-brand-tagline">
                                    Hardware &amp; Embedded Identity Systems
                                </span>
                            </div>
                        </div>
                        <div className="receipt-company-meta">
                            <span>SignBridge Technologies India</span>
                            <span>Official Store · signbridge.click</span>
                            <span>Support: connect.pilotsurya@gmail.com</span>
                        </div>
                    </div>

                    <div className="receipt-type-col">
                        <div className="receipt-status-pill">
                            <CheckCircle2 size={13} />
                            <span>PAID &amp; VERIFIED</span>
                        </div>
                        <div className="receipt-doc-title">TAX INVOICE &amp; ORDER RECEIPT</div>
                        <div className="receipt-doc-number">
                            <span>INVOICE NO:</span>
                            <strong>{orderId}</strong>
                        </div>
                        <div className="receipt-doc-date">
                            <Clock size={11} />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                <div className="receipt-divider" />

                {/* Reference & Transaction IDs */}
                <div className="receipt-meta-grid">
                    <div className="receipt-meta-block">
                        <span className="receipt-meta-label">Razorpay Payment ID</span>
                        <div className="receipt-meta-value-row">
                            <code className="receipt-code">{paymentId}</code>
                            <button
                                type="button"
                                onClick={() => handleCopy(paymentId, 'payment')}
                                className="receipt-copy-btn"
                                aria-label="Copy payment ID"
                                title="Copy Payment ID"
                            >
                                {copiedKey === 'payment' ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>

                    <div className="receipt-meta-block">
                        <span className="receipt-meta-label">Razorpay Order ID</span>
                        <div className="receipt-meta-value-row">
                            <code className="receipt-code">{orderId}</code>
                            <button
                                type="button"
                                onClick={() => handleCopy(orderId, 'order')}
                                className="receipt-copy-btn"
                                aria-label="Copy order ID"
                                title="Copy Order ID"
                            >
                                {copiedKey === 'order' ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>

                    <div className="receipt-meta-block">
                        <span className="receipt-meta-label">Payment Mode</span>
                        <span className="receipt-meta-text">
                            Razorpay Standard Checkout (UPI / Cards / Netbanking)
                        </span>
                    </div>

                    <div className="receipt-meta-block">
                        <span className="receipt-meta-label">Security Protocol</span>
                        <span className="receipt-meta-text receipt-ssl-tag">
                            <ShieldCheck size={12} />
                            256-Bit SSL · HMAC-SHA256 Authenticated
                        </span>
                    </div>
                </div>

                <div className="receipt-divider" />

                {/* Shipping & Billing Parties */}
                <div className="receipt-parties-grid">
                    <div className="receipt-party-box">
                        <div className="receipt-party-heading">
                            <User size={12} />
                            <span>BILLED &amp; DISPATCHED TO</span>
                        </div>
                        <div className="receipt-party-name">{customer.nameOnCard || 'Valued Customer'}</div>
                        <div className="receipt-party-detail">
                            <Mail size={11} />
                            <span>{customer.email || '—'}</span>
                        </div>
                        <div className="receipt-party-detail">
                            <Phone size={11} />
                            <span>{customer.phone || '—'}</span>
                        </div>
                        <div className="receipt-party-detail">
                            <MapPin size={11} />
                            <span>
                                {customer.address ? `${customer.address}, PIN: ${customer.pincode}` : 'Standard Shipping'}
                            </span>
                        </div>
                    </div>

                    <div className="receipt-party-box">
                        <div className="receipt-party-heading">
                            <Cpu size={12} />
                            <span>SMART CARD SPECIFICATIONS</span>
                        </div>
                        <div className="receipt-spec-item">
                            <span className="receipt-spec-label">Laser Engraved Name:</span>
                            <strong className="receipt-spec-val">"{customer.nameOnCard}"</strong>
                        </div>
                        <div className="receipt-spec-item">
                            <span className="receipt-spec-label">Card Finish:</span>
                            <span className="receipt-spec-val">Matte Black Dual-Surface Polycarbonate</span>
                        </div>
                        <div className="receipt-spec-item">
                            <span className="receipt-spec-label">Chipset:</span>
                            <span className="receipt-spec-val">High-Frequency Contactless NFC (ISO 14443A)</span>
                        </div>
                        <div className="receipt-spec-item">
                            <span className="receipt-spec-label">Cloud Synchronization:</span>
                            <span className="receipt-spec-val">Instant Profile Switching · Lifetime Active</span>
                        </div>
                    </div>
                </div>

                {/* Itemized Order Table */}
                <div className="receipt-table-wrapper">
                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Item Description</th>
                                <th style={{ textAlign: 'center' }}>Package</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Rate</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="receipt-item-cell">
                                        <img
                                            src="/assets/nfc-smart-card.webp"
                                            alt="SignBridge NFC Card"
                                            className="receipt-item-thumb"
                                        />
                                        <div>
                                            <strong className="receipt-item-name">SignBridge NFC Smart Card</strong>
                                            <span className="receipt-item-desc">
                                                Custom Laser Inscribed · One-Tap Contactless Profile · Cloud Connected
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className="receipt-pill-pack">{selectedPack?.label || 'Single Card'}</span>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{selectedPack?.qty || 1}</td>
                                <td style={{ textAlign: 'right' }}>₹{unitPrice.toFixed(2)}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{grandTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Order Financial Calculation */}
                <div className="receipt-calc-layout">
                    <div className="receipt-fulfillment-steps">
                        <div className="receipt-step-row is-done">
                            <span className="receipt-step-pip">✓</span>
                            <div>
                                <strong>Payment Verified</strong>
                                <span>Secured via Razorpay Payment Gateway</span>
                            </div>
                        </div>
                        <div className="receipt-step-row is-active">
                            <span className="receipt-step-pip">●</span>
                            <div>
                                <strong>Laser Engraving &amp; NFC Encoding</strong>
                                <span>Writing customer identity to chip</span>
                            </div>
                        </div>
                        <div className="receipt-step-row">
                            <span className="receipt-step-pip">○</span>
                            <div>
                                <strong>Express Courier Dispatch</strong>
                                <span>Tracking SMS &amp; Email dispatched within 24 hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="receipt-totals-box">
                        <div className="receipt-total-row">
                            <span>Subtotal:</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="receipt-total-row">
                            <span>Shipping &amp; Handling:</span>
                            <span style={{ color: '#059669', fontWeight: 600 }}>FREE (₹0.00)</span>
                        </div>
                        <div className="receipt-total-row">
                            <span>GST / Taxes:</span>
                            <span>Included in Total</span>
                        </div>
                        <div className="receipt-grand-total-row">
                            <div className="receipt-grand-label">
                                <span>TOTAL PAID</span>
                                <small>INR · Net Amount</small>
                            </div>
                            <span className="receipt-grand-price">₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Official Stamp & Security Guarantee */}
                <div className="receipt-stamp-row">
                    <div className="receipt-guarantee-col">
                        <div className="receipt-guarantee-badge">
                            <PackageCheck size={14} color="#059669" />
                            <span>100% Quality &amp; Cloud Profile Guarantee</span>
                        </div>
                        <p className="receipt-guarantee-note">
                            Every SignBridge NFC Card includes a lifetime active digital profile and 1-year hardware replacement warranty against chip defects.
                        </p>
                    </div>

                    <div className="receipt-seal-box">
                        <div className="receipt-seal-circle">
                            <img
                                src="/signbridge-emblem.webp"
                                alt="Official Seal"
                                className="receipt-seal-img"
                            />
                            <span className="receipt-seal-text">VERIFIED</span>
                        </div>
                        <div className="receipt-sign-text">
                            <strong>SignBridge Systems</strong>
                            <span>Authorized Order Dispatch</span>
                        </div>
                    </div>
                </div>

                {/* Print Footer Note (shown only when printed) */}
                <div className="receipt-print-footer">
                    <span>SignBridge Technologies India · Official Customer Receipt · Generated {formattedDate}</span>
                    <span>www.signbridge.click</span>
                </div>
            </div>

            {/* User Action Buttons */}
            <div className="receipt-actions-bar">
                <button
                    type="button"
                    onClick={handlePrint}
                    className="receipt-action-btn is-primary"
                >
                    <Printer size={15} />
                    <span>Print / Save PDF Receipt</span>
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="receipt-action-btn is-secondary"
                >
                    <span>Done &amp; Return to Store</span>
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
