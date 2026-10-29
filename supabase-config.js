/**
 * MERY LA PREVIA — Supabase & Real-Time Menu Data Layer
 *
 * Para conectar tu proyecto nuevo de Supabase:
 * 1. Ejecutá el archivo `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase.
 * 2. Pegá tu SUPABASE_URL y SUPABASE_ANON_KEY abajo (o configuralos desde /admin.html -> Conexión Supabase).
 */
const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON_KEY = '';

const STORAGE_KEY_MENU = 'mery_menu_sections_v2';
const STORAGE_KEY_SUPA_CFG = 'mery_supabase_config_v1';
const STORAGE_KEY_VIDEOS = 'mery_site_videos_v1';
const STORAGE_KEY_RESERVATIONS = 'mery_reservations_v1';
const STORAGE_KEY_RES_SETTINGS = 'mery_reservation_settings_v1';
const BROADCAST_CHANNEL_NAME = 'mery_la_previa_realtime_v1';
const IDB_NAME = 'mery_media_idb_v1';
const IDB_STORE = 'media';

const DEFAULT_RESERVATION_SETTINGS = {
  depositAlias: 'MERY.LAPREVIA.MP',
  depositCbu: '0000003100098765432100',
  depositHolder: 'Mery La Previa S.R.L.',
  depositAmount: '$15.000',
  depositPaymentLink: 'https://mpago.la/mery-la-previa',
  evolutionServerUrl: 'https://n8n-hotdetailing-evolution-api.rsssbm.easypanel.host',
  evolutionApiKey: '429683C4C977415CAAFCCE10F7D57E11',
  evolutionInstanceName: 'mery-la-previa',
  whatsappConnected: false
};

const DEFAULT_RESERVATIONS = [
  {
    id: 'MLP-8492',
    customer_name: 'Agustina Di Marco',
    customer_email: 'agustina.dimarco@example.com',
    customer_phone: '11 6234-9812',
    res_type: 'Cumpleaños VIP',
    is_birthday: true,
    birthday_dni: '41.890.312',
    birthday_date: '1999-11-14',
    guests: 10,
    res_day: 'Viernes 13/11',
    res_time: '22:00 hs (Cena Tardía)',
    deposit_mode: 'con_sena',
    deposit_status: 'comprobante_subido',
    proof_url: 'assets/img/ice-cube-previa.jpg',
    proof_uploaded_at: '2025-11-13T19:30:00.000Z',
    attended: false,
    checked_in_at: null,
    notes: 'Festejo de 25 años. Solicitó caja Mery Jane y ubicación cercana a la cabina de DJ.',
    created_at: '2025-11-13T18:00:00.000Z',
    updated_at: '2025-11-13T19:30:00.000Z'
  },
  {
    id: 'MLP-4105',
    customer_name: 'Mateo Benítez',
    customer_email: 'mateo.benitez@example.com',
    customer_phone: '11 4123-5566',
    res_type: 'Mesa Cena + Previa',
    is_birthday: false,
    birthday_dni: '',
    birthday_date: '',
    guests: 4,
    res_day: 'Sábado',
    res_time: '20:30 hs (Cena)',
    deposit_mode: 'sin_sena',
    deposit_status: 'sin_sena',
    proof_url: '',
    proof_uploaded_at: null,
    attended: false,
    checked_in_at: null,
    notes: 'Cena y cócteles de autor. Tolerancia de 15 minutos en puerta.',
    created_at: '2025-11-13T17:15:00.000Z',
    updated_at: '2025-11-13T17:15:00.000Z'
  }
];

const DEFAULT_SITE_VIDEOS = {
  intro: 'assets/video/neon-intro-mery.mp4',
  main: 'assets/video/bottle-360-loop.mp4',
  previa: 'assets/video/ice-cube-1311.mp4'
};

// Initial curated menu with rich detail copy for the Dish Detail Modal
const DEFAULT_MENU_SECTIONS = [
  {
    id: 'cocktails',
    title: 'Cocktails 11:11',
    sort_order: 1,
    items: [
      {
        id: 'crimson-coupe',
        name: 'La Previa Crimson Coupe',
        badge: '★',
        price: '$12.500',
        desc: 'Gin macerado en cerezas negras, reducción de vino Mery Jane, vermut rosso especiado y bloque de hielo cristal sellado en vivo con pinzas de plata.',
        detailCopy: 'El cocktail insignia que da inicio al ritual de Mery La Previa. Maceramos cerezas negras patagónicas durante 48 horas con botánicos cítricos y lo integramos con una reducción tibia de nuestro Malbec Mery Jane. Se sirve sobre cristal tallado con un bloque de hielo traslúcido sellado en barra frente a vos.',
        pairing: 'Ideal para abrir la noche en barra a las 20:30 hs o acompañar mollejas crocantes.',
        tags: ['Autor 11:11', 'Hielo Sellado en Vivo', 'Perfil Frutal & Especiado'],
        image: 'assets/img/ice-cube-previa.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 'smoked-velvet',
        name: '11:11 Smoked Velvet',
        badge: '★',
        price: '$11.800',
        desc: 'Campari, gin botánico, cordial de pomelo rosado y campana de humo de romero quemado en barra cuando el neón marca las 11:11.',
        detailCopy: 'Una reversión nocturna y sedosa del clásico aperitivo italiano. Equilibramos el amargor elegante del Campari con un cordial casero de pomelo rosado asado y gin de enebro salvaje. Al servirlo, encerramos la copa en una campana de cristal con humo denso de romero fresco y corteza de naranja.',
        pairing: 'Perfecto para la transición entre la cena y el primer set de DJ.',
        tags: ['Ahumado en Barra', 'Cítrico & Herbal', 'Favorito 11:11'],
        image: 'assets/img/cocktails-neon.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 'tutto-passa-spritz',
        name: 'Tutto Passa Spritz',
        badge: '◇',
        price: '$10.200',
        desc: 'Aperitivo artesanal de naranjas sanguíneas, Mery Jane Torrontés seco, soda botánica de cardamomo y aceituna verde en copa balón.',
        detailCopy: 'Fresco, vibrante y eléctrico. Elaborado sobre la base de nuestro Mery Jane blanco bien frío, sumamos un bitter artesanal de naranjas sanguíneas y burbuja fina con toque de cardamomo. Coronado con piel de cítricos y aceituna verde carnosa.',
        pairing: 'Refrescante de principio a fin, pensado para brindar en grupo en el sector living.',
        tags: ['Fresco & Burbujeante', 'Copa Balón', 'Base Mery Jane'],
        image: 'assets/img/brand-tutto-passa.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      }
    ]
  },
  {
    id: 'cortes',
    title: 'Carnes & Tapeo',
    sort_order: 2,
    items: [
      {
        id: 'ojo-de-bife-imperial',
        name: 'Ojo de Bife en Bandeja Imperial',
        badge: '★',
        price: '$44.000',
        desc: '750g fileteados a punto rouge en fuente de plata con caracú asado a las brasas, manteca de hierbas ahumadas y papas triple cocción para compartir.',
        detailCopy: 'Nuestro corte emblema pensado para el centro de la mesa. Seleccionamos ojo de bife de pastura de 750 gramos, sellado a fuego vivo en quebracho colorado para lograr costra dorada y corazón jugoso a punto rouge. Llega trinchado en bandeja imperial de plata junto a un hueso de caracú braseado, manteca batida de hierbas ahumadas y papas triple cocción ultra crocantes.',
        pairing: 'Pensado para compartir entre 2 a 3 personas junto a un Mery Jane Reserva Malbec Orgánico.',
        tags: ['Para Compartir (750g)', 'Brasas de Quebracho', 'Bandeja de Plata'],
        image: 'assets/img/steak-flash.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 'mollejas-crocantes',
        name: 'Mollejas Crocantes & Brioche',
        badge: '★',
        price: '$19.800',
        desc: 'Doradas a la plancha de hierro con miel de caña, lima asada, emulsión de ajo negro y pan brioche tostado para picar al centro.',
        detailCopy: 'Mollejas de corazón limpias y confitadas lentamente antes de pasar por plancha de hierro al rojo vivo, logrando un exterior ultra crocante y un interior tierno y mantecoso. Se laquean al final con un toque sutil de miel de caña y jugo de lima asada, servidas sobre tostón de brioche artesanal con puntos de emulsión de ajo negro fermentado.',
        pairing: 'El tapeo obligado para abrir la mesa mientras llegan los primeros tragos de autor.',
        tags: ['Tapeo al Centro', 'Plancha de Hierro', 'Ajo Negro & Lima'],
        image: 'assets/img/cocktails-neon.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 't-bone-madurado',
        name: 'T-Bone Madurado "La Previa"',
        badge: '◇',
        price: '$52.000',
        desc: 'Corte de 900g con hueso madurado 35 días, gremolata cítrica, ajos confitados en oliva virgen y pimientos del padrón.',
        detailCopy: 'Dos texturas nobles unidas por el hueso en T: la terneza absoluta del lomo y el sabor profundo del bife angosto, madurados en cámara durante 35 días para concentrar su carácter. Asado a las brasas y terminado con gremolata fresca de perejil y limón, cabezas de ajo dulces confitadas en aceite de oliva virgen extra y pimientos del padrón.',
        pairing: 'Corte de colección para mesas que buscan una cena potente antes del club.',
        tags: ['Maduración 35 Días', '900g con Hueso', 'Edición Limitada'],
        image: 'assets/img/steak-flash.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      }
    ]
  },
  {
    id: 'vinos',
    title: 'Mery Jane Wines',
    sort_order: 3,
    items: [
      {
        id: 'mery-jane-blanc',
        name: 'Mery Jane Blanc de Nuit (Frapera)',
        badge: '★',
        price: '$26.500',
        desc: 'Nuestra etiqueta insignia servida bien fría en frapera de plata. Notas de durazno blanco, jazmín y acidez eléctrica ideal para toda la noche.',
        detailCopy: 'Creado especialmente para la noche de Mery La Previa. Un blanco aromático, tenso y sumamente refrescante que se toma bien frío desde la cena hasta que arranca la cabina de DJ. Llega a tu mesa en frapera labrada con hielo cristal para mantener su temperatura exacta.',
        pairing: 'Versátil y magnético: acompaña tanto tapeo caliente como brindis de medianoche.',
        tags: ['Servicio en Frapera', 'Etiqueta Insignia', 'Fresco & Aromático'],
        image: 'assets/img/wine-mery.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 'ritual-caja-previa',
        name: 'Ritual "Caja La Previa x4" + Brut',
        badge: '★',
        price: '$92.000',
        desc: 'Caja de 3 botellas Mery Jane a elección + 1 Espumante Extra Brut en mesa. El ritual favorito para grupos de amigos y festejos de cumpleaños.',
        detailCopy: 'La experiencia completa para mesas de amigos y festejos VIP. Incluye nuestra icónica caja Mery Jane con 3 etiquetas a elección (Blanc de Nuit o Reserva Malbec) más una botella de Espumante Extra Brut para el brindis de las 00:00 hs, servida en mesa con bengalas y frapera.',
        pairing: 'Recomendado para grupos de 6 a 12 amigos en previa o cumpleaños.',
        tags: ['Pack 4 Botellas', 'Especial Cumpleaños', 'Incluye Extra Brut'],
        image: 'assets/img/brand-previa-zine.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      },
      {
        id: 'mery-jane-malbec',
        name: 'Mery Jane Reserva Malbec Orgánico',
        badge: '◇',
        price: '$29.000',
        desc: 'Tinto de perfil moderno y fluido, ciruelas negras, pimienta rosa y paso de terciopelo pensado para acompañar carnes en bandeja.',
        detailCopy: 'Proveniente de viñedos orgánicos de altura en Valle de Uco, este Malbec busca fluidez y elegancia por encima de la madera pesada. Expresa fruta negra nítida, violetas y un final especiado muy amable que invita a la segunda copa.',
        pairing: 'El compañero indiscutido del Ojo de Bife en Bandeja Imperial y el T-Bone Madurado.',
        tags: ['Valle de Uco', 'Orgánico', 'Taninos de Terciopelo'],
        image: 'assets/img/bottle-hero-isolated.jpg',
        imagePosition: '50% 50%',
        imageZoom: 1,
        modalImagePosition: '50% 50%',
        modalImageZoom: 1,
        available: true
      }
    ]
  }
];

(function initMeryStore(global) {
  let supabaseClient = null;
  let realtimeChannel = null;
  let broadcastChannel = null;

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  } catch (_) {}

  function getSupabaseConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUPA_CFG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url && parsed.anonKey) {
          return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
        }
      }
    } catch (_) {}

    if (global.MERY_SUPABASE_CONFIG && global.MERY_SUPABASE_CONFIG.url && global.MERY_SUPABASE_CONFIG.anonKey) {
      return {
        url: global.MERY_SUPABASE_CONFIG.url.trim(),
        anonKey: global.MERY_SUPABASE_CONFIG.anonKey.trim()
      };
    }

    return {
      url: DEFAULT_SUPABASE_URL.trim(),
      anonKey: DEFAULT_SUPABASE_ANON_KEY.trim()
    };
  }

  function setSupabaseConfig(url, anonKey) {
    const clean = { url: (url || '').trim(), anonKey: (anonKey || '').trim() };
    localStorage.setItem(STORAGE_KEY_SUPA_CFG, JSON.stringify(clean));
    supabaseClient = null;
    return getClient();
  }

  function isSupabaseConfigured() {
    const cfg = getSupabaseConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('http'));
  }

  function getClient() {
    if (supabaseClient) return supabaseClient;
    const cfg = getSupabaseConfig();
    if (!cfg.url || !cfg.anonKey || !global.supabase || typeof global.supabase.createClient !== 'function') {
      return null;
    }
    try {
      supabaseClient = global.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return supabaseClient;
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      return null;
    }
  }

  function cloneDefaultSections() {
    return JSON.parse(JSON.stringify(DEFAULT_MENU_SECTIONS));
  }

  function getLocalSections() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MENU);
      if (!raw) return cloneDefaultSections();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((sec) => ({
          ...sec,
          items: (sec.items || []).map((it) => ({
            ...it,
            imagePosition: it.imagePosition || '50% 50%',
            imageZoom: typeof it.imageZoom === 'number' ? it.imageZoom : 1,
            modalImagePosition: it.modalImagePosition || it.imagePosition || '50% 50%',
            modalImageZoom: typeof it.modalImageZoom === 'number' ? it.modalImageZoom : (typeof it.imageZoom === 'number' ? it.imageZoom : 1)
          }))
        }));
      }
    } catch (_) {}
    return cloneDefaultSections();
  }

  function saveLocalSections(sections, notify = true) {
    try {
      const serialized = JSON.stringify(sections);
      localStorage.setItem(STORAGE_KEY_MENU, serialized);
      if (notify && broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'MENU_UPDATED',
          sections,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Error saving menu locally:', err);
    }
  }

  async function fetchMenuSections() {
    const client = getClient();
    if (!client) {
      return getLocalSections();
    }

    try {
      const [catRes, itemRes] = await Promise.all([
        client.from('menu_categories').select('*').order('sort_order', { ascending: true }),
        client.from('menu_items').select('*').order('sort_order', { ascending: true })
      ]);

      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;

      const categories = catRes.data || [];
      const items = itemRes.data || [];

      if (categories.length === 0) {
        return getLocalSections();
      }

      const sections = categories.map((cat) => ({
        id: cat.slug || cat.id,
        db_id: cat.id,
        title: cat.title,
        sort_order: cat.sort_order ?? 1,
        items: items
          .filter((it) => it.category_id === (cat.slug || cat.id) || it.category_id === cat.id)
          .map((it) => ({
            id: it.id,
            name: it.name,
            badge: it.badge || '★',
            price: it.price,
            desc: it.short_desc || '',
            detailCopy: it.detail_copy || it.short_desc || '',
            pairing: it.pairing_note || '',
            tags: Array.isArray(it.tags) ? it.tags : [],
            image: it.image_url || 'assets/img/ice-cube-previa.jpg',
            imagePosition: it.image_position || '50% 50%',
            imageZoom: typeof it.image_zoom === 'number' ? it.image_zoom : (parseFloat(it.image_zoom) || 1),
            modalImagePosition: it.modal_image_position || it.image_position || '50% 50%',
            modalImageZoom: typeof it.modal_image_zoom === 'number' ? it.modal_image_zoom : (parseFloat(it.modal_image_zoom) || 1),
            available: it.available !== false,
            sort_order: it.sort_order ?? 1
          }))
      }));

      saveLocalSections(sections, false);
      return sections;
    } catch (err) {
      console.warn('Fallback to local menu sections:', err.message || err);
      return getLocalSections();
    }
  }

  function subscribeToMenuChanges(onUpdate) {
    if (typeof onUpdate !== 'function') return () => {};

    // 1. Instant cross-tab BroadcastChannel listener
    const handleBroadcast = (event) => {
      if (event.data && event.data.type === 'MENU_UPDATED' && Array.isArray(event.data.sections)) {
        onUpdate(event.data.sections);
      }
    };
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    // 2. LocalStorage cross-tab event listener
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY_MENU && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) onUpdate(parsed);
        } catch (_) {}
      }
    };
    global.addEventListener('storage', handleStorage);

    // 3. Supabase Realtime postgres_changes + broadcast channel
    const client = getClient();
    if (client) {
      try {
        realtimeChannel = client
          .channel('mery-menu-realtime-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'menu_items' },
            async () => {
              const fresh = await fetchMenuSections();
              saveLocalSections(fresh, true);
              onUpdate(fresh);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'menu_categories' },
            async () => {
              const fresh = await fetchMenuSections();
              saveLocalSections(fresh, true);
              onUpdate(fresh);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime subscription notice:', err);
      }
    }

    return () => {
      if (broadcastChannel) broadcastChannel.removeEventListener('message', handleBroadcast);
      global.removeEventListener('storage', handleStorage);
      if (realtimeChannel && client) {
        client.removeChannel(realtimeChannel);
      }
    };
  }

  async function seedSupabaseIfEmpty() {
    const client = getClient();
    if (!client) return { ok: false, reason: 'no-client' };

    const sections = getLocalSections();
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      await client.from('menu_categories').upsert({
        slug: sec.id,
        title: sec.title,
        sort_order: i + 1
      }, { onConflict: 'slug' });

      for (let j = 0; j < sec.items.length; j++) {
        const it = sec.items[j];
        await client.from('menu_items').upsert({
          id: it.id,
          category_id: sec.id,
          name: it.name,
          badge: it.badge || '★',
          price: it.price,
          short_desc: it.desc || '',
          detail_copy: it.detailCopy || it.desc || '',
          pairing_note: it.pairing || '',
          tags: Array.isArray(it.tags) ? it.tags : [],
          image_url: it.image || 'assets/img/ice-cube-previa.jpg',
          image_position: it.imagePosition || '50% 50%',
          image_zoom: typeof it.imageZoom === 'number' ? it.imageZoom : 1,
          modal_image_position: it.modalImagePosition || it.imagePosition || '50% 50%',
          modal_image_zoom: typeof it.modalImageZoom === 'number' ? it.modalImageZoom : 1,
          available: it.available !== false,
          sort_order: j + 1
        }, { onConflict: 'id' });
      }
    }
    return { ok: true };
  }

  function compressImageToWebP(file, maxDim = 1200, quality = 0.86) {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined' || typeof Image === 'undefined') {
        return resolve({ blob: file, dataUrl: '' });
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          const dataUrl = canvas.toDataURL('image/webp', quality);
          if (typeof canvas.toBlob === 'function') {
            canvas.toBlob((blob) => {
              resolve({ blob: blob || file, dataUrl });
            }, 'image/webp', quality);
          } else {
            resolve({ blob: file, dataUrl });
          }
        };
        img.onerror = () => resolve({ blob: file, dataUrl: e.target.result });
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadDishImage(file) {
    if (!file) throw new Error('No se seleccionó ningún archivo');
    const { blob, dataUrl } = await compressImageToWebP(file, 1200, 0.86);
    const client = getClient();

    if (client) {
      try {
        const fileName = `dishes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        const { error: uploadError } = await client.storage
          .from('menu-images')
          .upload(fileName, blob, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: true
          });

        if (!uploadError) {
          const { data } = client.storage.from('menu-images').getPublicUrl(fileName);
          if (data && data.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase Storage upload fallback to local compressed image:', err.message || err);
      }
    }

    return dataUrl || 'assets/img/ice-cube-previa.jpg';
  }

  // ---------------------------------------------------------------------------
  // OPTIMIZED SECTION VIDEOS MANAGEMENT (Supabase Storage + IndexedDB fallback)
  // ---------------------------------------------------------------------------
  function openMediaDB() {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(null);
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function saveBlobToIDB(key, blob) {
    const db = await openMediaDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put({ key, blob, updatedAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  async function getBlobFromIDB(key) {
    const db = await openMediaDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.blob : null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function deleteBlobFromIDB(key) {
    const db = await openMediaDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  async function getSiteVideos() {
    let current = { ...DEFAULT_SITE_VIDEOS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          current = { ...current, ...parsed };
        }
      }
    } catch (_) {}

    // Check IndexedDB binary blobs for offline / local-stored videos
    for (const slotKey of ['intro', 'main', 'previa']) {
      try {
        const blob = await getBlobFromIDB(`video_${slotKey}`);
        if (blob && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          current[slotKey] = URL.createObjectURL(blob);
        }
      } catch (_) {}
    }

    return current;
  }

  function saveSiteVideos(videos, notify = true) {
    try {
      const cleanToStore = {};
      for (const [k, v] of Object.entries(videos || {})) {
        if (typeof v === 'string' && !v.startsWith('blob:')) {
          cleanToStore[k] = v;
        }
      }
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(cleanToStore));

      if (notify && broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'VIDEOS_UPDATED',
          videos,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.warn('Error saving site videos:', err);
    }
  }

  function subscribeToVideoChanges(onUpdate) {
    if (typeof onUpdate !== 'function') return () => {};

    const handleBroadcast = (event) => {
      if (event.data && event.data.type === 'VIDEOS_UPDATED' && event.data.videos) {
        onUpdate(event.data.videos);
      }
    };
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY_VIDEOS && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed) onUpdate({ ...DEFAULT_SITE_VIDEOS, ...parsed });
        } catch (_) {}
      }
    };
    global.addEventListener('storage', handleStorage);

    return () => {
      if (broadcastChannel) broadcastChannel.removeEventListener('message', handleBroadcast);
      global.removeEventListener('storage', handleStorage);
    };
  }

  async function uploadSectionVideo(slotKey, file) {
    if (!file) throw new Error('No se seleccionó ningún archivo de video');
    const validSlot = ['intro', 'main', 'previa'].includes(slotKey);
    if (!validSlot) throw new Error('Slot de video inválido: ' + slotKey);

    const client = getClient();
    const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '');
    const mimeType = file.type || (ext === 'webm' ? 'video/webm' : 'video/mp4');

    if (client) {
      try {
        const fileName = `videos/${slotKey}-${Date.now()}.${ext}`;
        const { error: uploadError } = await client.storage
          .from('menu-images')
          .upload(fileName, file, {
            contentType: mimeType,
            cacheControl: '31536000',
            upsert: true
          });

        if (!uploadError) {
          const { data } = client.storage.from('menu-images').getPublicUrl(fileName);
          if (data && data.publicUrl) {
            const currentVideos = await getSiteVideos();
            currentVideos[slotKey] = data.publicUrl;
            saveSiteVideos(currentVideos, true);
            await deleteBlobFromIDB(`video_${slotKey}`);
            return { ok: true, url: data.publicUrl };
          }
        }
      } catch (err) {
        console.warn('Supabase video upload fallback to IndexedDB blob:', err.message || err);
      }
    }

    // Binary Blob storage in IndexedDB (never in localStorage to prevent 5MB storage limits/bloat)
    await saveBlobToIDB(`video_${slotKey}`, file);
    const objectUrl = typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(file)
      : '';
    const currentVideos = await getSiteVideos();
    currentVideos[slotKey] = objectUrl;

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'VIDEOS_UPDATED',
        videos: currentVideos,
        timestamp: Date.now()
      });
    }

    return { ok: true, url: objectUrl };
  }

  async function restoreSectionVideo(slotKey) {
    await deleteBlobFromIDB(`video_${slotKey}`);
    const current = await getSiteVideos();
    current[slotKey] = DEFAULT_SITE_VIDEOS[slotKey] || '';

    try {
      const raw = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (raw) {
        const parsed = JSON.parse(raw);
        delete parsed[slotKey];
        localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(parsed));
      }
    } catch (_) {}

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'VIDEOS_UPDATED',
        videos: current,
        timestamp: Date.now()
      });
    }

    return { ok: true, url: current[slotKey] };
  }

  // ===========================================================================
  // S9: QR CODE GENERATOR (100% Offline, Self-Contained)
  // ===========================================================================
  const QRMath = {
    EXP: new Uint8Array(512),
    LOG: new Uint8Array(256),
    init: function() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        this.EXP[i] = x;
        this.EXP[i + 255] = x;
        this.LOG[x] = i;
        x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
      }
    },
    glog: function(n) { return this.LOG[n]; },
    gexp: function(n) { while (n < 0) n += 255; while (n >= 255) n -= 255; return this.EXP[n]; }
  };
  QRMath.init();

  function QRPolynomial(num, shift) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Uint8Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.num[i] = num[offset + i];
  }
  QRPolynomial.prototype = {
    get: function(i) { return this.num[i]; },
    getLength: function() { return this.num.length; },
    multiply: function(e) {
      const num = new Uint8Array(this.getLength() + e.getLength() - 1);
      for (let i = 0; i < this.getLength(); i++) {
        for (let j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function(e) {
      if (this.getLength() - e.getLength() < 0) return this;
      const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      const num = new Uint8Array(this.getLength());
      for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (let i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    }
  };

  function getErrorCorrectPolynomial(errorCorrectLength) {
    let a = new QRPolynomial(new Uint8Array([1]), 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial(new Uint8Array([1, QRMath.gexp(i)]), 0));
    }
    return a;
  }

  const RS_TABLE = [
    // 1: L, M, Q, H
    [[1, 26, 19]], [[1, 26, 16]], [[1, 26, 13]], [[1, 26, 9]],
    // 2
    [[1, 44, 34]], [[1, 44, 28]], [[1, 44, 22]], [[1, 44, 16]],
    // 3
    [[1, 70, 55]], [[1, 70, 44]], [[2, 35, 17]], [[2, 35, 13]],
    // 4
    [[1, 100, 80]], [[2, 50, 32]], [[2, 50, 24]], [[4, 25, 9]],
    // 5
    [[1, 134, 108]], [[2, 67, 43]], [[2, 33, 15], [2, 34, 16]], [[2, 33, 11], [2, 34, 12]],
    // 6
    [[2, 86, 68]], [[4, 43, 27]], [[4, 43, 19]], [[4, 43, 15]]
  ];

  const ALIGNMENT_PATTERN_POS = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34]
  ];

  function getBCHDigit(data) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }

  function getBCHTypeInfo(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(1335) >= 0) {
      d ^= (1335 << (getBCHDigit(d) - getBCHDigit(1335)));
    }
    return ((data << 10) | d) ^ 0x5412;
  }

  function generateQrMatrix(text) {
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
      let c = text.charCodeAt(i);
      if (c < 128) bytes.push(c);
      else if (c < 2048) bytes.push(192 | (c >> 6), 128 | (c & 63));
      else bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
    const len = bytes.length;
    let typeNumber = 3;
    if (len <= 14) typeNumber = 1;
    else if (len <= 26) typeNumber = 2;
    else if (len <= 42) typeNumber = 3;
    else if (len <= 62) typeNumber = 4;
    else if (len <= 84) typeNumber = 5;
    else typeNumber = 6;

    const errorLevel = 1; // M
    const rsEntry = RS_TABLE[(typeNumber - 1) * 4 + errorLevel];
    const rsBlocks = [];
    for (const [count, totalCount, dataCount] of rsEntry) {
      for (let i = 0; i < count; i++) rsBlocks.push({ totalCount, dataCount });
    }

    const bits = [];
    function putBits(val, bitCount) {
      for (let i = bitCount - 1; i >= 0; i--) bits.push((val >> i) & 1);
    }
    putBits(4, 4); // 8-bit byte mode
    putBits(bytes.length, 8); // character count indicator
    for (const b of bytes) putBits(b, 8);

    let totalDataCount = 0;
    for (const b of rsBlocks) totalDataCount += b.dataCount;

    if (bits.length + 4 <= totalDataCount * 8) putBits(0, 4);
    while (bits.length % 8 !== 0) bits.push(0);

    const dataBytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      dataBytes.push(byte);
    }
    while (dataBytes.length < totalDataCount) {
      dataBytes.push(0xec);
      if (dataBytes.length < totalDataCount) dataBytes.push(0x11);
    }

    let offset = 0;
    const dataList = [];
    const ecList = [];
    for (let i = 0; i < rsBlocks.length; i++) {
      const { totalCount, dataCount } = rsBlocks[i];
      const raw = dataBytes.slice(offset, offset + dataCount);
      offset += dataCount;
      dataList.push(raw);

      const ecLength = totalCount - dataCount;
      const ecPoly = getErrorCorrectPolynomial(ecLength);
      const rawPoly = new QRPolynomial(new Uint8Array(raw), ecLength);
      const modPoly = rawPoly.mod(ecPoly);
      const ec = new Uint8Array(ecLength);
      const shift = ecLength - modPoly.getLength();
      for (let j = 0; j < modPoly.getLength(); j++) ec[j + shift] = modPoly.get(j);
      ecList.push(ec);
    }

    const finalBytes = [];
    let maxDataLen = 0;
    for (const d of dataList) maxDataLen = Math.max(maxDataLen, d.length);
    for (let i = 0; i < maxDataLen; i++) {
      for (const d of dataList) {
        if (i < d.length) finalBytes.push(d[i]);
      }
    }
    let maxEcLen = 0;
    for (const ec of ecList) maxEcLen = Math.max(maxEcLen, ec.length);
    for (let i = 0; i < maxEcLen; i++) {
      for (const ec of ecList) {
        if (i < ec.length) finalBytes.push(ec[i]);
      }
    }

    const moduleCount = typeNumber * 4 + 17;
    const modules = Array.from({ length: moduleCount }, () => Array(moduleCount).fill(null));

    function setupFinder(row, col) {
      for (let r = -1; r <= 7; r++) {
        if (row + r < 0 || row + r >= moduleCount) continue;
        for (let c = -1; c <= 7; c++) {
          if (col + c < 0 || col + c >= moduleCount) continue;
          if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
              (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            modules[row + r][col + c] = true;
          } else {
            modules[row + r][col + c] = false;
          }
        }
      }
    }
    setupFinder(0, 0);
    setupFinder(moduleCount - 7, 0);
    setupFinder(0, moduleCount - 7);

    // Timing
    for (let r = 8; r < moduleCount - 8; r++) {
      if (modules[r][6] === null) modules[r][6] = (r % 2 === 0);
    }
    for (let c = 8; c < moduleCount - 8; c++) {
      if (modules[6][c] === null) modules[6][c] = (c % 2 === 0);
    }

    // Alignment
    const alignPos = ALIGNMENT_PATTERN_POS[typeNumber - 1] || [];
    for (let i = 0; i < alignPos.length; i++) {
      for (let j = 0; j < alignPos.length; j++) {
        const row = alignPos[i], col = alignPos[j];
        if (modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              modules[row + r][col + c] = true;
            } else {
              modules[row + r][col + c] = false;
            }
          }
        }
      }
    }

    // Format info (mask 0)
    const typeInfo = getBCHTypeInfo((errorLevel << 3) | 0);
    for (let i = 0; i < 15; i++) {
      const mod = ((typeInfo >> i) & 1) === 1;
      if (i < 6) modules[i][8] = mod;
      else if (i < 8) modules[i + 1][8] = mod;
      else modules[moduleCount - 15 + i][8] = mod;

      if (i < 8) modules[8][moduleCount - i - 1] = mod;
      else if (i < 9) modules[8][15 - i] = mod;
      else modules[8][15 - i - 1] = mod;
    }
    modules[moduleCount - 8][8] = true;

    // Data zigzag
    let inc = -1;
    let row = moduleCount - 1;
    let bitIdx = 7;
    let byteIdx = 0;
    for (let col = moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          const cCol = col - c;
          if (modules[row][cCol] === null) {
            let dark = false;
            if (byteIdx < finalBytes.length) {
              dark = (((finalBytes[byteIdx] >>> bitIdx) & 1) === 1);
            }
            if ((row + cCol) % 2 === 0) dark = !dark;
            modules[row][cCol] = dark;
            bitIdx--;
            if (bitIdx === -1) {
              byteIdx++;
              bitIdx = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }

    return { modules, moduleCount };
  }

  function renderQrCode(canvasOrId, text, options = {}) {
    const canvas = typeof canvasOrId === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasOrId) : null)
      : canvasOrId;
    if (!canvas || !canvas.getContext) return null;

    const size = options.size || 220;
    const colorDark = options.colorDark || '#0d0e0d';
    const colorLight = options.colorLight || '#f7f4ed';
    const margin = options.margin != null ? options.margin : 2;

    const { modules, moduleCount } = generateQrMatrix(String(text || ''));
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = colorLight;
    ctx.fillRect(0, 0, size, size);

    const fullCount = moduleCount + margin * 2;
    const cellSize = size / fullCount;

    ctx.fillStyle = colorDark;
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (modules[r][c]) {
          const x = Math.round((c + margin) * cellSize);
          const y = Math.round((r + margin) * cellSize);
          const w = Math.ceil(cellSize);
          const h = Math.ceil(cellSize);
          ctx.fillRect(x, y, w, h);
        }
      }
    }
    return canvas;
  }

  // ===========================================================================
  // S9: RESERVATIONS, DEPOSIT PROOFS & EVOLUTION API DATA LAYER
  // ===========================================================================
  function getReservationSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RES_SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_RESERVATION_SETTINGS,
          ...parsed,
          evolutionServerUrl: parsed.evolutionServerUrl || DEFAULT_RESERVATION_SETTINGS.evolutionServerUrl,
          evolutionApiKey: parsed.evolutionApiKey || DEFAULT_RESERVATION_SETTINGS.evolutionApiKey,
          evolutionInstanceName: parsed.evolutionInstanceName || DEFAULT_RESERVATION_SETTINGS.evolutionInstanceName
        };
      }
    } catch (_) {}
    return { ...DEFAULT_RESERVATION_SETTINGS };
  }

  function saveReservationSettings(settings) {
    const merged = { ...getReservationSettings(), ...settings };
    try {
      localStorage.setItem(STORAGE_KEY_RES_SETTINGS, JSON.stringify(merged));
    } catch (_) {}
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'SETTINGS_UPDATED',
        settings: merged,
        timestamp: Date.now()
      });
    }
    return merged;
  }

  function getReservations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    const cloned = JSON.parse(JSON.stringify(DEFAULT_RESERVATIONS));
    saveReservations(cloned, false);
    return cloned;
  }

  function saveReservations(reservations, notify = true, broadcastPayload = null) {
    try {
      localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(reservations));
    } catch (_) {}
    if (notify && broadcastChannel) {
      broadcastChannel.postMessage(
        broadcastPayload || {
          type: 'RESERVATIONS_UPDATED',
          reservations,
          timestamp: Date.now()
        }
      );
    }
  }

  function generateReservationId() {
    const existing = getReservations();
    for (let i = 0; i < 50; i++) {
      const code = 'MLP-' + Math.floor(1000 + Math.random() * 9000);
      if (!existing.some((r) => r.id === code)) return code;
    }
    return 'MLP-' + Date.now().toString().slice(-4);
  }

  function createReservation(payload) {
    const list = getReservations();
    const id = payload.id || generateReservationId();
    const now = new Date().toISOString();
    const isBirthday = Boolean(payload.is_birthday || payload.res_type === 'Cumpleaños VIP');
    const depositMode = payload.deposit_mode === 'sin_sena' ? 'sin_sena' : 'con_sena';
    const depositStatus = depositMode === 'sin_sena' ? 'sin_sena' : (payload.deposit_status || 'pendiente');

    const newRes = {
      id,
      customer_name: (payload.customer_name || '').trim(),
      customer_email: (payload.customer_email || '').trim(),
      customer_phone: (payload.customer_phone || '').trim(),
      res_type: payload.res_type || 'Mesa Cena + Previa',
      is_birthday: isBirthday,
      birthday_dni: (payload.birthday_dni || '').trim(),
      birthday_date: (payload.birthday_date || '').trim(),
      guests: Number(payload.guests) || 2,
      res_day: payload.res_day || 'Viernes 13/11',
      res_time: payload.res_time || '20:30 hs (Cena)',
      deposit_mode: depositMode,
      deposit_status: depositStatus,
      proof_url: payload.proof_url || '',
      proof_uploaded_at: payload.proof_uploaded_at || null,
      attended: Boolean(payload.attended),
      checked_in_at: payload.checked_in_at || null,
      notes: payload.notes || '',
      created_at: payload.created_at || now,
      updated_at: payload.updated_at || now
    };

    list.unshift(newRes);
    saveReservations(list, true, {
      type: 'RESERVATIONS_UPDATED',
      event: 'NEW_RESERVATION',
      reservation: newRes,
      reservations: list,
      timestamp: Date.now()
    });

    const client = getClient();
    if (client) {
      client.from('table_reservations').insert(newRes).then(() => {}).catch((err) => {
        console.warn('Supabase insert reservation fallback:', err.message || err);
      });
    }

    sendReservationNotifications(newRes);
    return newRes;
  }

  async function uploadDepositProof(reservationId, file) {
    const list = getReservations();
    const idx = list.findIndex((r) => r.id === reservationId);
    if (idx === -1) throw new Error('Reserva no encontrada: ' + reservationId);

    let webpUrl = '';
    if (typeof file === 'string') {
      webpUrl = file;
    } else if (file) {
      const uploadRes = await uploadDishImage(file);
      webpUrl = uploadRes && uploadRes.url ? uploadRes.url : '';
    }

    const now = new Date().toISOString();
    list[idx].deposit_status = 'comprobante_subido';
    list[idx].proof_url = webpUrl;
    list[idx].proof_uploaded_at = now;
    list[idx].updated_at = now;

    saveReservations(list, true, {
      type: 'RESERVATIONS_UPDATED',
      event: 'PROOF_UPLOADED',
      reservationId,
      reservation: list[idx],
      reservations: list,
      timestamp: Date.now()
    });

    const client = getClient();
    if (client) {
      client.from('table_reservations').update({
        deposit_status: 'comprobante_subido',
        proof_url: webpUrl,
        proof_uploaded_at: now,
        updated_at: now
      }).eq('id', reservationId).then(() => {}).catch((err) => {
        console.warn('Supabase update proof fallback:', err.message || err);
      });
    }

    return list[idx];
  }

  function approveReservationDeposit(reservationId) {
    const list = getReservations();
    const idx = list.findIndex((r) => r.id === reservationId);
    if (idx === -1) throw new Error('Reserva no encontrada: ' + reservationId);

    const now = new Date().toISOString();
    list[idx].deposit_status = 'confirmada';
    list[idx].updated_at = now;

    saveReservations(list, true, {
      type: 'RESERVATIONS_UPDATED',
      event: 'DEPOSIT_APPROVED',
      reservationId,
      reservation: list[idx],
      reservations: list,
      timestamp: Date.now()
    });

    const client = getClient();
    if (client) {
      client.from('table_reservations').update({
        deposit_status: 'confirmada',
        updated_at: now
      }).eq('id', reservationId).then(() => {}).catch((err) => {
        console.warn('Supabase approve deposit fallback:', err.message || err);
      });
    }

    return list[idx];
  }

  function checkInReservation(reservationId, attended = true) {
    const list = getReservations();
    const idx = list.findIndex((r) => r.id === reservationId);
    if (idx === -1) throw new Error('Reserva no encontrada: ' + reservationId);

    const now = new Date().toISOString();
    const isAttended = Boolean(attended);
    list[idx].attended = isAttended;
    list[idx].checked_in_at = isAttended ? now : null;
    list[idx].updated_at = now;

    saveReservations(list, true, {
      type: 'RESERVATIONS_UPDATED',
      event: 'CHECKIN_UPDATED',
      reservationId,
      reservation: list[idx],
      reservations: list,
      timestamp: Date.now()
    });

    const client = getClient();
    if (client) {
      client.from('table_reservations').update({
        attended: isAttended,
        checked_in_at: isAttended ? now : null,
        updated_at: now
      }).eq('id', reservationId).then(() => {}).catch((err) => {
        console.warn('Supabase checkin fallback:', err.message || err);
      });
    }

    return list[idx];
  }

  function deleteReservation(reservationId) {
    const list = getReservations();
    const filtered = list.filter((r) => r.id !== reservationId);
    saveReservations(filtered, true, {
      type: 'RESERVATIONS_UPDATED',
      event: 'DELETE_RESERVATION',
      reservationId,
      reservations: filtered,
      timestamp: Date.now()
    });

    const client = getClient();
    if (client) {
      client.from('table_reservations').delete().eq('id', reservationId).then(() => {}).catch((err) => {
        console.warn('Supabase delete reservation fallback:', err.message || err);
      });
    }

    return true;
  }

  function subscribeToReservationChanges(onUpdate) {
    if (typeof onUpdate !== 'function') return () => {};

    const handleBroadcast = (event) => {
      if (event.data && event.data.type === 'RESERVATIONS_UPDATED') {
        onUpdate(event.data.reservations || getReservations(), event.data);
      }
    };
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY_RESERVATIONS && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) onUpdate(parsed, { type: 'RESERVATIONS_UPDATED', reservations: parsed });
        } catch (_) {}
      }
    };
    global.addEventListener('storage', handleStorage);

    const client = getClient();
    let channel = null;
    if (client && typeof client.channel === 'function') {
      try {
        channel = client
          .channel('realtime_table_reservations_' + Math.random().toString(36).slice(2, 7))
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'table_reservations' },
            async (payload) => {
              const current = getReservations();
              if (payload.eventType === 'INSERT' && payload.new) {
                if (!current.some((r) => r.id === payload.new.id)) {
                  current.unshift(payload.new);
                  saveReservations(current, false);
                  onUpdate(current, { type: 'RESERVATIONS_UPDATED', event: 'NEW_RESERVATION', reservation: payload.new, reservations: current });
                }
              } else if (payload.eventType === 'UPDATE' && payload.new) {
                const idx = current.findIndex((r) => r.id === payload.new.id);
                if (idx !== -1) {
                  current[idx] = { ...current[idx], ...payload.new };
                  saveReservations(current, false);
                  onUpdate(current, { type: 'RESERVATIONS_UPDATED', event: 'UPDATE_RESERVATION', reservation: current[idx], reservations: current });
                }
              } else if (payload.eventType === 'DELETE' && payload.old) {
                const filtered = current.filter((r) => r.id !== payload.old.id);
                saveReservations(filtered, false);
                onUpdate(filtered, { type: 'RESERVATIONS_UPDATED', event: 'DELETE_RESERVATION', reservationId: payload.old.id, reservations: filtered });
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime Supabase subscription error for table_reservations:', err.message || err);
      }
    }

    return () => {
      if (broadcastChannel) broadcastChannel.removeEventListener('message', handleBroadcast);
      global.removeEventListener('storage', handleStorage);
      if (client && channel && typeof client.removeChannel === 'function') {
        try { client.removeChannel(channel); } catch (_) {}
      }
    };
  }

  async function sendReservationNotifications(reservation) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
      ? window.location.origin
      : (typeof location !== 'undefined' && location.origin ? location.origin : 'http://localhost:3000');
    const portalLink = `${origin}/?reserva=${encodeURIComponent(reservation.id)}`;
    const checkinUrl = `${origin}/admin?checkin=${encodeURIComponent(reservation.id)}`;

    const settings = getReservationSettings();
    const serverUrl = (settings.evolutionServerUrl || '').trim().replace(/\/+$/, '');
    const apiKey = (settings.evolutionApiKey || '').trim();
    const instanceName = (settings.evolutionInstanceName || 'mery-la-previa').trim();

    if (serverUrl && apiKey && reservation.customer_phone) {
      try {
        const cleanPhone = reservation.customer_phone.replace(/\D/g, '');
        const formattedPhone = cleanPhone.startsWith('549')
          ? cleanPhone
          : (cleanPhone.startsWith('54') ? '549' + cleanPhone.slice(2) : (cleanPhone.startsWith('11') || cleanPhone.startsWith('15') ? '549' + cleanPhone : '549' + cleanPhone));

        const messageText = `*MERY LA PREVIA — PASE DE ABORDAJE CONFIRMADO*\n\n` +
          `¡Hola ${reservation.customer_name}! Tu reserva en Mery La Previa ya está registrada con el código *${reservation.id}*.\n\n` +
          `• *Sector / Motivo:* ${reservation.res_type}\n` +
          `• *Personas:* ${reservation.guests} personas\n` +
          `• *Fecha:* ${reservation.res_day}\n` +
          `• *Horario:* ${reservation.res_time}\n` +
          (reservation.is_birthday ? `• *Cumpleaños:* DNI ${reservation.birthday_dni} (¡Tenés brindis y beneficios especiales!)\n` : '') +
          `\n` +
          (reservation.deposit_mode === 'con_sena'
            ? `*LUGAR ASEGURADO CON SEÑA:*\n` +
              `Para confirmar definitivamente tu mesa toda la noche, realizá la seña de ${settings.depositAmount} por transferencia:\n` +
              `• *Alias:* ${settings.depositAlias}\n` +
              `• *CBU:* ${settings.depositCbu}\n` +
              `• *Titular:* ${settings.depositHolder}\n` +
              (settings.depositPaymentLink ? `• *Link Mercado Pago:* ${settings.depositPaymentLink}\n` : '') +
              `\nSubí tu comprobante directamente en tu portal exclusivo:\n${portalLink}\n`
            : `*RESERVA SIN SEÑA:*\n` +
              `Tu mesa queda sujeta a disponibilidad con 15 minutos de tolerancia en puerta.\n` +
              `Podés ver tu Pase QR aquí: ${portalLink}\n`
          ) +
          `\nPresentá este Pase de Abordaje al recepcionista al llegar a Mery La Previa. ¡Nos vemos en la previa!`;

        fetch(`${serverUrl}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            number: formattedPhone,
            text: messageText
          })
        }).catch((err) => {
          console.warn('Evolution API sendText network error:', err.message || err);
        });
      } catch (err) {
        console.warn('Evolution API sendText error:', err.message || err);
      }
    }

    return { portalLink, checkinUrl };
  }

  global.MeryStore = {
    DEFAULT_MENU_SECTIONS,
    DEFAULT_SITE_VIDEOS,
    DEFAULT_RESERVATIONS,
    DEFAULT_RESERVATION_SETTINGS,
    getSupabaseConfig,
    setSupabaseConfig,
    isSupabaseConfigured,
    getClient,
    getLocalSections,
    saveLocalSections,
    fetchMenuSections,
    subscribeToMenuChanges,
    seedSupabaseIfEmpty,
    uploadDishImage,
    uploadSectionVideo,
    restoreSectionVideo,
    getSiteVideos,
    saveSiteVideos,
    subscribeToVideoChanges,
    deleteBlobFromIDB,
    // Reservations & Evolution API
    getReservations,
    saveReservations,
    createReservation,
    uploadDepositProof,
    approveReservationDeposit,
    checkInReservation,
    deleteReservation,
    subscribeToReservationChanges,
    getReservationSettings,
    saveReservationSettings,
    sendReservationNotifications,
    renderQrCode
  };
})(window);
