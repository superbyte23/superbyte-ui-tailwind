/* ══════════════════════════════════════════════════════════════════════════
   TABLES (preview/tables.html) — sortable + filterable demo table
   ══════════════════════════════════════════════════════════════════════════ */

const ROWS = [
  { id: 'TRX-1042', user: 'Ada Lovelace', amount: '$1,284.00', status: 'paid', date: '2026-08-05' },
  { id: 'TRX-1043', user: 'Jonas Dahl', amount: '$540.50', status: 'pending', date: '2026-08-06' },
  { id: 'TRX-1044', user: 'Mina Kato', amount: '$92.00', status: 'refunded', date: '2026-08-04' },
  { id: 'TRX-1045', user: 'Sara Chen', amount: '$3,110.20', status: 'paid', date: '2026-08-07' },
  { id: 'TRX-1046', user: 'Omar Farouk', amount: '$230.75', status: 'failed', date: '2026-08-03' },
  { id: 'TRX-1047', user: 'Priya Sharma', amount: '$1,050.00', status: 'paid', date: '2026-08-07' },
]

const TAG = {
  paid: '<span class="tag tag-green">Paid</span>',
  pending: '<span class="tag tag-amber">Pending</span>',
  refunded: '<span class="tag tag-sky">Refunded</span>',
  failed: '<span class="tag tag-red">Failed</span>',
}

const tbody = document.querySelector('#tx-table tbody')
const empty = document.getElementById('tx-empty')
const search = document.getElementById('tbl-search')
let filtered = ROWS.slice()
let sortCol = 'date'
let sortDir = -1

function render() {
  const rows = filtered.slice().sort((a, b) => {
    const av = a[sortCol], bv = b[sortCol]
    return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))) * sortDir
  })
  tbody.innerHTML = rows.map(r =>
    `<tr>
      <td class="mono-cell">${r.id}</td>
      <td class="name-cell">${r.user}</td>
      <td class="mono-cell">${r.amount}</td>
      <td>${TAG[r.status]}</td>
      <td class="mono-cell">${r.date}</td>
    </tr>`
  ).join('')
  empty.classList.toggle('d-none', rows.length > 0)
  const th = document.querySelectorAll('#tx-table th[data-col]')
  th.forEach(h => {
    h.classList.toggle('sort-asc', h.dataset.col === sortCol && sortDir === 1)
    h.classList.toggle('sort-desc', h.dataset.col === sortCol && sortDir === -1)
  })
}

document.querySelectorAll('#tx-table th[data-col]').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col
    if (col === sortCol) sortDir *= -1
    else { sortCol = col; sortDir = -1 }
    render()
  })
})

if (search) {
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase()
    filtered = ROWS.filter(r => [r.id, r.user, r.status].some(v => v.toLowerCase().includes(q)))
    render()
  })
}

render()
