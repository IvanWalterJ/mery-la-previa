// Exact Qitchen-Structured Menu Data for Mery La Previa
const QITCHEN_MENU_SECTIONS = [
  {
    id: 'cocktails',
    title: 'Cocktails 11:11',
    items: [
      {
        name: 'La Previa Crimson Coupe',
        badge: '★',
        price: '$12.500',
        desc: 'Gin macerado en cerezas negras, reducción de vino Mery Jane, vermut rosso especiado y bloque de hielo cristal sellado en vivo con pinzas de plata.',
        image: 'assets/img/ice-cube-previa.jpg'
      },
      {
        name: '11:11 Smoked Velvet',
        badge: '★',
        price: '$11.800',
        desc: 'Campari, gin botánico, cordial de pomelo rosado y campana de humo de romero quemado en barra cuando el neón marca las 11:11.',
        image: 'assets/img/cocktails-neon.jpg'
      },
      {
        name: 'Tutto Passa Spritz',
        badge: '◇',
        price: '$10.200',
        desc: 'Aperitivo artesanal de naranjas sanguíneas, Mery Jane Torrontés seco, soda botánica de cardamomo y aceituna verde en copa balón.',
        image: 'assets/img/brand-tutto-passa.jpg'
      }
    ]
  },
  {
    id: 'cortes',
    title: 'Carnes & Tapeo',
    items: [
      {
        name: 'Ojo de Bife en Bandeja Imperial',
        badge: '★',
        price: '$44.000',
        desc: '750g fileteados a punto rouge en fuente de plata con caracú asado a las brasas, manteca de hierbas ahumadas y papas triple cocción para compartir.',
        image: 'assets/img/steak-flash.jpg'
      },
      {
        name: 'Mollejas Crocantes & Brioche',
        badge: '★',
        price: '$19.800',
        desc: 'Doradas a la plancha de hierro con miel de caña, lima asada, emulsión de ajo negro y pan brioche tostado para picar al centro.',
        image: 'assets/img/brand-ig-grid.jpg'
      },
      {
        name: 'T-Bone Madurado "La Previa"',
        badge: '◇',
        price: '$52.000',
        desc: 'Corte de 900g con hueso madurado 35 días, gremolata cítrica, ajos confitados en oliva virgen y pimientos del padrón.',
        image: 'assets/img/steak-flash.jpg'
      }
    ]
  },
  {
    id: 'vinos',
    title: 'Mery Jane Wines',
    items: [
      {
        name: 'Mery Jane Blanc de Nuit (Frapera)',
        badge: '★',
        price: '$26.500',
        desc: 'Nuestra etiqueta insignia servida bien fría en frapera de plata. Notas de durazno blanco, jazmín y acidez eléctrica ideal para toda la noche.',
        image: 'assets/img/wine-mery.jpg'
      },
      {
        name: 'Ritual "Caja La Previa x4" + Brut',
        badge: '★',
        price: '$92.000',
        desc: 'Caja de 3 botellas Mery Jane a elección + 1 Espumante Extra Brut en mesa. El ritual favorito para grupos de amigos y festejos de cumpleaños.',
        image: 'assets/img/brand-previa-zine.jpg'
      },
      {
        name: 'Mery Jane Reserva Malbec Orgánico',
        badge: '◇',
        price: '$29.000',
        desc: 'Tinto de perfil moderno y fluido, ciruelas negras, pimienta rosa y paso de terciopelo pensado para acompañar carnes en bandeja.',
        image: 'assets/img/bottle-hero-isolated.jpg'
      }
    ]
  }
];

// Hero Title & Showcase Video per View
const VIEW_CONFIG = {
  home: {
    title: 'MERY<br />LA PREVIA',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.jpg',
    unmute: false
  },
  menu: {
    title: 'LA CARTA<br />NOCTURNA',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.jpg',
    unmute: false
  },
  about: {
    title: 'TENEMOS<br />PREVIA 13/11',
    video: 'assets/video/ice-cube-1311.mp4',
    poster: 'assets/img/ice-cube-previa.jpg',
    unmute: true
  },
  reservation: {
    title: 'CUMPLES<br />&amp; RESERVAS',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.jpg',
    unmute: false
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('qitchenApp');
  const introCurtain = document.getElementById('neonIntroCurtain');
  const neonIntroVideo = document.getElementById('neonIntroVideo');
  const btnDismissIntro = document.getElementById('btnDismissIntro');
  const leftHeroTitle = document.getElementById('leftHeroTitle');
  const showcaseVideo = document.getElementById('bottleShowcaseVideo');
  const menuOverlay = document.getElementById('qitchenMenuOverlay');
  const btnOpenOverlay = document.getElementById('btnOpenOverlay');
  const btnCloseOverlay = document.getElementById('btnCloseOverlay');

  // 1. Neon Intro Video Autoplay + Delayed Fade-In of Enter Button on Finish
  const introWrap = document.querySelector('.intro-enter-wrap');
  const btnIntroUnmute = document.getElementById('btnIntroUnmute');
  let buttonRevealed = false;
  let audioUnlocked = false;

  function revealEnterButton() {
    if (buttonRevealed || !introWrap) return;
    buttonRevealed = true;
    introWrap.classList.add('visible');
    if (btnIntroUnmute) btnIntroUnmute.classList.remove('visible');
  }

  // Safety fallback: guaranteed reveal after 3.4s so mobile is NEVER trapped
  const enterSafetyTimer = setTimeout(revealEnterButton, 3400);

  function activateAudio() {
    if (!neonIntroVideo) return;
    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    // Keep playing smoothly without seeking to 0 (avoids buffer freezing on mobile)
    const p = neonIntroVideo.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
    audioUnlocked = true;
    if (btnIntroUnmute) btnIntroUnmute.classList.remove('visible');
  }

  if (neonIntroVideo) {
    // When neon video reaches ignition finish (~3s or ended), show enter button
    neonIntroVideo.addEventListener('timeupdate', () => {
      if (neonIntroVideo.currentTime >= 3.0) {
        revealEnterButton();
      }
    });

    neonIntroVideo.addEventListener('ended', revealEnterButton);

    // If mobile battery saver or browser pauses/stalls video, reveal button safely
    neonIntroVideo.addEventListener('pause', () => {
      if (!introCurtain.classList.contains('dismissed')) {
        setTimeout(revealEnterButton, 500);
      }
    });

    neonIntroVideo.addEventListener('error', revealEnterButton);

    // Attempt unmuted autoplay immediately on entry
    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    neonIntroVideo.play().then(() => {
      // Unmuted autoplay was permitted by browser
      if (btnIntroUnmute) btnIntroUnmute.classList.remove('visible');
    }).catch(() => {
      // Browser blocked unmuted autoplay (standard on mobile).
      // Play muted immediately so visual video runs fluidly without stalling:
      neonIntroVideo.muted = true;
      neonIntroVideo.play().catch(() => {});
      // Display sound pill so user can easily un-mute with 1 tap:
      if (btnIntroUnmute && !buttonRevealed) {
        btnIntroUnmute.classList.add('visible');
      }
    });
  }

  // Sound pill tap handler: single clean event handler
  function handleSoundTap(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    activateAudio();
  }

  if (btnIntroUnmute) {
    btnIntroUnmute.addEventListener('click', handleSoundTap);
    btnIntroUnmute.addEventListener('touchend', handleSoundTap);
  }

  // Tapping anywhere on the curtain also un-mutes smoothly
  if (introCurtain) {
    introCurtain.addEventListener('click', (e) => {
      if (btnDismissIntro && btnDismissIntro.contains(e.target)) return;
      if (btnIntroUnmute && btnIntroUnmute.contains(e.target)) return;
      if (!audioUnlocked) activateAudio();
    });
  }

  if (btnDismissIntro && introCurtain) {
    btnDismissIntro.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(enterSafetyTimer);
      if (neonIntroVideo) neonIntroVideo.pause();
      introCurtain.classList.add('dismissed');
    });
  }

  // 2. Qitchen Fullscreen Hamburger Menu Overlay Controls (Screenshot 1 Match)
  function toggleOverlay(openState) {
    if (!menuOverlay) return;
    menuOverlay.classList.toggle('open', openState);
    menuOverlay.setAttribute('aria-hidden', String(!openState));
  }

  if (btnOpenOverlay) {
    btnOpenOverlay.addEventListener('click', () => toggleOverlay(true));
  }
  if (btnCloseOverlay) {
    btnCloseOverlay.addEventListener('click', () => toggleOverlay(false));
  }

  document.querySelectorAll('[data-overlay-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-overlay-goto');
      toggleOverlay(false);
      if (target) navigateView(target);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('open')) {
      toggleOverlay(false);
    }
  });

  // 3. Render Qitchen /menu Sections with Diamond Headings & Dotted Price Leaders
  const menuContainer = document.getElementById('qitchenMenuContainer');
  const filterBtns = document.querySelectorAll('.q-pill-btn');
  let currentFilter = 'all';

  function renderQitchenMenu() {
    if (!menuContainer) return;
    const sections = currentFilter === 'all'
      ? QITCHEN_MENU_SECTIONS
      : QITCHEN_MENU_SECTIONS.filter((sec) => sec.id === currentFilter);

    menuContainer.innerHTML = sections.map((sec) => `
      <div class="q-menu-group">
        <div class="q-diamond-heading">
          <span class="q-diamond-line"></span>
          <span class="q-diamond-symbol"></span>
          <h2>${sec.title}</h2>
          <span class="q-diamond-symbol"></span>
          <span class="q-diamond-line"></span>
        </div>
        ${sec.items.map((item) => `
          <article class="q-dish-row" data-goto="reservation" title="Click para reservar mesa con este plato">
            <img class="q-dish-thumb" src="${item.image}" alt="${item.name}" loading="lazy" />
            <div>
              <div class="q-dish-header">
                <h3 class="q-dish-name">${item.name}</h3>
                <span class="q-leaf-badge">${item.badge}</span>
                <span class="q-dotted-leader"></span>
                <span class="q-dish-price">${item.price}</span>
              </div>
              <p class="q-dish-desc">${item.desc}</p>
            </div>
          </article>
        `).join('')}
      </div>
    `).join('');

    menuContainer.querySelectorAll('[data-goto]').forEach((row) => {
      row.addEventListener('click', () => navigateView('reservation'));
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
      renderQitchenMenu();
      const menuPanel = document.querySelector('#view-menu .q-panel-bordered');
      if (menuPanel) menuPanel.scrollTop = 0;
    });
  });

  renderQitchenMenu();

  // 4. Directional Slide View Transition + Left Video Swap (Bottle 360 <-> Ice Cube 13/11 with Sound)
  let currentView = 'home';

  function updateDOMView(targetView) {
    const cfg = VIEW_CONFIG[targetView] || VIEW_CONFIG.home;

    if (appEl) appEl.setAttribute('data-view', targetView);
    if (leftHeroTitle) leftHeroTitle.innerHTML = cfg.title;

    // Swap left showcase video when entering/leaving 'about' (La Previa 13/11)
    if (showcaseVideo) {
      const currentSrc = showcaseVideo.getAttribute('src');
      if (currentSrc !== cfg.video) {
        showcaseVideo.setAttribute('src', cfg.video);
        showcaseVideo.setAttribute('poster', cfg.poster);
        showcaseVideo.load();
      }
      showcaseVideo.muted = !cfg.unmute;
      showcaseVideo.volume = cfg.unmute ? 0.85 : 0;
      showcaseVideo.play().catch(() => {
        // Fallback if browser requires muted playback
        showcaseVideo.muted = true;
        showcaseVideo.play().catch(() => {});
      });
    }

    document.querySelectorAll('.q-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${targetView}`);
    });

    document.querySelectorAll('.q-nav-link').forEach((navBtn) => {
      navBtn.classList.toggle('active', navBtn.getAttribute('data-goto') === targetView);
    });

    currentView = targetView;

    // Scroll to the absolute top of the section (fixes staying in the middle)
    const targetSection = document.getElementById(`view-${targetView}`);
    if (targetSection) {
      const panel = targetSection.querySelector('.q-panel-bordered');
      if (panel) panel.scrollTop = 0;
      targetSection.scrollTop = 0;
    }
    const rightCol = document.getElementById('qitchenRightCol');
    if (rightCol) rightCol.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function navigateView(targetView) {
    if (targetView === currentView) return;

    if (!document.startViewTransition) {
      updateDOMView(targetView);
      return;
    }

    document.startViewTransition(() => updateDOMView(targetView));
  }

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-goto');
      if (target) navigateView(target);
    });
  });

  // 5. Custom High-End Branded Select Dropdowns (Matches Qitchen Landing Aesthetics)
  document.querySelectorAll('.q-custom-select').forEach((wrap) => {
    const trigger = wrap.querySelector('.q-select-trigger');
    const valEl = wrap.querySelector('.q-select-value');
    const options = wrap.querySelectorAll('.q-select-option');
    const nativeSelect = wrap.querySelector('.q-select-native');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains('open');

        // Close any other open dropdowns first
        document.querySelectorAll('.q-custom-select.open').forEach((w) => {
          if (w !== wrap) {
            w.classList.remove('open');
            w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });

        wrap.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    }

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.dataset.value;
        const label = opt.querySelector('span')?.textContent || value;

        options.forEach((o) => {
          const isSel = o === opt;
          o.classList.toggle('selected', isSel);
          o.setAttribute('aria-selected', String(isSel));
        });

        if (valEl) valEl.textContent = label;
        if (nativeSelect) {
          nativeSelect.value = value;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        wrap.classList.remove('open');
        trigger?.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Light dismiss on outside click
  window.addEventListener('click', () => {
    document.querySelectorAll('.q-custom-select.open').forEach((w) => {
      w.classList.remove('open');
      w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.q-custom-select.open').forEach((w) => {
        w.classList.remove('open');
        w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // 6. Qitchen Reservation & Birthday WhatsApp Form Submission
  const resForm = document.getElementById('qitchenResForm');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName')?.value || '';
      const motivo = document.getElementById('resType')?.value || 'Reserva';
      const guests = document.getElementById('resGuests')?.value || '4';
      const day = document.getElementById('resDay')?.value || 'Viernes';
      const time = document.getElementById('resTime')?.value || '21:00 hs';

      const msg = `Hola Mery La Previa! Soy ${name}. Quiero reservar para ${guests} personas (${motivo}) el ${day} a las ${time}.`;
      window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }
});
