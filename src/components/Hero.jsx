import React from 'react';
import Hero64 from './originkit/hero-64';

/**
 * Hero component wrapping Originkit Hero 64
 * Wire all interactive buttons and links with smooth scrolling and modal triggers.
 */
export default function Hero({ onOpenContact }) {
    const handleHeroClick = (e) => {
        // 1. "Meet the studio →" button -> smooth scroll to Capabilities
        const btnLg = e.target.closest('.btn-lg');
        if (btnLg) {
            e.preventDefault();
            const target = document.getElementById('capabilities');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '/#capabilities');
            }
            return;
        }

        // 2. "Start a project" button -> open Contact Modal or scroll to contact
        const btnSm = e.target.closest('.btn-sm');
        if (btnSm) {
            e.preventDefault();
            if (onOpenContact) {
                onOpenContact();
            } else {
                const target = document.getElementById('contact');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', '/#contact');
                }
            }
            return;
        }

        // 3. Any nav links inside Hero 64 (Work, Studio, Services, Journal, Contact)
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') === '#') {
            e.preventDefault();
            const text = link.textContent.trim().toLowerCase();
            let targetId = 'capabilities';
            if (text.includes('contact')) targetId = 'contact';
            else if (text.includes('service') || text.includes('work')) targetId = 'products';
            else if (text.includes('journal')) targetId = 'research';

            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `/#${targetId}`);
            }
        }
    };

    return (
        <div onClick={handleHeroClick} className="hero-interactive-shell">
            <Hero64 />
        </div>
    );
}
