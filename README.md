<div align="center">

<img src="https://raw.githubusercontent.com/superbyte23/superbyte-ui-tailwind/main/public/img/brand.png" alt="Superbyte UI" width="120" height="auto" />

# Superbyte UI

**The admin dashboard that ships with everything.**

A complete, free & open-source admin dashboard and UI kit rebuilt on
**Tailwind CSS v4** and **Vite** — 49 ready-to-use pages, three navigation
styles, a live theme customizer, and full RTL support. Vanilla JS, zero CDN
dependencies, fully offline.

<br/>

`Tailwind CSS v4` · `Vite 6` · `Vanilla JS` · `No CDN` · `Offline-ready`

<br/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/superbyte23/superbyte-ui-tailwind/releases)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/superbyte23/superbyte-ui-tailwind)

[Live preview](preview/index.html) ·
[Landing page](index.html) ·
[Documentation](preview/docs.html)

</div>

---

## ✨ Features

| | |
|---|---|
| 🧩 **App shell** | Fixed sidebar, top toolbar, global search, notifications and a user dropdown wired up and consistent across every page. |
| 🗂️ **Layout modes** | Vertical, horizontal and mini-sidebar navigation × fluid, boxed or contained content — all persisted via `localStorage`. |
| 🎨 **Theme customizer** | Light/dark appearance, **19 accent colors**, 7 base palettes, corner radius, **17 font families**, base font size and compact/roomy density — saved per browser. |
| ↔️ **RTL support** | A dedicated RTL preview flips the whole interface live and mirrors every layout rule. |
| 🚀 **Fast build, no bloat** | Tailwind CSS v4 + Vite 6 bundle only what each page uses. Source in, static preview out, all libraries vendored locally. |
| 🧱 **Reusable components** | Buttons, cards, tables, forms, modals, tabs, editors, maps and charts — a component gallery covering real admin workflows. |

---

## 🖥️ Live preview

Clone, install and run — or open the static build directly:

- **Landing page** — [index.html](index.html)
- **Dashboard** — [preview/index.html](preview/index.html)
- **Docs** — [preview/docs.html](preview/docs.html)
- **All components** — [preview/all-components.html](preview/all-components.html)
- **Layout presets** — [preview/layouts.html](preview/layouts.html)

---

## 🚀 Quick start

Requires **Node.js 20+**.

```bash
# 1. Clone the repository
git clone https://github.com/superbyte23/superbyte-ui-tailwind.git
cd superbyte-ui-tailwind

# 2. Install dependencies
npm install

# 3. Start the dev server → http://localhost:8765
npm run dev
```

---

## 📦 Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Assemble pages and start the Vite dev server on port **8765**. |
| `npm run build` | Assemble pages and produce an optimized build in `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run generate` | Rebuild `preview/*.html` + `index.html` from `src/pages` and the shared shell. |
| `npm run check` | Integrity checker — validates generated HTML, local refs, zero CDN loads and sidebar links. |

---

## 🗺️ Page map

| Area | Pages |
| --- | --- |
| **Dashboards** | Dashboard, Analytics, E-commerce, CRM |
| **Apps** | Calendar, Kanban, Email, File manager, Records, Users |
| **Forms** | Inputs, selects, switches, uploads, dual range, OTP, tags, search input |
| **Data** | Tables, DataTables, Records (sortable with bulk actions) |
| **Charts** | Chart.js, ECharts |
| **Maps** | Leaflet |
| **Editors** | Quill, CodeMirror |
| **Auth** | Login, Register, Forgot, Reset, Lock, Verify, Two-factor, Session expired |
| **Utilities** | Icons, Elements, Cards, Overlays, Visuals, Utilities |
| **Layouts** | 11 presets (vertical/horizontal/mini × fluid/boxed/contained + comfy/condensed) |
| **RTL** | Full right-to-left mirror of the interface |

---

## 🛠️ Theme customizer

The customizer ships in every page's toolbar:

- 🌙 **Dark / light** appearance toggled from any page
- 🎨 **19 accent palettes** re-color the entire design system
- 🌑 **7 base palettes** — neutral, stone, zinc, mauve, olive, mist, taupe
- 📐 **Radius** — sharp, default or round corners
- 🔤 **17 font families** — Ubuntu, Inter, Roboto, Manrope, Space Grotesk and more, all vendored locally
- 📏 **Density** — compact vs roomy, plus fluid/boxed/contained content widths

Preferences persist via `localStorage` (backwards-compatible with `grid_admin_*` keys from v1) and apply instantly across the whole UI — charts included.

---

## 🗃️ Project structure

```
superbyte-ui-tailwind/
├── src/
│   ├── pages/          # 50 HTML pages (source)
│   ├── shell/          # Shared app shell, auth & landing wrappers
│   ├── styles/         # app.css, fonts.css, landing.css
│   └── js/             # theme, components, datatable, page scripts
├── scripts/
│   ├── assemble.mjs    # Generates preview/*.html + index.html
│   └── check.mjs       # Integrity checker
├── public/             # Fonts, images, pre-paint bootstrap
├── preview/            # Generated static preview pages
└── index.html          # Generated entry point
```

---

## 🧰 Built with

| Library | Purpose |
| --- | --- |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Vite](https://vitejs.dev) | Build tooling & dev server |
| [Lucide](https://lucide.dev) | Icon system |
| [Chart.js](https://www.chartjs.org) | Charts |
| [ECharts](https://echarts.apache.org) | Advanced charts |
| [Leaflet](https://leafletjs.com) | Maps |
| [Quill](https://quilljs.com) | Rich text editing |
| [CodeMirror](https://codemirror.net) | Code editing |

---

## 📄 License

Released under the [MIT License](LICENSE). Free for personal and commercial use.

<div align="center">

Made with ❤️ — [superbyte23](https://github.com/superbyte23)

</div>
