/* ══════════════════════════════════════════════════════════════════════════
   CREATE (preview/create.html) — theme lab
   Live-applies theme selections and renders a copyable preset.
   ══════════════════════════════════════════════════════════════════════════ */
import {
  THEMES, FONTS, BASE_THEMES,
  applyThemeColor, setBaseTheme, setFont, setRadius, setAppearance,
  setCompact, setWidthMode, setFontSize, isDark,
} from '../theme.js'
import { esc } from '../components.js'

const read = (k, fb) => {
  try {
    const v = localStorage.getItem(k)
    return v === null ? fb : v
  } catch (e) { return fb }
}

const state = {
  accent: read('grid_admin_accent', 'indigo'),
  base: read('grid_admin_basetheme', 'neutral'),
  font: read('grid_admin_font', 'ubuntu'),
  radius: read('grid_admin_radius', '14px'),
  radiusSm: { '4px': '2px', '8px': '4px', '14px': '8px' }[read('grid_admin_radius', '14px')],
  appearance: read('grid_admin_theme', isDark() ? 'dark' : 'light'),
  compact: read('grid_admin_compact', '0') === '1',
  width: read('grid_admin_width_mode', 'fluid'),
  fs: Math.min(17, Math.max(13, parseInt(read('grid_admin_fontsize', '14'), 10) || 14)),
}

const cmdEl = document.getElementById('preset-cmd')
const jsonEl = document.getElementById('preset-json')

/* ── accent swatches ─────────────────────────────────────────────────────── */
const swatches = document.getElementById('create-swatches')
if (swatches) {
  swatches.innerHTML = Object.entries(THEMES).map(([k, t]) =>
    `<div class="swatch ${k === state.accent ? 'active' : ''}" data-key="${k}" title="${esc(t.name)}" style="background:${t.base}"></div>`
  ).join('')
  swatches.addEventListener('click', (e) => {
    const s = e.target.closest('.swatch')
    if (!s) return
    state.accent = s.dataset.key
    swatches.querySelectorAll('.swatch').forEach(x => x.classList.toggle('active', x === s))
    applyThemeColor(state.accent)
    renderPreset()
  })
}

/* ── base theme dots ─────────────────────────────────────────────────────── */
const BASE_DOTS = { neutral: '#6b7280', stone: '#78716c', zinc: '#71717a', mauve: '#8b7f9e', olive: '#6e7459', mist: '#7a8a99', taupe: '#8b8172' }
const baseThemes = document.getElementById('create-base-themes')
if (baseThemes) {
  baseThemes.innerHTML = Object.keys(BASE_THEMES).map(k =>
    `<button type="button" class="base-theme-opt ${k === state.base ? 'active' : ''}" data-key="${k}" title="${esc(BASE_THEMES[k].name)}"><span class="dot" style="background:${BASE_DOTS[k]}"></span><span class="nm">${esc(BASE_THEMES[k].name)}</span></button>`
  ).join('')
  baseThemes.addEventListener('click', (e) => {
    const b = e.target.closest('.base-theme-opt')
    if (!b) return
    state.base = b.dataset.key
    baseThemes.querySelectorAll('.base-theme-opt').forEach(x => x.classList.toggle('active', x === b))
    setBaseTheme(state.base)
    renderPreset()
  })
}

/* ── font select ─────────────────────────────────────────────────────────── */
const fontSel = document.getElementById('create-font')
const fontPrev = document.getElementById('create-font-preview')
if (fontSel) {
  fontSel.innerHTML = Object.entries(FONTS).map(([k, f]) =>
    `<option value="${k}" style="font-family:${f.stack}">${esc(f.name)}</option>`
  ).join('')
  fontSel.value = state.font
  fontSel.addEventListener('change', () => {
    state.font = fontSel.value
    if (fontPrev) fontPrev.style.fontFamily = FONTS[fontSel.value].stack
    setFont(state.font)
    renderPreset()
  })
}

/* ── radius ──────────────────────────────────────────────────────────────── */
const radiusWrap = document.getElementById('create-radius')
if (radiusWrap) {
  radiusWrap.addEventListener('click', (e) => {
    const b = e.target.closest('.radius-opt')
    if (!b) return
    state.radius = b.dataset.r
    state.radiusSm = b.dataset.rs
    radiusWrap.querySelectorAll('.radius-opt').forEach(x => x.classList.toggle('active', x === b))
    setRadius(state.radius, state.radiusSm, b)
    renderPreset()
  })
}

/* ── appearance ──────────────────────────────────────────────────────────── */
const appearanceWrap = document.getElementById('create-appearance')
if (appearanceWrap) {
  appearanceWrap.addEventListener('click', (e) => {
    const b = e.target.closest('.radius-opt')
    if (!b) return
    state.appearance = b.dataset.mode
    appearanceWrap.querySelectorAll('.radius-opt').forEach(x => x.classList.toggle('active', x === b))
    setAppearance(state.appearance)
    renderPreset()
  })
}

/* ── layout: density + width ─────────────────────────────────────────────── */
function wireToggle(id, apply, setVal) {
  const el = document.getElementById(id)
  if (!el) return
  el.addEventListener('click', () => {
    const on = apply(state)
    setVal(on)
    el.classList.toggle('active', on)
    const off = document.getElementById(id === 'create-compact' ? 'create-roomy' : 'create-fluid')
    if (off) off.classList.toggle('active', !on)
    renderPreset()
  })
}
wireToggle('create-compact', () => { setCompact(true); return true }, v => { state.compact = v })
wireToggle('create-roomy', () => { setCompact(false); return false }, v => { state.compact = v })
wireToggle('create-fluid', () => { setWidthMode('fluid'); return 'fluid' }, v => { state.width = v })
wireToggle('create-boxed', () => { setWidthMode('boxed'); return 'boxed' }, v => { state.width = v })

/* ── base font size ──────────────────────────────────────────────────────── */
const fsRange = document.getElementById('create-fs')
const fsOut = document.getElementById('create-fs-out')
if (fsRange) {
  fsRange.addEventListener('input', () => {
    state.fs = Number(fsRange.value)
    setFontSize(state.fs)
    if (fsOut) fsOut.textContent = state.fs + 'px'
    renderPreset()
  })
}

/* ── randomize ───────────────────────────────────────────────────────────── */
document.getElementById('create-random').addEventListener('click', () => {
  const pick = (obj) => Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]
  state.accent = pick(THEMES)
  state.base = pick(BASE_THEMES)
  state.font = pick(FONTS)
  state.radius = ['4px', '8px', '14px'][Math.floor(Math.random() * 3)]
  state.radiusSm = { '4px': '2px', '8px': '4px', '14px': '8px' }[state.radius]
  state.appearance = Math.random() < 0.5 ? 'dark' : 'light'
  state.compact = Math.random() < 0.5
  state.width = ['fluid', 'boxed'][Math.floor(Math.random() * 2)]
  state.fs = 13 + Math.floor(Math.random() * 5)

  applyThemeColor(state.accent)
  setBaseTheme(state.base)
  setFont(state.font)
  setAppearance(state.appearance)
  setCompact(state.compact)
  setWidthMode(state.width)
  setFontSize(state.fs)
  syncUI()
  renderPreset()
})

/* ── sync UI controls to current state (init + randomize) ────────────────── */
function syncUI() {
  if (fontSel) {
    fontSel.value = state.font
    if (fontPrev) fontPrev.style.fontFamily = FONTS[state.font].stack
  }
  if (swatches) swatches.querySelectorAll('.swatch').forEach(x => x.classList.toggle('active', x.dataset.key === state.accent))
  if (baseThemes) baseThemes.querySelectorAll('.base-theme-opt').forEach(x => x.classList.toggle('active', x.dataset.key === state.base))
  if (radiusWrap) radiusWrap.querySelectorAll('.radius-opt').forEach(x => x.classList.toggle('active', x.dataset.r === state.radius))
  if (appearanceWrap) appearanceWrap.querySelectorAll('.radius-opt').forEach(x => x.classList.toggle('active', x.dataset.mode === state.appearance))
  ;['create-compact', 'create-roomy'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.classList.toggle('active', (id === 'create-compact') === state.compact)
  })
  ;['create-fluid', 'create-boxed'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.classList.toggle('active', (id === 'create-fluid') === (state.width === 'fluid'))
  })
  if (fsRange) {
    fsRange.value = state.fs
    if (fsOut) fsOut.textContent = state.fs + 'px'
  }
}

/* ── preset rendering + copy ─────────────────────────────────────────────── */
function highlight(s) {
  return s
    .replace(/"([^"]+)":/g, '<span class="tok-k">"$1"</span>:')
    .replace(/: "(.*)"/g, ': <span class="tok-v">"$1"</span>')
    .replace(/: (true|false|\d+)/g, ': <span class="tok-l">$1</span>')
}

function renderPreset() {
  const preset = {
    accent: state.accent,
    baseTheme: state.base,
    font: state.font,
    radius: state.radius,
    appearance: state.appearance,
    layout: state.compact ? 'compact' : 'roomy',
    width: state.width,
    fontSize: state.fs,
  }
  const json = JSON.stringify(preset, null, 2)
  if (cmdEl) cmdEl.textContent = "npx superbyte --preset '" + JSON.stringify(preset) + "'"
  if (jsonEl) jsonEl.innerHTML = highlight(json)
}

const copyBtn = document.getElementById('create-copy-cmd')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const text = (cmdEl && cmdEl.textContent) || ''
    const done = () => window.showToast && window.showToast('success', 'Command copied to clipboard')
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done)
    } else done()
  })
}

syncUI()
renderPreset()
