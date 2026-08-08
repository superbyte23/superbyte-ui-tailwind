/* ══════════════════════════════════════════════════════════════════════════
   RECORDS (preview/records.html) — demo data table
   Client-side render, filter, column sort and bulk selection. No library.
   ══════════════════════════════════════════════════════════════════════════ */
import { esc } from '../components.js'

const DATA = [
  { id: '#1041', customer: 'Ava Thompson', status: 'paid',     date: 'Aug 04, 2026', total: '$1,204.00' },
  { id: '#1042', customer: 'Liam Nguyen',  status: 'pending',  date: 'Aug 04, 2026', total: '$340.50' },
  { id: '#1043', customer: 'Sofia Reyes',  status: 'refunded', date: 'Aug 03, 2026', total: '$2,180.00' },
  { id: '#1044', customer: 'Noah Fischer', status: 'paid',     date: 'Aug 03, 2026', total: '$89.99' },
  { id: '#1045', customer: 'Mia Kowalski', status: 'failed',   date: 'Aug 02, 2026', total: '$1,480.00' },
  { id: '#1046', customer: 'Ethan Brooks', status: 'paid',     date: 'Aug 02, 2026', total: '$640.20' },
  { id: '#1047', customer: 'Luna Park',    status: 'pending',  date: 'Aug 01, 2026', total: '$112.00' },
  { id: '#1048', customer: 'Owen Carter',  status: 'paid',     date: 'Jul 31, 2026', total: '$4,010.00' },
]

const TAG = { paid: 'tag-green', pending: 'tag-amber', refunded: 'tag-sky', failed: 'tag-red' }

const tbody = document.getElementById('records-tbody')
const search = document.getElementById('table-search')
const checkAll = document.getElementById('check-all')
const selBar = document.getElementById('sel-toolbar')
const selCount = document.getElementById('sel-count')
const empty = document.getElementById('records-empty')
const countEl = document.getElementById('records-count')

let filtered = DATA.slice()

function rowHtml(r, i) {
  return '<tr data-idx="' + i + '">' +
    '<td class="cell-check"><input type="checkbox" class="row-check" aria-label="Select row"></td>' +
    '<td class="mono-cell" style="color:var(--accent-h)">' + esc(r.id) + '</td>' +
    '<td class="name-cell">' + esc(r.customer) + '</td>' +
    '<td><span class="tag ' + TAG[r.status] + '">' + esc(r.status) + '</span></td>' +
    '<td class="mono-cell">' + esc(r.date) + '</td>' +
    '<td class="mono-cell">' + esc(r.total) + '</td>' +
    '<td><div class="row-actions">' +
    '<button class="row-btn" title="View" onclick="showToast(\'success\',\'Opening ' + esc(r.id) + '\')"><i data-lucide="eye"></i></button>' +
    '<button class="row-btn del" title="Delete" onclick="recordsDelete(' + i + ')"><i data-lucide="trash-2"></i></button>' +
    '</div></td></tr>'
}

function render() {
  tbody.innerHTML = filtered.map(rowHtml).join('')
  empty.classList.toggle('d-none', filtered.length > 0)
  countEl.textContent = filtered.length === 0 ? 'No records'
    : 'Showing 1–' + filtered.length + ' of ' + filtered.length
  window.__refreshIcons && window.__refreshIcons()
  refreshSelection()
}

function refreshSelection() {
  const rows = Array.from(tbody.querySelectorAll('.row-check'))
  const selected = rows.filter(c => c.checked).length
  selCount.textContent = selected
  selBar.classList.toggle('visible', selected > 0)
  if (checkAll) {
    checkAll.checked = rows.length > 0 && selected === rows.length
    checkAll.indeterminate = selected > 0 && selected < rows.length
  }
}

function applyFilter() {
  const q = (search.value || '').trim().toLowerCase()
  filtered = q ? DATA.filter(r =>
    r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) ||
    r.status.toLowerCase().includes(q) || r.total.toLowerCase().includes(q)) : DATA.slice()
  render()
}

window.recordsDelete = function (idx) {
  const modal = document.getElementById('deleteModal')
  if (modal && window.openModal) {
    window.openModal(modal)
    modal.addEventListener('confirmed', () => {
      const r = DATA[idx]
      if (!r) return
      const i = filtered.indexOf(r)
      if (i >= 0) filtered.splice(i, 1)
      render()
    }, { once: true })
  }
}

window.deleteSelected = function () {
  const modal = document.getElementById('deleteModal')
  if (modal && window.openModal) {
    window.openModal(modal)
    modal.addEventListener('confirmed', () => {
      const checked = new Set(Array.from(tbody.querySelectorAll('.row-check')).filter(c => c.checked).map(c => c.closest('tr').dataset.idx))
      filtered = filtered.filter((r, i) => !checked.has(String(i)))
      render()
    }, { once: true })
  }
}

if (tbody) render()
if (search) search.addEventListener('input', applyFilter)
if (checkAll) checkAll.addEventListener('change', () => {
  tbody.querySelectorAll('.row-check').forEach(c => { c.checked = checkAll.checked })
  refreshSelection()
})
if (tbody) tbody.addEventListener('change', (e) => {
  if (e.target.classList && e.target.classList.contains('row-check')) refreshSelection()
})

document.querySelectorAll('#records-table th[data-col]').forEach((th) => {
  th.addEventListener('click', () => {
    const col = th.dataset.col
    const asc = !th.classList.contains('sort-asc')
    document.querySelectorAll('#records-table th[data-col]').forEach(h => h.classList.remove('sort-asc', 'sort-desc'))
    th.classList.toggle('sort-asc', asc)
    th.classList.toggle('sort-desc', !asc)
    filtered = filtered.slice().sort((a, b) => {
      const x = a[col], y = b[col]
      return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1)
    })
    render()
  })
})
