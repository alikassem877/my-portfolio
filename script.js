// === Scroll Progress Bar ===
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress);

// === Header Scroll Effect ===
const header = document.querySelector('header.navbar');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// === Mobile Menu Toggle ===
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
  });
}

// === Close Mobile Menu When Link Clicked ===
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// === Smooth Scroll to Sections ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: 'smooth'
        });
      }
    }
  });
});

// === Intersection Observer for Animations ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.animation = 'fadeInUp 0.8s ease-out';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// === Observe All Sections ===
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// === Add Keyboard Navigation ===
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    if (menuToggle && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// === Initialize on Page Load ===
window.addEventListener('load', () => {
  updateScrollProgress();
  
  // Preload images for smoother experience
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.loading = 'lazy';
  });
});

// === Update Progress on Resize ===
window.addEventListener('resize', updateScrollProgress);

// === Contact Links Error Handling ===
document.querySelectorAll('.contact-link').forEach(link => {
  link.addEventListener('click', function(e) {
    // Allow normal behavior for external links and mailto
    const href = this.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
    }
  });
});

// === Resume Button Behavior ===
const resumeButton = document.getElementById('resume-button');

if (resumeButton) {
  resumeButton.addEventListener('click', () => {
    window.open('Ali_Kassem_Resume.pdf', '_blank', 'noopener');
  });
}

console.log('Portfolio loaded successfully! 🚀');
