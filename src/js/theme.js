/* ══════════════════════════════════════════════════════════════════════════
   Superbyte UI v4 — theme engine
   Mirrors v1 app.js: appearance, accent, radius, base palette, font, layout
   modes, content width, base font size. Persists to localStorage with the
   same grid_admin_* keys so v1 preferences carry over.
   ══════════════════════════════════════════════════════════════════════════ */

export const THEMES = {
  indigo:  { name:'Brand',  base:'#2961fd', hi:'#5b8bfc', rgb:'41,97,253'    },
  violet:  { name:'Violet',  base:'#8b5cf6', hi:'#a78bfa', rgb:'139,92,246'   },
  fuchsia: { name:'Fuchsia', base:'#d946ef', hi:'#e879f9', rgb:'217,70,239'   },
  pink:    { name:'Pink',    base:'#ec4899', hi:'#f472b6', rgb:'236,72,153'   },
  rose:    { name:'Rose',    base:'#f43f5e', hi:'#fb7185', rgb:'244,63,94'    },
  red:     { name:'Red',     base:'#ef4444', hi:'#f87171', rgb:'239,68,68'    },
  orange:  { name:'Orange',  base:'#f97316', hi:'#fb923c', rgb:'249,115,22'   },
  amber:   { name:'Amber',   base:'#f59e0b', hi:'#fbbf24', rgb:'245,158,11'   },
  yellow:  { name:'Yellow',  base:'#eab308', hi:'#facc15', rgb:'234,179,8'    },
  lime:    { name:'Lime',    base:'#84cc16', hi:'#a3e635', rgb:'132,204,22'   },
  green:   { name:'Green',   base:'#22c55e', hi:'#4ade80', rgb:'34,197,94'    },
  emerald: { name:'Emerald', base:'#10b981', hi:'#34d399', rgb:'16,185,129'   },
  teal:    { name:'Teal',    base:'#14b8a6', hi:'#2dd4bf', rgb:'20,184,166'   },
  cyan:    { name:'Cyan',    base:'#06b6d4', hi:'#22d3ee', rgb:'6,182,212'    },
  sky:     { name:'Sky',     base:'#0ea5e9', hi:'#38bdf8', rgb:'14,165,233'   },
  blue:    { name:'Blue',    base:'#3b82f6', hi:'#60a5fa', rgb:'59,130,246'   },
  purple:  { name:'Purple',  base:'#a855f7', hi:'#c084fc', rgb:'168,85,247'   },
  white:   { name:'White',   base:'#ffffff', hi:'#e5e7eb', rgb:'255,255,255' },
  dark:    { name:'Dark',    base:'#111827', hi:'#1f2937', rgb:'17,24,39'    },
}

export const FONTS = {
  ubuntu:         { name:'Ubuntu',            stack:"'Ubuntu', sans-serif" },
  inter:          { name:'Inter',             stack:"'Inter', 'Ubuntu', sans-serif" },
  notosans:       { name:'Noto Sans',         stack:"'Noto Sans', 'Ubuntu', sans-serif" },
  nunitosans:     { name:'Nunito Sans',       stack:"'Nunito Sans', 'Ubuntu', sans-serif" },
  figtree:        { name:'Figtree',           stack:"'Figtree', 'Ubuntu', sans-serif" },
  roboto:         { name:'Roboto',            stack:"'Roboto', 'Ubuntu', sans-serif" },
  raleway:        { name:'Raleway',           stack:"'Raleway', 'Ubuntu', sans-serif" },
  dmsans:         { name:'DM Sans',           stack:"'DM Sans', 'Ubuntu', sans-serif" },
  publicsans:     { name:'Public Sans',       stack:"'Public Sans', 'Ubuntu', sans-serif" },
  outfit:         { name:'Outfit',            stack:"'Outfit', 'Ubuntu', sans-serif" },
  oxanium:        { name:'Oxanium',           stack:"'Oxanium', 'Ubuntu', sans-serif" },
  manrope:        { name:'Manrope',           stack:"'Manrope', 'Ubuntu', sans-serif" },
  spacegrotesk:   { name:'Space Grotesk',     stack:"'Space Grotesk', 'Ubuntu', sans-serif" },
  montserrat:     { name:'Montserrat',        stack:"'Montserrat', 'Ubuntu', sans-serif" },
  ibmplexsans:    { name:'IBM Plex Sans',     stack:"'IBM Plex Sans', 'Ubuntu', sans-serif" },
  sourcesans3:    { name:'Source Sans 3',     stack:"'Source Sans 3', 'Ubuntu', sans-serif" },
  instrumentsans: { name:'Instrument Sans',   stack:"'Instrument Sans', 'Ubuntu', sans-serif" },
}

export const BASE_THEMES = {
  neutral: { name:'Neutral' },
  stone:   { name:'Stone' },
  zinc:    { name:'Zinc' },
  mauve:   { name:'Mauve' },
  olive:   { name:'Olive' },
  mist:    { name:'Mist' },
  taupe:   { name:'Taupe' },
}

export const RADIUS_MAP = { '4px':['4px','2px'], '8px':['8px','4px'], '14px':['14px','8px'] }
export const RADIUS_IDS = { '4px':'radius-sharp', '8px':'radius-default', '14px':'radius-round' }

export function getContrastText(hex) {
  const c = String(hex).replace('#', '')
  const r = parseInt(c.substr(0, 2), 16)
  const g = parseInt(c.substr(2, 2), 16)
  const b = parseInt(c.substr(4, 2), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma > 0.72 ? '#111827' : '#ffffff'
}

export function isDark() {
  return document.documentElement.classList.contains('dark') &&
    !document.documentElement.classList.contains('light')
}

/* ── appearance ─────────────────────────────────────────────────────────── */
export function applyAppearance(mode) {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.classList.toggle('light', mode === 'light')
  // Icon swap is pure CSS: .theme-icon-moon is shown in dark, .theme-icon-sun
  // in light (both icons exist as lucide svgs after first render).
  const optDark = document.getElementById('opt-dark')
  const optLight = document.getElementById('opt-light')
  if (optDark) optDark.classList.toggle('active', mode === 'dark')
  if (optLight) optLight.classList.toggle('active', mode === 'light')
  try { localStorage.setItem('grid_admin_theme', mode) } catch (e) {}
}

export function setAppearance(mode) {
  applyAppearance(mode)
  if (activeThemeKey) applyThemeColor(activeThemeKey)
  refreshCharts()
}

export function toggleTheme() {
  setAppearance(isDark() ? 'light' : 'dark')
}

/* ── accent ─────────────────────────────────────────────────────────────── */
export let activeThemeKey = 'indigo'

export function applyThemeColor(key) {
  const t = THEMES[key]
  if (!t) return
  activeThemeKey = key
  const light = !isDark()
  const contrastText = getContrastText(t.base)
  const bg = `rgba(${t.rgb},${light ? '.08' : '.12'})`
  /* Write to both <html> and <body>: pre-paint.js stores these same tokens
     inline on body.style when saved prefs exist, which would otherwise shadow
     realtime changes applied to the root. */
  for (const s of [document.documentElement.style, document.body.style]) {
    s.setProperty('--accent', t.base)
    s.setProperty('--accent-h', t.hi)
    s.setProperty('--accent-text', contrastText)
    s.setProperty('--accent-bg', bg)
    s.setProperty('--accent-rgb', t.rgb)
  }
  document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.key === key))
  try { localStorage.setItem('grid_admin_accent', key) } catch (e) {}
}

export function buildSwatches() {
  const grid = document.getElementById('swatch-grid')
  if (!grid) return
  Object.entries(THEMES).forEach(([key, t]) => {
    const el = document.createElement('div')
    el.className = 'swatch' + (key === activeThemeKey ? ' active' : '')
    el.style.background = t.base
    el.title = t.name
    el.dataset.key = key
    el.setAttribute('role', 'button')
    el.addEventListener('click', () => { applyThemeColor(key); refreshCharts() })
    grid.appendChild(el)
  })
}

/* ── radius ─────────────────────────────────────────────────────────────── */
export function setRadius(radius, radiusSm, el) {
  for (const s of [document.documentElement.style, document.body.style]) {
    s.setProperty('--radius', radius)
    s.setProperty('--radius-sm', radiusSm)
  }
  document.querySelectorAll('.radius-opt').forEach(o => o.classList.remove('active'))
  if (el) el.classList.add('active')
  try { localStorage.setItem('grid_admin_radius', radius) } catch (e) {}
}

/* ── base neutral palette ───────────────────────────────────────────────── */
export let activeBaseTheme = 'neutral'
export function setBaseTheme(key) {
  if (!BASE_THEMES[key]) return
  activeBaseTheme = key
  /* The base-palette overrides target the element carrying the dark/light
     class — the <html> node. pre-paint.js also mirrors the attribute on
     body, so keep both in sync for realtime changes. */
  const root = document.documentElement
  if (key === 'neutral') {
    root.removeAttribute('data-base-theme')
    document.body.removeAttribute('data-base-theme')
  } else {
    root.setAttribute('data-base-theme', key)
    document.body.setAttribute('data-base-theme', key)
  }
  try { localStorage.setItem('grid_admin_basetheme', key) } catch (e) {}
  refreshCharts()
}

/* ── font family ────────────────────────────────────────────────────────── */
export let activeFont = 'ubuntu'
export function setFont(key) {
  const f = FONTS[key]
  if (!f) return
  activeFont = key
  for (const s of [document.documentElement.style, document.body.style]) {
    s.setProperty('--sans', f.stack)
  }
  try { localStorage.setItem('grid_admin_font', key) } catch (e) {}
}

/* ── density / width / layout ───────────────────────────────────────────── */
export function setCompact(on) {
  document.body.classList.toggle('layout-compact', on)
  const optCompact = document.getElementById('opt-compact')
  const optRoomy = document.getElementById('opt-roomy')
  if (optCompact) optCompact.classList.toggle('active', on)
  if (optRoomy) optRoomy.classList.toggle('active', !on)
  try { localStorage.setItem('grid_admin_compact', on ? '1' : '0') } catch (e) {}
}

export function syncFooterUserPlacement() {
  const footerUser = document.getElementById('footer-user')
  if (!footerUser) return
  const horizontalDesktop = document.body.classList.contains('layout-horizontal') &&
    window.matchMedia('(min-width: 992px)').matches
  footerUser.classList.toggle('dropup', !horizontalDesktop)
}

export function setLayoutMode(mode) {
  const b = document.body.classList
  const mobile = window.matchMedia('(max-width: 991.98px)').matches
  b.remove('layout-horizontal', 'layout-mini-sidebar')
  if (mode === 'horizontal') b.add('layout-horizontal')
  else if (mode === 'mini-sidebar' && !mobile) b.add('layout-mini-sidebar')

  if (mode === 'condensed') setCompact(true)
  else if (mode === 'comfy') setCompact(false)

  try { localStorage.setItem('grid_admin_layout_mode', mode) } catch (e) {}

  const layoutGroup = document.querySelector('[data-layout-group="layout"]')
  if (layoutGroup) {
    layoutGroup.classList.toggle('open', mode === 'mini-sidebar' || !!layoutGroup.querySelector('.side-link.active'))
    const toggle = layoutGroup.querySelector('.side-group-toggle')
    if (toggle) toggle.setAttribute('aria-expanded', layoutGroup.classList.contains('open'))
  }

  document.querySelectorAll('[data-layout-mode]').forEach(link => {
    link.classList.toggle('active', link.dataset.layoutMode === mode)
  })
  syncFooterUserPlacement()
}

export function setWidthMode(mode) {
  const b = document.body.classList
  b.remove('layout-boxed', 'layout-contained', 'layout-fluid')
  if (mode === 'boxed') b.add('layout-boxed')
  else if (mode === 'contained') b.add('layout-contained')
  else if (mode === 'fluid') b.add('layout-fluid')
  try {
    localStorage.setItem('grid_admin_width_mode', mode)
    localStorage.setItem('grid_admin_boxed', mode === 'boxed' ? '1' : '0')
  } catch (e) {}
  document.querySelectorAll('[data-width-mode]').forEach(link => {
    link.classList.toggle('active', link.dataset.widthMode === mode)
  })
}

export function setFontSize(n) {
  n = Math.min(17, Math.max(13, parseInt(n, 10)))
  document.documentElement.style.fontSize = n + 'px'
  const out = document.getElementById('fs-out')
  const rng = document.getElementById('fs-range')
  if (out) out.textContent = n + 'px'
  if (rng) rng.value = n
  try { localStorage.setItem('grid_admin_fontsize', String(n)) } catch (e) {}
}

/* ── hooks ──────────────────────────────────────────────────────────────── */
export function refreshCharts() {
  if (typeof window.__chartInit === 'function') window.__chartInit()
}
export function runPageInit() {
  if (typeof window.__pageInit === 'function') window.__pageInit()
}

/* ── chart color resolution ─────────────────────────────────────────────── */
export function themeVars() {
  const cs = getComputedStyle(document.documentElement)
  const g = k => cs.getPropertyValue(k).trim()
  return {
    accent:   g('--accent'),
    accentHi: g('--accent-h'),
    rgb:      g('--accent-rgb'),
    grid:     g('--surface2'),
    border:   g('--surface'),
    border2:  g('--border2'),
    green:    g('--green'),
    yellow:   g('--yellow'),
    sky:      g('--sky'),
    text2:    g('--text2'),
    text3:    g('--text3'),
  }
}

/* ── restore saved prefs (app-shell pages; pre-paint.js already applied) ── */
export function restorePrefs() {
  try {
    const theme = localStorage.getItem('grid_admin_theme')
    const accent = localStorage.getItem('grid_admin_accent')
    const radius = localStorage.getItem('grid_admin_radius')
    const fontsize = localStorage.getItem('grid_admin_fontsize')
    const basetheme = localStorage.getItem('grid_admin_basetheme')
    const font = localStorage.getItem('grid_admin_font')
    if (theme === 'dark' || theme === 'light') applyAppearance(theme)
    if (accent && THEMES[accent]) applyThemeColor(accent)
    if (radius && RADIUS_MAP[radius]) {
      const [r, rs] = RADIUS_MAP[radius]
      setRadius(r, rs, document.getElementById(RADIUS_IDS[radius]))
    }
    if (basetheme && BASE_THEMES[basetheme]) {
      activeBaseTheme = basetheme
      document.body.setAttribute('data-base-theme', basetheme)
    }
    if (font && FONTS[font]) setFont(font)
    if (fontsize && fontsize >= 13 && fontsize <= 17) setFontSize(fontsize)
  } catch (e) {}
}
