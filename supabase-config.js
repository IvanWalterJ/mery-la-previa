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
const BROADCAST_CHANNEL_NAME = 'mery_la_previa_realtime_v1';

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
        return parsed;
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
          available: it.available !== false,
          sort_order: j + 1
        }, { onConflict: 'id' });
      }
    }
    return { ok: true };
  }

  async function uploadDishImage(file) {
    if (!file) throw new Error('No se seleccionó ningún archivo');
    const client = getClient();

    if (client) {
      try {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
        const fileName = `dishes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await client.storage
          .from('menu-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

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

    // Fallback: client-side resized DataURL so photo upload works immediately even offline
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
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
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.84));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  global.MeryStore = {
    DEFAULT_MENU_SECTIONS,
    getSupabaseConfig,
    setSupabaseConfig,
    isSupabaseConfigured,
    getClient,
    getLocalSections,
    saveLocalSections,
    fetchMenuSections,
    subscribeToMenuChanges,
    seedSupabaseIfEmpty,
    uploadDishImage
  };
})(window);
