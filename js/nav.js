// Initialize theme immediately to prevent flashing
(function() {
  const savedTheme = localStorage.getItem('quiclab-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initParticles();
  initScrollAnimations();
});

function initTheme() {
  const savedTheme = localStorage.getItem('quiclab-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Check if theme toggle button exists or inject it into .nav-container
  let themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) {
    const navContainer = document.querySelector('.nav-container');
    const navToggle = document.querySelector('.nav-toggle');
    if (navContainer) {
      themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle-btn';
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', 'Toggle Light and Dark Mode');
      themeBtn.setAttribute('title', 'Toggle Light / Dark Mode');
      themeBtn.innerHTML = `
        <svg class="sun-icon ui-icon ui-icon-stroke" viewBox="0 0 24 24" style="width:18px;height:18px;">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon ui-icon ui-icon-stroke" viewBox="0 0 24 24" style="width:18px;height:18px;">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      if (navToggle) {
        navContainer.insertBefore(themeBtn, navToggle);
      } else {
        navContainer.appendChild(themeBtn);
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('quiclab-theme', newTheme);
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    });
  }
}

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
