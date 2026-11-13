import React from 'react';
import { PRODUCTS_DATA } from '../../data/products.js';
import ProductCard from './ProductCard.jsx';
import NfcInteractiveCard from './NfcInteractiveCard.jsx';

export default function ProductsSection() {
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
                            Three focused SignBridge products engineered across smart contactless NFC digital identity and data-driven agricultural procurement intelligence.
                        </p>
                    </div>
                </div>

                {/* 3 Product Offerings Grid */}
                <div className="products-showcase-grid">
                    {PRODUCTS_DATA.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Interactive Physical NFC Smart Card Showcase */}
                <NfcInteractiveCard />
            </div>
        </section>
    );
}
