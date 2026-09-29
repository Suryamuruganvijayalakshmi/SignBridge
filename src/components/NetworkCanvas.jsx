import { useEffect, useRef } from 'react';

export default function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let points = [];
    let animationFrameId;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      points = Array.from({ length: window.innerWidth < 700 ? 28 : 54 }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: index % 5 === 0 ? 2.2 : 1
      }));
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      context.clearRect(0, 0, w, h);

      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > w) point.vx *= -1;
        if (point.y < 0 || point.y > h) point.vy *= -1;
      });

      points.forEach((point, index) => {
        points.slice(index + 1).forEach(other => {
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 150) {
            context.strokeStyle = `rgba(37, 99, 235, ${0.12 * (1 - distance / 150)})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        });

        context.fillStyle = point.r > 1 ? '#2563eb' : 'rgba(37, 99, 235, 0.35)';
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
      });

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="network-canvas" aria-hidden="true" />;
}
