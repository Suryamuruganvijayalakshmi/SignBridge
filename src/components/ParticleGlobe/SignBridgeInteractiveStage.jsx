import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motionValue, animate, press } from 'motion';
import { loadPhoto, createParticles, createPhotoOverlay, layoutParticles, highResolutionMix } from './particleEngine.js';
import './particleStage.css';

export default function SignBridgeInteractiveStage() {
    const stageRef = useRef(null);
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let animationFrameId = null;
        let renderer = null;
        let cleanups = [];

        async function init() {
            try {
                const stage = stageRef.current;
                if (!stage) return;

                // 1. Load cropped SignBridge Logo FIRST
                const photo = await loadPhoto('/sign logo.png');
                if (!isMounted || !stageRef.current) return;

                const width = Math.max(stage.clientWidth || window.innerWidth, 1);
                const height = Math.max(stage.clientHeight || 520, 1);
                const aspect = width / height;
                const columns = width < 640 ? 110 : (width < 1024 ? 150 : 180);

                // 2. Create fresh WebGLRenderer & canvas
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                });
                renderer.setPixelRatio(dpr);
                renderer.setSize(width, height, false);
                renderer.outputColorSpace = THREE.SRGBColorSpace;

                const canvas = renderer.domElement;
                canvas.setAttribute('role', 'button');
                canvas.setAttribute('tabindex', '0');
                canvas.setAttribute('aria-label', 'Hold to form a particle globe, release to restore SignBridge logo');
                canvas.className = 'interactive-canvas';
                stage.insertBefore(canvas, stage.firstChild);

                cleanups.push(() => {
                    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                    renderer.dispose();
                });

                const particles = createParticles(photo, columns);
                const photoMesh = createPhotoOverlay(photo);

                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xffffff);

                const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
                camera.position.z = 4;

                scene.add(particles.object);
                scene.add(photoMesh);

                const globeYaw = Math.PI * 0.28;

                // Synchronous layout
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
                        const h = Math.max(stage.clientHeight || 520, 1);
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

                // Spring physics state: 0 = logo, 1 = globe
                let globeTarget = 0.0;
                let globeCurrent = 0.0;
                let globeVelocity = 0.0;

                const setTarget = (val) => {
                    globeTarget = val;
                    setIsHolding(val > 0.5);
                };

                // Native gestures: Press & hold to form globe, release to restore logo
                const onPointerDown = (e) => {
                    e.preventDefault();
                    setTarget(1.0);
                };
                const onPointerUp = (e) => {
                    e.preventDefault();
                    setTarget(0.0);
                };

                canvas.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointerup', onPointerUp);
                window.addEventListener('pointercancel', onPointerUp);

                cleanups.push(() => {
                    canvas.removeEventListener('pointerdown', onPointerDown);
                    window.removeEventListener('pointerup', onPointerUp);
                    window.removeEventListener('pointercancel', onPointerUp);
                });

                // 60 FPS Render Loop with smooth Spring simulation
                const clock = new THREE.Clock();
                let lastTime = 0;

                function render() {
                    if (!isMounted) return;
                    const elapsedTime = clock.getElapsedTime();
                    const dt = Math.min(elapsedTime - lastTime, 0.05);
                    lastTime = elapsedTime;

                    // Spring simulation: F = -k*(x - target) - c*v
                    const stiffness = globeTarget > 0.5 ? 90.0 : 60.0;
                    const damping = globeTarget > 0.5 ? 14.0 : 12.0;
                    const force = -stiffness * (globeCurrent - globeTarget) - damping * globeVelocity;
                    globeVelocity += force * dt;
                    globeCurrent += globeVelocity * dt;
                    globeCurrent = Math.max(0.0, Math.min(1.0, globeCurrent));

                    particles.uniforms.uGlobe.value = globeCurrent;
                    particles.uniforms.uTime.value = elapsedTime;

                    if (photoMesh && photoMesh.material) {
                        photoMesh.material.opacity = highResolutionMix(globeCurrent);
                    }

                    renderer.render(scene, camera);
                    animationFrameId = requestAnimationFrame(render);
                }

                render();
                canvas.dataset.ready = 'true';
            } catch (err) {
                console.error('Interactive Stage Init Error:', err);
            }
        }

        init();

        return () => {
            isMounted = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            cleanups.forEach(fn => fn());
        };
    }, []);

    return (
        <section className="particle-lab-wrapper" id="particle-lab" aria-label="Interactive SignBridge Particle Lab">
            <div className="particle-lab-header">
                <div className="particle-lab-badge">
                    <span className="badge-pulse" />
                    <span>// INTERACTIVE EXPERIMENTAL LAB</span>
                </div>
                <h2 className="particle-lab-title">DIGITAL CONNECTIVITY MATRIX</h2>
                <p className="particle-lab-subtitle">
                    {isHolding
                        ? 'RELEASE TO RESOLVE SIGNBRIDGE LOGO'
                        : 'PRESS & HOLD CANVAS TO ENERGIZE 3D PARTICLE GLOBE'}
                </p>
            </div>

            <div className="stage interactive-stage" ref={stageRef}>
                {/* Canvas is dynamically mounted by Three.js */}
                <div className="interactive-stage-hint" aria-hidden="true">
                    <span>{isHolding ? '⦿ ENERGIZING GLOBE...' : '✦ HOLD TO FORM GLOBE'}</span>
                </div>
            </div>
        </section>
    );
}
