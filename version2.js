// MERY LA PREVIA — Versión 2 Controller
// V2 Changes:
// - Direct page entry (no neon intro curtain)
// - Complete silence on all videos & views (ice-cube video muted, no synthesized audio)
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

const VIEW_CONFIG = {
  home: {
    title: 'MERY<br />LA PREVIA',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.jpg',
    unmute: false
  },
  menu: {
    title: 'LA CARTA',
    video: 'assets/video/bottle-360-loop.mp4',
    poster: 'assets/img/bottle-hero-isolated.jpg',
    unmute: false
  },
  about: {
    title: 'NOSOTROS<br />MERY JANE',
    video: 'assets/video/ice-cube-1311.mp4',
    poster: 'assets/img/ice-cube-previa.jpg',
    unmute: false
  },
  reservation: {
    title: 'RESERVAS<br />MERY JANE',
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
  const leftHeroTitle = document.getElementById('leftHeroTitle');
  const showcaseVideo = document.getElementById('bottleShowcaseVideo');
  const menuOverlay = document.getElementById('qitchenMenuOverlay');
  const btnOpenOverlay = document.getElementById('btnOpenOverlay');
  const btnCloseOverlay = document.getElementById('btnCloseOverlay');
  const heroSubtag = document.querySelector('.q-hero-subtag');

  // Ensure showcase video starts muted and silent
  if (showcaseVideo) {
    showcaseVideo.muted = true;
    showcaseVideo.volume = 0;
    showcaseVideo.play().catch(() => {});
  }

  // 1. Qitchen Fullscreen Hamburger Menu Overlay Controls
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

  // 3. Render Qitchen /menu Sections + Dynamic Filter Pills + Real-Time Sync
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
  }

  renderFilterPills();
  renderQitchenMenu();

  if (window.MeryStore && typeof window.MeryStore.fetchSectionsFromSupabase === 'function') {
    window.MeryStore.fetchSectionsFromSupabase().then((sections) => {
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

  // 4. Directional Slide View Transition + Left Video Swap (Always Silent)
  let currentView = 'home';

  function updateDOMView(targetView) {
    const cfg = VIEW_CONFIG[targetView] || VIEW_CONFIG.home;

    if (appEl) appEl.setAttribute('data-view', targetView);
    if (leftHeroTitle) leftHeroTitle.innerHTML = cfg.title;

    // Show subtag "Tu noche empieza acá" ONLY on Home view
    if (heroSubtag) {
      heroSubtag.style.display = (targetView === 'home' ? '' : 'none');
    }

    if (showcaseVideo) {
      const currentSrc = showcaseVideo.getAttribute('src');
      if (currentSrc !== cfg.video) {
        showcaseVideo.setAttribute('src', cfg.video);
        showcaseVideo.setAttribute('poster', cfg.poster);
        showcaseVideo.load();
      }
      showcaseVideo.muted = true;
      showcaseVideo.volume = 0;
      showcaseVideo.play().catch(() => {});
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

    const navOrder = ['home', 'menu', 'about', 'reservation'];
    const oldIdx = navOrder.indexOf(currentView);
    const newIdx = navOrder.indexOf(targetView);
    const direction = newIdx >= oldIdx ? 'forward' : 'backward';

    document.documentElement.setAttribute('data-nav-direction', direction);

    const transition = document.startViewTransition(() => {
      updateDOMView(targetView);
    });

    transition.finished.finally(() => {
      document.documentElement.removeAttribute('data-nav-direction');
      scrollToActiveSection();
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
    window.MeryStore.fetchSiteSettingsFromSupabase().then(() => {
      populateReservationOptions();
    }).catch(() => {});
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

  // 7. Original Interactive Roulette Engine (Mery Invita la Previa) + Download Voucher
  const STORAGE_KEY_ROULETTE_DEVICE = 'mery_roulette_device_v1';

  let currentWheelAngle = 0;
  let isRouletteSpinning = false;
  let currentPrizeWon = null;
  let currentIssuedVoucher = null;

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
        { id: 'segui-participando', name: 'Seguí Participando', stock: 999, color: '#261418', probability: 15, condition: '¡Volvé a girar si todavía tenés tiros!' }
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
      const activePrizes = (settings.prizes || []).filter((p) => p.id !== 'segui-participando');
      const totalStock = activePrizes.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
      stockEl.textContent = `${totalStock} disponibles`;
    }

    const spinsBadge = document.getElementById('rouletteSpinsLeftText');
    if (spinsBadge) {
      spinsBadge.textContent = `Tiros: ${spinsLeft} de ${maxSpins}`;
    }

    const countEl = document.getElementById('myVouchersCount');
    if (countEl) {
      countEl.textContent = String((devState.claimedVouchers || []).length);
    }

    const linkWrap = document.getElementById('rouletteMyVouchersLinkWrap');
    if (linkWrap) {
      linkWrap.hidden = (devState.claimedVouchers || []).length === 0;
    }
  }

  function drawRouletteWheel(canvas, prizes, rotationAngle) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;

    ctx.clearRect(0, 0, width, height);
    if (!Array.isArray(prizes) || prizes.length === 0) return;

    const numSlices = prizes.length;
    const arcSize = (2 * Math.PI) / numSlices;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < numSlices; i++) {
      const prize = prizes[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = prize.color || (i % 2 === 0 ? '#e02434' : '#160e12');
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Text label on wheel slice
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Satoshi, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      const label = prize.name || '';
      ctx.fillText(label.length > 18 ? label.slice(0, 16) + '…' : label, radius - 20, 4);
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
    ctx.arc(0, 0, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#e02434';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }

  function openRouletteModal() {
    const modal = document.getElementById('qitchenRouletteModal');
    if (!modal) return;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const settings = getLiveRouletteSettings();
    const devState = getRouletteDeviceState();
    const maxSpins = settings.maxSpinsPerDevice || 3;

    updateRouletteBadges();

    const stageEl = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const voucherCard = document.getElementById('rouletteVoucherCard');
    const cooldownCard = document.getElementById('rouletteCooldownCard');

    if (devState.spinsUsed >= maxSpins) {
      if (stageEl) stageEl.hidden = true;
      if (resultCard) resultCard.hidden = true;
      if (voucherCard) voucherCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = false;
    } else {
      if (stageEl) stageEl.hidden = false;
      if (resultCard) resultCard.hidden = true;
      if (voucherCard) voucherCard.hidden = true;
      if (cooldownCard) cooldownCard.hidden = true;

      const canvas = document.getElementById('rouletteCanvas');
      if (canvas) {
        drawRouletteWheel(canvas, settings.prizes, currentWheelAngle);
      }
    }
  }

  function closeRouletteModal() {
    const modal = document.getElementById('qitchenRouletteModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
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

  // Spin Roulette Logic
  const btnSpin = document.getElementById('btnSpinRoulette');
  if (btnSpin) {
    btnSpin.addEventListener('click', () => {
      if (isRouletteSpinning) return;

      const settings = getLiveRouletteSettings();
      const devState = getRouletteDeviceState();
      const maxSpins = settings.maxSpinsPerDevice || 3;

      if (devState.spinsUsed >= maxSpins) {
        openRouletteModal();
        return;
      }

      isRouletteSpinning = true;
      btnSpin.disabled = true;

      const prizes = settings.prizes || [];
      const numSlices = prizes.length;
      const arcSize = (2 * Math.PI) / numSlices;

      // Select winning slice based on probabilities & stock
      const availablePrizes = prizes.map((p, idx) => ({ ...p, originalIndex: idx }))
        .filter((p) => p.id === 'segui-participando' || (Number(p.stock) || 0) > 0);

      const totalWeight = availablePrizes.reduce((sum, p) => sum + (Number(p.probability) || 10), 0);
      let rand = Math.random() * totalWeight;
      let wonPrize = availablePrizes[0];
      for (const p of availablePrizes) {
        rand -= (Number(p.probability) || 10);
        if (rand <= 0) {
          wonPrize = p;
          break;
        }
      }
      currentPrizeWon = wonPrize;

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

      function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        currentWheelAngle = startAngle + deltaAngle * ease;
        if (canvas) {
          drawRouletteWheel(canvas, prizes, currentWheelAngle);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isRouletteSpinning = false;
          btnSpin.disabled = false;

          // Consume spin
          devState.spinsUsed += 1;
          saveRouletteDeviceState(devState);
          updateRouletteBadges();

          // Show Result
          handleSpinComplete(wonPrize);
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function handleSpinComplete(prize) {
    const stageEl = document.getElementById('rouletteWheelStage');
    const resultCard = document.getElementById('rouletteResultCard');
    const noPrizeCard = document.getElementById('rouletteNoPrizeCard');
    const claimForm = document.getElementById('rouletteClaimForm');
    const kickerEl = resultCard ? resultCard.querySelector('.congrats-kicker') : null;
    const prizeNameEl = document.getElementById('rouletteResultPrizeName');
    const prizeCondEl = document.getElementById('rouletteResultCondition');

    if (stageEl) stageEl.hidden = true;
    if (resultCard) resultCard.hidden = false;

    const isNoPrize = (prize.id === 'segui-participando');

    if (isNoPrize) {
      if (kickerEl) kickerEl.textContent = '★ ¡CASI! SEGUÍ PARTICIPANDO ★';
      if (prizeNameEl) prizeNameEl.textContent = prize.name || 'Seguí Participando';
      if (prizeCondEl) {
        const settings = getLiveRouletteSettings();
        const devState = getRouletteDeviceState();
        const left = Math.max(0, (settings.maxSpinsPerDevice || 3) - devState.spinsUsed);
        prizeCondEl.textContent = left > 0
          ? `Te quedan ${left} tiro${left === 1 ? '' : 's'} hoy. ¡Volvé a girar para llevarte un shot o 2x1!`
          : 'Completaste los tiros disponibles de hoy. ¡Volvé mañana!';
      }
      if (claimForm) claimForm.hidden = true;
      if (noPrizeCard) noPrizeCard.hidden = false;
    } else {
      if (kickerEl) kickerEl.textContent = '★ ¡FELICITACIONES! GANASTE ★';
      if (prizeNameEl) prizeNameEl.textContent = prize.name;
      if (prizeCondEl) prizeCondEl.textContent = prize.condition || 'Válido para canjear hoy en barra';
      if (claimForm) claimForm.hidden = false;
      if (noPrizeCard) noPrizeCard.hidden = true;

      // Prefill previous name/phone if available
      const nameInput = document.getElementById('rouletteClaimName');
      const phoneInput = document.getElementById('rouletteClaimPhone');
      if (nameInput && !nameInput.value) nameInput.value = localStorage.getItem('mery_user_name') || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = localStorage.getItem('mery_user_phone') || '';
    }
  }

  const btnSpinAgain = document.getElementById('btnSpinAgain');
  if (btnSpinAgain) {
    btnSpinAgain.addEventListener('click', () => {
      const stageEl = document.getElementById('rouletteWheelStage');
      const resultCard = document.getElementById('rouletteResultCard');
      if (resultCard) resultCard.hidden = true;
      if (stageEl) stageEl.hidden = false;
      const canvas = document.getElementById('rouletteCanvas');
      const settings = getLiveRouletteSettings();
      if (canvas) drawRouletteWheel(canvas, settings.prizes, currentWheelAngle);
    });
  }

  // Claim Prize Form (Dispatches via Evolution API via MeryStore.claimRoulettePrize)
  const claimForm = document.getElementById('rouletteClaimForm');
  if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
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

      let voucher = null;

      if (window.MeryStore && typeof window.MeryStore.claimRoulettePrize === 'function') {
        const res = window.MeryStore.claimRoulettePrize(currentPrizeWon.id, { name, phone });
        if (res && res.success) {
          voucher = res.voucher;
        }
      }

      if (!voucher) {
        const code = 'PREVIA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        voucher = {
          code,
          prizeId: currentPrizeWon.id,
          prizeName: currentPrizeWon.name,
          condition: currentPrizeWon.condition,
          clientName: name,
          clientPhone: phone,
          claimedAt: new Date().toISOString(),
          status: 'valido'
        };
      }

      currentIssuedVoucher = voucher;

      const devState = getRouletteDeviceState();
      if (!Array.isArray(devState.claimedVouchers)) devState.claimedVouchers = [];
      devState.claimedVouchers.push(voucher);
      saveRouletteDeviceState(devState);
      updateRouletteBadges();

      // Show voucher card
      const resultCard = document.getElementById('rouletteResultCard');
      const voucherCard = document.getElementById('rouletteVoucherCard');
      if (resultCard) resultCard.hidden = true;
      if (voucherCard) voucherCard.hidden = false;

      const codeEl = document.getElementById('voucherCode');
      const prizeEl = document.getElementById('voucherPrize');
      const clientEl = document.getElementById('voucherClient');
      const condEl = document.getElementById('voucherCondition');
      const waNotice = document.getElementById('voucherWaNotice');

      if (codeEl) codeEl.textContent = voucher.code;
      if (prizeEl) prizeEl.textContent = voucher.prizeName;
      if (clientEl) clientEl.textContent = voucher.clientName;
      if (condEl) condEl.textContent = voucher.condition;
      if (waNotice) {
        waNotice.hidden = false;
        waNotice.style.display = 'inline-flex';
      }

      const shareBtn = document.getElementById('btnShareVoucherWhatsapp');
      if (shareBtn) {
        const issueDate = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const issueTime = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        const waText =
          `*MERY JANE · LA PREVIA — CUPÓN DIGITAL EXCLUSIVO*\n\n` +
          `¡Felicitaciones, ${voucher.clientName}! Tu premio obtenido en la Ruleta de La Previa ya está emitido y registrado en el sistema del bar con código de seguridad único.\n\n` +
          `• *CÓDIGO DE VALIDACIÓN:* *${voucher.code}*\n` +
          `• *BENEFICIO:* *${voucher.prizeName}*\n` +
          `• *TITULAR:* ${voucher.clientName}\n` +
          `• *CONDICIÓN DE USO:* ${voucher.condition}\n` +
          `• *FECHA DE EMISIÓN:* ${issueDate} a las ${issueTime} hs\n\n` +
          `*CLÁUSULA DE SEGURIDAD Y CANJE:*\n` +
          `1. Este cupón digital es personal, intransferible y de un solo uso.\n` +
          `2. Mostrá este mensaje o tu pantalla al mozo o en la barra al momento de ordenar.\n` +
          `3. Al canjearse, el código queda registrado como utilizado en el sistema del bar y se invalida automáticamente.\n\n` +
          `*Ubicación:* Calle 101 Nº 85, Guernica.\n` +
          `*Tu noche empieza acá.*`;

        shareBtn.onclick = () => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank', 'noopener,noreferrer');
        };
      }
    });
  }

  // --- Download Voucher as Image (Canvas Generation) ---
  function downloadVoucherImage(voucher) {
    if (!voucher) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, '#160e12');
    bgGrad.addColorStop(0.5, '#0d0a0b');
    bgGrad.addColorStop(1, '#1a0b10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Outer border
    ctx.strokeStyle = '#e02434';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 752, 952);

    // Inner subtle gold border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 728, 928);

    // Header Tag
    ctx.fillStyle = '#e02434';
    ctx.font = 'bold 22px Satoshi, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MERY JANE • LA PREVIA', 400, 95);

    ctx.fillStyle = '#d4af37';
    ctx.font = '600 14px Satoshi, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('★ CUPÓN DIGITAL OFICIAL ★', 400, 125);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 160);
    ctx.lineTo(720, 160);
    ctx.stroke();

    // Code Box
    ctx.fillStyle = 'rgba(224, 36, 52, 0.08)';
    ctx.fillRect(100, 195, 600, 110);
    ctx.strokeStyle = '#e02434';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 195, 600, 110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 15px Satoshi, sans-serif';
    ctx.fillText('CÓDIGO DE VALIDACIÓN', 400, 230);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px Satoshi, sans-serif';
    ctx.fillText(voucher.code, 400, 285);

    // Prize
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '600 16px Satoshi, sans-serif';
    ctx.fillText('BENEFICIO GANADO', 400, 365);

    ctx.fillStyle = '#e02434';
    ctx.font = 'bold 36px Bodoni Moda, serif';
    ctx.fillText(voucher.prizeName, 400, 420);

    // Condition
    ctx.fillStyle = 'rgba(251, 247, 238, 0.85)';
    ctx.font = '500 20px Satoshi, sans-serif';
    ctx.fillText(voucher.condition || 'Válido para canjear hoy en el local', 400, 470);

    // Tear line simulation
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(50, 540);
    ctx.lineTo(750, 540);
    ctx.stroke();
    ctx.setLineDash([]);

    // Details Grid
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 14px Satoshi, sans-serif';
    ctx.fillText('TITULAR', 100, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Satoshi, sans-serif';
    ctx.fillText(voucher.clientName, 100, 635);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 14px Satoshi, sans-serif';
    ctx.fillText('FECHA DE EMISIÓN', 100, 695);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Satoshi, sans-serif';
    const dateStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';
    ctx.fillText(dateStr, 100, 730);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 14px Satoshi, sans-serif';
    ctx.fillText('UBICACIÓN', 100, 790);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Satoshi, sans-serif';
    ctx.fillText('Calle 101 Nº 85 • Guernica, Buenos Aires', 100, 825);

    // Footer Security Notice
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(224, 36, 52, 0.9)';
    ctx.font = 'bold 13px Satoshi, sans-serif';
    ctx.fillText('● CUPÓN DE UN SOLO USO • INTRANSFERIBLE • VERIFICADO POR SISTEMA', 400, 900);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px Satoshi, sans-serif';
    ctx.fillText('Presentá esta imagen en la barra o a tu mozo al momento de ordenar.', 400, 930);

    // Convert to PNG and Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Cupon-Mery-La-Previa-${voucher.code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const btnDownloadVoucher = document.getElementById('btnDownloadVoucher');
  if (btnDownloadVoucher) {
    btnDownloadVoucher.addEventListener('click', () => {
      if (currentIssuedVoucher) {
        downloadVoucherImage(currentIssuedVoucher);
      } else {
        const devState = getRouletteDeviceState();
        const lastVoucher = devState.claimedVouchers && devState.claimedVouchers.length > 0
          ? devState.claimedVouchers[devState.claimedVouchers.length - 1]
          : null;
        if (lastVoucher) downloadVoucherImage(lastVoucher);
      }
    });
  }

  const btnDismissVoucher = document.getElementById('btnDismissVoucher');
  if (btnDismissVoucher) {
    btnDismissVoucher.addEventListener('click', closeRouletteModal);
  }

  const btnCloseCooldownBtn = document.getElementById('btnCloseCooldownBtn');
  if (btnCloseCooldownBtn) {
    btnCloseCooldownBtn.addEventListener('click', () => {
      closeRouletteModal();
      navigateView('menu');
    });
  }
});
