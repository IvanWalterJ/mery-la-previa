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
    if (resDniInput) resDniInput.required = isBirthday;
    if (resBirthDateInput) resBirthDateInput.required = isBirthday;
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
        bpProofPreviewImg.src = res.proof_url;
        if (bpProofStatusMsg) {
          bpProofStatusMsg.textContent = res.deposit_status === 'confirmada'
            ? '✓ Seña confirmada por el equipo'
            : '✓ Comprobante recibido — Ya notificamos al equipo';
        }
      } else {
        bpProofPreviewWrap.hidden = true;
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

  // Handle Reservation Form Submission
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName')?.value || '';
      const email = document.getElementById('resEmail')?.value || '';
      const phone = document.getElementById('resPhone')?.value || '';
      const motivo = document.getElementById('resType')?.value || 'Mesa Cena + Previa';
      const guests = document.getElementById('resGuests')?.value || '4';
      const day = document.getElementById('resDay')?.value || 'Viernes 13/11';
      const time = document.getElementById('resTime')?.value || '20:30 hs (Cena)';
      const depositMode = document.getElementById('resDepositMode')?.value || 'con_sena';
      const dni = document.getElementById('resDni')?.value || '';
      const birthDate = document.getElementById('resBirthDate')?.value || '';

      const isBirthday = (motivo === 'Cumpleaños VIP');

      let createdRes = null;
      if (window.MeryStore && typeof window.MeryStore.createReservation === 'function') {
        createdRes = window.MeryStore.createReservation({
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
        });
      }

      if (createdRes) {
        openBoardingPassModal(createdRes);
      }
    });
  }

  // --- Automatic URL Lookup for Customer Portal (?reserva=MLP-XXXX) ---
  const searchParams = new URLSearchParams(window.location.search);
  const reservaParam = searchParams.get('reserva');
  if (reservaParam && window.MeryStore) {
    const list = window.MeryStore.getReservations();
    const found = list.find((r) => r.id.toLowerCase() === reservaParam.trim().toLowerCase());
    if (found) {
      // Dismiss intro curtain immediately
      const curtain = document.getElementById('neonIntroCurtain');
      if (curtain) {
        curtain.classList.add('curtain-out');
        setTimeout(() => curtain.remove(), 400);
      }
      openBoardingPassModal(found);
    }
  }
});
