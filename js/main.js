/* =========================================================
   FAI — La Valle dell'Aniene  |  main.js
   ========================================================= */
'use strict';

// ── HERO reveal on load ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('visible'), 100);

  // Theme toggle — no storage, sandbox-safe
  const themeBtn = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const applyTheme = () => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro');
      themeBtn.innerHTML = theme === 'dark'
        ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
    }
  };
  applyTheme();
  themeBtn && themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  // Sticky header shadow
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header && header.classList.toggle('scrolled', window.scrollY > 20);
    btt && btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Mobile menu
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  menuBtn && menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on link click
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn && menuBtn.classList.remove('open');
    });
  });

  // ── SCROLL REVEAL via IntersectionObserver ─────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        // Staggered delay for grids
        const idx = parseInt(el.dataset.reveal || '0');
        el.style.transitionDelay = `${idx * 0.12}s`;
        el.classList.add('visible', 'revealed');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .card-3d, .tl-step, .bento-card').forEach((el, i) => {
    el.dataset.reveal = i % 8;
    io.observe(el);
  });

  // ── 3D Card mouse tilt ─────────────────────────────────
  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── 3D tilt per callout cards ───────────────────────────
  document.querySelectorAll('.callout').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 3}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── IN-PAGE TABS ────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.page-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
      // Re-trigger IO for newly-visible panels
      document.querySelectorAll(`#${target} .card-3d:not(.revealed), #${target} .reveal:not(.visible)`).forEach(el => {
        el.classList.add('visible', 'revealed');
      });
    });
  });

  // ── LIGHTBOX ────────────────────────────────────────────
  const lb = document.querySelector('.lightbox');
  const lbImg = lb && lb.querySelector('.lightbox-img');
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.parentElement.addEventListener('click', () => {
      if (!lb || !lbImg) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
    });
  });

  // Designed fallback for broken images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.alt = img.alt || 'Immagine non disponibile';
      img.style.background = 'var(--fai-cream-3)';
    }, { once: true });
  });
  lb && lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) {
      lb.classList.remove('open');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lb && lb.classList.remove('open');
  });

  // ── BACK TO TOP ─────────────────────────────────────────
  const btt = document.querySelector('.back-to-top');
  btt && btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── ACTIVE NAV LINK on scroll ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => sectionIO.observe(s));
});
