import React from 'react';
import { PRODUCTS_DATA } from '../../data/products.js';
import ProductCard from './ProductCard.jsx';

export default function ProductsSection() {
    return (
        <section className="site-section section-products" id="products" aria-labelledby="products-heading">
            <div className="section-frame">
                <div className="section-header-block products-header-layout">
                    <div>
                        <span className="section-eyebrow">
                            <span className="eyebrow-pip" /> Products &amp; Platforms
                        </span>
                        <h2 id="products-heading" className="section-main-heading">
                            Built for <br />
                            <span className="text-accent">real-world scale.</span>
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
            </div>
        </section>
    );
}
