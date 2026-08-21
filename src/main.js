import { supabase } from './lib/supabase.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
if (menu) menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
});
if (nav) nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (menu) menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
}));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.site-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-40% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
document.querySelectorAll('.step').forEach(step => step.addEventListener('mouseenter', () => {
    document.querySelectorAll('.step').forEach(item => item.classList.remove('active'));
    step.classList.add('active');
}));
const productStage = document.querySelector('.product-stage');
const productObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting)), { threshold: 0.35 });
if (productStage) productObserver.observe(productStage);
const metricObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('counted');
        metricObserver.unobserve(entry.target);
    }
}), { threshold: 0.7 });
document.querySelectorAll('.metrics-grid strong').forEach(metric => metricObserver.observe(metric));
const hero = document.querySelector('.hero');
if (!reduceMotion && window.matchMedia('(min-width: 801px)').matches && hero) hero.addEventListener('mousemove', event => {
    const visual = document.querySelector('#network-canvas');
    visual.style.transform = `translate(${(event.clientX / window.innerWidth - .5) * 12}px, ${(event.clientY / window.innerHeight - .5) * 8}px)`;
});
const contactForm = document.querySelector('.contact-form');
if (contactForm) contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    status.textContent = 'Sending...';
    submitButton.disabled = true;

    const { error } = await supabase.from('contact_messages').insert({
        name: formData.get('name'),
        email: formData.get('email'),
        project: formData.get('project'),
        message: formData.get('message')
    });

    submitButton.disabled = false;

    if (error) {
        status.textContent = 'Unable to send your message. Please try again.';
        console.error('Contact form submission failed:', error);
        return;
    }

    status.textContent = 'Thanks — we’ll be in touch shortly.';
    form.reset();
});
if (!reduceMotion) document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', event => {
        const box = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .12}px, ${(event.clientY - box.top - box.height / 2) * .12}px)`;
    });
    button.addEventListener('mouseleave', () => { button.style.transform = ''; });
});
const canvas = document.querySelector('#network-canvas');
if (canvas) {
    const context = canvas.getContext('2d');
    let points = [];
    let frame;
    const resize = () => {
        const ratio = window.devicePixelRatio;
        canvas.width = canvas.clientWidth * ratio;
        canvas.height = canvas.clientHeight * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        points = Array.from({ length: window.innerWidth < 700 ? 28 : 54 }, (_, index) => ({ x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: index % 5 === 0 ? 2.2 : 1 }));
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
                    context.strokeStyle = `rgba(197, 255, 78, ${.11 * (1 - distance / 150)})`;
                    context.beginPath();
                    context.moveTo(point.x, point.y);
                    context.lineTo(other.x, other.y);
                    context.stroke();
                }
            });
            context.fillStyle = point.r > 1 ? '#c5ff4e' : 'rgba(197,255,78,.35)';
            context.beginPath();
            context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
            context.fill();
        });
        if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    if (reduceMotion) cancelAnimationFrame(frame);
}
window.addEventListener('load', () => document.body.classList.add('loaded'));