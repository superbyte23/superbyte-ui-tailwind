/* ══════════════════════════════════════════════════════════════════════════
   ICONS (preview/icons.html) — full Lucide icon browser
   ══════════════════════════════════════════════════════════════════════════ */
import { icons, createIcons } from 'lucide'

const grid = document.getElementById('icons-grid')
const search = document.getElementById('icons-search')
const strokeSel = document.getElementById('icons-stroke')
const countEl = document.getElementById('icons-count')
const empty = document.getElementById('icons-empty')
const emptyQ = document.getElementById('icons-empty-q')

const names = Object.keys(icons).sort((a, b) => a.localeCompare(b))
let q = ''
let stroke = 2
let matched = names.slice(0, 240)

function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function render() {
  const list = q
    ? names.filter(n => n.toLowerCase().includes(q) || kebab(n).toLowerCase().includes(q))
    : names.slice()
  matched = list.slice(0, 240)
  const total = list.length
  countEl.textContent = total + (total === names.length ? ' icons' : ` / ${names.length} icons`)
  empty.classList.toggle('d-none', total > 0)
  if (emptyQ) emptyQ.textContent = q
  grid.innerHTML = matched.map(n =>
    `<button type="button" class="icon-tile" data-name="${n}" title="${kebab(n)}"><i data-lucide="${kebab(n)}" style="width:20px;height:20px;stroke-width:${stroke}"></i><span>${kebab(n)}</span></button>`
  ).join('')
  createIcons({ icons, nameAttr: 'data-lucide', attrs: { width: 20, height: 20 } })
  grid.querySelectorAll('.icon-tile').forEach(t => {
    t.addEventListener('click', () => {
      const name = kebab(t.dataset.name)
      const done = () => window.showToast && window.showToast('success', `Copied <lucide-${name}>`)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`<i data-lucide="${name}"></i>`).then(done, done)
      } else done()
    })
  })
}

if (search) search.addEventListener('input', () => {
  q = search.value.trim().toLowerCase().replace(/_/g, '-')
  render()
})

if (strokeSel) strokeSel.addEventListener('change', () => {
  stroke = Number(strokeSel.value)
  render()
})

render()
