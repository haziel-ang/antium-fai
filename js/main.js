/* =========================================================
   FAI — La Valle dell'Aniene  |  main.js
   ========================================================= */
'use strict';

// ── HERO reveal on load ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('visible'), 100);

  // Sticky header shadow
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header && header.classList.toggle('scrolled', window.scrollY > 20);
    btt && btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Mobile menu
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.menu-links');
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

  // ── EXPLORE PANEL (cards pergamena) ─────────────────────
  const exploreTrigger = document.querySelector('[data-discover-trigger]');
  const explorePanel   = document.querySelector('[data-explore-panel]');
  if (exploreTrigger && explorePanel) {
    const heroForExplore = exploreTrigger.closest('.hero');
    const setOpen = (open) => {
      exploreTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      explorePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
      heroForExplore && heroForExplore.classList.toggle('explore-open', open);
      if (open) {
        explorePanel.hidden = false;
        // forza reflow per attivare la transizione
        void explorePanel.offsetWidth;
        explorePanel.classList.add('is-open');
      } else {
        explorePanel.classList.remove('is-open');
        // nascondi al termine della transizione
        setTimeout(() => {
          if (!explorePanel.classList.contains('is-open')) explorePanel.hidden = true;
        }, 400);
      }
    };
    exploreTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(exploreTrigger.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && exploreTrigger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        exploreTrigger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (exploreTrigger.getAttribute('aria-expanded') !== 'true') return;
      if (explorePanel.contains(e.target) || exploreTrigger.contains(e.target)) return;
      setOpen(false);
    });
    explorePanel.addEventListener('click', (e) => {
      if (e.target === explorePanel) setOpen(false);
    });
  }

  // ── IN-PAGE TABS ────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.page-panel');
  const tabsInner = document.querySelector('.tabs-inner');
  const tabsPrev  = document.querySelector('[data-tabs-prev]');
  const tabsNext  = document.querySelector('[data-tabs-next]');

  const updateTabsArrows = () => {
    if (!tabsInner || !tabsPrev || !tabsNext) return;
    const max = tabsInner.scrollWidth - tabsInner.clientWidth - 1;
    tabsPrev.disabled = tabsInner.scrollLeft <= 0;
    tabsNext.disabled = tabsInner.scrollLeft >= max;
  };

  const scrollTabs = (dir) => {
    if (!tabsInner) return;
    const step = Math.max(160, tabsInner.clientWidth * 0.7);
    tabsInner.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (tabsPrev) tabsPrev.addEventListener('click', () => scrollTabs(-1));
  if (tabsNext) tabsNext.addEventListener('click', () => scrollTabs(1));
  if (tabsInner) {
    tabsInner.addEventListener('scroll', updateTabsArrows, { passive: true });
    window.addEventListener('resize', updateTabsArrows);
    requestAnimationFrame(updateTabsArrows);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      if (btn.classList.contains('active')) return;
      tabBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      // Animate panel transition: fade out current, swap, fade in
      const currentActive = document.querySelector('.page-panel.active');
      const nextPanel = document.getElementById(target);
      if (currentActive && currentActive !== nextPanel) {
        currentActive.style.opacity = '0';
        currentActive.style.transform = 'translateY(8px)';
        setTimeout(() => {
          panels.forEach(p => p.classList.toggle('active', p.id === target));
          if (nextPanel) {
            nextPanel.style.opacity = '';
            nextPanel.style.transform = '';
          }
        }, 220);
      } else {
        panels.forEach(p => p.classList.toggle('active', p.id === target));
      }
      // Re-trigger IO for newly-visible panels
      document.querySelectorAll(`#${target} .card-3d:not(.revealed), #${target} .reveal:not(.visible)`).forEach(el => {
        el.classList.add('visible', 'revealed');
      });
      // Center the active card inside the carousel
      if (tabsInner) {
        const offset = btn.offsetLeft - (tabsInner.clientWidth / 2) + (btn.offsetWidth / 2);
        tabsInner.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
      }
      // ── Sync the section showcase (hero per section) ───
      updateShowcase(btn);
    });
  });

  // ── SECTION SHOWCASE SYNC ───────────────────────────────
  const showcase   = document.querySelector('[data-section-showcase]');
  const showcaseBg = document.querySelector('[data-showcase-bg]');
  const showcaseNum   = document.querySelector('[data-showcase-num]');
  const showcaseEra   = document.querySelector('[data-showcase-era]');
  const showcaseTitle = document.querySelector('[data-showcase-title]');
  const showcaseSub   = document.querySelector('[data-showcase-sub]');
  const showcasePdf   = document.querySelector('[data-showcase-pdf]');

  function updateShowcase(btn) {
    if (!showcase || !btn) return;
    const total = tabBtns.length;
    const idx = Array.from(tabBtns).indexOf(btn) + 1;
    const num = String(idx).padStart(2, '0');
    showcase.classList.add('is-changing');
    setTimeout(() => {
      if (showcaseNum)   showcaseNum.textContent   = `${num} / ${String(total).padStart(2,'0')}`;
      if (showcaseEra)   showcaseEra.textContent   = btn.dataset.era || '';
      if (showcaseTitle) showcaseTitle.textContent = btn.dataset.title || '';
      if (showcaseSub)   showcaseSub.textContent   = btn.dataset.subtitle || '';
      if (showcasePdf && btn.dataset.pdf) showcasePdf.setAttribute('href', btn.dataset.pdf);
      if (showcaseBg && btn.dataset.bg) {
        showcaseBg.style.backgroundImage = `url('${btn.dataset.bg}')`;
      }
      // Update the document title hint (browser tab) to reflect the current section
      if (btn.dataset.title) {
        document.title = `Antium · ${btn.dataset.title}`;
      }
      requestAnimationFrame(() => showcase.classList.remove('is-changing'));
    }, 220);
  }

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
  const navAs    = document.querySelectorAll('.menu-link[href^="#"]');
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

  // ── FULL-TEXT SEARCH ─────────────────────────────────────
  (function initSiteSearch() {
    const form    = document.querySelector('[data-site-search]');
    const input   = document.querySelector('[data-site-search-input]');
    const status  = document.querySelector('[data-site-search-status]');
    const counter = document.querySelector('[data-site-search-count]');
    const prevBtn = document.querySelector('[data-site-search-prev]');
    const nextBtn = document.querySelector('[data-site-search-next]');
    const clearBtn= document.querySelector('[data-site-search-clear]');
    const main    = document.querySelector('main#contenuto');
    if (!form || !input || !main) return;

    let hits = [];
    let current = -1;
    let debounceId = null;

    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function clearHighlights() {
      main.querySelectorAll('mark.search-hit').forEach(m => {
        const parent = m.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });
      hits = [];
      current = -1;
      if (status) status.hidden = true;
    }

    function highlight(query) {
      if (!query || query.length < 2) { clearHighlights(); return; }
      clearHighlights();
      const re = new RegExp(escapeRegExp(query), 'gi');
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const p = node.parentNode;
          if (!p || ['SCRIPT','STYLE','MARK','NOSCRIPT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest('.brand-search,.site-topbar,.site-menubar,.lightbox')) return NodeFilter.FILTER_REJECT;
          re.lastIndex = 0;
          return re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const targets = [];
      let n;
      while ((n = walker.nextNode())) targets.push(n);

      targets.forEach(node => {
        const text = node.nodeValue;
        re.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        while ((m = re.exec(text))) {
          if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const mark = document.createElement('mark');
          mark.className = 'search-hit';
          mark.textContent = m[0];
          frag.appendChild(mark);
          hits.push(mark);
          last = m.index + m[0].length;
          if (m.index === re.lastIndex) re.lastIndex++; // safety
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        if (node.parentNode) node.parentNode.replaceChild(frag, node);
      });

      if (status && counter) {
        status.hidden = hits.length === 0;
        counter.textContent = hits.length === 1
          ? '1 risultato'
          : `${hits.length} risultati`;
      }
      if (hits.length > 0) goTo(0);
    }

    function ensureVisible(el) {
      // If hit is inside an inactive .page-panel, switch to that panel via its tab button
      const panel = el.closest && el.closest('.page-panel');
      if (panel && !panel.classList.contains('active')) {
        const id = panel.id;
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
        if (tabBtn) tabBtn.click();
      }
    }

    function goTo(index) {
      if (!hits.length) return;
      if (index < 0) index = hits.length - 1;
      if (index >= hits.length) index = 0;
      hits.forEach((m, i) => m.classList.toggle('is-current', i === index));
      current = index;
      const target = hits[index];
      ensureVisible(target);
      // Wait a frame in case panel switched
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      if (counter) {
        counter.textContent = `${index + 1} / ${hits.length}`;
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(debounceId);
      const q = input.value.trim();
      debounceId = setTimeout(() => highlight(q), 220);
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!hits.length) highlight(input.value.trim());
      else goTo(current + 1);
    });
    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
    clearBtn && clearBtn.addEventListener('click', () => {
      input.value = '';
      clearHighlights();
      input.focus();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hits.length) {
        input.value = '';
        clearHighlights();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  })();
});
