/* ══════════════════════════════════════════════════════════════════════════
   ECHARTS (preview/echarts.html)
   ══════════════════════════════════════════════════════════════════════════ */
import * as echarts from 'echarts'
import { themeVars } from '../theme.js'

const instances = {}

function initEcharts() {
  const v = themeVars()
  const textStyle = { color: v.text3, fontFamily: 'var(--mono)', fontSize: 11 }

  Object.values(instances).forEach(i => { if (i) i.dispose() })
  Object.keys(instances).forEach(k => delete instances[k])

  const mk = (id, option) => {
    const el = document.getElementById(id)
    if (!el) return
    const inst = echarts.init(el, null, { renderer: 'canvas' })
    inst.setOption(option)
    instances[id] = inst
  }

  mk('ec-line', {
    textStyle,
    grid: { left: 40, right: 18, top: 20, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', boundaryGap: false, data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], axisLine: { lineStyle: { color: v.border2 } }, axisLabel: { color: v.text3 }, splitLine: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: v.text3 }, splitLine: { lineStyle: { color: v.grid } } },
    series: [{
      name: 'Visitors', type: 'line', smooth: true, symbol: 'none',
      lineStyle: { width: 2.5, color: v.accent },
      areaStyle: { opacity: .12, color: v.accent },
      data: [820, 932, 901, 1290, 1330, 1420, 1590, 1720],
    }, {
      name: 'Signups', type: 'line', smooth: true, symbol: 'none',
      lineStyle: { width: 2, color: v.accentHi, type: 'dashed' },
      data: [220, 332, 401, 534, 590, 620, 702, 810],
    }],
    legend: { textStyle: { color: v.text3 }, data: ['Visitors', 'Signups'] },
  })

  mk('ec-rose', {
    textStyle,
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['20%', '72%'], roseType: 'area',
      itemStyle: { borderRadius: 6, borderColor: v.border, borderWidth: 2 },
      label: { color: v.text2, fontFamily: 'var(--mono)', fontSize: 11 },
      data: [
        { value: 42, name: 'Direct', itemStyle: { color: v.accent } },
        { value: 28, name: 'Organic', itemStyle: { color: v.accentHi } },
        { value: 18, name: 'Referral', itemStyle: { color: v.sky || '#38bdf8' } },
        { value: 12, name: 'Social', itemStyle: { color: v.green } },
      ],
    }],
  })

  mk('ec-stack', {
    textStyle,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 18, top: 34, bottom: 30 },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], axisLine: { lineStyle: { color: v.border2 } }, axisLabel: { color: v.text3 } },
    yAxis: { type: 'value', axisLabel: { color: v.text3 }, splitLine: { lineStyle: { color: v.grid } } },
    legend: { textStyle: { color: v.text3 }, data: ['Email', 'Search', 'Paid', 'Social'] },
    series: [
      { name: 'Email', type: 'bar', stack: 'total', barWidth: 46, itemStyle: { color: v.accent, borderRadius: [0, 0, 0, 0] }, data: [320, 402, 491, 534] },
      { name: 'Search', type: 'bar', stack: 'total', itemStyle: { color: v.accentHi }, data: [220, 282, 291, 334] },
      { name: 'Paid', type: 'bar', stack: 'total', itemStyle: { color: v.sky || '#38bdf8' }, data: [150, 232, 201, 254] },
      { name: 'Social', type: 'bar', stack: 'total', itemStyle: { color: v.green, borderRadius: [6, 6, 0, 0] }, data: [98, 120, 150, 180] },
    ],
  })

  const onResize = () => Object.values(instances).forEach(i => i && i.resize())
  window.addEventListener('resize', onResize)
}

window.__chartInit = initEcharts
