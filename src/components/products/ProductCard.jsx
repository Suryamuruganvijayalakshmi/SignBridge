import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ProductMockupVisual from './ProductMockupVisual.jsx';

export default function ProductCard({ product }) {
    return (
        <article className="product-showcase-card">
            {/* Top visual mockup */}
            <Link
                to={`/products/${product.slug}`}
                className="product-card-visual-link"
                aria-label={`View ${product.name} details`}
            >
                <div className="product-card-visual-wrap">
                    <div className="product-card-top-meta">
                        <span className="product-number-badge">PRODUCT // {product.number}</span>
                        <span className="product-family-pill">{product.family}</span>
                    </div>
                    <ProductMockupVisual type={product.visualType} />
                </div>
            </Link>

            {/* Card body */}
            <div className="product-card-body">
                <div>
                    <span className="product-category-label">{product.category}</span>
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-tagline">{product.tagline}</p>
                    <p className="product-card-desc">{product.shortDescription}</p>

                    <ul className="product-highlights-list" aria-label={`${product.name} highlighted features`}>
                        {product.highlightedFeatures.map((feat) => (
                            <li key={feat} className="product-highlight-item">
                                <CheckCircle2 size={15} className="product-highlight-icon" aria-hidden="true" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Card Footer Actions */}
                <div className="product-card-actions">
                    <Link
                        to={`/products/${product.slug}`}
                        className="product-view-btn"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <span>View Product Specifications</span>
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
