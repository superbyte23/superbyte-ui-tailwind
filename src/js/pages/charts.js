/* ══════════════════════════════════════════════════════════════════════════
   CHARTS (preview/charts.html) — Chart.js gallery
   ══════════════════════════════════════════════════════════════════════════ */
import Chart from 'chart.js/auto'
import { themeVars } from '../theme.js'

const charts = {}

function initCharts() {
  const v = themeVars()
  Chart.defaults.color = v.text3
  Chart.defaults.font.family = 'var(--mono)'
  Chart.defaults.font.size = 11

  Object.values(charts).forEach(c => { if (c) c.destroy() })
  Object.keys(charts).forEach(k => delete charts[k])

  const mk = (id, opts) => {
    const el = document.getElementById(id)
    if (!el) return
    charts[id] = new Chart(el, opts)
  }

  mk('chart-area', {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ label: 'Sessions', data: [820, 940, 1010, 890, 1130, 1480, 1290], borderColor: v.accent, backgroundColor: `rgba(${v.rgb},.14)`, fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: v.grid }, beginAtZero: true } },
      maintainAspectRatio: false,
    },
  })

  mk('chart-bar', {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: '2025', data: [38, 44, 41, 58, 62, 70], backgroundColor: v.accent, borderRadius: 4 },
        { label: '2026', data: [50, 55, 61, 66, 74, 82], backgroundColor: v.accentHi, borderRadius: 4 },
      ],
    },
    options: {
      plugins: { legend: { labels: { usePointStyle: true, boxWidth: 7 } } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: v.grid }, beginAtZero: true } },
      maintainAspectRatio: false,
    },
  })

  mk('chart-doughnut', {
    type: 'doughnut',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{ data: [54, 31, 15], backgroundColor: [v.accent, v.accentHi, v.border2], borderColor: v.border, borderWidth: 3 }],
    },
    options: { plugins: { legend: { display: false } }, cutout: '68%', maintainAspectRatio: false },
  })

  mk('chart-radar', {
    type: 'radar',
    data: {
      labels: ['Speed', 'Reliability', 'UX', 'Docs', 'Support', 'Price'],
      datasets: [
        { label: '2025', data: [78, 82, 74, 88, 66, 71], borderColor: v.accent, backgroundColor: `rgba(${v.rgb},.16)`, pointBackgroundColor: v.accent, borderWidth: 2 },
        { label: '2026', data: [88, 90, 86, 94, 82, 80], borderColor: v.accentHi, backgroundColor: `rgba(${v.rgb},.05)`, pointBackgroundColor: v.accentHi, borderWidth: 2 },
      ],
    },
    options: {
      plugins: { legend: { labels: { usePointStyle: true, boxWidth: 7 } } },
      scales: { r: { grid: { color: v.grid }, angleLines: { color: v.grid }, pointLabels: { color: v.text3 }, ticks: { display: false } } },
      maintainAspectRatio: false,
    },
  })

  mk('chart-combo', {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { type: 'bar', label: 'Revenue', data: [210, 265, 302, 360], backgroundColor: v.accent, borderRadius: 4, yAxisID: 'y' },
        { type: 'line', label: 'Profit margin', data: [18, 21, 24, 27], borderColor: v.green, backgroundColor: v.green, pointRadius: 4, borderWidth: 2, yAxisID: 'y1' },
      ],
    },
    options: {
      plugins: { legend: { labels: { usePointStyle: true, boxWidth: 7 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: v.grid }, beginAtZero: true, position: 'left' },
        y1: { grid: { display: false }, position: 'right', min: 0, max: 40, ticks: { callback: val => val + '%' } },
      },
      maintainAspectRatio: false,
    },
  })
}

window.__chartInit = initCharts
