/* ══════════════════════════════════════════════════════════════════════════
   FORMS (preview/forms.html)
   ══════════════════════════════════════════════════════════════════════════ */

const formsForm = document.getElementById('forms-form')
if (formsForm) {
  formsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let firstBad = null
    formsForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'))
    formsForm.querySelectorAll('[required]').forEach((el) => {
      let bad = !el.value.trim()
      if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) bad = true
      if (bad) {
        el.classList.add('is-invalid')
        if (!firstBad) firstBad = el
      }
    })
    if (firstBad) {
      window.showToast && window.showToast('error', 'Please fix the highlighted fields')
      firstBad.focus()
      return
    }
    window.showToast && window.showToast('success', 'Form submitted (demo — nothing saved)')
  })
}

const area = document.getElementById('f-area')
const areaCount = document.getElementById('f-area-count')
if (area && areaCount) {
  const update = () => { areaCount.textContent = area.value.length }
  area.addEventListener('input', update)
  update()
}

const fsRange = document.getElementById('f-range')
const fsOut = document.getElementById('f-range-out')
if (fsRange && fsOut) {
  fsRange.addEventListener('input', () => { fsOut.textContent = fsRange.value })
}
