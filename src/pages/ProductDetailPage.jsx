import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Users,
    Briefcase,
    UserCheck,
    Sprout,
    Mail,
    Phone
} from 'lucide-react';
import { getProductBySlug, PRODUCTS_DATA, NFC_COMPARISON_ROWS } from '../data/products.js';
import ProductMockupVisual from '../components/products/ProductMockupVisual.jsx';
import ProductEnquiryForm from '../components/products/ProductEnquiryForm.jsx';

export default function ProductDetailPage({ onNotification }) {
    const { slug } = useParams();
    const product = getProductBySlug(slug);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (product) {
            document.title = `${product.name} — SignBridge`;
        } else {
            document.title = 'Product Not Found — SignBridge';
        }
        return () => {
            document.title = 'SignBridge';
        };
    }, [product]);

    if (!product) {
        return (
            <main className="product-detail-main">
                <div className="section-frame">
                    <div className="product-not-found-card">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // 404 — PRODUCT NOT FOUND
                        </span>
                        <h1 className="section-main-heading">
                            Product not <span className="text-lime">found.</span>
                        </h1>
                        <p className="section-lead-text">
                            The requested SignBridge product page could not be found. Explore our three core offerings below.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/#products" className="btn-primary-lime">
                                <span>VIEW ALL PRODUCTS</span>
                                <ArrowRight size={15} />
                            </Link>
                            <Link to="/" className="btn-secondary-glass">
                                <ArrowLeft size={15} />
                                <span>BACK TO HOME</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const isNfcProduct = product.family === 'NFC Digital Identity';
    const isFarmCargo = product.id === 'farmcargo';
    const otherProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id);

    const scrollToEnquiry = () => {
        const el = document.getElementById('product-enquiry');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="product-detail-main" role="main">
            <div className="section-frame">
                {/* 1. Breadcrumb */}
                <div className="product-detail-breadcrumb">
                    <Link to="/#products" className="breadcrumb-back-link">
                        <ArrowLeft size={14} aria-hidden="true" />
                        <span>BACK TO PRODUCTS</span>
                    </Link>
                    <span className="breadcrumb-sep" aria-hidden="true">/</span>
                    <span className="breadcrumb-current">
                        PRODUCT {product.number} // {product.name.toUpperCase()}
                    </span>
                </div>

                {/* 2. Product Introduction & Relevant Illustration Hero */}
                <section className="product-detail-hero" aria-labelledby="pd-hero-title">
                    <div className="pd-hero-copy">
                        <div className="pd-badge-row">
                            <span className="product-number-badge">PRODUCT // {product.number}</span>
                            <span className="pd-category-pill">{product.category}</span>
                        </div>

                        <h1 id="pd-hero-title" className="pd-main-title">
                            {product.name}
                        </h1>

                        <p className="pd-tagline">{product.tagline}</p>

                        <p className="pd-description">{product.description}</p>

                        <div className="pd-hero-actions">
                            <button
                                type="button"
                                onClick={scrollToEnquiry}
                                className="btn-primary-lime"
                            >
                                <span>{product.ctaLabel}</span>
                                <ArrowUpRight size={16} aria-hidden="true" />
                            </button>
                            <a href="#how-it-works" className="btn-secondary-glass">
                                <span>How It Works</span>
                            </a>
                        </div>
                    </div>

                    <div className="pd-hero-visual-card">
                        <div className="pd-visual-header">
                            <span>{product.family.toUpperCase()}</span>
                            <small>INTERACTIVE OVERVIEW</small>
                        </div>
                        <ProductMockupVisual type={product.visualType} detailed />
                    </div>
                </section>

                {/* 3. Problem Statement & Our Solution */}
                <section className="pd-section-block" aria-label="Problem and Solution">
                    <div className="pd-problem-solution-grid">
                        <div className="pd-ps-card pd-problem-card">
                            <div className="pd-ps-head">
                                <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
                                <span>THE PROBLEM STATEMENT</span>
                            </div>
                            <h2>Why traditional workflows fall short</h2>
                            <p>{product.problemStatement}</p>
                        </div>

                        <div className="pd-ps-card pd-solution-card">
                            <div className="pd-ps-head">
                                <Sparkles size={18} className="text-iris" aria-hidden="true" />
                                <span>OUR SOLUTION</span>
                            </div>
                            <h2>How {product.name} solves it</h2>
                            <p>{product.ourSolution}</p>
                        </div>
                    </div>
                </section>

                {/* FarmCargo Lifecycle & Prediction Emphasis */}
                {isFarmCargo && (
                    <section className="pd-section-block pd-lifecycle-callout" aria-label="FarmCargo Procurement Lifecycle">
                        <div className="pd-callout-inner">
                            <div className="pd-callout-icon">
                                <Sprout size={22} aria-hidden="true" />
                            </div>
                            <div>
                                <span className="pd-callout-eyebrow">COMPLETE AGRICULTURAL PROCUREMENT LIFECYCLE</span>
                                <h3>Beyond registration or marketplaces — built for pre-harvest prediction &amp; centre operations</h3>
                                <p>
                                    FarmCargo connects pre-harvest cultivation planning and crop arrival quantity, timing, and origin estimation directly to token scheduling, procurement centre capacity monitoring, quality verification, weighing management, procurement receipts, and payment tracking.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. Key Features */}
                <section className="pd-section-block" aria-labelledby="pd-features-title">
                    <div className="pd-sub-header">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // CAPABILITIES &amp; FEATURES
                        </span>
                        <h2 id="pd-features-title" className="pd-section-heading">
                            Key features of <span className="text-lime">{product.name}</span>
                        </h2>
                    </div>

                    <div className="pd-features-grid">
                        {product.features.map((feature, index) => (
                            <div key={feature} className="pd-feature-item">
                                <div className="pd-feature-top">
                                    <span className="pd-feature-num">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <CheckCircle2 size={17} className="pd-feature-check" aria-hidden="true" />
                                </div>
                                <p className="pd-feature-name">{feature}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. How It Works */}
                <section className="pd-section-block" id="how-it-works" aria-labelledby="pd-how-title">
                    <div className="pd-sub-header">
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // WORKFLOW ARCHITECTURE
                        </span>
                        <h2 id="pd-how-title" className="pd-section-heading">
                            How <span className="text-lime">it works</span>
                        </h2>
                    </div>

                    <div className={`pd-steps-grid ${product.howItWorks.length === 5 ? 'is-five-col' : ''}`}>
                        {product.howItWorks.map((item) => (
                            <div key={item.step} className="pd-step-card">
                                <span className="pd-step-num">STEP {item.step}</span>
                                <h3 className="pd-step-title">{item.title}</h3>
                                <p className="pd-step-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NFC Family Comparison (shown for both NFC products) */}
                {isNfcProduct && (
                    <section className="pd-section-block" aria-labelledby="pd-nfc-compare-title">
                        <div className="pd-sub-header">
                            <span className="section-eyebrow">
                                <span className="eyebrow-pip" /> // NFC DIGITAL IDENTITY FAMILY
                            </span>
                            <h2 id="pd-nfc-compare-title" className="pd-section-heading">
                                Business Card vs. <span className="text-lime">Personal Portfolio</span>
                            </h2>
                            <p className="section-lead-text">
                                Both offerings share SignBridge’s contactless NFC tap experience, tailored to distinct business and personal identity workflows.
                            </p>
                        </div>

                        <div className="nfc-compare-grid">
                            <div className={`nfc-compare-col ${product.id === 'nfc-business-card' ? 'is-current-offering' : ''}`}>
                                <div className="nfc-compare-col-head">
                                    <Briefcase size={17} className="text-iris" aria-hidden="true" />
                                    <div>
                                        <span className="nfc-compare-code">
                                            PRODUCT 01 {product.id === 'nfc-business-card' ? '· CURRENTLY VIEWING' : ''}
                                        </span>
                                        <h4>NFC Digital Business Card</h4>
                                    </div>
                                </div>
                                <ul className="nfc-compare-list">
                                    {NFC_COMPARISON_ROWS.map((row) => (
                                        <li key={row.dimension}>
                                            <strong>{row.dimension}:</strong> {row.business}
                                        </li>
                                    ))}
                                </ul>
                                {product.id !== 'nfc-business-card' && (
                                    <Link to="/products/nfc-business-card" className="nfc-compare-link">
                                        <span>Switch to Business Card</span>
                                        <ArrowUpRight size={14} />
                                    </Link>
                                )}
                            </div>

                            <div className={`nfc-compare-col ${product.id === 'nfc-portfolio-card' ? 'is-current-offering' : ''}`}>
                                <div className="nfc-compare-col-head">
                                    <UserCheck size={17} className="text-cyan" aria-hidden="true" />
                                    <div>
                                        <span className="nfc-compare-code">
                                            PRODUCT 02 {product.id === 'nfc-portfolio-card' ? '· CURRENTLY VIEWING' : ''}
                                        </span>
                                        <h4>NFC Personal Portfolio Card</h4>
                                    </div>
                                </div>
                                <ul className="nfc-compare-list">
                                    {NFC_COMPARISON_ROWS.map((row) => (
                                        <li key={row.dimension}>
                                            <strong>{row.dimension}:</strong> {row.portfolio}
                                        </li>
                                    ))}
                                </ul>
                                {product.id !== 'nfc-portfolio-card' && (
                                    <Link to="/products/nfc-portfolio-card" className="nfc-compare-link">
                                        <span>Switch to Personal Portfolio</span>
                                        <ArrowUpRight size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* 6. Target Audience */}
                <section className="pd-section-block" aria-labelledby="pd-audience-title">
                    <div className="pd-audience-panel">
                        <div className="pd-audience-copy">
                            <span className="section-eyebrow">
                                <span className="eyebrow-pip" /> // WHO IT IS BUILT FOR
                            </span>
                            <h2 id="pd-audience-title" className="pd-section-heading">
                                Target <span className="text-lime">audience</span>
                            </h2>
                            <p className="section-lead-text">
                                Designed specifically for the workflows and communication needs of:
                            </p>
                        </div>

                        <div className="pd-audience-grid">
                            {product.targetAudience.map((group) => (
                                <div key={group} className="pd-audience-card">
                                    <Users size={16} className="text-iris shrink-0" aria-hidden="true" />
                                    <span>{group}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. Contact / Enquiry CTA */}
                <section className="pd-section-block pd-enquiry-section" id="product-enquiry" aria-labelledby="pd-enquiry-title">
                    <div className="contact-grid-layout !grid !grid-cols-1 lg:!grid-cols-2 !gap-12">
                        <div className="contact-info-block">
                            <span className="section-eyebrow">
                                <span className="eyebrow-pip" /> // PRODUCT ENQUIRY
                            </span>
                            <h2 id="pd-enquiry-title" className="section-main-heading">
                                Get started with <br />
                                <span className="text-lime">{product.name}.</span>
                            </h2>
                            <p className="section-lead-text">
                                Share your requirements, team size, or deployment goals and the SignBridge team will follow up with setup details.
                            </p>

                            <div className="direct-channels">
                                <a href="mailto:signbridge.aiauto@gmail.com" className="channel-link">
                                    <Mail size={18} className="channel-icon text-iris" />
                                    <span>signbridge.aiauto@gmail.com</span>
                                    <ArrowUpRight size={14} className="channel-arrow" />
                                </a>
                                <a href="tel:+919842253267" className="channel-link">
                                    <Phone size={18} className="channel-icon text-cyan" />
                                    <span>+91 98422 53267</span>
                                    <ArrowUpRight size={14} className="channel-arrow" />
                                </a>
                            </div>
                        </div>

                        <div className="contact-form-card">
                            <div className="contact-card-header">
                                <span className="window-dots">
                                    <span className="w-dot red" />
                                    <span className="w-dot yellow" />
                                    <span className="w-dot green" />
                                </span>
                                <span className="contact-card-title">{product.name.toUpperCase()} // ENQUIRY FORM</span>
                            </div>
                            <div className="contact-card-body">
                                <ProductEnquiryForm
                                    productName={product.name}
                                    onNotification={onNotification}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Other Products Switcher */}
                <section className="pd-section-block pd-other-products" aria-label="Other SignBridge products">
                    <div className="pd-other-head">
                        <span className="section-eyebrow">MORE FROM SIGNBRIDGE</span>
                        <Link to="/#products" className="pd-all-link">
                            <span>View all products</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="pd-other-grid">
                        {otherProducts.map((other) => (
                            <Link key={other.id} to={`/products/${other.slug}`} className="pd-other-card">
                                <span className="pd-other-num">PRODUCT // {other.number}</span>
                                <h3>{other.name}</h3>
                                <p>{other.tagline}</p>
                                <span className="pd-other-cta">
                                    View Product <ArrowRight size={14} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

