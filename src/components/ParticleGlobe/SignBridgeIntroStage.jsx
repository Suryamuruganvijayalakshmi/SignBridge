import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motionValue, animate } from 'motion';
import { Volume2, VolumeX } from 'lucide-react';
import { loadPhoto, createParticles, createPhotoOverlay, layoutParticles, highResolutionMix } from './particleEngine.js';
import './particleStage.css';

export default function SignBridgeIntroStage({ onComplete, isMuted, onToggleMute }) {
    const stageRef = useRef(null);
    const [isExiting, setIsExiting] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    // Keep stable ref to onComplete so it never triggers re-mounting
    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const isExitingRef = useRef(false);
    const triggerExit = useCallback(() => {
        if (isExitingRef.current) return;
        isExitingRef.current = true;
        setIsExiting(true);

        // Allow CSS opacity fade-out (750ms) before unmounting
        setTimeout(() => {
            setHasEnded(true);
            if (onCompleteRef.current) onCompleteRef.current();
        }, 750);
    }, []);

    const triggerExitRef = useRef(triggerExit);
    useEffect(() => {
        triggerExitRef.current = triggerExit;
    }, [triggerExit]);

    // Keyboard shortcuts (Escape or Enter explicitly skips intro)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                triggerExit();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [triggerExit]);

    // Main Three.js Lifecycle - STRICTLY MOUNT ONCE WITH []
    // Completely immune to any parent re-renders, mouse movements, or prop changes
    useEffect(() => {
        let isMounted = true;
        let animationFrameId = null;
        let renderer = null;
        let cleanups = [];

        async function init() {
            try {
                const stage = stageRef.current;
                if (!stage) return;

                // 1. Load the authentic SignBridge Logo
                const photo = await loadPhoto('/sign logo.png');
                if (!isMounted || !stageRef.current) return;

                // Responsive particle columns for high resolution
                const width = Math.max(stage.clientWidth || window.innerWidth, 1);
                const height = Math.max(stage.clientHeight || window.innerHeight, 1);
                const aspect = width / height;
                const columns = width < 640 ? 120 : (width < 1024 ? 160 : 200);

                // 2. Initialize high-performance WebGLRenderer & dynamic canvas
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                });
                renderer.setPixelRatio(dpr);
                renderer.setSize(width, height, false);
                renderer.outputColorSpace = THREE.SRGBColorSpace;
                renderer.setClearColor(0xffffff, 1);

                const canvas = renderer.domElement;
                canvas.setAttribute('role', 'img');
                canvas.setAttribute('aria-label', 'SignBridge animated particle globe and brand logo reveal');
                canvas.className = 'intro-canvas';
                // Ensure mouse interactions pass through without interfering with the render loop
                canvas.style.pointerEvents = 'none';
                stage.insertBefore(canvas, stage.firstChild);

                cleanups.push(() => {
                    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                    renderer.dispose();
                });

                const particles = createParticles(photo, columns);
                const photoMesh = createPhotoOverlay(photo);

                const scene = new THREE.Scene();
                // Pure minimalist white background requested by user
                scene.background = new THREE.Color(0xffffff);

                const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
                camera.position.z = 4;

                scene.add(particles.object);
                scene.add(photoMesh);

                const globeYaw = Math.PI * 0.28;

                // Synchronous initial layout BEFORE first frame
                camera.left = -aspect;
                camera.right = aspect;
                camera.top = 1;
                camera.bottom = -1;
                camera.updateProjectionMatrix();
                layoutParticles(particles, photoMesh, aspect, globeYaw);

                let resizeRaf = null;
                const resize = () => {
                    if (resizeRaf) cancelAnimationFrame(resizeRaf);
                    resizeRaf = requestAnimationFrame(() => {
                        if (!isMounted || !stage || !renderer || !camera) return;
                        const w = Math.max(stage.clientWidth || window.innerWidth, 1);
                        const h = Math.max(stage.clientHeight || window.innerHeight, 1);
                        const asp = w / h;

                        renderer.setSize(w, h, false);
                        camera.left = -asp;
                        camera.right = asp;
                        camera.top = 1;
                        camera.bottom = -1;
                        camera.updateProjectionMatrix();

                        layoutParticles(particles, photoMesh, asp, globeYaw);
                    });
                };

                const ro = new ResizeObserver(resize);
                ro.observe(stage);
                cleanups.push(() => {
                    ro.disconnect();
                    if (resizeRaf) cancelAnimationFrame(resizeRaf);
                });

                // 3. Motion spring values controlling the uniforms
                const globeValue = motionValue(1.0); // Starts as 3D colorful globe (1.0)
                const exitValue = motionValue(0.0);  // Exit dispersion (0.0 -> 1.0)

                let morphStarted = false;
                let exitStarted = false;

                // 4. 60 FPS Continuous Render Loop with Clock Sequencing
                // Operates strictly on time, completely immune to any mouse movements
                const clock = new THREE.Clock();
                function render() {
                    if (!isMounted) return;
                    const elapsedTime = clock.getElapsedTime();

                    // Phase 1 -> Phase 2: Rotating 3D Colorful Globe spins continuously for 1.3s,
                    // then smoothly spring morphs into the SignBridge Logo
                    if (elapsedTime >= 1.3 && !morphStarted) {
                        morphStarted = true;
                        const morphAnim = animate(globeValue, 0.0, {
                            type: 'spring',
                            stiffness: 48,
                            damping: 15,
                            mass: 1.0,
                        });
                        cleanups.push(() => morphAnim.stop());
                    }

                    // Phase 3 & 4: Holds crisp brand mark for ~1.8s, then smoothly disperses and reveals website at 4.4s
                    if (elapsedTime >= 4.4 && !exitStarted) {
                        exitStarted = true;
                        const exitAnim = animate(exitValue, 1.0, {
                            duration: 0.85,
                            ease: [0.16, 1, 0.3, 1],
                            onComplete: () => {
                                triggerExitRef.current();
                            }
                        });
                        cleanups.push(() => exitAnim.stop());
                    }

                    const currentGlobe = typeof globeValue.get === 'function' ? globeValue.get() : 0;
                    const currentExit = typeof exitValue.get === 'function' ? exitValue.get() : 0;

                    // Update uniforms
                    particles.uniforms.uGlobe.value = currentGlobe;
                    particles.uniforms.uExitProgress.value = currentExit;
                    particles.uniforms.uTime.value = elapsedTime;

                    // High-resolution logo overlay fades in smoothly as particles settle
                    if (photoMesh && photoMesh.material) {
                        const overlayAlpha = highResolutionMix(currentGlobe) * (1 - currentExit);
                        photoMesh.material.opacity = overlayAlpha;
                    }

                    renderer.render(scene, camera);
                    animationFrameId = requestAnimationFrame(render);
                }

                render();
                canvas.dataset.ready = 'true';
            } catch (err) {
                console.error('Intro Stage Init Error:', err);
                triggerExitRef.current();
            }
        }

        init();

        return () => {
            isMounted = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            cleanups.forEach(fn => fn());
        };
        // Attempt to trigger ambient soundtrack at the beginning of the globe
        window.dispatchEvent(new CustomEvent('signbridge-play-audio'));
    }, []); // STRICTLY EMPTY ARRAY []

    const triggerAudio = useCallback(() => {
        window.dispatchEvent(new CustomEvent('signbridge-play-audio'));
    }, []);

    if (hasEnded) return null;

    return (
        <aside
            ref={stageRef}
            className={`stage intro-stage ${isExiting ? 'is-exiting' : ''}`}
            aria-label="SignBridge cinematic particle brand reveal"
            role="region"
            onClick={triggerAudio}
            onTouchStart={triggerAudio}
            onPointerDown={triggerAudio}
        >
            {/* Canvas is dynamically mounted by Three.js with pointer-events: none */}

            {/* Left: Soundtrack Status & Mute Control at the beginning of the globe */}
            <button
                type="button"
                className="stage-sound-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleMute) onToggleMute();
                    triggerAudio();
                }}
                aria-label={isMuted ? "Unmute Ambient Soundtrack" : "Mute Ambient Soundtrack"}
                title={isMuted ? "Unmute Soundtrack" : "Mute Soundtrack"}
            >
                {isMuted ? (
                    <VolumeX size={13} className="text-slate-400" />
                ) : (
                    <Volume2 size={13} style={{ color: '#6366f1' }} />
                )}
                <span>{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
            </button>

            {/* Right: Dedicated Skip Button (Only clicking this explicitly skips) */}
            <button
                type="button"
                className="stage-skip-btn"
                onClick={triggerExit}
                aria-label="Skip intro animation and view website"
                title="Skip intro animation (Esc)"
            >
                <span>SKIP</span>
                <kbd className="stage-skip-key">ESC</kbd>
            </button>
        </aside>
    );
}
