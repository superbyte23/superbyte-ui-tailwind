/* ══════════════════════════════════════════════════════════════════════════
   FILE MANAGER (preview/file-manager.html)
   ══════════════════════════════════════════════════════════════════════════ */

const ITEMS = [
  { name: 'brand-assets', type: 'folder', size: '—', modified: 'Aug 04', icon: 'folder', color: 'var(--yellow)' },
  { name: 'design-system', type: 'folder', size: '—', modified: 'Jul 28', icon: 'folder', color: 'var(--yellow)' },
  { name: 'roadmap-2026.pdf', type: 'pdf', size: '2.4 MB', modified: 'Aug 02', icon: 'file-text', color: 'var(--danger)' },
  { name: 'budget-q3.xlsx', type: 'sheet', size: '188 KB', modified: 'Aug 01', icon: 'file-spreadsheet', color: 'var(--green)' },
  { name: 'release-v1.4.zip', type: 'archive', size: '14.8 MB', modified: 'Jul 30', icon: 'file-archive', color: 'var(--accent)' },
  { name: 'hero-cover.png', type: 'image', size: '3.1 MB', modified: 'Jul 26', icon: 'image', color: 'var(--sky)' },
  { name: 'changelog.md', type: 'text', size: '12 KB', modified: 'Jul 22', icon: 'file-code-2', color: 'var(--text3)' },
  { name: 'analytics-widgets.tsx', type: 'code', size: '46 KB', modified: 'Jul 19', icon: 'file-code', color: 'var(--accent-h)' },
]

const grid = document.getElementById('fm-grid')
const search = document.getElementById('fm-search')

function render() {
  const q = search ? search.value.trim().toLowerCase() : ''
  const list = ITEMS.filter(i => i.name.toLowerCase().includes(q))
  grid.innerHTML = list.map((item, i) => `
    <div class="card fm-item" data-idx="${i}" data-name="${item.name}" data-ctx data-rename="fmRename">
      <div class="d-flex align-center gap-3 mb-3">
        <div class="fm-icon" style="color:${item.color};background:color-mix(in srgb, ${item.color} 12%, transparent)"><i data-lucide="${item.icon}" style="width:22px;height:22px"></i></div>
        <div class="flex-1" style="min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}</div>
          <div style="font-size:11.5px;color:var(--text3)">${item.size} · ${item.modified}</div>
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <button type="button" class="btn btn-sm btn-ghost flex-1">${item.type === 'folder' ? 'Open' : 'Preview'}</button>
        <button type="button" class="row-btn" title="Download"><i data-lucide="download"></i></button>
        <button type="button" class="row-btn del" title="Delete"><i data-lucide="trash-2"></i></button>
      </div>
    </div>`).join('')
  grid.querySelectorAll('.fm-item').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.row-btn,.btn')) return
      const n = card.dataset.name
      window.showToast && window.showToast('success', (card.querySelector('[data-lucide="folder"]') ? 'Opened folder' : 'Selected') + ' ' + n)
    })
    card.querySelectorAll('.row-btn.del').forEach(b => {
      b.addEventListener('click', () => {
        card.style.opacity = '.45'
        window.showToast && window.showToast('success', card.dataset.name + ' deleted (demo)')
      })
    })
    card.querySelectorAll('.row-btn').forEach(b => {
      if (!b.classList.contains('del')) b.addEventListener('click', () => {
        window.showToast && window.showToast('success', 'Downloading ' + card.dataset.name + ' (demo)')
      })
    })
  })
}

window.fmRename = function (el) {
  window.showToast && window.showToast('success', 'Rename ' + el.dataset.name)
}

document.getElementById('fm-upload').addEventListener('click', () => {
  window.showToast && window.showToast('success', 'Upload dialog (demo)')
})

if (search) search.addEventListener('input', render)
render()
