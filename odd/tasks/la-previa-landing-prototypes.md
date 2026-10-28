# Feature: La Previa de Mery — 3 Dark High-End Prototypes & Interactive Menu

## Objective
Create 3 interactive, dark-mode, high-end landing page prototypes for **"La Previa de Mery" (*Mery Jane — Wine & Friends*)**, targeting the upscale night-out demographic in Zona Sur (Canning, San Vicente, Guernica, Longchamps), featuring a disruptive, visual, interactive Menu experience and real brand assets.

## Problem & Why
The client needs to choose a visual and experiential direction for their new restó-bar ("La Previa"). Static templates or generic PDF menus fail to convey an exclusive nocturnal atmosphere ("Wine Bar + Previa Club"). We need 3 distinct dark-toned interactive experiences—including a Cruza Polo-inspired VIP Portal ("Linktree on steroids") and two creative nocturnal alternatives—plus a standout, fluid interactive menu.

## Scope & Constraints
- **Authorized Scope:**
  - Copy user-uploaded reference photos into `assets/img/` and integrate 4 AI-generated realistic nocturnal photos (`steak-flash.png`, `cocktails-neon.png`, `wine-mery.png`, `dj-previa.png`).
  - Build a unified interactive showcase (`index.html`, `styles.css`, `app.js`) that lets the user switch seamlessly between the **3 Dark Design Directions**, inspect the **Interactive Sensory Menu**, and open native `<dialog closedby="any">` modals for Birthday Packages, Table Reservations, and DJ Lineup tickets.
  - All 3 directions use a nocturnal dark foundation ("La Previa" night vibe) while exploring different luxury aesthetics:
    1. **Opción 1 — "Cruza VIP Hub" (Linktree Nocturno de Alta Gama):** Inspired by Cruza Polo / Bagatelle. Full-screen ambient video/kinetic canvas backdrop with a central luxury glassmorphic portal (`Reservar Mesa VIP`, `Festejá tu Cumple`, `La Carta Interactiva`, `Lineup DJs — 13/11`, `Horarios & Ubicación Mié–Dom`) + dress code & age badge (`+21`).
    2. **Opción 2 — "11:11 Flash Club" (Paparazzi & Red Neon):** Inspired by the `11:11` neon sign, leather & flash photography from the brand's Instagram grid. Kinetic marquee, harsh-flash hover reveals, interactive audio/BPM visualizer aesthetic, and a horizontal-scroll DJ Lineup (`13/11 Opening Night`).
    3. **Opción 3 — "Nocturnal Wine Zine" (Dark Emerald & Cream Brutalist Editorial):** Inspired by the *Mery Jane* packaging boxes (12-point star, wavy patterns, checkerboard, newspaper headline *"Tenemos Previa 13/11"*) translated into a midnight forest-green & obsidian luxury magazine layout.
  - **The Interactive Menu ("La Carta"):** Built as a tactile, dynamic showcase (not a static list):
    - Category filter (`Cortes & Bandejas`, `Wine & Friends`, `Cocktails 11:11`, `Tapeo de Previa`)
    - Interactive **Flash-Spotlight Card Preview** & **3D Tilt / Dish Inspector** with pairing tags, intensity/flavor meters, smoky/flash visual effects, and instant "Armar Mesa / Consultar para Cumple" action.
- **TDD / Verification Configuration:**
  - Effective TDD: `off` (no existing test framework configured in workspace; functional & DOM/JS syntax verification checks apply).
- **Delivery Strategy:**
  - `single-pr` (initial greenfield prototype showcase, forecast ~650 lines across HTML/CSS/JS).

## Actionable Checklist
- [x] **Task 1 (`T1`):** Prepare local brand assets (`assets/img/`) from user uploads and AI-generated nocturnal photography, and scaffold the HTML/CSS/JS showcase architecture with modern `<dialog closedby="any">` + fallback support.
- [x] **Task 2 (`T2`):** Implement the 3 switchable Dark Landing Prototypes (Cruza VIP Hub, 11:11 Flash Club, Nocturnal Wine Zine) + the Interactive Sensory Menu & Birthday/Event modals, and verify zero console/syntax errors.
- [x] **Task 3 (`T3`):** Generate isolated dark studio bottle keyframe + seamless 360° loop video (`first_frame` = `last_frame`) via Flow MCP (`assets/video/bottle-360-loop.mp4`), and build the dedicated V1 Dark Emerald Single-Screen Portal (Cruza Polo structure, **Britney Regular** + **Quicksand Medium** typography, 0–3s pure bottle loop reveal, and Time-Warp / Dimensional Jump transitions between views).
- [x] **Task 4 (`T4`):** Upgrade V1 aesthetic using Refero Styles references (`Wise: Deep Moss #0B1908 + Lime Voltage #9FE870`, `Teenage Engineering: Industrial Catalogue Grid`, `Apple Pro: Midnight Plinth`) and expand all 4 inner targets (`La Carta`, `Cumpleaños & VIP`, `Lineup 13/11`, `Horarios & Mapa`) into full dedicated multi-block pages with interactive configurators, removing generic AI gold/glass cards.
- [x] **Task 5 (`T5`):** Rebuild aesthetic around `@meryjane.laprevia` real Instagram identity: dark ribbed wall + red-orange neon sign spelling `"MERY LA PREVIA"` with realistic flicker & Web Audio API neon ignition sound effect, sharp editorial typography (`Instrument Serif` + `Syne` + `Plus Jakarta Sans`), and smooth directional **Slide Transitions** (`slide-to-left` / `slide-from-right`) replacing the star-warp canvas.
- [x] **Task 6 (`T6`):** Replicate the exact **Qitchen Framer Template** (`https://qitchen-template.framer.website/`) Bento Split-Screen Architecture, CSS tokens (`#0a0b0a`, `#efe7d2`, `rgba(239, 231, 210, 0.15)`), typography (`Forum` + `Plus Jakarta Sans`), floating top-left pill navbar, sticky left 50% showcase with our 360° Mery Jane bottle video (`assets/video/bottle-360-loop.mp4`) + neon intro option, right 50% stacked Bento image cards with inverted bottom-right corner notches + arrow badges, and Qitchen `/menu`, `/cumples`, `/lineup`, and `/reservation` views with dotted price leaders and diamond `◇ Headline ◇` dividers.
- [x] **Task 7 (`T7`):** Polish Qitchen implementation per user feedback: (1) auto-trigger neon ignition sound without auto-redirecting after 1s + redesign intro button in pure Qitchen `Forum` style without lightning emoji; (2) remove bottom-right buttons from the left showcase panel; (3) implement the exact Qitchen fullscreen hamburger Menu Overlay (`MENU`, `RESERVATION`, `ABOUT`, `CONTACT`, `BLOG` style with diamond dividers and hover scale/color effect); (4) swap the left showcase video to `assets/video/ice-cube-1311.mp4` with sound when entering `La Previa 13/11`; and (5) fix mobile responsiveness (no horizontal crop on the neon intro sign and clean responsive navbar/layout).

## Progress & Verification Evidence
- `T1` & `T2` completed and verified via `node --check app.js` (exit code 0) and asset presence check in `assets/img/` (`88f73c1`).
- `T3` completed: Flow MCP generated `scene-01.jpeg` and seamless 360° loop `scene-02.mp4` (`113f1f1`).
- `T4` completed: Extracted DESIGN.md tokens from `styles.refero.design` (`42a0ad0`).
- `T5` completed: Generated `assets/img/neon-wall-mery.jpg` and `assets/img/ice-cube-previa.jpg`, implemented Web Audio API neon tube ignition synthesizer, and directional Slide View Transitions (`c7a8a41`).
- `T6` completed: Replicated Qitchen Framer Bento Split-Screen layout (`d88f0db`).
- `T7` completed: Generated `assets/video/ice-cube-1311.mp4` with ambient cocktail/sub-bass audio track via `ffmpeg`; removed the 2.4s auto-redirect on the Neon Intro and replaced the lightning emoji button with a Qitchen `Forum` diamond button (`◇ ENTRAR A MERY LA PREVIA ◇`); removed the bottom-right buttons from the left video panel; implemented the fullscreen Qitchen hamburger Menu Overlay (`#qitchenMenuOverlay`) with `◇──◇` ornaments and sibling-dimming hover effect; wired the left showcase video to swap to `ice-cube-1311.mp4` with sound (`unmute: true`) on `La Previa 13/11`; and fixed mobile responsiveness (`object-fit: contain` on the neon intro sign over a fluted dark CSS backdrop so it never crops horizontally on phones). Verified with `node --check app.js`.
- Native RDD switch: `disabled/unmanaged` (default).
- Engram mirror status: `pending` (no Engram MCP server registered in current runtime; local `odd/tasks/la-previa-landing-prototypes.md` is authoritative).
