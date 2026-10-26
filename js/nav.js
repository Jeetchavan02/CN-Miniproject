/**
 * nav.js - Shared navbar logic, mobile toggle, active link highlights & particle generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollAnimations();
});

function initNavbar() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile menu toggle
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (toggleBtn && navLinksContainer) {
    toggleBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const isOpen = navLinksContainer.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Header scroll blur effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

function initParticles() {
  const container = document.querySelector('.particles-bg');
  if (!container) return;

  const count = 35;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 4 + 2;
    const posX = Math.random() * 100;
    const duration = Math.random() * 14 + 8;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.4 + 0.1;
    
    // Some cyan, some purple
    const color = Math.random() > 0.5 ? '#00d4ff' : '#9d4edd';

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`;
    particle.style.background = color;
    particle.style.opacity = opacity;

    container.appendChild(particle);
  }
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.glass-card, .stat-card, .takeaway-card, .diagram-box, .chart-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

// Global class for animated entrance
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .fade-in-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);
