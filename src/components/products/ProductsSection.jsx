import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers, Briefcase, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCTS_DATA, NFC_COMPARISON_ROWS } from '../../data/products.js';
import ProductCard from './ProductCard.jsx';

export default function ProductsSection() {
    const [showComparison, setShowComparison] = useState(false);

    return (
        <section className="site-section section-products" id="products" aria-labelledby="products-heading">
            <div className="section-frame">
                <div className="section-header-block products-header-layout">
                    <div>
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> // 03 — PRODUCTS &amp; PLATFORMS
                        </span>
                        <h2 id="products-heading" className="section-main-heading">
                            Built for <br />
                            <span className="text-lime">real-world scale.</span>
                        </h2>
                        <p className="section-lead-text">
                            Three focused SignBridge products engineered across smart NFC digital identity and data-driven agricultural procurement intelligence.
                        </p>
                    </div>

                    <div className="products-family-summary">
                        <span className="family-summary-label">PRODUCT FAMILIES</span>
                        <div className="family-summary-pills">
                            <span className="family-pill">
                                <Layers size={13} aria-hidden="true" />
                                NFC Digital Identity (01 &amp; 02)
                            </span>
                            <span className="family-pill">
                                Agricultural Intelligence (03)
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3 Product Offerings Grid */}
                <div className="products-showcase-grid">
                    {PRODUCTS_DATA.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* NFC Digital Identity Family: Business vs Personal Portfolio Clarifier */}
                <div className="nfc-family-guide">
                    <div className="nfc-family-guide-head">
                        <div className="nfc-family-guide-copy">
                            <span className="nfc-guide-eyebrow">NFC DIGITAL IDENTITY PRODUCT FAMILY</span>
                            <h3 className="nfc-guide-title">
                                Two distinct NFC experiences: Business Profile vs. Personal Portfolio
                            </h3>
                            <p className="nfc-guide-sub">
                                Both belong to SignBridge’s NFC Digital Identity family, purpose-built for different goals—connecting companies with clients or empowering individuals to share their career work in one tap.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="nfc-compare-toggle-btn"
                            onClick={() => setShowComparison((prev) => !prev)}
                            aria-expanded={showComparison}
                            aria-controls="nfc-family-comparison-table"
                        >
                            <span>{showComparison ? 'Hide Comparison' : 'Compare NFC Cards'}</span>
                            {showComparison ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                    </div>

                    {showComparison && (
                        <div id="nfc-family-comparison-table" className="nfc-compare-grid">
                            <div className="nfc-compare-col">
                                <div className="nfc-compare-col-head">
                                    <Briefcase size={16} className="text-iris" aria-hidden="true" />
                                    <div>
                                        <span className="nfc-compare-code">PRODUCT 01</span>
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
                                <Link to="/products/nfc-business-card" className="nfc-compare-link">
                                    <span>Explore Business Card</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            <div className="nfc-compare-col">
                                <div className="nfc-compare-col-head">
                                    <UserCheck size={16} className="text-cyan" aria-hidden="true" />
                                    <div>
                                        <span className="nfc-compare-code">PRODUCT 02</span>
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
                                <Link to="/products/nfc-portfolio-card" className="nfc-compare-link">
                                    <span>Explore Personal Portfolio</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

