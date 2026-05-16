/* EHC Homepage Prototype — interactive behaviors
   Kept minimal and dependency-free. */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('mobileNav');
  if (toggle && drawer) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        drawer.hidden = false;
        // Allow it to be focusable
        drawer.querySelector('a')?.focus({ preventScroll: true });
      } else {
        drawer.hidden = true;
      }
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
    });
    // Close on link click
    drawer.addEventListener('click', (e) => {
      if (e.target.matches('a')) setOpen(false);
    });
    // Close on resize up
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setOpen(false);
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Counter animation (Arabic-Indic numerals) ---------- */
  const toArabicDigits = (n) =>
    String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

  const formatNum = (value) => {
    if (value >= 1000) {
      return String(value)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .split('')
        .map((c) => (c === ',' ? '٬' : '٠١٢٣٤٥٦٧٨٩'[c] ?? c))
        .join('');
    }
    return toArabicDigits(value);
  };

  const buildLabel = (el, value) => {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    return prefix + formatNum(value) + suffix;
  };

  const counters = document.querySelectorAll('.trust-num');
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = buildLabel(el, Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = buildLabel(el, target);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Reveal on scroll (gentle) ----------
     Uses CSS classes so an element NEVER stays hidden if JS fails
     or if the element is off-screen during a static capture. */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.section-head, .path-card, .service-row, .article-card, .qa-card, .aside-card, .contact-method, .map-card'
    );
    targets.forEach((el) => el.classList.add('reveal'));
    const revIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    targets.forEach((el) => revIO.observe(el));
    // Safety net: after 2.5s, mark anything still hidden as visible
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
    }, 2500);
  }

  /* ---------- FAQ: only one open at a time (progressive enhancement) ---------- */
  document.querySelectorAll('.glossary-grid .qa-card').forEach((card) => {
    card.addEventListener('toggle', () => {
      if (card.open) {
        document.querySelectorAll('.glossary-grid .qa-card[open]').forEach((other) => {
          if (other !== card) other.open = false;
        });
      }
    });
  });

  /* ---------- Smooth-scroll to in-page anchors (offset for sticky header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- WhatsApp floating button entrance (2s delay) ---------- */
  const fabWa = document.getElementById('fabWa');
  if (fabWa && !prefersReduced) {
    setTimeout(() => {
      fabWa.classList.add('fab-wa--visible');
    }, 2000);
  }
})();
