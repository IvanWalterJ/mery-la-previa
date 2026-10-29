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
  const loginNoticeEl = document.getElementById('adminLoginNotice');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnLogout = document.getElementById('btnLogout');

  const categoryPillsEl = document.getElementById('adminCategoryPills');
  const activeCategoryTitle = document.getElementById('activeCategoryTitle');
  const activeCategoryCount = document.getElementById('activeCategoryCount');
  const btnRenameActiveCat = document.getElementById('btnRenameActiveCat');
  const btnDeleteActiveCat = document.getElementById('btnDeleteActiveCat');
  const btnNewDish = document.getElementById('btnNewDish');
  const btnNavReservations = document.getElementById('btnNavReservations');
  const adminReservationsBadge = document.getElementById('adminReservationsBadge');
  const btnNavMenu = document.getElementById('btnNavMenu');
  const adminMenuTotalBadge = document.getElementById('adminMenuTotalBadge');
  const btnNavWhatsapp = document.getElementById('btnNavWhatsapp');
  const btnNavVideos = document.getElementById('btnNavVideos');
  const adminSearchInput = document.getElementById('adminSearchInput');
  const sectionsContainer = document.getElementById('adminSectionsContainer');
  const toastEl = document.getElementById('adminToast');

  // Proof Modal elements (S9)
  const adminProofModal = document.getElementById('adminProofModal');
  const adminProofResId = document.getElementById('adminProofResId');
  const adminProofCustomerName = document.getElementById('adminProofCustomerName');
  const adminProofUploadedAt = document.getElementById('adminProofUploadedAt');
  const adminProofImage = document.getElementById('adminProofImage');
  const adminProofStatusNotice = document.getElementById('adminProofStatusNotice');
  const btnApproveProofModal = document.getElementById('btnApproveProofModal');
  const btnCloseProofModal = document.getElementById('btnCloseProofModal');
  const btnCancelProofModal = document.getElementById('btnCancelProofModal');

  // QR Scanner & Check-in Modal elements (S9)
  const adminQrScannerModal = document.getElementById('adminQrScannerModal');
  const qrScannerCodeInput = document.getElementById('qrScannerCodeInput');
  const btnSearchQrCode = document.getElementById('btnSearchQrCode');
  const btnToggleQrCamera = document.getElementById('btnToggleQrCamera');
  const btnToggleQrTorch = document.getElementById('btnToggleQrTorch');
  const btnFlipQrCamera = document.getElementById('btnFlipQrCamera');
  const btnScanAnotherQr = document.getElementById('btnScanAnotherQr');
  const qrCameraStatus = document.getElementById('qrCameraStatus');
  const qrCameraContainer = document.getElementById('qrCameraContainer');
  const qrScanResultBox = document.getElementById('qrScanResultBox');
  const qrResultCode = document.getElementById('qrResultCode');
  const qrResultName = document.getElementById('qrResultName');
  const qrResultDepositBadge = document.getElementById('qrResultDepositBadge');
  const qrResultType = document.getElementById('qrResultType');
  const qrResultGuests = document.getElementById('qrResultGuests');
  const qrResultDateTime = document.getElementById('qrResultDateTime');
  const qrResultAttendance = document.getElementById('qrResultAttendance');
  const qrResultBirthdayNotice = document.getElementById('qrResultBirthdayNotice');
  const qrResultDni = document.getElementById('qrResultDni');
  const btnConfirmQrCheckIn = document.getElementById('btnConfirmQrCheckIn');
  const btnCloseQrScannerModal = document.getElementById('btnCloseQrScannerModal');
  const btnDismissQrModal = document.getElementById('btnDismissQrModal');

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
  const itemFormModalPreview = document.getElementById('itemFormModalPreview');
  const itemFormFile = document.getElementById('itemFormFile');
  const itemFormImageUrl = document.getElementById('itemFormImageUrl');
  const itemFormImagePos = document.getElementById('itemFormImagePos');
  const itemFormImageZoom = document.getElementById('itemFormImageZoom');
  const itemFormModalImagePos = document.getElementById('itemFormModalImagePos');
  const itemFormModalImageZoom = document.getElementById('itemFormModalImageZoom');
  const btnOpenPhotoCropper = document.getElementById('btnOpenPhotoCropper');
  const btnResetImagePos = document.getElementById('btnResetImagePos');
  const itemFormShortDesc = document.getElementById('itemFormShortDesc');
  const itemFormDetailCopy = document.getElementById('itemFormDetailCopy');
  const itemFormPairing = document.getElementById('itemFormPairing');
  const itemFormTags = document.getElementById('itemFormTags');

  // Instagram-style Dedicated Dual Photo Cropper Modal controls
  const adminPhotoCropperModal = document.getElementById('adminPhotoCropperModal');
  const cropTabThumb = document.getElementById('cropTabThumb');
  const cropTabModal = document.getElementById('cropTabModal');
  const igCropViewport = document.getElementById('igCropViewport');
  const igCropImage = document.getElementById('igCropImage');
  const igActiveModeLabel = document.getElementById('igActiveModeLabel');
  const igCropZoomSlider = document.getElementById('igCropZoomSlider');
  const igCropZoomValue = document.getElementById('igCropZoomValue');
  const btnResetActiveCrop = document.getElementById('btnResetActiveCrop');
  const igLivePreviewThumb = document.getElementById('igLivePreviewThumb');
  const igLivePreviewModal = document.getElementById('igLivePreviewModal');
  const igLivePreviewThumbWrap = document.getElementById('igLivePreviewThumbWrap');
  const igLivePreviewModalWrap = document.getElementById('igLivePreviewModalWrap');
  const btnClosePhotoCropper = document.getElementById('btnClosePhotoCropper');
  const btnCancelPhotoCropper = document.getElementById('btnCancelPhotoCropper');
  const btnApplyPhotoCropper = document.getElementById('btnApplyPhotoCropper');

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
  let activeTab = 'reservations'; // 'reservations' | 'category' | 'videos' | 'whatsapp'
  let searchQuery = '';
  let toastTimer = null;
  let pendingConfirmCallback = null;
  const urlCheckinParam = new URLSearchParams(window.location.search).get('checkin');

  // Global operational & reservation state declarations (avoids TDZ on early render)
  let activeResFilter = 'Todas';
  let resSearchQuery = '';
  let activeProofRes = null;
  let activeScannedRes = null;
  let qrCameraStream = null;
  let scanAudioCtx = null;
  let qrScanAnimId = null;
  let qrCanvasEl = null;
  let qrCanvasCtx = null;
  let isScanningActive = false;
  let currentFacingMode = 'environment';
  let isTorchOn = false;
  let qrVideoPreviewEl = null;
  let waPollTimer = null;
  let activeManualCreatedRes = null;

  // --- Tab & Workspace State Persistence ---
  const STORAGE_KEY_ADMIN_TAB = 'mery_admin_active_tab_v2';

  function persistActiveTabState() {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_TAB, JSON.stringify({
        tab: activeTab,
        categoryId: activeCategoryId
      }));
    } catch (_) {}

    let targetHash = '';
    if (activeTab === 'reservations') {
      targetHash = '#reservas';
    } else if (activeTab === 'whatsapp') {
      targetHash = '#whatsapp';
    } else if (activeTab === 'videos') {
      targetHash = '#videos';
    } else if (activeTab === 'category') {
      targetHash = activeCategoryId ? `#cat-${activeCategoryId}` : '#menu';
    }

    if (window.location.hash !== targetHash) {
      try {
        history.replaceState(null, '', targetHash || window.location.pathname + window.location.search);
      } catch (_) {
        window.location.hash = targetHash;
      }
    }
  }

  function restorePersistedTab() {
    let targetTab = null;
    let targetCategory = null;

    // 1. Read URL hash first (default tab is reservations when no hash or #reservas)
    const hash = window.location.hash || '';
    if (!hash || hash === '#reservas' || hash === '#reservaciones' || hash === '#reserva') {
      targetTab = 'reservations';
    } else if (hash === '#whatsapp') {
      targetTab = 'whatsapp';
    } else if (hash === '#videos') {
      targetTab = 'videos';
    } else if (hash.startsWith('#cat-') || hash === '#menu' || hash === '#carta') {
      targetTab = 'category';
      if (hash.startsWith('#cat-')) {
        targetCategory = decodeURIComponent(hash.slice(5).trim());
      }
    }

    // 2. Fallback to localStorage if no matching hash in URL
    if (!targetTab) {
      try {
        const savedRaw = localStorage.getItem(STORAGE_KEY_ADMIN_TAB);
        if (savedRaw) {
          const saved = JSON.parse(savedRaw);
          if (saved && ['category', 'reservations', 'whatsapp', 'videos'].includes(saved.tab)) {
            targetTab = saved.tab;
            if (saved.categoryId) targetCategory = saved.categoryId;
          }
        }
      } catch (_) {}
    }

    if (!targetTab) targetTab = 'reservations';
    activeTab = targetTab;

    if (targetCategory && menuSections.some((s) => s.id === targetCategory)) {
      activeCategoryId = targetCategory;
    } else if (!menuSections.some((s) => s.id === activeCategoryId) && menuSections.length > 0) {
      activeCategoryId = menuSections[0].id;
    }
  }

  function syncReservationsBackground() {
    if (window.MeryStore && typeof window.MeryStore.fetchReservationsFromSupabase === 'function') {
      window.MeryStore.fetchReservationsFromSupabase().then(() => {
        updateReservationsBadge();
        if (activeTab === 'reservations') {
          renderReservationsWorkspace();
        }
      }).catch(() => {});
    }
  }

  // Multidevice sync: sync reservations on visibility change
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncReservationsBackground();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncReservationsBackground();
    }
  });

  window.addEventListener('hashchange', () => {
    if (dashboardScreen && !dashboardScreen.hidden) {
      const prevTab = activeTab;
      const prevCat = activeCategoryId;
      restorePersistedTab();
      if (prevTab !== activeTab || prevCat !== activeCategoryId) {
        renderAdminSidebar();
        if (activeTab === 'reservations') renderReservationsWorkspace();
        else if (activeTab === 'whatsapp') renderWhatsappWorkspace();
        else if (activeTab === 'videos') renderVideosWorkspace();
        else renderActiveCategoryWorkspace();
      }
    }
  });

  // Cropper state
  let cropperContext = null; // { mode: 'item-modal' } | { mode: 'direct-item', secId, itemId }
  let activeCropMode = 'thumb'; // 'thumb' | 'modal'
  let currentCrops = {
    thumb: { x: 50, y: 50, zoom: 1 },
    modal: { x: 50, y: 50, zoom: 1 }
  };
  let currentCropperImageUrl = '';

  function parseImagePosition(posStr) {
    if (!posStr) return { x: 50, y: 50 };
    const parts = String(posStr).split(/\s+/);
    const x = parseFloat(parts[0]) || 50;
    const y = parseFloat(parts[1]) || 50;
    return { x, y };
  }

  function applyCropToElement(el, crop) {
    if (!el || !crop) return;
    const pos = `${crop.x}% ${crop.y}%`;
    const zoom = typeof crop.zoom === 'number' && !isNaN(crop.zoom) ? crop.zoom : 1;
    el.style.objectPosition = pos;
    el.style.transformOrigin = pos;
    el.style.transform = `scale(${zoom})`;
  }

  function setImagePosition(x, y) {
    const clampedX = Math.round(Math.min(100, Math.max(0, x)));
    const clampedY = Math.round(Math.min(100, Math.max(0, y)));
    const val = `${clampedX}% ${clampedY}%`;
    if (itemFormImagePos) itemFormImagePos.value = val;
    if (itemFormPreview) {
      itemFormPreview.style.objectPosition = val;
      itemFormPreview.style.transformOrigin = val;
    }
  }

  function updateCropperView() {
    if (!igCropViewport) return;
    const isThumb = activeCropMode === 'thumb';
    igCropViewport.classList.toggle('mode-thumb', isThumb);
    igCropViewport.classList.toggle('mode-modal', !isThumb);

    if (cropTabThumb) {
      cropTabThumb.classList.toggle('active', isThumb);
      cropTabThumb.setAttribute('aria-selected', isThumb ? 'true' : 'false');
    }
    if (cropTabModal) {
      cropTabModal.classList.toggle('active', !isThumb);
      cropTabModal.setAttribute('aria-selected', !isThumb ? 'true' : 'false');
    }

    if (igLivePreviewThumbWrap) igLivePreviewThumbWrap.classList.toggle('active-preview', isThumb);
    if (igLivePreviewModalWrap) igLivePreviewModalWrap.classList.toggle('active-preview', !isThumb);

    if (igActiveModeLabel) {
      igActiveModeLabel.textContent = isThumb
        ? 'Miniatura de la carta (115 × 86)'
        : 'Ventana de detalle del plato (580 × 250)';
    }

    const activeCrop = currentCrops[activeCropMode] || { x: 50, y: 50, zoom: 1 };
    applyCropToElement(igCropImage, activeCrop);

    if (igCropZoomSlider) igCropZoomSlider.value = activeCrop.zoom;
    if (igCropZoomValue) igCropZoomValue.textContent = activeCrop.zoom.toFixed(2) + 'x';

    applyCropToElement(igLivePreviewThumb, currentCrops.thumb);
    applyCropToElement(igLivePreviewModal, currentCrops.modal);
  }

  function openPhotoCropper({ imageUrl, thumbPos, thumbZoom, modalPos, modalZoom, context }) {
    if (!adminPhotoCropperModal) return;
    cropperContext = context || { mode: 'item-modal' };
    activeCropMode = 'thumb';

    const parsedThumb = parseImagePosition(thumbPos || '50% 50%');
    const parsedModal = parseImagePosition(modalPos || thumbPos || '50% 50%');

    currentCrops = {
      thumb: {
        x: parsedThumb.x,
        y: parsedThumb.y,
        zoom: typeof thumbZoom === 'number' && !isNaN(thumbZoom) ? thumbZoom : 1
      },
      modal: {
        x: parsedModal.x,
        y: parsedModal.y,
        zoom: typeof modalZoom === 'number' && !isNaN(modalZoom) ? modalZoom : (typeof thumbZoom === 'number' && !isNaN(thumbZoom) ? thumbZoom : 1)
      }
    };

    currentCropperImageUrl = imageUrl || 'assets/img/ice-cube-previa.jpg';
    if (igCropImage) igCropImage.src = currentCropperImageUrl;
    if (igLivePreviewThumb) igLivePreviewThumb.src = currentCropperImageUrl;
    if (igLivePreviewModal) igLivePreviewModal.src = currentCropperImageUrl;

    updateCropperView();
    adminPhotoCropperModal.hidden = false;
  }

  function closePhotoCropper() {
    if (!adminPhotoCropperModal) return;
    adminPhotoCropperModal.hidden = true;
    cropperContext = null;
  }

  // Draggable photo repositioning inside cropper viewport
  let isDraggingIgCrop = false;
  let dragIgStartX = 0;
  let dragIgStartY = 0;
  let cropStartPosX = 50;
  let cropStartPosY = 50;

  if (igCropViewport) {
    igCropViewport.addEventListener('pointerdown', (e) => {
      isDraggingIgCrop = true;
      dragIgStartX = e.clientX;
      dragIgStartY = e.clientY;
      const cur = currentCrops[activeCropMode] || { x: 50, y: 50, zoom: 1 };
      cropStartPosX = cur.x;
      cropStartPosY = cur.y;
      igCropViewport.classList.add('is-dragging');
      try {
        igCropViewport.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    igCropViewport.addEventListener('pointermove', (e) => {
      if (!isDraggingIgCrop) return;
      const rect = igCropViewport.getBoundingClientRect();
      const stageW = rect.width || (activeCropMode === 'thumb' ? 345 : 522);
      const stageH = rect.height || (activeCropMode === 'thumb' ? 258 : 225);
      const dx = e.clientX - dragIgStartX;
      const dy = e.clientY - dragIgStartY;
      const nextX = Math.round(Math.min(100, Math.max(0, cropStartPosX - (dx / stageW) * 100)));
      const nextY = Math.round(Math.min(100, Math.max(0, cropStartPosY - (dy / stageH) * 100)));
      currentCrops[activeCropMode].x = nextX;
      currentCrops[activeCropMode].y = nextY;
      updateCropperView();
    });

    const stopIgCropDrag = (e) => {
      if (!isDraggingIgCrop) return;
      isDraggingIgCrop = false;
      igCropViewport.classList.remove('is-dragging');
      try {
        if (e && e.pointerId) igCropViewport.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    igCropViewport.addEventListener('pointerup', stopIgCropDrag);
    igCropViewport.addEventListener('pointercancel', stopIgCropDrag);

    // Mouse wheel zoom
    igCropViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const nextZoom = Math.round(Math.min(2.5, Math.max(1, currentCrops[activeCropMode].zoom + delta)) * 100) / 100;
      currentCrops[activeCropMode].zoom = nextZoom;
      updateCropperView();
    }, { passive: false });
  }

  // Zoom range slider
  if (igCropZoomSlider) {
    igCropZoomSlider.addEventListener('input', () => {
      const val = parseFloat(igCropZoomSlider.value) || 1;
      currentCrops[activeCropMode].zoom = Math.round(val * 100) / 100;
      updateCropperView();
    });
  }

  // Tabs and preview box switching
  function setCropMode(mode) {
    if (mode !== 'thumb' && mode !== 'modal') return;
    activeCropMode = mode;
    updateCropperView();
  }

  cropTabThumb?.addEventListener('click', () => setCropMode('thumb'));
  cropTabModal?.addEventListener('click', () => setCropMode('modal'));
  igLivePreviewThumbWrap?.addEventListener('click', () => setCropMode('thumb'));
  igLivePreviewModalWrap?.addEventListener('click', () => setCropMode('modal'));

  btnResetActiveCrop?.addEventListener('click', () => {
    currentCrops[activeCropMode] = { x: 50, y: 50, zoom: 1 };
    updateCropperView();
    showToast('Esta vista fue centrada');
  });

  btnClosePhotoCropper?.addEventListener('click', closePhotoCropper);
  btnCancelPhotoCropper?.addEventListener('click', closePhotoCropper);
  if (adminPhotoCropperModal) {
    adminPhotoCropperModal.addEventListener('click', (e) => {
      if (e.target === adminPhotoCropperModal) closePhotoCropper();
    });
  }

  if (btnApplyPhotoCropper) {
    btnApplyPhotoCropper.addEventListener('click', () => {
      if (!cropperContext) return;
      if (cropperContext.mode === 'direct-item') {
        const targetSec = menuSections.find((s) => s.id === cropperContext.secId);
        const item = targetSec?.items.find((i) => i.id === cropperContext.itemId);
        if (item) {
          item.imagePosition = `${currentCrops.thumb.x}% ${currentCrops.thumb.y}%`;
          item.imageZoom = currentCrops.thumb.zoom;
          item.modalImagePosition = `${currentCrops.modal.x}% ${currentCrops.modal.y}%`;
          item.modalImageZoom = currentCrops.modal.zoom;

          commitChangesInstant(`Encuadre de "${item.name}" guardado`);

          const client = window.MeryStore.getClient();
          if (client) {
            client.from('menu_items').update({
              image_position: item.imagePosition,
              image_zoom: item.imageZoom,
              modal_image_position: item.modalImagePosition,
              modal_image_zoom: item.modalImageZoom,
              updated_at: new Date().toISOString()
            }).eq('id', item.id).then(() => {}).catch(() => {});
          }
        }
        closePhotoCropper();
      } else if (cropperContext.mode === 'item-modal') {
        const thumbPos = `${currentCrops.thumb.x}% ${currentCrops.thumb.y}%`;
        const modalPos = `${currentCrops.modal.x}% ${currentCrops.modal.y}%`;

        if (itemFormImagePos) itemFormImagePos.value = thumbPos;
        if (itemFormImageZoom) itemFormImageZoom.value = currentCrops.thumb.zoom;
        if (itemFormModalImagePos) itemFormModalImagePos.value = modalPos;
        if (itemFormModalImageZoom) itemFormModalImageZoom.value = currentCrops.modal.zoom;

        applyCropToElement(itemFormPreview, currentCrops.thumb);
        applyCropToElement(itemFormModalPreview, currentCrops.modal);

        closePhotoCropper();
        showToast('Encuadres aplicados al ítem');
      }
    });
  }

  // Retain stage pointerdown & quick interaction inside item modal for backwards compatibility
  let isDraggingStage = false;
  let dragStageStartX = 0;
  let dragStageStartY = 0;

  if (itemPhotoCropStage) {
    itemPhotoCropStage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('label') || e.target.closest('input')) return;
      isDraggingStage = true;
      dragStageStartX = e.clientX;
      dragStageStartY = e.clientY;
      const current = parseImagePosition(itemFormImagePos?.value || '50% 50%');
      cropStartPosX = current.x;
      cropStartPosY = current.y;
      itemPhotoCropStage.classList.add('is-dragging');
      try {
        itemPhotoCropStage.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    itemPhotoCropStage.addEventListener('pointermove', (e) => {
      if (!isDraggingStage) return;
      const dx = e.clientX - dragStageStartX;
      const dy = e.clientY - dragStageStartY;
      const rect = itemPhotoCropStage.getBoundingClientRect();
      const stageW = rect.width || 128;
      const stageH = rect.height || 96;
      const nextX = cropStartPosX - (dx / stageW) * 100;
      const nextY = cropStartPosY - (dy / stageH) * 100;
      setImagePosition(nextX, nextY);
    });

    const stopStageDrag = (e) => {
      if (!isDraggingStage) return;
      const dx = Math.abs(e.clientX - dragStageStartX);
      const dy = Math.abs(e.clientY - dragStageStartY);
      isDraggingStage = false;
      itemPhotoCropStage.classList.remove('is-dragging');
      try {
        if (e && e.pointerId) itemPhotoCropStage.releasePointerCapture(e.pointerId);
      } catch (_) {}

      // If clicked without dragging, open cropper modal
      if (dx < 6 && dy < 6 && !e.target.closest('button') && !e.target.closest('label')) {
        openPhotoCropper({
          imageUrl: itemFormImageUrl?.value || 'assets/img/ice-cube-previa.jpg',
          thumbPos: itemFormImagePos?.value || '50% 50%',
          thumbZoom: parseFloat(itemFormImageZoom?.value) || 1,
          modalPos: itemFormModalImagePos?.value || '50% 50%',
          modalZoom: parseFloat(itemFormModalImageZoom?.value) || 1,
          context: { mode: 'item-modal' }
        });
      }
    };

    itemPhotoCropStage.addEventListener('pointerup', stopStageDrag);
    itemPhotoCropStage.addEventListener('pointercancel', stopStageDrag);
  }

  btnOpenPhotoCropper?.addEventListener('click', () => {
    openPhotoCropper({
      imageUrl: itemFormImageUrl?.value || 'assets/img/ice-cube-previa.jpg',
      thumbPos: itemFormImagePos?.value || '50% 50%',
      thumbZoom: parseFloat(itemFormImageZoom?.value) || 1,
      modalPos: itemFormModalImagePos?.value || '50% 50%',
      modalZoom: parseFloat(itemFormModalImageZoom?.value) || 1,
      context: { mode: 'item-modal' }
    });
  });

  if (btnResetImagePos) {
    btnResetImagePos.addEventListener('click', () => {
      setImagePosition(50, 50);
      if (itemFormImageZoom) itemFormImageZoom.value = 1;
      if (itemFormModalImagePos) itemFormModalImagePos.value = '50% 50%';
      if (itemFormModalImageZoom) itemFormModalImageZoom.value = 1;
      applyCropToElement(itemFormPreview, { x: 50, y: 50, zoom: 1 });
      applyCropToElement(itemFormModalPreview, { x: 50, y: 50, zoom: 1 });
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

  // 1. UNIFIED VISUAL CONFIRMATION POPUP (Custom modal with animated green check on success)
  let confirmSuccessTimer = null;

  function openConfirmModal({
    title,
    message,
    confirmLabel = 'Confirmar',
    successText = '',
    onConfirm
  }) {
    if (!confirmModal) return;
    clearTimeout(confirmSuccessTimer);

    const promptState = document.getElementById('confirmPromptState');
    const successState = document.getElementById('confirmSuccessState');
    const successTextEl = document.getElementById('confirmSuccessText');

    const modalHeader = confirmModal.querySelector('.admin-modal-header');

    if (modalHeader) modalHeader.style.display = 'flex';
    if (promptState) {
      promptState.hidden = false;
      promptState.style.display = 'block';
    }
    if (successState) {
      successState.classList.remove('is-animating');
      successState.hidden = true;
      successState.style.display = 'none';
    }

    if (confirmModalHeading) confirmModalHeading.textContent = title || 'Confirmar acción';
    if (confirmModalMessage) confirmModalMessage.textContent = message || '¿Querés continuar?';
    if (btnAcceptConfirmModal) {
      btnAcceptConfirmModal.textContent = confirmLabel;
      const isApproval = confirmLabel.toLowerCase().includes('seña') || confirmLabel.toLowerCase().includes('ingreso');
      btnAcceptConfirmModal.className = isApproval ? 'admin-btn-gold' : 'admin-btn-gold admin-btn-confirm-danger';
    }

    pendingConfirmCallback = typeof onConfirm === 'function' ? async () => {
      if (successText && successState && promptState) {
        if (modalHeader) modalHeader.style.display = 'none';
        promptState.hidden = true;
        promptState.style.display = 'none';
        if (successTextEl) successTextEl.textContent = successText;

        // Reset and trigger animation via requestAnimationFrame
        successState.classList.remove('is-animating');
        successState.hidden = false;
        successState.style.display = 'flex';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            successState.classList.add('is-animating');
          });
        });

        try {
          await onConfirm();
        } catch (_) {}

        confirmSuccessTimer = setTimeout(() => {
          closeConfirmModal();
        }, 1400);
      } else {
        closeConfirmModal();
        try {
          await onConfirm();
        } catch (_) {}
      }
    } : null;

    confirmModal.hidden = false;
  }

  function closeConfirmModal() {
    if (!confirmModal) return;
    clearTimeout(confirmSuccessTimer);
    const modalHeader = confirmModal.querySelector('.admin-modal-header');
    if (modalHeader) modalHeader.style.display = 'flex';
    const successState = document.getElementById('confirmSuccessState');
    if (successState) {
      successState.classList.remove('is-animating');
      successState.hidden = true;
      successState.style.display = 'none';
    }
    const promptState = document.getElementById('confirmPromptState');
    if (promptState) {
      promptState.hidden = false;
      promptState.style.display = 'block';
    }
    confirmModal.hidden = true;
    pendingConfirmCallback = null;
  }

  if (btnCloseConfirmModal) btnCloseConfirmModal.addEventListener('click', closeConfirmModal);
  if (btnCancelConfirmModal) btnCancelConfirmModal.addEventListener('click', closeConfirmModal);
  if (btnAcceptConfirmModal) {
    btnAcceptConfirmModal.addEventListener('click', () => {
      const fn = pendingConfirmCallback;
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
    try {
      loginScreen.hidden = true;
      dashboardScreen.hidden = false;

      restorePersistedTab();
      renderAdminSidebar();

      if (activeTab === 'reservations') {
        renderReservationsWorkspace();
      } else if (activeTab === 'whatsapp') {
        renderWhatsappWorkspace();
      } else if (activeTab === 'videos') {
        renderVideosWorkspace();
      } else {
        renderActiveCategoryWorkspace();
      }

      persistActiveTabState();
      syncReservationsBackground();

      // Background non-blocking sync if remote backend is configured
      window.MeryStore.fetchMenuSections().then((fresh) => {
        if (Array.isArray(fresh) && fresh.length > 0) {
          menuSections = fresh;
          if (!menuSections.some((s) => s.id === activeCategoryId)) {
            activeCategoryId = menuSections[0].id;
          }
          renderAdminSidebar();
          if (activeTab === 'category') {
            renderActiveCategoryWorkspace();
          }
        }
      }).catch(() => {});
    } catch (err) {
      console.error('Error entering dashboard:', err);
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
      checkAndHandlePendingCheckin();
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
      if (activeTab === 'category') {
        renderActiveCategoryWorkspace();
      }
    }
  });

  // 4. LEFT SIDEBAR & COMPACT NAVIGATION
  function updateMenuTotalBadge() {
    if (!adminMenuTotalBadge) return;
    const total = menuSections.reduce((acc, s) => acc + (s.items || []).length, 0);
    adminMenuTotalBadge.textContent = String(total);
    adminMenuTotalBadge.title = `${total} ítems en la carta`;
  }

  function renderAdminSidebar() {
    btnNavReservations?.classList.toggle('active', activeTab === 'reservations');
    btnNavMenu?.classList.toggle('active', activeTab === 'category');
    btnNavWhatsapp?.classList.toggle('active', activeTab === 'whatsapp');
    btnNavVideos?.classList.toggle('active', activeTab === 'videos');
    updateMenuTotalBadge();
  }

  if (btnNavReservations) {
    btnNavReservations.addEventListener('click', () => {
      stopWaPolling();
      activeTab = 'reservations';
      renderAdminSidebar();
      renderReservationsWorkspace();
      persistActiveTabState();
      closeAdminMobileMenu();
    });
  }

  if (btnNavMenu) {
    btnNavMenu.addEventListener('click', () => {
      stopWaPolling();
      activeTab = 'category';
      renderAdminSidebar();
      renderActiveCategoryWorkspace();
      persistActiveTabState();
      closeAdminMobileMenu();
    });
  }

  if (btnNavWhatsapp) {
    btnNavWhatsapp.addEventListener('click', () => {
      stopWaPolling();
      activeTab = 'whatsapp';
      renderAdminSidebar();
      renderWhatsappWorkspace();
      persistActiveTabState();
      closeAdminMobileMenu();
    });
  }

  if (btnNavVideos) {
    btnNavVideos.addEventListener('click', () => {
      stopWaPolling();
      activeTab = 'videos';
      renderAdminSidebar();
      renderVideosWorkspace();
      persistActiveTabState();
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
    persistActiveTabState();
    renderAdminSidebar();

    if (btnRenameActiveCat) btnRenameActiveCat.hidden = false;
    if (btnNewDish) btnNewDish.hidden = false;
    if (adminSearchInput?.parentElement) adminSearchInput.parentElement.hidden = false;

    const sec = menuSections.find((s) => s.id === activeCategoryId) || menuSections[0];

    const categoryPillsBarHtml = `
      <div class="admin-cat-pills-bar">
        <div class="admin-cat-pills-row" role="tablist" aria-label="Categorías de la carta">
          ${menuSections.map((s) => {
            const count = (s.items || []).length;
            const isActive = sec && s.id === sec.id;
            return `
              <button
                type="button"
                class="admin-cat-pill ${isActive ? 'active' : ''}"
                data-cat="${escapeHtml(s.id)}"
                role="tab"
                aria-selected="${isActive}"
              >
                <span>${escapeHtml(s.title)}</span>
                <span class="admin-cat-pill-count">${count}</span>
              </button>
            `;
          }).join('')}
        </div>
        <button type="button" id="btnNewCategory" class="admin-cat-pill-add">
          <span>+ Nueva categoría</span>
        </button>
      </div>
    `;

    function attachCategoryBarListeners() {
      sectionsContainer.querySelectorAll('.admin-cat-pills-row [data-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeCategoryId = btn.getAttribute('data-cat') || menuSections[0]?.id;
          renderActiveCategoryWorkspace();
        });
      });
      sectionsContainer.querySelector('#btnNewCategory')?.addEventListener('click', () => {
        closeAdminMobileMenu();
        openCategoryModal(null);
      });
    }

    if (!sec) {
      if (activeCategoryTitle) activeCategoryTitle.textContent = 'Sin categorías';
      if (activeCategoryCount) activeCategoryCount.textContent = 'Creá una categoría para comenzar';
      if (btnDeleteActiveCat) btnDeleteActiveCat.hidden = true;
      sectionsContainer.innerHTML = `
        ${categoryPillsBarHtml}
        <div class="admin-empty-state">
          <p>No hay categorías creadas aún.</p>
        </div>
      `;
      attachCategoryBarListeners();
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
        ${categoryPillsBarHtml}
        <div class="admin-empty-state">
          <p>${searchQuery ? 'No se encontraron ítems con esa búsqueda.' : 'Todavía no hay ítems en esta categoría.'}</p>
          <button type="button" class="admin-btn-gold" id="btnEmptyAddDish">+ Agregar primer ítem</button>
        </div>
      `;
      attachCategoryBarListeners();
      document.getElementById('btnEmptyAddDish')?.addEventListener('click', () => openItemModal(sec.id, null));
      return;
    }

    sectionsContainer.innerHTML = `
      ${categoryPillsBarHtml}
      <div class="admin-items-grid">
        ${filteredItems.map((item) => `
          <article class="admin-item-card ${item.available === false ? 'unavailable' : ''}" data-item-id="${escapeHtml(item.id)}">
            <div class="admin-item-top">
              <div
                class="admin-item-thumb-wrap"
                data-action="crop-thumb"
                data-sec-id="${escapeHtml(sec.id)}"
                data-item-id="${escapeHtml(item.id)}"
                title="Ajustar encuadre de la foto"
              >
                <img
                  src="${escapeHtml(item.image)}"
                  alt="${escapeHtml(item.name)}"
                  class="admin-item-thumb"
                  style="object-position: ${item.imagePosition || '50% 50%'}; transform-origin: ${item.imagePosition || '50% 50%'}; transform: scale(${item.imageZoom || 1});"
                  decoding="async"
                />
                <span class="admin-item-thumb-badge">Encuadrar</span>
              </div>
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
    attachCategoryBarListeners();

    // Instant Quick Price Save (also supports Enter key inside the price input)
    sectionsContainer.querySelectorAll('.admin-quick-price-input').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.closest('.admin-quick-price-row')?.querySelector('[data-action="quick-price"]')?.click();
        }
      });
    });

    sectionsContainer.querySelectorAll('[data-action="crop-thumb"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-sec-id');
        const itemId = btn.getAttribute('data-item-id');
        const targetSec = menuSections.find((s) => s.id === secId);
        const item = targetSec?.items.find((i) => i.id === itemId);
        if (!item) return;

        openPhotoCropper({
          imageUrl: item.image,
          thumbPos: item.imagePosition || '50% 50%',
          thumbZoom: typeof item.imageZoom === 'number' ? item.imageZoom : 1,
          modalPos: item.modalImagePosition || item.imagePosition || '50% 50%',
          modalZoom: typeof item.modalImageZoom === 'number' ? item.modalImageZoom : 1,
          context: { mode: 'direct-item', secId, itemId }
        });
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
    persistActiveTabState();

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
      const pos = item.imagePosition || '50% 50%';
      const zoom = typeof item.imageZoom === 'number' ? item.imageZoom : 1;
      const modalPos = item.modalImagePosition || item.imagePosition || '50% 50%';
      const modalZoom = typeof item.modalImageZoom === 'number' ? item.modalImageZoom : zoom;

      if (itemFormImagePos) itemFormImagePos.value = pos;
      if (itemFormImageZoom) itemFormImageZoom.value = zoom;
      if (itemFormModalImagePos) itemFormModalImagePos.value = modalPos;
      if (itemFormModalImageZoom) itemFormModalImageZoom.value = modalZoom;

      if (itemFormPreview) {
        itemFormPreview.src = item.image || 'assets/img/ice-cube-previa.jpg';
        applyCropToElement(itemFormPreview, { ...parseImagePosition(pos), zoom });
      }
      if (itemFormModalPreview) {
        itemFormModalPreview.src = item.image || 'assets/img/ice-cube-previa.jpg';
        applyCropToElement(itemFormModalPreview, { ...parseImagePosition(modalPos), zoom: modalZoom });
      }

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

      if (itemFormImagePos) itemFormImagePos.value = '50% 50%';
      if (itemFormImageZoom) itemFormImageZoom.value = 1;
      if (itemFormModalImagePos) itemFormModalImagePos.value = '50% 50%';
      if (itemFormModalImageZoom) itemFormModalImageZoom.value = 1;

      if (itemFormPreview) {
        itemFormPreview.src = 'assets/img/ice-cube-previa.jpg';
        applyCropToElement(itemFormPreview, { x: 50, y: 50, zoom: 1 });
      }
      if (itemFormModalPreview) {
        itemFormModalPreview.src = 'assets/img/ice-cube-previa.jpg';
        applyCropToElement(itemFormModalPreview, { x: 50, y: 50, zoom: 1 });
      }

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
        if (itemFormPreview) {
          itemFormPreview.src = uploadedUrl;
          applyCropToElement(itemFormPreview, { x: 50, y: 50, zoom: 1 });
        }
        if (itemFormModalPreview) {
          itemFormModalPreview.src = uploadedUrl;
          applyCropToElement(itemFormModalPreview, { x: 50, y: 50, zoom: 1 });
        }
        if (itemFormImagePos) itemFormImagePos.value = '50% 50%';
        if (itemFormImageZoom) itemFormImageZoom.value = 1;
        if (itemFormModalImagePos) itemFormModalImagePos.value = '50% 50%';
        if (itemFormModalImageZoom) itemFormModalImageZoom.value = 1;

        showToast('Foto cargada. Ajustá los encuadres');

        // Immediately open the dedicated Instagram-style Cropper Modal
        openPhotoCropper({
          imageUrl: uploadedUrl,
          thumbPos: '50% 50%',
          thumbZoom: 1,
          modalPos: '50% 50%',
          modalZoom: 1,
          context: { mode: 'item-modal' }
        });
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
        imageZoom: itemFormImageZoom ? (parseFloat(itemFormImageZoom.value) || 1) : 1,
        modalImagePosition: itemFormModalImagePos ? itemFormModalImagePos.value.trim() || '50% 50%' : '50% 50%',
        modalImageZoom: itemFormModalImageZoom ? (parseFloat(itemFormModalImageZoom.value) || 1) : 1,
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
          image_zoom: itemData.imageZoom,
          modal_image_position: itemData.modalImagePosition,
          modal_image_zoom: itemData.modalImageZoom,
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

  // ===========================================================================
  // 7. S9: RESERVATIONS, DEPOSIT PROOFS, DOOR QR SCANNER & EVOLUTION API
  // ===========================================================================
  function updateReservationsBadge() {
    if (!adminReservationsBadge || !window.MeryStore) return;
    const reservations = window.MeryStore.getReservations();
    const pendingProofs = reservations.filter((r) => r.deposit_status === 'comprobante_subido').length;
    if (pendingProofs > 0) {
      adminReservationsBadge.textContent = String(pendingProofs);
      adminReservationsBadge.classList.add('kpi-highlight');
      adminReservationsBadge.title = `${pendingProofs} comprobantes de seña pendientes de confirmación`;
    } else {
      adminReservationsBadge.textContent = String(reservations.length);
      adminReservationsBadge.classList.remove('kpi-highlight');
      adminReservationsBadge.title = `${reservations.length} reservas registradas`;
    }
  }

  function renderReservationsWorkspace() {
    if (!sectionsContainer) return;
    activeTab = 'reservations';
    persistActiveTabState();

    if (activeCategoryTitle) activeCategoryTitle.textContent = 'Reservas y Check-in QR';
    if (activeCategoryCount) activeCategoryCount.textContent = 'Control de reservas, comprobantes de seña y acceso en puerta';
    if (btnRenameActiveCat) btnRenameActiveCat.hidden = true;
    if (btnDeleteActiveCat) btnDeleteActiveCat.hidden = true;
    if (btnNewDish) btnNewDish.hidden = true;
    if (adminSearchInput?.parentElement) adminSearchInput.parentElement.hidden = true;

    const allReservations = window.MeryStore ? window.MeryStore.getReservations() : [];
    const daysAvailability = window.MeryStore && typeof window.MeryStore.getAllDaysAvailability === 'function'
      ? window.MeryStore.getAllDaysAvailability()
      : [];

    // KPI Counters
    const totalReservas = allReservations.length;
    const conSena = allReservations.filter((r) => r.deposit_mode === 'con_sena').length;
    const comprobantesPendientes = allReservations.filter((r) => r.deposit_status === 'comprobante_subido').length;
    const asistieron = allReservations.filter((r) => r.attended).length;

    // Filter Logic
    let filtered = allReservations;
    if (activeResFilter === 'Con seña') {
      filtered = filtered.filter((r) => r.deposit_mode === 'con_sena');
    } else if (activeResFilter === 'Comprobantes subidos') {
      filtered = filtered.filter((r) => r.deposit_status === 'comprobante_subido');
    } else if (activeResFilter === 'Sin seña') {
      filtered = filtered.filter((r) => r.deposit_mode === 'sin_sena');
    } else if (activeResFilter === 'Cumpleaños') {
      filtered = filtered.filter((r) => r.is_birthday);
    } else if (activeResFilter === 'Asistieron') {
      filtered = filtered.filter((r) => r.attended);
    }

    if (resSearchQuery) {
      const q = resSearchQuery.toLowerCase();
      filtered = filtered.filter((r) =>
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q) ||
        (r.birthday_dni || '').toLowerCase().includes(q) ||
        (r.customer_phone || '').toLowerCase().includes(q) ||
        (r.customer_email || '').toLowerCase().includes(q)
      );
    }

    const filterOptions = ['Todas', 'Con seña', 'Comprobantes subidos', 'Sin seña', 'Cumpleaños', 'Asistieron'];

    sectionsContainer.innerHTML = `
      <!-- Summary KPI Row -->
      <div class="admin-kpi-row">
        <div class="admin-kpi-card">
          <span class="admin-kpi-num">${totalReservas}</span>
          <span class="admin-kpi-label">Total reservas</span>
        </div>
        <div class="admin-kpi-card">
          <span class="admin-kpi-num">${conSena}</span>
          <span class="admin-kpi-label">Con seña / Lugar asegurado</span>
        </div>
        <div class="admin-kpi-card ${comprobantesPendientes > 0 ? 'kpi-highlight' : ''}">
          <span class="admin-kpi-num">${comprobantesPendientes}</span>
          <span class="admin-kpi-label">Comprobantes por confirmar</span>
        </div>
        <div class="admin-kpi-card">
          <span class="admin-kpi-num">${asistieron}</span>
          <span class="admin-kpi-label">Asistieron (Check-in QR)</span>
        </div>
      </div>

      <!-- Capacity & Availability Overview Strip -->
      <div class="admin-capacity-bar-strip">
        <div class="admin-capacity-title">
          <span class="diamond-dot"></span>
          <span>Disponibilidad por Noche</span>
        </div>
        <div class="admin-capacity-chips">
          ${daysAvailability.map((d) => `
            <div class="admin-capacity-chip ${d.isSoldOut ? 'is-sold-out' : ''}" title="${d.isClosed ? 'Pausado manualmente' : `${d.booked} personas reservadas de ${d.max} (${d.remaining} lugares libres)`}">
              <span class="admin-capacity-chip-name">${escapeHtml(d.day)}</span>
              <span class="admin-capacity-chip-badge ${d.isSoldOut ? 'chip-sold-out' : 'chip-open'}">
                ${d.isClosed ? 'Pausado' : d.isSoldOut ? 'Agotado' : `${d.booked}/${d.max} (${d.remaining} libres)`}
              </span>
            </div>
          `).join('')}
        </div>
        <button type="button" id="btnQuickEditCapacity" class="admin-capacity-edit-btn">
          <span>⚙</span>
          <span>Ajustar cupos</span>
        </button>
      </div>

      <!-- Top Action Bar -->
      <div class="admin-res-action-bar">
        <div class="admin-filter-pills" role="tablist" aria-label="Filtros de reservas">
          ${filterOptions.map((f) => `
            <button
              type="button"
              class="admin-filter-pill ${activeResFilter === f ? 'active' : ''}"
              data-filter="${escapeHtml(f)}"
            >
              ${escapeHtml(f)} ${f === 'Comprobantes subidos' && comprobantesPendientes > 0 ? `(${comprobantesPendientes})` : ''}
            </button>
          `).join('')}
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <input
            type="search"
            id="resWorkspaceSearch"
            class="admin-input"
            style="width:200px; padding:8px 12px; font-size:0.84rem;"
            placeholder="Buscar reserva..."
            value="${escapeHtml(resSearchQuery)}"
          />
          <button type="button" id="btnOpenManualRes" class="admin-btn-gold">
            <span>+</span>
            <span>Nueva reserva manual</span>
          </button>
          <button type="button" id="btnOpenAvailability" class="admin-btn-outline">
            <span>⚙</span>
            <span>Cupos</span>
          </button>
          <button type="button" id="btnOpenQrScanner" class="admin-btn-gold admin-btn-scanner">
            <span>📷</span>
            <span>Escanear QR</span>
          </button>
        </div>
      </div>

      <!-- Reservations Cards List -->
      <div class="admin-res-cards-list">
        ${filtered.length === 0 ? `
          <div style="padding:40px; text-align:center; color:var(--q-cream-muted); background:var(--q-surface); border-radius:12px; border:1px solid var(--q-border);">
            No hay reservas que coincidan con el filtro seleccionado.
          </div>
        ` : filtered.map((r) => {
          const hasProofAlert = (r.deposit_status === 'comprobante_subido');
          return `
            <article class="admin-res-card ${hasProofAlert ? 'has-proof-alert' : ''} ${r.attended ? 'is-attended' : ''}" data-res-id="${escapeHtml(r.id)}">
              <div class="admin-res-header">
                <div class="admin-res-title-group">
                  <span class="admin-res-code">${escapeHtml(r.id)}</span>
                  <h3 class="admin-res-name">${escapeHtml(r.customer_name)}</h3>
                </div>

                <div class="admin-res-badges-wrap">
                  <!-- Deposit mode badge -->
                  <span class="admin-res-badge ${r.deposit_mode === 'con_sena' ? 'admin-badge-deposit-ok' : 'admin-badge-simple'}">
                    ${r.deposit_mode === 'con_sena' ? 'Con seña • Lugar asegurado' : 'Sin seña'}
                  </span>

                  <!-- Deposit status badge -->
                  ${r.deposit_mode === 'con_sena' ? `
                    <span class="admin-res-badge ${
                      r.deposit_status === 'confirmada'
                        ? 'admin-badge-deposit-ok'
                        : r.deposit_status === 'comprobante_subido'
                        ? 'admin-badge-deposit-proof'
                        : 'admin-badge-deposit-pending'
                    }">
                      ${
                        r.deposit_status === 'confirmada'
                          ? 'Seña confirmada ✓'
                          : r.deposit_status === 'comprobante_subido'
                          ? 'Comprobante subido'
                          : 'Seña pendiente'
                      }
                    </span>
                  ` : ''}

                  <!-- Attendance badge -->
                  <span class="admin-res-badge ${r.attended ? 'admin-badge-attended' : 'admin-badge-pending-in'}">
                    ${r.attended
                      ? `✓ Asistió ${r.checked_in_at ? new Date(r.checked_in_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs' : ''}`
                      : 'Pendiente de ingreso'
                    }
                  </span>
                </div>
              </div>

              <div class="admin-res-grid">
                <div>
                  <span class="admin-res-item-label">Teléfono / WhatsApp</span>
                  <span class="admin-res-item-val">${escapeHtml(r.customer_phone || '-')}</span>
                </div>
                <div>
                  <span class="admin-res-item-label">Correo electrónico</span>
                  <span class="admin-res-item-val">${escapeHtml(r.customer_email || '-')}</span>
                </div>
                <div>
                  <span class="admin-res-item-label">Personas</span>
                  <span class="admin-res-item-val">${r.guests} personas</span>
                </div>
                <div>
                  <span class="admin-res-item-label">Día y Horario</span>
                  <span class="admin-res-item-val">${escapeHtml(r.res_day)} • ${escapeHtml(r.res_time)}</span>
                </div>
                <div>
                  <span class="admin-res-item-label">Sector / Motivo</span>
                  <span class="admin-res-item-val">${escapeHtml(r.res_type)}</span>
                </div>
              </div>

              ${r.is_birthday ? `
                <div class="admin-res-bday-tag">
                  <span>🎂</span>
                  <span><strong>Cumpleaños VIP:</strong> DNI: ${escapeHtml(r.birthday_dni || 'No especificado')} • Cumple: ${escapeHtml(r.birthday_date || 'No especificada')}</span>
                </div>
              ` : ''}

              ${r.notes ? `
                <div style="font-size:0.8rem; color:var(--q-cream-muted); background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:6px;">
                  <strong>Notas:</strong> ${escapeHtml(r.notes)}
                </div>
              ` : ''}

              <div class="admin-res-actions">
                ${(r.proof_url || r.deposit_status === 'comprobante_subido') ? `
                  <button type="button" class="admin-btn-gold admin-btn-action-sm" data-res-action="view-proof" data-id="${escapeHtml(r.id)}">
                    Ver comprobante subido
                  </button>
                ` : ''}

                ${r.deposit_mode === 'con_sena' && r.deposit_status !== 'confirmada' ? `
                  <button type="button" class="admin-btn-outline admin-btn-action-sm" data-res-action="approve-deposit" data-id="${escapeHtml(r.id)}">
                    Confirmar seña
                  </button>
                ` : ''}

                <button type="button" class="admin-btn-outline admin-btn-action-sm" data-res-action="toggle-checkin" data-id="${escapeHtml(r.id)}">
                  ${r.attended ? 'Cancelar check-in' : 'Check-in QR (Asistió)'}
                </button>

                <button type="button" class="admin-btn-outline admin-btn-action-sm" data-res-action="view-pass" data-id="${escapeHtml(r.id)}">
                  Ver Pase QR / Link
                </button>

                <button type="button" class="admin-btn-outline admin-btn-danger admin-btn-action-sm" data-res-action="delete-res" data-id="${escapeHtml(r.id)}">
                  Eliminar
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    // Filter pill events
    sectionsContainer.querySelectorAll('.admin-filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        activeResFilter = pill.getAttribute('data-filter') || 'Todas';
        renderReservationsWorkspace();
      });
    });

    // Search input event
    const searchEl = sectionsContainer.querySelector('#resWorkspaceSearch');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        resSearchQuery = searchEl.value.trim();
        renderReservationsWorkspace();
      });
    }

    // Open QR Scanner button
    const btnOpenQr = sectionsContainer.querySelector('#btnOpenQrScanner');
    if (btnOpenQr) {
      btnOpenQr.addEventListener('click', () => {
        openQrScannerModal();
      });
    }

    // Open Manual Reservation modal
    const btnOpenManual = sectionsContainer.querySelector('#btnOpenManualRes');
    if (btnOpenManual) {
      btnOpenManual.addEventListener('click', () => {
        openNewResModal();
      });
    }

    // Open Availability & Capacity modal
    const btnOpenAvail = sectionsContainer.querySelector('#btnOpenAvailability');
    if (btnOpenAvail) {
      btnOpenAvail.addEventListener('click', () => {
        openAvailabilityModal();
      });
    }

    const btnQuickAvail = sectionsContainer.querySelector('#btnQuickEditCapacity');
    if (btnQuickAvail) {
      btnQuickAvail.addEventListener('click', () => {
        openAvailabilityModal();
      });
    }

    // Reservation card action buttons
    sectionsContainer.querySelectorAll('[data-res-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-res-action');
        const resId = btn.getAttribute('data-id');
        const target = allReservations.find((r) => r.id === resId);
        if (!target) return;

        if (action === 'view-proof') {
          openProofModal(target);
        } else if (action === 'approve-deposit') {
          const targetResId = target.id;
          const targetCustomerName = target.customer_name;
          openConfirmModal({
            title: '¿Confirmar seña?',
            message: `¿Confirmar la seña para ${targetCustomerName} (${targetResId})? Esto marcará la reserva como "Lugar asegurado • Seña confirmada".`,
            confirmLabel: 'Sí, confirmar seña',
            successText: '¡Seña confirmada con éxito!',
            onConfirm: () => {
              if (window.MeryStore && typeof window.MeryStore.approveReservationDeposit === 'function') {
                window.MeryStore.approveReservationDeposit(targetResId);
                updateReservationsBadge();
                renderReservationsWorkspace();
              }
            }
          });
        } else if (action === 'toggle-checkin') {
          const nextState = !target.attended;
          const targetResId = target.id;
          const targetCustomerName = target.customer_name;
          openConfirmModal({
            title: nextState ? '¿Confirmar ingreso?' : '¿Cancelar check-in?',
            message: nextState
              ? `¿Confirmar el ingreso en puerta de ${targetCustomerName} (${target.guests} personas)?`
              : `¿Cancelar el check-in de ${targetCustomerName}?`,
            confirmLabel: nextState ? 'Sí, registrar ingreso' : 'Sí, cancelar check-in',
            successText: nextState ? '¡Ingreso registrado con éxito!' : 'Check-in cancelado',
            onConfirm: () => {
              if (window.MeryStore && typeof window.MeryStore.checkInReservation === 'function') {
                window.MeryStore.checkInReservation(targetResId, nextState);
                updateReservationsBadge();
                renderReservationsWorkspace();
              }
            }
          });
        } else if (action === 'view-pass') {
          window.open(`pase.html?id=${encodeURIComponent(target.id)}`, '_blank', 'noopener');
        } else if (action === 'delete-res') {
          openConfirmModal({
            title: `¿Eliminar reserva ${target.id}?`,
            message: `Vas a eliminar la reserva de ${target.customer_name} (${target.res_day} ${target.res_time}). Esta acción no se puede deshacer.`,
            confirmLabel: 'Sí, eliminar',
            onConfirm: () => {
              if (window.MeryStore && typeof window.MeryStore.deleteReservation === 'function') {
                window.MeryStore.deleteReservation(resId);
                showToast(`Reserva ${target.id} eliminada`);
                updateReservationsBadge();
                renderReservationsWorkspace();
              }
            }
          });
        }
      });
    });
  }

  // --- Proof Viewer Modal Logic ---
  function openProofModal(res) {
    if (!adminProofModal || !res) return;
    activeProofRes = res;
    if (adminProofResId) adminProofResId.textContent = res.id;
    if (adminProofCustomerName) adminProofCustomerName.textContent = res.customer_name;
    if (adminProofUploadedAt) {
      adminProofUploadedAt.textContent = res.proof_uploaded_at
        ? new Date(res.proof_uploaded_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
        : 'Reciente';
    }
    if (adminProofImage) {
      adminProofImage.src = res.proof_url || '';
    }
    if (adminProofStatusNotice) {
      adminProofStatusNotice.textContent = res.deposit_status === 'confirmada'
        ? '✓ Esta seña ya fue aprobada y el lugar se encuentra asegurado.'
        : 'Comprobante recibido en revisión. Verificá que los datos de la transferencia concuerden con el monto de la seña antes de confirmar.';
    }
    if (btnApproveProofModal) {
      btnApproveProofModal.hidden = (res.deposit_status === 'confirmada');
    }
    adminProofModal.hidden = false;
  }

  function closeProofModal() {
    if (!adminProofModal) return;
    adminProofModal.hidden = true;
    activeProofRes = null;
  }

  if (btnCloseProofModal) btnCloseProofModal.addEventListener('click', closeProofModal);
  if (btnCancelProofModal) btnCancelProofModal.addEventListener('click', closeProofModal);
  if (adminProofModal) {
    adminProofModal.addEventListener('click', (e) => {
      if (e.target === adminProofModal) closeProofModal();
    });
  }

  if (btnApproveProofModal) {
    btnApproveProofModal.addEventListener('click', () => {
      if (!activeProofRes) return;
      const targetResId = activeProofRes.id;
      const targetCustomerName = activeProofRes.customer_name;

      openConfirmModal({
        title: '¿Confirmar seña?',
        message: `¿Aprobar el comprobante de transferencia y asegurar la mesa para ${targetCustomerName} (${targetResId})?`,
        confirmLabel: 'Sí, confirmar seña',
        successText: '¡Seña confirmada con éxito!',
        onConfirm: () => {
          if (window.MeryStore && typeof window.MeryStore.approveReservationDeposit === 'function') {
            window.MeryStore.approveReservationDeposit(targetResId);
            closeProofModal();
            updateReservationsBadge();
            if (activeTab === 'reservations') renderReservationsWorkspace();
          }
        }
      });
    });
  }

  // --- Audio & Haptic Feedback for QR Scanner ---
  function initScanAudio() {
    try {
      if (!scanAudioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) scanAudioCtx = new AudioContextClass();
      }
      if (scanAudioCtx && scanAudioCtx.state === 'suspended') {
        scanAudioCtx.resume().catch(() => {});
      }
    } catch (_) {}
  }

  function playScanBeep() {
    try {
      initScanAudio();
      if (!scanAudioCtx) return;
      const osc = scanAudioCtx.createOscillator();
      const gain = scanAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, scanAudioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.18, scanAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, scanAudioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(scanAudioCtx.destination);
      osc.start();
      osc.stop(scanAudioCtx.currentTime + 0.14);
    } catch (_) {}
  }

  function triggerScanHaptic() {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate([40, 60, 40]);
      }
    } catch (_) {}
  }

  // --- Door QR Scanner / Check-in Modal Logic ---
  function openQrScannerModal(prefillCode = null) {
    if (!adminQrScannerModal) return;
    adminQrScannerModal.hidden = false;
    document.body.classList.add('modal-open');
    initScanAudio();

    if (qrScanResultBox) qrScanResultBox.hidden = true;
    if (btnConfirmQrCheckIn) {
      btnConfirmQrCheckIn.classList.remove('admin-btn-success');
      btnConfirmQrCheckIn.textContent = 'Confirmar ingreso';
      btnConfirmQrCheckIn.disabled = false;
    }
    if (qrScannerCodeInput) {
      qrScannerCodeInput.value = prefillCode || '';
    }

    const viewport = document.querySelector('.admin-qr-viewport');

    if (prefillCode) {
      stopQrCamera();
      if (qrCameraContainer) qrCameraContainer.hidden = true;
      if (viewport) viewport.classList.add('camera-stopped');
      executeQrSearch(prefillCode);
    } else {
      if (qrCameraContainer) qrCameraContainer.hidden = false;
      if (viewport) viewport.classList.remove('camera-stopped');
      if (qrCameraStatus) qrCameraStatus.textContent = 'Apuntá al código QR del cliente';
      startQrCamera();
      if (qrScannerCodeInput) qrScannerCodeInput.focus();
    }
  }

  function closeQrScannerModal() {
    if (!adminQrScannerModal) return;
    adminQrScannerModal.hidden = true;
    document.body.classList.remove('modal-open');
    stopQrCamera();
    if (qrCameraContainer) qrCameraContainer.hidden = false;
    const viewport = document.querySelector('.admin-qr-viewport');
    if (viewport) viewport.classList.remove('camera-stopped');
    if (qrScanResultBox) qrScanResultBox.hidden = true;
    activeScannedRes = null;
  }

  if (btnCloseQrScannerModal) btnCloseQrScannerModal.addEventListener('click', closeQrScannerModal);
  if (btnDismissQrModal) btnDismissQrModal.addEventListener('click', closeQrScannerModal);
  if (adminQrScannerModal) {
    adminQrScannerModal.addEventListener('click', (e) => {
      if (e.target === adminQrScannerModal) closeQrScannerModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminQrScannerModal && !adminQrScannerModal.hidden) {
      closeQrScannerModal();
    }
  });

  function stopQrCamera() {
    isScanningActive = false;
    if (qrScanAnimId) {
      cancelAnimationFrame(qrScanAnimId);
      qrScanAnimId = null;
    }
    if (qrCameraStream) {
      qrCameraStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      qrCameraStream = null;
    }
    isTorchOn = false;
    if (btnToggleQrTorch) {
      btnToggleQrTorch.classList.remove('active');
      btnToggleQrTorch.setAttribute('aria-pressed', 'false');
      btnToggleQrTorch.style.display = 'none';
    }
    if (qrVideoPreviewEl) {
      qrVideoPreviewEl.srcObject = null;
      qrVideoPreviewEl.remove();
      qrVideoPreviewEl = null;
    }
    if (btnToggleQrCamera) {
      btnToggleQrCamera.textContent = 'Usar cámara del celular / lector';
    }
  }

  async function startQrCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Tu navegador no soporta o no permite acceso a la cámara');
      if (qrCameraStatus) qrCameraStatus.textContent = 'Cámara no soportada';
      return;
    }

    try {
      stopQrCamera();
      isScanningActive = true;
      if (qrCameraContainer) qrCameraContainer.hidden = false;
      const viewport = document.querySelector('.admin-qr-viewport');
      if (viewport) viewport.classList.remove('camera-stopped');

      if (qrCameraStatus) {
        qrCameraStatus.textContent = currentFacingMode === 'environment'
          ? 'Iniciando cámara trasera...'
          : 'Iniciando cámara frontal...';
      }

      qrCameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: currentFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (qrCameraContainer) {
        qrVideoPreviewEl = document.createElement('video');
        qrVideoPreviewEl.className = 'admin-camera-video';
        qrVideoPreviewEl.setAttribute('playsinline', '');
        qrVideoPreviewEl.setAttribute('autoplay', '');
        qrVideoPreviewEl.muted = true;
        qrCameraContainer.prepend(qrVideoPreviewEl);
        qrVideoPreviewEl.srcObject = qrCameraStream;
        await qrVideoPreviewEl.play().catch(() => {});
        qrCameraContainer.hidden = false;
      }

      if (btnToggleQrCamera) {
        btnToggleQrCamera.textContent = 'Detener cámara';
      }

      // Check torch capabilities
      const track = qrCameraStream ? qrCameraStream.getVideoTracks()[0] : null;
      const caps = track && typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
      if (btnToggleQrTorch) {
        if (caps.torch) {
          btnToggleQrTorch.style.display = 'inline-flex';
          btnToggleQrTorch.classList.toggle('active', isTorchOn);
          btnToggleQrTorch.setAttribute('aria-pressed', isTorchOn ? 'true' : 'false');
        } else {
          btnToggleQrTorch.style.display = 'none';
        }
      }

      // Offscreen canvas for frame extraction
      if (!qrCanvasEl) {
        qrCanvasEl = document.createElement('canvas');
        qrCanvasCtx = qrCanvasEl.getContext('2d', { willReadFrequently: true });
      }

      let nativeDetector = null;
      if (typeof window.BarcodeDetector !== 'undefined') {
        try {
          nativeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        } catch (_) {}
      }

      let lastScanTime = 0;

      const scanLoop = async (now) => {
        if (!isScanningActive || !qrCameraStream || !qrVideoPreviewEl) return;

        if (qrVideoPreviewEl.readyState === qrVideoPreviewEl.HAVE_ENOUGH_DATA) {
          const vw = qrVideoPreviewEl.videoWidth;
          const vh = qrVideoPreviewEl.videoHeight;

          if (now - lastScanTime >= 90 && vw > 0 && vh > 0) {
            lastScanTime = now;
            let detected = null;

            // 1. Native BarcodeDetector
            if (nativeDetector) {
              try {
                const barcodes = await nativeDetector.detect(qrVideoPreviewEl);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  detected = barcodes[0].rawValue;
                }
              } catch (_) {}
            }

            // 2. jsQR frame decoding
            if (!detected && typeof window.jsQR === 'function' && qrCanvasCtx) {
              try {
                qrCanvasEl.width = vw;
                qrCanvasEl.height = vh;
                qrCanvasCtx.drawImage(qrVideoPreviewEl, 0, 0, vw, vh);
                const frameData = qrCanvasCtx.getImageData(0, 0, vw, vh);
                const code = window.jsQR(frameData.data, frameData.width, frameData.height, {
                  inversionAttempts: 'dontInvert'
                });
                if (code && code.data) {
                  detected = code.data;
                }
              } catch (_) {}
            }

            if (detected) {
              handleQrDetected(detected);
              return;
            }
          }
        }

        qrScanAnimId = requestAnimationFrame(scanLoop);
      };

      qrScanAnimId = requestAnimationFrame(scanLoop);
    } catch (err) {
      console.warn('Acceso a cámara denegado o error:', err);
      showToast('No se pudo acceder a la cámara: ' + (err.message || 'permiso denegado'));
      if (qrCameraStatus) qrCameraStatus.textContent = 'Cámara no disponible';
    }
  }

  function handleQrDetected(detectedCode) {
    playScanBeep();
    triggerScanHaptic();
    stopQrCamera();
    if (qrCameraContainer) qrCameraContainer.hidden = true;
    const viewport = document.querySelector('.admin-qr-viewport');
    if (viewport) viewport.classList.add('camera-stopped');
    if (qrScannerCodeInput) qrScannerCodeInput.value = detectedCode;
    executeQrSearch(detectedCode);
  }

  async function toggleTorch() {
    if (!qrCameraStream) return;
    const track = qrCameraStream.getVideoTracks()[0];
    if (!track) return;
    const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
    if (!caps.torch) {
      showToast('Tu cámara no soporta linterna');
      return;
    }
    try {
      isTorchOn = !isTorchOn;
      await track.applyConstraints({
        advanced: [{ torch: isTorchOn }]
      });
      if (btnToggleQrTorch) {
        btnToggleQrTorch.classList.toggle('active', isTorchOn);
        btnToggleQrTorch.setAttribute('aria-pressed', isTorchOn ? 'true' : 'false');
      }
    } catch (err) {
      console.warn('Error cambiando linterna:', err);
      showToast('No se pudo cambiar el estado de la linterna');
    }
  }

  if (btnToggleQrTorch) {
    btnToggleQrTorch.addEventListener('click', toggleTorch);
  }

  async function flipCamera() {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    isTorchOn = false;
    if (btnToggleQrTorch) {
      btnToggleQrTorch.classList.remove('active');
      btnToggleQrTorch.setAttribute('aria-pressed', 'false');
      btnToggleQrTorch.style.display = 'none';
    }
    stopQrCamera();
    await startQrCamera();
  }

  if (btnFlipQrCamera) {
    btnFlipQrCamera.addEventListener('click', flipCamera);
  }

  if (btnToggleQrCamera) {
    btnToggleQrCamera.addEventListener('click', () => {
      if (qrCameraStream) {
        stopQrCamera();
      } else {
        startQrCamera();
      }
    });
  }

  if (btnScanAnotherQr) {
    btnScanAnotherQr.addEventListener('click', () => {
      if (qrScanResultBox) qrScanResultBox.hidden = true;
      if (qrScannerCodeInput) qrScannerCodeInput.value = '';
      activeScannedRes = null;
      if (btnConfirmQrCheckIn) {
        btnConfirmQrCheckIn.classList.remove('admin-btn-success');
        btnConfirmQrCheckIn.textContent = 'Confirmar ingreso';
        btnConfirmQrCheckIn.disabled = false;
      }
      if (qrCameraContainer) qrCameraContainer.hidden = false;
      const viewport = document.querySelector('.admin-qr-viewport');
      if (viewport) viewport.classList.remove('camera-stopped');
      if (qrCameraStatus) qrCameraStatus.textContent = 'Apuntá al código QR del cliente';
      startQrCamera();
      if (qrScannerCodeInput) qrScannerCodeInput.focus();
    });
  }

  async function executeQrSearch(rawTerm) {
    if (!rawTerm) return;
    let term = String(rawTerm).trim();
    // Support scanning raw URL or query param like ?checkin=MLP-8492 or ?reserva=MLP-8492
    if (term.includes('checkin=')) {
      term = term.split('checkin=')[1].split('&')[0];
    } else if (term.includes('reserva=')) {
      term = term.split('reserva=')[1].split('&')[0];
    }
    term = decodeURIComponent(term).trim();
    const termLower = term.toLowerCase();
    const termDigits = term.replace(/\D/g, '');

    // Stop camera and hide stage immediately on search
    stopQrCamera();
    if (qrCameraContainer) qrCameraContainer.hidden = true;
    const viewport = document.querySelector('.admin-qr-viewport');
    if (viewport) viewport.classList.add('camera-stopped');

    let list = window.MeryStore ? window.MeryStore.getReservations() : [];
    let found = list.find((r) =>
      (r.id || '').toLowerCase() === termLower ||
      (r.customer_name || '').toLowerCase() === termLower ||
      (termDigits.length >= 6 && (r.birthday_dni || '').replace(/\D/g, '') === termDigits) ||
      (termDigits.length >= 6 && (r.customer_phone || '').replace(/\D/g, '').endsWith(termDigits))
    );

    // If not found locally, fetch from Supabase
    if (!found && window.MeryStore) {
      if (qrCameraStatus) qrCameraStatus.textContent = 'Buscando en Supabase...';
      try {
        if (typeof window.MeryStore.fetchReservationById === 'function') {
          const remoteItem = await window.MeryStore.fetchReservationById(term);
          if (remoteItem) {
            found = remoteItem;
          }
        }
      } catch (_) {}

      if (!found && typeof window.MeryStore.fetchReservationsFromSupabase === 'function') {
        try {
          const freshList = await window.MeryStore.fetchReservationsFromSupabase();
          if (Array.isArray(freshList)) {
            list = freshList;
            found = list.find((r) =>
              (r.id || '').toLowerCase() === termLower ||
              (r.customer_name || '').toLowerCase() === termLower ||
              (termDigits.length >= 6 && (r.birthday_dni || '').replace(/\D/g, '') === termDigits) ||
              (termDigits.length >= 6 && (r.customer_phone || '').replace(/\D/g, '').endsWith(termDigits))
            );
          }
        } catch (_) {}
      }
    }

    if (!found) {
      if (qrScanResultBox) qrScanResultBox.hidden = true;
      showToast('No se encontró ninguna reserva para: ' + rawTerm);
      if (qrCameraStatus) qrCameraStatus.textContent = 'Reserva no encontrada';
      return;
    }

    activeScannedRes = found;
    if (qrCameraStatus) qrCameraStatus.textContent = '✓ Pase VIP verificado';
    if (qrScanResultBox) {
      qrScanResultBox.hidden = false;
      try {
        qrScanResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (_) {}
    }

    if (qrResultCode) qrResultCode.textContent = found.id;
    if (qrResultName) qrResultName.textContent = found.customer_name;
    if (qrResultDepositBadge) {
      qrResultDepositBadge.textContent = found.deposit_mode === 'con_sena'
        ? (found.deposit_status === 'confirmada' ? 'Con seña confirmada ✓' : 'Con seña pendiente')
        : 'Sin seña';
      qrResultDepositBadge.className = found.deposit_mode === 'con_sena' && found.deposit_status === 'confirmada'
        ? 'admin-res-badge admin-badge-deposit-ok'
        : (found.deposit_mode === 'con_sena' ? 'admin-res-badge admin-badge-deposit-pending' : 'admin-res-badge admin-badge-simple');
    }
    if (qrResultType) qrResultType.textContent = found.res_type;
    if (qrResultGuests) qrResultGuests.textContent = `${found.guests} personas`;
    if (qrResultDateTime) qrResultDateTime.textContent = `${found.res_day} • ${found.res_time}`;
    if (qrResultAttendance) {
      if (found.attended) {
        const timeStr = found.checked_in_at
          ? new Date(found.checked_in_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs'
          : '';
        qrResultAttendance.textContent = timeStr ? `✓ Asistió ${timeStr}` : '✓ Asistió';
        qrResultAttendance.style.color = '#2ecc71';
      } else {
        qrResultAttendance.textContent = 'Pendiente de ingreso';
        qrResultAttendance.style.color = 'var(--q-cream-muted)';
      }
    }

    if (qrResultBirthdayNotice) {
      if (found.is_birthday) {
        qrResultBirthdayNotice.hidden = false;
        if (qrResultDni) qrResultDni.textContent = found.birthday_dni || 'No especificado';
      } else {
        qrResultBirthdayNotice.hidden = true;
      }
    }

    if (btnConfirmQrCheckIn) {
      if (found.attended) {
        const timeStr = found.checked_in_at
          ? new Date(found.checked_in_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
          : '';
        btnConfirmQrCheckIn.classList.add('admin-btn-success');
        btnConfirmQrCheckIn.textContent = timeStr ? `✓ ¡Ingreso registrado! (${timeStr} hs)` : '✓ ¡Ingreso registrado!';
      } else {
        btnConfirmQrCheckIn.classList.remove('admin-btn-success');
        btnConfirmQrCheckIn.textContent = 'Confirmar ingreso';
      }
      btnConfirmQrCheckIn.disabled = false;
    }
  }

  if (btnSearchQrCode && qrScannerCodeInput) {
    btnSearchQrCode.addEventListener('click', () => {
      executeQrSearch(qrScannerCodeInput.value);
    });
    qrScannerCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeQrSearch(qrScannerCodeInput.value);
      }
    });
  }

  if (btnConfirmQrCheckIn) {
    btnConfirmQrCheckIn.addEventListener('click', async () => {
      if (!activeScannedRes) return;
      const targetResId = activeScannedRes.id;
      const targetCustomerName = activeScannedRes.customer_name;

      try {
        btnConfirmQrCheckIn.disabled = true;
        let updated = null;
        if (window.MeryStore && typeof window.MeryStore.checkInReservation === 'function') {
          updated = await window.MeryStore.checkInReservation(targetResId, true);
        }

        if (updated) {
          activeScannedRes = updated;
        } else {
          activeScannedRes.attended = true;
          activeScannedRes.checked_in_at = new Date().toISOString();
        }

        const now = new Date(activeScannedRes.checked_in_at || Date.now());
        const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        // Update button style to success green with checkmark
        btnConfirmQrCheckIn.classList.add('admin-btn-success');
        btnConfirmQrCheckIn.textContent = `✓ ¡Ingreso registrado! (${timeStr} hs)`;
        btnConfirmQrCheckIn.disabled = false;

        // Update attendance text on card: "✓ Asistió ${timeStr} hs"
        if (qrResultAttendance) {
          qrResultAttendance.textContent = `✓ Asistió ${timeStr} hs`;
          qrResultAttendance.style.color = '#2ecc71';
        }

        // Play audio beep + haptic vibration
        playScanBeep();
        triggerScanHaptic();

        // Show toast
        showToast(`✓ Ingreso registrado para ${targetCustomerName} (${targetResId})`);

        // Update reservations badge and list in background
        updateReservationsBadge();
        if (activeTab === 'reservations') {
          renderReservationsWorkspace();
        }
      } catch (err) {
        console.error('Error al registrar ingreso:', err);
        btnConfirmQrCheckIn.disabled = false;
        showToast('Error al registrar ingreso: ' + (err.message || err));
      }
    });
  }

  // ===========================================================================
  // 8. S9: WHATSAPP (EVOLUTION API) & DEPOSIT SETTINGS WORKSPACE
  // ===========================================================================
  function stopWaPolling() {
    if (waPollTimer) {
      clearInterval(waPollTimer);
      waPollTimer = null;
    }
  }

  function formatWaPhone(jidOrPhone) {
    if (!jidOrPhone) return '';
    const num = jidOrPhone.split('@')[0].replace(/\D/g, '');
    if (num.startsWith('549')) {
      const area = num.slice(3, 5);
      const p1 = num.slice(5, 9);
      const p2 = num.slice(9);
      return `+54 9 ${area} ${p1}-${p2}`;
    }
    if (num.length >= 10) {
      return `+${num}`;
    }
    return num;
  }

  async function fetchWhatsappStatus() {
    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
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
          return {
            connected: true,
            phone: formatWaPhone(inst.ownerJid || inst.number),
            name: inst.profileName || '',
            pic: inst.profilePicUrl || ''
          };
        }
      }
    } catch (_) {}
    return { connected: false };
  }

  async function renderWhatsappWorkspace() {
    if (!sectionsContainer) return;
    activeTab = 'whatsapp';
    persistActiveTabState();
    stopWaPolling();

    if (activeCategoryTitle) activeCategoryTitle.textContent = 'WhatsApp y Señas';
    if (activeCategoryCount) activeCategoryCount.textContent = 'Vinculación de la línea del bar y datos de seña para clientes';
    if (btnRenameActiveCat) btnRenameActiveCat.hidden = true;
    if (btnDeleteActiveCat) btnDeleteActiveCat.hidden = true;
    if (btnNewDish) btnNewDish.hidden = true;
    if (adminSearchInput?.parentElement) adminSearchInput.parentElement.hidden = true;

    const settings = window.MeryStore ? window.MeryStore.getReservationSettings() : {};
    const serverUrl = (settings.evolutionServerUrl || 'https://mery-la-previa-evolution-api.rsssbm.easypanel.host').replace(/\/+$/, '');
    const apiKey = settings.evolutionApiKey || '429683C4C977415CAAFCCE10F7D57E11';
    const instanceName = settings.evolutionInstanceName || 'mery-la-previa';

    // Show initial loading notice while checking status
    sectionsContainer.innerHTML = `
      <div class="admin-whatsapp-view">
        <article class="admin-settings-card">
          <div class="admin-modal-title-group">
            <span class="diamond-dot"></span>
            <h3 class="admin-settings-title">WhatsApp del Bar</h3>
          </div>
          <div style="display:flex; align-items:center; gap:12px; padding:20px; color:var(--q-cream-muted);">
            <div class="admin-spinner"></div>
            <span>Verificando estado de conexión con WhatsApp...</span>
          </div>
        </article>
      </div>
    `;

    const status = await fetchWhatsappStatus();
    if (activeTab !== 'whatsapp') return;

    sectionsContainer.innerHTML = `
      <div class="admin-whatsapp-view">
        <!-- Card 1: WhatsApp Status -->
        <article class="admin-settings-card">
          <div class="admin-modal-title-group">
            <span class="diamond-dot"></span>
            <h3 class="admin-settings-title">WhatsApp del Bar</h3>
          </div>

          ${status.connected ? `
            <div class="admin-wa-connected-box">
              <div class="admin-wa-profile-group">
                ${status.pic ? `<img src="${escapeHtml(status.pic)}" alt="WhatsApp Avatar" class="admin-wa-avatar" />` : `
                  <div class="admin-wa-avatar-placeholder">
                    <span>📱</span>
                  </div>
                `}
                <div class="admin-wa-details">
                  <div class="admin-wa-status-badge">
                    <span class="live-dot"></span>
                    <span>Conectado y operativo</span>
                  </div>
                  <span class="admin-wa-phone">${escapeHtml(status.phone || 'Línea de WhatsApp vinculada')}</span>
                  ${status.name ? `<span class="admin-wa-profile-name">${escapeHtml(status.name)}</span>` : ''}
                  <p class="admin-wa-meta">
                    Las confirmaciones de reserva, pases de abordaje QR y notificaciones a los clientes se envían automáticamente desde este número de WhatsApp.
                  </p>
                </div>
              </div>

              <div class="admin-wa-status-actions">
                <button type="button" id="btnDisconnectWa" class="admin-btn-outline admin-btn-danger">
                  Desconectar WhatsApp
                </button>
              </div>
            </div>
          ` : `
            <div class="admin-wa-disconnected-box">
              <div class="admin-wa-status-badge" style="color: var(--q-gold);">
                <span class="live-dot" style="background: var(--q-gold); box-shadow: 0 0 8px var(--q-gold);"></span>
                <span>Esperando vinculación</span>
              </div>
              <p class="admin-settings-intro" style="text-align: center; max-width: 500px;">
                Escaneá este código QR con la aplicación de WhatsApp en el teléfono del bar para habilitar los envíos automáticos de reservas y pases de abordaje.
              </p>

              <div class="admin-wa-qr-box">
                <img id="evolutionQrImg" alt="Código QR WhatsApp" class="admin-wa-qr-img" style="display:none;" />
                <div id="evolutionQrLoader" class="admin-wa-qr-loader">
                  <div class="admin-spinner"></div>
                  <span>Generando código QR oficial...</span>
                </div>
              </div>

              <div class="admin-wa-steps-list">
                <span>1. Abrí WhatsApp en el teléfono del bar</span>
                <span>2. Andá a <strong>Dispositivos vinculados</strong> > <strong>Vincular un dispositivo</strong></span>
                <span>3. Apuntá la cámara a este código QR</span>
              </div>

              <button type="button" id="btnRefreshQr" class="admin-btn-outline" style="margin-top: 6px;">
                Actualizar código QR
              </button>
            </div>
          `}
        </article>

        <!-- Card 2: Deposit Bank & Mercado Pago Settings -->
        <article class="admin-settings-card">
          <div class="admin-modal-title-group">
            <span class="diamond-dot"></span>
            <h3 class="admin-settings-title">Datos de Seña Bancaria & Mercado Pago</h3>
          </div>

          <p class="admin-settings-intro">
            Estos datos se muestran en el Pase de Abordaje y en el portal del cliente para que puedan realizar la transferencia y adjuntar su comprobante de pago.
          </p>

          <form id="adminDepositSettingsForm" class="admin-modal-form" style="display:flex; flex-direction:column; gap:14px;">
            <div class="admin-form-grid-2">
              <div class="admin-field">
                <label for="cfgDepositAlias">Alias de Transferencia</label>
                <input
                  type="text"
                  id="cfgDepositAlias"
                  class="admin-input"
                  placeholder="MERY.LAPREVIA.MP"
                  value="${escapeHtml(settings.depositAlias || 'MERY.LAPREVIA.MP')}"
                  required
                />
              </div>

              <div class="admin-field">
                <label for="cfgDepositCbu">CBU / CVU</label>
                <input
                  type="text"
                  id="cfgDepositCbu"
                  class="admin-input"
                  placeholder="0000003100098765432100"
                  value="${escapeHtml(settings.depositCbu || '0000003100098765432100')}"
                  required
                />
              </div>
            </div>

            <div class="admin-form-grid-2">
              <div class="admin-field">
                <label for="cfgDepositHolder">Titular de la Cuenta</label>
                <input
                  type="text"
                  id="cfgDepositHolder"
                  class="admin-input"
                  placeholder="Mery La Previa S.R.L."
                  value="${escapeHtml(settings.depositHolder || 'Mery La Previa S.R.L.')}"
                />
              </div>

              <div class="admin-field">
                <label for="cfgDepositAmount">Monto de Seña Sugerido</label>
                <input
                  type="text"
                  id="cfgDepositAmount"
                  class="admin-input"
                  placeholder="$15.000"
                  value="${escapeHtml(settings.depositAmount || '$15.000')}"
                />
              </div>
            </div>

            <div class="admin-field">
              <label for="cfgDepositPaymentLink">Link de Pago Mercado Pago</label>
              <input
                type="url"
                id="cfgDepositPaymentLink"
                class="admin-input"
                placeholder="https://mpago.la/mery-la-previa"
                value="${escapeHtml(settings.depositPaymentLink || 'https://mpago.la/mery-la-previa')}"
              />
            </div>

            <div style="margin-top:8px;">
              <button type="submit" id="btnSaveDepositSettings" class="admin-btn-gold">
                Guardar datos de seña
              </button>
            </div>
          </form>
        </article>
      </div>
    `;

    // Wire disconnect button if connected
    const btnDisconnect = sectionsContainer.querySelector('#btnDisconnectWa');
    if (btnDisconnect) {
      btnDisconnect.addEventListener('click', () => {
        openConfirmModal({
          title: '¿Desconectar WhatsApp?',
          message: 'Vas a desvincular la línea de WhatsApp del bar. Los clientes no recibirán mensajes automáticos hasta que vuelvas a vincular un teléfono.',
          confirmLabel: 'Sí, desconectar',
          onConfirm: async () => {
            showToast('Desconectando WhatsApp...');
            try {
              await fetch(`${serverUrl}/instance/logout/${instanceName}`, {
                method: 'DELETE',
                headers: { apikey: apiKey }
              });
            } catch (_) {}
            showToast('WhatsApp desvinculado');
            renderWhatsappWorkspace();
          }
        });
      });
    }

    // Wire QR loading & auto-polling if disconnected
    if (!status.connected) {
      const qrImg = sectionsContainer.querySelector('#evolutionQrImg');
      const qrLoader = sectionsContainer.querySelector('#evolutionQrLoader');
      const btnRefresh = sectionsContainer.querySelector('#btnRefreshQr');

      async function fetchQrCode() {
        if (qrLoader) qrLoader.style.display = 'flex';
        if (qrImg) qrImg.style.display = 'none';

        try {
          const resp = await fetch(`${serverUrl}/instance/connect/${instanceName}`, {
            headers: { apikey: apiKey }
          });
          if (resp.ok) {
            const data = await resp.json();
            const b64 = data?.base64 || data?.qrcode?.base64 || '';
            if (b64 && qrImg) {
              qrImg.src = b64;
              qrImg.style.display = 'block';
              if (qrLoader) qrLoader.style.display = 'none';
            }
          }
        } catch (_) {}
      }

      if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
          showToast('Actualizando código QR...');
          fetchQrCode();
        });
      }

      fetchQrCode();

      // Start polling for connection
      waPollTimer = setInterval(async () => {
        if (activeTab !== 'whatsapp') {
          stopWaPolling();
          return;
        }
        const check = await fetchWhatsappStatus();
        if (check.connected) {
          stopWaPolling();
          showToast('✓ WhatsApp conectado con éxito');
          renderWhatsappWorkspace();
        }
      }, 3500);
    }

    // Save Deposit Settings
    const formEl = sectionsContainer.querySelector('#adminDepositSettingsForm');
    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const alias = sectionsContainer.querySelector('#cfgDepositAlias')?.value.trim() || 'MERY.LAPREVIA.MP';
        const cbu = sectionsContainer.querySelector('#cfgDepositCbu')?.value.trim() || '0000003100098765432100';
        const holder = sectionsContainer.querySelector('#cfgDepositHolder')?.value.trim() || 'Mery La Previa S.R.L.';
        const amount = sectionsContainer.querySelector('#cfgDepositAmount')?.value.trim() || '$15.000';
        const paymentLink = sectionsContainer.querySelector('#cfgDepositPaymentLink')?.value.trim() || '';

        if (window.MeryStore && typeof window.MeryStore.saveReservationSettings === 'function') {
          window.MeryStore.saveReservationSettings({
            depositAlias: alias,
            depositCbu: cbu,
            depositHolder: holder,
            depositAmount: amount,
            depositPaymentLink: paymentLink
          });
          showToast('✓ Datos de seña guardados correctamente');
        }
      });
    }
  }

  // --- Real-time Subscription to Reservation Updates ---
  if (window.MeryStore && typeof window.MeryStore.subscribeToReservationChanges === 'function') {
    window.MeryStore.subscribeToReservationChanges((updatedList, event) => {
      updateReservationsBadge();
      if (event) {
        if (event.event === 'PROOF_UPLOADED') {
          showToast(`🔔 Nuevo comprobante de seña subido en reserva ${event.reservationId || ''}`);
        } else if (event.event === 'NEW_RESERVATION') {
          showToast(`🔔 Nueva reserva recibida: ${event.reservation?.customer_name || ''} (${event.reservation?.id || ''})`);
        }
      }
      if (activeTab === 'reservations') {
        renderReservationsWorkspace();
      }
    });
  }

  // Initial badge update
  updateReservationsBadge();
  updateMenuTotalBadge();

  // ===========================================================================
  // 8. AVAILABILITY & MAX CAPACITY MODAL
  // ===========================================================================
  const adminAvailabilityModal = document.getElementById('adminAvailabilityModal');
  const btnCloseAvailModal = document.getElementById('btnCloseAvailModal');
  const btnCancelAvailModal = document.getElementById('btnCancelAvailModal');
  const btnSaveAvailModal = document.getElementById('btnSaveAvailModal');
  const adminAvailDaysList = document.getElementById('adminAvailDaysList');

  function openAvailabilityModal() {
    if (!adminAvailabilityModal || !window.MeryStore) return;
    const days = window.MeryStore.getAllDaysAvailability();

    if (adminAvailDaysList) {
      adminAvailDaysList.innerHTML = days.map((d) => {
        const isHigh = d.percent >= 80 && d.percent < 100;
        const isFull = d.percent >= 100;
        return `
          <div class="admin-avail-day-row" data-day-name="${escapeHtml(d.day)}">
            <div class="admin-avail-day-header">
              <div>
                <span class="admin-avail-day-title">${escapeHtml(d.day)}</span>
                <span style="font-size: 0.8rem; color: var(--q-cream-muted); margin-left: 8px;">
                  ${d.booked} pers. reservadas (${d.remaining} lugares libres)
                </span>
              </div>
              <div class="admin-avail-day-controls">
                <div class="admin-avail-input-wrap">
                  <span>Cupo máx:</span>
                  <input
                    type="number"
                    class="admin-avail-input"
                    data-day-capacity="${escapeHtml(d.day)}"
                    min="0"
                    max="500"
                    value="${d.max}"
                  />
                  <span>pers.</span>
                </div>
                <button
                  type="button"
                  class="admin-avail-toggle-btn ${d.isClosed ? 'is-active-closed' : 'is-active-open'}"
                  data-toggle-day="${escapeHtml(d.day)}"
                  data-closed="${d.isClosed ? 'true' : 'false'}"
                >
                  ${d.isClosed ? '✕ Pausado' : '● Abierto'}
                </button>
              </div>
            </div>
            <div class="admin-avail-progress-track">
              <div
                class="admin-avail-progress-fill ${isFull ? 'is-full' : isHigh ? 'is-high' : ''}"
                style="width: ${d.percent}%;"
              ></div>
            </div>
          </div>
        `;
      }).join('');

      // Toggle button event listeners
      adminAvailDaysList.querySelectorAll('[data-toggle-day]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const isClosed = (btn.getAttribute('data-closed') === 'true');
          const nextClosed = !isClosed;
          btn.setAttribute('data-closed', String(nextClosed));
          btn.className = `admin-avail-toggle-btn ${nextClosed ? 'is-active-closed' : 'is-active-open'}`;
          btn.textContent = nextClosed ? '✕ Pausado' : '● Abierto';
        });
      });
    }

    adminAvailabilityModal.hidden = false;
  }

  function closeAvailabilityModal() {
    if (!adminAvailabilityModal) return;
    adminAvailabilityModal.hidden = true;
  }

  if (btnCloseAvailModal) btnCloseAvailModal.addEventListener('click', closeAvailabilityModal);
  if (btnCancelAvailModal) btnCancelAvailModal.addEventListener('click', closeAvailabilityModal);
  if (adminAvailabilityModal) {
    adminAvailabilityModal.addEventListener('click', (e) => {
      if (e.target === adminAvailabilityModal) closeAvailabilityModal();
    });
  }

  if (btnSaveAvailModal) {
    btnSaveAvailModal.addEventListener('click', () => {
      if (!window.MeryStore) return;
      const settings = window.MeryStore.getReservationSettings();
      const newMaxMap = { ...(settings.maxCapacityPerDay || {}) };
      const closedDays = [];

      adminAvailDaysList?.querySelectorAll('.admin-avail-day-row').forEach((row) => {
        const day = row.getAttribute('data-day-name');
        const input = row.querySelector('[data-day-capacity]');
        const toggle = row.querySelector('[data-toggle-day]');

        if (day && input) {
          newMaxMap[day] = Math.max(0, parseInt(input.value, 10) || 0);
        }
        if (day && toggle && toggle.getAttribute('data-closed') === 'true') {
          closedDays.push(day);
        }
      });

      window.MeryStore.saveReservationSettings({
        maxCapacityPerDay: newMaxMap,
        closedDays
      });

      closeAvailabilityModal();
      showToast('✓ Cupos y disponibilidad actualizados');
      if (activeTab === 'reservations') renderReservationsWorkspace();
    });
  }

  // ===========================================================================
  // 9. MANUAL RESERVATION MODAL (WhatsApp booking / door booking)
  // ===========================================================================
  const adminNewResModal = document.getElementById('adminNewResModal');
  const btnCloseNewResModal = document.getElementById('btnCloseNewResModal');
  const btnCancelNewResModal = document.getElementById('btnCancelNewResModal');
  const adminNewResForm = document.getElementById('adminNewResForm');
  const manualResType = document.getElementById('manualResType');
  const manualResBirthdayRow = document.getElementById('manualResBirthdayRow');
  const manualResDni = document.getElementById('manualResDni');
  const manualResBirthDate = document.getElementById('manualResBirthDate');
  const adminNewResSuccessView = document.getElementById('adminNewResSuccessView');
  const manualSuccessCode = document.getElementById('manualSuccessCode');
  const manualSuccessSummary = document.getElementById('manualSuccessSummary');
  const btnShareManualWhatsapp = document.getElementById('btnShareManualWhatsapp');
  const btnCopyManualPassLink = document.getElementById('btnCopyManualPassLink');
  const btnCopyManualPassText = document.getElementById('btnCopyManualPassText');
  const btnOpenManualPassDirect = document.getElementById('btnOpenManualPassDirect');
  const btnFinishNewResModal = document.getElementById('btnFinishNewResModal');

  function updateManualBirthdayRow() {
    if (!manualResBirthdayRow) return;
    const isBirthday = (manualResType?.value === 'Cumpleaños VIP');
    manualResBirthdayRow.hidden = !isBirthday;
    manualResBirthdayRow.style.display = isBirthday ? 'grid' : 'none';
    if (manualResDni) manualResDni.required = isBirthday;
    if (manualResBirthDate) manualResBirthDate.required = isBirthday;
  }

  if (manualResType) {
    manualResType.addEventListener('change', updateManualBirthdayRow);
  }

  function openNewResModal() {
    if (!adminNewResModal) return;
    activeManualCreatedRes = null;

    if (adminNewResForm) {
      adminNewResForm.reset();
      adminNewResForm.hidden = false;
      adminNewResForm.style.display = 'flex';
      updateManualBirthdayRow();
    }
    if (adminNewResSuccessView) {
      adminNewResSuccessView.hidden = true;
      adminNewResSuccessView.style.display = 'none';
    }

    // Populate manualResDay with remaining spots label
    const daySelect = document.getElementById('manualResDay');
    if (daySelect && window.MeryStore && typeof window.MeryStore.getAllDaysAvailability === 'function') {
      const days = window.MeryStore.getAllDaysAvailability();
      daySelect.innerHTML = days.map((d) => `
        <option value="${escapeHtml(d.day)}">
          ${escapeHtml(d.day)} (${d.isClosed ? 'Pausado' : d.isSoldOut ? 'Agotado' : `${d.remaining} lugares libres`})
        </option>
      `).join('');
    }

    adminNewResModal.hidden = false;
  }

  function closeNewResModal() {
    if (!adminNewResModal) return;
    adminNewResModal.hidden = true;
    activeManualCreatedRes = null;
  }

  if (btnCloseNewResModal) btnCloseNewResModal.addEventListener('click', closeNewResModal);
  if (btnCancelNewResModal) btnCancelNewResModal.addEventListener('click', closeNewResModal);
  if (btnFinishNewResModal) btnFinishNewResModal.addEventListener('click', closeNewResModal);
  if (adminNewResModal) {
    adminNewResModal.addEventListener('click', (e) => {
      if (e.target === adminNewResModal) closeNewResModal();
    });
  }

  if (adminNewResForm) {
    adminNewResForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('manualResName')?.value.trim() || '';
      const phone = document.getElementById('manualResPhone')?.value.trim() || '';
      const email = document.getElementById('manualResEmail')?.value.trim() || '';
      const type = document.getElementById('manualResType')?.value || 'Mesa Cena + Previa';
      const guests = parseInt(document.getElementById('manualResGuests')?.value, 10) || 2;
      const day = document.getElementById('manualResDay')?.value || 'Viernes 13/11';
      const time = document.getElementById('manualResTime')?.value || '20:30 hs (Cena)';
      const depositChoice = document.getElementById('manualResDeposit')?.value || 'confirmada';
      const notes = document.getElementById('manualResNotes')?.value.trim() || '';

      const isBirthday = (type === 'Cumpleaños VIP');
      const dni = isBirthday ? (document.getElementById('manualResDni')?.value.trim() || '') : '';
      const birthDate = isBirthday ? (document.getElementById('manualResBirthDate')?.value.trim() || '') : '';

      if (!name || !phone) {
        showToast('Completá nombre y teléfono del titular');
        return;
      }

      const depositMode = depositChoice === 'sin_sena' ? 'sin_sena' : 'con_sena';
      const depositStatus = depositChoice === 'confirmada' ? 'confirmada' : (depositChoice === 'pendiente' ? 'pendiente' : 'sin_sena');

      try {
        let created = null;
        if (window.MeryStore && typeof window.MeryStore.createReservation === 'function') {
          created = window.MeryStore.createReservation({
            customer_name: name,
            customer_phone: phone,
            customer_email: email,
            res_type: type,
            is_birthday: isBirthday,
            birthday_dni: dni,
            birthday_date: birthDate,
            guests: guests,
            res_day: day,
            res_time: time,
            deposit_mode: depositMode,
            deposit_status: depositStatus,
            notes: notes ? `${notes} (Cargada manualmente desde admin)` : 'Cargada manualmente desde admin',
            fromAdmin: true
          });
        }

        if (created) {
          activeManualCreatedRes = created;

          // Switch to Success View
          if (adminNewResForm) {
            adminNewResForm.hidden = true;
            adminNewResForm.style.display = 'none';
          }
          if (adminNewResSuccessView) {
            adminNewResSuccessView.hidden = false;
            adminNewResSuccessView.style.display = 'block';
          }

          if (manualSuccessCode) manualSuccessCode.textContent = created.id;
          if (manualSuccessSummary) {
            manualSuccessSummary.textContent = `${created.customer_name} • ${created.res_day} ${created.res_time} (${created.guests} personas) • ${depositStatus === 'confirmada' ? 'Seña confirmada ✓' : 'Seña pendiente'}`;
          }

          // Origin URL
          const origin = window.location.origin || 'http://localhost:3000';
          const passUrl = `${origin}/pase.html?id=${encodeURIComponent(created.id)}`;

          if (btnOpenManualPassDirect) {
            btnOpenManualPassDirect.href = passUrl;
          }

          if (btnShareManualWhatsapp) {
            const cleanPhone = created.customer_phone.replace(/\D/g, '');
            const intlPhone = cleanPhone.startsWith('54') ? cleanPhone : (cleanPhone.length >= 10 ? `549${cleanPhone}` : cleanPhone);
            const msg = `¡Hola ${created.customer_name}! 🥂\n` +
              `Ya registramos tu reserva en *Mery La Previa* (${created.id}):\n` +
              `• *Día y Hora:* ${created.res_day} a las ${created.res_time}\n` +
              `• *Sector:* ${created.res_type} (${created.guests} personas)\n` +
              `• *Estado:* ${created.deposit_status === 'confirmada' ? 'Lugar asegurado • Seña confirmada ✓' : 'Reserva registrada'}\n\n` +
              `Acá tenés tu Pase VIP digital para ingresar en puerta:\n${passUrl}\n\n` +
              `¡Te esperamos en la previa! 🎶`;

            btnShareManualWhatsapp.href = `https://wa.me/${intlPhone ? intlPhone : ''}?text=${encodeURIComponent(msg)}`;
          }

          updateReservationsBadge();
          if (activeTab === 'reservations') renderReservationsWorkspace();
        }
      } catch (err) {
        alert('Error al crear reserva: ' + (err.message || err));
      }
    });
  }

  if (btnCopyManualPassLink) {
    btnCopyManualPassLink.addEventListener('click', async () => {
      if (!activeManualCreatedRes) return;
      const origin = window.location.origin || 'http://localhost:3000';
      const passUrl = `${origin}/pase.html?id=${encodeURIComponent(activeManualCreatedRes.id)}`;

      try {
        await navigator.clipboard.writeText(passUrl);
        if (btnCopyManualPassText) btnCopyManualPassText.textContent = '¡Enlace copiado al portapapeles!';
        setTimeout(() => {
          if (btnCopyManualPassText) btnCopyManualPassText.textContent = 'Copiar link del Pase digital';
        }, 2000);
      } catch (_) {
        prompt('Copiá el enlace del Pase VIP:', passUrl);
      }
    });
  }

  // Pending check-in helper
  function checkAndHandlePendingCheckin() {
    const pendingCode = sessionStorage.getItem('mery_pending_checkin') || urlCheckinParam;
    if (pendingCode) {
      sessionStorage.removeItem('mery_pending_checkin');
      openQrScannerModal(pendingCode.trim());
    }
  }

  // --- Initial Auth Check & Dashboard Entry (Executed at end after all handlers are bound) ---
  const isUserAuthenticated = (sessionStorage.getItem(SESSION_AUTH_KEY) === 'true');

  if (isUserAuthenticated) {
    enterDashboard();
    checkAndHandlePendingCheckin();
  } else {
    // Door Check-in Auth Enforcement: If not authenticated, store pending code and show clear notice
    if (urlCheckinParam) {
      sessionStorage.setItem('mery_pending_checkin', urlCheckinParam.trim());
      if (loginNoticeEl) {
        loginNoticeEl.textContent = '🔒 Iniciá sesión como administrador para validar el Pase VIP';
        loginNoticeEl.hidden = false;
      }
    } else {
      const savedPending = sessionStorage.getItem('mery_pending_checkin');
      if (savedPending && loginNoticeEl) {
        loginNoticeEl.textContent = '🔒 Iniciá sesión como administrador para validar el Pase VIP';
        loginNoticeEl.hidden = false;
      }
    }

    const client = window.MeryStore ? window.MeryStore.getClient() : null;
    if (client) {
      client.auth.getSession().then(({ data }) => {
        if (data && data.session) {
          sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
          enterDashboard();
          checkAndHandlePendingCheckin();
        }
      }).catch(() => {});
    }
  }
});
