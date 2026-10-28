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

// Web Audio API Synthesizer for Realistic Glass Neon Tube Ignition (Sparks + Transformer Hum)
let audioCtx = null;
function playNeonIgnitionSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    if (!audioCtx) audioCtx = new AudioContextClass();

    const triggerSequence = () => {
      const now = audioCtx.currentTime;

      function triggerSpark(offsetSec, durationSec, gainLevel) {
        const bufferSize = Math.floor(audioCtx.sampleRate * durationSec);
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, now + offsetSec);
        filter.Q.setValueAtTime(3.2, now + offsetSec);

        const sparkGain = audioCtx.createGain();
        sparkGain.gain.setValueAtTime(gainLevel, now + offsetSec);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + offsetSec + durationSec);

        noise.connect(filter);
        filter.connect(sparkGain);
        sparkGain.connect(audioCtx.destination);
        noise.start(now + offsetSec);
      }

      triggerSpark(0.05, 0.09, 0.32);
      triggerSpark(0.32, 0.08, 0.25);
      triggerSpark(0.68, 0.14, 0.38);

      const osc60 = audioCtx.createOscillator();
      const osc120 = audioCtx.createOscillator();
      osc60.type = 'sawtooth';
      osc120.type = 'sine';
      osc60.frequency.setValueAtTime(60, now);
      osc120.frequency.setValueAtTime(120, now);

      const humFilter = audioCtx.createBiquadFilter();
      humFilter.type = 'lowpass';
      humFilter.frequency.setValueAtTime(340, now);

      const humGain = audioCtx.createGain();
      humGain.gain.setValueAtTime(0.0001, now);
      humGain.gain.setValueAtTime(0.06, now + 0.08);
      humGain.gain.setValueAtTime(0.006, now + 0.20);
      humGain.gain.setValueAtTime(0.05, now + 0.35);
      humGain.gain.setValueAtTime(0.008, now + 0.48);
      humGain.gain.linearRampToValueAtTime(0.09, now + 0.75);
      humGain.gain.exponentialRampToValueAtTime(0.015, now + 2.2);
      humGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc60.connect(humFilter);
      osc120.connect(humFilter);
      humFilter.connect(humGain);
      humGain.connect(audioCtx.destination);

      osc60.start(now);
      osc120.start(now);
      osc60.stop(now + 3.25);
      osc120.stop(now + 3.25);
    };

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        if (audioCtx.state === 'running') triggerSequence();
      }).catch(() => {});
      return false;
    }

    triggerSequence();
    return true;
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('qitchenApp');
  const introCurtain = document.getElementById('neonIntroCurtain');
  const btnDismissIntro = document.getElementById('btnDismissIntro');
  const leftHeroTitle = document.getElementById('leftHeroTitle');
  const showcaseVideo = document.getElementById('bottleShowcaseVideo');
  const menuOverlay = document.getElementById('qitchenMenuOverlay');
  const btnOpenOverlay = document.getElementById('btnOpenOverlay');
  const btnCloseOverlay = document.getElementById('btnCloseOverlay');

  // 1. Attempt Neon Ignition Sound Immediately on Load; if browser blocks until first gesture, fire on first movement/touch
  let neonSoundPlayed = playNeonIgnitionSound();

  function unlockNeonSoundOnce() {
    if (!neonSoundPlayed && introCurtain && !introCurtain.classList.contains('dismissed')) {
      neonSoundPlayed = true;
      playNeonIgnitionSound();
    }
  }

  window.addEventListener('pointerdown', unlockNeonSoundOnce, { once: true });
  window.addEventListener('keydown', unlockNeonSoundOnce, { once: true });

  // No auto-redirect! The Neon Intro stays open until the user clicks the Enter button
  if (btnDismissIntro && introCurtain) {
    btnDismissIntro.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!neonSoundPlayed) {
        neonSoundPlayed = true;
        playNeonIgnitionSound();
      }
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
  }

  function navigateView(targetView) {
    if (targetView === currentView) return;
    const direction = targetView === 'home' ? 'backward' : 'forward';

    if (!document.startViewTransition) {
      updateDOMView(targetView);
      return;
    }

    try {
      document.startViewTransition({
        update: () => updateDOMView(targetView),
        types: [direction]
      });
    } catch {
      document.startViewTransition(() => updateDOMView(targetView));
    }
  }

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-goto');
      if (target) navigateView(target);
    });
  });

  // 5. Qitchen Reservation & Birthday WhatsApp Form Submission
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
