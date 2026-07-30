/* =========================================================
   FAI — La Valle dell'Aniene  |  main.js
   ========================================================= */
'use strict';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const resetScrollPosition = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body && (document.body.scrollTop = 0);
};

window.addEventListener('pageshow', resetScrollPosition);
window.addEventListener('load', resetScrollPosition);
window.addEventListener('popstate', resetScrollPosition);
window.addEventListener('hashchange', resetScrollPosition);

const SEO_DEFAULT_BASE_URL = 'https://haziel-ang.github.io/antium-fai';

const normalizeSiteBaseUrl = () => {
  const configuredBase = document.querySelector('meta[name="site-base-url"]')?.content?.trim();
  if (configuredBase) return configuredBase.replace(/\/+$/, '');

  const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  const marker = '/antium-fai/';
  const index = pathname.indexOf(marker);
  if (index !== -1 && /^https?:$/.test(window.location.protocol) && window.location.origin) {
    return `${window.location.origin}/antium-fai`;
  }

  return SEO_DEFAULT_BASE_URL;
};

const getRepoRelativePath = () => {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  const lowerPath = pathname.toLowerCase();
  const marker = '/antium-fai/';
  const index = lowerPath.indexOf(marker);

  if (index !== -1) {
    const rel = pathname.slice(index + marker.length);
    return `/${rel || 'index.html'}`;
  }

  if (lowerPath === '/' || lowerPath.endsWith('/index.html')) return '/index.html';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

const setHeadMeta = (selector, attrName, attrValue, content) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const toAbsoluteUrl = (url, baseUrl) => {
  if (!url) return null;
  try {
    const raw = String(url).trim();
    const isAbsolute = /^[a-z][a-z\d+\-.]*:/i.test(raw) || raw.startsWith('//');
    const normalized = isAbsolute ? raw : raw.replace(/^\/+/, '').replace(/^\.\//, '');
    return new URL(normalized, `${baseUrl}/`).href;
  } catch (_) {
    return null;
  }
};

const extractHeroBackgroundImage = () => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return null;
  const bg = getComputedStyle(heroBg).backgroundImage || '';
  const match = bg.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : null;
};

const injectSeoMarkup = () => {
  const baseUrl = normalizeSiteBaseUrl();
  const pagePath = getRepoRelativePath();
  const canonicalUrl = toAbsoluteUrl(pagePath, baseUrl);
  if (!canonicalUrl) return;

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  const title = (document.querySelector('h1')?.textContent || document.title || 'Antium').trim();
  const description = (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim();
  const siteName = 'Antium';
  const imageCandidate =
    document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    document.querySelector('figure img')?.getAttribute('src') ||
    extractHeroBackgroundImage() ||
    './img/logo-antium.webp';
  const imageUrl = toAbsoluteUrl(imageCandidate, baseUrl) || `${baseUrl}/img/logo-antium.webp`;

  setHeadMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setHeadMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
  if (!document.querySelector('meta[property="og:type"]')) {
    setHeadMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
  }
  if (!document.querySelector('meta[property="og:title"]')) {
    setHeadMeta('meta[property="og:title"]', 'property', 'og:title', document.title);
  }
  if (!document.querySelector('meta[property="og:description"]') && description) {
    setHeadMeta('meta[property="og:description"]', 'property', 'og:description', description);
  }
  if (!document.querySelector('meta[property="og:image"]')) {
    setHeadMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
  }

  if (!document.querySelector('meta[name="twitter:card"]')) {
    setHeadMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  }
  if (!document.querySelector('meta[name="robots"]')) {
    setHeadMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
  }

  const existingDynamicLd = document.head.querySelector('script[data-seo-jsonld="dynamic"]');
  if (existingDynamicLd) existingDynamicLd.remove();

  const isHome = pagePath === '/index.html' || pagePath === '/';
  const isSection = pagePath.startsWith('/sezioni/');
  const sectionTitle = (document.querySelector('.hero-title')?.textContent || title).trim();

  const graph = [];
  graph.push({
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Antium · Historia et Memoria',
    url: `${baseUrl}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/img/logo-antium.webp`
    }
  });

  if (isHome) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: `${baseUrl}/`,
      name: siteName,
      alternateName: ['Antivm', 'Antium FAI'],
      inLanguage: 'it-IT',
      publisher: {
        '@id': `${baseUrl}/#organization`
      }
    });
  }

  graph.push({
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: 'it-IT',
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl
    },
    about: {
      '@type': 'Thing',
      name: sectionTitle
    }
  });

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}/index.html`
    }
  ];

  if (!isHome) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: sectionTitle,
      item: canonicalUrl
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems
  });

  if (isSection) {
    const articleNode = {
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      mainEntityOfPage: canonicalUrl,
      headline: sectionTitle,
      description,
      image: [imageUrl],
      inLanguage: 'it-IT',
      author: {
        '@type': 'Person',
        name: 'Riccardo Pau'
      },
      publisher: {
        '@id': `${baseUrl}/#organization`
      },
      isAccessibleForFree: true
    };
    const modified = new Date(document.lastModified);
    if (!Number.isNaN(modified.getTime())) {
      articleNode.dateModified = modified.toISOString();
    }
    graph.push(articleNode);
  }

  const ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.dataset.seoJsonld = 'dynamic';
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  });
  document.head.appendChild(ldScript);
};

// ── HERO reveal on load ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  resetScrollPosition();
  injectSeoMarkup();

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
  const lockCompactHeader = pagePath.endsWith('/pdf.html') || pagePath.endsWith('/podcast.html') || pagePath.endsWith('/fonti.html') || pagePath.endsWith('/index.html') || pagePath === '/' || pagePath.endsWith('/sezioni/volsci-cicerone-culti.html');
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
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .card-3d, .tl-step, .bento-card').forEach((el, i) => {
    el.dataset.reveal = i % 8;
    io.observe(el);
  });

  // ── ARTICLE RAIL (solo desktop) ────────────────────────
  // Raccoglie TUTTI i callout e il blocco side-notes in un'unica
  // sidebar fissa a destra, separata dalla colonna di lettura.
  // Il rail viene appeso a `<body>` (e NON dentro l'articolo)
  // perché l'articolo ha un `transform` di fade-in che creerebbe
  // un nuovo containing block per `position: fixed`, impedendo al
  // rail di ancorarsi al viewport.
  // Il rail ha sempre `overflow-y: auto` per scroll indipendente
  // della colonna (rotella del mouse + scrollbar sottilissima).
  // Su mobile/tablet non si attiva: i callout restano nel flusso
  // del testo come elementi inline a colonna unica.
  const rails = [];
  const RAIL_PARENT = document.body;
  const initArticleRail = () => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    document.querySelectorAll('.article-layout--media').forEach(layout => {
      const body = layout.querySelector(':scope > .article-body--long');
      if (!body) return;
      const toMove = [];
      body.querySelectorAll(':scope > aside.callout, :scope > aside.side-notes').forEach(el => toMove.push(el));
      Array.from(layout.children).forEach(child => {
        if (child === body) return;
        if (child.classList && (child.classList.contains('article-rail') || child.classList.contains('article-rail-head'))) return;
        if (child.tagName === 'ASIDE' && (child.classList.contains('side-notes') || child.classList.contains('section-endnotes'))) {
          toMove.push(child);
        }
      });
      if (!toMove.length) return;
      const rail = document.createElement('aside');
      rail.className = 'article-rail';
      rail.setAttribute('aria-label', 'Note e curiosità della sezione');
      toMove.forEach(el => rail.appendChild(el));
      const head = document.createElement('p');
      head.className = 'article-rail-head';
      head.textContent = 'Note e curiosità';
      rail.insertBefore(head, rail.firstChild);
      RAIL_PARENT.appendChild(rail);
      // Il container--wide e' il riferimento per il posizionamento
      // orizzontale del rail: il suo lato destro delimita la zona
      // in cui il rail puo' crescere (copre tutta la viewport).
      const container = document.querySelector('.section-page-content .container--wide');
      rails.push({ rail, layout, body, container });
    });
  };
  const teardownArticleRail = () => {
    while (rails.length) {
      const { rail, layout, body, container } = rails.pop();
      while (rail.firstChild) {
        const node = rail.firstChild;
        if (node.classList && node.classList.contains('article-rail-head')) {
          rail.removeChild(node);
          continue;
        }
        if (node.tagName === 'ASIDE' && node.classList.contains('callout') && body) {
          body.appendChild(node);
        } else {
          layout.appendChild(node);
        }
      }
      rail.remove();
    }
  };
  // Aggiorna la posizione del rail: il rail è SEMPRE `position: fixed`
  // sul lato destro del viewport (è figlio di <body>, fuori dal
  // transform di fade-in dell'articolo). Il rail:
  // - si nasconde durante la lettura dell'hero (sopra l'articolo) e
  //   quando il footer sale a coprire l'area del rail senza piu'
  //   articolo sopra
  // - quando il pager o il footer salgono in vista, l'altezza del rail
  //   viene ridotta per non sovrapporsi
  const updateRails = () => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    const headerH = header ? header.offsetHeight : 0;
    const pad = 16;
    const maxH = window.innerHeight - headerH - pad * 2;
    const footerEl = document.querySelector('.simple-footer, .site-footer');
    const pagerEl = document.querySelector('.section-pager');
    const footerR = footerEl ? footerEl.getBoundingClientRect() : null;
    const pagerR = pagerEl ? pagerEl.getBoundingClientRect() : null;
    const heroEl = document.querySelector('main > .hero, main > .section-page-hero');
    const heroHeight = heroEl ? heroEl.offsetHeight : 0;
    const heroTop = heroEl ? heroEl.getBoundingClientRect().top : 0;
    rails.forEach(({ rail, layout, body, container }) => {
      const r = layout.getBoundingClientRect();
      // L'hero e' ancora in viewport sopra l'articolo: il rail non deve
      // sovrapporsi all'hero. Nascondi finche' l'hero copre l'area
      // dove andrebbe il rail, cioe' finche' heroTop + heroHeight > headerH + pad.
      if (heroEl && heroTop + heroHeight > headerH + pad) {
        rail.style.display = 'none';
        return;
      }
      // Layout sotto al viewport: nascondi.
      if (r.top >= window.innerHeight) {
        rail.style.display = 'none';
        return;
      }
      // Calcola il limite inferiore del rail in base al primo tra
      // pager e footer che sale in viewport. Limita l'altezza del rail
      // per non sovrapporsi.
      let railBottomLimit = window.innerHeight;
      if (footerR && footerR.top >= 0 && footerR.top < window.innerHeight) {
        railBottomLimit = Math.min(railBottomLimit, footerR.top);
      }
      if (pagerR && pagerR.top >= 0 && pagerR.top < window.innerHeight) {
        railBottomLimit = Math.min(railBottomLimit, pagerR.top);
      }
      const maxH2 = Math.max(120, railBottomLimit - headerH - pad * 2);
      if (maxH2 < 140) {
        rail.style.display = 'none';
        return;
      }
      // Pin a destra del viewport. Il rail ha larghezza presa dal CSS
      // (clamp 320-540px) ed è ancorato al lato destro dell'area
      // utile del container (cioè container.right meno il padding
      // destro), così il margine dx del rail è identico al margine
      // sx del body. Il body riempie tutto lo spazio rimanente a
      // sinistra; il gap tra body e rail è il --rail-gap del grid.
      // I tre spazi (sx body, gap body-rail, dx rail) sono della
      // stessa misura proporzionale (32-94px).
      const containerR = container ? container.getBoundingClientRect() : body.getBoundingClientRect();
      const cs = container ? getComputedStyle(container) : null;
      const padR = cs ? parseFloat(cs.paddingRight) || 0 : 0;
      const railW = parseFloat(getComputedStyle(rail).width) || 540;
      const railLeft = Math.max(16, Math.round(containerR.right - padR - railW));
      rail.style.display = '';
      rail.classList.add('article-rail--pinned');
      rail.style.position = 'fixed';
      rail.style.left = `${railLeft}px`;
      rail.style.top = `${headerH + pad}px`;
      rail.style.maxHeight = `${maxH2}px`;
    });
  };
  initArticleRail();
  let lastDesktopMatch = window.matchMedia('(min-width: 1024px)').matches;
  let resizeRaf = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const nowMatch = window.matchMedia('(min-width: 1024px)').matches;
      if (nowMatch !== lastDesktopMatch) {
        lastDesktopMatch = nowMatch;
        if (!nowMatch) {
          teardownArticleRail();
          return;
        }
        teardownArticleRail();
        initArticleRail();
      }
      updateRails();
    });
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', updateRails, { passive: true });
  requestAnimationFrame(() => requestAnimationFrame(updateRails));
  window.addEventListener('load', updateRails);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateRails).catch(() => {});
  }

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

  // ── STRISCE ORIZZONTALI (hero eras, episodi podcast) — drag to scroll ─────
  document.querySelectorAll('.hero-eras, .podcast-hero-actions-scroll').forEach((strip) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      if (strip.scrollWidth <= strip.clientWidth) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
    });
    strip.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        // La classe (che spegne i pointer-events delle card) entra solo a
        // drag iniziato: se arrivasse al pointerdown, il click fermo sui
        // link non partirebbe mai.
        moved = true;
        strip.classList.add('is-dragging');
      }
      if (moved) strip.scrollLeft = startScroll - dx;
    });
    const endDrag = () => {
      isDown = false;
      strip.classList.remove('is-dragging');
    };
    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    strip.addEventListener('pointerleave', endDrag);
    // I link trascinati avvierebbero il drag nativo del browser: va spento,
    // altrimenti la striscia non si muove.
    strip.addEventListener('dragstart', (e) => e.preventDefault());
    // Rotella del mouse sopra la striscia: scorre in orizzontale finché c'è
    // spazio, poi lascia scorrere la pagina.
    strip.addEventListener('wheel', (e) => {
      if (strip.scrollWidth <= strip.clientWidth) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const max = strip.scrollWidth - strip.clientWidth;
      if ((delta < 0 && strip.scrollLeft > 0) || (delta > 0 && strip.scrollLeft < max)) {
        e.preventDefault();
        strip.scrollLeft = Math.max(0, Math.min(max, strip.scrollLeft + delta));
      }
    }, { passive: false });
    strip.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });

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

  // Figure dell'articolo nelle sezioni → lightbox con didascalia
  document.querySelectorAll('.article-figure').forEach(figure => {
    const img = figure.querySelector('img');
    if (!img) return;
    const caption = figure.querySelector('figcaption');
    figure.classList.add('is-zoomable');
    figure.addEventListener('click', event => {
      // non aprire la lightbox cliccando un link/pulsante interno alla didascalia
      if (event.target.closest('a, button')) return;
      let note = '';
      if (caption) {
        // escludi dal testo eventuali trigger ("Crediti grafici") e link
        const clone = caption.cloneNode(true);
        clone.querySelectorAll('a, button').forEach(el => el.remove());
        note = clone.textContent.replace(/\s+/g, ' ').trim();
      }
      openLightbox({
        src: img.currentSrc || img.src,
        alt: img.alt,
        title: img.alt,
        note
      });
    });
  });

  function openCreditPreview(button) {
    openLightbox({
      src: button.dataset.creditImage,
      title: button.dataset.creditTitle || button.textContent.trim(),
      note: button.dataset.creditNote || '',
      source: button.dataset.creditSource || '',
      sourceLabel: button.dataset.creditSourceLabel || 'Apri fonte'
    });
  }

  creditPreviewButtons.forEach(button => {
    button.addEventListener('click', () => openCreditPreview(button));
    // Tutta la riga apre la lightbox (click o tap su qualsiasi cella),
    // mentre il pulsante e gli eventuali link mantengono il loro handler.
    const row = button.closest('tr');
    if (row) {
      row.classList.add('credit-row');
      row.addEventListener('click', event => {
        if (event.target.closest('a, button')) return;
        openCreditPreview(button);
      });
    }
  });

  // Hero (home e sezioni) → icona "occhio" che apre l'immagine intera nella
  // lightbox (su mobile lo sfondo è ritagliato in cover e si vede parziale).
  // Gli hero senza immagine di sfondo (gradiente decorativo) sono esclusi
  // dal controllo sull'url.
  document.querySelectorAll('.hero').forEach(hero => {
    const bg = hero.querySelector('.hero-bg');
    if (!bg) return;
    const raw = bg.style.backgroundImage || getComputedStyle(bg).backgroundImage || '';
    const match = raw.match(/url\(["']?(.*?)["']?\)/);
    if (!match || !match[1]) return;
    const titleEl = hero.querySelector('.hero-title');
    const title = titleEl ? titleEl.textContent.trim() : 'Immagine';

    const zoom = document.createElement('button');
    zoom.type = 'button';
    zoom.className = 'hero-zoom';
    // Negli hero con footer (la home, dove in basso c'è la nav delle ere)
    // l'icona va in alto a destra per non coprire le card.
    if (hero.querySelector('.hero-footer')) zoom.classList.add('hero-zoom--top');
    zoom.setAttribute('aria-label', 'Apri l’immagine completa');
    zoom.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/>
        <circle cx="12" cy="12" r="3.2"/>
      </svg>
      <span class="hero-zoom-label">Vedi intera</span>
    `;
    zoom.addEventListener('click', () => openLightbox({ src: match[1], title }));
    hero.appendChild(zoom);
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
        debounceId = setTimeout(() => { highlight(q); renderGlobalResults(q); }, 220);
      });
      control.form.addEventListener('submit', e => {
        e.preventDefault();
        activeControl = control;
        const q = control.input.value.trim();
        if (hits.length) { goTo(current + 1); return; }
        highlight(q);
        if (hits.length) return;
        // Nessun risultato in questa pagina: vai al primo risultato globale
        renderGlobalResults(q);
        const firstBtn = control.results && control.results.querySelector('.search-result-item');
        if (firstBtn) gotoResult(firstBtn.dataset.url, parseInt(firstBtn.dataset.hit, 10) || 0, firstBtn.dataset.current === '1');
      });
      control.prevBtn && control.prevBtn.addEventListener('click', () => goTo(current - 1));
      control.nextBtn && control.nextBtn.addEventListener('click', () => goTo(current + 1));
      control.clearBtn && control.clearBtn.addEventListener('click', () => {
        syncInputs('');
        clearHighlights();
        hideAllResults();
        control.input.focus();
      });
    });

    // ── RICERCA GLOBALE (tutte le sezioni) ──────────────────
    const ASSET_ROOT = window.location.pathname.replace(/\\/g, '/').toLowerCase().includes('/sezioni/') ? '../' : './';

    function currentPageUrl() {
      const rel = getRepoRelativePath().replace(/^\//, '');
      return rel || 'index.html';
    }

    // Carica l'indice di ricerca generato da scripts/build_search_index.py
    if (!window.ANTIUM_SEARCH_INDEX) {
      const s = document.createElement('script');
      s.src = ASSET_ROOT + 'js/search-index.js';
      s.defer = true;
      document.head.appendChild(s);
    }

    // Crea il pannello dei risultati per ogni form di ricerca
    controls.forEach(control => {
      const panel = document.createElement('div');
      panel.className = 'search-results';
      panel.setAttribute('data-site-search-results', '');
      panel.hidden = true;
      control.form.appendChild(panel);
      control.results = panel;
      panel.addEventListener('click', e => {
        const btn = e.target.closest('.search-result-item');
        if (!btn) return;
        activeControl = control;
        gotoResult(btn.dataset.url, parseInt(btn.dataset.hit, 10) || 0, btn.dataset.current === '1');
      });
    });

    const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const makeRe = q => new RegExp(escapeRegExp(q), 'gi');

    function makeSnippet(text, q) {
      const re = makeRe(q);
      const m = re.exec(text);
      const i = m ? m.index : 0;
      const start = Math.max(0, i - 55);
      const end = Math.min(text.length, i + q.length + 90);
      let raw = (start > 0 ? '\u2026 ' : '') + text.slice(start, end) + (end < text.length ? ' \u2026' : '');
      return escapeHtml(raw).replace(makeRe(q), mm => `<mark>${mm}</mark>`);
    }

    function hideAllResults() {
      controls.forEach(c => { if (c.results) { c.results.hidden = true; c.results.innerHTML = ''; } });
    }

    function renderGlobalResults(q) {
      if (!q || q.length < 2) { hideAllResults(); return; }
      const idx = Array.isArray(window.ANTIUM_SEARCH_INDEX) ? window.ANTIUM_SEARCH_INDEX : [];
      if (!idx.length) { hideAllResults(); return; }
      const here = currentPageUrl();
      const MAX_ITEMS = 40;
      const groups = [];
      let totalMatches = 0;
      idx.forEach(page => {
        const re = makeRe(q);
        let occ = 0;
        const items = [];
        page.passages.forEach(text => {
          const count = (text.match(re) || []).length;
          if (count > 0) items.push({ hitIndex: occ, snippet: makeSnippet(text, q) });
          occ += count;
        });
        if (items.length) {
          totalMatches += occ;
          groups.push({ url: page.url, title: page.title, current: page.url === here, count: occ, items });
        }
      });

      groups.sort((a, b) => (b.current - a.current) || (b.count - a.count));

      let html;
      if (!groups.length) {
        html = `<div class="search-results-empty">Nessun risultato per \u201c${escapeHtml(q)}\u201d.</div>`;
      } else {
        html = `<div class="search-results-head">${totalMatches} ${totalMatches === 1 ? 'risultato' : 'risultati'} in ${groups.length} ${groups.length === 1 ? 'sezione' : 'sezioni'}</div>`;
        let shown = 0;
        for (const g of groups) {
          if (shown >= MAX_ITEMS) break;
          html += '<div class="search-results-group">';
          html += `<div class="search-results-section">${escapeHtml(g.title)}${g.current ? ' \u00b7 <span class="srg-here">questa pagina</span>' : ''} <span class="srg-count">${g.count}</span></div>`;
          for (const it of g.items) {
            if (shown >= MAX_ITEMS) break;
            html += `<button type="button" class="search-result-item" data-url="${g.url}" data-hit="${it.hitIndex}" data-current="${g.current ? '1' : '0'}">${it.snippet}</button>`;
            shown++;
          }
          html += '</div>';
        }
      }

      controls.forEach(c => {
        if (!c.results) return;
        c.results.innerHTML = html;
        c.results.hidden = false;
        if (c.status) c.status.hidden = true;
      });
    }

    function gotoResult(url, hitIndex, isCurrent) {
      const q = (activeControl.input.value || '').trim();
      if (isCurrent) {
        hideAllResults();
        if (!hits.length) highlight(q);
        if (hits.length) goTo(Math.min(hitIndex, hits.length - 1));
      } else {
        window.location.href = ASSET_ROOT + url + '?q=' + encodeURIComponent(q) + '&hit=' + hitIndex;
      }
    }

    // Chiudi i risultati cliccando fuori dal box di ricerca
    document.addEventListener('click', e => {
      if (!e.target.closest('.brand-search')) hideAllResults();
    });

    // Deep-link: ?q=...&hit=N -> evidenzia e scorre all'occorrenza esatta
    (function applyDeepLink() {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (!q) return;
      syncInputs(q);
      const hit = parseInt(params.get('hit'), 10);
      setTimeout(() => {
        highlight(q);
        if (hits.length) goTo(isNaN(hit) ? 0 : Math.min(hit, hits.length - 1));
      }, 250);
    })();

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hits.length) {
        syncInputs('');
        clearHighlights();
        hideAllResults();
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
          author: 'Riccardo Pau',
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
        },
        {
          element: 'Territorio di Antium — insediamenti fortificati (Fig. 2)',
          author: 'Cifani G., Guidi A.',
          note: 'In: Fontaine–Helas (a cura di), Le fortificazioni arcaiche del Latium vetus, IHBR 2016, fig. 2. © autori.'
        },
        {
          element: 'Colle Rotondo — localizzazione saggi di scavo, foto aerea (Fig. 3)',
          author: 'Cifani G., Guidi A.; base foto aerea Guardia Forestale 2012',
          note: 'In: Fontaine–Helas 2016, fig. 3. © autori / Guardia Forestale.'
        },
        {
          element: 'Colle Rotondo — planimetria topografica e sezione trasversale (Fig. 4)',
          author: 'Quilici L., Quilici Gigli S. (1984); riprodotto in Cifani–Guidi 2016',
          note: 'In: Cifani–Guidi 2016, fig. 4. © autori.'
        },
        {
          element: 'Colle Rotondo — ricostruzione 3D primo aggere XI–X sec. a.C. (Fig. 5)',
          author: 'Nomi F. (2013); Guidi A., Nomi F. (2014)',
          note: 'In: Cifani–Guidi 2016, fig. 9. © autori.'
        },
        {
          element: 'Vallo di Antium — assonometria muro in opera quadrata (Fig. 6)',
          author: 'Egidi R., Guidi A.',
          note: 'Scavi Soprintendenza per i Beni Archeologici del Lazio (1980–81). In: Cifani–Guidi 2016, fig. 16. © Soprintendenza / autori.'
        },
        {
          element: 'Vallo di Antium — foto muro in opera quadrata (Fig. 7)',
          author: 'Egidi R., Guidi A.',
          note: 'Scavi Soprintendenza per i Beni Archeologici del Lazio (1980–81). In: Cifani–Guidi 2016, fig. 17. © Soprintendenza / autori.'
        },
        {
          element: 'Pianta dell’antica Antium (Tav. I)',
          author: 'dis. L. Crema per G. Lugli (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», RIASA VII, Tav. I.'
        },
        {
          element: 'Veduta del vallo nel lato settentrionale',
          author: 'G. Lugli, RIASA VII (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», fig. 1.'
        },
        {
          element: 'La Selciatella presso la pineta della Campana',
          author: 'M. Micheli · Latium Vetus et Adiectum (2016)',
          note: 'Fotografia dalla ricognizione 2016.'
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
      note: 'Crediti grafici specifici della sezione. Le figure di Colle Rotondo sono condivise con la Sezione 01 (Il Vallo di Antium).',
      rows: [
        {
          element: 'Italcable — sito di approdo del cavo ad Anzio, foto storica',
          author: 'per gentile concessione di Donard de Cogan',
          note: 'Da atlantic-cable.com (History of the Atlantic Cable & Undersea Communications, a cura di Bill Burns). Foto di pubblico dominio per età.'
        },
        {
          element: 'Colle Rotondo — localizzazione saggi di scavo, foto aerea (Fig. 3)',
          author: 'Cifani G., Guidi A.; base foto aerea Guardia Forestale 2012',
          note: 'In: Fontaine–Helas 2016, fig. 3. © autori / Guardia Forestale.'
        },
        {
          element: 'Colle Rotondo — ricostruzione 3D primo aggere XI–X sec. a.C. (Fig. 5)',
          author: 'Nomi F. (2013); Guidi A., Nomi F. (2014)',
          note: 'In: Cifani–Guidi 2016, fig. 9. © autori.'
        },
        {
          element: 'Colle Rotondo — planimetria topografica e sezione trasversale (Fig. 4)',
          author: 'Quilici L., Quilici Gigli S. (1984); riprodotto in Cifani–Guidi 2016',
          note: 'In: Cifani–Guidi 2016, fig. 4. © autori.'
        }
      ]
    },
    'sezioni/tomba-mulakia.html': {
      subtitle: 'Sezione 03 · Tomba Mulakia',
      note: 'Crediti grafici specifici della sezione, tratti dal dossier Mulakia e dalla documentazione Morpurgo 1944-45.',
      rows: [
        {
          element: 'Pianta del sepolcreto Mulakia',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 1.'
        },
        {
          element: 'Ingresso dell’ipogeo sepolcrale (Tomba Mulakia)',
          author: 'G. Lugli, RIASA VII (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», fig. 26.'
        },
        {
          element: 'Interno della Tomba Mulakia (loculi)',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 9.'
        },
        {
          element: 'Vestibolo e accessi alle gallerie',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 6.'
        },
        {
          element: 'Iscrizione funeraria Mulakia',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 7.'
        },
        {
          element: 'Suppellettile funeraria Mulakia',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 12.'
        },
        {
          element: 'Specchio bronzeo inciso',
          author: 'Lucia Morpurgo (1944-45) · rielaborazione web Antium',
          note: 'Fonte: Notizie degli Scavi 1944-45, fig. 17.'
        }
      ]
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
        },
        {
          element: 'Il porto neroniano nel 1940',
          author: 'G. Lugli, RIASA VII (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», fig. 13.'
        },
        {
          element: 'Schizzo ricostruttivo del prospetto a mare presso il faro',
          author: 'A.M. Jaia (2008)',
          note: '«Anzio. La villa Imperiale», Tusculana 2, fig. 2. © autore.'
        },
        {
          element: 'Planimetria generale della villa (rilievi Gatti 1931)',
          author: 'A.M. Jaia (2008)',
          note: '«Anzio. La villa Imperiale», Tusculana 2, fig. 5, su rilievi G. Gatti 1931. © autore.'
        },
        {
          element: 'Le rovine dei moli neroniani nel Settecento',
          author: 'G.R. Volpi, Vetus Latium Profanum III (1726)',
          note: 'Incisione riprodotta in Lugli 1940, fig. 17.'
        }
      ]
    },
    'sezioni/monumenti-citta-alta.html': {
      subtitle: 'Sezione 06 · Monumenti della città alta',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Statuetta della Fortuna Anziate (Villa Spigarelli)',
          author: 'G. Lugli, RIASA VII (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», fig. 19.'
        }
      ]
    },
    'sezioni/volsci-cicerone-culti.html': {
      subtitle: 'Sezione 07 · Volsci, Cicerone e culti',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Rostro volsco (ricostruzione)',
          author: 'Riccardo Pau',
          note: 'Ricostruzione grafica del rostro di nave da guerra volsca.'
        },
        {
          element: 'Sale termali e «tempio di Esculapio» (piante del Volpi)',
          author: 'G.R. Volpi, Vetus Latium Profanum III (1726)',
          note: 'Incisioni riprodotte in Lugli 1940, figg. 24–25.'
        },
        {
          element: 'Ruderi attribuiti al tempio della Fortuna',
          author: 'G.R. Volpi, Vetus Latium Profanum III (1726)',
          note: 'Incisione riprodotta in Lugli 1940, fig. 18.'
        }
      ]
    },
    'sezioni/teatro-romano.html': {
      subtitle: 'Sezione 08 · Teatro romano',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Avanzi del teatro imperiale nella città alta',
          author: 'G. Lugli, RIASA VII (1940)',
          note: '«Saggio sulla Topografia dell’Antica Antium», fig. 21.'
        },
        {
          element: 'Tavola grafica del teatro romano di Antium',
          author: 'Riccardo Pau',
          note: 'Ricostruzione grafica basata sulle fonti storiche (Lugli 1940).'
        },
        {
          element: 'Pianta del «teatro» scavato nel 1712 (Bianchini)',
          author: 'F. Bianchini, Camera ed iscrizioni sepolcrali (1727)',
          note: 'Riprodotta in Lugli 1940, fig. 23.'
        }
      ]
    },
    'sezioni/antium-guide.html': {
      subtitle: 'Estratto VLP · De Antiatibus et Norbanis',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Fanciulla di Anzio (hero + figura nel testo)',
          author: 'Museo Nazionale Romano · Palazzo Massimo alle Terme',
          note: 'Etichetta BCS (Beni Culturali Standard, MiC) — riuso libero per studio, editoria e valorizzazione.'
        },
        {
          element: 'Antium nel territorio del Lazio antico (mappa)',
          author: 'de Haas, Tol, Attema (2011)',
          note: '«Investing in the colonia and ager of Antium», Facta 5, Fabrizio Serra Editore.'
        },
        {
          element: 'Le ville costiere a sud di Antium e i bolli dei proprietari',
          author: 'de Haas, Tol, Attema (2011)',
          note: '«Investing in the colonia and ager of Antium», Facta 5, Fabrizio Serra Editore.'
        },
        {
          element: 'Fistulae in piombo da Le Grottacce',
          author: 'de Haas, Tol, Attema (2011)',
          note: '«Investing in the colonia and ager of Antium», Facta 5, Fabrizio Serra Editore.'
        }
      ]
    },
    'sezioni/tor-caldara.html': {
      subtitle: 'Sezione · Tor Caldara',
      note: 'Crediti grafici specifici della sezione.',
      rows: [
        {
          element: 'Hero · La torre delle Caldane, dal disegno alla ricostruzione',
          author: 'Riccardo Pau',
          note: 'Elaborazione grafica del disegno storico della torre (da Miselli 1691).'
        },
        {
          element: 'La torre delle Caldane (disegno nel testo)',
          author: 'G. Miselli, 1691',
          note: 'Dalla «Visita generale fatta da me Giuseppe Miselli detto Burattino» (1691): copia presso la Biblioteca Istituzionale della Città Metropolitana di Roma Capitale, coll. G 45; stesura coeva alla Biblioteca Apostolica Vaticana, Ott. lat. 2159.'
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

/* ============================================================
   CROSSLINK — anteprime di rimando tra sezioni
   Ogni <a class="crosslink"> con attributi data-cross-* apre,
   in hover/focus/tap, un box a pergamena (stile crediti) con
   un mini-approfondimento e un invito a visitare la sezione.
   ============================================================ */
(function () {
  'use strict';

  var links = Array.prototype.slice.call(document.querySelectorAll('a.crosslink'));
  if (!links.length) return;

  var pop = document.createElement('div');
  pop.className = 'crosslink-pop';
  pop.setAttribute('role', 'tooltip');
  pop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pop);

  var current = null;
  var hideTimer = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render(link) {
    var eyebrow = link.getAttribute('data-cross-eyebrow') || '';
    var title = link.getAttribute('data-cross-title') || link.textContent;
    var note = link.getAttribute('data-cross-note') || '';
    var cta = link.getAttribute('data-cross-cta') || 'Vai alla sezione';
    var href = link.getAttribute('href') || '#';
    pop.innerHTML =
      (eyebrow ? '<p class="crosslink-pop-eyebrow">' + escapeHtml(eyebrow) + '</p>' : '') +
      '<p class="crosslink-pop-title">' + escapeHtml(title) + '</p>' +
      (note ? '<p class="crosslink-pop-note">' + escapeHtml(note) + '</p>' : '') +
      '<a class="crosslink-pop-cta" href="' + escapeHtml(href) + '">' + escapeHtml(cta) + '</a>';
  }

  function position(link) {
    var r = link.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var width = pop.offsetWidth;
    var margin = 14;

    var left = r.left;
    if (left + width > vw - margin) {
      left = vw - margin - width;
    }
    if (left < margin) left = margin;

    var top = r.bottom + 10;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';

    // posiziona la freccia sopra l'ancora
    var arrow = r.left - left + Math.min(r.width / 2, 40);
    arrow = Math.max(14, Math.min(arrow, width - 26));
    pop.style.setProperty('--cross-arrow', arrow + 'px');
  }

  function show(link) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    current = link;
    render(link);
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    position(link);
  }

  function hide() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    current = null;
  }

  function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 180);
  }

  links.forEach(function (link) {
    link.addEventListener('mouseenter', function () { show(link); });
    link.addEventListener('mouseleave', scheduleHide);
    link.addEventListener('focus', function () { show(link); });
    link.addEventListener('blur', hide);
  });

  pop.addEventListener('mouseenter', function () {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  });
  pop.addEventListener('mouseleave', scheduleHide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && current) hide();
  });
  window.addEventListener('scroll', function () { if (current) hide(); }, { passive: true });
  window.addEventListener('resize', function () { if (current) hide(); });
}());



/* ============================================================
   LEMMI — glossario interattivo. Ogni <span class="lemma"
   data-lemma="id"> apre il popup a pergamena con la voce del
   registro centrale (js/lemmi.js): timeline dei proprietari
   per le ville, spiegazione breve per i termini tecnici.
   ============================================================ */
(function () {
  'use strict';

  var spans = Array.prototype.slice.call(document.querySelectorAll('.lemma[data-lemma]'));
  if (!spans.length) return;

  var ASSET_ROOT = window.location.pathname.replace(/\\/g, '/').toLowerCase().includes('/sezioni/') ? '../' : './';
  // Cache-busting: bump LEMMI_VERSION ogni volta che si modifica js/lemmi.js,
  // così i browser non servono una copia vecchia del registro dopo il deploy.
  var LEMMI_VERSION = '2026-07-30';
  if (!window.ANTIUM_LEMMI) {
    var loader = document.createElement('script');
    loader.src = ASSET_ROOT + 'js/lemmi.js?v=' + LEMMI_VERSION;
    loader.defer = true;
    document.head.appendChild(loader);
  }

  var pop = document.createElement('div');
  pop.className = 'crosslink-pop';
  pop.setAttribute('role', 'tooltip');
  pop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pop);

  var current = null;
  var hideTimer = null;
  var openedByTouch = false;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render(span) {
    var voce = (window.ANTIUM_LEMMI || {})[span.getAttribute('data-lemma')];
    if (!voce) return false;
    var html = '';
    if (voce.eyebrow) html += '<p class="crosslink-pop-eyebrow">' + escapeHtml(voce.eyebrow) + '</p>';
    html += '<p class="crosslink-pop-title">' + escapeHtml(voce.titolo || span.textContent) + '</p>';
    if (voce.nota) html += '<p class="crosslink-pop-note">' + escapeHtml(voce.nota) + '</p>';
    if (voce.righe && voce.righe.length) {
      html += '<ul class="crosslink-pop-rows">';
      voce.righe.forEach(function (r) {
        html += '<li><span class="lemma-quando">' + escapeHtml(r[0]) + '</span><span>' + escapeHtml(r[1]) + '</span></li>';
      });
      html += '</ul>';
    }
    pop.innerHTML = html;
    return true;
  }

  function position(span) {
    var r = span.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var width = pop.offsetWidth;
    var popH = pop.offsetHeight;
    var margin = 14;
    var left = r.left;
    if (left + width > vw - margin) left = vw - margin - width;
    if (left < margin) left = margin;
    var above = (vh - r.bottom) < (popH + 14) && r.top > (popH + 14);
    var top = above ? r.top - popH - 10 : r.bottom + 10;
    pop.classList.toggle('above', above);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    var arrow = r.left - left + Math.min(r.width / 2, 40);
    arrow = Math.max(14, Math.min(arrow, width - 26));
    pop.style.setProperty('--cross-arrow', arrow + 'px');
  }

  function show(span) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (!render(span)) return;
    current = span;
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    position(span);
  }

  function hide() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    current = null;
    openedByTouch = false;
  }

  function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 180);
  }

  spans.forEach(function (span) {
    span.setAttribute('tabindex', '0');
    // Desktop: il lemma si apre con un CLICK (non più al passaggio del mouse).
    // Niente apertura su focus: scatenerebbe show() prima del click, che poi
    // vedendo current===span lo richiuderebbe subito (primo click "a vuoto").
    span.addEventListener('blur', function () { if (!openedByTouch) hide(); });
    span.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (current === span) { hide(); } else { show(span); }
      }
    });
    // Touch: preventDefault stops the synthetic mouseenter/click chain → single-tap to open
    span.addEventListener('touchstart', function (e) {
      e.preventDefault();
      openedByTouch = true;
      if (current === span) { hide(); } else { show(span); }
    }, { passive: false });
    // Click (mouse desktop): apre/chiude il popover
    span.addEventListener('click', function (e) {
      if (openedByTouch) return;
      e.preventDefault();
      if (current === span) { hide(); } else { show(span); }
    });
  });

  pop.addEventListener('mouseenter', function () {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  });

  // Chiude il popover cliccando fuori da esso e da qualsiasi lemma (mouse desktop)
  document.addEventListener('click', function (e) {
    if (!current || openedByTouch) return;
    var onSpan = spans.some(function (s) { return s === e.target || s.contains(e.target); });
    if (!pop.contains(e.target) && !onSpan) hide();
  });

  // Close touch-popup when tapping outside the popup and outside any lemma span
  document.addEventListener('touchstart', function (e) {
    if (!current) return;
    var onSpan = spans.some(function (s) { return s === e.target || s.contains(e.target); });
    if (!pop.contains(e.target) && !onSpan) hide();
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && current) hide();
  });
  // Scroll hides only mouse-opened popups; touch-opened ones stay until tapped away
  window.addEventListener('scroll', function () { if (current && !openedByTouch) hide(); }, { passive: true });
  window.addEventListener('resize', function () { if (current) hide(); });
}());
