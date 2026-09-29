import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function SmartTableSection({ onOpenShowreel, onOpenContact }) {
    const features = [
        'Instant NFC contactless tap to open menu',
        'High-contrast QR code backup for all smartphones',
        'Cloud-synced real-time menu updates & pricing',
        'Zero app downloads or installations required'
    ];

    return (
        <section className="site-section section-smart-table" id="smart-table">
            <div className="section-frame">
                <div className="section-header-block">
                    <span className="section-eyebrow">
                        <span className="eyebrow-pip" style={{ backgroundColor: 'var(--accent-magenta)' }} /> // FEATURED HARDWARE + CLOUD PRODUCT
                    </span>
                    <h2 className="section-main-heading">
                        SignBridge <span className="text-lime">Smart Table.</span>
                    </h2>
                    <p className="section-lead-text">
                        One simple, intelligent contactless product for dining tables, hospitality, and event spaces.
                    </p>
                </div>

                <div className="smart-table-card">
                    <div className="smart-table-visual">
                        <div className="visual-badge">
                            <span>SMART TABLE</span>
                            <small>NFC / QR CONTACTLESS</small>
                        </div>
                        <img
                            src="/Gemini_Generated_Image_ygc7srygc7srygc7.png"
                            alt="SignBridge Smart Table NFC menu card on table"
                            className="smart-table-img"
                            loading="lazy"
                        />
                        <div className="visual-overlay-tag">
                            <span className="live-dot" /> LIVE HARDWARE TESTED
                        </div>
                    </div>

                    <div className="smart-table-details">
                        <div className="details-header">
                            <span className="catalog-code">CATALOG // SB-001</span>
                            <h3 className="product-title">NFC Menu Starter Kit</h3>
                            <p className="product-subtitle">
                                Acrylic Table Stand · Dual-Frequency NFC Chip · Dynamic QR Engine
                            </p>
                        </div>

                        <ul className="product-features-list">
                            {features.map((feature, idx) => (
                                <li key={idx} className="feature-item">
                                    <CheckCircle2 size={16} className="feature-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="product-footer-row">
                            <div className="price-tag">
                                <span className="currency">$5</span>
                                <span className="pricing-note">one-time / card</span>
                            </div>

                            <div className="product-actions-group">
                                <button
                                    type="button"
                                    onClick={onOpenContact}
                                    className="btn-primary-lime"
                                    style={{ padding: '0.75rem 1.5rem', fontSize: '13px' }}
                                >
                                    <span>Order Starter Kit</span>
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
