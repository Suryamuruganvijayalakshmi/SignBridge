/**
 * particleEngine.js
 * 
 * High-performance cinematic particle engine for SignBridge.
 * Features:
 * - 100% authentic SignBridge brand color fidelity (Electric Cyan & Fiery Orange dual-energy)
 * - Radiant multi-spectral 3D rotating globe reflecting the logo's color spectrum
 * - Smooth spring physics morphing from 3D sphere into the exact brand mark
 * - Organic TSL-style turbulence, stardust dispersion, and razor-sharp overlay blend
 */

import * as THREE from 'three';

export function highResolutionMix(globeAmount) {
    const amount = Math.max(globeAmount, 0);
    const start = 0.01;
    const end = 0.25;
    const t = Math.min(1, Math.max(0, (amount - start) / (end - start)));
    return 1 - t * t * (3 - 2 * t);
}

/**
 * Loads, crops and processes the authentic SignBridge logo ('/sign logo.png').
 * Preserves the exact vibrant colors: Electric Cyan left arch, Fiery Orange right arch,
 * crisp white "Sign", and radiant orange "Bridge".
 */
export function loadPhoto(url = '/sign logo.png') {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            const rawCanvas = document.createElement('canvas');
            rawCanvas.width = image.naturalWidth || 907;
            rawCanvas.height = image.naturalHeight || 880;
            const rawCtx = rawCanvas.getContext('2d', { willReadFrequently: true });
            rawCtx.drawImage(image, 0, 0);

            const rawImgData = rawCtx.getImageData(0, 0, rawCanvas.width, rawCanvas.height);
            const rawData = rawImgData.data;

            // 1. Detect logo bounding box (ignore black background)
            let minX = rawCanvas.width, maxX = 0, minY = rawCanvas.height, maxY = 0;
            for (let y = 0; y < rawCanvas.height; y++) {
                for (let x = 0; x < rawCanvas.width; x++) {
                    const idx = (y * rawCanvas.width + x) * 4;
                    const r = rawData[idx];
                    const g = rawData[idx + 1];
                    const b = rawData[idx + 2];
                    const a = rawData[idx + 3];

                    // Pixel is part of logo if not dark black
                    if (a > 25 && (r > 32 || g > 32 || b > 32)) {
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            if (maxX <= minX || maxY <= minY) {
                minX = 145; maxX = 740; minY = 210; maxY = 660;
            }

            // Tight breathing margin around logo
            const padX = Math.round((maxX - minX) * 0.035);
            const padY = Math.round((maxY - minY) * 0.035);
            minX = Math.max(0, minX - padX);
            maxX = Math.min(rawCanvas.width, maxX + padX);
            minY = Math.max(0, minY - padY);
            maxY = Math.min(rawCanvas.height, maxY + padY);

            const cropW = maxX - minX;
            const cropH = maxY - minY;

            // 2. Render onto destination canvas with transparent background
            const source = document.createElement('canvas');
            source.width = cropW;
            source.height = cropH;
            const ctx = source.getContext('2d', { willReadFrequently: true });

            const croppedData = ctx.createImageData(cropW, cropH);
            const dst = croppedData.data;

            for (let y = 0; y < cropH; y++) {
                for (let x = 0; x < cropW; x++) {
                    const srcIdx = ((minY + y) * rawCanvas.width + (minX + x)) * 4;
                    const dstIdx = (y * cropW + x) * 4;

                    const r = rawData[srcIdx];
                    const g = rawData[srcIdx + 1];
                    const b = rawData[srcIdx + 2];
                    const a = rawData[srcIdx + 3];

                    // Identify logo foreground pixels (excluding dark background)
                    const isLogo = a > 25 && (r > 28 || g > 28 || b > 28);

                    if (isLogo) {
                        // On a white background:
                        // "Sign" text and bottom tagline in the original dark-mode logo were white/silver.
                        // Adapt neutral white/silver typography to rich dark charcoal (#0f172a / #111827)
                        // so it is beautifully legible and crisp against the pure white background.
                        const isNeutral = Math.abs(r - g) < 28 && Math.abs(r - b) < 28 && Math.abs(g - b) < 28;
                        const isTextRegion = y > cropH * 0.46;

                        if (isTextRegion && isNeutral && r > 65) {
                            // High-contrast dark charcoal text for "Sign" and tagline
                            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                            // Smooth antialiased blend for text edges
                            const darkFactor = 1.0 - Math.min(1.0, luminance);
                            dst[dstIdx] = Math.round(15 + darkFactor * 40);      // R: #0f..#37
                            dst[dstIdx + 1] = Math.round(23 + darkFactor * 45);  // G: #17..#43
                            dst[dstIdx + 2] = Math.round(42 + darkFactor * 50);  // B: #2a..#5c
                            dst[dstIdx + 3] = a;
                        } else {
                            // Preserve 100% authentic vibrant cyan, azure, orange and gold
                            dst[dstIdx] = r;
                            dst[dstIdx + 1] = g;
                            dst[dstIdx + 2] = b;
                            dst[dstIdx + 3] = 255;
                        }
                    } else {
                        dst[dstIdx] = 0;
                        dst[dstIdx + 1] = 0;
                        dst[dstIdx + 2] = 0;
                        dst[dstIdx + 3] = 0;
                    }
                }
            }

            ctx.putImageData(croppedData, 0, 0);

            const map = new THREE.CanvasTexture(source);
            map.colorSpace = THREE.SRGBColorSpace;
            map.needsUpdate = true;

            resolve({
                width: source.width,
                height: source.height,
                pixels: ctx.getImageData(0, 0, source.width, source.height).data,
                map,
            });
        };

        image.onerror = () => reject(new Error('Could not load SignBridge logo at ' + url));
        image.src = url;
    });
}

/**
 * Creates instanced particle mesh with dual-energy color spectrum:
 * Left = Electric Cyan & Azure Blue
 * Right = Fiery Sunset Orange & Radiant Gold
 */
export function createParticles(photo, columns = 190) {
    const imageAspect = photo.width / photo.height;
    const rows = Math.round(columns / imageAspect);
    const count = columns * rows;

    const imagePositions = new Float32Array(count * 3);
    const globePositions = new Float32Array(count * 3);
    const logoColours = new Float32Array(count * 3);
    const globeColours = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const isLogo = new Float32Array(count);

    // Brand Palette Presets for Globe State (Deep vibrant saturation tailored for pure white canvas)
    const cyanPalette = [
        new THREE.Color('#0080ff'), // Radiant Electric Azure
        new THREE.Color('#00a6f5'), // Bright Electric Cyan
        new THREE.Color('#0284c7'), // Deep Sky Blue
        new THREE.Color('#2563eb'), // Royal Blue
        new THREE.Color('#0891b2'), // Teal Cyan
        new THREE.Color('#1d4ed8'), // Deep Azure
    ];

    const orangePalette = [
        new THREE.Color('#ff4500'), // Fiery Sunset Orange
        new THREE.Color('#ea580c'), // Deep Orange
        new THREE.Color('#f97316'), // Radiant Amber
        new THREE.Color('#d97706'), // Warm Gold
        new THREE.Color('#e11d48'), // Crimson Coral
        new THREE.Color('#c2410c'), // Burnt Orange
    ];

    const seamColor = new THREE.Color('#4f46e5'); // Electric Indigo / Violet Fusion Crest

    for (let index = 0; index < count; index++) {
        const column = index % columns;
        const row = Math.floor(index / columns);

        const sampleX = Math.min(photo.width - 1, Math.floor(((column + 0.5) / columns) * photo.width));
        const sampleY = Math.min(photo.height - 1, Math.floor(((row + 0.5) / rows) * photo.height));

        const pixel = (sampleY * photo.width + sampleX) * 4;
        const offset = index * 3;

        const pr = photo.pixels[pixel] / 255;
        const pg = photo.pixels[pixel + 1] / 255;
        const pb = photo.pixels[pixel + 2] / 255;
        const pa = photo.pixels[pixel + 3];

        const isLogoPixel = pa > 25 && (pr > 0.05 || pg > 0.05 || pb > 0.05);
        const normX = (column / columns) * 2.0 - 1.0; // -1 (left) to +1 (right)

        // 1. Target Logo Color (Authentic brand colors adapted for white background)
        if (isLogoPixel) {
            logoColours[offset] = pr;
            logoColours[offset + 1] = pg;
            logoColours[offset + 2] = pb;
            isLogo[index] = 1.0;
        } else {
            // Ambient stardust particles that disperse outward on white canvas
            const ambient = normX < 0 ? cyanPalette[index % cyanPalette.length] : orangePalette[index % orangePalette.length];
            logoColours[offset] = ambient.r * 0.75;
            logoColours[offset + 1] = ambient.g * 0.75;
            logoColours[offset + 2] = ambient.b * 0.75;
            isLogo[index] = 0.0;
        }

        // 2. 3D Globe Color (100% Radiant, colorful dual-energy cyan & fiery orange)
        const randVariation = Math.sin(index * 12.9898) * 0.5 + 0.5;
        let gColor = new THREE.Color();

        // Only strongly saturated arch pixels pass through directly to the globe.
        // Neutral and text pixels adopt the radiant hemisphere palette so the globe has zero dark specks.
        const isSaturatedColor = isLogoPixel && (Math.abs(pr - pb) > 0.14 || Math.abs(pr - pg) > 0.14);

        if (isSaturatedColor) {
            gColor.setRGB(pr, pg, pb, THREE.SRGBColorSpace);
        } else {
            // Ambient and text particles fill the globe with the exact matching vibrant streams
            if (normX < -0.04) {
                // Left hemisphere: Vibrant Electric Cyan / Azure Blue Stream
                const cIdx = Math.floor(randVariation * cyanPalette.length);
                gColor.copy(cyanPalette[cIdx]);
            } else if (normX > 0.04) {
                // Right hemisphere: Fiery Sunset Orange / Gold Stream
                const oIdx = Math.floor(randVariation * orangePalette.length);
                gColor.copy(orangePalette[oIdx]);
            } else {
                // Center seam: Radiant indigo/cyan energy fusion
                gColor.copy(seamColor);
            }
        }

        globeColours[offset] = gColor.r;
        globeColours[offset + 1] = gColor.g;
        globeColours[offset + 2] = gColor.b;

        phases[index] = Math.random() * Math.PI * 2;
        speeds[index] = 0.75 + Math.random() * 0.4;
    }

    const geometry = new THREE.InstancedBufferGeometry().copy(
        new THREE.PlaneGeometry(1, 1)
    );
    geometry.instanceCount = count;
    geometry.setAttribute('imagePosition', new THREE.InstancedBufferAttribute(imagePositions, 3));
    geometry.setAttribute('globePosition', new THREE.InstancedBufferAttribute(globePositions, 3));
    geometry.setAttribute('logoColour', new THREE.InstancedBufferAttribute(logoColours, 3));
    geometry.setAttribute('globeColour', new THREE.InstancedBufferAttribute(globeColours, 3));
    geometry.setAttribute('phase', new THREE.InstancedBufferAttribute(phases, 1));
    geometry.setAttribute('speed', new THREE.InstancedBufferAttribute(speeds, 1));
    geometry.setAttribute('isLogo', new THREE.InstancedBufferAttribute(isLogo, 1));

    // High-Performance Particle Shader Material
    const uniforms = {
        uGlobe: { value: 1.0 },
        uParticleSize: { value: new THREE.Vector2(0.01, 0.01) },
        uTime: { value: 0 },
        uExitProgress: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        uniforms,
        vertexShader: `
            attribute vec3 imagePosition;
            attribute vec3 globePosition;
            attribute vec3 logoColour;
            attribute vec3 globeColour;
            attribute float phase;
            attribute float speed;
            attribute float isLogo;

            uniform float uGlobe;
            uniform vec2 uParticleSize;
            uniform float uTime;
            uniform float uExitProgress;

            varying vec3 vColor;
            varying float vAlpha;
            varying vec2 vUv;

            void main() {
                vUv = uv;

                // 1. Organic TSL turbulence
                vec3 turbulence = vec3(
                    sin(uTime * (speed + 0.6) + phase) * 0.045,
                    cos(uTime * (speed + 0.37) + phase * 1.71) * 0.035,
                    sin(uTime * (speed + 0.22) + phase * 2.13) * 0.045
                );

                // 2. Slow majestic 3D globe rotation around Y axis
                float rotAngle = uTime * 0.28;
                float cosR = cos(rotAngle);
                float sinR = sin(rotAngle);
                vec3 rotatedGlobe = vec3(
                    globePosition.x * cosR - globePosition.z * sinR,
                    globePosition.y,
                    globePosition.x * sinR + globePosition.z * cosR
                );

                vec3 spherePosWithTurb = rotatedGlobe + turbulence;

                // 3. Fluid curved swirl trajectory during morph transition
                float travelArc = sin(clamp(uGlobe, 0.0, 1.0) * 3.14159265);
                vec3 swirl = vec3(sin(phase * 3.2), cos(phase * 2.4), sin(phase * 1.9)) * (travelArc * 0.14);

                // Non-logo particles gently disperse outward like stardust as logo resolves
                vec3 dispersedOffset = normalize(spherePosWithTurb + vec3(0.001)) * (1.0 - uGlobe) * 0.85;
                vec3 targetLogo = mix(imagePosition + dispersedOffset, imagePosition, isLogo);

                vec3 particleCenter = mix(targetLogo, spherePosWithTurb, uGlobe) + swirl;

                // 4. Intro exit transition: disperse outward into the atmosphere
                if (uExitProgress > 0.0) {
                    vec3 exitDir = normalize(particleCenter + vec3(sin(phase), cos(phase), 0.35));
                    particleCenter += exitDir * (uExitProgress * uExitProgress * 3.2);
                }

                // Instanced billboard plane offset
                vec3 vertexOffset = vec3(position.xy * uParticleSize, 0.0);
                vec4 mvPosition = modelViewMatrix * vec4(particleCenter + vertexOffset, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // Seamless color transition: Globe Palette -> Crisp Logo Colors
                vec3 currentColour = mix(logoColour, globeColour, smoothstep(0.0, 0.72, uGlobe));

                // Subtle luminous shimmer in globe state
                float shimmer = 1.0 + sin(uTime * 2.2 + phase) * 0.06 * uGlobe;
                vColor = currentColour * shimmer;

                // Alpha: Logo particles stay 100% visible, ambient particles dissolve smoothly
                float logoVisibility = mix(isLogo, 1.0, clamp(uGlobe * 1.5, 0.0, 1.0));
                vAlpha = logoVisibility * (1.0 - smoothstep(0.0, 0.95, uExitProgress));
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            varying float vAlpha;
            varying vec2 vUv;

            void main() {
                // Circular anti-aliased particle disc with soft luminous edge
                vec2 coord = vUv - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;
                float circleAlpha = smoothstep(0.5, 0.35, dist);

                gl_FragColor = vec4(vColor, vAlpha * circleAlpha);
            }
        `
    });

    const object = new THREE.Mesh(geometry, material);

    return {
        imageAspect,
        columns,
        rows,
        uniforms,
        particleSize: uniforms.uParticleSize,
        globeUniform: uniforms.uGlobe,
        exitUniform: uniforms.uExitProgress,
        object,
    };
}

/**
 * Creates high-resolution logo overlay that smoothly blends in as particles settle
 */
export function createPhotoOverlay(photo) {
    const photoMaterial = new THREE.MeshBasicMaterial({
        map: photo.map,
        toneMapped: false,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        opacity: 0,
    });

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        photoMaterial
    );
    mesh.renderOrder = 1;
    return mesh;
}

/**
 * Computes exact particle positions for both Logo and Globe
 */
export function layoutParticles(particles, photoMesh, aspect, globeYaw = Math.PI * 0.28) {
    const { columns, imageAspect, object, particleSize, rows } = particles;

    const imageHalfHeight = Math.min(0.68, (0.84 * aspect) / imageAspect);
    const imageHalfWidth = imageHalfHeight * imageAspect;
    const globeRadius = Math.min(0.58, aspect * 0.82);

    const position = object.geometry.getAttribute('imagePosition');
    const sphere = object.geometry.getAttribute('globePosition');

    const yawCos = Math.cos(globeYaw);
    const yawSin = Math.sin(globeYaw);
    const tilt = -0.28;

    for (let index = 0; index < position.count; index++) {
        const column = index % columns;
        const row = Math.floor(index / columns);

        const x = (column + 0.5) / columns;
        const y = (row + 0.5) / rows;

        const sphereY = 1 - (index / Math.max(position.count - 1, 1)) * 2;
        const ringRadius = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
        const angle = index * 2.39996323;

        const sphereX = Math.cos(angle) * ringRadius;
        const sphereZ = Math.sin(angle) * ringRadius;

        const spunX = sphereX * yawCos + sphereZ * yawSin;
        const spunZ = -sphereX * yawSin + sphereZ * yawCos;

        position.setXYZ(
            index,
            (x - 0.5) * imageHalfWidth * 2,
            (0.5 - y) * imageHalfHeight * 2,
            0
        );

        sphere.setXYZ(
            index,
            spunX * globeRadius,
            (sphereY * Math.cos(tilt) - spunZ * Math.sin(tilt)) * globeRadius,
            (sphereY * Math.sin(tilt) + spunZ * Math.cos(tilt)) * globeRadius
        );
    }

    position.needsUpdate = true;
    sphere.needsUpdate = true;

    particleSize.value.set(
        ((imageHalfWidth * 2) / columns) * 1.08,
        ((imageHalfHeight * 2) / rows) * 1.08
    );

    if (photoMesh) {
        photoMesh.scale.set(imageHalfWidth * 2, imageHalfHeight * 2, 1);
    }
}
