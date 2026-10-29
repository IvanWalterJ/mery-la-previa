// Mery La Previa — Fast Self-Managed Admin Controller (0ms Optimistic UI + Left Sidebar + Unified Custom Popups)
const SESSION_AUTH_KEY = 'mery_admin_authenticated_v1';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('adminLoginScreen');
  const dashboardScreen = document.getElementById('adminDashboardScreen');
  const loginForm = document.getElementById('adminLoginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnLogout = document.getElementById('btnLogout');

  const categoryPillsEl = document.getElementById('adminCategoryPills');
  const activeCategoryTitle = document.getElementById('activeCategoryTitle');
  const activeCategoryCount = document.getElementById('activeCategoryCount');
  const btnRenameActiveCat = document.getElementById('btnRenameActiveCat');
  const btnDeleteActiveCat = document.getElementById('btnDeleteActiveCat');
  const btnNewDish = document.getElementById('btnNewDish');
  const btnNavVideos = document.getElementById('btnNavVideos');
  const adminSearchInput = document.getElementById('adminSearchInput');
  const sectionsContainer = document.getElementById('adminSectionsContainer');
  const toastEl = document.getElementById('adminToast');

  // Mobile Drawer & Topbar controls
  const btnAdminMobileMenu = document.getElementById('btnAdminMobileMenu');
  const adminSidebar = document.getElementById('adminSidebar');
  const adminSidebarBackdrop = document.getElementById('adminSidebarBackdrop');

  function toggleAdminMobileMenu(forceState) {
    if (!adminSidebar) return;
    const shouldOpen = typeof forceState === 'boolean'
      ? forceState
      : !adminSidebar.classList.contains('mobile-open');
    adminSidebar.classList.toggle('mobile-open', shouldOpen);
    if (adminSidebarBackdrop) {
      adminSidebarBackdrop.hidden = !shouldOpen;
    }
    if (btnAdminMobileMenu) {
      btnAdminMobileMenu.setAttribute('aria-expanded', String(shouldOpen));
      btnAdminMobileMenu.classList.toggle('is-active', shouldOpen);
    }
  }

  function closeAdminMobileMenu() {
    toggleAdminMobileMenu(false);
  }

  if (btnAdminMobileMenu) {
    btnAdminMobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAdminMobileMenu();
    });
  }

  if (adminSidebarBackdrop) {
    adminSidebarBackdrop.addEventListener('click', () => {
      closeAdminMobileMenu();
    });
  }

  document.addEventListener('click', (e) => {
    if (!adminSidebar || !adminSidebar.classList.contains('mobile-open')) return;
    if (!adminSidebar.contains(e.target) && !btnAdminMobileMenu?.contains(e.target)) {
      closeAdminMobileMenu();
    }
  });

  // Item Modal controls
  const itemModal = document.getElementById('adminItemModal');
  const itemModalHeading = document.getElementById('itemModalHeading');
  const itemForm = document.getElementById('adminItemForm');
  const itemFormId = document.getElementById('itemFormId');
  const itemFormCategory = document.getElementById('itemFormCategory');
  const itemFormPrice = document.getElementById('itemFormPrice');
  const itemFormName = document.getElementById('itemFormName');
  const itemFormBadge = document.getElementById('itemFormBadge');
  const itemPhotoCropStage = document.getElementById('itemPhotoCropStage');
  const itemFormPreview = document.getElementById('itemFormPreview');
  const itemFormFile = document.getElementById('itemFormFile');
  const itemFormImageUrl = document.getElementById('itemFormImageUrl');
  const itemFormImagePos = document.getElementById('itemFormImagePos');
  const btnResetImagePos = document.getElementById('btnResetImagePos');
  const itemFormShortDesc = document.getElementById('itemFormShortDesc');
  const itemFormDetailCopy = document.getElementById('itemFormDetailCopy');
  const itemFormPairing = document.getElementById('itemFormPairing');
  const itemFormTags = document.getElementById('itemFormTags');

  // Category Modal controls
  const categoryModal = document.getElementById('adminCategoryModal');
  const catModalHeading = document.getElementById('catModalHeading');
  const categoryForm = document.getElementById('adminCategoryForm');
  const catFormSlug = document.getElementById('catFormSlug');
  const catFormTitle = document.getElementById('catFormTitle');

  // Unified Custom Confirmation Modal controls
  const confirmModal = document.getElementById('adminConfirmModal');
  const confirmModalHeading = document.getElementById('confirmModalHeading');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const btnCloseConfirmModal = document.getElementById('btnCloseConfirmModal');
  const btnCancelConfirmModal = document.getElementById('btnCancelConfirmModal');
  const btnAcceptConfirmModal = document.getElementById('btnAcceptConfirmModal');

  let menuSections = window.MeryStore.getLocalSections();
  let activeCategoryId = menuSections[0]?.id || 'cocktails';
  let activeTab = 'category'; // 'category' | 'videos'
  let searchQuery = '';
  let toastTimer = null;
  let pendingConfirmCallback = null;

  // Draggable photo repositioning / framing logic
  let isDraggingCrop = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let cropStartPosX = 50;
  let cropStartPosY = 50;

  function parseImagePosition(posStr) {
    if (!posStr) return { x: 50, y: 50 };
    const parts = String(posStr).split(/\s+/);
    const x = parseFloat(parts[0]) || 50;
    const y = parseFloat(parts[1]) || 50;
    return { x, y };
  }

  function setImagePosition(x, y) {
    const clampedX = Math.round(Math.min(100, Math.max(0, x)));
    const clampedY = Math.round(Math.min(100, Math.max(0, y)));
    const val = `${clampedX}% ${clampedY}%`;
    if (itemFormImagePos) itemFormImagePos.value = val;
    if (itemFormPreview) itemFormPreview.style.objectPosition = val;
  }

  if (itemPhotoCropStage) {
    itemPhotoCropStage.addEventListener('pointerdown', (e) => {
      isDraggingCrop = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const current = parseImagePosition(itemFormImagePos?.value || '50% 50%');
      cropStartPosX = current.x;
      cropStartPosY = current.y;
      itemPhotoCropStage.classList.add('is-dragging');
      try {
        itemPhotoCropStage.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    itemPhotoCropStage.addEventListener('pointermove', (e) => {
      if (!isDraggingCrop) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const rect = itemPhotoCropStage.getBoundingClientRect();
      const stageW = rect.width || 128;
      const stageH = rect.height || 96;
      const nextX = cropStartPosX - (dx / stageW) * 100;
      const nextY = cropStartPosY - (dy / stageH) * 100;
      setImagePosition(nextX, nextY);
    });

    const stopCropDrag = (e) => {
      if (!isDraggingCrop) return;
      isDraggingCrop = false;
      itemPhotoCropStage.classList.remove('is-dragging');
      try {
        if (e && e.pointerId) itemPhotoCropStage.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    itemPhotoCropStage.addEventListener('pointerup', stopCropDrag);
    itemPhotoCropStage.addEventListener('pointercancel', stopCropDrag);
  }

  if (btnResetImagePos) {
    btnResetImagePos.addEventListener('click', () => {
      setImagePosition(50, 50);
      showToast('Encuadre centrado (50% 50%)');
    });
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  // 1. UNIFIED VISUAL CONFIRMATION POPUP (Custom modal for logout & delete)
  function openConfirmModal({ title, message, confirmLabel = 'Confirmar', onConfirm }) {
    if (!confirmModal) return;
    if (confirmModalHeading) confirmModalHeading.textContent = title || 'Confirmar acción';
    if (confirmModalMessage) confirmModalMessage.textContent = message || '¿Querés continuar?';
    if (btnAcceptConfirmModal) btnAcceptConfirmModal.textContent = confirmLabel;
    pendingConfirmCallback = typeof onConfirm === 'function' ? onConfirm : null;
    confirmModal.hidden = false;
  }

  function closeConfirmModal() {
    if (!confirmModal) return;
    confirmModal.hidden = true;
    pendingConfirmCallback = null;
  }

  if (btnCloseConfirmModal) btnCloseConfirmModal.addEventListener('click', closeConfirmModal);
  if (btnCancelConfirmModal) btnCancelConfirmModal.addEventListener('click', closeConfirmModal);
  if (btnAcceptConfirmModal) {
    btnAcceptConfirmModal.addEventListener('click', () => {
      const fn = pendingConfirmCallback;
      closeConfirmModal();
      if (fn) fn();
    });
  }

  // Close any open modal on Escape or backdrop click
  [itemModal, categoryModal, confirmModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmModal && !confirmModal.hidden) closeConfirmModal();
      else if (itemModal && !itemModal.hidden) closeItemModal();
      else if (categoryModal && !categoryModal.hidden) closeCategoryModal();
    }
  });

  // 2. AUTHENTICATION FLOW (Instant entry + custom logout confirmation)
  function enterDashboard() {
    loginScreen.hidden = true;
    dashboardScreen.hidden = false;
    if (!menuSections.some((s) => s.id === activeCategoryId) && menuSections.length > 0) {
      activeCategoryId = menuSections[0].id;
    }
    renderAdminSidebar();
    renderActiveCategoryWorkspace();

    // Background non-blocking sync if remote backend is configured
    window.MeryStore.fetchMenuSections().then((fresh) => {
      if (Array.isArray(fresh) && fresh.length > 0) {
        menuSections = fresh;
        if (!menuSections.some((s) => s.id === activeCategoryId)) {
          activeCategoryId = menuSections[0].id;
        }
        renderAdminSidebar();
        renderActiveCategoryWorkspace();
      }
    }).catch(() => {});
  }

  if (sessionStorage.getItem(SESSION_AUTH_KEY) === 'true') {
    enterDashboard();
  } else {
    const client = window.MeryStore.getClient();
    if (client) {
      client.auth.getSession().then(({ data }) => {
        if (data && data.session) enterDashboard();
      }).catch(() => {});
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginErrorMsg) loginErrorMsg.hidden = true;

      const email = (loginEmail?.value || '').trim();
      const password = loginPassword?.value || '';
      if (!email || !password) return;

      const client = window.MeryStore.getClient();
      if (client) {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
          if (loginErrorMsg) {
            loginErrorMsg.textContent = 'Correo o contraseña incorrectos.';
            loginErrorMsg.hidden = false;
          }
          return;
        }
      }

      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      enterDashboard();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      closeAdminMobileMenu();
      openConfirmModal({
        title: '¿Cerrar sesión?',
        message: 'Vas a salir del panel de administración de Mery La Previa.',
        confirmLabel: 'Sí, cerrar sesión',
        onConfirm: () => {
          sessionStorage.removeItem(SESSION_AUTH_KEY);
          dashboardScreen.hidden = true;
          loginScreen.hidden = false;
          const client = window.MeryStore.getClient();
          if (client) client.auth.signOut().catch(() => {});
        }
      });
    });
  }

  // 3. 0ms INSTANT OPTIMISTIC PERSISTENCE (No blocking loops!)
  function commitChangesInstant(toastMessage) {
    window.MeryStore.saveLocalSections(menuSections, true);
    renderAdminSidebar();
    renderActiveCategoryWorkspace();
    if (toastMessage) showToast(toastMessage);
  }

  window.MeryStore.subscribeToMenuChanges((updatedSections) => {
    if (Array.isArray(updatedSections) && updatedSections.length > 0) {
      menuSections = updatedSections;
      if (!menuSections.some((s) => s.id === activeCategoryId)) {
        activeCategoryId = menuSections[0]?.id || '';
      }
      renderAdminSidebar();
      renderActiveCategoryWorkspace();
    }
  });

  // 4. LEFT SIDEBAR & FOCUSED SINGLE-CATEGORY WORKSPACE
  function renderAdminSidebar() {
    if (!categoryPillsEl) return;

    categoryPillsEl.innerHTML = menuSections.map((sec) => {
      const count = (sec.items || []).length;
      const isActive = sec.id === activeCategoryId;
      return `
        <button
          type="button"
          class="admin-cat-pill ${isActive ? 'active' : ''}"
          data-cat="${escapeHtml(sec.id)}"
          role="tab"
          aria-selected="${isActive}"
        >
          <span>${escapeHtml(sec.title)}</span>
          <span class="admin-cat-pill-count">${count}</span>
        </button>
      `;
    }).join('');

    categoryPillsEl.querySelectorAll('.admin-cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = 'category';
        btnNavVideos?.classList.remove('active');
        activeCategoryId = btn.getAttribute('data-cat') || menuSections[0]?.id;
        renderAdminSidebar();
        renderActiveCategoryWorkspace();
        closeAdminMobileMenu();
      });
    });
  }

  if (btnNavVideos) {
    btnNavVideos.addEventListener('click', () => {
      activeTab = 'videos';
      categoryPillsEl?.querySelectorAll('.admin-cat-pill').forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      btnNavVideos.classList.add('active');
      renderVideosWorkspace();
      closeAdminMobileMenu();
    });
  }

  if (adminSearchInput) {
    adminSearchInput.addEventListener('input', () => {
      searchQuery = adminSearchInput.value.trim().toLowerCase();
      renderActiveCategoryWorkspace();
    });
  }

  function renderActiveCategoryWorkspace() {
    if (!sectionsContainer) return;
    activeTab = 'category';
    btnNavVideos?.classList.remove('active');
    if (btnRenameActiveCat) btnRenameActiveCat.hidden = false;
    if (btnNewDish) btnNewDish.hidden = false;
    if (adminSearchInput?.parentElement) adminSearchInput.parentElement.hidden = false;

    const sec = menuSections.find((s) => s.id === activeCategoryId) || menuSections[0];

    if (!sec) {
      if (activeCategoryTitle) activeCategoryTitle.textContent = 'Sin categorías';
      if (activeCategoryCount) activeCategoryCount.textContent = 'Creá una categoría desde el panel izquierdo';
      sectionsContainer.innerHTML = '';
      return;
    }

    activeCategoryId = sec.id;
    const allItems = sec.items || [];
    const filteredItems = searchQuery
      ? allItems.filter((it) =>
          (it.name || '').toLowerCase().includes(searchQuery) ||
          (it.desc || '').toLowerCase().includes(searchQuery)
        )
      : allItems;

    if (activeCategoryTitle) activeCategoryTitle.textContent = sec.title;
    if (activeCategoryCount) {
      activeCategoryCount.textContent = `${allItems.length} ${allItems.length === 1 ? 'ítem cargado' : 'ítems cargados'} en esta categoría`;
    }
    if (btnDeleteActiveCat) {
      btnDeleteActiveCat.hidden = menuSections.length <= 1;
    }

    if (filteredItems.length === 0) {
      sectionsContainer.innerHTML = `
        <div class="admin-empty-state">
          <p>${searchQuery ? 'No se encontraron ítems con esa búsqueda.' : 'Todavía no hay ítems en esta categoría.'}</p>
          <button type="button" class="admin-btn-gold" id="btnEmptyAddDish">+ Agregar primer ítem</button>
        </div>
      `;
      document.getElementById('btnEmptyAddDish')?.addEventListener('click', () => openItemModal(sec.id, null));
      return;
    }

    sectionsContainer.innerHTML = `
      <div class="admin-items-grid">
        ${filteredItems.map((item) => `
          <article class="admin-item-card ${item.available === false ? 'unavailable' : ''}" data-item-id="${escapeHtml(item.id)}">
            <div class="admin-item-top">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="admin-item-thumb" style="object-position: ${item.imagePosition || '50% 50%'};" decoding="async" />
              <div class="admin-item-info">
                <h3 class="admin-item-title">
                  ${escapeHtml(item.name)}
                  <span class="admin-item-badge">${escapeHtml(item.badge || '★')}</span>
                </h3>
                <p class="admin-item-desc">${escapeHtml(item.desc)}</p>
              </div>
            </div>

            <div class="admin-quick-price-row">
              <div class="admin-quick-price-group">
                <span class="admin-quick-price-label">Precio</span>
                <input
                  type="text"
                  class="admin-quick-price-input"
                  value="${escapeHtml(item.price)}"
                  aria-label="Precio de ${escapeHtml(item.name)}"
                />
              </div>
              <button
                type="button"
                class="admin-btn-quick-save"
                data-action="quick-price"
                data-sec-id="${escapeHtml(sec.id)}"
                data-item-id="${escapeHtml(item.id)}"
              >
                Guardar precio
              </button>
            </div>

            <div class="admin-item-actions">
              <button
                type="button"
                class="admin-availability-btn ${item.available !== false ? 'on' : ''}"
                data-action="toggle-avail"
                data-sec-id="${escapeHtml(sec.id)}"
                data-item-id="${escapeHtml(item.id)}"
              >
                ${item.available !== false ? '● Disponible' : '○ Agotado'}
              </button>

              <div style="display:flex; gap:8px;">
                <button
                  type="button"
                  class="admin-btn-outline"
                  data-action="edit-item"
                  data-sec-id="${escapeHtml(sec.id)}"
                  data-item-id="${escapeHtml(item.id)}"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="admin-btn-outline admin-btn-danger"
                  data-action="delete-item"
                  data-sec-id="${escapeHtml(sec.id)}"
                  data-item-id="${escapeHtml(item.id)}"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    // Instant Quick Price Save (also supports Enter key inside the price input)
    sectionsContainer.querySelectorAll('.admin-quick-price-input').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.closest('.admin-quick-price-row')?.querySelector('[data-action="quick-price"]')?.click();
        }
      });
    });

    sectionsContainer.querySelectorAll('[data-action="quick-price"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const card = btn.closest('.admin-item-card');
        const input = card?.querySelector('.admin-quick-price-input');
        if (!input) return;

        let rawPrice = input.value.trim();
        if (!rawPrice) return;
        if (!rawPrice.startsWith('$')) rawPrice = `$${rawPrice}`;
        input.value = rawPrice;

        const targetSec = menuSections.find((s) => s.id === secId);
        const item = targetSec?.items.find((i) => i.id === itemId);
        if (!item) return;

        item.price = rawPrice;
        window.MeryStore.saveLocalSections(menuSections, true);
        showToast(`Precio de "${item.name}" actualizado a ${rawPrice}`);

        const client = window.MeryStore.getClient();
        if (client) {
          client.from('menu_items').update({ price: rawPrice, updated_at: new Date().toISOString() }).eq('id', itemId).then(() => {}).catch(() => {});
        }
      });
    });

    sectionsContainer.querySelectorAll('[data-action="toggle-avail"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const targetSec = menuSections.find((s) => s.id === secId);
        const item = targetSec?.items.find((i) => i.id === itemId);
        if (!item) return;

        item.available = item.available === false;
        const card = btn.closest('.admin-item-card');
        if (card) card.classList.toggle('unavailable', !item.available);
        btn.classList.toggle('on', item.available);
        btn.textContent = item.available ? '● Disponible' : '○ Agotado';

        window.MeryStore.saveLocalSections(menuSections, true);
        showToast(item.available ? `"${item.name}" disponible en la carta` : `"${item.name}" marcado como agotado`);

        const client = window.MeryStore.getClient();
        if (client) {
          client.from('menu_items').update({ available: item.available, updated_at: new Date().toISOString() }).eq('id', itemId).then(() => {}).catch(() => {});
        }
      });
    });

    sectionsContainer.querySelectorAll('[data-action="edit-item"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const targetSec = menuSections.find((s) => s.id === secId);
        const item = targetSec?.items.find((i) => i.id === itemId);
        if (targetSec && item) openItemModal(targetSec.id, item);
      });
    });

    sectionsContainer.querySelectorAll('[data-action="delete-item"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const targetSec = menuSections.find((s) => s.id === secId);
        const item = targetSec?.items.find((i) => i.id === itemId);
        if (!targetSec || !item) return;

        openConfirmModal({
          title: '¿Eliminar ítem de la carta?',
          message: `Vas a eliminar "${item.name}" de la categoría "${targetSec.title}". Esta acción impacta al instante en la carta pública.`,
          confirmLabel: 'Sí, eliminar ítem',
          onConfirm: () => {
            targetSec.items = targetSec.items.filter((i) => i.id !== itemId);
            commitChangesInstant(`"${item.name}" fue eliminado`);
            const client = window.MeryStore.getClient();
            if (client) {
              client.from('menu_items').delete().eq('id', itemId).then(() => {}).catch(() => {});
            }
          }
        });
      });
    });
  }

  // Active Category Header Actions
  if (btnRenameActiveCat) {
    btnRenameActiveCat.addEventListener('click', () => {
      const sec = menuSections.find((s) => s.id === activeCategoryId);
      if (sec) openCategoryModal(sec);
    });
  }

  if (btnDeleteActiveCat) {
    btnDeleteActiveCat.addEventListener('click', () => {
      const sec = menuSections.find((s) => s.id === activeCategoryId);
      if (!sec || menuSections.length <= 1) return;

      openConfirmModal({
        title: '¿Eliminar categoría completa?',
        message: `Vas a eliminar la categoría "${sec.title}" junto con sus ${(sec.items || []).length} ítems.`,
        confirmLabel: 'Sí, eliminar categoría',
        onConfirm: () => {
          menuSections = menuSections.filter((s) => s.id !== sec.id);
          activeCategoryId = menuSections[0]?.id || '';
          commitChangesInstant(`Categoría "${sec.title}" eliminada`);
          const client = window.MeryStore.getClient();
          if (client) {
            client.from('menu_categories').delete().eq('slug', sec.id).then(() => {}).catch(() => {});
          }
        }
      });
    });
  }

  // 4b. SECTION VIDEOS MANAGEMENT WORKSPACE (Intro Neon, Bottle 360°, Previa 13/11)
  const SECTION_VIDEO_CONFIGS = [
    {
      key: 'intro',
      title: 'Video de inicio (Cartel Neón)',
      desc: 'Se reproduce en el telón de apertura inicial con sonido al hacer clic en INGRESAR.',
      defaultUrl: 'assets/video/neon-intro-mery.mp4'
    },
    {
      key: 'main',
      title: 'Video principal y La Carta (Botella 360°)',
      desc: 'Video en bucle que acompaña la portada de inicio, el menú y la vista de reservas.',
      defaultUrl: 'assets/video/bottle-360-loop.mp4'
    },
    {
      key: 'previa',
      title: 'Video sección La Previa 13/11',
      desc: 'Video ambientado con sonido que se activa en la sección "Tenemos Previa 13/11".',
      defaultUrl: 'assets/video/ice-cube-1311.mp4'
    }
  ];

  async function renderVideosWorkspace() {
    if (!sectionsContainer) return;
    activeTab = 'videos';

    if (activeCategoryTitle) activeCategoryTitle.textContent = 'Videos de secciones';
    if (activeCategoryCount) {
      activeCategoryCount.textContent = '3 videos configurables para la experiencia inmersiva';
    }
    if (btnRenameActiveCat) btnRenameActiveCat.hidden = true;
    if (btnDeleteActiveCat) btnDeleteActiveCat.hidden = true;
    if (btnNewDish) btnNewDish.hidden = true;
    if (adminSearchInput?.parentElement) adminSearchInput.parentElement.hidden = true;

    let currentVideos = {
      intro: 'assets/video/neon-intro-mery.mp4',
      main: 'assets/video/bottle-360-loop.mp4',
      previa: 'assets/video/ice-cube-1311.mp4'
    };

    if (window.MeryStore && typeof window.MeryStore.getSiteVideos === 'function') {
      try {
        currentVideos = await window.MeryStore.getSiteVideos();
      } catch (_) {}
    }

    sectionsContainer.innerHTML = `
      <div class="admin-videos-grid">
        ${SECTION_VIDEO_CONFIGS.map((slot) => {
          const videoSrc = currentVideos[slot.key] || slot.defaultUrl;
          return `
            <article class="admin-video-card" data-slot="${escapeHtml(slot.key)}">
              <div class="admin-video-preview-wrap">
                <video
                  class="admin-video-player"
                  src="${escapeHtml(videoSrc)}"
                  muted
                  loop
                  playsinline
                  preload="metadata"
                ></video>
              </div>

              <div class="admin-video-meta">
                <h3 class="admin-video-title">${escapeHtml(slot.title)}</h3>
                <p class="admin-video-desc">${escapeHtml(slot.desc)}</p>
              </div>

              <div class="admin-video-actions">
                <label for="videoFile_${escapeHtml(slot.key)}" class="admin-btn-outline admin-upload-label">
                  Subir o cambiar video
                </label>
                <input
                  type="file"
                  id="videoFile_${escapeHtml(slot.key)}"
                  accept="video/mp4,video/webm"
                  data-slot="${escapeHtml(slot.key)}"
                  hidden
                />
                <button
                  type="button"
                  class="admin-btn-outline"
                  data-action="restore-video"
                  data-slot="${escapeHtml(slot.key)}"
                >
                  Restaurar original
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    // Start video playback safely in background previews
    sectionsContainer.querySelectorAll('.admin-video-player').forEach((v) => {
      v.play().catch(() => {});
    });

    // Upload video handler
    sectionsContainer.querySelectorAll('input[type="file"][data-slot]').forEach((input) => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        const slotKey = input.getAttribute('data-slot');
        const slotConfig = SECTION_VIDEO_CONFIGS.find((s) => s.key === slotKey);
        if (!file || !slotKey) return;

        showToast('Subiendo y optimizando video...');
        try {
          const res = await window.MeryStore.uploadSectionVideo(slotKey, file);
          if (res && res.url) {
            const card = input.closest('.admin-video-card');
            const videoEl = card?.querySelector('.admin-video-player');
            if (videoEl) {
              videoEl.src = res.url;
              videoEl.load();
              videoEl.play().catch(() => {});
            }
            showToast(`Video de "${slotConfig?.title || slotKey}" actualizado`);
          }
        } catch (err) {
          showToast('Error al procesar el video: ' + (err.message || 'formato no soportado'));
        }
      });
    });

    // Restore original video confirmation handler
    sectionsContainer.querySelectorAll('[data-action="restore-video"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slotKey = btn.getAttribute('data-slot');
        const slotConfig = SECTION_VIDEO_CONFIGS.find((s) => s.key === slotKey);
        if (!slotConfig) return;

        openConfirmModal({
          title: '¿Restaurar video original?',
          message: `Vas a restablecer el video por defecto para "${slotConfig.title}". Esta acción impacta al instante en la web pública.`,
          confirmLabel: 'Sí, restaurar',
          onConfirm: async () => {
            try {
              if (window.MeryStore && typeof window.MeryStore.restoreSectionVideo === 'function') {
                const res = await window.MeryStore.restoreSectionVideo(slotKey);
                const card = btn.closest('.admin-video-card');
                const videoEl = card?.querySelector('.admin-video-player');
                if (videoEl) {
                  videoEl.src = res.url || slotConfig.defaultUrl;
                  videoEl.load();
                  videoEl.play().catch(() => {});
                }
                showToast(`Video de "${slotConfig.title}" restaurado`);
              }
            } catch (err) {
              showToast('No se pudo restaurar el video');
            }
          }
        });
      });
    });
  }

  // 5. ITEM MODAL (Create / Edit Dish + Clean Photo Upload)
  function populateCategorySelect(selectedId) {
    if (!itemFormCategory) return;
    itemFormCategory.innerHTML = menuSections
      .map((sec) => `<option value="${escapeHtml(sec.id)}" ${sec.id === selectedId ? 'selected' : ''}>${escapeHtml(sec.title)}</option>`)
      .join('');
  }

  function openItemModal(defaultCatId, item) {
    const targetCat = defaultCatId || activeCategoryId || menuSections[0]?.id || 'cocktails';
    populateCategorySelect(targetCat);

    if (item) {
      itemModalHeading.textContent = `Editar: ${item.name}`;
      itemFormId.value = item.id;
      itemFormPrice.value = item.price || '';
      itemFormName.value = item.name || '';
      itemFormBadge.value = item.badge || '★';
      itemFormImageUrl.value = item.image || 'assets/img/ice-cube-previa.jpg';
      itemFormPreview.src = item.image || 'assets/img/ice-cube-previa.jpg';
      const pos = item.imagePosition || '50% 50%';
      if (itemFormImagePos) itemFormImagePos.value = pos;
      if (itemFormPreview) itemFormPreview.style.objectPosition = pos;
      itemFormShortDesc.value = item.desc || '';
      itemFormDetailCopy.value = item.detailCopy || item.desc || '';
      itemFormPairing.value = item.pairing || '';
      itemFormTags.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    } else {
      itemModalHeading.textContent = 'Agregar nuevo ítem';
      itemFormId.value = '';
      itemFormPrice.value = '';
      itemFormName.value = '';
      itemFormBadge.value = '★';
      itemFormImageUrl.value = 'assets/img/ice-cube-previa.jpg';
      itemFormPreview.src = 'assets/img/ice-cube-previa.jpg';
      if (itemFormImagePos) itemFormImagePos.value = '50% 50%';
      if (itemFormPreview) itemFormPreview.style.objectPosition = '50% 50%';
      itemFormShortDesc.value = '';
      itemFormDetailCopy.value = '';
      itemFormPairing.value = '';
      itemFormTags.value = 'Especialidad de la casa, Mery La Previa';
    }

    if (itemFormFile) itemFormFile.value = '';
    itemModal.hidden = false;
  }

  function closeItemModal() {
    itemModal.hidden = true;
  }

  document.getElementById('btnNewDish')?.addEventListener('click', () => {
    openItemModal(activeCategoryId, null);
  });
  document.getElementById('btnCloseItemModal')?.addEventListener('click', closeItemModal);
  document.getElementById('btnCancelItemModal')?.addEventListener('click', closeItemModal);

  if (itemFormFile) {
    itemFormFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const uploadedUrl = await window.MeryStore.uploadDishImage(file);
        itemFormImageUrl.value = uploadedUrl;
        itemFormPreview.src = uploadedUrl;
        setImagePosition(50, 50);
        showToast('Foto lista para guardar');
      } catch (_) {
        showToast('No se pudo procesar la imagen');
      }
    });
  }

  if (itemForm) {
    itemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetCatId = itemFormCategory.value;
      const existingId = itemFormId.value.trim();
      const name = itemFormName.value.trim();
      let price = itemFormPrice.value.trim();
      if (price && !price.startsWith('$')) price = `$${price}`;

      const itemData = {
        id: existingId || `${slugify(name)}-${Date.now().toString(36).slice(-4)}`,
        name,
        badge: itemFormBadge.value || '★',
        price,
        desc: itemFormShortDesc.value.trim(),
        detailCopy: itemFormDetailCopy.value.trim() || itemFormShortDesc.value.trim(),
        pairing: itemFormPairing.value.trim(),
        tags: itemFormTags.value
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image: itemFormImageUrl.value.trim() || 'assets/img/ice-cube-previa.jpg',
        imagePosition: itemFormImagePos ? itemFormImagePos.value.trim() || '50% 50%' : '50% 50%',
        available: true
      };

      const targetSec = menuSections.find((s) => s.id === targetCatId);
      if (existingId) {
        let updatedInPlace = false;
        menuSections.forEach((sec) => {
          const idx = (sec.items || []).findIndex((i) => i.id === existingId);
          if (idx !== -1) {
            if (sec.id === targetCatId) {
              itemData.available = sec.items[idx].available !== false;
              sec.items[idx] = itemData;
              updatedInPlace = true;
            } else {
              sec.items.splice(idx, 1);
            }
          }
        });
        if (!updatedInPlace && targetSec) {
          targetSec.items.push(itemData);
        }
      } else if (targetSec) {
        targetSec.items.push(itemData);
      }

      activeCategoryId = targetCatId;
      closeItemModal();
      commitChangesInstant(`"${itemData.name}" guardado en la carta`);

      const client = window.MeryStore.getClient();
      if (client) {
        client.from('menu_items').upsert({
          id: itemData.id,
          category_id: targetCatId,
          name: itemData.name,
          badge: itemData.badge,
          price: itemData.price,
          short_desc: itemData.desc,
          detail_copy: itemData.detailCopy,
          pairing_note: itemData.pairing,
          tags: itemData.tags,
          image_url: itemData.image,
          image_position: itemData.imagePosition,
          available: itemData.available
        }, { onConflict: 'id' }).then(() => {}).catch(() => {});
      }
    });
  }

  // 6. CATEGORY MODAL (Create / Rename Category)
  function openCategoryModal(sec) {
    if (sec) {
      catModalHeading.textContent = 'Renombrar categoría';
      catFormSlug.value = sec.id;
      catFormTitle.value = sec.title;
    } else {
      catModalHeading.textContent = 'Nueva categoría';
      catFormSlug.value = '';
      catFormTitle.value = '';
    }
    categoryModal.hidden = false;
  }

  function closeCategoryModal() {
    categoryModal.hidden = true;
  }

  document.getElementById('btnNewCategory')?.addEventListener('click', () => {
    closeAdminMobileMenu();
    openCategoryModal(null);
  });
  document.getElementById('btnCloseCatModal')?.addEventListener('click', closeCategoryModal);
  document.getElementById('btnCancelCatModal')?.addEventListener('click', closeCategoryModal);

  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const existingSlug = catFormSlug.value.trim();
      const title = catFormTitle.value.trim();
      if (!title) return;

      let targetSlug = existingSlug;
      if (existingSlug) {
        const sec = menuSections.find((s) => s.id === existingSlug);
        if (sec) sec.title = title;
      } else {
        targetSlug = slugify(title);
        menuSections.push({
          id: targetSlug,
          title,
          sort_order: menuSections.length + 1,
          items: []
        });
        activeCategoryId = targetSlug;
      }

      closeCategoryModal();
      commitChangesInstant(`Categoría "${title}" guardada`);

      const client = window.MeryStore.getClient();
      if (client && targetSlug) {
        client.from('menu_categories').upsert({
          slug: targetSlug,
          title,
          sort_order: menuSections.length
        }, { onConflict: 'slug' }).then(() => {}).catch(() => {});
      }
    });
  }
});
