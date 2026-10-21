import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Smartphone, Wifi, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductRequestForm from '../components/ProductRequestForm';

export default function ProductPage() {
    const [requestType, setRequestType] = useState('Buy');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRequestClick = (type) => {
        setRequestType(type);
        const reqElem = document.getElementById('request');
        if (reqElem) {
            reqElem.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="product-page-wrapper" style={{ paddingTop: '88px', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="section-frame">
                {/* Back to Home Breadcrumb */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
                        style={{ textDecoration: 'none' }}
                    >
                        <ArrowLeft size={14} />
                        <span>RETURN TO STUDIO OVERVIEW</span>
                    </Link>
                </div>

                {/* HERO / PRODUCT HEADLINE */}
                <div className="section-header-block mb-12">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-magenta)' }} /> // SIGNBRIDGE FOR HOSPITALITY
                    </span>
                    <h1 className="section-main-heading !text-4xl sm:!text-5xl lg:!text-6xl">
                        Your Menu. <br />
                        <span className="text-lime">One Tap Away.</span>
                    </h1>
                    <p className="section-lead-text max-w-2xl">
                        SignBridge Smart Table turns every dining table into an instant, contactless digital menu experience with dual NFC hardware and dynamic QR backup.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        <button
                            type="button"
                            className="btn-primary-lime"
                            onClick={() => handleRequestClick('Buy')}
                        >
                            <span>GET STARTER KIT — $5</span>
                            <ArrowUpRight size={14} />
                        </button>
                        <button
                            type="button"
                            className="btn-secondary-glass"
                            onClick={() => handleRequestClick('Demo')}
                        >
                            <span>BOOK 5-MIN VIRTUAL DEMO</span>
                        </button>
                    </div>
                </div>

                {/* PRODUCT SHOWCASE CARD */}
                <div className="smart-table-card !flex !flex-col lg:!flex-row !gap-10 mb-16">
                    <div className="smart-table-visual lg:w-1/2">
                        <div className="visual-badge">
                            <span>SMART TABLE // SB-001</span>
                            <small>NFC / QR CONTACTLESS</small>
                        </div>
                        <img
                            src="/assets/nfc-menu-starter-kit.png"
                            alt="SIGNBRIDGE NFC Menu Starter Kit"
                            className="smart-table-img"
                            loading="eager"
                        />
                        <div className="visual-overlay-tag">
                            <span className="live-dot" /> PRODUCTION HARDWARE
                        </div>
                    </div>

                    <div className="smart-table-details lg:w-1/2 flex flex-col justify-center">
                        <span className="catalog-code">PRODUCT // 001</span>
                        <h2 className="product-title !text-3xl font-black">NFC Menu Starter Kit</h2>
                        <p className="product-subtitle text-slate-500 mb-6">
                            Premium Solid Oak / Acrylic Stand · Dual-Band NFC Microchip · Zero App Requirement
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 dark:bg-white/5 dark:border-white/10">
                                <Wifi size={20} className="text-lime mb-2" />
                                <h4 className="font-bold text-sm">Instant Tap</h4>
                                <p className="text-xs text-slate-500">NFC antenna opens browser instantly</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 dark:bg-white/5 dark:border-white/10">
                                <QrCode size={20} className="text-cyan mb-2" />
                                <h4 className="font-bold text-sm">QR Backup</h4>
                                <p className="text-xs text-slate-500">Universal compatibility for older phones</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 dark:bg-white/5 dark:border-white/10">
                                <Smartphone size={20} className="text-magenta mb-2" />
                                <h4 className="font-bold text-sm">Zero App</h4>
                                <p className="text-xs text-slate-500">No app download or user account</p>
                            </div>
                        </div>

                        <div className="product-footer-row">
                            <div className="price-tag">
                                <span className="currency">$5</span>
                                <span className="pricing-note">one-time / table card</span>
                            </div>

                            <button
                                type="button"
                                className="btn-primary-lime"
                                onClick={() => handleRequestClick('Buy')}
                            >
                                <span>ORDER NOW</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* VIDEO DEMO SECTION */}
                <div className="mb-16">
                    <div className="section-header-block mb-6">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // EXPERIENCE IN MOTION
                        </span>
                        <h2 className="section-main-heading !text-2xl sm:!text-3xl">
                            See Smart Table <span className="text-lime">in action.</span>
                        </h2>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-black max-w-4xl mx-auto">
                        <video
                            className="w-full aspect-video object-cover"
                            controls
                            preload="metadata"
                            poster="/assets/nfc-menu-starter-kit.png"
                        >
                            <source src="/assets/signbridge-product-launch.mp4" type="video/mp4" />
                            Your browser does not support video playback.
                        </video>
                    </div>
                </div>

                {/* PROPERLY PLACED REQUEST / ORDER FORM */}
                <section className="request-section mt-16 pt-12 border-t border-slate-200/80 dark:border-white/10" id="request">
                    <div className="contact-grid-layout !grid !grid-cols-1 lg:!grid-cols-2 !gap-12">
                        {/* Left: Value & Assurance */}
                        <div className="contact-info-block">
                            <span className="section-eyebrow">
                                <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-lime)' }} /> // DISPATCH SPECIFICATIONS
                            </span>
                            <h2 className="section-main-heading">
                                Tell us what <br />
                                <span className="text-lime">you need.</span>
                            </h2>
                            <p className="section-lead-text">
                                Request your NFC Menu Starter Kit or schedule a 5-minute virtual walkthrough. We provide complete setup support, cloud menu hosting, and quick delivery.
                            </p>

                            <div className="space-y-4 my-6">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 size={16} className="text-lime shrink-0" />
                                    <span>Pre-configured and tested NFC chips ready to place on tables</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 size={16} className="text-lime shrink-0" />
                                    <span>Cloud CMS to edit menu items, photos, and prices in real-time</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 size={16} className="text-lime shrink-0" />
                                    <span>No monthly recurring software subscription fees for starter kit</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-8">
                                <ShieldCheck size={16} className="text-lime" />
                                <span>SSL Encrypted Order Dispatch · Direct Studio Fulfillment</span>
                            </div>
                        </div>

                        {/* Right: Streamlined, Secure Product Form */}
                        <div className="contact-form-card">
                            <ProductRequestForm defaultRequestType={requestType} />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
