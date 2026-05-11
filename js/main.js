/* =========================================================
   FAI — La Valle dell'Aniene  |  main.js
   ========================================================= */
'use strict';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('pageshow', () => {
  window.scrollTo(0, 0);
});

// ── HERO reveal on load ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('visible'), 100);

  // Sticky header shadow
  const header = document.querySelector('.site-header');
  const btt = document.querySelector('.back-to-top');
  const footer = document.querySelector('.simple-footer, .site-footer');
  const fitHeroesToViewport = () => {
    const available = Math.max(0, window.innerHeight - (header ? header.offsetHeight : 0));
    document.querySelectorAll('.hero[data-fit-viewport="true"]').forEach(heroEl => {
      heroEl.classList.remove('hero--fit-viewport');
      const naturalHeight = heroEl.scrollHeight;
      if (naturalHeight > available) {
        heroEl.classList.add('hero--fit-viewport');
      }
    });
  };
  const pagePath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  const lockCompactHeader = pagePath.endsWith('/pdf.html') || pagePath.endsWith('/podcast.html') || pagePath.endsWith('/sezioni/volsci-cicerone-culti.html');
  const updateHeaderState = () => {
    if (!header) return;
    const shouldCompact = lockCompactHeader || window.scrollY > 20;
    header.classList.toggle('scrolled', shouldCompact);
  };
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--site-header-height', `${header ? header.offsetHeight : 0}px`);
  };
  const updateBackToTopOffset = () => {
    if (!btt) return;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const base = isMobile ? 20 : 28;
    if (!footer) {
      btt.style.bottom = `${base}px`;
      return;
    }
    const rect = footer.getBoundingClientRect();
    const overlap = Math.max(0, window.innerHeight - rect.top + 12);
    btt.style.bottom = `${Math.round(base + overlap)}px`;
  };
  updateHeaderState();
  setHeaderHeight();
  updateBackToTopOffset();
  window.addEventListener('resize', () => {
    updateHeaderState();
    setHeaderHeight();
  });
  window.addEventListener('scroll', () => {
    updateHeaderState();
    setHeaderHeight();
    updateBackToTopOffset();
    btt && btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  const runLayoutRecalc = () => {
    setHeaderHeight();
    fitHeroesToViewport();
    updateBackToTopOffset();
  };
  const scheduleLayoutRecalc = () => {
    requestAnimationFrame(() => requestAnimationFrame(runLayoutRecalc));
  };

  // Ensure correct geometry after page transitions and async font/image loads.
  scheduleLayoutRecalc();
  window.addEventListener('load', scheduleLayoutRecalc);
  window.addEventListener('pageshow', scheduleLayoutRecalc);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleLayoutRecalc).catch(() => {});
  }
  document.querySelectorAll('.brand-logo img').forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', scheduleLayoutRecalc, { once: true });
    }
  });

  // Mobile menu
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.menu-links');
  const mobileSearchPanel = document.querySelector('.mobile-search-panel');
  menuBtn && menuBtn.addEventListener('click', () => {
    const targetPanel = mobileSearchPanel || navLinks;
    if (!targetPanel) return;
    const open = targetPanel.classList.toggle('open');
    if (mobileSearchPanel) mobileSearchPanel.hidden = !open;
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

  // ── HERO ERAS — drag to scroll on narrow viewports ─────
  const heroEras = document.querySelector('.hero-eras');
  if (heroEras) {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    heroEras.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      if (heroEras.scrollWidth <= heroEras.clientWidth) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = heroEras.scrollLeft;
      heroEras.classList.add('is-dragging');
    });
    heroEras.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      heroEras.scrollLeft = startScroll - dx;
    });
    const endDrag = () => {
      isDown = false;
      heroEras.classList.remove('is-dragging');
    };
    heroEras.addEventListener('pointerup', endDrag);
    heroEras.addEventListener('pointercancel', endDrag);
    heroEras.addEventListener('pointerleave', endDrag);
    heroEras.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
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
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const creditPreviewButtons = document.querySelectorAll('[data-credit-image]');
  let lightboxParts = null;

  function ensureLightbox() {
    if (lightboxParts) return lightboxParts;

    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Chiudi immagine">×</button>
        <img class="lightbox-img" src="" alt="">
      `;
      document.body.appendChild(lightbox);
    }
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Anteprima immagine');

    const image = lightbox.querySelector('.lightbox-img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let caption = lightbox.querySelector('.lightbox-caption');
    if (!caption) {
      caption = document.createElement('div');
      caption.className = 'lightbox-caption';
      caption.innerHTML = `
        <p class="lightbox-caption-title"></p>
        <p class="lightbox-caption-note"></p>
        <a class="lightbox-caption-source" href="#" target="_blank" rel="noopener noreferrer"></a>
      `;
      lightbox.appendChild(caption);
    }

    lightboxParts = {
      lightbox,
      image,
      closeButton,
      title: caption.querySelector('.lightbox-caption-title'),
      note: caption.querySelector('.lightbox-caption-note'),
      source: caption.querySelector('.lightbox-caption-source')
    };

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox || event.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    return lightboxParts;
  }

  function openLightbox(details) {
    const parts = ensureLightbox();
    if (!parts.image) return;

    parts.image.src = details.src || '';
    parts.image.alt = details.alt || details.title || 'Immagine';
    if (parts.title) parts.title.textContent = details.title || '';
    if (parts.note) parts.note.textContent = details.note || '';
    if (parts.source) {
      if (details.source) {
        parts.source.href = details.source;
        parts.source.textContent = details.sourceLabel || 'Apri fonte';
        parts.source.hidden = false;
      } else {
        parts.source.hidden = true;
      }
    }

    parts.lightbox.classList.add('open');
    parts.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    parts.closeButton && parts.closeButton.focus();
  }

  function closeLightbox() {
    if (!lightboxParts) return;
    lightboxParts.lightbox.classList.remove('open');
    lightboxParts.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryImages.forEach(img => {
    img.parentElement.addEventListener('click', () => {
      openLightbox({
        src: img.src,
        alt: img.alt,
        title: img.alt
      });
    });
  });

  creditPreviewButtons.forEach(button => {
    button.addEventListener('click', () => {
      openLightbox({
        src: button.dataset.creditImage,
        title: button.dataset.creditTitle || button.textContent.trim(),
        note: button.dataset.creditNote || '',
        source: button.dataset.creditSource || '',
        sourceLabel: button.dataset.creditSourceLabel || 'Apri fonte'
      });
    });
  });

  // Designed fallback for broken images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.alt = img.alt || 'Immagine non disponibile';
      img.style.background = 'var(--fai-cream-3)';
    }, { once: true });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── BACK TO TOP ─────────────────────────────────────────
  btt && btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── HOME HERO FIT VIEWPORT ──────────────────────────────
  window.addEventListener('resize', scheduleLayoutRecalc, { passive: true });
  window.addEventListener('orientationchange', scheduleLayoutRecalc, { passive: true });

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
    const controls = Array.from(document.querySelectorAll('[data-site-search]')).map(form => ({
      form,
      input: form.querySelector('[data-site-search-input]'),
      status: form.querySelector('[data-site-search-status]'),
      counter: form.querySelector('[data-site-search-count]'),
      prevBtn: form.querySelector('[data-site-search-prev]'),
      nextBtn: form.querySelector('[data-site-search-next]'),
      clearBtn: form.querySelector('[data-site-search-clear]')
    })).filter(control => control.form && control.input);
    const main    = document.querySelector('main#contenuto');
    if (!controls.length || !main) return;

    let hits = [];
    let current = -1;
    let debounceId = null;
    let activeControl = controls[0];

    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function syncInputs(value) {
      controls.forEach(control => { control.input.value = value; });
    }

    function clearHighlights() {
      main.querySelectorAll('mark.search-hit').forEach(m => {
        const parent = m.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });
      hits = [];
      current = -1;
      controls.forEach(control => {
        if (control.status) control.status.hidden = true;
      });
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

      controls.forEach(control => {
        if (control.status) control.status.hidden = hits.length === 0;
        if (control.counter) {
          control.counter.textContent = hits.length === 1
            ? '1 risultato'
            : `${hits.length} risultati`;
        }
      });
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
      controls.forEach(control => {
        if (control.counter) control.counter.textContent = `${index + 1} / ${hits.length}`;
      });
    }

    controls.forEach(control => {
      control.input.addEventListener('input', () => {
        activeControl = control;
        clearTimeout(debounceId);
        syncInputs(control.input.value);
        const q = control.input.value.trim();
        debounceId = setTimeout(() => highlight(q), 220);
      });
      control.form.addEventListener('submit', e => {
        e.preventDefault();
        activeControl = control;
        if (!hits.length) highlight(control.input.value.trim());
        else goTo(current + 1);
      });
      control.prevBtn && control.prevBtn.addEventListener('click', () => goTo(current - 1));
      control.nextBtn && control.nextBtn.addEventListener('click', () => goTo(current + 1));
      control.clearBtn && control.clearBtn.addEventListener('click', () => {
        syncInputs('');
        clearHighlights();
        control.input.focus();
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hits.length) {
        syncInputs('');
        clearHighlights();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        activeControl.input.focus();
        activeControl.input.select();
      }
    });
  })();

  // ── CREDITS POPUP (contestuale per pagina) ───────────────
  const creditsCatalog = {
    'index.html': {
      subtitle: 'Antium · Home',
      note: 'Crediti grafici principali della pagina iniziale.',
      rows: [
        {
          element: 'Veduta del porto di Anzio con Villa Corsini e Villa Albani',
          author: 'Paolo Anesi (1697–1773)',
          note: 'Pubblico dominio (Wikimedia Commons).'
        },
        {
          element: 'Mosaico con Erote su pantera, Museo Civico Archeologico di Anzio',
          author: 'Gruppo FAI Anzio-Nettuno / Riccardo Pau',
          note: 'Fotografia 2025 usata come sfondo del mosaico numerico in home page.'
        }
      ]
    },
    'pdf.html': {
      subtitle: 'Antium · Archivio PDF',
      note: 'La pagina PDF non contiene elaborazioni grafiche dedicate. Per i crediti completi consulta la pagina Crediti.',
      rows: []
    },
    'podcast.html': {
      subtitle: 'Antium · Podcast',
      note: 'La pagina Podcast non contiene elaborazioni grafiche dedicate. Per i crediti completi consulta la pagina Crediti.',
      rows: []
    },
    'fonti.html': {
      subtitle: 'Antium · Crediti',
      note: 'Questa e la pagina di riferimento per tutti i crediti della serie Antium.',
      rows: []
    },
    'sezioni/vallo.html': {
      subtitle: 'Sezione 01 · Il Vallo di Antium',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Immagine hero — Il Vallo di Antium',
          author: 'Riccardo Pau',
          note: 'Fotografia e rielaborazione grafica.'
        },
        {
          element: 'Planimetria del Vallo di Antium',
          author: 'Riccardo Pau',
          note: 'Tavola descrittiva su fonti Lugli 1940; Egidi–Guidi 2009.'
        }
      ]
    },
    'sezioni/cisternone-caffeaus.html': {
      subtitle: 'Sezione 04 · Il Cisternone e il Caffeaus',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Cisterna prima dello scavo e planimetria attuale',
          author: 'F. Graziani · Aglietti–Arena 2012',
          note: 'Fonte: Lazio e Sabina 8 (2012), fig. 2.'
        },
        {
          element: 'Planimetria sfrondata delle modifiche settecentesche',
          author: 'F. Graziani · Aglietti–Arena 2012',
          note: 'Fonte: Lazio e Sabina 8 (2012), fig. 5.'
        },
        {
          element: 'Carta Topografica di D. Tranquilli (1838)',
          author: 'ASRo · Aglietti–Arena 2012',
          note: 'Disegni e mappe, coll. I, cart. 48, n. 44 (fig. 3).'
        },
        {
          element: 'R. Lanciani, Antico Edificio Romano detto ora Coffee-House',
          author: 'SBAL · Aglietti–Arena 2012',
          note: 'Disegno inedito (fig. 4).'
        },
        {
          element: 'Frammenti marmorei dal Caffeaus',
          author: 'Aglietti–Arena 2012',
          note: 'Fonte: Lazio e Sabina 8 (2012), fig. 8.'
        }
      ]
    },
    'sezioni/necropoli-protostoriche.html': {
      subtitle: 'Sezione 02 · Necropoli protostoriche',
      note: 'Questa sezione non contiene elaborazioni grafiche originali. Le fotografie sono di pubblico dominio o da archivi citati nel testo.',
      rows: []
    },
    'sezioni/tomba-mulakia.html': {
      subtitle: 'Sezione 03 · Tomba Mulakia',
      note: 'Questa sezione non contiene elaborazioni grafiche originali. Le fotografie sono di pubblico dominio o da archivi citati nel testo.',
      rows: []
    },
    'sezioni/villa-imperiale.html': {
      subtitle: 'Sezione 05 · Villa imperiale di Anzio',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Fanciulla di Anzio, Museo Nazionale Romano',
          author: 'MM / Wikimedia Commons',
          note: 'Fotografia CC BY-SA 4.0 usata come immagine hero e figura della sezione.'
        },
        {
          element: "L\u2019Arco Muto",
          author: 'Fotografia storica \u2014 archivio comunale di Anzio',
          note: 'Arcuazioni romane della falesia, demolite nel 1965. Pubblico dominio.'
        },
        {
          element: 'Assetto urbano di Antium, Anzio e Nettuno',
          author: 'Marco Riggi Nettunense / Wikimedia Commons',
          note: 'Foto da tavola di Paola Brandizzi Vittucci, CC BY-SA 3.0.'
        },
        {
          element: 'Gladiatore Borghese, Louvre Ma 527',
          author: 'Jastrow / Wikimedia Commons',
          note: 'Fotografia 2006 rilasciata in pubblico dominio.'
        },
        {
          element: 'Apollo del Belvedere, Musei Vaticani',
          author: 'Livioandronico2013 / Wikimedia Commons',
          note: 'Fotografia CC BY-SA 4.0.'
        }
      ]
    },
    'sezioni/monumenti-citta-alta.html': {
      subtitle: 'Sezione 06 · Monumenti della città alta',
      note: 'Questa sezione non contiene elaborazioni grafiche originali. Le fotografie sono di pubblico dominio o da archivi citati nel testo.',
      rows: []
    },
    'sezioni/volsci-cicerone-culti.html': {
      subtitle: 'Sezione 07 · Volsci, Cicerone e culti',
      note: 'Questa sezione non contiene elaborazioni grafiche originali. Le fotografie sono di pubblico dominio o da archivi citati nel testo.',
      rows: []
    },
    'sezioni/teatro-romano.html': {
      subtitle: 'Sezione 08 · Teatro romano',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Tavola grafica del teatro romano di Antium',
          author: 'Riccardo Pau',
          note: 'Ricostruzione grafica basata sulle fonti storiche (Lugli 1940).'
        }
      ]
    }
  };

  const getPageCredits = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const matchedKey = Object.keys(creditsCatalog).find(key => path.endsWith(key));
    if (matchedKey) return creditsCatalog[matchedKey];

    if (path.includes('/sezioni/')) {
      const heroTitle = document.querySelector('.hero-title');
      const sectionName = heroTitle ? heroTitle.textContent.trim() : 'Sezione';
      return {
        subtitle: `Sezione · ${sectionName}`,
        note: 'Questo popup mostra solo i crediti della sezione corrente.',
        rows: []
      };
    }

    return {
      subtitle: 'Antium · Pagina',
      note: 'Per questa pagina non sono registrati crediti grafici specifici.',
      rows: []
    };
  };

  const getCreditsHref = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    return path.includes('/sezioni/') ? '../fonti.html' : './fonti.html';
  };

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const ensureCreditsTriggersInCaptions = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    if (!path.includes('/sezioni/')) return;

    const captions = Array.from(document.querySelectorAll('figcaption'));
    if (!captions.length) return;

    captions.forEach((caption) => {
      if (caption.querySelector('.credits-trigger')) return;

      const button = document.createElement('button');
      button.className = 'credits-trigger';
      button.type = 'button';
      button.textContent = 'Crediti grafici';

      // Inserisci nel primo <p> della didascalia, se esiste,
      // altrimenti direttamente nella didascalia stessa.
      const firstP = caption.querySelector('p');
      const target = firstP || caption;
      target.appendChild(document.createTextNode('\u00a0'));
      target.appendChild(button);
    });
  };

  const ensureCreditsOverlay = (pageCredits) => {
    if (document.querySelector('.credits-overlay')) return;

    const rowsMarkup = pageCredits.rows.length
      ? pageCredits.rows.map(row => `
          <tr>
            <td>${escapeHtml(row.element)}</td>
            <td>${escapeHtml(row.author)}</td>
            <td>${escapeHtml(row.note)}</td>
          </tr>`).join('')
      : '<tr><td colspan="3">Nessun credito grafico specifico registrato per questa sezione.</td></tr>';

    const overlay = document.createElement('div');
    overlay.className = 'credits-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'credits-popup-title');
    overlay.innerHTML = `
      <div class="credits-popup">
        <button class="credits-popup-close" type="button" aria-label="Chiudi crediti">×</button>
        <span class="credits-popup-ornament" aria-hidden="true">· · ·</span>
        <h2 class="credits-popup-title" id="credits-popup-title">Crediti grafici</h2>
        <p class="credits-popup-subtitle">${escapeHtml(pageCredits.subtitle)}</p>
        <p class="credits-popup-subtitle">${escapeHtml(pageCredits.note)}</p>
        <span class="credits-popup-divider" aria-hidden="true"></span>
        <table class="credits-popup-table">
          <thead>
            <tr>
              <th>Elemento</th>
              <th>Autore</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>${rowsMarkup}
          </tbody>
        </table>
        <p class="credits-popup-footer">Elenco completo: <a href="${getCreditsHref()}">pagina Crediti</a></p>
      </div>`;

    document.body.appendChild(overlay);
  };

  const pageCredits = getPageCredits();
  ensureCreditsTriggersInCaptions();
  ensureCreditsOverlay(pageCredits);

  const creditsOverlay = document.querySelector('.credits-overlay');
  const creditsClose = document.querySelector('.credits-popup-close');

  const openCredits = () => {
    if (!creditsOverlay) return;
    creditsOverlay.classList.add('open');
    creditsOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    creditsClose && creditsClose.focus();
  };
  const closeCredits = () => {
    if (!creditsOverlay) return;
    creditsOverlay.classList.remove('open');
    creditsOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.credits-trigger').forEach(btn => {
    btn.addEventListener('click', openCredits);
  });
  creditsClose && creditsClose.addEventListener('click', closeCredits);
  creditsOverlay && creditsOverlay.addEventListener('click', e => {
    if (e.target === creditsOverlay) closeCredits();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && creditsOverlay && creditsOverlay.classList.contains('open')) {
      closeCredits();
    }
  });
});

/* ============================================================
   MOSAIC TILES — scroll composition animation
   ============================================================ */
(function () {
  'use strict';

  var tiles = document.querySelectorAll('.mosaic-tile');
  if (!tiles.length) return;
  var grid = document.querySelector('.mosaic-grid');

  function updateMosaicBalance() {
    if (!grid) return;

    var width = window.innerWidth || document.documentElement.clientWidth;
    var cols = 4;
    var gap = 12;

    if (width <= 480) {
      cols = 1;
      gap = 10;
    } else if (width <= 768) {
      cols = 2;
      gap = 10;
    } else if (width <= 1100) {
      cols = 3;
    }

    var lastRow = tiles.length % cols || cols;
    var gapTotal = (cols - 1) * gap;
    grid.dataset.mosaicCols = String(cols);
    grid.dataset.mosaicLastRow = String(lastRow);
    grid.style.setProperty('--mosaic-gap', gap + 'px');
    grid.style.setProperty('--mosaic-tile-basis', cols === 1 ? '100%' : 'calc((100% - ' + gapTotal + 'px) / ' + cols + ')');
  }

  updateMosaicBalance();
  window.addEventListener('resize', function () {
    window.requestAnimationFrame(updateMosaicBalance);
  }, { passive: true });

  // Assegna rotazione iniziale e delay progressivo alle tessere.
  tiles.forEach(function (tile, i) {
    var d = parseFloat(tile.dataset.delay || i);
    var tilt = (Math.random() - 0.5) * 6;
    tile.style.setProperty('--mosaic-tilt', tilt + 'deg');
    tile.style.transitionDelay = (d * 0.06) + 's';
  });

  // Intersection observer: compone il mosaico una tessera alla volta.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -60px 0px'
  });

  tiles.forEach(function (t) { io.observe(t); });
}());
