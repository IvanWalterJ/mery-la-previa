// Curated Menu Catalogue (Refero Industrial Grid + Mery Jane Green Plinth)
const CARTA_ITEMS = [
  {
    id: 'mery-blanc',
    category: 'vinos',
    tag: 'MERY JANE WINE & FRIENDS',
    title: 'Mery Jane Blanc de Nuit (Botella + Frapera)',
    sub: 'Etiqueta propia • Baja intervención',
    price: '$26.500',
    desc: 'Nuestra etiqueta insignia servida en frapera de plata con hielo cristal. Notas de durazno blanco, jazmín y acidez eléctrica pensada para toda la noche.',
    format: 'Frapera 750ml',
    profile: 'Fresco / Eléctrico',
    pairing: 'Bandeja o Burrata',
    image: 'assets/img/wine-mery.jpg'
  },
  {
    id: 'ojo-bife-plata',
    category: 'cortes',
    tag: 'BANDEJA IMPERIAL • 750G',
    title: 'Ojo de Bife en Fuente de Plata',
    sub: 'Con caracú asado y manteca de hierbas',
    price: '$44.000',
    desc: 'Fileteado a punto rouge en fuente de plata con caracú a las brasas, romero fresco y papas triple cocción para picar al centro antes del DJ set.',
    format: 'Para 2/3 personas',
    profile: 'Brasas / Jugoso',
    pairing: 'Mery Jane Malbec',
    image: 'assets/img/steak-flash.jpg'
  },
  {
    id: 'cocktail-1111',
    category: 'cocktails',
    tag: 'COCKTAILS DE AUTOR 11:11',
    title: '11:11 Smoked Velvet & Negroni Cristal',
    sub: 'Humo de romero y reducción Mery Jane',
    price: '$11.500',
    desc: 'Gin macerado en frutos negros, reducción de vino Mery Jane, pomelo rosado y campana de humo aromático en barra.',
    format: 'Cristal tallado',
    profile: 'Ahumado / Intenso',
    pairing: 'Mollejas Laqueadas',
    image: 'assets/img/cocktails-neon.jpg'
  },
  {
    id: 'pack-previa-cajas',
    category: 'vinos',
    tag: 'RITUAL DE GRUPOS & CUMPLES',
    title: 'Caja "La Previa x4" Mery Jane + Espumante',
    sub: 'Ideal mesas de 6 a 8 amigos',
    price: '$92.000',
    desc: '3 botellas a elección de la línea Mery Jane + 1 Espumante Extra Brut en frapera central para arrancar la previa bien arriba.',
    format: 'Caja 4 Botellas',
    profile: 'Sharing / Previa',
    pairing: 'Tapeo Completo',
    image: 'assets/img/brand-previa-zine.jpg'
  },
  {
    id: 'mollejas-brioche',
    category: 'cortes',
    tag: 'TAPEO DE PREVIA',
    title: 'Mollejas Crocantes & Pan Brioche',
    sub: 'Laqueadas con miel de caña y lima',
    price: '$19.800',
    desc: 'Doradas a fuego fuerte en hierro con emulsión de ajo negro y limón asado. Pensadas para compartir con tenedor corto.',
    format: 'Ración al centro',
    profile: 'Crocante / Cítrico',
    pairing: 'Mery Jane Blanc',
    image: 'assets/img/brand-ig-grid.jpg'
  },
  {
    id: 'spritz-tutto-passa',
    category: 'cocktails',
    tag: 'LOW ABV • TODA LA NOCHE',
    title: 'Tutto Passa Spritz Mediterráneo',
    sub: 'Naranjas sanguíneas, Torrontés y cardamomo',
    price: '$10.200',
    desc: 'Aperitivo fresco y liviano pensado para tomar toda la noche sin pesadez mientras sube el BPM de la cabina.',
    format: 'Copa Balón',
    profile: 'Cítrico / Herbal',
    pairing: 'Burrata & Higos',
    image: 'assets/img/brand-tutto-passa.jpg'
  }
];

// Birthday Configurator Tiers
const BDAY_TIERS = {
  previa: {
    title: 'Pack Previa (6 a 10 Amigos)',
    sub: 'Ideal para arrancar temprano entre amigos con tapeo, caja de vinos y quedarse a bailar.',
    img: 'assets/img/brand-previa-zine.jpg',
    drinkTitle: 'Caja Mery Jane x4 + Frapera',
    drinkDesc: '3 etiquetas Mery Jane + 1 Espumante Extra Brut de regalo para el brindis de las 00:00 hs.',
    foodTitle: 'Tapeo de Previa al Centro',
    foodDesc: 'Mollejas crocantes, burrata trufada y bandeja de ojo de bife fileteado para picar.',
    accessTitle: 'QR Directo sin Fila',
    accessDesc: 'Tus invitados entran por acceso prioritario toda la noche sin demora en puerta.',
    musicTitle: 'Mesa Alta junto a Barra',
    musicDesc: 'Ubicación ágil en el corazón del bar para pasar de la cena al baile.',
    waText: 'Hola! Quiero reservar el Pack Cumple de 6 a 10 amigos en Mery La Previa'
  },
  imperial: {
    title: 'Mesa Imperial (10 a 18 Amigos)',
    sub: 'Nuestra mesa larga insignia con servicio en fuentes de plata y descorche continuo.',
    img: 'assets/img/steak-flash.jpg',
    drinkTitle: '2 Cajas Mery Jane + 2 Espumantes',
    drinkDesc: 'Servicio de fraperas en toda la mesa + jarra de cocktails de bienvenida.',
    foodTitle: 'Banquete en Fuentes de Plata',
    foodDesc: 'Doble bandeja de Ojo de Bife y T-Bone + entradas calientes para todo el grupo.',
    accessTitle: 'Lista VIP Anfitrión + 18',
    accessDesc: 'Recepción por anfitriona en puerta y pulseras para circular libremente.',
    musicTitle: 'Sector Central Salón',
    musicDesc: 'Tu mesa se transforma en tu base privada cuando baja la luz a las 23:30 hs.',
    waText: 'Hola! Quiero armar una Mesa Imperial de Cumple (10 a 18 amigos) en Mery La Previa'
  },
  booth: {
    title: 'Living VIP Cabina DJ (18 a 30 Amigos)',
    sub: 'El sector más exclusivo del local pegado al DJ con camarero dedicado toda la noche.',
    img: 'assets/img/dj-previa.jpg',
    drinkTitle: 'Bottle Service + Cajas Mery Jane',
    drinkDesc: 'Crédito integrable en botellas premium, línea completa Mery Jane y Red Bull / tónicas.',
    foodTitle: 'Finger Food Nocturno en Pasos',
    foodDesc: 'Bandejas calientes y frías servidas en formato lounge sin cortar la fiesta.',
    accessTitle: 'Acceso & Estacionamiento VIP',
    accessDesc: 'Lugar reservado en puerta y pulseras Backstage/VIP para todo tu grupo.',
    musicTitle: 'Pegado a la Cabina 11:11',
    musicDesc: 'Vivís el set de electrónica y reggaetón old school desde la primera fila.',
    waText: 'Hola! Quiero reservar un Living VIP junto al DJ (18 a 30 amigos) en Mery La Previa'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const stageEl = document.getElementById('dimensionStage');
  const warpCanvas = document.getElementById('warpCanvas');
  const ctx = warpCanvas ? warpCanvas.getContext('2d') : null;

  // 1. 0s -> 2.1s Pure 360° Bottle Video Intro, then smooth upward reveal of "Mery La Previa" & sections
  setTimeout(() => {
    document.body.classList.add('intro-revealed');
  }, 2100);

  window.addEventListener('pointerdown', () => {
    document.body.classList.add('intro-revealed');
  }, { once: true });

  // 2. Hyperspace / Time-Warp Canvas Streak Effect (Lime Voltage + Parchment Streaks)
  let warpAnimId = null;
  function playHyperspaceStreaks(direction = 'forward') {
    if (!warpCanvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    warpCanvas.width = window.innerWidth;
    warpCanvas.height = window.innerHeight;
    document.body.classList.add('warping');

    const cx = warpCanvas.width / 2;
    const cy = warpCanvas.height / 2;
    const rays = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 12 + Math.random() * 130,
      speed: 24 + Math.random() * 42,
      length: 50 + Math.random() * 130,
      color: Math.random() > 0.3 ? 'rgba(159, 232, 112, 0.85)' : 'rgba(244, 241, 234, 0.7)'
    }));

    const start = performance.now();
    const duration = 620;

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      ctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);

      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, warpCanvas.width * 0.55);
      grad.addColorStop(0, `rgba(159, 232, 112, ${0.24 * (1 - progress)})`);
      grad.addColorStop(0.5, `rgba(16, 48, 28, ${0.2 * (1 - progress)})`);
      grad.addColorStop(1, 'rgba(5, 10, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);

      rays.forEach((r) => {
        const travel = direction === 'forward'
          ? r.radius + r.speed * (progress * 18)
          : Math.max(8, (r.radius + 360) - r.speed * (progress * 15));
        const x1 = cx + Math.cos(r.angle) * travel;
        const y1 = cy + Math.sin(r.angle) * travel;
        const x2 = cx + Math.cos(r.angle) * (travel + r.length * (1 + progress));
        const y2 = cy + Math.sin(r.angle) * (travel + r.length * (1 + progress));

        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      if (progress < 1) {
        warpAnimId = requestAnimationFrame(frame);
      } else {
        document.body.classList.remove('warping');
        ctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
      }
    }

    if (warpAnimId) cancelAnimationFrame(warpAnimId);
    warpAnimId = requestAnimationFrame(frame);
  }

  // 3. Dimensional View Transition Navigation
  let currentScreen = 'home';

  function switchDOMScreen(targetScreen) {
    document.querySelectorAll('.screen-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `screen-${targetScreen}`);
    });
    document.body.classList.toggle('in-dimension', targetScreen !== 'home');
    currentScreen = targetScreen;
  }

  function navigateDimension(targetScreen) {
    if (targetScreen === currentScreen) return;
    const direction = targetScreen === 'home' ? 'backward' : 'forward';

    playHyperspaceStreaks(direction);

    if (!document.startViewTransition) {
      switchDOMScreen(targetScreen);
      if (stageEl) {
        stageEl.classList.remove('warp-anim-forward', 'warp-anim-backward');
        void stageEl.offsetWidth;
        stageEl.classList.add(direction === 'forward' ? 'warp-anim-forward' : 'warp-anim-backward');
      }
      return;
    }

    try {
      document.startViewTransition({
        update: () => switchDOMScreen(targetScreen),
        types: [direction]
      });
    } catch {
      document.startViewTransition(() => switchDOMScreen(targetScreen));
    }
  }

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-goto');
      if (target) navigateDimension(target);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentScreen !== 'home') {
      navigateDimension('home');
    }
  });

  // 4. Populate & Filter Dedicated Section 01: La Carta
  const selectorListEl = document.getElementById('cartaSelectorList');
  const filterTabs = document.querySelectorAll('.carta-tab-btn');
  let activeCategory = 'all';
  let selectedItemId = CARTA_ITEMS[0].id;

  function updateHeroCard(item) {
    const imgEl = document.getElementById('cartaHeroImg');
    const tagEl = document.getElementById('cartaHeroTag');
    const priceEl = document.getElementById('cartaHeroPrice');
    const titleEl = document.getElementById('cartaHeroTitle');
    const descEl = document.getElementById('cartaHeroDesc');
    const fmtEl = document.getElementById('cartaSpecFormat');
    const profEl = document.getElementById('cartaSpecProfile');
    const pairEl = document.getElementById('cartaSpecPairing');

    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = item.title;
    }
    if (tagEl) tagEl.textContent = item.tag;
    if (priceEl) priceEl.textContent = item.price;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    if (fmtEl) fmtEl.textContent = item.format;
    if (profEl) profEl.textContent = item.profile;
    if (pairEl) pairEl.textContent = item.pairing;
  }

  function renderCartaList() {
    if (!selectorListEl) return;
    const items = activeCategory === 'all'
      ? CARTA_ITEMS
      : CARTA_ITEMS.filter((i) => i.category === activeCategory);

    if (!items.some((i) => i.id === selectedItemId) && items.length > 0) {
      selectedItemId = items[0].id;
    }

    selectorListEl.innerHTML = items.map((item) => `
      <button type="button" class="carta-row-item ${item.id === selectedItemId ? 'active' : ''}" data-item-id="${item.id}">
        <img class="carta-row-thumb" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div>
          <span class="carta-row-title">${item.title}</span>
          <span class="carta-row-sub">${item.sub}</span>
        </div>
        <span class="carta-row-price">${item.price}</span>
      </button>
    `).join('');

    const current = CARTA_ITEMS.find((i) => i.id === selectedItemId) || items[0];
    if (current) updateHeroCard(current);

    selectorListEl.querySelectorAll('.carta-row-item').forEach((btn) => {
      const pick = () => {
        selectedItemId = btn.dataset.itemId;
        selectorListEl.querySelectorAll('.carta-row-item').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const found = CARTA_ITEMS.find((i) => i.id === selectedItemId);
        if (found) updateHeroCard(found);
      };
      btn.addEventListener('click', pick);
      btn.addEventListener('mouseenter', pick);
    });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.cat;
      filterTabs.forEach((t) => t.classList.toggle('active', t === tab));
      renderCartaList();
    });
  });

  renderCartaList();

  // 5. Interactive Birthday Configurator (Section 02)
  const tierBtns = document.querySelectorAll('.tier-btn');
  tierBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierKey = btn.dataset.tier;
      const data = BDAY_TIERS[tierKey];
      if (!data) return;

      tierBtns.forEach((b) => b.classList.toggle('active', b === btn));

      document.getElementById('bdaySummaryTitle').textContent = data.title;
      document.getElementById('bdaySummarySub').textContent = data.sub;
      document.getElementById('bdayPreviewImg').src = data.img;
      document.getElementById('perkDrinkTitle').textContent = data.drinkTitle;
      document.getElementById('perkDrinkDesc').textContent = data.drinkDesc;
      document.getElementById('perkFoodTitle').textContent = data.foodTitle;
      document.getElementById('perkFoodDesc').textContent = data.foodDesc;
      document.getElementById('perkAccessTitle').textContent = data.accessTitle;
      document.getElementById('perkAccessDesc').textContent = data.accessDesc;
      document.getElementById('perkMusicTitle').textContent = data.musicTitle;
      document.getElementById('perkMusicDesc').textContent = data.musicDesc;
      document.getElementById('bdayWhatsappBtn').href = `https://wa.me/5491100000000?text=${encodeURIComponent(data.waText)}`;
    });
  });
});
