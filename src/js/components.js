/* ══════════════════════════════════════════════════════════════════════════
   Superbyte UI v4 — shared components & behaviors
   Vanilla-JS replacements for the Bootstrap interactions the shell relies on:
   modals, dropdowns, offcanvas, tooltips, dropzones, side-nav accordions,
   notifications, context menus. Attached to `window` where inline handlers
   need them.
   ══════════════════════════════════════════════════════════════════════════ */

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
}

export function showToast(type, msg) {
  const c = document.getElementById('toast-container')
  if (!c) return
  const el = document.createElement('div')
  el.className = 'toast-custom ' + type
  el.innerHTML = `<i data-lucide="${type === 'success' ? 'circle-check' : 'circle-x'}" class="${type}"></i><span>${esc(msg)}</span>`
  c.appendChild(el)
  window.__lucideRefresh && window.__lucideRefresh(el)
  setTimeout(() => {
    el.style.animation = 'toastIn .2s ease reverse'
    setTimeout(() => el.remove(), 180)
  }, 3000)
}

export function openAppNav() {
  document.getElementById('app-nav').classList.add('open')
  document.getElementById('app-overlay').classList.add('open')
}
export function closeAppNav() {
  document.getElementById('app-nav').classList.remove('open')
  document.getElementById('app-overlay').classList.remove('open')
}

/* ── modals (data-bs-toggle="modal" / data-bs-target / data-bs-dismiss) ─── */
function initModals() {
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = document.getElementById(trigger.getAttribute('data-bs-target').slice(1))
      if (target) openModal(target)
    })
  })
  document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = btn.closest('.modal')
      if (!m) return
      closeModal(m)
      if (btn.hasAttribute('data-confirm')) m.dispatchEvent(new CustomEvent('confirmed'))
    })
  })
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('mousedown', e => { if (e.target === m) closeModal(m) })
  })
}
export function openModal(el) {
  el.classList.add('open')
  const backdrop = el.querySelector('.modal-backdrop') ||
    el.insertAdjacentHTML('afterbegin', '<div class="modal-backdrop"></div>')
  el.querySelector('.modal-backdrop').addEventListener('mousedown', () => closeModal(el))
  document.body.style.overflow = 'hidden'
  const first = el.querySelector('[autofocus], input, button, textarea, select')
  if (first) setTimeout(() => first.focus(), 40)
}
export function closeModal(el) {
  el.classList.remove('open')
  document.body.style.overflow = ''
}

/* ── dropdowns (data-bs-toggle="dropdown") ──────────────────────────────── */
function initDropdowns() {
  document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(trigger => {
    const wrap = trigger.closest('.dropdown')
    if (!wrap) return
    trigger.addEventListener('click', e => {
      e.stopPropagation()
      const wasOpen = wrap.classList.contains('show')
      closeAllDropdowns()
      if (!wasOpen) wrap.classList.add('show')
    })
  })
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) closeAllDropdowns()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllDropdowns()
  })
}
export function closeAllDropdowns() {
  document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show'))
}

/* ── offcanvas (data-bs-toggle="offcanvas" / data-bs-dismiss) ───────────── */
function initOffcanvas() {
  document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = document.getElementById(trigger.getAttribute('data-bs-target').slice(1))
      if (target) openOffcanvas(target)
    })
  })
  document.querySelectorAll('[data-bs-dismiss="offcanvas"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const oc = btn.closest('.offcanvas')
      if (oc) closeOffcanvas(oc)
    })
  })
}
export function openOffcanvas(el) {
  el.classList.add('open')
  let back = el.nextElementSibling
  if (!back || !back.classList.contains('offcanvas-backdrop')) {
    back = document.createElement('div')
    back.className = 'offcanvas-backdrop'
    el.after(back)
  }
  back.style.display = 'block'
  back.addEventListener('mousedown', () => closeOffcanvas(el))
  document.body.style.overflow = 'hidden'
}
export function closeOffcanvas(el) {
  el.classList.remove('open')
  const back = el.nextElementSibling
  if (back && back.classList.contains('offcanvas-backdrop')) back.style.display = 'none'
  document.body.style.overflow = ''
}

/* ── tooltips (data-bs-toggle="tooltip") ────────────────────────────────── */
function initTooltips() {
  let tip = null
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    const title = el.getAttribute('data-bs-title') || el.getAttribute('title')
    if (!title) return
    el.removeAttribute('title')
    el.addEventListener('mouseenter', () => {
      if (!title) return
      const r = el.getBoundingClientRect()
      tip = document.createElement('div')
      tip.className = 'tooltip'
      tip.textContent = title
      document.body.appendChild(tip)
      tip.style.left = (r.left + r.width / 2 - tip.offsetWidth / 2) + 'px'
      tip.style.top = (r.top - tip.offsetHeight - 8) + 'px'
    })
    el.addEventListener('mouseleave', () => { if (tip) { tip.remove(); tip = null } })
  })
}

/* ── dropzones ──────────────────────────────────────────────────────────── */
function initDropzones() {
  const dropFile = document.getElementById('drop-file')
  if (!dropFile) return
  document.querySelectorAll('.dropzone').forEach(z => {
    z.setAttribute('tabindex', '0')
    z.setAttribute('role', 'button')
    z.addEventListener('click', () => dropFile.click())
    z.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropFile.click() }
    })
  })
  dropFile.addEventListener('change', () => {
    const n = dropFile.files.length
    if (n) showToast('success', n + ' file(s) selected')
    dropFile.value = ''
  })
}

/* ── sidebar sub-menus + collapse toggle ────────────────────────────────── */
function initSideNav() {
  const horizontalDesktop = () => document.body.classList.contains('layout-horizontal') &&
    window.matchMedia('(min-width: 992px)').matches
  const miniSidebarDesktop = () => document.body.classList.contains('layout-mini-sidebar') &&
    window.matchMedia('(min-width: 992px)').matches

  document.querySelectorAll('.side-group-toggle').forEach(t => {
    t.addEventListener('click', () => {
      if (horizontalDesktop() || miniSidebarDesktop()) return
      const g = t.closest('.side-group')
      g.classList.toggle('open')
      t.setAttribute('aria-expanded', g.classList.contains('open'))
    })
    t.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click() }
    })
  })

  let kbNav = false
  document.addEventListener('keydown', () => { kbNav = true })
  document.addEventListener('mousedown', () => { kbNav = false })
  document.querySelectorAll('.side-group').forEach(g => {
    g.addEventListener('focusin', () => {
      if (kbNav && (horizontalDesktop() || miniSidebarDesktop())) g.classList.add('kb-open')
    })
    g.addEventListener('focusout', e => {
      if (!g.contains(e.relatedTarget)) g.classList.remove('kb-open')
    })
  })

  const logo = document.querySelector('.app-logo')
  if (logo && !logo.querySelector('.app-nav-collapse')) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'app-nav-collapse'
    btn.title = 'Toggle sidebar'
    btn.setAttribute('aria-label', 'Toggle sidebar')
    btn.innerHTML = '<i data-lucide="panel-left"></i>'
    btn.addEventListener('click', () => {
      setLayoutMode(document.body.classList.contains('layout-mini-sidebar') ? 'vertical' : 'mini-sidebar')
    })
    logo.appendChild(btn)
  }
}

/* ── analytics tabs (cosmetic active toggle) ────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(x => x.classList.remove('active'))
    t.classList.add('active')
  }))
}

/* ── notifications: mark-as-read + badge ────────────────────────────────── */
function initNotifications() {
  const bell = document.querySelector('.icon-btn[data-bs-toggle="dropdown"]')
  if (!bell) return
  const wrap = bell.closest('.dropdown')
  const menu = wrap && wrap.querySelector('.dropdown-menu')
  const ping = bell.querySelector('.ping')
  if (!wrap || !menu || !ping) return

  const notifs = Array.from(menu.querySelectorAll('.dropdown-item')).filter(i => i.querySelector('small'))
  const divider = menu.querySelector('.dropdown-divider')
  if (divider) {
    const li = document.createElement('li')
    li.innerHTML = '<a class="dropdown-item text-center mark-all" href="#" style="color:var(--accent-h)">Mark all as read</a>'
    divider.insertAdjacentElement('afterend', li)
  }

  const updatePing = () => {
    const n = notifs.filter(i => !i.classList.contains('read')).length
    ping.textContent = n || ''
    ping.style.display = n ? '' : 'none'
  }
  notifs.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      item.classList.add('read')
      updatePing()
      showToast('success', 'Notification marked as read')
    })
  })
  menu.querySelectorAll('.mark-all').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      notifs.forEach(i => i.classList.add('read'))
      updatePing()
      showToast('success', 'All notifications marked as read')
    })
  })
  updatePing()
}

/* ── customizer controls bound from markup data-attributes ──────────────── */
function initCustomizer() {
  document.querySelectorAll('[data-layout-mode]').forEach(link => {
    link.addEventListener('click', e => {
      if (link.hasAttribute('data-layout-nav')) return
      e.preventDefault()
      setLayoutMode(link.dataset.layoutMode)
      showToast('success', 'Layout switched to ' + link.textContent.trim())
    })
  })
  document.querySelectorAll('[data-width-mode]').forEach(opt => {
    opt.addEventListener('click', e => {
      e.preventDefault()
      setWidthMode(opt.dataset.widthMode)
      showToast('success', 'Content width switched to ' + opt.textContent.trim())
    })
  })
}

/* ── context menu (right-click on [data-ctx]) ───────────────────────────── */
function initContextMenu() {
  const menu = document.getElementById('ctx-menu')
  if (!menu) return
  const items = Array.from(menu.querySelectorAll('.ctx-item[data-action]'))
  document.querySelectorAll('[data-ctx]').forEach(el => {
    el.addEventListener('contextmenu', e => {
      e.preventDefault()
      document.querySelectorAll('[data-ctx]').forEach(x => x.classList.remove('ctx-target'))
      el.classList.add('ctx-target')
      menu.style.display = 'block'
      const mw = menu.offsetWidth, mh = menu.offsetHeight
      menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + 'px'
      menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + 'px'
    })
  })
  menu.querySelectorAll('.ctx-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.querySelector('.ctx-target')
      if (item.dataset.action && target) {
        const handler = target.dataset[item.dataset.action]
        if (handler && typeof window[handler] === 'function') window[handler](target)
        else showToast('success', item.textContent.trim() + ' — ' + (target.dataset.name || 'item'))
      }
      menu.style.display = 'none'
      if (target) target.classList.remove('ctx-target')
    })
  })
  document.addEventListener('mousedown', e => {
    if (menu.style.display === 'block' && !menu.contains(e.target)) menu.style.display = 'none'
  })
  window.addEventListener('blur', () => { menu.style.display = 'none' })
}

/* ── mini-sidebar flyouts: fixed-position tooltip panels ───────────────── */
function initMiniSidebarFlyouts() {
  const nav = document.querySelector('.app-navigation')
  if (!nav) return
  const miniDesktop = () => document.body.classList.contains('layout-mini-sidebar') &&
    window.matchMedia('(min-width: 992px)').matches
  const rail = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toolbar-h')) || 56

  const clear = () => nav.querySelectorAll('.side-label, .side-submenu')
    .forEach(el => el.removeAttribute('style'))

  nav.addEventListener('mouseleave', clear)
  nav.addEventListener('scroll', clear)
  window.addEventListener('resize', clear)

  nav.addEventListener('mouseover', e => {
    if (!miniDesktop()) return
    const el = e.target.closest('.side-link, .side-group')
    if (!el || el.parentElement !== nav) return
    const isGroup = el.classList.contains('side-group')
    const anchor = isGroup ? el.querySelector('.side-group-toggle') : el
    const pop = isGroup ? el.querySelector('.side-submenu') : el.querySelector('.side-label')
    if (!anchor || !pop) return
    const r = anchor.getBoundingClientRect()
    pop.style.position = 'fixed'
    pop.style.setProperty('inset-inline-start', (rail + (isGroup ? 2 : 8)) + 'px')
    pop.style.transform = isGroup ? 'none' : 'translateY(-50%)'
    const h = pop.getBoundingClientRect().height
    const maxTop = Math.max(8, window.innerHeight - h - 8)
    pop.style.top = Math.min(r.top + (isGroup ? 0 : r.height / 2), maxTop) + 'px'
  })
}

export function initComponents() {
  initModals()
  initDropdowns()
  initOffcanvas()
  initTooltips()
  initDropzones()
  initSideNav()
  initMiniSidebarFlyouts()
  initTabs()
  initNotifications()
  initCustomizer()
  initContextMenu()
}
