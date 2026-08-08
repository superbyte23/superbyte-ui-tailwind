/* ══════════════════════════════════════════════════════════════════════════
   LAYOUTS (preview/layouts.html) — gallery active-state sync
   ══════════════════════════════════════════════════════════════════════════ */
(() => {
  const nav = localStorage.getItem('grid_admin_layout_mode')
  const width = localStorage.getItem('grid_admin_width_mode') || (localStorage.getItem('grid_admin_boxed') === '1' ? 'boxed' : 'fluid')
  const compact = localStorage.getItem('grid_admin_compact') === '1'

  const navMode = nav === 'horizontal' || nav === 'mini-sidebar' ? nav : 'vertical'
  const widthMode = width === 'boxed' || width === 'contained' ? width : 'fluid'
  const key = navMode + (widthMode === 'fluid' ? '' : '-' + widthMode)

  document.querySelectorAll('.layout-card').forEach(card => {
    const active = card.dataset.layoutPage
      ? card.dataset.layoutPage === key
      : card.dataset.density === (compact ? 'condensed' : 'comfy')
    card.classList.toggle('active', active)
  })
})()
