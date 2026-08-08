/* ══════════════════════════════════════════════════════════════════════════
   AUTH PAGES — shared behavior for all 8 screens
   Demo only: fake validation, no real request is ever sent.
   Loaded as the page module (before main.js, which exposes window.showToast).
   ══════════════════════════════════════════════════════════════════════════ */
function toastOk(msg) { window.showToast('success', msg) }
function toastErr(msg) { window.showToast('error', msg) }
function setValidity(input, ok) { input.classList.toggle('is-invalid', !ok) }

const form = document.getElementById('auth-form')
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let ok = true
    form.querySelectorAll('input[required]').forEach((inp) => {
      const v = inp.value.trim()
      const good = v !== '' && (inp.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))
      setValidity(inp, good)
      if (!good) ok = false
    })
    const p1 = document.getElementById('reg-pass')
    const p2 = document.getElementById('reg-cfpass')
    if (p1 && p2 && p1.value !== p2.value) { setValidity(p2, false); ok = false }
    const otp = form.querySelectorAll('.otp-box')
    if (otp.length) {
      const filled = Array.prototype.every.call(otp, (b) => b.value.trim() !== '')
      otp.forEach((b) => setValidity(b, filled))
      if (!filled) ok = false
    }
    if (ok) toastOk('All good — this is a demo, no request was sent.')
    else toastErr('Please fix the highlighted fields.')
  })
}

/* OTP boxes — auto-advance, backspace, paste */
const otpBoxes = Array.from(document.querySelectorAll('.otp-box'))
otpBoxes.forEach((box, i) => {
  box.addEventListener('input', () => {
    box.value = box.value.replace(/\D/g, '').slice(0, 1)
    if (box.value && otpBoxes[i + 1]) otpBoxes[i + 1].focus()
  })
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && otpBoxes[i - 1]) otpBoxes[i - 1].focus()
  })
  box.addEventListener('paste', (e) => {
    e.preventDefault()
    const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, otpBoxes.length)
    otpBoxes.forEach((b, j) => { b.value = digits[j] || '' })
    otpBoxes[Math.min(digits.length, otpBoxes.length - 1)].focus()
  })
})

/* Resend-code countdown buttons */
function armResend(btn) {
  let n = 30
  const label = btn.dataset.resend || btn.textContent
  btn.disabled = true
  btn.textContent = label + ' (' + n + 's)'
  toastOk(label + ' — check your inbox')
  const t = setInterval(() => {
    n--
    if (n <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = label }
    else btn.textContent = label + ' (' + n + 's)'
  }, 1000)
}
document.querySelectorAll('[data-resend]').forEach((btn) => {
  btn.addEventListener('click', () => armResend(btn))
})

/* Password visibility toggles (input id in data-toggle-pass) */
document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.togglePass)
    if (!input) return
    input.type = input.type === 'password' ? 'text' : 'password'
  })
})
