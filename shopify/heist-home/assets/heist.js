/* Heist homepage behaviour — paired with assets/heist.css */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 750px)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));

  const onVisible = (elements, callback, options = { threshold: 0.35 }) => {
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => callback(el, true));
      return null;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => callback(entry.target, entry.isIntersecting, observer));
    }, options);
    elements.forEach((el) => observer.observe(el));
    return observer;
  };

  /* Header: top / up / down states and the mobile menu drawer */
  class HeistHeader extends HTMLElement {
    connectedCallback() {
      this.lastY = window.scrollY;
      this.cta = this.querySelector('.heist-sticky-cta');
      this.splitLinks = this.querySelectorAll('.heist-header__nav--left a, .heist-header__nav--right a');
      this.centreLinks = this.querySelectorAll('.heist-header__nav--centre a');
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();

      const drawer = document.getElementById('HeistMenuDrawer');
      const toggle = this.querySelector('[data-menu-open]');
      if (drawer && toggle) {
        toggle.addEventListener('click', () => {
          drawer.showModal();
          toggle.setAttribute('aria-expanded', 'true');
        });
        drawer.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
        drawer.querySelector('[data-menu-close]')?.addEventListener('click', () => drawer.close());
        drawer.addEventListener('click', (event) => {
          if (event.target === drawer) drawer.close();
        });
      }
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
      const y = window.scrollY;
      const delta = y - this.lastY;
      let state = this.dataset.state;

      if (y < 24) state = 'top';
      else if (delta > 4 && y > 240) state = 'down';
      else if (delta < -4) state = 'up';

      if (state !== this.dataset.state) this.setState(state);
      this.lastY = y;
    }

    setState(state) {
      this.dataset.state = state;
      const sticky = state === 'down';
      this.cta.setAttribute('aria-hidden', String(!sticky));
      this.cta.querySelectorAll('a').forEach((a) => (a.tabIndex = sticky ? 0 : -1));
      this.splitLinks.forEach((a) => (a.tabIndex = state === 'up' ? 0 : -1));
      this.centreLinks.forEach((a) => (a.tabIndex = state === 'up' ? -1 : 0));
    }
  }

  /* Hero: maps scroll progress through the section onto the timeline */
  class HeistHero extends HTMLElement {
    connectedCallback() {
      this.update = this.update.bind(this);
      this.mode = this.mode.bind(this);
      desktop.addEventListener('change', this.mode);
      reducedMotion.addEventListener('change', this.mode);
      this.mode();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.update);
      window.removeEventListener('resize', this.update);
    }

    mode() {
      const animate = desktop.matches && !reducedMotion.matches;
      window.removeEventListener('scroll', this.update);
      window.removeEventListener('resize', this.update);
      this.toggleAttribute('data-static', !animate);
      if (animate) {
        window.addEventListener('scroll', this.update, { passive: true });
        window.addEventListener('resize', this.update);
        this.update();
      } else {
        this.toggleAttribute('data-story-visible', true);
      }
    }

    update() {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.ticking = false;
        const rect = this.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const p = clamp(-rect.top / travel);
        const story = range(p, 0.62, 0.9);

        // The glass rises; the stacked hand layers rise as one and close on it.
        this.style.setProperty('--p', p.toFixed(4));
        this.style.setProperty('--intro', range(p, 0, 0.3).toFixed(4));
        this.style.setProperty('--glass', range(p, 0.04, 0.42).toFixed(4));
        this.style.setProperty('--hands', range(p, 0.08, 0.6).toFixed(4));
        this.style.setProperty('--story', story.toFixed(4));
        this.toggleAttribute('data-story-visible', story > 0.5);
      });
    }
  }

  /* Tabs with roving focus */
  class HeistTabs extends HTMLElement {
    connectedCallback() {
      this.tabs = [...this.querySelectorAll('[role="tab"]')];
      this.panels = [...this.querySelectorAll('[role="tabpanel"]')];
      this.copy = [...this.querySelectorAll('[data-tab-copy]')];
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.select(index));
        tab.addEventListener('keydown', (event) => {
          const keys = { ArrowRight: 1, ArrowLeft: -1 };
          if (!(event.key in keys)) return;
          event.preventDefault();
          const next = (index + keys[event.key] + this.tabs.length) % this.tabs.length;
          this.select(next);
          this.tabs[next].focus();
        });
      });
    }

    select(index) {
      this.tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      this.panels.forEach((panel, i) => (panel.hidden = i !== index));
      this.copy.forEach((el, i) => (el.hidden = i !== index));
    }
  }

  /* Carousel: native scroll-snap plus mouse drag */
  class HeistCarousel extends HTMLElement {
    connectedCallback() {
      const track = this.querySelector('.heist-carousel__track');
      if (!track) return;
      let startX = 0;
      let startScroll = 0;
      let moved = false;

      track.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        startX = event.clientX;
        startScroll = track.scrollLeft;
        moved = false;
        track.classList.add('is-dragging');
        const move = (e) => {
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 4) moved = true;
          track.scrollLeft = startScroll - dx;
        };
        const up = () => {
          track.classList.remove('is-dragging');
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });

      // Swallow the click that ends a drag so cards don't open.
      track.addEventListener(
        'click',
        (event) => {
          if (moved) {
            event.preventDefault();
            event.stopPropagation();
            moved = false;
          }
        },
        true
      );
    }
  }

  /* Marquee: duplicates items once so the -50% loop is seamless */
  class HeistMarquee extends HTMLElement {
    connectedCallback() {
      const track = this.querySelector('.heist-marquee__track');
      if (!track || track.dataset.cloned) return;
      track.dataset.cloned = 'true';
      [...track.children].forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button, video').forEach((el) => el.setAttribute('tabindex', '-1'));
        track.appendChild(clone);
      });
      initVideos(track);
    }
  }

  customElements.define('heist-header', HeistHeader);
  customElements.define('heist-hero', HeistHero);
  customElements.define('heist-tabs', HeistTabs);
  customElements.define('heist-carousel', HeistCarousel);
  customElements.define('heist-marquee', HeistMarquee);

  /* Videos: play only while visible; sound toggles */
  function initVideos(root = document) {
    const wrappers = [...root.querySelectorAll('[data-heist-video]:not([data-ready])')];
    wrappers.forEach((wrapper) => {
      wrapper.dataset.ready = 'true';
      const video = wrapper.querySelector('video');
      const sound = wrapper.querySelector('[data-sound-toggle]');
      sound?.addEventListener('click', () => {
        video.muted = !video.muted;
        sound.setAttribute('aria-pressed', String(!video.muted));
        sound.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        if (!video.muted) video.play().catch(() => {});
      });
    });

    onVisible(
      wrappers,
      (wrapper, visible) => {
        const video = wrapper.querySelector('video');
        if (!video) return;
        if (visible && !reducedMotion.matches) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
  }

  /* Product cards: option toggle updates price + link */
  function initProductCards() {
    document.querySelectorAll('[data-heist-product-card]').forEach((card) => {
      const options = [...card.querySelectorAll('[role="radio"]')];
      const link = card.querySelector('[data-buy-link]');
      const price = card.querySelector('[data-price-label]');
      const select = (option) => {
        options.forEach((o) => {
          o.setAttribute('aria-checked', String(o === option));
          o.tabIndex = o === option ? 0 : -1;
        });
        if (option.dataset.url) link.href = option.dataset.url;
        if (option.dataset.price) price.textContent = option.dataset.price;
      };
      options.forEach((option, index) => {
        option.addEventListener('click', () => select(option));
        option.addEventListener('keydown', (event) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
          if (!step) return;
          event.preventDefault();
          const next = options[(index + step + options.length) % options.length];
          select(next);
          next.focus();
        });
      });
      const checked = options.find((o) => o.getAttribute('aria-checked') === 'true');
      if (checked) select(checked);
    });
  }

  /* Batch code: digits roll into place once */
  function initRollers() {
    const rollers = [...document.querySelectorAll('[data-heist-roller]')];
    rollers.forEach((roller) => {
      const value = roller.dataset.value || roller.textContent.trim();
      roller.textContent = '';
      [...value].forEach((char, i) => {
        if (!/\d/.test(char)) {
          roller.append(char === ' ' ? ' ' : char);
          return;
        }
        const digit = document.createElement('span');
        digit.className = 'heist-roller__digit';
        digit.setAttribute('aria-hidden', 'true');
        const strip = document.createElement('span');
        strip.className = 'heist-roller__strip';
        strip.style.transitionDelay = `${i * 45}ms`;
        for (let n = 0; n <= 19; n++) {
          const s = document.createElement('span');
          s.textContent = String(n % 10);
          strip.append(s);
        }
        strip.dataset.target = String(10 + Number(char));
        digit.append(strip);
        roller.append(digit);
      });
    });

    onVisible(rollers, (roller, visible, observer) => {
      if (!visible) return;
      roller.querySelectorAll('.heist-roller__strip').forEach((strip) => {
        strip.style.transform = `translateY(-${strip.dataset.target * 1.36}em)`;
      });
      observer?.unobserve(roller);
    });
  }

  /* Chart: grow bars once in view */
  function initCharts() {
    const charts = [...document.querySelectorAll('[data-heist-chart]')];
    if (reducedMotion.matches) {
      charts.forEach((chart) => chart.classList.add('is-visible'));
      return;
    }
    onVisible(charts, (chart, visible, observer) => {
      if (!visible) return;
      chart.classList.add('is-visible');
      observer?.unobserve(chart);
    });
  }

  /* Recipe drawers + serving scaler */
  function initRecipes() {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-recipe-open]');
      if (opener) {
        const dialog = document.getElementById(opener.dataset.recipeOpen);
        if (dialog) {
          dialog.showModal();
          dialog.scrollTop = 0;
          dialog._opener = opener;
        }
        return;
      }
      if (event.target.closest('[data-recipe-close]')) {
        event.target.closest('dialog')?.close();
      }
    });

    document.querySelectorAll('[data-heist-recipe]').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', () => dialog._opener?.focus());

      const servings = dialog.querySelector('[data-servings]');
      if (!servings) return;
      servings.addEventListener('change', () => {
        const factor = Number(servings.value) || 1;
        dialog.querySelectorAll('[data-amount]').forEach((el) => {
          el.textContent = scaleAmount(el.dataset.amount, factor);
        });
      });
    });
  }

  // Scales the leading number (or n-m range) of an amount, e.g. "38-40 g".
  function scaleAmount(amount, factor) {
    return amount.replace(/^(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?/, (match, a, b) => {
      const fmt = (n) => String(Math.round(Number(n) * factor * 100) / 100);
      return b ? `${fmt(a)}-${fmt(b)}` : fmt(a);
    });
  }

  const init = () => {
    initVideos();
    initProductCards();
    initRollers();
    initCharts();
    initRecipes();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Theme editor: re-run setup when a section is re-rendered.
  document.addEventListener('shopify:section:load', () => {
    initVideos();
    initProductCards();
    initRollers();
    initCharts();
  });
})();
