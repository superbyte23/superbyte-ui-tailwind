/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD (preview/index.html) — Chart.js charts
   ══════════════════════════════════════════════════════════════════════════ */
import Chart from 'chart.js/auto'
import { themeVars } from '../theme.js'

function initCharts() {
  const v = themeVars()
  Chart.defaults.color = v.text3
  Chart.defaults.font.family = 'var(--mono)'
  Chart.defaults.font.size = 11

  if (window._revenueChart) { window._revenueChart.destroy(); window._revenueChart = null }
  if (window._trafficChart) { window._trafficChart.destroy(); window._trafficChart = null }

  const revenueEl = document.getElementById('revenueChart')
  if (revenueEl) {
    window._revenueChart = new Chart(revenueEl, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          { label: 'Revenue', data: [42, 49, 45, 58, 63, 70, 84], borderColor: v.accent, backgroundColor: `rgba(${v.rgb},.12)`, fill: true, tension: .35, pointRadius: 0, borderWidth: 2 },
          { label: 'Target', data: [45, 45, 50, 55, 60, 65, 70], borderColor: v.border2, borderDash: [4, 4], fill: false, tension: .35, pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: v.grid } } },
        maintainAspectRatio: false,
      },
    })
  }

  const trafficEl = document.getElementById('trafficChart')
  if (trafficEl) {
    window._trafficChart = new Chart(trafficEl, {
      type: 'doughnut',
      data: {
        labels: ['Direct', 'Organic', 'Referral'],
        datasets: [{ data: [48, 31, 21], backgroundColor: [v.accent, v.accentHi, v.border2], borderColor: v.border, borderWidth: 3 }],
      },
      options: { plugins: { legend: { display: false } }, cutout: '72%', maintainAspectRatio: false },
    })
  }

  const dots = document.querySelectorAll('#traffic-sources .legend-dot')
  if (dots.length === 3) {
    dots[0].style.background = v.accent
    dots[1].style.background = v.accentHi
    dots[2].style.background = v.border2
  }
}

window.__chartInit = initCharts
