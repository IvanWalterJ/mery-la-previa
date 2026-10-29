// Exact Qitchen-Structured Menu & Real-Time Interactive Controller for Mery La Previa
const FALLBACK_SECTIONS = window.MeryStore
  ? window.MeryStore.DEFAULT_MENU_SECTIONS
  : [];

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

  const enterSafetyTimer = setTimeout(revealEnterButton, 3400);

  function activateAudio() {
    if (!neonIntroVideo) return;
    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    const p = neonIntroVideo.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
    audioUnlocked = true;
    if (btnIntroUnmute) btnIntroUnmute.classList.remove('visible');
  }

  if (neonIntroVideo) {
    neonIntroVideo.addEventListener('timeupdate', () => {
      if (neonIntroVideo.currentTime >= 3.0) {
        revealEnterButton();
      }
    });

    neonIntroVideo.addEventListener('ended', revealEnterButton);

    neonIntroVideo.addEventListener('pause', () => {
      if (!introCurtain.classList.contains('dismissed')) {
        setTimeout(revealEnterButton, 500);
      }
    });

    neonIntroVideo.addEventListener('error', revealEnterButton);

    neonIntroVideo.muted = false;
    neonIntroVideo.volume = 1;
    neonIntroVideo.play().then(() => {
      if (btnIntroUnmute) btnIntroUnmute.classList.remove('visible');
    }).catch(() => {
      neonIntroVideo.muted = true;
      neonIntroVideo.play().catch(() => {});
      if (btnIntroUnmute && !buttonRevealed) {
        btnIntroUnmute.classList.add('visible');
      }
    });
  }

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
      if (target) navigateView(target);
    });
  });

  // 3. Dish Detail Modal (#qitchenDishModal)
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
  let selectedDishForReservation = null;

  function openDishModal(item, categoryTitle) {
    if (!dishModal || !item) return;
    activeModalDish = { item, categoryTitle };

    const modalCard = dishModal.querySelector('.q-dish-modal-card');
    if (modalCard) modalCard.scrollTop = 0;
    dishModal.scrollTop = 0;

    if (dishModalImage) {
      dishModalImage.src = item.image || 'assets/img/ice-cube-previa.jpg';
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
      const badgeSymbol = item.badge || '★';
      dishModalBadge.textContent = badgeSymbol === '★'
        ? '★ RECOMENDADO DE LA CASA'
        : `${badgeSymbol} ESPECIALIDAD 11:11`;
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
      if (activeModalDish && activeModalDish.item) {
        selectedDishForReservation = activeModalDish.item.name;
      }
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

  // 4. Render Qitchen /menu Sections + Dynamic Filter Pills + Real-Time Sync
  const menuContainer = document.getElementById('qitchenMenuContainer');
  const filterPillsWrap = document.querySelector('#view-menu .q-filter-pills');
  let menuSections = window.MeryStore
    ? window.MeryStore.getLocalSections()
    : FALLBACK_SECTIONS;
  let currentFilter = 'all';

  function renderFilterPills() {
    if (!filterPillsWrap) return;
    const validIds = menuSections.map((s) => s.id);
    if (currentFilter !== 'all' && !validIds.includes(currentFilter)) {
      currentFilter = 'all';
    }

    const pillsHtml = [
      `<button type="button" class="q-pill-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Todo</button>`,
      ...menuSections.map((sec) => `
        <button type="button" class="q-pill-btn ${currentFilter === sec.id ? 'active' : ''}" data-filter="${escapeHtml(sec.id)}">
          ${escapeHtml(sec.title)}
        </button>
      `)
    ].join('');

    filterPillsWrap.innerHTML = pillsHtml;
    filterPillsWrap.querySelectorAll('.q-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter || 'all';
        renderFilterPills();
        renderQitchenMenu();
        const menuPanel = document.querySelector('#view-menu .q-panel-bordered');
        if (menuPanel) menuPanel.scrollTop = 0;
      });
    });
  }

  function renderQitchenMenu() {
    if (!menuContainer) return;
    const sections = currentFilter === 'all'
      ? menuSections
      : menuSections.filter((sec) => sec.id === currentFilter);

    menuContainer.innerHTML = sections.map((sec) => {
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
          ${visibleItems.map((item, idx) => `
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
                  src="${escapeHtml(item.image)}"
                  alt="${escapeHtml(item.name)}"
                  style="object-position: ${escapeHtml(item.imagePosition || '50% 50%')}; transform-origin: ${escapeHtml(item.imagePosition || '50% 50%')}; transform: scale(${Number(item.imageZoom) || 1});"
                  loading="lazy"
                />
              </div>
              <div class="q-dish-body">
                <div class="q-dish-header">
                  <div class="q-dish-title-wrap">
                    <h3 class="q-dish-name">${escapeHtml(item.name)}</h3>
                    <span class="q-leaf-badge">${escapeHtml(item.badge || '★')}</span>
                  </div>
                  <span class="q-dotted-leader"></span>
                  <span class="q-dish-price">${escapeHtml(item.price)}</span>
                </div>
                <p class="q-dish-desc">${escapeHtml(item.desc)}</p>
                <span class="q-dish-cta-hint">Ver detalle &amp; ritual →</span>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }).join('');

    menuContainer.querySelectorAll('.q-dish-row').forEach((row) => {
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

    // If the modal is currently open for a dish, refresh its content in real time too
    if (activeModalDish && activeModalDish.item && dishModal?.classList.contains('open')) {
      for (const sec of menuSections) {
        const found = (sec.items || []).find(
          (i) => (i.id && i.id === activeModalDish.item.id) || i.name === activeModalDish.item.name
        );
        if (found) {
          openDishModal(found, sec.title);
          break;
        }
      }
    }
  }

  renderFilterPills();
  renderQitchenMenu();

  // Initial fetch & Real-time subscription via MeryStore (Supabase + BroadcastChannel + Storage)
  if (window.MeryStore) {
    window.MeryStore.fetchMenuSections().then((freshSections) => {
      if (Array.isArray(freshSections) && freshSections.length > 0) {
        menuSections = freshSections;
        renderFilterPills();
        renderQitchenMenu();
      }
    });

    window.MeryStore.subscribeToMenuChanges((updatedSections) => {
      if (Array.isArray(updatedSections) && updatedSections.length > 0) {
        menuSections = updatedSections;
        renderFilterPills();
        renderQitchenMenu();
      }
    });

    function applySiteVideos(videos) {
      if (!videos) return;
      if (videos.intro && neonIntroVideo) {
        if (neonIntroVideo.getAttribute('src') !== videos.intro) {
          neonIntroVideo.setAttribute('src', videos.intro);
          neonIntroVideo.load();
        }
      }
      if (videos.main) {
        VIEW_CONFIG.home.video = videos.main;
        VIEW_CONFIG.menu.video = videos.main;
        VIEW_CONFIG.reservation.video = videos.main;
      }
      if (videos.previa) {
        VIEW_CONFIG.about.video = videos.previa;
      }
      if (showcaseVideo && currentView && VIEW_CONFIG[currentView]) {
        const activeCfg = VIEW_CONFIG[currentView];
        if (showcaseVideo.getAttribute('src') !== activeCfg.video) {
          showcaseVideo.setAttribute('src', activeCfg.video);
          showcaseVideo.load();
          showcaseVideo.play().catch(() => {});
        }
      }
    }

    if (typeof window.MeryStore.getSiteVideos === 'function') {
      const maybePromise = window.MeryStore.getSiteVideos();
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(applySiteVideos).catch(() => {});
      } else if (maybePromise) {
        applySiteVideos(maybePromise);
      }
    }

    if (typeof window.MeryStore.subscribeToVideoChanges === 'function') {
      window.MeryStore.subscribeToVideoChanges(applySiteVideos);
    }
  }

  // 5. Directional Slide View Transition + Left Video Swap
  let currentView = 'home';

  function updateDOMView(targetView) {
    const cfg = VIEW_CONFIG[targetView] || VIEW_CONFIG.home;

    if (appEl) appEl.setAttribute('data-view', targetView);
    if (leftHeroTitle) leftHeroTitle.innerHTML = cfg.title;

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

    const targetSection = document.getElementById(`view-${targetView}`);
    if (targetSection) {
      const panel = targetSection.querySelector('.q-panel-bordered');
      if (panel) panel.scrollTop = 0;
      targetSection.scrollTop = 0;
    }
    const rightCol = document.getElementById('qitchenRightCol');
    if (rightCol) rightCol.scrollTop = 0;

    if (window.innerWidth <= 1024) {
      if (targetView !== 'home' && rightCol) {
        rightCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  function navigateView(targetView) {
    if (targetView === currentView) {
      if (window.innerWidth <= 1024 && targetView !== 'home') {
        const rightCol = document.getElementById('qitchenRightCol');
        if (rightCol) {
          rightCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    const scrollToActiveSection = () => {
      if (window.innerWidth <= 1024 && targetView !== 'home') {
        const rightCol = document.getElementById('qitchenRightCol');
        if (rightCol) {
          rightCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    if (!document.startViewTransition) {
      updateDOMView(targetView);
      scrollToActiveSection();
      return;
    }

    const vt = document.startViewTransition(() => updateDOMView(targetView));
    if (vt && vt.finished) {
      vt.finished.then(scrollToActiveSection).catch(scrollToActiveSection);
    } else {
      setTimeout(scrollToActiveSection, 50);
    }
  }

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-goto');
      if (target) navigateView(target);
    });
  });

  // 6. Custom High-End Branded Select Dropdowns
  document.querySelectorAll('.q-custom-select').forEach((wrap) => {
    const trigger = wrap.querySelector('.q-select-trigger');
    const valEl = wrap.querySelector('.q-select-value');
    const options = wrap.querySelectorAll('.q-select-option');
    const nativeSelect = wrap.querySelector('.q-select-native');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
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

  // 7. Qitchen Reservation & Birthday WhatsApp Form Submission
  const resForm = document.getElementById('qitchenResForm');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName')?.value || '';
      const motivo = document.getElementById('resType')?.value || 'Reserva';
      const guests = document.getElementById('resGuests')?.value || '4';
      const day = document.getElementById('resDay')?.value || 'Viernes';
      const time = document.getElementById('resTime')?.value || '21:00 hs';

      const dishNote = selectedDishForReservation
        ? ` Me gustaría incluir en la mesa: ${selectedDishForReservation}.`
        : '';
      const msg = `Hola Mery La Previa! Soy ${name}. Quiero reservar para ${guests} personas (${motivo}) el ${day} a las ${time}.${dishNote}`;
      window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }
});
