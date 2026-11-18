import confetti from 'canvas-confetti';

/**
 * Fires multi-stage celebratory paper confetti blowing from the bottom of the screen to the top.
 */
export function fireCelebrationConfetti() {
    if (typeof window === 'undefined') return;

    const defaults = {
        origin: { y: 1.0 }, // Shoots up from bottom of viewport!
        zIndex: 999999,
        disableForReducedMotion: true,
    };

    const festiveColors = [
        '#2563eb', // Royal Blue
        '#3b82f6', // Sky Blue
        '#10b981', // Emerald Green
        '#f59e0b', // Amber Gold
        '#ec4899', // Vivid Pink
        '#8b5cf6', // Violet Purple
        '#06b6d4', // Bright Cyan
        '#f97316', // Orange
        '#e11d48', // Ruby
    ];

    // 1. Initial powerful blast shooting straight UP from bottom-center
    confetti({
        ...defaults,
        origin: { x: 0.5, y: 1.0 },
        particleCount: 85,
        angle: 90,
        spread: 85,
        startVelocity: 68,
        colors: festiveColors,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        ticks: 360,
    });

    // 2. Bottom-left cannon blowing up-right towards the top
    setTimeout(() => {
        confetti({
            ...defaults,
            origin: { x: 0.12, y: 1.0 },
            particleCount: 65,
            angle: 68,
            spread: 65,
            startVelocity: 72,
            colors: festiveColors,
            shapes: ['square', 'circle'],
            scalar: 1.1,
            ticks: 360,
        });
    }, 180);

    // 3. Bottom-right cannon blowing up-left towards the top
    setTimeout(() => {
        confetti({
            ...defaults,
            origin: { x: 0.88, y: 1.0 },
            particleCount: 65,
            angle: 112,
            spread: 65,
            startVelocity: 72,
            colors: festiveColors,
            shapes: ['square', 'circle'],
            scalar: 1.1,
            ticks: 360,
        });
    }, 360);

    // 4. Grand center spray with wide spread
    setTimeout(() => {
        confetti({
            ...defaults,
            origin: { x: 0.5, y: 1.0 },
            particleCount: 95,
            angle: 90,
            spread: 120,
            startVelocity: 75,
            colors: festiveColors,
            shapes: ['square', 'circle'],
            scalar: 1.25,
            ticks: 380,
        });
    }, 550);

    // 5. Ambient fluttering stream of colorful paper ribbons rising from bottom across the screen
    const end = Date.now() + 3200;
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            ...defaults,
            origin: { x: 0.15 + Math.random() * 0.7, y: 1.0 },
            particleCount: 22,
            angle: 90 + (Math.random() - 0.5) * 30,
            spread: 55,
            startVelocity: 55 + Math.random() * 22,
            colors: festiveColors,
            shapes: ['square'],
            scalar: 1.0 + Math.random() * 0.4,
            ticks: 320,
            drift: (Math.random() - 0.5) * 1.5,
        });
    }, 220);
}
