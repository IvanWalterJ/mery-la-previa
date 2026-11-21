// MERY LA PREVIA — Versión 2 Controller
// V2 Features:
// - Portada de inicio con cartel luminoso (neon intro curtain con audio y botón de ingreso)
// - Complete silence on internal videos & views (ice-cube video muted, no synthesized audio)
// - Reordered bento cards: 1. La Carta, 2. Promos y Descuentos (ex-Ruleta), 3. Reservas, 4. Nosotros
// - Navigation & Section renamed: "La Previa 11" -> "Nosotros", with Google Maps embed
// - Button & Section renamed: "Cumples & Reservas" -> "RESERVA ACÁ" / "Reservas"
// - Title for La Carta is simply "LA CARTA" (not "NOCTURNA")
// - Subtag "Tu noche empieza acá" only visible on Home view
// - Direct WhatsApp reservation with live linked phone from Evolution API / Admin QR
// - Dynamic Días and Motivos editable from Admin Panel
// - Original Roulette system with automatic WhatsApp dispatch via Evolution API + Download Voucher button

const FALLBACK_SECTIONS = window.MeryStore
  ? window.MeryStore.DEFAULT_MENU_SECTIONS
  : [];

const DEFAULT_SHOWCASE_WIDE_INTRO = 'assets/video/variaciones-flow/v5-hero-wide.mp4';
const DEFAULT_SHOWCASE_WIDE_LOOP = 'assets/video/variaciones-flow/v5-parte2-wide-loop.mp4';
const DEFAULT_SHOWCASE_PORTRAIT_INTRO = 'assets/video/variaciones-flow/v5-hero-portrait.mp4';
const DEFAULT_SHOWCASE_PORTRAIT_LOOP = 'assets/video/variaciones-flow/v5-parte2-loop.mp4';

const SHOWCASE_MEDIA = {
  wide: {
    introVideo: DEFAULT_SHOWCASE_WIDE_INTRO,
    introPoster: 'assets/img/portada-barra-wide-empieza-aca.webp',
    loopVideo: DEFAULT_SHOWCASE_WIDE_LOOP,
    loopPoster: 'assets/img/portada-barra-wide-clean.webp',
    width: 1920,
    height: 1080
  },
  portrait: {
    introVideo: DEFAULT_SHOWCASE_PORTRAIT_INTRO,
    introPoster: 'assets/img/portada-barra-empieza-aca.webp',
    loopVideo: DEFAULT_SHOWCASE_PORTRAIT_LOOP,
    loopPoster: 'assets/img/portada-barra-clean-notext.webp',
    width: 1080,
    height: 1920
  }
};
const HERO_TEXT_REVEAL_TIME = 6.6;

const MOBILE_SHOWCASE_MQ =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 1024px) and (orientation: portrait)')
    : null;

function getActiveShowcaseVariant() {
  return MOBILE_SHOWCASE_MQ && MOBILE_SHOWCASE_MQ.matches
    ? SHOWCASE_MEDIA.portrait
    : SHOWCASE_MEDIA.wide;
}

function isHeroIntroVideo(src) {
  return (
    src === DEFAULT_SHOWCASE_WIDE_INTRO ||
    src === DEFAULT_SHOWCASE_PORTRAIT_INTRO
  );
}

const INITIAL_SHOWCASE_VARIANT = getActiveShowcaseVariant();

const VIEW_CONFIG = {
  home: {
    title: 'MERY JANE<br />LA PREVIA',
    video: INITIAL_SHOWCASE_VARIANT.introVideo,
    poster: INITIAL_SHOWCASE_VARIANT.introPoster,
    unmute: false
  },
  drinks: {
    title: 'TRAGOS &amp;<br />BEBIDAS',
    video: INITIAL_SHOWCASE_VARIANT.introVideo,
    poster: INITIAL_SHOWCASE_VARIANT.introPoster,
    unmute: false
  },
  menu: {
    title: 'LA CARTA',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.webp',
    unmute: false
  },
  about: {
    title: 'NOSOTROS<br />MERY JANE',
    video: INITIAL_SHOWCASE_VARIANT.introVideo,
    poster: INITIAL_SHOWCASE_VARIANT.introPoster,
    unmute: false
  },
  reservation: {
    title: 'RESERVAS<br />MERY JANE',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.webp',
    unmute: false
  }
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('qitchenApp');
  const introCurtain = document.getElementById('neonIntroCurtain');
  const neonIntroVideo = document.getElementById('neonIntroVideo');
  const btnDismissIntro = document.getElementById('btnDismissIntro');
  const introWrap = document.querySelector('.intro-enter-wrap');
  const leftHeroTitle = document.getElementById('leftHeroTitle');
  const showcaseVideo = document.getElementById('bottleShowcaseVideo');
  const showcaseLoopVideo = document.getElementById('bottleShowcaseLoopVideo');
  const btnShowcaseSound = document.getElementById('btnShowcaseSound');
  const menuOverlay = document.getElementById('qitchenMenuOverlay');
  const btnOpenOverlay = document.getElementById('btnOpenOverlay');
  const btnCloseOverlay = document.getElementById('btnCloseOverlay');
  const heroBottom = document.querySelector('.qitchen-hero-bottom');
  const heroSubtag = document.querySelector('.q-hero-subtag');

  // 1b. Hero showcase sequence: desktop 16:9 wide vs portrait 9:16, Part 1 intro -> Part 2 loop
  const SLUG_TO_ROUTE = {
    '': { view: 'home', openRoulette: false, hasSlug: false },
    'inicio': { view: 'home', openRoulette: false, hasSlug: true },
    'home': { view: 'home', openRoulette: false, hasSlug: true },
    'tragos': { view: 'drinks', openRoulette: false, hasSlug: true },
    'bebidas': { view: 'drinks', openRoulette: false, hasSlug: true },
    'drinks': { view: 'drinks', openRoulette: false, hasSlug: true },
    'carta': { view: 'menu', openRoulette: false, hasSlug: true },
    'menu': { view: 'menu', openRoulette: false, hasSlug: true },
    'nosotros': { view: 'about', openRoulette: false, hasSlug: true },
    'about': { view: 'about', openRoulette: false, hasSlug: true },
    'reservas': { view: 'reservation', openRoulette: false, hasSlug: true },
    'reserva': { view: 'reservation', openRoulette: false, hasSlug: true },
    'reservation': { view: 'reservation', openRoulette: false, hasSlug: true },
    'ruleta': { view: 'home', openRoulette: true, hasSlug: true },
    'promos': { view: 'home', openRoulette: true, hasSlug: true },
    'roulette': { view: 'home', openRoulette: true, hasSlug: true }
  };

  const VIEW_TO_PATH = {
    home: '/',
    drinks: '/tragos',
    menu: '/carta',
    about: '/nosotros',
    reservation: '/reservas'
  };

  function resolveRouteFromLocation() {
    const cleanPath = (window.location.pathname || '/')
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase();
    const cleanHash = (window.location.hash || '')
      .replace(/^#\/?|\/+$/g, '')
      .toLowerCase();
    const searchSlug = (new URLSearchParams(window.location.search).get('seccion') || '')
      .trim()
      .toLowerCase();

    if (cleanPath && cleanPath !== 'index.html' && SLUG_TO_ROUTE[cleanPath]) {
      return SLUG_TO_ROUTE[cleanPath];
    }
    if (cleanHash && SLUG_TO_ROUTE[cleanHash]) {
      return SLUG_TO_ROUTE[cleanHash];
    }
    if (searchSlug && SLUG_TO_ROUTE[searchSlug]) {
      return SLUG_TO_ROUTE[searchSlug];
    }
    return SLUG_TO_ROUTE[''];
  }

  const initialRoute = resolveRouteFromLocation();
  let currentView = initialRoute.hasSlug ? initialRoute.view : 'home';
  let showcaseIntroCompleted = false;
  let showcaseCustomPrevia = false;
  let heroTextSafetyTimer = null;
  const showcaseLoopBlobs = Object.create(null);

  function clearHeroTextSafetyTimer() {
    if (heroTextSafetyTimer) {
      clearTimeout(heroTextSafetyTimer);
      heroTextSafetyTimer = null;
    }
  }

  function revealHeroText() {
    clearHeroTextSafetyTimer();
    if (heroBottom) {
      heroBottom.classList.add('is-revealed');
    }
  }

  function scheduleHeroTextSafetyReveal() {
    clearHeroTextSafetyTimer();
    heroTextSafetyTimer = setTimeout(revealHeroText, 7600);
  }

  function syncHeroTextVisibility() {
    if (!heroBottom) return;
    const cfg = VIEW_CONFIG[currentView] || VIEW_CONFIG.home;
    if (!isHeroIntroVideo(cfg.video) || showcaseIntroCompleted) {
      revealHeroText();
      return;
    }
    if (showcaseVideo && showcaseVideo.currentTime >= HERO_TEXT_REVEAL_TIME) {
      revealHeroText();
      return;
    }
    heroBottom.classList.remove('is-revealed');
  }

  function getShowcaseDimensions(logicalSrc) {
    if (
      logicalSrc === SHOWCASE_MEDIA.portrait.introVideo ||
      logicalSrc === SHOWCASE_MEDIA.portrait.loopVideo
    ) {
      return { width: SHOWCASE_MEDIA.portrait.width, height: SHOWCASE_MEDIA.portrait.height };
    }
    if (
      logicalSrc === SHOWCASE_MEDIA.wide.introVideo ||
      logicalSrc === SHOWCASE_MEDIA.wide.loopVideo
    ) {
      return { width: SHOWCASE_MEDIA.wide.width, height: SHOWCASE_MEDIA.wide.height };
    }
    return { width: 1280, height: 720 };
  }

  function setShowcaseSource(logicalSrc, posterSrc, shouldLoop) {
    if (!showcaseVideo) return;
    const targetSrc = showcaseLoopBlobs[logicalSrc] || logicalSrc;
    const dims = getShowcaseDimensions(logicalSrc);
    showcaseVideo.loop = Boolean(shouldLoop);
    showcaseVideo.dataset.logicalSrc = logicalSrc;
    showcaseVideo.setAttribute('width', String(dims.width));
    showcaseVideo.setAttribute('height', String(dims.height));
    if (posterSrc) {
      showcaseVideo.setAttribute('poster', posterSrc);
    }
    if (showcaseVideo.getAttribute('src') !== targetSrc) {
      showcaseVideo.setAttribute('src', targetSrc);
      showcaseVideo.load();
    }
  }

  function syncShowcaseViewConfig() {
    const variant = getActiveShowcaseVariant();
    const targetVideo = showcaseIntroCompleted ? variant.loopVideo : variant.introVideo;
    const targetPoster = showcaseIntroCompleted ? variant.loopPoster : variant.introPoster;
    VIEW_CONFIG.home.video = targetVideo;
    VIEW_CONFIG.home.poster = targetPoster;
    VIEW_CONFIG.drinks.video = targetVideo;
    VIEW_CONFIG.drinks.poster = targetPoster;
    if (!showcaseCustomPrevia) {
      VIEW_CONFIG.about.video = targetVideo;
      VIEW_CONFIG.about.poster = targetPoster;
    }
    return variant;
  }

  function warmShowcaseLoop(variant) {
    if (
      !variant ||
      showcaseLoopBlobs[variant.loopVideo] ||
      typeof window.fetch !== 'function' ||
      window.location.protocol === 'file:'
    ) {
      return;
    }
    const loopUrl = variant.loopVideo;
    showcaseLoopBlobs[loopUrl] = loopUrl;
    fetch(loopUrl)
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob) {
          showcaseLoopBlobs[loopUrl] = URL.createObjectURL(blob);
        }
      })
      .catch(() => {});
  }

  function syncPreloadedLoopLayer(variant) {
    if (!showcaseLoopVideo || !variant) return;
    const loopSrc = variant.loopVideo;
    const dims = getShowcaseDimensions(loopSrc);
    showcaseLoopVideo.loop = true;
    showcaseLoopVideo.muted = true;
    showcaseLoopVideo.volume = 0;
    showcaseLoopVideo.dataset.logicalSrc = loopSrc;
    showcaseLoopVideo.setAttribute('width', String(dims.width));
    showcaseLoopVideo.setAttribute('height', String(dims.height));
    if (variant.loopPoster) {
      showcaseLoopVideo.setAttribute('poster', variant.loopPoster);
    }
    if (showcaseLoopVideo.getAttribute('src') !== loopSrc) {
      showcaseLoopVideo.setAttribute('src', loopSrc);
      showcaseLoopVideo.load();
    }
  }

  function shouldUseLoopLayer(targetView) {
    if (!showcaseLoopVideo || !showcaseIntroCompleted) return false;
    const variant = getActiveShowcaseVariant();
    if (!variant || variant.introVideo === variant.loopVideo) return false;
    const viewKey = targetView || currentView;
    if (viewKey === 'about' && showcaseCustomPrevia) return false;
    return viewKey === 'home' || viewKey === 'drinks' || viewKey === 'about';
  }

  function activateShowcaseLayer(useLoopLayer) {
    if (!showcaseVideo) return;
    if (useLoopLayer && showcaseLoopVideo) {
      showcaseLoopVideo.classList.remove('is-instant-hidden');
      showcaseLoopVideo.muted = true;
      showcaseLoopVideo.volume = 0;

      const revealLoopLayer = () => {
        if (!shouldUseLoopLayer(currentView)) return;
        showcaseVideo.classList.add('is-instant-hidden');
        showcaseVideo.classList.remove('is-top-layer');
        showcaseVideo.pause();
      };

      const waitForPaintedFrame = () => {
        if (typeof showcaseLoopVideo.requestVideoFrameCallback === 'function') {
          showcaseLoopVideo.requestVideoFrameCallback(() => revealLoopLayer());
        } else {
          requestAnimationFrame(() => requestAnimationFrame(revealLoopLayer));
        }
      };

      const playPromise = showcaseLoopVideo.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(waitForPaintedFrame).catch(revealLoopLayer);
      } else {
        waitForPaintedFrame();
      }
    } else {
      showcaseVideo.classList.remove('is-instant-hidden');
      showcaseVideo.classList.add('is-top-layer');
      if (showcaseLoopVideo) {
        const cfg = VIEW_CONFIG[currentView] || VIEW_CONFIG.home;
        if (isHeroIntroVideo(cfg.video)) {
          // Keep loop layer composited behind the top hero video so handoff never flashes black.
          showcaseLoopVideo.classList.remove('is-instant-hidden');
        } else {
          showcaseLoopVideo.classList.add('is-instant-hidden');
        }
        showcaseLoopVideo.pause();
      }
    }
  }

  if (showcaseVideo) {
    const initialVariant = syncShowcaseViewConfig();
    const curtainVisible = introCurtain && !introCurtain.classList.contains('dismissed');
    setShowcaseSource(VIEW_CONFIG.home.video, VIEW_CONFIG.home.poster, false);
    syncPreloadedLoopLayer(initialVariant);
    activateShowcaseLayer(false);

    if (curtainVisible) {
      showcaseVideo.autoplay = false;
      showcaseVideo.pause();
      try {
        showcaseVideo.currentTime = 0;
      } catch (_) {}
    } else {
      scheduleHeroTextSafetyReveal();
    }

    syncHeroTextVisibility();
    warmShowcaseLoop(initialVariant);

    showcaseVideo.addEventListener('playing', () => {
      if (showcaseVideo.hasAttribute('poster')) {
        showcaseVideo.removeAttribute('poster');
      }
    });

    const checkHeroTextReveal = () => {
      const currentLogical =
        showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
      if (isHeroIntroVideo(currentLogical) && showcaseVideo.currentTime >= HERO_TEXT_REVEAL_TIME) {
        revealHeroText();
      }
    };
    showcaseVideo.addEventListener('timeupdate', checkHeroTextReveal);
    showcaseVideo.addEventListener('seeked', checkHeroTextReveal);

    showcaseVideo.addEventListener('ended', () => {
      const currentLogical =
        showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
      if (isHeroIntroVideo(currentLogical)) {
        showcaseIntroCompleted = true;
        revealHeroText();
        muteShowcaseSound();
        const variant = syncShowcaseViewConfig();
        syncPreloadedLoopLayer(variant);
        if (showcaseLoopVideo) {
          if (shouldUseLoopLayer(currentView)) {
            activateShowcaseLayer(true);
          }
        } else {
          setShowcaseSource(variant.loopVideo, variant.loopPoster, true);
          showcaseVideo.play().catch(() => {});
        }
      }
    });

    showcaseVideo.addEventListener('error', revealHeroText);

    if (MOBILE_SHOWCASE_MQ && typeof MOBILE_SHOWCASE_MQ.addEventListener === 'function') {
      MOBILE_SHOWCASE_MQ.addEventListener('change', () => {
        const variant = syncShowcaseViewConfig();
        warmShowcaseLoop(variant);
        syncPreloadedLoopLayer(variant);
        const cfg = VIEW_CONFIG[currentView];
        if (!cfg) return;
        if (shouldUseLoopLayer(currentView)) {
          activateShowcaseLayer(true);
          return;
        }
        activateShowcaseLayer(false);
        const currentLogical =
          showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
        if (currentLogical !== cfg.video) {
          setShowcaseSource(cfg.video, cfg.poster, !isHeroIntroVideo(cfg.video));
          syncHeroTextVisibility();
          if (!introCurtain || introCurtain.classList.contains('dismissed')) {
            if (isHeroIntroVideo(cfg.video) && !showcaseIntroCompleted) {
              scheduleHeroTextSafetyReveal();
            }
            showcaseVideo.play().catch(() => {});
          }
        }
      });
    }
  } else {
    revealHeroText();
  }

  // Hero showcase sound: opt-in, subtle, auto-muted after one video cycle
  const SHOWCASE_SOUND_CYCLE_MS = 10000;
  let showcaseSoundTimer = null;

  function updateShowcaseSoundUI(isActive) {
    if (!btnShowcaseSound) return;
    btnShowcaseSound.classList.toggle('is-active', isActive);
    btnShowcaseSound.setAttribute('aria-pressed', String(isActive));
    btnShowcaseSound.setAttribute(
      'aria-label',
      isActive ? 'Silenciar el sonido del video' : 'Activar el sonido del video'
    );
  }

  function clearShowcaseSoundTimer() {
    if (showcaseSoundTimer) {
      clearTimeout(showcaseSoundTimer);
      showcaseSoundTimer = null;
    }
  }

  function muteShowcaseSound() {
    clearShowcaseSoundTimer();
    if (showcaseVideo) {
      showcaseVideo.muted = true;
      showcaseVideo.volume = 0;
    }
    updateShowcaseSoundUI(false);
  }

  function enableShowcaseSound() {
    if (!showcaseVideo) return;
    clearShowcaseSoundTimer();
    showcaseVideo.muted = false;
    showcaseVideo.volume = 0.85;
    const playAttempt = showcaseVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        muteShowcaseSound();
        showcaseVideo.play().catch(() => {
          revealHeroText();
        });
      });
    }
    updateShowcaseSoundUI(true);
    showcaseSoundTimer = setTimeout(muteShowcaseSound, SHOWCASE_SOUND_CYCLE_MS);
  }

  if (btnShowcaseSound && showcaseVideo) {
    btnShowcaseSound.addEventListener('click', () => {
      if (showcaseVideo.muted) {
        enableShowcaseSound();
      } else {
        muteShowcaseSound();
      }
    });
  }

  // 1. Neon Intro Video Autoplay + Delayed Fade-In of Enter Button on Finish
  let buttonRevealed = false;
  let audioUnlocked = false;

  function revealEnterButton() {
    if (buttonRevealed || !introWrap) return;
    buttonRevealed = true;
    introWrap.classList.add('visible');
  }

  let enterSafetyTimer = initialRoute.hasSlug ? null : setTimeout(revealEnterButton, 3400);

  if (initialRoute.hasSlug) {
    document.documentElement.classList.add('skip-intro');
    audioUnlocked = true;
    if (introCurtain) introCurtain.classList.add('dismissed');
    if (neonIntroVideo) {
      neonIntroVideo.pause();
      neonIntroVideo.muted = true;
    }
  }

  function unlockIntroAudio() {
    if (!neonIntroVideo || audioUnlocked) return;
    if (introCurtain && introCurtain.classList.contains('dismissed')) return;
    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    if (neonIntroVideo.ended) {
      audioUnlocked = true;
      return;
    }
    const p = neonIntroVideo.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        audioUnlocked = true;
      }).catch(() => {
        neonIntroVideo.muted = true;
        neonIntroVideo.play().catch(() => {});
      });
    } else {
      audioUnlocked = true;
    }
  }

  if (neonIntroVideo && !initialRoute.hasSlug) {
    neonIntroVideo.addEventListener('timeupdate', () => {
      if (neonIntroVideo.currentTime >= 3.0) {
        revealEnterButton();
      }
    });

    neonIntroVideo.addEventListener('ended', revealEnterButton);

    neonIntroVideo.addEventListener('pause', () => {
      if (introCurtain && !introCurtain.classList.contains('dismissed')) {
        setTimeout(revealEnterButton, 500);
      }
    });

    neonIntroVideo.addEventListener('error', revealEnterButton);

    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    neonIntroVideo.play().then(() => {
      audioUnlocked = true;
    }).catch(() => {
      neonIntroVideo.muted = true;
      neonIntroVideo.play().catch(() => {});
    });
  }

  if (introCurtain) {
    const handleCurtainInteraction = (e) => {
      if (btnDismissIntro && e && e.target && btnDismissIntro.contains(e.target)) return;
      unlockIntroAudio();
    };
    introCurtain.addEventListener('click', handleCurtainInteraction);
    introCurtain.addEventListener('touchend', handleCurtainInteraction, { passive: true });
  }

  window.addEventListener('keydown', () => {
    if (introCurtain && !introCurtain.classList.contains('dismissed')) {
      unlockIntroAudio();
    }
  });

  if (btnDismissIntro && introCurtain) {
    btnDismissIntro.addEventListener('click', (e) => {
      e.stopPropagation();
      audioUnlocked = true;
      clearTimeout(enterSafetyTimer);
      if (neonIntroVideo) neonIntroVideo.pause();
      introCurtain.classList.add('dismissed');
      if (showcaseVideo && !showcaseIntroCompleted) {
        const currentLogical =
          showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
        if (isHeroIntroVideo(currentLogical)) {
          activateShowcaseLayer(false);
          showcaseVideo.loop = false;
          try {
            showcaseVideo.currentTime = 0;
          } catch (_) {}
          syncHeroTextVisibility();
          scheduleHeroTextSafetyReveal();
          enableShowcaseSound();
        }
      }
    });
  }

  // Ensure showcase video starts muted until user enters (or auto-plays muted if curtain already dismissed)
  if (showcaseVideo) {
    showcaseVideo.muted = true;
    showcaseVideo.volume = 0;
    if (!initialRoute.hasSlug && (!introCurtain || introCurtain.classList.contains('dismissed'))) {
      enableShowcaseSound();
    }
  }

  // 2. Qitchen Fullscreen Hamburger Menu Overlay Controls
  function toggleOverlay(openState) {
    if (!menuOverlay) return;
    const shouldOpen = typeof openState === 'boolean'
      ? openState
      : !menuOverlay.classList.contains('open');
    menuOverlay.classList.toggle('open', shouldOpen);
    menuOverlay.setAttribute('aria-hidden', String(!shouldOpen));
    if (btnOpenOverlay) {
      btnOpenOverlay.classList.toggle('is-active', shouldOpen);
      btnOpenOverlay.setAttribute('aria-expanded', String(shouldOpen));
    }
  }

  if (btnOpenOverlay) {
    btnOpenOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuOverlay ? menuOverlay.classList.contains('open') : false;
      toggleOverlay(!isOpen);
    });
  }

  if (btnCloseOverlay) {
    btnCloseOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleOverlay(false);
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      if (!e.target.closest('.q-overlay-nav')) {
        toggleOverlay(false);
      }
    });
  }

  document.querySelectorAll('[data-overlay-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-overlay-goto');
      toggleOverlay(false);
      if (target === 'roulette') {
        openRouletteModal();
      } else if (target) {
        navigateView(target);
      }
    });
  });

  // 2. Dish Detail Modal (#qitchenDishModal)
  const dishModal = document.getElementById('qitchenDishModal');
  const btnCloseDishModal = document.getElementById('btnCloseDishModal');
  const btnDishModalBack = document.getElementById('btnDishModalBack');
  const btnDishModalReserve = document.getElementById('btnDishModalReserve');
  const dishModalImage = document.getElementById('dishModalImage');
  const dishModalCategory = document.getElementById('dishModalCategory');
  const dishModalBadge = document.getElementById('dishModalBadge');
  const dishModalTitle = document.getElementById('dishModalTitle');
  const dishModalPrice = document.getElementById('dishModalPrice');
  const dishModalLead = document.getElementById('dishModalLead');
  const dishModalStory = document.getElementById('dishModalStory');
  const dishModalPairingWrap = document.getElementById('dishModalPairingWrap');
  const dishModalPairing = document.getElementById('dishModalPairing');
  const dishModalTags = document.getElementById('dishModalTags');

  let activeModalDish = null;

  function resolveDistinction(badge) {
    const raw = String(badge || '').trim();
    if (!raw || raw === 'none') return null;
    if (window.MeryStore && typeof window.MeryStore.resolveDishDistinction === 'function') {
      return window.MeryStore.resolveDishDistinction(raw);
    }
    if (raw === '★') return { id: '★', symbol: '★', label: 'Recomendado de la casa' };
    if (raw === '◇') return { id: '◇', symbol: '◇', label: 'Especialidad 11:11' };
    const parts = raw.split(/\s+/);
    const first = parts[0] || '';
    const hasSymbol = parts.length > 1 && first.length <= 2;
    return {
      id: raw,
      symbol: hasSymbol ? first : '✦',
      label: hasSymbol ? parts.slice(1).join(' ') : raw
    };
  }

  function openDishModal(item, categoryTitle) {
    if (!dishModal || !item) return;
    activeModalDish = { item, categoryTitle };

    const modalCard = dishModal.querySelector('.q-dish-modal-card');
    if (modalCard) modalCard.scrollTop = 0;
    dishModal.scrollTop = 0;

    if (dishModalImage) {
      dishModalImage.src = item.image || 'assets/img/ice-cube-previa.webp';
      dishModalImage.alt = item.name || 'Detalle del plato';
      const modalPos = item.modalImagePosition || item.imagePosition || '50% 50%';
      const modalZoom = item.modalImageZoom || item.imageZoom || 1;
      dishModalImage.style.objectPosition = modalPos;
      dishModalImage.style.transformOrigin = modalPos;
      dishModalImage.style.transform = `scale(${modalZoom})`;
    }
    if (dishModalCategory) {
      dishModalCategory.textContent = categoryTitle || 'LA CARTA';
    }
    if (dishModalBadge) {
      const distinction = resolveDistinction(item.badge);
      if (distinction && distinction.label) {
        const badgeText = distinction.symbol
          ? `${distinction.symbol} ${distinction.label}`
          : distinction.label;
        dishModalBadge.textContent = badgeText.toUpperCase();
        dishModalBadge.hidden = false;
      } else {
        dishModalBadge.textContent = '';
        dishModalBadge.hidden = true;
      }
    }
    if (dishModalTitle) dishModalTitle.textContent = item.name || '';
    if (dishModalPrice) dishModalPrice.textContent = item.price || '';
    if (dishModalLead) dishModalLead.textContent = item.desc || '';

    const extendedCopy = item.detailCopy || item.longDesc || item.story || item.desc || '';
    if (dishModalStory) {
      dishModalStory.textContent = extendedCopy;
    }

    if (dishModalPairingWrap && dishModalPairing) {
      if (item.pairing) {
        dishModalPairing.textContent = item.pairing;
        dishModalPairingWrap.style.display = 'flex';
      } else {
        dishModalPairingWrap.style.display = 'none';
      }
    }

    if (dishModalTags) {
      const tags = Array.isArray(item.tags) && item.tags.length > 0
        ? item.tags
        : ['Elaboración Propia', 'Mery La Previa'];
      dishModalTags.innerHTML = tags
        .map((t) => `<span class="q-dish-tag">◇ ${escapeHtml(t)}</span>`)
        .join('');
    }

    dishModal.classList.add('open');
    dishModal.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      if (modalCard) modalCard.scrollTop = 0;
      dishModal.scrollTop = 0;
      if (btnCloseDishModal && typeof btnCloseDishModal.focus === 'function') {
        try {
          btnCloseDishModal.focus({ preventScroll: true });
        } catch (_) {
          btnCloseDishModal.focus();
        }
      }
    });
  }

  function closeDishModal() {
    if (!dishModal) return;
    dishModal.classList.remove('open');
    dishModal.setAttribute('aria-hidden', 'true');
    activeModalDish = null;
  }

  if (btnCloseDishModal) btnCloseDishModal.addEventListener('click', closeDishModal);
  if (btnDishModalBack) btnDishModalBack.addEventListener('click', closeDishModal);
  if (dishModal) {
    dishModal.addEventListener('click', (e) => {
      if (e.target === dishModal) closeDishModal();
    });
  }

  if (btnDishModalReserve) {
    btnDishModalReserve.addEventListener('click', () => {
      closeDishModal();
      navigateView('reservation');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dishModal && dishModal.classList.contains('open')) {
        closeDishModal();
      } else if (menuOverlay && menuOverlay.classList.contains('open')) {
        toggleOverlay(false);
      }
    }
  });

  // 3. Render Qitchen /drinks + /menu Sections + Dynamic Filter Pills + Real-Time Sync
  const menuContainer = document.getElementById('qitchenMenuContainer');
  const drinksContainer = document.getElementById('qitchenDrinksContainer');
  const foodPillsWrap = document.querySelector('#view-menu .q-filter-pills');
  const drinksPillsWrap = document.getElementById('drinksFilterPills');
  let menuSections = window.MeryStore
    ? window.MeryStore.getLocalSections()
    : FALLBACK_SECTIONS;
  let currentMenuFilter = 'all';
  let currentDrinksFilter = 'all';

  const DRINKS_GROUP_PATTERN = /cocktail|trago|bebida|vino|wine|drink|barra|cerveza|champagne|espumante|aperitivo|gin|vodka|fernet|mojito/i;

  function getSectionGroup(sec) {
    if (window.MeryStore && typeof window.MeryStore.getCategoryGroup === 'function') {
      return window.MeryStore.getCategoryGroup(sec);
    }
    if (!sec) return 'food';
    if (sec.group === 'drinks' || sec.group === 'food') return sec.group;
    const haystack = [sec.title, sec.id, sec.slug].filter(Boolean).join(' ');
    return DRINKS_GROUP_PATTERN.test(haystack) ? 'drinks' : 'food';
  }

  function sectionsByGroup(group) {
    return menuSections.filter((sec) => getSectionGroup(sec) === group);
  }

  function scrollMenuPanelToTop(viewSelector) {
    const panel = document.querySelector(`${viewSelector} .q-panel-bordered`);
    if (panel) panel.scrollTop = 0;
  }

  function renderFilterPillsInto(wrap, sections, activeFilter, onSelect) {
    if (!wrap) return activeFilter;
    const validIds = sections.map((sec) => sec.id);
    const nextFilter = activeFilter !== 'all' && validIds.includes(activeFilter)
      ? activeFilter
      : 'all';

    wrap.innerHTML = [
      `<button type="button" class="q-pill-btn ${nextFilter === 'all' ? 'active' : ''}" data-filter="all">Todo</button>`,
      ...sections.map((sec) => `
        <button type="button" class="q-pill-btn ${nextFilter === sec.id ? 'active' : ''}" data-filter="${escapeHtml(sec.id)}">
          ${escapeHtml(sec.title)}
        </button>
      `)
    ].join('');

    wrap.querySelectorAll('.q-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => onSelect(btn.dataset.filter || 'all'));
    });

    return nextFilter;
  }

  function renderFilterPills() {
    currentMenuFilter = renderFilterPillsInto(
      foodPillsWrap,
      sectionsByGroup('food'),
      currentMenuFilter,
      (nextFilter) => {
        currentMenuFilter = nextFilter;
        renderFilterPills();
        renderQitchenMenu();
        scrollMenuPanelToTop('#view-menu');
      }
    );

    currentDrinksFilter = renderFilterPillsInto(
      drinksPillsWrap,
      sectionsByGroup('drinks'),
      currentDrinksFilter,
      (nextFilter) => {
        currentDrinksFilter = nextFilter;
        renderFilterPills();
        renderQitchenMenu();
        scrollMenuPanelToTop('#view-drinks');
      }
    );
  }

  function buildSectionHtml(sec) {
    const visibleItems = (sec.items || []).filter((it) => it.available !== false);
    if (visibleItems.length === 0) return '';
    return `
      <div class="q-menu-group" data-section-id="${escapeHtml(sec.id)}">
        <div class="q-diamond-heading">
          <span class="q-diamond-line"></span>
          <span class="q-diamond-symbol"></span>
          <h2>${escapeHtml(sec.title)}</h2>
          <span class="q-diamond-symbol"></span>
          <span class="q-diamond-line"></span>
        </div>
        ${visibleItems.map((item, idx) => {
          const dist = resolveDistinction(item.badge);
          const badgeHtml = dist
            ? `<span class="q-leaf-badge" title="${escapeHtml(dist.label)}">${escapeHtml(dist.symbol || '✦')}</span>`
            : '';
          return `
          <article
            class="q-dish-row"
            role="button"
            tabindex="0"
            data-sec-id="${escapeHtml(sec.id)}"
            data-item-idx="${idx}"
            aria-label="Ver detalle de ${escapeHtml(item.name)}"
          >
            <div class="q-dish-thumb-wrap">
              <img
                class="q-dish-thumb"
                src="${escapeHtml(item.image || 'assets/img/ice-cube-previa.webp')}"
                alt="${escapeHtml(item.name)}"
                style="object-position: ${escapeHtml(item.imagePosition || '50% 50%')}; transform-origin: ${escapeHtml(item.imagePosition || '50% 50%')}; transform: scale(${Number(item.imageZoom) || 1});"
                loading="lazy"
              />
            </div>
            <div class="q-dish-body">
              <div class="q-dish-header">
                <div class="q-dish-title-wrap">
                  <h3 class="q-dish-name">${escapeHtml(item.name)}</h3>
                  ${badgeHtml}
                </div>
                <span class="q-dotted-leader"></span>
                <span class="q-dish-price">${escapeHtml(item.price)}</span>
              </div>
              <p class="q-dish-desc">${escapeHtml(item.desc)}</p>
              <span class="q-dish-cta-hint">Ver detalle &amp; ritual →</span>
            </div>
          </article>
        `;
        }).join('')}
      </div>
    `;
  }

  function bindRowClickHandlers(container) {
    if (!container) return;
    container.querySelectorAll('.q-dish-row').forEach((row) => {
      const handleOpen = () => {
        const secId = row.getAttribute('data-sec-id');
        const idx = Number(row.getAttribute('data-item-idx'));
        const sec = menuSections.find((s) => s.id === secId);
        if (!sec) return;
        const visibleItems = (sec.items || []).filter((it) => it.available !== false);
        const item = visibleItems[idx];
        if (item) openDishModal(item, sec.title);
      };

      row.addEventListener('click', handleOpen);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      });
    });
  }

  function renderSectionsInto(container, sections, activeFilter) {
    if (!container) return;
    const scoped = activeFilter === 'all'
      ? sections
      : sections.filter((sec) => sec.id === activeFilter);

    container.innerHTML = scoped.map(buildSectionHtml).join('');
    bindRowClickHandlers(container);
  }

  function renderQitchenMenu() {
    renderSectionsInto(menuContainer, sectionsByGroup('food'), currentMenuFilter);
    renderSectionsInto(drinksContainer, sectionsByGroup('drinks'), currentDrinksFilter);
  }

  renderFilterPills();
  renderQitchenMenu();

  if (window.MeryStore && typeof window.MeryStore.fetchMenuSections === 'function') {
    window.MeryStore.fetchMenuSections().then((sections) => {
      if (Array.isArray(sections) && sections.length > 0) {
        menuSections = sections;
        renderFilterPills();
        renderQitchenMenu();
      }
    }).catch(() => {});
  }

  if (window.MeryStore && typeof window.MeryStore.subscribeToMenuChanges === 'function') {
    window.MeryStore.subscribeToMenuChanges((newSections) => {
      if (Array.isArray(newSections) && newSections.length > 0) {
        menuSections = newSections;
        renderFilterPills();
        renderQitchenMenu();
      }
    });
  }

  function applySiteVideos(videos) {
    if (!videos) return;
    if (videos.intro && neonIntroVideo) {
      if (neonIntroVideo.getAttribute('src') !== videos.intro) {
        neonIntroVideo.setAttribute('src', videos.intro);
        neonIntroVideo.load();
      }
    }
    if (videos.main) {
      VIEW_CONFIG.menu.video = videos.main;
      VIEW_CONFIG.reservation.video = videos.main;
    }

    const customWide = videos.hero_wide && videos.hero_wide !== DEFAULT_SHOWCASE_WIDE_INTRO
      ? videos.hero_wide
      : '';
    SHOWCASE_MEDIA.wide.introVideo = customWide || DEFAULT_SHOWCASE_WIDE_INTRO;
    SHOWCASE_MEDIA.wide.loopVideo = customWide || DEFAULT_SHOWCASE_WIDE_LOOP;

    const customPortrait = videos.hero_portrait && videos.hero_portrait !== DEFAULT_SHOWCASE_PORTRAIT_INTRO
      ? videos.hero_portrait
      : '';
    SHOWCASE_MEDIA.portrait.introVideo = customPortrait || DEFAULT_SHOWCASE_PORTRAIT_INTRO;
    SHOWCASE_MEDIA.portrait.loopVideo = customPortrait || DEFAULT_SHOWCASE_PORTRAIT_LOOP;

    const variant = syncShowcaseViewConfig();
    warmShowcaseLoop(variant);
    syncPreloadedLoopLayer(variant);

    if (showcaseVideo && currentView && VIEW_CONFIG[currentView]) {
      if (shouldUseLoopLayer(currentView)) {
        activateShowcaseLayer(true);
        return;
      }
      const activeCfg = VIEW_CONFIG[currentView];
      const currentLogical =
        showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
      activateShowcaseLayer(false);
      if (currentLogical !== activeCfg.video) {
        setShowcaseSource(
          activeCfg.video,
          activeCfg.poster,
          !isHeroIntroVideo(activeCfg.video)
        );
        syncHeroTextVisibility();
        if (!introCurtain || introCurtain.classList.contains('dismissed')) {
          showcaseVideo.play().catch(() => {});
        }
      }
    }
  }

  if (window.MeryStore && typeof window.MeryStore.getSiteVideos === 'function') {
    const maybePromise = window.MeryStore.getSiteVideos();
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.then(applySiteVideos).catch(() => {});
    } else if (maybePromise) {
      applySiteVideos(maybePromise);
    }
  }

  if (window.MeryStore && typeof window.MeryStore.subscribeToVideoChanges === 'function') {
    window.MeryStore.subscribeToVideoChanges(applySiteVideos);
  }

  function applySectionImages(images) {
    const map = images || (window.MeryStore && typeof window.MeryStore.getSectionImages === 'function'
      ? window.MeryStore.getSectionImages()
      : null);
    if (!map || typeof map !== 'object') return;
    document.querySelectorAll('[data-section-img]').forEach((imgEl) => {
      const slot = imgEl.getAttribute('data-section-img');
      if (slot && typeof map[slot] === 'string' && map[slot].trim()) {
        const nextSrc = map[slot].trim();
        if (imgEl.getAttribute('src') !== nextSrc) {
          imgEl.setAttribute('src', nextSrc);
        }
      }
    });
  }

  applySectionImages();

  if (window.MeryStore && typeof window.MeryStore.subscribeToSectionImageChanges === 'function') {
    window.MeryStore.subscribeToSectionImageChanges(applySectionImages);
  }

  // 4. Directional Slide View Transition + Left Video Swap (Always Silent)
  function updateDOMView(targetView) {
    muteShowcaseSound();
    const cfg = VIEW_CONFIG[targetView] || VIEW_CONFIG.home;

    if (appEl) appEl.setAttribute('data-view', targetView);
    if (leftHeroTitle) leftHeroTitle.innerHTML = cfg.title;

    // Show subtag "Tu noche empieza acá" ONLY on Home view
    if (heroSubtag) {
      heroSubtag.style.display = (targetView === 'home' ? '' : 'none');
    }

    if (showcaseVideo) {
      if (shouldUseLoopLayer(targetView)) {
        activateShowcaseLayer(true);
      } else {
        activateShowcaseLayer(false);
        const currentLogical =
          showcaseVideo.dataset.logicalSrc || showcaseVideo.getAttribute('src');
        const shouldLoop = !isHeroIntroVideo(cfg.video);
        if (currentLogical !== cfg.video) {
          setShowcaseSource(cfg.video, cfg.poster, shouldLoop);
        } else {
          showcaseVideo.loop = shouldLoop;
        }
        showcaseVideo.muted = true;
        showcaseVideo.volume = 0;
        if (!introCurtain || introCurtain.classList.contains('dismissed')) {
          showcaseVideo.play().catch(() => {});
        }
      }
    }

    document.querySelectorAll('.q-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${targetView}`);
    });

    document.querySelectorAll('.q-nav-link').forEach((navBtn) => {
      navBtn.classList.toggle('active', navBtn.getAttribute('data-goto') === targetView);
    });

    const floatingBackWrap = document.getElementById('qFloatingBackWrap');
    const floatingBackBtn = document.getElementById('btnFloatingBack');
    const showFloatingBack = targetView === 'drinks' || targetView === 'menu' || targetView === 'about';
    if (floatingBackWrap) {
      floatingBackWrap.setAttribute('aria-hidden', showFloatingBack ? 'false' : 'true');
    }
    if (floatingBackBtn) {
      floatingBackBtn.tabIndex = showFloatingBack ? 0 : -1;
    }

    currentView = targetView;
    syncHeroTextVisibility();

    scrollToActiveSection(targetView);
  }

  function scrollToActiveSection(targetView) {
    const targetSection = document.getElementById(`view-${targetView}`);
    if (targetSection) {
      const panel = targetSection.querySelector('.q-panel-bordered');
      if (panel) panel.scrollTop = 0;
      targetSection.scrollTop = 0;
    }
    const rightCol = document.getElementById('qitchenRightCol');
    if (rightCol) rightCol.scrollTop = 0;

    if (window.innerWidth <= 1024) {
      if (targetView === 'home') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } else {
        const targetEl = targetSection || rightCol;
        if (targetEl) {
          const navbar = document.querySelector('.qitchen-pill-navbar');
          const navBottom = navbar ? navbar.getBoundingClientRect().bottom : 70;
          const rect = targetEl.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = scrollTop + rect.top - (navBottom + 12);
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  function navigateView(targetView, options = {}) {
    if (!options.skipHistory && window.history && typeof window.history.pushState === 'function') {
      const targetPath = VIEW_TO_PATH[targetView] || '/';
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ view: targetView, openRoulette: false }, '', targetPath);
        } catch (_) {}
      }
    }

    if (targetView === currentView) {
      scrollToActiveSection(targetView);
      return;
    }

    if (!document.startViewTransition) {
      updateDOMView(targetView);
      scrollToActiveSection(targetView);
      requestAnimationFrame(() => scrollToActiveSection(targetView));
      setTimeout(() => scrollToActiveSection(targetView), 60);
      return;
    }

    const navOrder = ['home', 'drinks', 'menu', 'about', 'reservation'];
    const oldIdx = navOrder.indexOf(currentView);
    const newIdx = navOrder.indexOf(targetView);
    const direction = newIdx >= oldIdx ? 'forward' : 'backward';

    document.documentElement.setAttribute('data-nav-direction', direction);

    const transition = document.startViewTransition(() => {
      updateDOMView(targetView);
    });

    transition.finished.finally(() => {
      document.documentElement.removeAttribute('data-nav-direction');
      scrollToActiveSection(targetView);
      requestAnimationFrame(() => scrollToActiveSection(targetView));
      setTimeout(() => scrollToActiveSection(targetView), 60);
    });
  }

  // Bind All Navigation Elements with [data-goto]
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-goto');
      if (target === 'roulette') {
        openRouletteModal();
      } else if (target) {
        navigateView(target);
      }
    });
  });

  // 5. Dynamic Custom Select Dropdowns (Motivos & Días from Admin Settings)
  function setupCustomSelect(wrap) {
    const trigger = wrap.querySelector('.q-select-trigger');
    const valEl = wrap.querySelector('.q-select-value');
    const options = wrap.querySelectorAll('.q-select-option');
    const nativeSelect = wrap.querySelector('.q-select-native');

    if (trigger) {
      trigger.onclick = (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains('open');

        document.querySelectorAll('.q-custom-select.open').forEach((w) => {
          if (w !== wrap) {
            w.classList.remove('open');
            w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });

        wrap.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      };
    }

    options.forEach((opt) => {
      opt.onclick = (e) => {
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
      };
    });
  }

  function initAllCustomSelects() {
    document.querySelectorAll('.q-custom-select').forEach(setupCustomSelect);
  }

  // Close custom select dropdowns when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.q-custom-select')) {
      document.querySelectorAll('.q-custom-select.open').forEach((w) => {
        w.classList.remove('open');
        w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.q-custom-select.open').forEach((w) => {
        w.classList.remove('open');
        w.querySelector('.q-select-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Populate dynamic Motivos, Días and Horarios from Settings
  function populateReservationOptions() {
    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
    const motivos = settings.reservationMotivos && settings.reservationMotivos.length > 0
      ? settings.reservationMotivos
      : [
        'Mesa Cena + Quedarse a la Previa',
        'Festejo de Cumpleaños',
        'Living VIP / Cabina DJ Previa',
        'Tapeo & Tragos con Amigos'
      ];

    const dias = settings.reservationDias && settings.reservationDias.length > 0
      ? settings.reservationDias
      : [
        'Viernes (Cena & Previa)',
        'Sábado (Previa & DJ)',
        'Domingo (Wine & Tapeo)',
        'Mié / Jue (After & Cocktails)'
      ];

    // 1. Populate Motivos
    const motivoWrap = document.querySelector('[data-select-id="v2ResType"]');
    if (motivoWrap) {
      const valEl = motivoWrap.querySelector('.q-select-value');
      const menuEl = motivoWrap.querySelector('.q-select-menu');
      const nativeSelect = motivoWrap.querySelector('.q-select-native');

      if (valEl) valEl.textContent = motivos[0];
      if (menuEl) {
        menuEl.innerHTML = motivos.map((m, idx) => `
          <li class="q-select-option ${idx === 0 ? 'selected' : ''}" data-value="${escapeHtml(m)}" role="option" aria-selected="${idx === 0}">
            <span>${escapeHtml(m)}</span>
            <span class="q-option-diamond">◇</span>
          </li>
        `).join('');
      }
      if (nativeSelect) {
        nativeSelect.innerHTML = motivos.map((m, idx) => `
          <option value="${escapeHtml(m)}" ${idx === 0 ? 'selected' : ''}>${escapeHtml(m)}</option>
        `).join('');
      }
      setupCustomSelect(motivoWrap);
    }

    // 2. Populate Días
    const diaWrap = document.querySelector('[data-select-id="v2ResDay"]');
    if (diaWrap) {
      const valEl = diaWrap.querySelector('.q-select-value');
      const menuEl = diaWrap.querySelector('.q-select-menu');
      const nativeSelect = diaWrap.querySelector('.q-select-native');

      if (valEl) valEl.textContent = dias[0];
      if (menuEl) {
        menuEl.innerHTML = dias.map((d, idx) => `
          <li class="q-select-option ${idx === 0 ? 'selected' : ''}" data-value="${escapeHtml(d)}" role="option" aria-selected="${idx === 0}">
            <span>${escapeHtml(d)}</span>
            <span class="q-option-diamond">◇</span>
          </li>
        `).join('');
      }
      if (nativeSelect) {
        nativeSelect.innerHTML = dias.map((d, idx) => `
          <option value="${escapeHtml(d)}" ${idx === 0 ? 'selected' : ''}>${escapeHtml(d)}</option>
        `).join('');
      }
      setupCustomSelect(diaWrap);
    }

    // 3. Populate Horarios
    const horarios = settings.reservationHorarios && settings.reservationHorarios.length > 0
      ? settings.reservationHorarios
      : [
        '20:30 hs (Cena)',
        '22:00 hs (Cena Tardía)',
        '23:30 hs (Previa & Club)',
        '01:00 hs (DJ Set & Fiesta)'
      ];

    const timeWrap = document.querySelector('[data-select-id="v2ResTime"]');
    if (timeWrap) {
      const valEl = timeWrap.querySelector('.q-select-value');
      const menuEl = timeWrap.querySelector('.q-select-menu');
      const nativeSelect = timeWrap.querySelector('.q-select-native');

      if (valEl) valEl.textContent = horarios[0];
      if (menuEl) {
        menuEl.innerHTML = horarios.map((t, idx) => `
          <li class="q-select-option ${idx === 0 ? 'selected' : ''}" data-value="${escapeHtml(t)}" role="option" aria-selected="${idx === 0}">
            <span>${escapeHtml(t)}</span>
            <span class="q-option-diamond">◇</span>
          </li>
        `).join('');
      }
      if (nativeSelect) {
        nativeSelect.innerHTML = horarios.map((t, idx) => `
          <option value="${escapeHtml(t)}" ${idx === 0 ? 'selected' : ''}>${escapeHtml(t)}</option>
        `).join('');
      }
      setupCustomSelect(timeWrap);
    }
  }

  initAllCustomSelects();
  populateReservationOptions();

  // Listen to live settings changes
  if (window.MeryStore && typeof window.MeryStore.fetchSiteSettingsFromSupabase === 'function') {
    window.MeryStore.fetchSiteSettingsFromSupabase().then((all) => {
      populateReservationOptions();
      if (all && all.sectionImages) applySectionImages(all.sectionImages);
      if (all && all.siteVideos) applySiteVideos(all.siteVideos);
      renderQitchenMenu();
      updateRouletteBadges();
    }).catch(() => {});
  }

  if (window.MeryStore && typeof window.MeryStore.subscribeToSiteSettingsChanges === 'function') {
    window.MeryStore.subscribeToSiteSettingsChanges((evt) => {
      if (!evt) return;
      if (evt.type === 'SETTINGS_UPDATED' || evt.type === 'SITE_SETTINGS_REMOTE_UPDATED') {
        populateReservationOptions();
      }
      if (evt.type === 'ROULETTE_SETTINGS_UPDATED' || evt.type === 'SITE_SETTINGS_REMOTE_UPDATED') {
        updateRouletteBadges();
      }
      if (evt.type === 'SECTION_IMAGES_UPDATED' && evt.images) {
        applySectionImages(evt.images);
      } else if (evt.sectionImages) {
        applySectionImages(evt.sectionImages);
      }
      if (evt.type === 'VIDEOS_UPDATED' && evt.videos) {
        applySiteVideos(evt.videos);
      } else if (evt.siteVideos) {
        applySiteVideos(evt.siteVideos);
      }
      if (evt.type === 'DISTINCTIONS_UPDATED' || evt.type === 'SITE_SETTINGS_REMOTE_UPDATED') {
        renderQitchenMenu();
        if (activeModalDish && dishModal && dishModal.classList.contains('open')) {
          openDishModal(activeModalDish.item, activeModalDish.categoryTitle);
        }
      }
    });
  }

  // 6. Direct WhatsApp Reservation System with Live QR-Linked Phone
  async function resolveTargetWhatsappPhone() {
    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
    
    // Check if Evolution API has a live open instance
    const serverUrl = (settings.evolutionServerUrl || 'https://mery-la-previa-evolution-api.rsssbm.easypanel.host').replace(/\/+$/, '');
    const apiKey = settings.evolutionApiKey || '429683C4C977415CAAFCCE10F7D57E11';
    const instanceName = settings.evolutionInstanceName || 'mery-la-previa';

    try {
      const resp = await fetch(`${serverUrl}/instance/fetchInstances?instanceName=${instanceName}`, {
        headers: { apikey: apiKey }
      });
      if (resp.ok) {
        const list = await resp.json();
        const inst = Array.isArray(list) ? list[0] : null;
        if (inst && (inst.connectionStatus === 'open' || inst.status === 'open')) {
          const rawNum = (inst.ownerJid || inst.number || '').split('@')[0].replace(/\D/g, '');
          if (rawNum) return rawNum;
        }
      }
    } catch (_) {}

    if (settings.connectedWhatsappPhone) {
      return settings.connectedWhatsappPhone.replace(/\D/g, '');
    }

    return '5491173727613';
  }

  const v2ResForm = document.getElementById('v2WhatsappResForm');
  if (v2ResForm) {
    v2ResForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('v2ResName');
      const typeSelect = document.getElementById('v2ResType');
      const guestsInput = document.getElementById('v2ResGuests');
      const daySelect = document.getElementById('v2ResDay');
      const timeSelect = document.getElementById('v2ResTime');
      const errNotice = document.getElementById('v2FormErrorNotice');

      const name = nameInput ? nameInput.value.trim() : '';
      const motivo = typeSelect ? typeSelect.value.trim() : 'Mesa Cena + Quedarse a la Previa';
      const guests = guestsInput ? guestsInput.value.trim() : '';
      const day = daySelect ? daySelect.value.trim() : 'Viernes (Cena & Previa)';
      const time = timeSelect ? timeSelect.value.trim() : '20:30 hs (Cena)';

      if (!name) {
        if (errNotice) {
          errNotice.textContent = 'Por favor ingresá tu nombre y apellido.';
          errNotice.hidden = false;
        }
        nameInput?.focus();
        return;
      }

      if (!guests || Number(guests) < 1) {
        if (errNotice) {
          errNotice.textContent = 'Por favor indicá para cuántas personas es la reserva.';
          errNotice.hidden = false;
        }
        guestsInput?.focus();
        return;
      }

      if (errNotice) {
        errNotice.hidden = true;
      }

      const waMsg =
        `¡Hola Mery La Previa! Quiero reservar una mesa:\n\n` +
        `• *Nombre y Apellido:* ${name}\n` +
        `• *Motivo:* ${motivo}\n` +
        `• *Cantidad de personas:* ${guests}\n` +
        `• *Día:* ${day}\n` +
        `• *Horario:* ${time}\n\n` +
        `¿Tienen disponibilidad? ¡Muchas gracias!`;

      // Resolve live QR-linked number from panel
      const targetPhone = await resolveTargetWhatsappPhone();
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMsg)}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 7. Interactive In-Venue Roulette Engine (Mery Invita la Previa) with Single-Use Access Code
  const STORAGE_KEY_ROULETTE_DEVICE = 'mery_roulette_device_v1';

  let currentWheelAngle = 0;
  let isRouletteSpinning = false;
  let isRouletteUnlocked = false;

  function getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getRouletteDeviceState() {
    const today = getTodayString();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ROULETTE_DEVICE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.date !== today) {
            const resetState = {
              date: today,
              spinsUsed: 0
            };
            saveRouletteDeviceState(resetState);
            return resetState;
          }
          return {
            date: today,
            spinsUsed: Number(parsed.spinsUsed) || 0
          };
        }
      }
    } catch (_) {}
    const newState = { date: today, spinsUsed: 0 };
    saveRouletteDeviceState(newState);
    return newState;
  }

  function saveRouletteDeviceState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_ROULETTE_DEVICE, JSON.stringify(state));
    } catch (_) {}
  }

  function isNoPrizeSlot(prize) {
    if (window.MeryStore && typeof window.MeryStore.isNoPrizeSlot === 'function') {
      return window.MeryStore.isNoPrizeSlot(prize);
    }
    if (!prize || typeof prize !== 'object') return false;
    return (
      prize.id === 'segui-participando' ||
      prize.isNoPrize === true ||
      /segu[ií]\s+participando/i.test(String(prize.name || ''))
    );
  }

  function getSafeRoulettePrizes(settings) {
    const raw = (settings && Array.isArray(settings.prizes)) ? settings.prizes : [];
    if (raw.length > 0) return raw;
    return [
      {
        id: 'segui-participando',
        name: 'Seguí Participando',
        stock: 999,
        totalStock: 999,
        color: '#261418',
        probability: 100,
        condition: '¡Volvé a girar si todavía tenés tiros!',
        isNoPrize: true
      }
    ];
  }

  function getLiveRouletteSettings() {
    if (window.MeryStore && typeof window.MeryStore.getRouletteSettings === 'function') {
      return window.MeryStore.getRouletteSettings();
    }
    return window.DEFAULT_ROULETTE_SETTINGS || {
      enabled: true,
      title: 'Mery Invita la Previa',
      subtitle: 'Girá la ruleta y ganá shots de tequila, 2x1 y beneficios para tu previa',
      maxSpinsPerDevice: 3,
      prizes: [
        { id: 'shot-tequila', name: 'Shot Tequila 11:11', stock: 10, color: '#e02434', probability: 25, condition: 'Válido hoy a las 11:11 PM en barra' },
        { id: 'gin-2x1', name: '2x1 en Gin Tonic', stock: 10, color: '#160e12', probability: 20, condition: 'Válido antes de las 22:00 hs' },
        { id: 'off-mesa', name: '10% OFF en tu Mesa', stock: 5, color: '#880b15', probability: 15, condition: 'Mostralo al pedir la cuenta' },
        { id: 'tapeo-gratis', name: 'Tapeo de Cortesía', stock: 8, color: '#1c1014', probability: 15, condition: 'Con la compra de cualquier botella' },
        { id: 'trago-autor', name: 'Trago de Autor Regalo', stock: 5, color: '#b81424', probability: 10, condition: '1 trago de autor a elección del bartender' },
        { id: 'segui-participando', name: 'Seguí Participando', stock: 999, color: '#261418', probability: 15, condition: '¡Volvé a girar si todavía tenés tiros!', isNoPrize: true }
      ]
    };
  }

  function updateRouletteBadges() {
    const settings = getLiveRouletteSettings();
    const devState = getRouletteDeviceState();
    const maxSpins = settings.maxSpinsPerDevice || 3;
    const spinsLeft = Math.max(0, maxSpins - devState.spinsUsed);

    const stockEl = document.getElementById('rouletteStockCount');
    if (stockEl) {
      const activePrizes = getSafeRoulettePrizes(settings).filter((p) => !isNoPrizeSlot(p));
      const totalStock = activePrizes.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
      stockEl.textContent = `${totalStock} disponibles`;
    }

    const spinsBadge = document.getElementById('rouletteSpinsLeftText');
    if (spinsBadge) {
      spinsBadge.textContent = `Tiros: ${spinsLeft} de ${maxSpins}`;
    }

    const modalTitleEl = document.getElementById('rouletteModalTitle');
    if (modalTitleEl && settings.title) {
      modalTitleEl.textContent = settings.title;
    }

    const modalSubtitleEl = document.getElementById('rouletteModalSubtitle');
    if (modalSubtitleEl && settings.subtitle) {
      modalSubtitleEl.textContent = settings.subtitle;
    }
  }

  function wrapRouletteLabel(ctx, text, maxWidth, maxLines) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];

    const fitWithEllipsis = (str) => {
      if (ctx.measureText(str).width <= maxWidth) return str;
      let out = str;
      while (out.length > 1 && ctx.measureText(out + '…').width > maxWidth) {
        out = out.slice(0, -1).trimEnd();
      }
      return out + '…';
    };

    const words = clean.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) {
          if (lines.length + 1 >= maxLines) {
            const remainder = [currentLine, ...words.slice(i)].join(' ');
            lines.push(fitWithEllipsis(remainder));
            return lines;
          }
          lines.push(currentLine);
          currentLine = ctx.measureText(word).width <= maxWidth ? word : fitWithEllipsis(word);
        } else {
          if (lines.length + 1 >= maxLines) {
            lines.push(fitWithEllipsis(words.slice(i).join(' ')));
            return lines;
          }
          lines.push(fitWithEllipsis(word));
          currentLine = '';
        }
      }
    }

    if (currentLine) {
      lines.push(fitWithEllipsis(currentLine));
    }

    return lines.slice(0, maxLines);
  }

  function drawRouletteWheel(canvas, prizes, rotationAngle) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = canvas.clientWidth > 0 ? canvas.clientWidth : 370;
    const targetBackingSize = Math.round(cssSize * dpr);
    if (canvas.width !== targetBackingSize || canvas.height !== targetBackingSize) {
      canvas.width = targetBackingSize;
      canvas.height = targetBackingSize;
    }

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = cssSize;
    const height = cssSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;

    ctx.clearRect(0, 0, width, height);
    if (!Array.isArray(prizes) || prizes.length === 0) {
      ctx.restore();
      return;
    }

    const numSlices = prizes.length;
    const arcSize = (2 * Math.PI) / numSlices;
    const hubRadius = Math.max(20, Math.round(radius * 0.13));
    const fontSize = numSlices <= 4 ? 15 : numSlices <= 6 ? 13 : numSlices <= 8 ? 11.5 : 10;
    const lineHeight = Math.round(fontSize * 1.24);
    const maxLines = numSlices <= 5 ? 3 : 2;
    const textRadialPos = hubRadius + (radius - hubRadius) * 0.52;
    const maxTextWidth = Math.max(
      48,
      Math.min(radius * 0.62, (radius - textRadialPos - 10) * 2, (textRadialPos - hubRadius - 8) * 2)
    );

    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < numSlices; i++) {
      const prize = prizes[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;
      const midAngle = startAngle + arcSize / 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = prize.color || (i % 2 === 0 ? '#e02434' : '#160e12');
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.stroke();

      // Clipped, centered, right-side-up multi-line slice label
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 5, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      ctx.rotate(midAngle);
      ctx.translate(textRadialPos, 0);

      const worldMid = ((rotationAngle + midAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      if (worldMid > Math.PI / 2 && worldMid < (3 * Math.PI) / 2) {
        ctx.rotate(Math.PI);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 ${fontSize}px Satoshi, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.72)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;

      const lines = wrapRouletteLabel(ctx, prize.name || '', maxTextWidth, maxLines);
      const startY = -((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, lineIdx) => {
        ctx.fillText(line, 0, startY + lineIdx * lineHeight);
      });
      ctx.restore();
    }

    // Outer wheel border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#221519';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e02434';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }

  let rouletteAudioCtx = null;

  function ensureRouletteAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!rouletteAudioCtx) {
      try {
        rouletteAudioCtx = new AudioCtx();
      } catch (_) {
        return null;
      }
    }
    if (rouletteAudioCtx.state === 'suspended') {
      rouletteAudioCtx.resume().catch(() => {});
    }
    return rouletteAudioCtx;
  }

  function playRouletteTick() {
    const pointerEl = document.getElementById('roulettePointer');
    if (pointerEl) {
      pointerEl.classList.remove('kicking');
      void pointerEl.offsetWidth;
      pointerEl.classList.add('kicking');
    }

    const ctx = ensureRouletteAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.032);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  function playRouletteWinSound() {
    const ctx = ensureRouletteAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.36);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    } catch (_) {}
  }

  function playRouletteNoPrizeSound() {
    const ctx = ensureRouletteAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [392.0, 311.13];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.14;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.11, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch (_) {}
  }

  function openRouletteModal(options = {}) {
    const modal = document.getElementById('qitchenRouletteModal');
    if (!modal) return;

    if (!options.skipHistory && window.history && typeof window.history.pushState === 'function') {
      const cleanPath = (window.location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
      if (cleanPath !== 'ruleta' && cleanPath !== 'promos' && cleanPath !== 'roulette') {
        try {
          window.history.pushState({ view: currentView, openRoulette: true }, '', '/ruleta');
        } catch (_) {}
      }
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const settings = getLiveRouletteSettings();
    const devState = getRouletteDeviceState();
    const maxSpins = settings.maxSpinsPerDevice || 3;

    updateRouletteBadges();

    const gateEl = document.getElementById('rouletteCodeGate');
    const stageEl = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const cooldownCard = document.getElementById('rouletteCooldownCard');
    const cooldownMsg = document.getElementById('rouletteCooldownMsg');
    const codeInput = document.getElementById('rouletteAccessCodeInput');
    const codeError = document.getElementById('rouletteCodeError');

    if (devState.spinsUsed >= maxSpins) {
      if (gateEl) gateEl.hidden = true;
      if (stageEl) stageEl.hidden = true;
      if (resultCard) resultCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = false;
      if (cooldownMsg) {
        cooldownMsg.textContent =
          `Ya completaste los ${maxSpins} tiros disponibles de hoy para tu dispositivo. ` +
          '¡Volvé mañana a partir de las 19:00 hs para seguir jugando por más beneficios!';
      }
    } else if (!isRouletteUnlocked) {
      if (gateEl) gateEl.hidden = false;
      if (stageEl) stageEl.hidden = true;
      if (resultCard) resultCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = true;
      if (codeError) {
        codeError.hidden = true;
        codeError.textContent = '';
      }
      if (codeInput) {
        codeInput.value = '';
        setTimeout(() => codeInput.focus(), 60);
      }
    } else {
      if (gateEl) gateEl.hidden = true;
      if (stageEl) stageEl.hidden = false;
      if (resultCard) resultCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = true;

      const canvas = document.getElementById('rouletteCanvas');
      if (canvas) {
        drawRouletteWheel(canvas, getSafeRoulettePrizes(settings), currentWheelAngle);
      }
    }
  }

  function closeRouletteModal(options = {}) {
    const modal = document.getElementById('qitchenRouletteModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (!options.skipHistory && window.history && typeof window.history.replaceState === 'function') {
      const cleanPath = (window.location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
      if (cleanPath === 'ruleta' || cleanPath === 'promos' || cleanPath === 'roulette') {
        try {
          window.history.replaceState({ view: currentView, openRoulette: false }, '', VIEW_TO_PATH[currentView] || '/');
        } catch (_) {}
      }
    }
  }

  const btnOpenRoulette = document.getElementById('btnOpenRoulette');
  if (btnOpenRoulette) {
    btnOpenRoulette.addEventListener('click', openRouletteModal);
  }

  const btnCloseRouletteModal = document.getElementById('btnCloseRouletteModal');
  if (btnCloseRouletteModal) {
    btnCloseRouletteModal.addEventListener('click', closeRouletteModal);
  }

  const rouletteModal = document.getElementById('qitchenRouletteModal');
  if (rouletteModal) {
    rouletteModal.addEventListener('click', (e) => {
      if (e.target === rouletteModal) closeRouletteModal();
    });
  }

  // Stage 0: Access Code Gate Form
  const rouletteCodeForm = document.getElementById('rouletteCodeForm');
  if (rouletteCodeForm) {
    const codeInput = document.getElementById('rouletteAccessCodeInput');
    if (codeInput) {
      codeInput.addEventListener('input', () => {
        codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      });
    }

    rouletteCodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnUnlock = document.getElementById('btnUnlockRoulette');
      const codeError = document.getElementById('rouletteCodeError');
      const rawCode = codeInput ? codeInput.value.trim().toUpperCase() : '';

      if (!rawCode) {
        if (codeError) {
          codeError.textContent = 'Ingresá el código que te dio la camarera.';
          codeError.hidden = false;
        }
        codeInput?.focus();
        return;
      }

      if (codeError) {
        codeError.hidden = true;
        codeError.textContent = '';
      }

      if (btnUnlock) {
        btnUnlock.disabled = true;
        btnUnlock.textContent = 'Validando...';
      }

      let res = { valid: false, error: 'No se pudo validar el código' };
      if (window.MeryStore && typeof window.MeryStore.redeemRouletteAccessCode === 'function') {
        res = await window.MeryStore.redeemRouletteAccessCode(rawCode);
      }

      if (btnUnlock) {
        btnUnlock.disabled = false;
        btnUnlock.textContent = 'Desbloquear Ruleta →';
      }

      if (!res || !res.valid) {
        if (codeError) {
          codeError.textContent = (res && res.error) || 'Código inválido o ya utilizado';
          codeError.hidden = false;
        }
        codeInput?.focus();
        codeInput?.select();
        return;
      }

      isRouletteUnlocked = true;
      const gateEl = document.getElementById('rouletteCodeGate');
      const stageEl = document.getElementById('rouletteWheelStage');
      if (gateEl) gateEl.hidden = true;
      if (stageEl) stageEl.hidden = false;

      const settings = getLiveRouletteSettings();
      const canvas = document.getElementById('rouletteCanvas');
      if (canvas) {
        drawRouletteWheel(canvas, getSafeRoulettePrizes(settings), currentWheelAngle);
      }
    });
  }

  // Spin Roulette Logic
  const btnSpin = document.getElementById('btnSpinRoulette');
  if (btnSpin) {
    btnSpin.addEventListener('click', () => {
      if (isRouletteSpinning) return;
      if (!isRouletteUnlocked) {
        openRouletteModal();
        return;
      }

      const settings = getLiveRouletteSettings();
      const devState = getRouletteDeviceState();
      const maxSpins = settings.maxSpinsPerDevice || 3;

      if (devState.spinsUsed >= maxSpins) {
        openRouletteModal();
        return;
      }

      const prizes = getSafeRoulettePrizes(settings);
      if (prizes.length === 0) return;

      isRouletteSpinning = true;
      btnSpin.disabled = true;
      ensureRouletteAudioContext();

      const numSlices = prizes.length;
      const arcSize = (2 * Math.PI) / numSlices;

      // Select winning slice based on normalized weights & stock
      const indexedPrizes = prizes.map((p, idx) => ({ ...p, originalIndex: idx }));
      let availablePrizes = indexedPrizes.filter((p) => isNoPrizeSlot(p) || (Number(p.stock) || 0) > 0);
      if (availablePrizes.length === 0) {
        availablePrizes = indexedPrizes;
      }

      const getWeight = (p) => {
        const val = Number(p.probability);
        return Number.isFinite(val) && val > 0 ? val : 0;
      };
      const totalWeight = availablePrizes.reduce((sum, p) => sum + getWeight(p), 0);
      let wonPrize = availablePrizes[0];
      if (totalWeight <= 0) {
        wonPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
      } else {
        let rand = Math.random() * totalWeight;
        for (const p of availablePrizes) {
          rand -= getWeight(p);
          if (rand <= 0) {
            wonPrize = p;
            break;
          }
        }
      }

      // Calculate target rotation angle so pointer (at 12 o'clock, 3π/2) lands on winning slice
      const winningIndex = wonPrize.originalIndex;
      const sliceCenter = winningIndex * arcSize + arcSize / 2;
      const pointerAngle = (3 * Math.PI) / 2;
      const targetBaseAngle = pointerAngle - sliceCenter;

      const extraSpins = 5 + Math.floor(Math.random() * 3);
      const totalRotation = extraSpins * 2 * Math.PI + (targetBaseAngle % (2 * Math.PI));

      const startTime = performance.now();
      const duration = 4800; // ms
      const startAngle = currentWheelAngle;
      const deltaAngle = totalRotation - (startAngle % (2 * Math.PI)) + 4 * Math.PI;

      const canvas = document.getElementById('rouletteCanvas');
      let lastSliceIndex = Math.floor((((3 * Math.PI) / 2 - startAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) / arcSize) % numSlices;

      function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        currentWheelAngle = startAngle + deltaAngle * ease;
        if (canvas) {
          drawRouletteWheel(canvas, prizes, currentWheelAngle);
        }

        const relAngle = (((3 * Math.PI) / 2 - currentWheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const currentSliceIndex = Math.floor(relAngle / arcSize) % numSlices;
        if (currentSliceIndex !== lastSliceIndex) {
          lastSliceIndex = currentSliceIndex;
          playRouletteTick();
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isRouletteSpinning = false;
          isRouletteUnlocked = false;
          btnSpin.disabled = false;

          // Consume spin and decrement prize stock
          devState.spinsUsed += 1;
          saveRouletteDeviceState(devState);
          if (!isNoPrizeSlot(wonPrize) && window.MeryStore && typeof window.MeryStore.decrementRoulettePrizeStock === 'function') {
            window.MeryStore.decrementRoulettePrizeStock(wonPrize.id);
          }
          updateRouletteBadges();

          // Show Result
          handleSpinComplete(wonPrize);
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function handleSpinComplete(prize) {
    const gateEl = document.getElementById('rouletteCodeGate');
    const stageEl = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const kickerEl = resultCard ? resultCard.querySelector('.congrats-kicker') : null;
    const prizeNameEl = document.getElementById('rouletteResultPrizeName');
    const prizeCondEl = document.getElementById('rouletteResultCondition');
    const venueNoteEl = document.getElementById('rouletteResultVenueNote');

    if (gateEl) gateEl.hidden = true;
    if (stageEl) stageEl.hidden = true;
    if (resultCard) resultCard.hidden = false;

    const isNoPrize = isNoPrizeSlot(prize);

    if (isNoPrize) {
      playRouletteNoPrizeSound();
      if (kickerEl) kickerEl.textContent = '★ ¡CASI! SEGUÍ PARTICIPANDO ★';
      if (prizeNameEl) prizeNameEl.textContent = prize.name || 'Seguí Participando';
      if (prizeCondEl) {
        const settings = getLiveRouletteSettings();
        const devState = getRouletteDeviceState();
        const left = Math.max(0, (settings.maxSpinsPerDevice || 3) - devState.spinsUsed);
        prizeCondEl.textContent = left > 0
          ? `No salió premio en este tiro. Te quedan ${left} tiro${left === 1 ? '' : 's'} hoy — ¡pedile otro código a la camarera con tu próxima vuelta!`
          : 'Completaste los tiros disponibles de hoy. ¡Volvé mañana!';
      }
      if (venueNoteEl) venueNoteEl.hidden = true;
    } else {
      playRouletteWinSound();
      if (kickerEl) kickerEl.textContent = '★ ¡FELICITACIONES! GANASTE ★';
      if (prizeNameEl) prizeNameEl.textContent = prize.name;
      if (prizeCondEl) prizeCondEl.textContent = prize.condition || 'Válido para canjear en el momento';
      if (venueNoteEl) {
        venueNoteEl.textContent = 'Mostrale esta pantalla a la camarera para canjear tu premio en el momento.';
        venueNoteEl.hidden = false;
      }
    }
  }

  const btnCloseRouletteResult = document.getElementById('btnCloseRouletteResult');
  if (btnCloseRouletteResult) {
    btnCloseRouletteResult.addEventListener('click', closeRouletteModal);
  }

  const btnCloseCooldownBtn = document.getElementById('btnCloseCooldownBtn');
  if (btnCloseCooldownBtn) {
    btnCloseCooldownBtn.addEventListener('click', () => {
      closeRouletteModal({ skipHistory: true });
      navigateView('menu');
    });
  }

  // Deep-link route initialization & browser back/forward support
  if (initialRoute.hasSlug) {
    updateDOMView(initialRoute.view);
    scrollToActiveSection(initialRoute.view);
    if (initialRoute.openRoulette) {
      openRouletteModal({ skipHistory: true });
    }
  }

  window.addEventListener('popstate', () => {
    const route = resolveRouteFromLocation();
    if (!route.openRoulette) {
      closeRouletteModal({ skipHistory: true });
    }
    if (route.view !== currentView) {
      navigateView(route.view, { skipHistory: true });
    }
    if (route.openRoulette) {
      openRouletteModal({ skipHistory: true });
    }
  });
});
