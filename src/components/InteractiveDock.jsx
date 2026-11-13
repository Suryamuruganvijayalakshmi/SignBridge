import React, { useState } from 'react';
import '../styles/dock.css';

/**
 * InteractiveDock
 * macOS-style interactive magnification floating dock
 * Adapted for SignBridge executive navigation.
 */
export default function InteractiveDock() {
    const [selectedTab, setSelectedTab] = useState('contact');

    const handleNavigate = (destination, tabKey) => {
        setSelectedTab(tabKey);

        if (destination === 'home') {
            const el = document.getElementById('home') || document.querySelector('header') || document.body;
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (destination === 'projects') {
            const el = document.getElementById('products');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (destination === 'github') {
            window.open('https://github.com/Suryamuruganvijayalakshmi/SignBridge', '_blank', 'noopener,noreferrer');
        } else if (destination === 'contact') {
            const el = document.getElementById('contact');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Optionally focus the message field for immediate typing
            setTimeout(() => {
                const input = document.getElementById('contact-message') || document.querySelector('#contact textarea, #contact input');
                input?.focus();
            }, 500);
        }
    };

    return (
        <div className="dock-stage" aria-label="Interactive quick navigation dock">
            <div className="dock" role="toolbar" aria-label="SignBridge quick navigation">
                <div className="dock__row">
                    {/* Item 1: Home */}
                    <label
                        className="dock__item"
                        onClick={() => handleNavigate('home', 'home')}
                        title="Navigate to Home"
                    >
                        <input
                            type="radio"
                            name="dock-navigation"
                            checked={selectedTab === 'home'}
                            onChange={() => setSelectedTab('home')}
                        />

                        <svg viewBox="0 0 64 64" role="img" aria-label="Home">
                            <defs>
                                <linearGradient id="dock-home" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#5ec8ff"></stop>
                                    <stop offset="1" stopColor="#2878f0"></stop>
                                </linearGradient>
                            </defs>

                            <rect width="64" height="64" rx="14" fill="url(#dock-home)"></rect>

                            <path
                                d="M14 31.5L32 16l18 15.5v19a3.5 3.5 0 0 1-3.5 3.5h-29A3.5 3.5 0 0 1 14 50.5z"
                                fill="#ffffff"
                            ></path>

                            <path
                                d="M10.5 31.5L30 14.8a3 3 0 0 1 4 0l19.5 16.7"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>

                            <rect
                                x="27"
                                y="37"
                                width="10"
                                height="17"
                                rx="2"
                                fill="#2878f0"
                            ></rect>

                            <circle cx="34.5" cy="45.5" r="1.2" fill="#ffffff"></circle>
                        </svg>

                        <span className="dock__tooltip">Home</span>
                        <span className="dock__dot"></span>
                    </label>

                    {/* Item 2: Projects / Products */}
                    <label
                        className="dock__item"
                        onClick={() => handleNavigate('projects', 'projects')}
                        title="View Products & Systems"
                    >
                        <input
                            type="radio"
                            name="dock-navigation"
                            checked={selectedTab === 'projects'}
                            onChange={() => setSelectedTab('projects')}
                        />

                        <svg viewBox="0 0 64 64" role="img" aria-label="Projects">
                            <defs>
                                <linearGradient id="dock-projects" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#ffd86b"></stop>
                                    <stop offset="1" stopColor="#f59e0b"></stop>
                                </linearGradient>
                            </defs>

                            <rect
                                width="64"
                                height="64"
                                rx="14"
                                fill="url(#dock-projects)"
                            ></rect>

                            <path
                                d="M9 20a5 5 0 0 1 5-5h14l5 6h21a4 4 0 0 1 4 4v4H9z"
                                fill="#ffe8a3"
                            ></path>

                            <path
                                d="M9 27h49l-4 23a5 5 0 0 1-4.9 4H14a5 5 0 0 1-4.9-4z"
                                fill="#fff5cf"
                            ></path>

                            <rect
                                x="18"
                                y="34"
                                width="11"
                                height="10"
                                rx="2"
                                fill="#f5ad17"
                            ></rect>

                            <rect
                                x="34"
                                y="34"
                                width="11"
                                height="10"
                                rx="2"
                                fill="#f5ad17"
                            ></rect>

                            <rect
                                x="18"
                                y="47"
                                width="27"
                                height="3"
                                rx="1.5"
                                fill="#e7b94d"
                            ></rect>
                        </svg>

                        <span className="dock__tooltip">Projects</span>
                        <span className="dock__dot"></span>
                    </label>

                    {/* Item 3: GitHub */}
                    <label
                        className="dock__item"
                        onClick={() => handleNavigate('github', 'github')}
                        title="Open SignBridge GitHub Repository"
                    >
                        <input
                            type="radio"
                            name="dock-navigation"
                            checked={selectedTab === 'github'}
                            onChange={() => setSelectedTab('github')}
                        />

                        <svg viewBox="0 0 64 64" role="img" aria-label="GitHub">
                            <rect width="64" height="64" rx="14" fill="#18181b"></rect>

                            <path
                                d="M32 11
                  C20.4 11 11 20.4 11 32
                  C11 41.35 17.05 49.27 25.43 52.06
                  C26.48 52.25 26.86 51.61 26.86 51.06
                  C26.86 50.55 26.84 49.08 26.81 47.13
                  C20.1 48.58 18.82 43.9 18.82 43.9
                  C17.87 41.49 16.49 40.86 16.49 40.86
                  C14.3 39.36 16.66 39.39 16.66 39.39
                  C19.08 39.56 20.35 41.88 20.35 41.88
                  C22.51 45.56 25.96 44.54 27.05 43.84
                  C27.27 42.31 27.89 41.24 28.57 40.63
                  C23.22 40.02 17.57 37.95 17.57 31.12
                  C17.57 29.17 18.27 27.55 19.43 26.28
                  C19.23 25.77 18.62 23.74 19.66 21.1
                  C19.66 21.1 21.59 20.48 25.95 23.42
                  C27.79 22.92 29.76 22.66 31.71 22.65
                  C33.66 22.66 35.63 22.92 37.47 23.42
                  C41.83 20.48 43.76 21.1 43.76 21.1
                  C44.8 23.74 44.19 25.77 43.99 26.28
                  C45.15 27.55 45.85 29.17 45.85 31.12
                  C45.85 37.97 40.19 40 34.83 40.61
                  C35.57 41.25 36.24 42.51 36.24 44.47
                  C36.24 47.28 36.22 49.54 36.22 50.14
                  C36.22 50.73 36.6 51.38 37.68 51.14
                  C46.04 48.34 52.99 40.39 52.99 32
                  C52.99 20.4 43.6 11 32 11Z"
                                fill="#ffffff"
                            ></path>
                        </svg>

                        <span className="dock__tooltip">GitHub</span>
                        <span className="dock__dot"></span>
                    </label>

                    {/* Item 4: Contact */}
                    <label
                        className="dock__item"
                        onClick={() => handleNavigate('contact', 'contact')}
                        title="Reach SignBridge Directly"
                    >
                        <input
                            type="radio"
                            name="dock-navigation"
                            checked={selectedTab === 'contact'}
                            onChange={() => setSelectedTab('contact')}
                        />

                        <svg viewBox="0 0 64 64" role="img" aria-label="Contact">
                            <defs>
                                <linearGradient id="dock-contact" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#5de0ff"></stop>
                                    <stop offset="1" stopColor="#2774e8"></stop>
                                </linearGradient>
                            </defs>

                            <rect width="64" height="64" rx="14" fill="url(#dock-contact)"></rect>

                            <rect
                                x="9"
                                y="17"
                                width="46"
                                height="32"
                                rx="5"
                                fill="#ffffff"
                            ></rect>

                            <path
                                d="M10 21l22 17 22-17"
                                fill="none"
                                stroke="#b9d9f8"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>

                            <path
                                d="M11 46l14-11"
                                fill="none"
                                stroke="#d7e9fa"
                                strokeWidth="2"
                                strokeLinecap="round"
                            ></path>

                            <path
                                d="M53 46L39 35"
                                fill="none"
                                stroke="#d7e9fa"
                                strokeWidth="2"
                                strokeLinecap="round"
                            ></path>
                        </svg>

                        <span className="dock__tooltip">Contact</span>
                        <span className="dock__dot"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}
