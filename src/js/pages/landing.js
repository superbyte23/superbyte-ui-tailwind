/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE — root index.html behavior
   Bundles lucide for the landing icons and reuses the app theme toggle.
   ══════════════════════════════════════════════════════════════════════════ */
import { createIcons, icons } from 'lucide'
import { toggleTheme } from '../theme.js'

window.toggleLndTheme = toggleTheme

createIcons({ icons, attrs: { class: ['lucide'] } })

const navToggle = document.getElementById('lnd-nav-toggle')
const navLinks = document.getElementById('lnd-nav-links')
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'))
  navLinks.addEventListener('click', () => navLinks.classList.remove('open'))
}
