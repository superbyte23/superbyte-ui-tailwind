/* ══════════════════════════════════════════════════════════════════════════
   CALENDAR (preview/calendar.html) — static month grid, generated
   ══════════════════════════════════════════════════════════════════════════ */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9', '#2961fd', '#8b5cf6', '#d946ef', '#ec4899']

const state = { year: 2026, month: 7 } /* 0-indexed month; today is 2026-08-07 */

const EVENTS = [
  { day: 3, color: 'var(--accent)', text: 'Design sync' },
  { day: 7, color: 'var(--green)', text: 'Deploy v1.4' },
  { day: 12, color: 'var(--sky)', text: 'Client workshop' },
  { day: 14, color: 'var(--accent)', text: 'Standup' },
  { day: 18, color: 'var(--yellow)', text: 'Budget review' },
  { day: 21, color: 'var(--danger)', text: 'Incident retro' },
  { day: 24, color: 'var(--green)', text: 'Ship roadmap' },
  { day: 27, color: 'var(--sky)', text: '1:1 — Sara' },
]

const gridEl = document.getElementById('cal-grid')
const titleEl = document.getElementById('cal-title')
const monthsEl = document.getElementById('cal-months')
const upcomingEl = document.getElementById('cal-upcoming')

let selectedDay = null

function buildMonths() {
  monthsEl.innerHTML = MONTHS.map((m, i) =>
    `<span class="cal-dot-lg ${i === state.month ? 'active' : ''}" style="background:${MONTH_COLORS[i]}" data-m="${i}" title="${m} ${state.year}"></span>`
  ).join('')
  monthsEl.querySelectorAll('.cal-dot-lg').forEach(dot => {
    dot.addEventListener('click', () => {
      state.month = Number(dot.dataset.m)
      if (state.month === 11) { state.month = 0; state.year++ }
      selectedDay = null
      buildMonths()
      render()
    })
  })
}

function render() {
  const first = new Date(state.year, state.month, 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())
  const today = new Date()
  titleEl.textContent = MONTHS[state.month] + ' ' + state.year

  let html = ''
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const inMonth = d.getMonth() === state.month
    const cls = ['cal-cell']
    if (!inMonth) cls.push('muted')
    if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) cls.push('today')
    if (selectedDay && d.getDate() === selectedDay && inMonth) cls.push('selected')
    const dayEvents = inMonth ? EVENTS.filter(e => e.day === d.getDate()) : []
    const shown = dayEvents.slice(0, 3)
    const more = dayEvents.length - shown.length
    html += `<div class="${cls.join(' ')}" data-day="${d.getDate()}" data-in="${inMonth}">
      <div class="cal-day">${d.getDate()}</div>
      <div class="cal-evs">${shown.map(e => `<div class="cal-ev" style="border-inline-start-color:${e.color}" title="${e.text}">${e.text}</div>`).join('')}</div>
      ${more > 0 ? `<div class="cal-more">+${more} more</div>` : ''}
    </div>`
  }
  gridEl.innerHTML = html
  gridEl.querySelectorAll('.cal-cell[data-in="true"]').forEach(cell => {
    cell.addEventListener('click', () => {
      gridEl.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('selected'))
      cell.classList.add('selected')
      selectedDay = Number(cell.dataset.day)
      const n = EVENTS.filter(e => e.day === selectedDay).length
      window.showToast && window.showToast('success', `${MONTHS[state.month]} ${selectedDay} — ${n} event(s)`)
    })
  })
  renderUpcoming()
}

function renderUpcoming() {
  const list = EVENTS.slice().sort((a, b) => a.day - b.day)
  upcomingEl.innerHTML = list.map(e =>
    `<div class="cal-up-row">
      <div class="cal-up-day"><div>${e.day}</div><small>${MONTHS[state.month].slice(0, 3)}</small></div>
      <span class="cal-dot" style="background:${e.color}"></span>
      <b style="color:var(--text);font-size:12.5px;font-weight:600;flex:1">${e.text}</b>
    </div>`
  ).join('')
}

document.getElementById('cal-prev').addEventListener('click', () => {
  state.month--
  if (state.month < 0) { state.month = 11; state.year-- }
  selectedDay = null
  buildMonths()
  render()
})
document.getElementById('cal-next').addEventListener('click', () => {
  state.month++
  if (state.month > 11) { state.month = 0; state.year++ }
  selectedDay = null
  buildMonths()
  render()
})
document.getElementById('cal-today').addEventListener('click', () => {
  const now = new Date()
  state.year = now.getFullYear()
  state.month = now.getMonth()
  selectedDay = null
  buildMonths()
  render()
})

buildMonths()
render()
