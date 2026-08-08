/* ══════════════════════════════════════════════════════════════════════════
   MAPS (preview/maps.html) — Leaflet
   Tiles are fetched at runtime from OpenStreetMap (data, not a vendored
   resource); the library itself comes from node_modules.
   ══════════════════════════════════════════════════════════════════════════ */
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { themeVars } from '../theme.js'

const TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function initMap() {
  const v = themeVars()
  const el = document.getElementById('offices-map')
  if (!el) return

  if (window._officesMap) {
    window._officesMap.remove()
    window._officesMap = null
  }

  const map = L.map(el, { scrollWheelZoom: false }).setView([40, -10], 2)
  window._officesMap = map

  L.tileLayer(TILES_URL, {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  const offices = [
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194, color: v.accent },
    { name: 'New York', lat: 40.7128, lon: -74.006, color: v.sky || '#38bdf8' },
    { name: 'London', lat: 51.5074, lon: -0.1278, color: v.green },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: v.yellow },
  ]

  offices.forEach(o => {
    L.circleMarker([o.lat, o.lon], {
      radius: 9,
      color: o.color,
      weight: 2,
      fillColor: o.color,
      fillOpacity: .35,
    }).addTo(map).bindPopup(`<b>${o.name}</b>`)
  })
}

window.__pageInit = initMap
