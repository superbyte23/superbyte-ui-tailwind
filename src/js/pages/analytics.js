/* ══════════════════════════════════════════════════════════════════════════
   ANALYTICS (preview/analytics.html) — Chart.js charts
   ══════════════════════════════════════════════════════════════════════════ */
import Chart from 'chart.js/auto'
import { themeVars } from '../theme.js'

function initCharts() {
  const v = themeVars()
  Chart.defaults.color = v.text3
  Chart.defaults.font.family = 'var(--mono)'
  Chart.defaults.font.size = 11

  if (window._sessionsChart) { window._sessionsChart.destroy(); window._sessionsChart = null }
  if (window._devicesChart) { window._devicesChart.destroy(); window._devicesChart = null }

  const sessionsEl = document.getElementById('sessionsChart')
  if (sessionsEl) {
    window._sessionsChart = new Chart(sessionsEl, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Sessions', data: [5200, 6100, 5900, 7200, 8100, 9400, 10200], borderColor: v.accent, backgroundColor: `rgba(${v.rgb},.14)`, fill: true, tension: .35, pointRadius: 0, borderWidth: 2 },
          { label: 'Visitors', data: [3400, 3900, 3700, 4600, 5400, 6800, 7400], borderColor: v.border2, borderDash: [4, 4], fill: false, tension: .35, pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: v.grid }, ticks: { callback: n => (n / 1000) + 'k' } } },
        maintainAspectRatio: false,
      },
    })
  }

  const devicesEl = document.getElementById('devicesChart')
  if (devicesEl) {
    window._devicesChart = new Chart(devicesEl, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{ data: [54, 38, 8], backgroundColor: [v.accent, v.accentHi, v.border2], borderColor: v.border, borderWidth: 3 }],
      },
      options: { plugins: { legend: { display: false } }, cutout: '72%', maintainAspectRatio: false },
    })
  }

  const dots = document.querySelectorAll('#devices-card .legend-dot')
  if (dots.length === 3) {
    dots[0].style.background = v.accent
    dots[1].style.background = v.accentHi
    dots[2].style.background = v.border2
  }
}

window.__chartInit = initCharts
