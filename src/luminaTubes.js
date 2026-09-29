import TubesCursor from 'threejs-components/build/cursors/tubes1.min.js';

// Curated high-contrast palettes for the Cyber-Brutalist Iris & White aesthetic
export const NEON_PALETTES = [
    {
        name: 'IRIS // LUMINOUS WHITE',
        tubes: ['#6366f1', '#4f46e5', '#818cf8'],
        lights: ['#6366f1', '#818cf8', '#a5b4fc', '#4338ca'],
        accent: '#6366f1'
    },
    {
        name: 'CYBER-IRIS // PURE WHITE',
        tubes: ['#7c3aed', '#6366f1', '#a855f7'],
        lights: ['#7c3aed', '#6366f1', '#c084fc', '#4f46e5'],
        accent: '#7c3aed'
    },
    {
        name: 'ELECTRIC CYAN // IRIS',
        tubes: ['#0284c7', '#6366f1', '#0ea5e9'],
        lights: ['#0284c7', '#6366f1', '#38bdf8', '#818cf8'],
        accent: '#0284c7'
    },
    {
        name: 'DEEP VIOLET // IRIS',
        tubes: ['#4f46e5', '#4338ca', '#6366f1'],
        lights: ['#6366f1', '#818cf8', '#c7d2fe', '#4f46e5'],
        accent: '#4f46e5'
    },
    {
        name: 'ROYAL MAGENTA // IRIS',
        tubes: ['#c026d3', '#6366f1', '#db2777'],
        lights: ['#c026d3', '#6366f1', '#f0abfc', '#a855f7'],
        accent: '#c026d3'
    },
    {
        name: 'VIBRANT AMBER // IRIS',
        tubes: ['#d97706', '#6366f1', '#f59e0b'],
        lights: ['#d97706', '#6366f1', '#fde68a', '#818cf8'],
        accent: '#d97706'
    }
];

export class LuminaTubesManager {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        this.paletteIndex = 0;
        this.app = null;
        this.options = options;
        this.onSpectrumChange = options.onSpectrumChange || null;
        this.audioEnabled = false;
        this.audioCtx = null;
        this.init();
    }

    init() {
        if (!this.canvas) return;

        try {
            const initialPalette = NEON_PALETTES[0];
            // CRITICAL: bloom: false disables the postprocessing pass that painted the canvas opaque black!
            this.app = TubesCursor(this.canvas, {
                bloom: false,
                sleepRadiusX: 280,
                sleepRadiusY: 140,
                sleepTimeScale1: 0.9,
                sleepTimeScale2: 1.6,
                tubes: {
                    count: 18,
                    colors: initialPalette.tubes,
                    minRadius: 0.016,
                    maxRadius: 0.065,
                    material: {
                        metalness: 0.12,
                        roughness: 0.3
                    },
                    lights: {
                        intensity: 260,
                        colors: initialPalette.lights
                    }
                }
            });

            // Ensure WebGL transparent clear color so pure white background shines through
            if (this.app?.three?.renderer) {
                try {
                    this.app.three.renderer.setClearColor(0x000000, 0);
                } catch (e) {
                    console.warn('ClearColor error:', e);
                }
            }
            if (this.app?.three?.scene) {
                this.app.three.scene.background = null;
            }
            if (this.app?.tubes) {
                this.app.tubes.setMaterialOption('metalness', 0.12);
                this.app.tubes.setMaterialOption('roughness', 0.3);
            }

            this.setupListeners();
            if (this.onSpectrumChange) {
                this.onSpectrumChange(initialPalette);
            }
        } catch (error) {
            console.warn('Three.js Tubes Cursor initialization error, applying fallback:', error);
            this.setupCanvasFallback();
        }
    }

    setupListeners() {
        // Global click listener to re-randomize spectrum across the screen
        window.addEventListener('click', (event) => {
            // If the user clicked on an interactive UI control with specific actions, still shift or let them trigger
            // But especially when clicking the canvas/background or text
            const target = event.target;
            const isModalControl = target.closest('button, a, input, textarea, select, dialog');
            
            // If they clicked outside buttons or specifically on the canvas/body/text, shift spectrum
            // Also allow clicking the spectrum indicator button to shift
            if (!isModalControl || target.closest('[data-action="shift-spectrum"]')) {
                this.shiftSpectrum();
            }
        });

        // Keyboard shortcut: Spacebar to cycle spectrum
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                event.preventDefault();
                this.shiftSpectrum();
            }
        });

        // Ensure canvas resize responsiveness
        window.addEventListener('resize', () => {
            if (this.app?.three?.resize) {
                this.app.three.resize();
            }
        }, { passive: true });
    }

    shiftSpectrum(customPalette = null) {
        if (!this.app || !this.app.tubes) return;

        let palette;
        if (customPalette) {
            palette = customPalette;
        } else {
            // Pick next or random different palette
            let nextIndex = (this.paletteIndex + 1) % NEON_PALETTES.length;
            this.paletteIndex = nextIndex;
            palette = NEON_PALETTES[this.paletteIndex];
        }

        // Apply new colors to tubes and lights
        this.app.tubes.setColors(palette.tubes);
        this.app.tubes.setLightsColors(palette.lights);
        if (this.app.tubes.setMaterialOption) {
            this.app.tubes.setMaterialOption('metalness', 0.12);
            this.app.tubes.setMaterialOption('roughness', 0.3);
        }

        // Sound effect (Web Audio API synth blip)
        this.playCyberSound(440 + Math.random() * 400);

        // Trigger UI callback
        if (this.onSpectrumChange) {
            this.onSpectrumChange(palette);
        }

        return palette;
    }

    randomizeSpectrum() {
        const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const customPalette = {
            name: `SPECTRUM // #${Math.floor(Math.random() * 900 + 100)}`,
            tubes: [randomHex(), randomHex(), randomHex()],
            lights: [randomHex(), randomHex(), randomHex(), '#6366f1'],
            accent: randomHex()
        };
        this.shiftSpectrum(customPalette);
    }

    playCyberSound(freq = 520) {
        if (!this.audioEnabled) return;
        try {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const filter = this.audioCtx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.8, this.audioCtx.currentTime + 0.12);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.16);
        } catch (e) {
            // Audio not allowed or failed
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
            this.playCyberSound(660);
        }
        return this.audioEnabled;
    }

    setupCanvasFallback() {
        // Fallback 2D glowing kinetic ribbons if WebGL context isn't available
        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        let width = this.canvas.width = window.innerWidth;
        let height = this.canvas.height = window.innerHeight;

        const points = [];
        const numPoints = 20;
        let mouse = { x: width / 2, y: height / 2 };

        for (let i = 0; i < numPoints; i++) {
            points.push({ x: width / 2, y: height / 2 });
        }

        window.addEventListener('pointermove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('resize', () => {
            width = this.canvas.width = window.innerWidth;
            height = this.canvas.height = window.innerHeight;
        });

        const loop = () => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(0, 0, width, height);

            let head = points[0];
            head.x += (mouse.x - head.x) * 0.15;
            head.y += (mouse.y - head.y) * 0.15;

            for (let i = 1; i < numPoints; i++) {
                points[i].x += (points[i - 1].x - points[i].x) * 0.35;
                points[i].y += (points[i - 1].y - points[i].y) * 0.35;
            }

            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#6366f1';
            ctx.shadowColor = '#6366f1';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < numPoints - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.stroke();

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
