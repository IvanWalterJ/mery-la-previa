// Curated Menu Catalogue matching @meryjane.laprevia IG Identity
const CARTA_ITEMS = [
  {
    id: 'crimson-coupe-1311',
    category: 'cocktails',
    tag: 'SIGNATURE COCKTAIL • 13/11',
    title: 'La Previa Crimson Coupe (Hielo Sellado)',
    sub: 'Cereza negra, reducción Mery Jane & hielo cristal',
    price: '$12.500',
    desc: 'El trago insignia de nuestro Instagram: gin macerado en cerezas negras, reducción de Mery Jane, vermut rosso especiado y bloque de hielo cristal sellado en vivo.',
    format: 'Copa Coupe + Pinza',
    profile: 'Intenso / Nocturno',
    pairing: 'Mollejas o Bandeja',
    image: 'assets/img/ice-cube-previa.jpg'
  },
  {
    id: 'mery-blanc',
    category: 'vinos',
    tag: 'MERY JANE WINE & FRIENDS',
    title: 'Mery Jane Blanc de Nuit (Botella + Frapera)',
    sub: 'Etiqueta propia • Servido en hielo',
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
    sub: 'Humo de romero y hielo tallado',
    price: '$11.800',
    desc: 'Gin en frutos negros, Campari, vermut de la casa y campana de humo aromático en barra cuando el neón marca las 11:11.',
    format: 'Cristal tallado',
    profile: 'Ahumado / Fuerte',
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
    desc: 'Doradas a fuego fuerte en hierro con emulsión de ajo negro y limón asado. Pensadas para compartir entre tragos.',
    format: 'Ración al centro',
    profile: 'Crocante / Cítrico',
    pairing: 'La Previa Crimson Coupe',
    image: 'assets/img/brand-ig-grid.jpg'
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
    musicTitle: 'Mesa Alta junto a Barra 11:11',
    musicDesc: 'Ubicación ágil en el corazón del bar para pasar de la cena al baile.',
    waText: 'Hola! Quiero reservar el Pack Cumple de 6 a 10 amigos en Mery La Previa'
  },
  imperial: {
    title: 'Mesa Imperial (10 a 18 Amigos)',
    sub: 'Nuestra mesa larga insignia con servicio en fuentes de plata y descorche continuo.',
    img: 'assets/img/steak-flash.jpg',
    drinkTitle: '2 Cajas Mery Jane + 2 Espumantes',
    drinkDesc: 'Servicio de fraperas en toda la mesa + ronda de Crimson Coupes de bienvenida.',
    foodTitle: 'Banquete en Fuentes de Plata',
    foodDesc: 'Doble bandeja de Ojo de Bife y T-Bone + entradas calientes para todo el grupo.',
    accessTitle: 'Lista VIP Anfitrión + 18',
    accessDesc: 'Recepción por anfitriona en puerta y pulseras para circular libremente.',
    musicTitle: 'Sector Central Salón',
    musicDesc: 'Tu mesa se transforma en tu base privada cuando baja la luz a las 23:11 hs.',
    waText: 'Hola! Quiero armar una Mesa Imperial de Cumple (10 a 18 amigos) en Mery La Previa'
  },
  booth: {
    title: 'Living VIP Cabina DJ (18 a 30 Amigos)',
    sub: 'El sector más exclusivo del local pegado al DJ con camarero dedicado toda la noche.',
    img: 'assets/img/dj-previa.jpg',
    drinkTitle: 'Bottle Service + Cajas Mery Jane',
    drinkDesc: 'Crédito integrable en botellas premium, línea completa Mery Jane y coctelería de autor.',
    foodTitle: 'Finger Food Nocturno en Pasos',
    foodDesc: 'Bandejas calientes y frías servidas en formato lounge sin cortar la fiesta.',
    accessTitle: 'Acceso & Estacionamiento VIP',
    accessDesc: 'Lugar reservado en puerta y pulseras Backstage/VIP para todo tu grupo.',
    musicTitle: 'Pegado a la Cabina 11:11',
    musicDesc: 'Vivís el set de electrónica y reggaetón old school desde la primera fila.',
    waText: 'Hola! Quiero reservar un Living VIP junto al DJ (18 a 30 amigos) en Mery La Previa'
  }
};

// Web Audio API Synthesizer for Realistic Glass Neon Tube Ignition (Sparks + Transformer Hum)
let audioCtx = null;
function playNeonIgnitionSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;

    // Helper for short electrical ballast flicker pops/sparks
    function triggerSpark(offsetSec, durationSec, gainLevel) {
      const bufferSize = Math.floor(audioCtx.sampleRate * durationSec);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now + offsetSec);
      filter.Q.setValueAtTime(3.2, now + offsetSec);

      const sparkGain = audioCtx.createGain();
      sparkGain.gain.setValueAtTime(gainLevel, now + offsetSec);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + offsetSec + durationSec);

      noise.connect(filter);
      filter.connect(sparkGain);
      sparkGain.connect(audioCtx.destination);
      noise.start(now + offsetSec);
    }

    // Flicker sparks synchronized with CSS @keyframes neonTubeIgnite (12%, 28%, 52%)
    triggerSpark(0.08, 0.09, 0.28);
    triggerSpark(0.36, 0.07, 0.22);
    triggerSpark(0.72, 0.14, 0.34);

    // 60Hz / 120Hz Neon Transformer Warm Buzz
    const osc60 = audioCtx.createOscillator();
    const osc120 = audioCtx.createOscillator();
    osc60.type = 'sawtooth';
    osc120.type = 'sine';
    osc60.frequency.setValueAtTime(60, now);
    osc120.frequency.setValueAtTime(120, now);

    const humFilter = audioCtx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(340, now);

    const humGain = audioCtx.createGain();
    humGain.gain.setValueAtTime(0.0001, now);
    // Flicker hum bursts
    humGain.gain.setValueAtTime(0.05, now + 0.1);
    humGain.gain.setValueAtTime(0.005, now + 0.22);
    humGain.gain.setValueAtTime(0.04, now + 0.38);
    humGain.gain.setValueAtTime(0.008, now + 0.50);
    // Full lock-in glow hum at 0.75s, then gentle tail fade
    humGain.gain.linearRampToValueAtTime(0.085, now + 0.78);
    humGain.gain.exponentialRampToValueAtTime(0.012, now + 2.4);
    humGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

    osc60.connect(humFilter);
    osc120.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(audioCtx.destination);

    osc60.start(now);
    osc120.start(now);
    osc60.stop(now + 3.65);
    osc120.stop(now + 3.65);
    return true;
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const stageViewport = document.getElementById('stageViewport');
  const btnNeonSound = document.getElementById('btnNeonSound');

  // 1. Trigger Neon Tube Visual Ignition on Load, then reveal menu cards upward at 1.4s
  function triggerNeonSequence(withAudio = false) {
    document.body.classList.remove('neon-lit', 'neon-igniting');
    void document.body.offsetWidth;
    document.body.classList.add('neon-igniting');

    if (withAudio) {
      playNeonIgnitionSound();
    }

    setTimeout(() => {
      document.body.classList.remove('neon-igniting');
      document.body.classList.add('neon-lit');
    }, 1550);

    setTimeout(() => {
      document.body.classList.add('ui-revealed');
    }, 1150);
  }

  triggerNeonSequence(false);

  // Attempt audio ignition on first click anywhere (since browsers block unmuted audio before first gesture)
  let firstAudioPlayed = false;
  window.addEventListener('pointerdown', () => {
    if (!firstAudioPlayed) {
      firstAudioPlayed = true;
      playNeonIgnitionSound();
      if (btnNeonSound) {
        btnNeonSound.innerHTML = '<span>⚡ REPETIR ENCENDIDO NEÓN</span>';
      }
    }
  }, { once: true });

  if (btnNeonSound) {
    btnNeonSound.addEventListener('click', (e) => {
      e.stopPropagation();
      firstAudioPlayed = true;
      triggerNeonSequence(true);
      btnNeonSound.innerHTML = '<span>⚡ NEÓN ENCENDIDO (REPETIR)</span>';
    });
  }

  // 2. Smooth Directional Lateral SLIDE Transitions (Forward = Slide Left, Back = Slide Right)
  let currentScreen = 'home';

  function switchDOMScreen(targetScreen) {
    document.querySelectorAll('.screen-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `screen-${targetScreen}`);
    });
    document.body.classList.toggle('in-section', targetScreen !== 'home');
    currentScreen = targetScreen;
  }

  function navigateSlide(targetScreen) {
    if (targetScreen === currentScreen) return;
    const direction = targetScreen === 'home' ? 'backward' : 'forward';

    // Feature detect View Transitions API per modern-web-guidance (directional-navigation-transitions)
    if (!document.startViewTransition) {
      switchDOMScreen(targetScreen);
      if (stageViewport) {
        stageViewport.classList.remove('slide-enter-right', 'slide-enter-left');
        void stageViewport.offsetWidth;
        stageViewport.classList.add(direction === 'forward' ? 'slide-enter-right' : 'slide-enter-left');
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
      if (target) navigateSlide(target);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentScreen !== 'home') {
      navigateSlide('home');
    }
  });

  // 3. Populate & Filter Dedicated Section 01: La Carta
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

  // 4. Interactive Birthday Configurator (Section 02)
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
