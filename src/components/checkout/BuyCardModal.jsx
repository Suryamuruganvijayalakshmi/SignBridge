import React, { useState } from 'react';
import {
    X,
    ShieldCheck,
    CheckCircle2,
    Lock,
    CreditCard,
    Sparkles,
    AlertCircle,
    ArrowRight,
    Loader2,
    Wifi
} from 'lucide-react';
import { initiateRazorpayPayment } from '../../lib/razorpayCheckout.js';

const PACK_OPTIONS = [
    { qty: 1, label: 'Single Card', price: 10, originalPrice: 999, savings: 'PROMO ₹10' },
    { qty: 2, label: 'Duo Pack', price: 20, originalPrice: 1998, savings: 'BEST VALUE', popular: true },
    { qty: 3, label: 'Team Pack', price: 30, originalPrice: 2997, savings: 'PROMO ₹30' }
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

        // Basic client validation
        if (!nameOnCard.trim() || nameOnCard.trim().length < 2) {
            setErrorMsg('Please enter the name you want printed on your card.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
            setErrorMsg('Please enter a valid email address for your order confirmation.');
            return;
        }

        const phoneClean = phone.replace(/[^0-9]/g, '');
        if (phoneClean.length < 10) {
            setErrorMsg('Please enter a valid 10-digit mobile number for courier tracking.');
            return;
        }

        if (!address.trim() || address.trim().length < 5) {
            setErrorMsg('Please provide a complete delivery address.');
            return;
        }

        if (!pincode.trim() || pincode.trim().length < 6) {
            setErrorMsg('Please enter a valid 6-digit postal pincode.');
            return;
        }

        setLoading(true);

        try {
            const amountInPaise = selectedPack.price * 100; // Razorpay requires amount in paise

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
            setErrorMsg(err.message || 'Unable to launch Razorpay checkout. Please check connection.');
            if (onNotification) {
                onNotification(`// ERROR: ${err.message}`);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={handleBackdropClick}>
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden text-zinc-900 max-h-[92vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-mono font-bold tracking-wider text-zinc-600 uppercase">
                            Secure Checkout // Razorpay
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors"
                        aria-label="Close checkout modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {paymentSuccess ? (
                        /* Success View */
                        <div className="py-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                                <CheckCircle2 size={36} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-zinc-900">Payment Successful!</h3>
                                <p className="text-sm text-zinc-600 mt-1">
                                    Your order for <strong>SignBridge NFC Smart Card</strong> has been confirmed.
                                </p>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-left font-mono text-xs space-y-1.5 text-zinc-700">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Payment ID:</span>
                                    <span className="font-semibold text-zinc-900">{paymentSuccess.paymentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Order ID:</span>
                                    <span className="text-zinc-900">{paymentSuccess.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Amount Paid:</span>
                                    <span className="font-semibold text-emerald-700">₹{selectedPack.price}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Printed Name:</span>
                                    <span className="text-zinc-900">{nameOnCard}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500">
                                A confirmation receipt and setup instructions will be sent to <strong>{email}</strong>.
                            </p>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors shadow-md mt-4"
                            >
                                Done &amp; Return to Site
                            </button>
                        </div>
                    ) : (
                        /* Checkout Form */
                        <form onSubmit={handlePay} className="space-y-5">
                            
                            {/* Product Summary Box */}
                            <div className="flex gap-4 p-3.5 bg-gradient-to-br from-blue-50/60 to-amber-50/40 rounded-xl border border-blue-100 items-center">
                                <img
                                    src="/assets/nfc-smart-card.webp"
                                    alt="SignBridge NFC Card"
                                    className="w-16 h-20 object-cover rounded-lg shadow-sm border border-zinc-200 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 text-blue-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                                        <Wifi size={11} />
                                        <span>One Tap · Business &amp; Personal</span>
                                    </div>
                                    <h4 className="text-base font-semibold text-zinc-900 leading-snug truncate">
                                        SignBridge NFC Smart Card
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        Matte Black Finish · Dual Profile · Free Delivery
                                    </p>
                                </div>
                            </div>

                            {/* Quantity / Pack Selector */}
                            <div>
                                <label className="block text-xs font-mono text-zinc-600 font-bold uppercase mb-2">
                                    Select Package
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PACK_OPTIONS.map((pack) => {
                                        const isSelected = selectedPack.qty === pack.qty;
                                        return (
                                            <button
                                                key={pack.qty}
                                                type="button"
                                                onClick={() => setSelectedPack(pack)}
                                                className={`relative p-2.5 rounded-xl border text-left transition-all ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20 shadow-sm'
                                                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                }`}
                                            >
                                                {pack.popular && (
                                                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold font-mono tracking-wider">
                                                        POPULAR
                                                    </span>
                                                )}
                                                <div className="text-[11px] font-medium text-zinc-600 truncate">{pack.label}</div>
                                                <div className="text-base font-bold text-zinc-900 mt-0.5">₹{pack.price}</div>
                                                <div className="text-[10px] text-zinc-400 line-through">₹{pack.originalPrice}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-3.5 pt-1">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-600 uppercase mb-1">
                                        Name on Card <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Surya Murugan"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-600 uppercase mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-600 uppercase mb-1">
                                            Mobile / WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="9876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-mono text-zinc-600 uppercase mb-1">
                                            Delivery Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="House / Office / Street"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-600 uppercase mb-1">
                                            Pincode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            placeholder="600001"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error Alert */}
                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 animate-fadeIn">
                                    <AlertCircle size={15} className="shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Submit & Pay Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin text-blue-400" />
                                            <span>Securing Order &amp; Connecting Razorpay...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={15} className="text-blue-400" />
                                            <span>Pay ₹{selectedPack.price} with Razorpay</span>
                                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={13} className="text-emerald-600" />
                                    <span>256-Bit SSL Encrypted</span>
                                </span>
                                <span>UPI · CARDS · NETBANKING</span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

