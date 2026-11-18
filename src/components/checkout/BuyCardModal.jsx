import React, { useState } from 'react';
import {
    X,
    ShieldCheck,
    CheckCircle2,
    Lock,
    Sparkles,
    AlertCircle,
    ArrowRight,
    Loader2,
    Wifi
} from 'lucide-react';
import { initiateRazorpayPayment } from '../../lib/razorpayCheckout.js';
import OrderReceipt from './OrderReceipt.jsx';

const PACK_OPTIONS = [
    { qty: 1, label: 'Single Card', price: 199, originalPrice: 999, savings: 'SPECIAL ₹199' },
    { qty: 2, label: 'Duo Pack', price: 349, originalPrice: 1998, savings: 'BEST VALUE', popular: true },
    { qty: 3, label: 'Team Pack', price: 499, originalPrice: 2997, savings: 'SAVE MORE' }
];

export default function BuyCardModal({ isOpen, onClose, onNotification }) {
    const [selectedPack, setSelectedPack] = useState(PACK_OPTIONS[0]);
    const [nameOnCard, setNameOnCard] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Custom validation to prevent ugly browser tooltips
        if (!nameOnCard.trim() || nameOnCard.trim().length < 2) {
            setErrorMsg('Please enter the name you want printed on your card.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
            setErrorMsg('Please enter a valid email address for receipt and dashboard.');
            return;
        }

        const phoneClean = phone.replace(/[^0-9]/g, '');
        if (phoneClean.length < 10) {
            setErrorMsg('Please enter a valid 10-digit mobile number for courier dispatch.');
            return;
        }

        if (!address.trim() || address.trim().length < 5) {
            setErrorMsg('Please enter your complete delivery address.');
            return;
        }

        if (!pincode.trim() || pincode.trim().length < 6) {
            setErrorMsg('Please enter a valid 6-digit postal pincode.');
            return;
        }

        setLoading(true);

        try {
            const amountInPaise = selectedPack.price * 100; // Razorpay expects amount in paise

            const result = await initiateRazorpayPayment({
                amount: amountInPaise,
                currency: 'INR',
                name: 'SignBridge',
                description: `SignBridge NFC Smart Card (${selectedPack.label})`,
                notes: {
                    name_on_card: nameOnCard.trim(),
                    quantity: String(selectedPack.qty),
                    package: selectedPack.label,
                    shipping_address: address.trim(),
                    pincode: pincode.trim(),
                    customer_phone: phoneClean,
                },
                prefill: {
                    name: nameOnCard.trim(),
                    email: email.trim(),
                    contact: phoneClean,
                },
                onSuccess: (res) => {
                    setLoading(false);
                    setPaymentSuccess(res);
                    if (onNotification) {
                        onNotification(`// PAYMENT CONFIRMED: ${res.paymentId} — ORDER PLACED`);
                    }
                },
                onFailure: (err) => {
                    setLoading(false);
                    setErrorMsg(err.message || 'Payment could not be completed. Please try again.');
                    if (onNotification) {
                        onNotification(`// PAYMENT FAILED: ${err.message}`);
                    }
                },
                onDismiss: () => {
                    setLoading(false);
                }
            });

            if (result && result.status === 'dismissed') {
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.message || 'Unable to connect to Razorpay. Please verify internet connection.');
            if (onNotification) {
                onNotification(`// ERROR: ${err.message}`);
            }
        }
    };

    return (
        <div className="buy-modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={`buy-modal-window ${paymentSuccess ? 'is-receipt' : ''}`}>
                
                {/* Modal Header */}
                <div className="buy-modal-header">
                    <div className="buy-modal-header-left">
                        <span className={`buy-modal-pip ${paymentSuccess ? 'is-success' : ''}`} />
                        <span className="buy-modal-header-title">
                            {paymentSuccess ? 'OFFICIAL RECEIPT // SIGNBRIDGE' : 'SECURE CHECKOUT // RAZORPAY'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="buy-modal-close"
                        aria-label="Close checkout modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className={`buy-modal-body ${paymentSuccess ? 'is-receipt-body' : ''}`}>
                    {paymentSuccess ? (
                        <OrderReceipt
                            paymentData={paymentSuccess}
                            customer={{
                                nameOnCard,
                                email,
                                phone,
                                address,
                                pincode,
                            }}
                            selectedPack={selectedPack}
                            onClose={onClose}
                        />
                    ) : (
                        /* Checkout Form */
                        <form onSubmit={handlePay} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            {/* Product Summary Snippet */}
                            <div className="buy-product-snippet">
                                <img
                                    src="/assets/nfc-smart-card.webp"
                                    alt="SignBridge NFC Card"
                                    className="buy-product-thumb"
                                />
                                <div className="buy-product-info">
                                    <div className="buy-product-tag">
                                        <Wifi size={11} />
                                        <span>One Tap · Business &amp; Personal</span>
                                    </div>
                                    <h4 className="buy-product-name">
                                        SignBridge NFC Smart Card
                                    </h4>
                                    <p className="buy-product-sub">
                                        Matte Black Finish · Contactless · Free Courier Delivery
                                    </p>
                                </div>
                            </div>

                            {/* Package Selector */}
                            <div>
                                <label className="buy-field-label">
                                    Select Package
                                </label>
                                <div className="buy-packages-grid">
                                    {PACK_OPTIONS.map((pack) => {
                                        const isSelected = selectedPack.qty === pack.qty;
                                        return (
                                            <button
                                                key={pack.qty}
                                                type="button"
                                                onClick={() => setSelectedPack(pack)}
                                                className={`buy-package-card ${isSelected ? 'is-active' : ''}`}
                                            >
                                                {pack.popular && (
                                                    <span className="buy-package-badge">
                                                        POPULAR
                                                    </span>
                                                )}
                                                <span className="buy-package-name">{pack.label}</span>
                                                <span className="buy-package-price">₹{pack.price}</span>
                                                <span className="buy-package-old">₹{pack.originalPrice}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Name on Card */}
                            <div className="buy-form-group">
                                <label className="buy-field-label">
                                    Name on Card <span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Surya Murugan"
                                    value={nameOnCard}
                                    onChange={(e) => setNameOnCard(e.target.value)}
                                    className="buy-input"
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email & Mobile Row */}
                            <div className="buy-form-row">
                                <div className="buy-form-group">
                                    <label className="buy-field-label">
                                        Email Address <span className="req">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="buy-input"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="buy-form-group">
                                    <label className="buy-field-label">
                                        Mobile / WhatsApp <span className="req">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="buy-input"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            {/* Delivery Address & Pincode */}
                            <div className="buy-form-row">
                                <div className="buy-form-group">
                                    <label className="buy-field-label">
                                        Delivery Address <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Flat / Building / Street"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="buy-input"
                                        autoComplete="street-address"
                                    />
                                </div>
                                <div className="buy-form-group">
                                    <label className="buy-field-label">
                                        Postal Pincode <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="600001"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="buy-input"
                                        autoComplete="postal-code"
                                    />
                                </div>
                            </div>

                            {/* Error Alert */}
                            {errorMsg && (
                                <div className="buy-error-banner">
                                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Price Summary Line */}
                            <div className="buy-summary-line">
                                <span>Total to Pay (All inclusive + Free Shipping):</span>
                                <span className="buy-summary-total">₹{selectedPack.price}.00</span>
                            </div>

                            {/* Submit & Pay Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="buy-pay-btn"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin text-blue-400" />
                                            <span>Securing Order &amp; Opening Razorpay...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={15} />
                                            <span>Pay ₹{selectedPack.price} with Razorpay</span>
                                            <ArrowRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust Footer */}
                            <div className="buy-trust-footer">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <ShieldCheck size={14} style={{ color: '#059669' }} />
                                    <span>256-Bit SSL Encrypted Razorpay</span>
                                </span>
                                <span>UPI (GPay / PhonePe) · Cards · NetBanking</span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
