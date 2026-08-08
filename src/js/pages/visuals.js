/* ══════════════════════════════════════════════════════════════════════════
   VISUALS (preview/visuals.html)
   ══════════════════════════════════════════════════════════════════════════ */
import Chart from 'chart.js/auto'
import { themeVars } from '../theme.js'

function initVisuals() {
  const v = themeVars()
  Chart.defaults.color = v.text3
  Chart.defaults.font.family = 'var(--mono)'
  Chart.defaults.font.size = 11

  if (window._sparkChart) { window._sparkChart.destroy(); window._sparkChart = null }
  const el = document.getElementById('spark-canvas')
  if (!el) return
  window._sparkChart = new Chart(el, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => i + ':00'),
      datasets: [{
        label: 'Requests / hour',
        data: [12, 18, 14, 20, 26, 22, 31, 44, 58, 62, 55, 71, 84, 79, 68, 75, 88, 96, 90, 102, 114, 108, 120, 132],
        borderColor: v.accent,
        backgroundColor: `rgba(${v.rgb},.12)`,
        fill: true,
        tension: .4,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: v.grid }, beginAtZero: true } },
      maintainAspectRatio: false,
    },
  })
}

window.__chartInit = initVisuals
