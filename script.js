(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('.navbar');
  const progress = document.querySelector('.scroll-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const themeToggle = document.querySelector('.theme-toggle');

  // === Scroll progress + header state (one throttled handler) ===
  let ticking = false;
  const onScroll = () => {
    const max = root.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('scrolled', window.scrollY > 10);
    ticking = false;
  };
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  // === Mobile menu ===
  const setMenu = (open) => {
    menuToggle.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !header.contains(e.target)) setMenu(false);
  });

  // === Theme toggle (remembers choice, falls back to system preference) ===
  const updateThemeLabel = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
  };

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
  if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }
  updateThemeLabel();

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    updateThemeLabel();
  });

  // === Highlight the nav link for the section in view ===
  const sections = [...document.querySelectorAll('main section[id]')];
  const linkFor = (id) => document.querySelector(`.nav-menu a[href="#${id}"]`);

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => {
          l.classList.remove('active');
          l.removeAttribute('aria-current');
        });
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => spy.observe(s));

  // Clear the highlight when back at the hero
  window.addEventListener('scroll', () => {
    if (window.scrollY < 200) {
      navLinks.forEach((l) => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
    }
  }, { passive: true });
})();