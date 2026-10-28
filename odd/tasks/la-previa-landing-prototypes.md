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

## Progress & Verification Evidence
- `T1` & `T2` completed and verified via `node --check app.js` (exit code 0) and asset presence check in `assets/img/` (3 user reference images + 4 AI-generated nocturnal flash images).
- Work-unit commit recorded on branch `feat/la-previa-landing-prototypes`: `88f73c1`.
- `T3` completed: Flow MCP generated `scene-01.jpeg` (0 credits) and seamless 360° loop `scene-02.mp4` (12 credits, `first_frame` + `last_frame` locked to `scene-01.jpeg`), copied to `assets/img/bottle-hero-isolated.jpg` and `assets/video/bottle-360-loop.mp4`. V1 Dark Emerald Cruza-style portal verified with `node --check app.js`.
- Native RDD switch: `disabled/unmanaged` (default).
- Engram mirror status: `pending` (no Engram MCP server registered in current runtime; local `odd/tasks/la-previa-landing-prototypes.md` is authoritative).
