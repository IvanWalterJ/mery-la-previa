# Feature: Landing Clásica con Menú Arriba — Mery La Previa

## Objective
Create a standalone, full-page traditional landing page prototype (`clasica.html`, `clasica.css`, `clasica.js`) for **Mery La Previa** (`@meryjane.laprevia`), featuring a sticky top navigation bar, full-bleed hero with ambient video backdrop, smooth anchor scrolling, experiential concept blocks, full interactive nocturnal menu, birthday/VIP packages, 13/11 lineup showcase, and footer—completely isolated from the Qitchen Bento prototype.

## Problem & Why
The client wants to compare two distinct high-end architectural directions for Mery La Previa:
1. **The Qitchen Bento Split-Screen Prototype (`index.html`):** Frame-locked, 50/50 desktop split with left sticky video and right bento scroll.
2. **The Classic Top-Navbar Prototype (`clasica.html`):** Full-bleed vertical landing page with sticky top navigation, expansive hero banner, multi-section storytelling, and traditional top-down flow.
Both versions must live cleanly in the same repository for zero-config Vercel hosting, but remain 100% separated with dedicated markup, styles, and scripts so neither interferes with the other.

## Scope & Constraints
- **Authorized Scope:**
  - Build `clasica.html`, `clasica.css`, and `clasica.js` without touching or degrading `index.html`, `styles.css`, or `app.js`.
  - **Top Sticky Navbar:** Luxury dark glassmorphic bar (`backdrop-filter: blur(20px)`), logo `MERY LA PREVIA`, navigation anchors (`#inicio`, `#experiencia`, `#carta`, `#cumples`, `#lineup`, `#ubicacion`), and CTA button `[ Reservar ]`. Mobile slide-out drawer with hamburger toggle.
  - **Full-Bleed Hero:** Ambient video backdrop (`assets/video/bottle-360-loop.mp4` with dark vignette), punchy Argentine copy (*"La previa arranca acá"*, *"Disfrutá que la noche vuela"*), schedule & age badges, and dual action buttons.
  - **Nightlife Experience ("El Vibe"):** 3-stage night progression (Cena & Vinos 20hs, Previa & Cocktails 23hs, Club & Cachengue 01:30hs) with nocturnal photo cards.
  - **La Carta Nocturna:** Interactive tabs (`Cortes & Fuegos`, `Tapeo de Previa`, `Cocktails 11:11`, `Vinos & Mery Jane`) with prices, photos, and ingredients.
  - **Cumpleaños & Mesas VIP:** Packages for celebrations with direct WhatsApp integration.
  - **Lineup 13/11:** Video card (`assets/video/ice-cube-1311.mp4`) with audio toggle, DJ announcements, and VIP access button.
  - **Horarios, Ubicación & Footer:** Address in Zona Sur, schedule Mié–Dom 20:00hs, and Instagram link.
- **TDD / Verification:**
  - Syntax check with `node --check clasica.js`.
  - DOM & responsive verification via CDP / verification script.
- **Delivery Strategy:**
  - `single-pr` work unit commit on `main`, pushed to GitHub and automatically deployed to Vercel.

## Actionable Checklist
- [x] **Task 1 (`T1`):** Scaffold `clasica.html`, `clasica.css`, and `clasica.js` with semantic HTML5 structure, Google Fonts (`Instrument Serif`, `Plus Jakarta Sans`, `Syne`), and design tokens matching nocturnal luxury branding.
- [x] **Task 2 (`T2`):** Implement the sticky top navigation header with modern container scroll-state / glassmorphic styling, desktop links, and mobile slide-out drawer menu.
- [x] **Task 3 (`T3`):** Build the full-bleed Hero Section with ambient video background, brand headline, badges, and smooth-scroll CTAs.
- [x] **Task 4 (`T4`):** Build the Experience ("El Vibe de La Previa") 3-phase cards and the interactive Menu section with category filters and dish cards.
- [x] **Task 5 (`T5`):** Build the Cumples & VIP section, 13/11 Lineup video showcase, Location/Hours block, and Nocturnal Footer.
- [x] **Task 6 (`T6`):** Verify layout, responsive behavior, zero JS errors, commit work unit, push to GitHub, and deploy to Vercel.

## Progress & Verification Evidence
- Feature tasks completed and verified with `node --check clasica.js` (exit code 0) and `scratch/verify-clasica.js` (all DOM elements, navigation links, and redirects verified).
- Both prototypes live and accessible on Vercel:
  - Qitchen Bento Split-Screen Prototype: `https://mery-la-previa.vercel.app/`
  - Classic Top-Menu Prototype: `https://mery-la-previa.vercel.app/clasica.html`
- Git commits synced with origin `IvanWalterJ/mery-la-previa`.
- Native RDD switch: `disabled/unmanaged`.
- Engram mirror: `pending`.
