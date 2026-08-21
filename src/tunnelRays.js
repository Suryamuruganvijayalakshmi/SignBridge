/**
 * SignBridge Perspective Light Rays Engine
 * Renders 20-30 thin, luminous 3D optical fiber light rays radiating from vanishing point.
 * Responds to scroll progress (0..1) and mouse cursor movement.
 */

export class TunnelRaysEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.scrollProgress = 0; // 0 = dark hero intro, 1 = exploded white transition
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    this.rays = [];
    this.numRays = 24;
    this.animationFrameId = null;

    this.colors = [
      { r: 56, g: 189, b: 248 },
      { r: 147, g: 197, b: 253 },
      { r: 125, g: 211, b: 252 }
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createRays();
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      // Normalized -1 to 1
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  createRays() {
    this.rays = [];
    const count = window.innerWidth < 768 ? 14 : this.numRays;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.15 - 0.075);
      const color = this.colors[i % this.colors.length];
      
      this.rays.push({
        angle,
        lengthFactor: 0.65 + Math.random() * 0.7, // multiplier for screen radius
        width: 1.2 + Math.random() * 2.2,         // ray line width
        color,
        opacity: 0.35 + Math.random() * 0.5,
        speed: 0.002 + Math.random() * 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        z: Math.random() * 800 + 100 // 3D depth position
      });
    }
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  render(time = 0) {
    // Smooth mouse inertia
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Center vanishing point (reacting subtly to mouse)
    const cx = this.width / 2 + this.mouseX * 35;
    const cy = this.height / 2 + this.mouseY * 25;
    const maxRadius = Math.sqrt(this.width * this.width + this.height * this.height) * 0.65;

    // As scroll progresses, dark overlay fades into white
    const darkAlpha = 1 - Math.min(1, this.scrollProgress * 2.2);

    if (darkAlpha > 0.01) {
      // Atmospheric central radial glow in dark hero
      const glowRadius = 250 + Math.sin(time * 0.0015) * 30 + this.scrollProgress * 400;
      const bgGlow = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
      bgGlow.addColorStop(0, `rgba(255, 178, 190, ${0.28 * darkAlpha})`);
      bgGlow.addColorStop(0.4, `rgba(147, 197, 253, ${0.14 * darkAlpha})`);
      bgGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.save();
      this.ctx.fillStyle = bgGlow;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
    }

    // A restrained 3D wireframe prism replaces the former flat ray burst.
    const opacity = Math.max(0, 1 - this.scrollProgress * 1.35);
    if (opacity <= 0.01) return;

    const rotation = time * 0.00045;
    const scale = Math.min(this.width, this.height) * 0.22;
    const points = [];
    const cube = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));

    cube.forEach(([x, y, z]) => {
      const twistX = x * Math.cos(rotation) - z * Math.sin(rotation);
      const twistZ = x * Math.sin(rotation) + z * Math.cos(rotation);
      const tiltY = y * Math.cos(rotation * 0.7) - twistZ * Math.sin(rotation * 0.7);
      const depth = y * Math.sin(rotation * 0.7) + twistZ * Math.cos(rotation * 0.7) + 4;
      points.push([cx + (twistX * scale) / depth, cy + (tiltY * scale) / depth, depth]);
    });

    const edges = [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]];
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.lineWidth = 1.2;
    edges.forEach(([from, to], index) => {
      const gradient = this.ctx.createLinearGradient(points[from][0], points[from][1], points[to][0], points[to][1]);
      const color = index % 3 === 0 ? '56, 189, 248' : index % 3 === 1 ? '147, 197, 253' : '125, 211, 252';
      gradient.addColorStop(0, `rgba(${color}, 0.05)`);
      gradient.addColorStop(0.5, `rgba(${color}, 0.8)`);
      gradient.addColorStop(1, `rgba(${color}, 0.05)`);
      this.ctx.strokeStyle = gradient;
      this.ctx.beginPath();
      this.ctx.moveTo(points[from][0], points[from][1]);
      this.ctx.lineTo(points[to][0], points[to][1]);
      this.ctx.stroke();
    });

    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    this.ctx.lineWidth = 1;
    [0.8, 1.15, 1.5].forEach((radius, index) => {
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy, scale * radius, scale * radius * 0.34, rotation + index, 0, Math.PI * 2);
      this.ctx.stroke();
    });
    this.ctx.restore();
  }

  start() {
    const loop = (time) => {
      this.render(time);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
