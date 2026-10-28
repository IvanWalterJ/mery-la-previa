// MERY LA PREVIA — Self-Managed Admin Panel Controller (Auth + Real-Time CRUD + Photo Upload)
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

document.addEventListener('DOMContentLoaded', async () => {
  const loginScreen = document.getElementById('adminLoginScreen');
  const dashboardScreen = document.getElementById('adminDashboardScreen');
  const loginForm = document.getElementById('adminLoginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnLogout = document.getElementById('btnLogout');

  // Supabase Setup Drawer controls
  const btnToggleSupaSetup = document.getElementById('btnToggleSupaSetup');
  const btnOpenSupaModal = document.getElementById('btnOpenSupaModal');
  const supaSetupDrawer = document.getElementById('supaSetupDrawer');
  const cfgSupaUrl = document.getElementById('cfgSupaUrl');
  const cfgSupaKey = document.getElementById('cfgSupaKey');
  const btnSaveSupaCfg = document.getElementById('btnSaveSupaCfg');
  const supaCfgStatus = document.getElementById('supaCfgStatus');
  const realtimeStatusText = document.getElementById('realtimeStatusText');

  const categoryPillsEl = document.getElementById('adminCategoryPills');
  const sectionsContainer = document.getElementById('adminSectionsContainer');
  const toastEl = document.getElementById('adminToast');

  // Item Modal controls
  const itemModal = document.getElementById('adminItemModal');
  const itemModalHeading = document.getElementById('itemModalHeading');
  const itemForm = document.getElementById('adminItemForm');
  const itemFormId = document.getElementById('itemFormId');
  const itemFormCategory = document.getElementById('itemFormCategory');
  const itemFormPrice = document.getElementById('itemFormPrice');
  const itemFormName = document.getElementById('itemFormName');
  const itemFormBadge = document.getElementById('itemFormBadge');
  const itemFormPreview = document.getElementById('itemFormPreview');
  const itemFormFile = document.getElementById('itemFormFile');
  const itemFormImageUrl = document.getElementById('itemFormImageUrl');
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

  let menuSections = window.MeryStore.getLocalSections();
  let activeCategoryFilter = 'all';
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 3200);
  }

  function updateConnectionStatusUI() {
    const cfg = window.MeryStore.getSupabaseConfig();
    if (cfgSupaUrl) cfgSupaUrl.value = cfg.url || '';
    if (cfgSupaKey) cfgSupaKey.value = cfg.anonKey || '';
    const connected = window.MeryStore.isSupabaseConfigured();
    if (realtimeStatusText) {
      realtimeStatusText.textContent = connected
        ? 'SUPABASE REALTIME ACTIVO'
        : 'MODO LOCAL EN TIEMPO REAL';
    }
  }

  updateConnectionStatusUI();

  if (btnToggleSupaSetup && supaSetupDrawer) {
    btnToggleSupaSetup.addEventListener('click', () => {
      supaSetupDrawer.hidden = !supaSetupDrawer.hidden;
    });
  }

  if (btnOpenSupaModal) {
    btnOpenSupaModal.addEventListener('click', () => {
      const cfg = window.MeryStore.getSupabaseConfig();
      const url = window.prompt('Pegá la Project URL de Supabase (ej. https://xxxx.supabase.co):', cfg.url || '');
      if (url === null) return;
      const key = window.prompt('Pegá la anon public key de Supabase:', cfg.anonKey || '');
      if (key === null) return;
      window.MeryStore.setSupabaseConfig(url, key);
      updateConnectionStatusUI();
      if (window.MeryStore.isSupabaseConfigured()) {
        window.MeryStore.seedSupabaseIfEmpty().then(() => {
          showToast('✓ Conectado a Supabase y carta sincronizada');
        });
      } else {
        showToast('Guardado en modo local instantáneo');
      }
    });
  }

  if (btnSaveSupaCfg) {
    btnSaveSupaCfg.addEventListener('click', async () => {
      const url = cfgSupaUrl?.value || '';
      const key = cfgSupaKey?.value || '';
      window.MeryStore.setSupabaseConfig(url, key);
      updateConnectionStatusUI();
      if (supaCfgStatus) {
        supaCfgStatus.textContent = window.MeryStore.isSupabaseConfigured()
          ? '✓ Conexión Supabase lista'
          : 'Modo local activo';
      }
    });
  }

  // 1. AUTHENTICATION FLOW (Supabase Auth signInWithPassword — No Public Sign-Up)
  async function checkActiveSession() {
    const client = window.MeryStore.getClient();
    if (client) {
      const { data } = await client.auth.getSession();
      if (data && data.session) {
        enterDashboard();
        return;
      }
    }
    if (sessionStorage.getItem(SESSION_AUTH_KEY) === 'true') {
      enterDashboard();
    }
  }

  async function enterDashboard() {
    loginScreen.hidden = true;
    dashboardScreen.hidden = false;
    updateConnectionStatusUI();
    menuSections = await window.MeryStore.fetchMenuSections();
    renderAdminFilters();
    renderAdminSections();
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
            loginErrorMsg.textContent = 'Credenciales inválidas. Recordá que los usuarios se dan de alta manualmente desde Supabase Auth.';
            loginErrorMsg.hidden = false;
          }
          return;
        }
        await window.MeryStore.seedSupabaseIfEmpty();
        sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        await enterDashboard();
        return;
      }

      // Local immediate preview login before Supabase URL is pasted
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      await enterDashboard();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      const client = window.MeryStore.getClient();
      if (client) {
        await client.auth.signOut().catch(() => {});
      }
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      dashboardScreen.hidden = true;
      loginScreen.hidden = false;
    });
  }

  // 2. REALTIME SYNC persistence helper
  async function persistAndBroadcast(toastMessage) {
    window.MeryStore.saveLocalSections(menuSections, true);

    const client = window.MeryStore.getClient();
    if (client) {
      try {
        await window.MeryStore.seedSupabaseIfEmpty();
      } catch (err) {
        console.warn('Supabase sync notice:', err);
      }
    }

    renderAdminFilters();
    renderAdminSections();
    if (toastMessage) showToast(toastMessage);
  }

  window.MeryStore.subscribeToMenuChanges((updatedSections) => {
    if (Array.isArray(updatedSections) && updatedSections.length > 0) {
      menuSections = updatedSections;
      renderAdminFilters();
      renderAdminSections();
    }
  });

  // 3. RENDER CATEGORY FILTER PILLS & SECTIONS
  function renderAdminFilters() {
    if (!categoryPillsEl) return;
    const validIds = menuSections.map((s) => s.id);
    if (activeCategoryFilter !== 'all' && !validIds.includes(activeCategoryFilter)) {
      activeCategoryFilter = 'all';
    }

    categoryPillsEl.innerHTML = [
      `<button type="button" class="admin-cat-pill ${activeCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">Todas (${menuSections.length})</button>`,
      ...menuSections.map((sec) => `
        <button type="button" class="admin-cat-pill ${activeCategoryFilter === sec.id ? 'active' : ''}" data-cat="${escapeHtml(sec.id)}">
          ${escapeHtml(sec.title)} (${(sec.items || []).length})
        </button>
      `)
    ].join('');

    categoryPillsEl.querySelectorAll('.admin-cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategoryFilter = btn.getAttribute('data-cat') || 'all';
        renderAdminFilters();
        renderAdminSections();
      });
    });
  }

  function renderAdminSections() {
    if (!sectionsContainer) return;
    const visibleSections = activeCategoryFilter === 'all'
      ? menuSections
      : menuSections.filter((s) => s.id === activeCategoryFilter);

    sectionsContainer.innerHTML = visibleSections.map((sec) => `
      <article class="admin-section-block" data-sec-id="${escapeHtml(sec.id)}">
        <div class="admin-section-header">
          <div class="admin-section-title-group">
            <h2 class="admin-section-title">${escapeHtml(sec.title)}</h2>
            <span class="admin-section-count">${(sec.items || []).length} ítems</span>
          </div>
          <div class="admin-topbar-actions">
            <button type="button" class="admin-btn-outline" data-action="add-in-cat" data-sec-id="${escapeHtml(sec.id)}">
              + Agregar en ${escapeHtml(sec.title)}
            </button>
            <button type="button" class="admin-btn-outline" data-action="rename-cat" data-sec-id="${escapeHtml(sec.id)}">
              Renombrar
            </button>
            ${menuSections.length > 1 ? `
              <button type="button" class="admin-btn-outline admin-btn-danger" data-action="delete-cat" data-sec-id="${escapeHtml(sec.id)}">
                Eliminar Categoría
              </button>
            ` : ''}
          </div>
        </div>

        <div class="admin-items-grid">
          ${(sec.items || []).map((item) => `
            <div class="admin-item-card ${item.available === false ? 'unavailable' : ''}" data-item-id="${escapeHtml(item.id)}">
              <div class="admin-item-top">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="admin-item-thumb" />
                <div class="admin-item-info">
                  <h3 class="admin-item-title">${escapeHtml(item.name)} <span style="color:var(--q-gold)">${escapeHtml(item.badge || '★')}</span></h3>
                  <p class="admin-item-desc">${escapeHtml(item.desc)}</p>
                </div>
              </div>

              <div class="admin-quick-price-row">
                <span class="admin-quick-price-label">Precio:</span>
                <input
                  type="text"
                  class="admin-quick-price-input"
                  value="${escapeHtml(item.price)}"
                  data-price-input="${escapeHtml(item.id)}"
                  aria-label="Precio de ${escapeHtml(item.name)}"
                />
                <button
                  type="button"
                  class="admin-btn-quick-save"
                  data-action="quick-price"
                  data-sec-id="${escapeHtml(sec.id)}"
                  data-item-id="${escapeHtml(item.id)}"
                >
                  Guardar Precio
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
                  ${item.available !== false ? '● Disponible' : '○ Agotado / Oculto'}
                </button>

                <div style="display:flex; gap:6px;">
                  <button
                    type="button"
                    class="admin-btn-outline"
                    data-action="edit-item"
                    data-sec-id="${escapeHtml(sec.id)}"
                    data-item-id="${escapeHtml(item.id)}"
                  >
                    Editar / Foto
                  </button>
                  <button
                    type="button"
                    class="admin-btn-outline admin-btn-danger"
                    data-action="delete-item"
                    data-sec-id="${escapeHtml(sec.id)}"
                    data-item-id="${escapeHtml(item.id)}"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </article>
    `).join('');

    // Wire actions inside sectionsContainer
    sectionsContainer.querySelectorAll('[data-action="quick-price"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const card = btn.closest('.admin-item-card');
        const input = card?.querySelector('.admin-quick-price-input');
        if (!input) return;

        let rawPrice = input.value.trim();
        if (rawPrice && !rawPrice.startsWith('$')) rawPrice = `$${rawPrice}`;

        const sec = menuSections.find((s) => s.id === secId);
        const item = sec?.items.find((i) => i.id === itemId);
        if (item && rawPrice) {
          item.price = rawPrice;
          const client = window.MeryStore.getClient();
          if (client) {
            await client.from('menu_items').update({ price: rawPrice, updated_at: new Date().toISOString() }).eq('id', itemId);
          }
          await persistAndBroadcast(`✓ Precio de "${item.name}" actualizado a ${rawPrice} en tiempo real`);
        }
      });
    });

    sectionsContainer.querySelectorAll('[data-action="toggle-avail"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const sec = menuSections.find((s) => s.id === secId);
        const item = sec?.items.find((i) => i.id === itemId);
        if (!item) return;

        item.available = item.available === false;
        const client = window.MeryStore.getClient();
        if (client) {
          await client.from('menu_items').update({ available: item.available, updated_at: new Date().toISOString() }).eq('id', itemId);
        }
        await persistAndBroadcast(
          item.available
            ? `✓ "${item.name}" activado en la carta`
            : `"${item.name}" marcado como agotado`
        );
      });
    });

    sectionsContainer.querySelectorAll('[data-action="edit-item"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const sec = menuSections.find((s) => s.id === secId);
        const item = sec?.items.find((i) => i.id === itemId);
        if (sec && item) openItemModal(sec.id, item);
      });
    });

    sectionsContainer.querySelectorAll('[data-action="delete-item"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const sec = menuSections.find((s) => s.id === secId);
        const item = sec?.items.find((i) => i.id === itemId);
        if (!sec || !item) return;
        if (!window.confirm(`¿Eliminar "${item.name}" de la carta?`)) return;

        sec.items = sec.items.filter((i) => i.id !== itemId);
        const client = window.MeryStore.getClient();
        if (client) {
          await client.from('menu_items').delete().eq('id', itemId);
        }
        await persistAndBroadcast(`"${item.name}" eliminado de la carta`);
      });
    });

    sectionsContainer.querySelectorAll('[data-action="add-in-cat"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openItemModal(btn.getAttribute('data-sec-id'), null);
      });
    });

    sectionsContainer.querySelectorAll('[data-action="rename-cat"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const sec = menuSections.find((s) => s.id === secId);
        if (sec) openCategoryModal(sec);
      });
    });

    sectionsContainer.querySelectorAll('[data-action="delete-cat"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const secId = btn.getAttribute('data-sec-id');
        const sec = menuSections.find((s) => s.id === secId);
        if (!sec) return;
        if (!window.confirm(`¿Eliminar la categoría "${sec.title}" y sus platos?`)) return;

        menuSections = menuSections.filter((s) => s.id !== secId);
        const client = window.MeryStore.getClient();
        if (client) {
          await client.from('menu_categories').delete().eq('slug', secId);
        }
        await persistAndBroadcast(`Categoría "${sec.title}" eliminada`);
      });
    });
  }

  // 4. ITEM MODAL (Create / Edit Dish + Photo Upload)
  function populateCategorySelect(selectedId) {
    if (!itemFormCategory) return;
    itemFormCategory.innerHTML = menuSections
      .map((sec) => `<option value="${escapeHtml(sec.id)}" ${sec.id === selectedId ? 'selected' : ''}>${escapeHtml(sec.title)}</option>`)
      .join('');
  }

  function openItemModal(defaultCatId, item) {
    const targetCat = defaultCatId || (menuSections[0] && menuSections[0].id) || 'cocktails';
    populateCategorySelect(targetCat);

    if (item) {
      itemModalHeading.textContent = `Editar: ${item.name}`;
      itemFormId.value = item.id;
      itemFormPrice.value = item.price || '';
      itemFormName.value = item.name || '';
      itemFormBadge.value = item.badge || '★';
      itemFormImageUrl.value = item.image || 'assets/img/ice-cube-previa.jpg';
      itemFormPreview.src = item.image || 'assets/img/ice-cube-previa.jpg';
      itemFormShortDesc.value = item.desc || '';
      itemFormDetailCopy.value = item.detailCopy || item.desc || '';
      itemFormPairing.value = item.pairing || '';
      itemFormTags.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    } else {
      itemModalHeading.textContent = 'Nuevo Plato / Trago / Vino';
      itemFormId.value = '';
      itemFormPrice.value = '';
      itemFormName.value = '';
      itemFormBadge.value = '★';
      itemFormImageUrl.value = 'assets/img/ice-cube-previa.jpg';
      itemFormPreview.src = 'assets/img/ice-cube-previa.jpg';
      itemFormShortDesc.value = '';
      itemFormDetailCopy.value = '';
      itemFormPairing.value = '';
      itemFormTags.value = 'Especialidad de la Casa, Mery La Previa';
    }

    itemModal.hidden = false;
  }

  function closeItemModal() {
    itemModal.hidden = true;
  }

  document.getElementById('btnNewDish')?.addEventListener('click', () => {
    const catId = activeCategoryFilter === 'all' ? menuSections[0]?.id : activeCategoryFilter;
    openItemModal(catId, null);
  });
  document.getElementById('btnCloseItemModal')?.addEventListener('click', closeItemModal);
  document.getElementById('btnCancelItemModal')?.addEventListener('click', closeItemModal);

  if (itemFormImageUrl) {
    itemFormImageUrl.addEventListener('input', () => {
      if (itemFormImageUrl.value.trim()) {
        itemFormPreview.src = itemFormImageUrl.value.trim();
      }
    });
  }

  document.querySelectorAll('.admin-preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const img = chip.getAttribute('data-img');
      if (img) {
        itemFormImageUrl.value = img;
        itemFormPreview.src = img;
      }
    });
  });

  if (itemFormFile) {
    itemFormFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      showToast('Subiendo y optimizando foto...');
      try {
        const uploadedUrl = await window.MeryStore.uploadDishImage(file);
        itemFormImageUrl.value = uploadedUrl;
        itemFormPreview.src = uploadedUrl;
        showToast('✓ Foto cargada lista para guardar');
      } catch (err) {
        showToast('No se pudo cargar la imagen');
      }
    });
  }

  if (itemForm) {
    itemForm.addEventListener('submit', async (e) => {
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
        available: true
      };

      // Remove from old category if moved
      menuSections.forEach((sec) => {
        if (existingId) {
          sec.items = (sec.items || []).filter((i) => i.id !== existingId);
        }
      });

      const targetSec = menuSections.find((s) => s.id === targetCatId);
      if (targetSec) {
        targetSec.items.push(itemData);
      }

      closeItemModal();
      await persistAndBroadcast(`✓ "${itemData.name}" publicado en tiempo real`);
    });
  }

  // 5. CATEGORY MODAL (Create / Rename Category)
  function openCategoryModal(sec) {
    if (sec) {
      catModalHeading.textContent = 'Renombrar Categoría';
      catFormSlug.value = sec.id;
      catFormTitle.value = sec.title;
    } else {
      catModalHeading.textContent = 'Nueva Categoría';
      catFormSlug.value = '';
      catFormTitle.value = '';
    }
    categoryModal.hidden = false;
  }

  function closeCategoryModal() {
    categoryModal.hidden = true;
  }

  document.getElementById('btnNewCategory')?.addEventListener('click', () => openCategoryModal(null));
  document.getElementById('btnCloseCatModal')?.addEventListener('click', closeCategoryModal);
  document.getElementById('btnCancelCatModal')?.addEventListener('click', closeCategoryModal);

  if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const existingSlug = catFormSlug.value.trim();
      const title = catFormTitle.value.trim();
      if (!title) return;

      if (existingSlug) {
        const sec = menuSections.find((s) => s.id === existingSlug);
        if (sec) sec.title = title;
      } else {
        const newSlug = slugify(title);
        menuSections.push({
          id: newSlug,
          title,
          sort_order: menuSections.length + 1,
          items: []
        });
        activeCategoryFilter = newSlug;
      }

      closeCategoryModal();
      await persistAndBroadcast(`✓ Categoría "${title}" actualizada en vivo`);
    });
  }

  await checkActiveSession();
});
