/**
 * Mery La Previa — Landing Clásica con Menú Arriba
 * Interactive scripts for standalone classic prototype
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 2. State-Aware Sticky Header Fallback (IntersectionObserver polyfill)
  const navWrapper = document.querySelector('.classic-nav-wrapper');
  if (navWrapper && !CSS.supports('container-type: scroll-state')) {
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '100%';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.visibility = 'hidden';
    document.body.prepend(sentinel);

    const stickyObserver = new IntersectionObserver(([entry]) => {
      navWrapper.classList.toggle('is-stuck', !entry.isIntersecting);
    }, { threshold: [0] });

    stickyObserver.observe(sentinel);
  }

  // 3. Active Nav Link on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-86px 0px -50% 0px'
  });

  sections.forEach(section => scrollSpyObserver.observe(section));

  // 4. Interactive Menu Tabs Filter
  const tabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update tab active state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetCategory = tab.getAttribute('data-category');

      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          item.style.display = 'flex';
          item.style.animation = 'fadeInCard 0.35s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 5. Lineup 13/11 Video Sound Toggle
  const lineupVideo = document.getElementById('lineupVideo');
  const toggleSoundBtn = document.getElementById('toggleLineupSound');

  if (lineupVideo && toggleSoundBtn) {
    const lblSound = toggleSoundBtn.querySelector('.lbl-sound');
    const iconSound = toggleSoundBtn.querySelector('.icon-sound');

    // Autoplay muted by default for video background experience
    lineupVideo.muted = true;
    lineupVideo.play().catch(() => {});

    toggleSoundBtn.addEventListener('click', () => {
      if (lineupVideo.muted) {
        lineupVideo.muted = false;
        lineupVideo.currentTime = 0;
        lineupVideo.play().then(() => {
          if (lblSound) lblSound.textContent = 'Sonido activado (Pausar)';
          if (iconSound) iconSound.textContent = '🔊';
        }).catch(() => {});
      } else {
        lineupVideo.muted = true;
        if (lblSound) lblSound.textContent = 'Tocar para video con sonido';
        if (iconSound) iconSound.textContent = '🔇';
      }
    });
  }
});
