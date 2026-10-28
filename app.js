// Curated Menu Data (Clean, High-Impact, Zero Clutter)
const CARTA_ITEMS = [
  {
    id: 'mery-blanc',
    category: 'vinos',
    tag: 'MERY JANE WINE & FRIENDS',
    title: 'Mery Jane Blanc de Nuit (Botella + Frapera)',
    sub: 'Etiqueta propia • Baja intervención',
    price: '$26.500',
    desc: 'Nuestra etiqueta insignia servida en frapera de plata con hielo cristal. Notas de durazno blanco, jazmín y acidez eléctrica para toda la noche.',
    pairing: '★ Maridaje: Ojo de Bife o Burrata Trufada',
    image: 'assets/img/wine-mery.jpg'
  },
  {
    id: 'ojo-bife-plata',
    category: 'cortes',
    tag: 'BANDEJAS DE PLATA • 750G',
    title: 'Ojo de Bife en Bandeja Imperial',
    sub: 'Con caracú asado y manteca de hierbas',
    price: '$44.000',
    desc: 'Fileteado a punto rouge en fuente de plata con caracú a las brasas, romero fresco y papas triple cocción para picar al centro de la mesa.',
    pairing: '★ Maridaje: Mery Jane Reserva Malbec',
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
    pairing: '★ Maridaje: Mollejas de Corazón Laqueadas',
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
    pairing: '★ Incluye acceso directo al bloque DJ',
    image: 'assets/img/brand-previa-zine.jpg'
  },
  {
    id: 'mollejas-brioche',
    category: 'cortes',
    tag: 'TAPEO DE PREVIA',
    title: 'Mollejas Crocantes & Pan Brioche',
    sub: 'Laqueadas con miel de caña y lima',
    price: '$19.800',
    desc: 'Doradas a fuego fuerte en hierro con emulsión de ajo negro y limón asado. Pensadas para compartir entre tragos.',
    pairing: '★ Maridaje: Mery Jane Blanc de Nuit bien frío',
    image: 'assets/img/brand-ig-grid.jpg'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const stageEl = document.getElementById('dimensionStage');
  const warpCanvas = document.getElementById('warpCanvas');
  const ctx = warpCanvas ? warpCanvas.getContext('2d') : null;

  // 1. 0s -> 2.3s Pure 360° Bottle Video Intro, then smooth upward fade-in of "Mery La Previa" & sections
  setTimeout(() => {
    document.body.classList.add('intro-revealed');
  }, 2200);

  // Also allow clicking anywhere during first 2.2s to reveal immediately if desired
  window.addEventListener('pointerdown', () => {
    document.body.classList.add('intro-revealed');
  }, { once: true });

  // 2. Hyperspace / Time-Warp Canvas Streak Effect
  let warpAnimId = null;
  function playHyperspaceStreaks(direction = 'forward') {
    if (!warpCanvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    warpCanvas.width = window.innerWidth;
    warpCanvas.height = window.innerHeight;
    document.body.classList.add('warping');

    const cx = warpCanvas.width / 2;
    const cy = warpCanvas.height / 2;
    const rays = Array.from({ length: 75 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 15 + Math.random() * 140,
      speed: 22 + Math.random() * 38,
      length: 45 + Math.random() * 120,
      color: Math.random() > 0.35 ? 'rgba(216, 180, 103, 0.75)' : 'rgba(56, 189, 126, 0.7)'
    }));

    const start = performance.now();
    const duration = 640;

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      ctx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);

      // Subtle radial flash burst at center
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, warpCanvas.width * 0.55);
      grad.addColorStop(0, `rgba(216, 180, 103, ${0.22 * (1 - progress)})`);
      grad.addColorStop(0.5, `rgba(16, 65, 42, ${0.18 * (1 - progress)})`);
      grad.addColorStop(1, 'rgba(3, 9, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);

      rays.forEach((r) => {
        const travel = direction === 'forward' ? r.radius + r.speed * (progress * 18) : Math.max(10, (r.radius + 350) - r.speed * (progress * 15));
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

  // 3. Dimensional View Transition Navigation (with Mandatory Progressive Enhancement Fallback)
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

    // Feature detect View Transitions API per modern-web-guidance (directional-navigation-transitions)
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
      // Fallback for engines supporting startViewTransition(callback) without options object
      document.startViewTransition(() => switchDOMScreen(targetScreen));
    }
  }

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-goto');
      if (target) navigateDimension(target);
    });
  });

  // Allow Esc key to warp back to the main portal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentScreen !== 'home') {
      navigateDimension('home');
    }
  });

  // 4. Populate & Filter "La Carta" Green Velvet Showcase
  const selectorListEl = document.getElementById('cartaSelectorList');
  const filterPills = document.querySelectorAll('.carta-pill');
  let activeCategory = 'all';
  let selectedItemId = CARTA_ITEMS[0].id;

  function updateHeroCard(item) {
    const imgEl = document.getElementById('cartaHeroImg');
    const tagEl = document.getElementById('cartaHeroTag');
    const priceEl = document.getElementById('cartaHeroPrice');
    const titleEl = document.getElementById('cartaHeroTitle');
    const descEl = document.getElementById('cartaHeroDesc');
    const pairEl = document.getElementById('cartaHeroPairing');

    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = item.title;
    }
    if (tagEl) tagEl.textContent = item.tag;
    if (priceEl) priceEl.textContent = item.price;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
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
      <button type="button" class="carta-item-btn ${item.id === selectedItemId ? 'active' : ''}" data-item-id="${item.id}">
        <div>
          <span class="carta-item-name">${item.title}</span>
          <span class="carta-item-sub">${item.sub}</span>
        </div>
        <span class="carta-item-price">${item.price}</span>
      </button>
    `).join('');

    const current = CARTA_ITEMS.find((i) => i.id === selectedItemId) || items[0];
    if (current) updateHeroCard(current);

    selectorListEl.querySelectorAll('.carta-item-btn').forEach((btn) => {
      const pick = () => {
        selectedItemId = btn.dataset.itemId;
        selectorListEl.querySelectorAll('.carta-item-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const found = CARTA_ITEMS.find((i) => i.id === selectedItemId);
        if (found) updateHeroCard(found);
      };
      btn.addEventListener('click', pick);
      btn.addEventListener('mouseenter', pick);
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.cat;
      filterPills.forEach((p) => p.classList.toggle('active', p === pill));
      renderCartaList();
    });
  });

  renderCartaList();
});
