/* ══════════════════════════════════════════════════════════════════════════
   Superbyte UI v4 — app entry (module)
   Loaded on every app-shell page after the page module. Registers lucide,
   boots the theme engine + components, then runs the page hooks.
   ══════════════════════════════════════════════════════════════════════════ */
import { createIcons, icons } from 'lucide'
import * as theme from './theme.js'
import {
  esc, showToast, openAppNav, closeAppNav,
  openModal, closeModal, openOffcanvas, closeOffcanvas,
  initComponents,
} from './components.js'

/* ── expose globals for inline handlers ─────────────────────────────────── */
window.esc = esc
window.showToast = showToast
window.openAppNav = openAppNav
window.closeAppNav = closeAppNav
window.openModal = openModal
window.closeModal = closeModal
window.openOffcanvas = openOffcanvas
window.closeOffcanvas = closeOffcanvas
window.toggleTheme = theme.toggleTheme
window.setAppearance = theme.setAppearance
window.applyThemeColor = theme.applyThemeColor
window.setRadius = theme.setRadius
window.setBaseTheme = theme.setBaseTheme
window.setFont = theme.setFont
window.setCompact = theme.setCompact
window.setLayoutMode = theme.setLayoutMode
window.setWidthMode = theme.setWidthMode
window.setFontSize = theme.setFontSize
window.THEMES = theme.THEMES
window.FONTS = theme.FONTS
window.BASE_THEMES = theme.BASE_THEMES
window.themeVars = theme.themeVars

/* ── lucide ─────────────────────────────────────────────────────────────── */
window.__refreshIcons = () => {
  try { createIcons({ icons, attrs: { class: ['lucide'] } }) } catch (e) {}
}
window.__refreshIcons()

/* ── boot ───────────────────────────────────────────────────────────────── */
theme.buildSwatches()
initComponents()

/* ── layout preset pages sync (see v1 app.js for the rationale) ─────────── */
function syncLayoutPresets() {
  const comboPage = /layout-(vertical|horizontal|mini-sidebar)(?:-(boxed|contained))?\.html$/.exec(location.pathname)
  const densityPage = /layout-(condensed|comfy)\.html$/.exec(location.pathname)
  const bodyCls = document.body.classList
  const storedNav = localStorage.getItem('grid_admin_layout_mode')
  const storedCompact = localStorage.getItem('grid_admin_compact')
  const preApplied = bodyCls.contains('layout-fluid') || bodyCls.contains('layout-boxed') ||
    bodyCls.contains('layout-contained')

  let nav = comboPage ? comboPage[1] : null
  let width = comboPage ? (comboPage[2] || 'fluid') : null
  let compact
  if (preApplied) {
    if (!nav) nav = bodyCls.contains('layout-horizontal') ? 'horizontal'
      : bodyCls.contains('layout-mini-sidebar') ? 'mini-sidebar' : 'vertical'
    if (!width) width = bodyCls.contains('layout-boxed') ? 'boxed'
      : bodyCls.contains('layout-contained') ? 'contained' : 'fluid'
    compact = bodyCls.contains('layout-compact')
  } else {
    if (!nav) nav = (storedNav === 'horizontal' || storedNav === 'mini-sidebar' || storedNav === 'vertical') ? storedNav : 'vertical'
    if (!width) width = localStorage.getItem('grid_admin_width_mode') || (localStorage.getItem('grid_admin_boxed') === '1' ? 'boxed' : 'fluid')
    compact = densityPage ? densityPage[1] === 'condensed'
      : (storedNav === 'condensed' || storedNav === 'comfy') ? storedNav === 'condensed'
      : storedCompact === '1'
  }
  if (densityPage) compact = densityPage[1] === 'condensed'
  theme.setLayoutMode(nav)
  theme.setCompact(compact)
  theme.setWidthMode(width)

  const pageKey = densityPage ? densityPage[1] : (comboPage ? comboPage[1] + (comboPage[2] ? '-' + comboPage[2] : '') : null)
  if (pageKey) {
    document.querySelectorAll('[data-layout-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.layoutPage === pageKey)
    })
  }
}

/* ── loading overlay (first load per session) ───────────────────────────── */
function initLoadingOverlay() {
  if (sessionStorage.getItem('grid_admin_loaded')) return
  sessionStorage.setItem('grid_admin_loaded', '1')
  const ov = document.createElement('div')
  ov.id = 'loading-overlay'
  ov.innerHTML = '<div class="loader"><span></span><span></span><span></span><span></span><span></span><span></span></div>'
  document.body.appendChild(ov)
  requestAnimationFrame(() => ov.classList.add('done'))
  setTimeout(() => ov.remove(), 900)
}

/* ── scroll to top ──────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.createElement('button')
  btn.id = 'scroll-top'
  btn.type = 'button'
  btn.setAttribute('aria-label', 'Back to top')
  btn.innerHTML = '<i data-lucide="arrow-up"></i>'
  document.body.appendChild(btn)
  window.__refreshIcons()
  const onScroll = () => btn.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop) > 400)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

/* ── quick search palette (Ctrl+K / /, and toolbar input) ───────────────── */
function initQuickSearch() {
  const links = Array.from(document.querySelectorAll('#app-nav a.side-link[href]'))
    .map(a => ({ label: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') }))
    .filter(l => l.label && l.href && !l.href.startsWith('#'))
  const keyOf = l => (l.label + ' ' + l.href).toLowerCase()
  const input = document.getElementById('global-search')
  if (!links.length && !input) return

  const modal = document.createElement('div')
  modal.id = 'quick-search'
  modal.innerHTML =
    '<div class="qs-box">' +
    '<div class="qs-head"><i data-lucide="search"></i>' +
    '<input class="qs-input" type="text" placeholder="Type to search pages…" autocomplete="off">' +
    '<button type="button" class="qs-close" aria-label="Close"><i data-lucide="x"></i></button></div>' +
    '<div class="qs-body"></div>' +
    '<div class="qs-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div></div>'
  document.body.appendChild(modal)
  window.__refreshIcons()

  const box = modal.querySelector('.qs-box')
  const qsInput = modal.querySelector('.qs-input')
  const bodyEl = modal.querySelector('.qs-body')
  let results = []
  let selected = -1

  function render(q) {
    q = q.trim().toLowerCase()
    results = q ? links.filter(l => keyOf(l).includes(q)) : links.slice(0, 8)
    selected = results.length ? 0 : -1
    if (!results.length) {
      bodyEl.innerHTML = '<div class="qs-empty"><i data-lucide="search-minus"></i> No matching pages</div>'
      window.__refreshIcons()
      return
    }
    bodyEl.innerHTML = results.map(l =>
      `<a class="qs-item" href="${l.href}"><span class="qs-label">${esc(l.label)}</span><span class="qs-hint">${esc(l.href)}</span></a>`).join('')
    mark()
  }
  function mark() {
    bodyEl.querySelectorAll('.qs-item').forEach((el, i) => el.classList.toggle('sel', i === selected))
    const cur = bodyEl.querySelector('.qs-item.sel')
    if (cur) cur.scrollIntoView({ block: 'nearest' })
  }
  function openSel() {
    if (!results.length) return
    window.location.href = results[selected >= 0 ? selected : 0].href
  }
  function show() {
    modal.classList.add('open')
    qsInput.value = ''
    render('')
    qsInput.focus()
  }
  function hide() {
    modal.classList.remove('open')
    if (input) input.blur()
  }

  modal.addEventListener('mousedown', e => { if (e.target === modal) hide() })
  modal.querySelector('.qs-close').addEventListener('click', hide)
  bodyEl.addEventListener('click', e => {
    const item = e.target.closest('.qs-item')
    if (item) { e.preventDefault(); window.location.href = item.getAttribute('href') }
  })
  qsInput.addEventListener('input', () => render(qsInput.value))
  qsInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = (selected + 1) % results.length; mark() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = (selected - 1 + results.length) % results.length; mark() }
    else if (e.key === 'Enter') { e.preventDefault(); openSel() }
    else if (e.key === 'Escape') { e.preventDefault(); hide() }
  })
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); show() }
    else if (e.key === 'Escape' && modal.classList.contains('open')) hide()
    else if (e.key === '/' && !e.ctrlKey && !e.metaKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault(); show()
    }
  })
  if (input) input.addEventListener('focus', show)
}

/* ── keyboard support for icon-btn / avatar-btn ─────────────────────────── */
function initKeyableButtons() {
  document.querySelectorAll('.icon-btn, .avatar-btn').forEach(el => {
    el.setAttribute('tabindex', '0')
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click() }
    })
  })
}

/* ── boot sequence ──────────────────────────────────────────────────────── */
syncLayoutPresets()
initKeyableButtons()
initLoadingOverlay()
initScrollTop()
initQuickSearch()
window.addEventListener('resize', theme.syncFooterUserPlacement)

theme.restorePrefs()
theme.refreshCharts()
theme.runPageInit()
