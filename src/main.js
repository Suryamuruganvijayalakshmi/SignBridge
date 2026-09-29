import { LuminaTubesManager, NEON_PALETTES } from './luminaTubes.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D Interactive Tubes Cursor
    const canvas = document.getElementById('tubes-canvas');
    const toast = document.getElementById('spectrum-toast');
    const specName = document.getElementById('active-spectrum-name');
    const dot1 = document.getElementById('spec-dot-1');
    const dot2 = document.getElementById('spec-dot-2');
    const dot3 = document.getElementById('spec-dot-3');
    const coordsEl = document.getElementById('interaction-coords');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');

    let toastTimer = null;
    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2200);
    };

    const tubesManager = new LuminaTubesManager(canvas, {
        onSpectrumChange: (palette) => {
            if (specName) specName.textContent = palette.name;
            if (dot1 && palette.tubes[0]) dot1.style.backgroundColor = palette.tubes[0];
            if (dot2 && palette.tubes[1]) dot2.style.backgroundColor = palette.tubes[1];
            if (dot3 && palette.tubes[2]) dot3.style.backgroundColor = palette.tubes[2];

            // Update accent glows dynamically if desired
            if (palette.accent) {
                document.documentElement.style.setProperty('--current-accent', palette.accent);
            }

            showToast(`// SPECTRUM SHIFTED: ${palette.name}`);
        }
    });

    // 2. Mouse Coordinate Tracking for the "MOUSE INTERACTION ACTIVE" footer HUD
    let mouseThrottle = 0;
    window.addEventListener('pointermove', (e) => {
        const now = Date.now();
        if (now - mouseThrottle > 60 && coordsEl) {
            mouseThrottle = now;
            coordsEl.textContent = `[X: ${e.clientX} | Y: ${e.clientY}]`;
        }
    }, { passive: true });

    // 3. Audio Toggle
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isEnabled = tubesManager.toggleAudio();
            if (soundIcon) {
                soundIcon.innerHTML = isEnabled ? `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                ` : `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                `;
            }
            showToast(isEnabled ? '// AUDIO FEEDBACK: SYNTHESIZED' : '// AUDIO FEEDBACK: MUTED');
        });
    }

    // 4. Showreel Modal Management
    const showreelBtn = document.getElementById('showreel-trigger');
    const showreelModal = document.getElementById('showreel-dialog');
    const showreelCloseBtn = document.getElementById('showreel-close');
    const showreelVideo = document.getElementById('showreel-video');

    if (showreelBtn && showreelModal) {
        showreelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showreelModal.showModal();
            tubesManager.playCyberSound(720);
            if (showreelVideo) {
                showreelVideo.currentTime = 0;
                showreelVideo.play().catch(() => {});
            }
        });

        const closeShowreel = () => {
            showreelModal.close();
            if (showreelVideo) {
                showreelVideo.pause();
            }
        };

        if (showreelCloseBtn) {
            showreelCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeShowreel();
            });
        }

        // Light dismiss (click on backdrop to close)
        showreelModal.addEventListener('click', (e) => {
            const rect = showreelModal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                closeShowreel();
            }
        });
    }

    // 5. Contact Modal ("Get in Touch")
    const contactBtn = document.getElementById('contact-trigger');
    const contactModal = document.getElementById('contact-dialog');
    const contactCloseBtn = document.getElementById('contact-close');
    const contactForm = document.getElementById('lumina-contact-form');
    const formStatus = document.getElementById('contact-status');

    if (contactBtn && contactModal) {
        contactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            contactModal.showModal();
            tubesManager.playCyberSound(620);
        });

        const closeContact = () => {
            contactModal.close();
        };

        if (contactCloseBtn) {
            contactCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeContact();
            });
        }

        contactModal.addEventListener('click', (e) => {
            const rect = contactModal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                closeContact();
            }
        });

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;
                if (formStatus) formStatus.textContent = '// TRANSMITTING TELEMETRY TO LUMINA CORE...';

                tubesManager.playCyberSound(880);

                setTimeout(() => {
                    if (formStatus) formStatus.textContent = '// DISPATCH SUCCESSFUL: CONNECTION PROTOCOL INITIALIZED.';
                    if (submitBtn) submitBtn.disabled = false;
                    contactForm.reset();
                    showToast('// DISPATCH RECEIVED: WE WILL COMMENCE UPLINK.');
                    setTimeout(closeContact, 1800);
                }, 1000);
            });
        }
    }

    // 6. Architecture / Protocol Specification Drawer
    const archTrigger = document.getElementById('nav-arch-trigger');
    const protocolTrigger = document.getElementById('nav-protocol-trigger');
    const spectrumTrigger = document.getElementById('nav-spectrum-trigger');
    const initProtocolBtn = document.getElementById('init-protocol-btn');
    const specModal = document.getElementById('spec-dialog');
    const specCloseBtn = document.getElementById('spec-close');

    const openSpecModal = (e) => {
        if (e) e.stopPropagation();
        if (specModal) {
            specModal.showModal();
            tubesManager.playCyberSound(580);
        }
    };

    if (archTrigger) archTrigger.addEventListener('click', openSpecModal);
    if (protocolTrigger) protocolTrigger.addEventListener('click', openSpecModal);
    if (initProtocolBtn) initProtocolBtn.addEventListener('click', openSpecModal);

    if (spectrumTrigger) {
        spectrumTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            tubesManager.shiftSpectrum();
        });
    }

    if (specCloseBtn && specModal) {
        specCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            specModal.close();
        });

        specModal.addEventListener('click', (e) => {
            const rect = specModal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                specModal.close();
            }
        });
    }

    // 7. Interactive Footer Status click shifts spectrum
    const footerStatusBtn = document.getElementById('footer-status-btn');
    if (footerStatusBtn) {
        footerStatusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tubesManager.shiftSpectrum();
        });
    }

    const spectrumPill = document.getElementById('spectrum-pill');
    if (spectrumPill) {
        spectrumPill.addEventListener('click', (e) => {
            e.stopPropagation();
            tubesManager.shiftSpectrum();
        });
    }

    // 8. Palette preset buttons inside specification modal
    const paletteButtons = document.querySelectorAll('.palette-preset-btn');
    paletteButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (NEON_PALETTES[index]) {
                tubesManager.shiftSpectrum(NEON_PALETTES[index]);
            }
        });
    });
});