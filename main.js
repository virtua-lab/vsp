// --- Constants & Config ---
const slogans = ["記憶に残る体験を。", "MEMORABLE EXPERIENCE."];
let sloganIndex = 0;
const typingDelay = 120;
const eraseDelay = 60;
const nextTextDelay = 3000;
const dotDelay = 800; // Delay for the last period "."

// --- Loading System ---
window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const bar = document.querySelector('.loader-bar');
    const percentage = document.querySelector('.loader-percentage');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        bar.style.width = `${progress}%`;
        percentage.textContent = `${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loader-finished');
                startTyping();
            }, 500);
        }
    }, 150);
});

// --- Typing Animation (Advanced Timing) ---
const sloganElement = document.getElementById('typing-slogan');

function startTyping() {
    typeText(slogans[0], 0);
}

function typeText(text, index) {
    if (index < text.length) {
        // Check if the current character is the last dot "。" of the first slogan
        const isLastDot = (sloganIndex === 0 && index === text.length - 1 && text[index] === "。");

        if (isLastDot) {
            // Delay specifically for the dot
            setTimeout(() => {
                sloganElement.textContent += text.charAt(index);
                setTimeout(eraseText, nextTextDelay);
            }, dotDelay);
        } else {
            sloganElement.textContent += text.charAt(index);
            setTimeout(() => typeText(text, index + 1), typingDelay);
        }
    } else {
        if (!(sloganIndex === 0)) {
            setTimeout(eraseText, nextTextDelay);
        }
    }
}

function eraseText() {
    const text = sloganElement.textContent;
    if (text.length > 0) {
        sloganElement.textContent = text.substring(0, text.length - 1);
        setTimeout(eraseText, eraseDelay);
    } else {
        sloganIndex = (sloganIndex + 1) % slogans.length;
        setTimeout(() => typeText(slogans[sloganIndex], 0), 500);
    }
}

// --- Particle Background System ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticleCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.life = Math.random() * 0.5 + 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(0, 229, 255, ${this.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < 100; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticleCanvas);
initParticleCanvas();
createParticles();
animateParticles();

// --- Glitch & Other Logic ---
setInterval(() => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.classList.add('glitch-active');
        setTimeout(() => hero.classList.remove('glitch-active'), 200);
    }
}, 4000);

// --- Email Copy Interaction ---
const email = document.querySelector('.email');
if (email) {
    email.addEventListener('click', () => {
        const text = email.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Create pop-out element
            const notif = document.createElement('span');
            notif.textContent = 'copy';
            notif.className = 'copy-notif';
            email.appendChild(notif);

            // Remove after animation
            setTimeout(() => {
                notif.remove();
            }, 1000);
        });
    });
}

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
