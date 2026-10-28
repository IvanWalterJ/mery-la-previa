// Menu Data for "LA PREVIA DE MERY" (Mery Jane - Wine & Friends)
const MENU_ITEMS = [
  {
    id: 'ojo-bife-bandeja',
    category: 'cortes',
    categoryLabel: 'Cortes & Bandejas de Plata',
    badge: 'Hit de Previa • Para Compartir',
    title: 'Ojo de Bife en Bandeja Imperial (750g)',
    price: '$44.000',
    unit: 'Para 2/3 personas',
    shortDesc: 'Fileteado a punto rouge en bandeja de alpaca con caracú asado, manteca de hierbas ahumadas y papas triple cocción.',
    story: 'Inspirado en las cenas largas que se transforman en pista. Sale en bandeja de plata fría y caliente para picar con tenedor directo al centro de la mesa antes de que suba el BPM del DJ.',
    image: 'assets/img/steak-flash.jpg',
    meters: { intensidad: 92, ahumado: 85, sharing: 100 },
    pairing: 'Mery Jane Reserva Malbec Orgánico o Negroni 11:11 Ahumado'
  },
  {
    id: 'tbone-tutto-passa',
    category: 'cortes',
    categoryLabel: 'Cortes & Bandejas de Plata',
    badge: 'Dry Aged 35 Días',
    title: 'T-Bone "Tutto Passa" a las Brasas',
    price: '$52.000',
    unit: 'Corte 900g al centro',
    shortDesc: 'Maduración controlada, gremolata cítrica, ajos confitados en oliva virgen y pimientos del padrón.',
    story: 'El corte insignia de la casa. Sellado a fuego fuerte con leña de espinillo para lograr costra crocante y corazón jugoso.',
    image: 'assets/img/brand-ig-grid.jpg',
    meters: { intensidad: 96, ahumado: 90, sharing: 95 },
    pairing: 'Cabernet Franc de Altura + Copa de bienvenida en barra'
  },
  {
    id: 'mery-jane-blanc',
    category: 'vinos',
    categoryLabel: 'Mery Jane Wine & Friends',
    badge: 'Etiqueta Propia • Est. 2024',
    title: 'Mery Jane Blanc de Nuit (Botella + Frapera)',
    price: '$26.500',
    unit: 'Servicio en mesa o barra',
    shortDesc: 'Blend blanco fresco de baja intervención, notas de durazno blanco, jazmín y acidez eléctrica ideal para arrancar la previa.',
    story: 'Nuestra etiqueta insignia nacida para tomar bien frío entre amigos. Ligero, peligroso y diseñado para transitar desde la cena hasta el set de electrónica.',
    image: 'assets/img/wine-mery.jpg',
    meters: { intensidad: 68, ahumado: 20, sharing: 100 },
    pairing: 'Crudo de Pesca Blanca, Burrata Trufada o Bandeja de Quesos'
  },
  {
    id: 'combo-cajas-previa',
    category: 'vinos',
    categoryLabel: 'Mery Jane Wine & Friends',
    badge: 'Pack Cumpleaños / VIP',
    title: 'Ritual "La Previa x4" (Caja Mery Jane + Espumante)',
    price: '$92.000',
    unit: 'Ideal grupos 6 a 8 amigos',
    shortDesc: '3 botellas a elección de línea Mery Jane + 1 Baron B Extra Brut + agua con gas libre toda la cena.',
    story: 'El ritual con el que arrancan las mesas de cumpleaños en Canning y San Vicente. Incluye bengalas frías y brindis en cabina.',
    image: 'assets/img/brand-previa-zine.jpg',
    meters: { intensidad: 88, ahumado: 30, sharing: 100 },
    pairing: 'Degustación de Tapeo de Previa completo'
  },
  {
    id: 'cocktail-1111',
    category: 'cocktails',
    categoryLabel: 'Cocktails de Autor 11:11',
    badge: 'Signature Drink • Humo & Neón',
    title: '11:11 Smoked Velvet (Pide un Deseo)',
    price: '$11.500',
    unit: 'Autoría de Barra',
    shortDesc: 'Gin macerado en frutos rojos negros, reducción de vino Mery Jane, cordial de pomelo rosado y humo de romero en campana.',
    story: 'Cuando el reloj del salón marca las 11:11, la barra baja las luces y saca esta reversión nocturna. Intenso, fotogénico y equilibrado.',
    image: 'assets/img/cocktails-neon.jpg',
    meters: { intensidad: 86, ahumado: 94, sharing: 65 },
    pairing: 'Mollejas crocantes con miel de caña y lima'
  },
  {
    id: 'spritz-costa',
    category: 'cocktails',
    categoryLabel: 'Cocktails de Autor 11:11',
    badge: 'Low ABV • Para Toda la Noche',
    title: 'Tutto Passa Spritz Mediterráneo',
    price: '$10.200',
    unit: 'Copa balón cristal',
    shortDesc: 'Aperitivo artesanal de naranjas sanguíneas, Mery Jane Torrontés seco, soda botánica de cardamomo y aceituna verde.',
    story: 'Pensado al estilo de las grandes barras de Costanera y Europa: fresco, aromático y liviano para bailar hasta las 4 AM.',
    image: 'assets/img/brand-tutto-passa.jpg',
    meters: { intensidad: 62, ahumado: 15, sharing: 85 },
    pairing: 'Croquetas de jamón crudo y provoleta estacionada'
  },
  {
    id: 'tapeo-mollejas',
    category: 'tapeo',
    categoryLabel: 'Tapeo de Previa',
    badge: 'Platito Estrella',
    title: 'Mollejas de Corazón Laqueadas & Brioche',
    price: '$19.800',
    unit: 'Ración al centro',
    shortDesc: 'Doradas a la plancha de hierro, reducción de aceto balsámico añejo, emulsión de ajo negro y pan brioche tostado.',
    story: 'Textura crocante por fuera y mantecosa por dentro. Diseñado para comer con la mano o tenedor corto mientras suena el warm-up.',
    image: 'assets/img/steak-flash.jpg',
    meters: { intensidad: 90, ahumado: 82, sharing: 95 },
    pairing: 'Mery Jane Pinot Noir frío o Negroni Clásico'
  },
  {
    id: 'burrata-trufa',
    category: 'tapeo',
    categoryLabel: 'Tapeo de Previa',
    badge: 'Veggie Luxury',
    title: 'Burrata Cremosa, Higos & Aceite de Trufa Negra',
    price: '$21.500',
    unit: 'Para compartir',
    shortDesc: 'Burrata artesanal sobre focaccia de masa madre, pistachos tostados, miel picante y escamas de sal marina.',
    story: 'El contraste dulce-salado perfecto para abrir el apetito con una copa de blanco frío en los livings.',
    image: 'assets/img/wine-mery.jpg',
    meters: { intensidad: 74, ahumado: 35, sharing: 92 },
    pairing: 'Mery Jane Blanc de Nuit'
  }
];

// Top-layer animation feature detection per modern-web-guidance (animate-to-from-top-layer)
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
}

async function closeTopLayer(dialogEl) {
  if (!dialogEl) return;
  if (!supportsTopLayerExit()) {
    dialogEl.setAttribute('data-closing', '');
    const animations = dialogEl.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000)),
      ]);
    }
    if (!dialogEl.hasAttribute('data-closing')) return;
    dialogEl.removeAttribute('data-closing');
  }
  dialogEl.close();
}

// Initialize Interactive Showcase
document.addEventListener('DOMContentLoaded', () => {
  const spotlightCursor = document.getElementById('cursorSpotlight');
  const protoTabs = document.querySelectorAll('.proto-tab');
  const protoViews = document.querySelectorAll('.proto-view');

  // 1. Ambient Cursor Spotlight
  window.addEventListener('pointermove', (e) => {
    if (!spotlightCursor) return;
    spotlightCursor.style.left = `${e.clientX}px`;
    spotlightCursor.style.top = `${e.clientY}px`;
  });

  // 2. Switch between the 3 Dark Design Prototypes
  function activatePrototype(protoId) {
    protoTabs.forEach((btn) => {
      const isMatch = btn.dataset.proto === protoId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    protoViews.forEach((view) => {
      const isMatch = view.id === `view-${protoId}`;
      view.classList.toggle('active', isMatch);
    });

    document.body.dataset.theme = protoId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protoTabs.forEach((btn) => {
    btn.addEventListener('click', () => activatePrototype(btn.dataset.proto));
  });

  // 3. Render & Filter the Interactive Sensory Menu
  const menuListEl = document.getElementById('menuCardsList');
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  let activeCategory = 'all';
  let activeDishId = MENU_ITEMS[0].id;

  function updateSpotlight(dish) {
    const imgEl = document.getElementById('spotlightImg');
    const flashEl = document.getElementById('spotlightFlash');
    const catEl = document.getElementById('spotlightCat');
    const priceEl = document.getElementById('spotlightPrice');
    const titleEl = document.getElementById('spotlightTitle');
    const storyEl = document.getElementById('spotlightStory');
    const pairingEl = document.getElementById('spotlightPairing');
    const mIntensidad = document.getElementById('meterIntensidad');
    const mAhumado = document.getElementById('meterAhumado');
    const mSharing = document.getElementById('meterSharing');

    if (flashEl) {
      flashEl.classList.remove('trigger');
      void flashEl.offsetWidth;
      flashEl.classList.add('trigger');
    }

    if (imgEl) {
      imgEl.src = dish.image;
      imgEl.alt = dish.title;
    }
    if (catEl) catEl.textContent = dish.categoryLabel;
    if (priceEl) priceEl.textContent = dish.price;
    if (titleEl) titleEl.textContent = dish.title;
    if (storyEl) storyEl.textContent = dish.story;
    if (pairingEl) pairingEl.textContent = dish.pairing;
    if (mIntensidad) mIntensidad.style.width = `${dish.meters.intensidad}%`;
    if (mAhumado) mAhumado.style.width = `${dish.meters.ahumado}%`;
    if (mSharing) mSharing.style.width = `${dish.meters.sharing}%`;
  }

  function renderMenuCards() {
    if (!menuListEl) return;
    const filtered = activeCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

    if (!filtered.some((i) => i.id === activeDishId) && filtered.length > 0) {
      activeDishId = filtered[0].id;
    }

    menuListEl.innerHTML = filtered.map((item) => `
      <article class="dish-row-card ${item.id === activeDishId ? 'active' : ''}" data-dish-id="${item.id}" tabindex="0" role="button" aria-label="Ver detalle de ${item.title}">
        <img class="dish-row-thumb" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div>
          <div class="dish-row-meta">
            <span class="dish-badge">${item.badge}</span>
          </div>
          <h3 class="dish-row-title">${item.title}</h3>
          <p class="dish-row-desc">${item.shortDesc}</p>
        </div>
        <div class="dish-row-price">
          ${item.price}
          <small>${item.unit}</small>
        </div>
      </article>
    `).join('');

    const currentDish = MENU_ITEMS.find((i) => i.id === activeDishId) || filtered[0];
    if (currentDish) updateSpotlight(currentDish);

    menuListEl.querySelectorAll('.dish-row-card').forEach((card) => {
      const selectDish = () => {
        activeDishId = card.dataset.dishId;
        menuListEl.querySelectorAll('.dish-row-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const chosen = MENU_ITEMS.find((i) => i.id === activeDishId);
        if (chosen) updateSpotlight(chosen);
      };
      card.addEventListener('click', selectDish);
      card.addEventListener('mouseenter', selectDish);
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectDish();
        }
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
      renderMenuCards();
    });
  });

  renderMenuCards();

  // 4. 3D Subtle Tilt on the Sticky Dish Spotlight Panel
  const spotlightPanel = document.getElementById('dishSpotlightPanel');
  if (spotlightPanel) {
    spotlightPanel.addEventListener('pointermove', (e) => {
      const rect = spotlightPanel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      spotlightPanel.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    spotlightPanel.addEventListener('pointerleave', () => {
      spotlightPanel.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 5. Scroll to Interactive Menu triggers
  document.querySelectorAll('[data-scroll-menu]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const menuSection = document.getElementById('cartaInteractiva');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 6. Native <dialog closedby="any"> Modals + Mandatory Safari/Legacy Light-Dismiss Fallback
  const dialogs = document.querySelectorAll('dialog.luxury-modal');
  dialogs.forEach((dialog) => {
    // Fallback for browsers without closedby support (per modern-web-guidance: light-dismiss-a-dialog)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        closeTopLayer(dialog);
      });
    }

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeTopLayer(dialog);
    });

    dialog.querySelectorAll('[data-close-modal]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => closeTopLayer(dialog));
    });
  });

  document.querySelectorAll('[data-open-modal]').forEach((opener) => {
    opener.addEventListener('click', () => {
      const targetId = opener.getAttribute('data-open-modal');
      const modal = document.getElementById(targetId);
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      }
    });
  });

  // 7. Interactive WhatsApp / VIP Booking Simulation inside modals
  document.querySelectorAll('.vip-booking-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedbackEl = form.querySelector('.form-feedback');
      if (feedbackEl) {
        feedbackEl.textContent = '¡Solicitud VIP lista! Redirigiendo al Concierge de WhatsApp de La Previa...';
        feedbackEl.style.color = '#d8b467';
      }
      setTimeout(() => {
        const parentDialog = form.closest('dialog');
        if (parentDialog) closeTopLayer(parentDialog);
        if (feedbackEl) feedbackEl.textContent = '';
      }, 1500);
    });
  });
});
