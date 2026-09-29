import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Film } from 'lucide-react';

export default function ShowreelModal({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            window.dispatchEvent(new Event('bump-cursor'));
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
            }
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className={`modal-backdrop ${isOpen ? 'open' : ''}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`glass-modal ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="showreel-title"
            >
                <div className="modal-header">
                    <div className="modal-header-left">
                        <span className="badge-dot" style={{ backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} aria-hidden="true" />
                        <h2 id="showreel-title" className="modal-title">
                            SIGNBRIDGE // SPATIAL SHOWREEL 2026
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-close-btn"
                        aria-label="Close Showreel modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="video-container">
                        <video
                            ref={videoRef}
                            controls
                            playsInline
                            preload="metadata"
                        >
                            <source src="/assets/signbridge-product-launch.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="modal-meta-grid">
                        <div className="meta-box">
                            <div className="label">RENDER PIPELINE</div>
                            <div className="value text-lime">Three.js Kinetic Tube GPU</div>
                        </div>
                        <div className="meta-box">
                            <div className="label">SPRING PHYSICS</div>
                            <div className="value text-cyan">Euler-Damped 120 FPS</div>
                        </div>
                        <div className="meta-box">
                            <div className="label">PRODUCT REEL</div>
                            <div className="value text-magenta">Smart Table 2026 Launch</div>
                        </div>
                        <div className="meta-box">
                            <div className="label">GLASSMORPHISM</div>
                            <div className="value">Backdrop Blur 12px / 28px</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
