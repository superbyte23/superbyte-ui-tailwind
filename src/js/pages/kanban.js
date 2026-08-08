/* ══════════════════════════════════════════════════════════════════════════
   KANBAN (preview/kanban.html) — HTML5 drag & drop between lanes
   ══════════════════════════════════════════════════════════════════════════ */

const board = document.getElementById('kbd-board')
if (!board) throw new Error('missing #kbd-board')

function updateCounts() {
  board.querySelectorAll('.kbd-col').forEach(col => {
    const n = col.querySelectorAll('.kbd-card').length
    const c = col.querySelector('[data-count]')
    if (c) c.textContent = n
  })
}

let dragCard = null

board.querySelectorAll('.kbd-card').forEach(card => {
  card.addEventListener('dragstart', () => {
    dragCard = card
    card.classList.add('dragging')
  })
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging')
    dragCard = null
    board.querySelectorAll('.kbd-lane').forEach(l => l.classList.remove('over'))
    updateCounts()
  })
})

board.querySelectorAll('.kbd-lane').forEach(lane => {
  lane.addEventListener('dragover', e => {
    if (!dragCard) return
    e.preventDefault()
    lane.classList.add('over')
  })
  lane.addEventListener('dragleave', () => lane.classList.remove('over'))
  lane.addEventListener('drop', e => {
    e.preventDefault()
    lane.classList.remove('over')
    if (!dragCard) return
    const from = dragCard.closest('.kbd-col')
    const to = lane.closest('.kbd-col')
    lane.appendChild(dragCard)
    if (from !== to) {
      window.showToast && window.showToast('success', `Moved to ${to.dataset.lane}`)
    }
    updateCounts()
  })
})

updateCounts()
