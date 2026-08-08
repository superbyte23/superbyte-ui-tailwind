/* ══════════════════════════════════════════════════════════════════════════
   OVERLAYS (preview/overlays.html)
   ══════════════════════════════════════════════════════════════════════════ */

const delModal = document.getElementById('ov-modal-sm')
if (delModal) {
  delModal.addEventListener('confirmed', () => {
    window.showToast && window.showToast('success', 'Item deleted (demo)')
  })
}
