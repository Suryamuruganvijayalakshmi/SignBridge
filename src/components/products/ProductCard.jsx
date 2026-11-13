import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import ProductMockupVisual from './ProductMockupVisual.jsx';

export default function ProductCard({ product }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article className={`product-showcase-card ${expanded ? 'is-expanded' : ''}`}>
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

                {/* Expandable Explore More panel */}
                {expanded && (
                    <div className="product-explore-drawer" id={`explore-${product.id}`}>
                        <div className="explore-drawer-block">
                            <span className="explore-drawer-label">FULL CAPABILITY OVERVIEW</span>
                            <p className="explore-drawer-text">{product.description}</p>
                        </div>

                        <div className="explore-drawer-block">
                            <span className="explore-drawer-label">
                                <Users size={12} aria-hidden="true" /> TARGET AUDIENCE
                            </span>
                            <div className="explore-audience-chips">
                                {product.targetAudience.map((aud) => (
                                    <span key={aud} className="explore-audience-chip">
                                        {aud}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="explore-drawer-block">
                            <span className="explore-drawer-label">
                                ALL INCLUDED CAPABILITIES ({product.features.length})
                            </span>
                            <div className="explore-features-mini">
                                {product.features.map((f) => (
                                    <span key={f} className="explore-feature-tag">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Card Footer Actions */}
                <div className="product-card-actions">
                    <Link
                        to={`/products/${product.slug}`}
                        className="product-view-btn"
                    >
                        <span>View Product</span>
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>

                    <button
                        type="button"
                        className="product-explore-btn"
                        onClick={() => setExpanded((prev) => !prev)}
                        aria-expanded={expanded}
                        aria-controls={`explore-${product.id}`}
                    >
                        <span>{expanded ? 'Show Less' : 'Explore More'}</span>
                        {expanded ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </article>
    );
}

