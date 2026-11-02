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
    title: 'LA PREVIA<br />DE MERY',
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
      if (target === 'roulette') {
        openRouletteModal();
      } else if (target) {
        navigateView(target);
      }
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
      if (target === 'roulette') {
        openRouletteModal();
      } else if (target) {
        navigateView(target);
      }
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

  // 7. Qitchen Reservation & Birthday System with Airport Boarding Pass (S9)
  const resForm = document.getElementById('qitchenResForm');
  const resTypeSelect = document.getElementById('resType');
  const resBirthdayFields = document.getElementById('resBirthdayFields');
  const resDniInput = document.getElementById('resDni');
  const resBirthDateInput = document.getElementById('resBirthDate');
  const resDepositModeWrap = document.getElementById('resDepositModeWrap');
  const resDepositModeInput = document.getElementById('resDepositMode');

  // Toggle birthday fields on motivo change
  function updateBirthdayFieldsVisibility() {
    if (!resBirthdayFields) return;
    const isBirthday = (resTypeSelect?.value === 'Cumpleaños VIP');
    resBirthdayFields.hidden = !isBirthday;
    resBirthdayFields.style.display = isBirthday ? 'grid' : 'none';
    if (resDniInput) {
      resDniInput.required = isBirthday;
      if (!isBirthday) resDniInput.value = '';
    }
    if (resBirthDateInput) {
      resBirthDateInput.required = isBirthday;
      if (!isBirthday) resBirthDateInput.value = '';
    }
  }

  if (resTypeSelect) {
    resTypeSelect.addEventListener('change', updateBirthdayFieldsVisibility);
    // Also listen to custom select clicks on resType options
    document.querySelectorAll('[data-select-id="resType"] .q-select-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        setTimeout(updateBirthdayFieldsVisibility, 50);
      });
    });
    updateBirthdayFieldsVisibility();
  }

  // Availability & Capacity management on public form
  const resDaySelect = document.getElementById('resDay');
  const resGuestsInput = document.getElementById('resGuests');
  const resDayAvailNotice = document.getElementById('resDayAvailNotice');

  function updatePublicDayAvailability() {
    if (!window.MeryStore || typeof window.MeryStore.getDayAvailability !== 'function') return;

    const dayWrap = document.querySelector('[data-select-id="resDay"]');
    if (!dayWrap) return;

    const options = dayWrap.querySelectorAll('.q-select-option');
    const nativeSelect = dayWrap.querySelector('select#resDay');
    const triggerVal = dayWrap.querySelector('.q-select-value');

    let currentDay = nativeSelect?.value || 'Viernes 13/11';
    let currentDayAvail = window.MeryStore.getDayAvailability(currentDay);

    options.forEach((opt) => {
      const val = opt.getAttribute('data-value');
      const avail = window.MeryStore.getDayAvailability(val);
      const spanLabel = opt.querySelector('span:first-child');
      let pill = opt.querySelector('.q-option-avail-pill');

      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'q-option-avail-pill';
        opt.insertBefore(pill, opt.querySelector('.q-option-diamond'));
      }

      if (avail.isSoldOut) {
        opt.classList.add('is-sold-out');
        pill.textContent = 'Agotado';
        if (spanLabel) spanLabel.textContent = val;
      } else {
        opt.classList.remove('is-sold-out');
        pill.textContent = `${avail.remaining} disp.`;
        if (spanLabel) spanLabel.textContent = val;
      }

      // Update native option
      if (nativeSelect) {
        const nativeOpt = nativeSelect.querySelector(`option[value="${val}"]`);
        if (nativeOpt) {
          nativeOpt.disabled = avail.isSoldOut;
          nativeOpt.textContent = avail.isSoldOut ? `${val} (Agotado)` : `${val} (${avail.remaining} disp.)`;
        }
      }
    });

    // If current selected day is sold out, pick the first available day
    if (currentDayAvail.isSoldOut) {
      const firstAvailOpt = Array.from(options).find((o) => !o.classList.contains('is-sold-out'));
      if (firstAvailOpt) {
        const nextVal = firstAvailOpt.getAttribute('data-value');
        options.forEach((o) => o.classList.toggle('selected', o === firstAvailOpt));
        if (triggerVal) triggerVal.textContent = nextVal;
        if (nativeSelect) nativeSelect.value = nextVal;
        currentDay = nextVal;
        currentDayAvail = window.MeryStore.getDayAvailability(currentDay);
      }
    }

    // Check guests vs remaining
    const guests = parseInt(resGuestsInput?.value, 10) || 0;
    if (resDayAvailNotice) {
      if (currentDayAvail.isSoldOut) {
        resDayAvailNotice.hidden = false;
        resDayAvailNotice.className = 'q-res-avail-notice is-warning';
        resDayAvailNotice.innerHTML = `⚠️ El día <strong>${currentDay}</strong> se encuentra agotado. Seleccioná otra fecha disponible.`;
      } else if (guests > 0 && currentDayAvail.max > 0 && guests > currentDayAvail.remaining) {
        resDayAvailNotice.hidden = false;
        resDayAvailNotice.className = 'q-res-avail-notice is-warning';
        resDayAvailNotice.innerHTML = `⚠️ Capacidad limitada para <strong>${currentDay}</strong>: solo quedan <strong>${currentDayAvail.remaining}</strong> lugares disponibles (ingresaste ${guests}).`;
      } else if (currentDayAvail.remaining <= 15 && currentDayAvail.remaining > 0) {
        resDayAvailNotice.hidden = false;
        resDayAvailNotice.className = 'q-res-avail-notice';
        resDayAvailNotice.innerHTML = `🔥 ¡Últimos <strong>${currentDayAvail.remaining}</strong> lugares disponibles para <strong>${currentDay}</strong>!`;
      } else {
        resDayAvailNotice.hidden = true;
        resDayAvailNotice.innerHTML = '';
      }
    }
  }

  if (resDaySelect) {
    resDaySelect.addEventListener('change', updatePublicDayAvailability);
    document.querySelectorAll('[data-select-id="resDay"] .q-select-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        setTimeout(updatePublicDayAvailability, 50);
      });
    });
  }
  if (resGuestsInput) {
    resGuestsInput.addEventListener('input', updatePublicDayAvailability);
  }

  updatePublicDayAvailability();

  if (window.MeryStore && typeof window.MeryStore.subscribeToReservationChanges === 'function') {
    window.MeryStore.subscribeToReservationChanges(() => {
      updatePublicDayAvailability();
    });
  }

  // Deposit Mode selector cards
  if (resDepositModeWrap) {
    const cards = resDepositModeWrap.querySelectorAll('.q-deposit-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => {
          c.classList.remove('active');
          const check = c.querySelector('.q-deposit-card-check');
          if (check) check.textContent = '○';
        });
        card.classList.add('active');
        const check = card.querySelector('.q-deposit-card-check');
        if (check) check.textContent = '●';
        const mode = card.getAttribute('data-deposit-mode') || 'con_sena';
        if (resDepositModeInput) resDepositModeInput.value = mode;
      });
    });
  }

  // --- Airport Boarding Pass Modal ---
  const bpModal = document.getElementById('qitchenBoardingPassModal');
  const btnCloseBp = document.getElementById('btnCloseBoardingPass');
  const bpProofFileInput = document.getElementById('bpProofFileInput');
  const btnUploadProofNow = document.getElementById('btnUploadProofNow');
  const btnDownloadBp = document.getElementById('btnDownloadBoardingPass');
  const btnShareBpWhatsapp = document.getElementById('btnShareBoardingPassWhatsapp');
  const btnCopyPortalUrl = document.getElementById('btnCopyPortalUrl');

  let activeBoardingPass = null;

  function openBoardingPassModal(res) {
    if (!bpModal || !res) return;
    activeBoardingPass = res;

    // Populate data
    const bpCode = document.getElementById('bpCode');
    const bpName = document.getElementById('bpName');
    const bpDateTime = document.getElementById('bpDateTime');
    const bpType = document.getElementById('bpType');
    const bpGuests = document.getElementById('bpGuests');
    const bpDni = document.getElementById('bpDni');
    const bpBirthDate = document.getElementById('bpBirthDate');
    const bdBdayRow = document.getElementById('bpBirthdayInfoRow');
    const bpStatusBadge = document.getElementById('bpStatusBadge');
    const bpDepositSection = document.getElementById('bpDepositSection');

    if (bpCode) bpCode.textContent = res.id;
    if (bpName) bpName.textContent = res.customer_name;
    if (bpDateTime) bpDateTime.textContent = `${res.res_day} • ${res.res_time}`;
    if (bpType) bpType.textContent = res.res_type;
    if (bpGuests) bpGuests.textContent = `${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}`;

    if (bdBdayRow) {
      if (res.is_birthday && (res.birthday_dni || res.birthday_date)) {
        bdBdayRow.hidden = false;
        if (bpDni) bpDni.textContent = res.birthday_dni || 'No especificado';
        if (bpBirthDate) bpBirthDate.textContent = res.birthday_date || 'No especificada';
      } else {
        bdBdayRow.hidden = true;
      }
    }

    // Status Badge
    if (bpStatusBadge) {
      if (res.deposit_mode === 'sin_sena') {
        bpStatusBadge.className = 'bp-status-badge bp-status-simple';
        bpStatusBadge.textContent = 'RESERVA SIN SEÑA • SUJETA A DISPONIBILIDAD';
      } else if (res.deposit_status === 'confirmada') {
        bpStatusBadge.className = 'bp-status-badge bp-status-confirmed';
        bpStatusBadge.textContent = 'LUGAR ASEGURADO • SEÑA CONFIRMADA ✓';
      } else if (res.deposit_status === 'comprobante_subido') {
        bpStatusBadge.className = 'bp-status-badge bp-status-review';
        bpStatusBadge.textContent = 'COMPROBANTE EN REVISIÓN';
      } else {
        bpStatusBadge.className = 'bp-status-badge bp-status-pending';
        bpStatusBadge.textContent = 'PENDIENTE DE COMPROBANTE DE SEÑA';
      }
    }

    // Deposit details
    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
    if (bpDepositSection) {
      if (res.deposit_mode === 'sin_sena') {
        bpDepositSection.hidden = true;
      } else {
        bpDepositSection.hidden = false;
        const bpDepositAlias = document.getElementById('bpDepositAlias');
        const bpDepositCbu = document.getElementById('bpDepositCbu');
        const bpDepositAmount = document.getElementById('bpDepositAmount');
        const bpPaymentLink = document.getElementById('bpPaymentLink');

        if (bpDepositAlias) bpDepositAlias.textContent = settings.depositAlias || 'MERY.LAPREVIA.MP';
        if (bpDepositCbu) bpDepositCbu.textContent = settings.depositCbu || '0000003100098765432100';
        if (bpDepositAmount) bpDepositAmount.textContent = settings.depositAmount || '$15.000';
        if (bpPaymentLink && settings.depositPaymentLink) bpPaymentLink.href = settings.depositPaymentLink;
      }
    }

    // Customer Portal URL
    const origin = window.location.origin || 'http://localhost:3000';
    const portalUrl = `${origin}/?reserva=${encodeURIComponent(res.id)}`;
    const bpCustomerPortalUrl = document.getElementById('bpCustomerPortalUrl');
    if (bpCustomerPortalUrl) bpCustomerPortalUrl.value = portalUrl;

    // Proof Preview
    const bpProofPreviewWrap = document.getElementById('bpProofPreviewWrap');
    const bpProofPreviewImg = document.getElementById('bpProofPreviewImg');
    const bpProofStatusMsg = document.getElementById('bpProofStatusMsg');
    if (bpProofPreviewWrap && bpProofPreviewImg) {
      if (res.proof_url) {
        bpProofPreviewWrap.hidden = false;
        bpProofPreviewWrap.style.display = 'flex';
        bpProofPreviewImg.src = res.proof_url;
        if (bpProofStatusMsg) {
          bpProofStatusMsg.textContent = res.deposit_status === 'confirmada'
            ? '✓ Seña confirmada por el equipo'
            : '✓ Comprobante recibido — Ya notificamos al equipo';
        }
      } else {
        bpProofPreviewWrap.hidden = true;
        bpProofPreviewWrap.style.display = 'none';
        bpProofPreviewImg.src = '';
      }
    }

    // Scannable Door Check-in QR Canvas
    const checkinUrl = `${origin}/admin?checkin=${encodeURIComponent(res.id)}`;
    if (window.MeryStore && typeof window.MeryStore.renderQrCode === 'function') {
      window.MeryStore.renderQrCode('bpQrCanvas', checkinUrl, { size: 220 });
    }

    // Open Modal
    bpModal.classList.add('open');
    bpModal.setAttribute('aria-hidden', 'false');
    const cardEl = bpModal.querySelector('.bp-modal-card');
    if (cardEl) cardEl.scrollTo({ top: 0, behavior: 'instant' });
  }

  function closeBoardingPassModal() {
    if (!bpModal) return;
    bpModal.classList.remove('open');
    bpModal.setAttribute('aria-hidden', 'true');
  }

  if (btnCloseBp) btnCloseBp.addEventListener('click', closeBoardingPassModal);
  if (bpModal) {
    bpModal.addEventListener('click', (e) => {
      if (e.target === bpModal) closeBoardingPassModal();
    });
  }

  // Copy buttons
  if (btnCopyPortalUrl) {
    btnCopyPortalUrl.addEventListener('click', () => {
      const urlInput = document.getElementById('bpCustomerPortalUrl');
      if (urlInput && urlInput.value) {
        navigator.clipboard.writeText(urlInput.value).then(() => {
          const prev = btnCopyPortalUrl.textContent;
          btnCopyPortalUrl.textContent = '¡Copiado!';
          setTimeout(() => { btnCopyPortalUrl.textContent = prev; }, 1800);
        }).catch(() => {});
      }
    });
  }

  document.querySelectorAll('.bp-btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl && targetEl.textContent) {
        navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
          const prev = btn.textContent;
          btn.textContent = '✓ Copiado';
          setTimeout(() => { btn.textContent = prev; }, 1800);
        }).catch(() => {});
      }
    });
  });

  // Direct deposit proof file upload in Boarding Pass modal
  if (btnUploadProofNow && bpProofFileInput) {
    btnUploadProofNow.addEventListener('click', () => {
      bpProofFileInput.click();
    });

    bpProofFileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file || !activeBoardingPass) return;

      const originalBtnText = btnUploadProofNow.textContent;
      btnUploadProofNow.disabled = true;
      btnUploadProofNow.textContent = 'Subiendo comprobante optimizado...';

      try {
        if (window.MeryStore && typeof window.MeryStore.uploadDepositProof === 'function') {
          const updated = await window.MeryStore.uploadDepositProof(activeBoardingPass.id, file);
          activeBoardingPass = updated;
          openBoardingPassModal(updated);
        }
      } catch (err) {
        alert('Error al subir el comprobante: ' + (err.message || err));
      } finally {
        btnUploadProofNow.disabled = false;
        btnUploadProofNow.textContent = originalBtnText;
        bpProofFileInput.value = '';
      }
    });
  }

  // Download Boarding Pass as PNG
  if (btnDownloadBp) {
    btnDownloadBp.addEventListener('click', () => {
      if (!activeBoardingPass) return;
      const qrCanvas = document.getElementById('bpQrCanvas');
      const downloadCanvas = document.createElement('canvas');
      downloadCanvas.width = 680;
      downloadCanvas.height = 860;
      const ctx = downloadCanvas.getContext('2d');
      if (!ctx) return;

      // Dark background with gold border
      ctx.fillStyle = '#0f1110';
      ctx.fillRect(0, 0, 680, 860);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 640, 820);

      // Header
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('MERY LA PREVIA • VIP NIGHTS', 45, 65);

      ctx.fillStyle = '#f7f4ed';
      ctx.font = 'bold 32px serif';
      ctx.fillText('BOARDING PASS', 45, 105);

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(activeBoardingPass.id, 635, 105);
      ctx.textAlign = 'left';

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(45, 130);
      ctx.lineTo(635, 130);
      ctx.stroke();

      // Details
      ctx.fillStyle = '#a09f98';
      ctx.font = '12px sans-serif';
      ctx.fillText('PASAJERO / TITULAR', 45, 165);
      ctx.fillStyle = '#f7f4ed';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(activeBoardingPass.customer_name, 45, 192);

      ctx.fillStyle = '#a09f98';
      ctx.font = '12px sans-serif';
      ctx.fillText('FECHA Y HORA', 380, 165);
      ctx.fillStyle = '#f7f4ed';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${activeBoardingPass.res_day} • ${activeBoardingPass.res_time}`, 380, 192);

      ctx.fillStyle = '#a09f98';
      ctx.font = '12px sans-serif';
      ctx.fillText('SECTOR / MOTIVO', 45, 240);
      ctx.fillStyle = '#f7f4ed';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(activeBoardingPass.res_type, 45, 267);

      ctx.fillStyle = '#a09f98';
      ctx.font = '12px sans-serif';
      ctx.fillText('PERSONAS', 380, 240);
      ctx.fillStyle = '#f7f4ed';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${activeBoardingPass.guests} personas`, 380, 267);

      if (activeBoardingPass.is_birthday && activeBoardingPass.birthday_dni) {
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`🎂 Cumpleaños VIP — DNI: ${activeBoardingPass.birthday_dni}`, 45, 310);
      }

      // Draw QR Canvas in center
      if (qrCanvas) {
        const qrSize = 260;
        const qrX = (680 - qrSize) / 2;
        const qrY = 350;
        ctx.fillStyle = '#f7f4ed';
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }

      // Door note
      ctx.fillStyle = '#a09f98';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Mostrá este código QR al recepcionista en la puerta de Mery La Previa', 340, 675);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('ACCESO NOCTURNO • CABINA 13:11 • LONGCHAMPS', 340, 705);

      // Trigger download
      const link = document.createElement('a');
      link.download = `pase-abordaje-${activeBoardingPass.id}.png`;
      link.href = downloadCanvas.toDataURL('image/png');
      link.click();
    });
  }

  // Share Boarding Pass on WhatsApp
  if (btnShareBpWhatsapp) {
    btnShareBpWhatsapp.addEventListener('click', () => {
      if (!activeBoardingPass) return;
      const origin = window.location.origin || 'http://localhost:3000';
      const portalUrl = `${origin}/?reserva=${encodeURIComponent(activeBoardingPass.id)}`;
      const msg = `¡Ya tengo mi Pase de Abordaje para Mery La Previa!\n` +
        `Código: ${activeBoardingPass.id}\n` +
        `Sector: ${activeBoardingPass.res_type} (${activeBoardingPass.guests} personas)\n` +
        `Fecha: ${activeBoardingPass.res_day} • ${activeBoardingPass.res_time}\n` +
        `Ver Pase QR y detalles: ${portalUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  // --- Reservation Recheck Confirmation Modal & Success Modal (S10) ---
  const resConfirmModal = document.getElementById('qitchenResConfirmModal');
  const btnCloseConfirmModal = document.getElementById('btnCloseConfirmModal');
  const btnEditResData = document.getElementById('btnEditResData');
  const btnConfirmResFinal = document.getElementById('btnConfirmResFinal');

  const resSuccessModal = document.getElementById('qitchenResSuccessModal');
  const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');
  const btnCloseSuccessModalCross = document.getElementById('btnCloseSuccessModalCross');
  const btnOpenDigitalPass = document.getElementById('btnOpenDigitalPass');
  const successResCode = document.getElementById('successResCode');

  let pendingReservationData = null;

  function closeResConfirmModal() {
    if (!resConfirmModal) return;
    resConfirmModal.classList.remove('open');
    resConfirmModal.setAttribute('aria-hidden', 'true');
  }

  function closeResSuccessModal() {
    if (!resSuccessModal) return;
    resSuccessModal.classList.remove('open');
    resSuccessModal.setAttribute('aria-hidden', 'true');
  }

  if (btnCloseConfirmModal) btnCloseConfirmModal.addEventListener('click', closeResConfirmModal);
  if (btnEditResData) btnEditResData.addEventListener('click', closeResConfirmModal);
  if (resConfirmModal) {
    resConfirmModal.addEventListener('click', (e) => {
      if (e.target === resConfirmModal) closeResConfirmModal();
    });
  }

  if (btnCloseSuccessModal) btnCloseSuccessModal.addEventListener('click', closeResSuccessModal);
  if (btnCloseSuccessModalCross) btnCloseSuccessModalCross.addEventListener('click', closeResSuccessModal);
  if (resSuccessModal) {
    resSuccessModal.addEventListener('click', (e) => {
      if (e.target === resSuccessModal) closeResSuccessModal();
    });
  }

  // Handle Final Reservation Confirmation
  if (btnConfirmResFinal) {
    btnConfirmResFinal.addEventListener('click', () => {
      if (!pendingReservationData) return;

      const originalBtnText = btnConfirmResFinal.textContent;
      btnConfirmResFinal.disabled = true;
      btnConfirmResFinal.textContent = 'Confirmando reserva...';

      try {
        let createdRes = null;
        if (window.MeryStore && typeof window.MeryStore.createReservation === 'function') {
          createdRes = window.MeryStore.createReservation(pendingReservationData);
        }

        if (createdRes) {
          closeResConfirmModal();

          if (successResCode) successResCode.textContent = createdRes.id;
          if (btnOpenDigitalPass) {
            btnOpenDigitalPass.href = `pase.html?id=${encodeURIComponent(createdRes.id)}`;
          }

          if (resSuccessModal) {
            resSuccessModal.classList.add('open');
            resSuccessModal.setAttribute('aria-hidden', 'false');
          }

          // Reset reservation form
          if (resForm) resForm.reset();
          if (typeof updateBirthdayFieldsVisibility === 'function') {
            updateBirthdayFieldsVisibility();
          }
        }
      } catch (err) {
        alert('Error al confirmar la reserva: ' + (err.message || err));
      } finally {
        btnConfirmResFinal.disabled = false;
        btnConfirmResFinal.textContent = originalBtnText;
      }
    });
  }

  // Handle Reservation Form Submission -> Intercept, validate & open Recheck Modal
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName')?.value.trim() || '';
      const email = document.getElementById('resEmail')?.value.trim() || '';
      const phone = document.getElementById('resPhone')?.value.trim() || '';
      const motivo = document.getElementById('resType')?.value || 'Mesa Cena + Previa';
      const guests = document.getElementById('resGuests')?.value || '4';
      const day = document.getElementById('resDay')?.value || 'Viernes 13/11';
      const time = document.getElementById('resTime')?.value || '20:30 hs (Cena)';
      const depositMode = document.getElementById('resDepositMode')?.value || 'con_sena';

      const isBirthday = (motivo === 'Cumpleaños VIP');
      const dni = isBirthday ? (document.getElementById('resDni')?.value.trim() || '') : '';
      const birthDate = isBirthday ? (document.getElementById('resBirthDate')?.value.trim() || '') : '';

      if (!name || !phone || !email) {
        alert('Por favor, completá los campos obligatorios (Nombre, Celular y Correo).');
        return;
      }

      if (isBirthday && (!dni || !birthDate)) {
        alert('Para reservas de Cumpleaños VIP, ingresá el DNI y la Fecha de Cumpleaños.');
        return;
      }

      if (window.MeryStore && typeof window.MeryStore.getDayAvailability === 'function') {
        const avail = window.MeryStore.getDayAvailability(day);
        if (avail.isSoldOut) {
          alert(`Lo sentimos, el día "${day}" se encuentra agotado o cerrado para nuevas reservas. Por favor elegí otra fecha.`);
          return;
        }
        if (avail.max > 0 && avail.remaining < (Number(guests) || 2)) {
          alert(`Capacidad insuficiente para "${day}". Solo quedan ${avail.remaining} lugares disponibles y solicitaste ${guests}.`);
          return;
        }
      }

      pendingReservationData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        res_type: motivo,
        is_birthday: isBirthday,
        birthday_dni: dni,
        birthday_date: birthDate,
        guests: Number(guests) || 2,
        res_day: day,
        res_time: time,
        deposit_mode: depositMode
      };

      // Populate Recheck Confirmation Modal
      const confirmResName = document.getElementById('confirmResName');
      const confirmResPhone = document.getElementById('confirmResPhone');
      const confirmResEmail = document.getElementById('confirmResEmail');
      const confirmResDateTime = document.getElementById('confirmResDateTime');
      const confirmResGuests = document.getElementById('confirmResGuests');
      const confirmResType = document.getElementById('confirmResType');
      const confirmResBirthdayRow = document.getElementById('confirmResBirthdayRow');
      const confirmResDni = document.getElementById('confirmResDni');
      const confirmResBirthDate = document.getElementById('confirmResBirthDate');
      const confirmResDeposit = document.getElementById('confirmResDeposit');

      if (confirmResName) confirmResName.textContent = name;
      if (confirmResPhone) confirmResPhone.textContent = phone;
      if (confirmResEmail) confirmResEmail.textContent = email;
      if (confirmResDateTime) confirmResDateTime.textContent = `${day} • ${time}`;
      if (confirmResGuests) confirmResGuests.textContent = `${guests} ${guests === '1' ? 'persona' : 'personas'}`;
      if (confirmResType) confirmResType.textContent = motivo;

      if (confirmResBirthdayRow) {
        if (isBirthday) {
          confirmResBirthdayRow.hidden = false;
          confirmResBirthdayRow.style.display = 'flex';
          if (confirmResDni) confirmResDni.textContent = dni || '-';
          if (confirmResBirthDate) confirmResBirthDate.textContent = birthDate || '-';
        } else {
          confirmResBirthdayRow.hidden = true;
          confirmResBirthdayRow.style.display = 'none';
        }
      }

      const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
      if (confirmResDeposit) {
        if (depositMode === 'con_sena') {
          confirmResDeposit.textContent = `Lugar asegurado con seña (${settings.depositAmount || '$15.000'})`;
        } else {
          confirmResDeposit.textContent = 'Reserva simple sin seña (Sujeta a disponibilidad)';
        }
      }

      // Open Recheck Modal
      if (resConfirmModal) {
        resConfirmModal.classList.add('open');
        resConfirmModal.setAttribute('aria-hidden', 'false');
      }
    });
  }

  // --- Automatic URL Lookup & Redirect to Dedicated Pass Page (?reserva=MLP-XXXX) ---
  const searchParams = new URLSearchParams(window.location.search);
  const reservaParam = searchParams.get('reserva') || searchParams.get('id');
  if (reservaParam) {
    window.location.replace(`pase.html?id=${encodeURIComponent(reservaParam.trim())}`);
  }

  // ==========================================================================
  // S4: INTERACTIVE PROMOTIONS & ROULETTE ENGINE (MERY LA PREVIA)
  // ==========================================================================
  const STORAGE_KEY_ROULETTE_DEVICE = 'mery_roulette_device_v1';

  let rouletteAudioCtx = null;
  let currentWheelAngle = 0;
  let isRouletteSpinning = false;
  let currentPrizeWon = null;
  let lastSliceClickIndex = -1;

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
            // New day: reset spins, preserve previous vouchers history
            const resetState = {
              date: today,
              spinsUsed: 0,
              claimedVouchers: Array.isArray(parsed.claimedVouchers) ? parsed.claimedVouchers : []
            };
            saveRouletteDeviceState(resetState);
            return resetState;
          }
          return {
            date: today,
            spinsUsed: Number(parsed.spinsUsed) || 0,
            claimedVouchers: Array.isArray(parsed.claimedVouchers) ? parsed.claimedVouchers : []
          };
        }
      }
    } catch (_) {}
    const newState = { date: today, spinsUsed: 0, claimedVouchers: [] };
    saveRouletteDeviceState(newState);
    return newState;
  }

  function saveRouletteDeviceState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_ROULETTE_DEVICE, JSON.stringify(state));
    } catch (_) {}
  }

  // --- Web Audio API Mechanical Sound Synthesizer ---
  function getRouletteAudioContext() {
    if (!rouletteAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        rouletteAudioCtx = new AudioCtx();
      }
    }
    if (rouletteAudioCtx && rouletteAudioCtx.state === 'suspended') {
      rouletteAudioCtx.resume().catch(() => {});
    }
    return rouletteAudioCtx;
  }

  function playRouletteClick() {
    try {
      const ctx = getRouletteAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.032);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.033);
    } catch (_) {}
  }

  function playRouletteWin() {
    try {
      const ctx = getRouletteAudioContext();
      if (!ctx) return;
      // Celebratory chord with arpeggiated sparkle
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const st = ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, st);

        gain.gain.setValueAtTime(0.001, st);
        gain.gain.linearRampToValueAtTime(0.18, st + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.95);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(st);
        osc.stop(st + 0.96);
      });
    } catch (_) {}
  }

  function splitPrizeName(name) {
    if (!name) return [''];
    name = String(name).trim();
    if (name.length <= 13) return [name];

    const words = name.split(/\s+/);
    if (words.length <= 1) return [name];
    if (words.length === 2) return [words[0], words[1]];

    let bestLine1 = words[0];
    let bestLine2 = words.slice(1).join(' ');
    let minDiff = 999;
    for (let i = 1; i < words.length; i++) {
      const l1 = words.slice(0, i).join(' ');
      const l2 = words.slice(i).join(' ');
      const diff = Math.abs(l1.length - l2.length);
      if (diff < minDiff) {
        minDiff = diff;
        bestLine1 = l1;
        bestLine2 = l2;
      }
    }
    return [bestLine1, bestLine2];
  }

  // --- Canvas Roulette Wheel Drawer ---
  function drawRouletteWheel(angle) {
    const canvas = document.getElementById('rouletteCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = cx - 14;

    ctx.clearRect(0, 0, width, height);

    const settings = window.MeryStore ? window.MeryStore.getRouletteSettings() : null;
    const prizes = (settings && Array.isArray(settings.prizes) && settings.prizes.length > 0)
      ? settings.prizes
      : [];
    const numSlices = prizes.length || 6;
    const arc = (2 * Math.PI) / numSlices;

    // Outer glowing rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0709';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e02434';
    ctx.shadowColor = 'rgba(224, 36, 52, 0.65)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    // Draw slices
    prizes.forEach((prize, i) => {
      const sliceStart = angle + i * arc;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sliceStart, sliceStart + arc);
      ctx.closePath();

      // Fill slice color
      ctx.fillStyle = prize.color || (i % 2 === 0 ? '#e02434' : '#140c10');
      ctx.fill();

      // Inner radial shade for 3D depth
      const grad = ctx.createRadialGradient(cx, cy, 25, cx, cy, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      grad.addColorStop(0.65, 'transparent');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke boundary
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(251, 247, 238, 0.28)';
      ctx.stroke();

      // Clean, sharp text label (no heavy cartoonish strokes)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sliceStart + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '700 11.5px "Satoshi", "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;

      const lines = splitPrizeName(prize.name || '');
      const textX = radius - 18;

      if (lines.length === 1) {
        ctx.fillText(lines[0], textX, 0);
      } else {
        const lineSpacing = 13;
        const startY = -(lines.length - 1) * (lineSpacing / 2);
        lines.forEach((line, lineIdx) => {
          const y = startY + lineIdx * lineSpacing;
          ctx.fillText(line, textX, y);
        });
      }

      if (prize.stock === 0) {
        ctx.font = '700 8.5px "Satoshi", sans-serif';
        ctx.fillStyle = '#ff4b4b';
        ctx.shadowBlur = 0;
        const agotadoY = lines.length > 1 ? 16 : 12;
        ctx.fillText('(AGOTADO)', textX, agotadoY);
      }

      ctx.restore();
      ctx.restore();
    });

    // Perimeter golden/ruby studs
    for (let i = 0; i < numSlices; i++) {
      const pinAngle = angle + i * arc;
      const px = cx + (radius + 1) * Math.cos(pinAngle);
      const py = cy + (radius + 1) * Math.sin(pinAngle);
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbf7ee';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    // Center star emblem
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#080708';
    ctx.shadowColor = 'rgba(224, 36, 52, 0.8)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#e02434';
    ctx.stroke();

    drawCenterStar(ctx, cx, cy, 5, 14, 7, '#e02434');
    ctx.restore();
  }

  function drawCenterStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(224, 36, 52, 0.6)';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  // --- Real-time Stock, Badges and Visibility Sync ---
  function updateRouletteBadges() {
    const settings = window.MeryStore ? window.MeryStore.getRouletteSettings() : null;
    const triggerBtn = document.getElementById('btnOpenRoulette');
    const overlayBtn = document.getElementById('btnOverlayRoulette');
    const bentoCard = document.querySelector('.q-bento-roulette-card');

    if (!settings || !settings.enabled) {
      if (triggerBtn) triggerBtn.style.display = 'none';
      if (overlayBtn) overlayBtn.style.display = 'none';
      if (bentoCard) bentoCard.style.display = 'none';
      return;
    } else {
      if (triggerBtn) triggerBtn.style.display = '';
      if (overlayBtn) overlayBtn.style.display = '';
      if (bentoCard) bentoCard.style.display = '';
    }

    const titleEl = document.getElementById('rouletteModalTitle');
    const subtitleEl = document.getElementById('rouletteModalSubtitle');
    if (titleEl && settings.title) titleEl.textContent = settings.title;
    if (subtitleEl && settings.subtitle) subtitleEl.textContent = settings.subtitle;

    // Live stock count (excluding dummy 999)
    const prizes = Array.isArray(settings.prizes) ? settings.prizes : [];
    const realPrizes = prizes.filter((p) => p.stock !== 999);
    const totalStock = realPrizes.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);

    const stockCountEl = document.getElementById('rouletteStockCount');
    if (stockCountEl) {
      stockCountEl.textContent = `${totalStock} disponibles`;
    }

    const triggerPill = document.getElementById('rouletteTriggerStockPill');
    if (triggerPill) {
      triggerPill.textContent = totalStock > 0 ? `● ${totalStock} EN VIVO` : '● HOY';
    }

    // Device spins left
    const device = getRouletteDeviceState();
    const maxSpins = settings.maxSpinsPerDevice || 3;
    const spinsLeft = Math.max(0, maxSpins - (device.spinsUsed || 0));

    const spinsTextEl = document.getElementById('rouletteSpinsLeftText');
    if (spinsTextEl) {
      spinsTextEl.textContent = `Tiros: ${spinsLeft} de ${maxSpins}`;
    }

    // Link for claimed vouchers
    const vouchersWrap = document.getElementById('rouletteMyVouchersLinkWrap');
    const vouchersCount = document.getElementById('myVouchersCount');
    if (vouchersWrap && vouchersCount) {
      if (device.claimedVouchers && device.claimedVouchers.length > 0) {
        vouchersWrap.hidden = false;
        vouchersCount.textContent = String(device.claimedVouchers.length);
      } else {
        vouchersWrap.hidden = true;
      }
    }
  }

  // --- Modal Open & Close ---
  function openRouletteModal() {
    const modal = document.getElementById('qitchenRouletteModal');
    if (!modal) return;

    updateRouletteBadges();

    const settings = window.MeryStore ? window.MeryStore.getRouletteSettings() : null;
    const device = getRouletteDeviceState();
    const maxSpins = settings ? (settings.maxSpinsPerDevice || 3) : 3;

    const wheelStage = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const voucherCard = document.getElementById('rouletteVoucherCard');
    const cooldownCard = document.getElementById('rouletteCooldownCard');

    if (device.spinsUsed >= maxSpins) {
      showCooldownView();
    } else {
      if (wheelStage) wheelStage.hidden = false;
      if (resultCard) resultCard.hidden = true;
      if (voucherCard) voucherCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = true;
      drawRouletteWheel(currentWheelAngle);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeRouletteModal() {
    const modal = document.getElementById('qitchenRouletteModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- Friendly Cooldown View ---
  function showCooldownView() {
    const wheelStage = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const voucherCard = document.getElementById('rouletteVoucherCard');
    const cooldownCard = document.getElementById('rouletteCooldownCard');

    if (wheelStage) wheelStage.hidden = true;
    if (resultCard) resultCard.hidden = true;
    if (voucherCard) voucherCard.hidden = true;
    if (cooldownCard) cooldownCard.hidden = false;

    const device = getRouletteDeviceState();
    const vouchersWrap = document.getElementById('cooldownVouchersList');
    const container = document.getElementById('cooldownVouchersContainer');

    if (vouchersWrap && container) {
      if (device.claimedVouchers && device.claimedVouchers.length > 0) {
        vouchersWrap.hidden = false;
        container.innerHTML = device.claimedVouchers.map((v) => `
          <div class="cooldown-voucher-item">
            <span class="cooldown-voucher-code">${escapeHtml(v.code || 'PREVIA-****')}</span>
            <span class="cooldown-voucher-prize">${escapeHtml(v.prizeName || 'Premio')}</span>
          </div>
        `).join('');
      } else {
        vouchersWrap.hidden = true;
        container.innerHTML = '';
      }
    }
  }

  // --- Spin Physics with Easing & Wheel Deceleration ---
  function spinRoulette() {
    if (isRouletteSpinning) return;
    const settings = window.MeryStore ? window.MeryStore.getRouletteSettings() : null;
    if (!settings || !settings.enabled) return;

    const device = getRouletteDeviceState();
    const maxSpins = settings.maxSpinsPerDevice || 3;
    if (device.spinsUsed >= maxSpins) {
      showCooldownView();
      return;
    }

    const prizes = Array.isArray(settings.prizes) ? settings.prizes : [];
    if (prizes.length === 0) return;

    // Filter prizes with available stock
    const eligible = prizes.filter((p) => p.stock > 0 || p.stock === 999);
    const pool = eligible.length > 0 ? eligible : prizes;

    // Weighted random selection based on probability
    const totalWeight = pool.reduce((sum, p) => sum + (Number(p.probability) || 10), 0);
    let r = Math.random() * totalWeight;
    let winningPrize = pool[0];
    for (const p of pool) {
      const weight = Number(p.probability) || 10;
      if (r < weight) {
        winningPrize = p;
        break;
      }
      r -= weight;
    }

    // Find index in prizes array
    const prizeIndex = prizes.findIndex((p) => p.id === winningPrize.id);
    const targetIdx = prizeIndex >= 0 ? prizeIndex : 0;
    const numSlices = prizes.length;
    const arc = (2 * Math.PI) / numSlices;

    // Target angle: aligns targetIdx with pointer at 12 o'clock (1.5*PI)
    const jitter = (Math.random() - 0.5) * 0.5 * arc;
    let targetAngleMod = (1.5 * Math.PI - (targetIdx + 0.5) * arc + jitter) % (2 * Math.PI);
    if (targetAngleMod < 0) targetAngleMod += 2 * Math.PI;

    const currentMod = (currentWheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    let angleDelta = targetAngleMod - currentMod;
    if (angleDelta < 0) angleDelta += 2 * Math.PI;

    // Minimum 5 to 7 full spins
    const fullRotations = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const totalDelta = angleDelta + fullRotations;
    const startAngle = currentWheelAngle;
    const duration = 4600; // ms

    isRouletteSpinning = true;
    const spinBtn = document.getElementById('btnSpinRoulette');
    if (spinBtn) {
      spinBtn.disabled = true;
      const textSpan = spinBtn.querySelector('.spin-btn-text');
      if (textSpan) textSpan.textContent = '¡GIRANDO...! 🎰';
    }

    const pointerEl = document.getElementById('roulettePointer');
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Realistic smooth deceleration (ease-out quart)
      const ease = 1 - Math.pow(1 - progress, 4);
      currentWheelAngle = startAngle + totalDelta * ease;

      // Mechanical ratchet audio click & pointer flick on slice boundary
      let norm = (1.5 * Math.PI - currentWheelAngle) % (2 * Math.PI);
      if (norm < 0) norm += 2 * Math.PI;
      const sliceIndex = Math.floor(norm / arc) % numSlices;
      if (sliceIndex !== lastSliceClickIndex) {
        playRouletteClick();
        if (pointerEl) {
          pointerEl.classList.remove('kicking');
          void pointerEl.offsetWidth;
          pointerEl.classList.add('kicking');
        }
        lastSliceClickIndex = sliceIndex;
      }

      drawRouletteWheel(currentWheelAngle);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isRouletteSpinning = false;
        onSpinCompleted(winningPrize);
      }
    }

    requestAnimationFrame(step);
  }

  // --- Wheel Finished Handler ---
  function onSpinCompleted(winningPrize) {
    const settings = window.MeryStore ? window.MeryStore.getRouletteSettings() : null;
    const device = getRouletteDeviceState();
    device.spinsUsed = (device.spinsUsed || 0) + 1;
    saveRouletteDeviceState(device);

    updateRouletteBadges();

    const spinBtn = document.getElementById('btnSpinRoulette');
    if (spinBtn) {
      spinBtn.disabled = false;
      const textSpan = spinBtn.querySelector('.spin-btn-text');
      if (textSpan) textSpan.textContent = '¡GIRAR RULETA!';
    }

    const isNoPrize = (winningPrize.id === 'segui-participando');
    currentPrizeWon = winningPrize;

    const wheelStage = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const prizeNameEl = document.getElementById('rouletteResultPrizeName');
    const prizeCondEl = document.getElementById('rouletteResultCondition');
    const kickerEl = resultCard ? resultCard.querySelector('.congrats-kicker') : null;
    const claimForm = document.getElementById('rouletteClaimForm');
    const noPrizeCard = document.getElementById('rouletteNoPrizeCard');

    if (isNoPrize) {
      if (kickerEl) kickerEl.textContent = '★ ¡CASI! SEGUÍ PARTICIPANDO ★';
      if (prizeNameEl) prizeNameEl.textContent = winningPrize.name || 'Seguí Participando';
      if (prizeCondEl) {
        const maxSpins = settings ? (settings.maxSpinsPerDevice || 3) : 3;
        const left = Math.max(0, maxSpins - device.spinsUsed);
        prizeCondEl.textContent = left > 0
          ? `Te quedan ${left} tiro${left === 1 ? '' : 's'} hoy. ¡Volvé a girar para llevarte un shot o 2x1!`
          : 'Usaste tus 3 tiros de hoy. ¡Volvé mañana a partir de las 19:00 hs para seguir jugando!';
      }
      if (claimForm) claimForm.hidden = true;
      if (noPrizeCard) {
        noPrizeCard.hidden = false;
        const againBtn = document.getElementById('btnSpinAgain');
        const maxSpins = settings ? (settings.maxSpinsPerDevice || 3) : 3;
        if (againBtn) {
          if (device.spinsUsed < maxSpins) {
            againBtn.textContent = '¡Girar de nuevo!';
            againBtn.onclick = () => {
              if (resultCard) resultCard.hidden = true;
              if (wheelStage) wheelStage.hidden = false;
            };
          } else {
            againBtn.textContent = 'Ver estado de hoy';
            againBtn.onclick = () => {
              showCooldownView();
            };
          }
        }
      }
    } else {
      // Real prize won!
      playRouletteWin();
      if (kickerEl) kickerEl.textContent = '★ ¡FELICITACIONES! GANASTE ★';
      if (prizeNameEl) prizeNameEl.textContent = winningPrize.name;
      if (prizeCondEl) prizeCondEl.textContent = winningPrize.condition || 'Válido para canjear hoy en barra';
      if (claimForm) claimForm.hidden = false;
      if (noPrizeCard) noPrizeCard.hidden = true;

      // Prefill from localStorage if available
      const nameInput = document.getElementById('rouletteClaimName');
      const phoneInput = document.getElementById('rouletteClaimPhone');
      if (nameInput && !nameInput.value) {
        nameInput.value = localStorage.getItem('mery_user_name') || '';
      }
      if (phoneInput && !phoneInput.value) {
        phoneInput.value = localStorage.getItem('mery_user_phone') || '';
      }
    }

    if (wheelStage) wheelStage.hidden = true;
    if (resultCard) resultCard.hidden = false;
  }

  // --- Claim Form Submission ---
  function handleRouletteClaimSubmit(e) {
    e.preventDefault();
    if (!currentPrizeWon) return;

    const nameInput = document.getElementById('rouletteClaimName');
    const phoneInput = document.getElementById('rouletteClaimPhone');
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name || !phone) {
      alert('Por favor ingresá tu nombre y WhatsApp para generar tu cupón digital.');
      return;
    }

    try {
      localStorage.setItem('mery_user_name', name);
      localStorage.setItem('mery_user_phone', phone);
    } catch (_) {}

    if (!window.MeryStore || typeof window.MeryStore.claimRoulettePrize !== 'function') {
      alert('El sistema de canjes no está disponible en este momento.');
      return;
    }

    const claimResult = window.MeryStore.claimRoulettePrize(currentPrizeWon.id, { name, phone });
    if (!claimResult || !claimResult.success) {
      alert(claimResult ? claimResult.message : 'No se pudo generar el cupón. Intentá nuevamente.');
      return;
    }

    const voucher = claimResult.voucher;
    const device = getRouletteDeviceState();
    if (!Array.isArray(device.claimedVouchers)) {
      device.claimedVouchers = [];
    }
    device.claimedVouchers.push(voucher);
    saveRouletteDeviceState(device);

    // Show Voucher Card
    const resultCard = document.getElementById('rouletteResultCard');
    const voucherCard = document.getElementById('rouletteVoucherCard');
    if (resultCard) resultCard.hidden = true;
    if (voucherCard) voucherCard.hidden = false;

    const codeEl = document.getElementById('voucherCode');
    const prizeEl = document.getElementById('voucherPrize');
    const clientEl = document.getElementById('voucherClient');
    const condEl = document.getElementById('voucherCondition');

    if (codeEl) codeEl.textContent = voucher.code;
    if (prizeEl) prizeEl.textContent = voucher.prizeName;
    if (clientEl) clientEl.textContent = voucher.clientName;
    if (condEl) condEl.textContent = voucher.condition;

    // WhatsApp share with official verification and anti-duplication security
    const shareBtn = document.getElementById('btnShareVoucherWhatsapp');
    if (shareBtn) {
      const issueDate = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const issueTime = new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const waText = 
        `*MERY JANE · LA PREVIA — CUPÓN DIGITAL EXCLUSIVO*\n\n` +
        `¡Felicitaciones, ${voucher.clientName}! Tu premio obtenido en la Ruleta de La Previa ya está emitido y registrado en el sistema del bar con código de seguridad único.\n\n` +
        `• *CÓDIGO DE VALIDACIÓN:* *${voucher.code}*\n` +
        `• *BENEFICIO:* *${voucher.prizeName}*\n` +
        `• *TITULAR:* ${voucher.clientName}\n` +
        (voucher.clientPhone ? `• *WHATSAPP:* ${voucher.clientPhone}\n` : '') +
        `• *CONDICIÓN DE USO:* ${voucher.condition}\n` +
        `• *FECHA DE EMISIÓN:* ${issueDate} a las ${issueTime} hs\n\n` +
        `*CLÁUSULA DE SEGURIDAD Y CANJE:*\n` +
        `1. Este cupón digital es personal, intransferible y de un solo uso.\n` +
        `2. Mostrá este mensaje o tu pantalla al mozo o en la barra al momento de ordenar.\n` +
        `3. Al canjearse, el código queda registrado como utilizado en el sistema del bar y se invalida automáticamente para evitar réplicas o reusos.\n\n` +
        `*Ubicación:* Calle 101 Nº 85, Guernica.\n` +
        `*Tu noche empieza acá.*`;

      shareBtn.onclick = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
        window.open(url, '_blank');
      };
    }

    updateRouletteBadges();
  }

  // --- Initial Setup & Listeners for Roulette ---
  function initRoulette() {
    const btnOpenRoulette = document.getElementById('btnOpenRoulette');
    if (btnOpenRoulette) {
      btnOpenRoulette.addEventListener('click', openRouletteModal);
    }

    const btnCloseModal = document.getElementById('btnCloseRouletteModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeRouletteModal);
    }

    const rouletteModal = document.getElementById('qitchenRouletteModal');
    if (rouletteModal) {
      rouletteModal.addEventListener('click', (e) => {
        if (e.target === rouletteModal) {
          closeRouletteModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && rouletteModal && rouletteModal.classList.contains('open')) {
        closeRouletteModal();
      }
    });

    const btnSpinRoulette = document.getElementById('btnSpinRoulette');
    if (btnSpinRoulette) {
      btnSpinRoulette.addEventListener('click', spinRoulette);
    }

    const claimForm = document.getElementById('rouletteClaimForm');
    if (claimForm) {
      claimForm.addEventListener('submit', handleRouletteClaimSubmit);
    }

    const btnSaveVoucher = document.getElementById('btnSaveVoucher');
    if (btnSaveVoucher) {
      btnSaveVoucher.addEventListener('click', () => {
        closeRouletteModal();
        navigateView('menu');
      });
    }

    const btnCloseCooldownBtn = document.getElementById('btnCloseCooldownBtn');
    if (btnCloseCooldownBtn) {
      btnCloseCooldownBtn.addEventListener('click', () => {
        closeRouletteModal();
        navigateView('menu');
      });
    }

    const btnViewMyVouchers = document.getElementById('btnViewMyVouchers');
    if (btnViewMyVouchers) {
      btnViewMyVouchers.addEventListener('click', () => {
        showCooldownView();
      });
    }

    // Real-time broadcast channel listener
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const syncBc = new BroadcastChannel('mery_sync_channel');
        syncBc.onmessage = (event) => {
          if (event && event.data && event.data.type === 'ROULETTE_SETTINGS_UPDATED') {
            updateRouletteBadges();
            drawRouletteWheel(currentWheelAngle);
          }
        };
      } catch (_) {}
    }

    // Storage event listener
    window.addEventListener('storage', (e) => {
      if (e.key === 'mery_roulette_settings_v1') {
        updateRouletteBadges();
        drawRouletteWheel(currentWheelAngle);
      }
    });

    // Check direct URL hash #roulette or ?ruleta=1
    if (window.location.hash === '#roulette' || searchParams.get('ruleta') === '1') {
      setTimeout(openRouletteModal, 350);
    }

    updateRouletteBadges();
    drawRouletteWheel(currentWheelAngle);
  }

  initRoulette();
});
