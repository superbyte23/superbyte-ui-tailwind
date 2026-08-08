/* ══════════════════════════════════════════════════════════════════════════
   EMAIL (preview/email.html) — three-pane demo client
   ══════════════════════════════════════════════════════════════════════════ */

const MESSAGES = [
  {
    id: 1, folder: 'inbox', from: 'Sara Chen', time: '09:42', unread: true,
    initials: 'SC', color: '#2961fd',
    subject: 'Design review — Thursday',
    preview: 'Can you take a look at the new empty states before Thursday? I want to lock them before the release.',
    body: 'Hi team,\n\nCan you take a look at the new empty states before Thursday? I want to lock them before the release.\n\nWe have three variants to review and I dropped a few notes in Figma. The mobile breakpoints especially need a second pass.\n\nThanks!\nSara',
  },
  {
    id: 2, folder: 'inbox', from: 'Jonas Dahl', time: 'Yesterday', unread: true,
    initials: 'JD', color: '#0ea5e9',
    subject: 'Infra budget Q3',
    preview: 'We are at 82% of the quarterly budget with two months to go — worth a chat.',
    body: 'We are at 82% of the quarterly budget with two months to go — worth a chat.\n\nCurrent burn is mostly compute (ETL jobs). I can either optimize the pipelines or we extend the cap by ~$2k.\n\nThoughts?\nJonas',
  },
  {
    id: 3, folder: 'inbox', from: 'Mina Kato', time: 'Mon', unread: false,
    initials: 'MK', color: '#10b981',
    subject: 'v1.4 release notes drafted',
    preview: 'Draft is ready in Notion. Mostly the theme lab and the new datatable widget.',
    body: 'Draft is ready in Notion. Mostly the theme lab and the new datatable widget.\n\nLet me know if the changelog voice feels right — I kept it short and functional.\n\nMina',
  },
  {
    id: 4, folder: 'inbox', from: 'Omar Farouk', time: 'Fri', unread: false,
    initials: 'OF', color: '#f59e0b',
    subject: 'Support ticket volume',
    preview: 'Ticket volume is up 18% this month, mostly around the new customizer.',
    body: 'Ticket volume is up 18% this month, mostly around the new customizer.\n\nMostly small asks — preset import, font pairs. I will open a doc with the top five so we can turn them into FAQs.\n\nOmar',
  },
  {
    id: 5, folder: 'starred', from: 'Priya Sharma', time: 'Tue', unread: false,
    initials: 'PS', color: '#8b5cf6',
    subject: 'Q3 OKR check-in',
    preview: 'Slides for the Q3 check-in are up. Feedback welcome before the sync.',
    body: 'Slides for the Q3 check-in are up. Feedback welcome before the sync.\n\nI added a page per team so we can walk through each one in turn.\n\nPriya',
  },
]

const foldersEl = document.getElementById('email-folders')
const rowsEl = document.getElementById('email-rows')
const paneEl = document.getElementById('email-pane')
const searchEl = document.getElementById('email-search')

let activeFolder = 'inbox'
let activeId = 1
let q = ''

function visible() {
  return MESSAGES.filter(m =>
    m.folder === activeFolder &&
    (m.subject + m.from + m.preview).toLowerCase().includes(q)
  )
}

function renderRows() {
  const list = visible()
  rowsEl.innerHTML = list.map(m =>
    `<div class="mail-row ${m.id === activeId ? 'active' : ''} ${m.unread ? 'unread' : ''}" data-id="${m.id}">
      <div class="avatar-circle" style="background:${m.color}">${m.initials}</div>
      <div class="flex-1" style="min-width:0">
        <div class="d-flex justify-between" style="gap:8px">
          <b style="font-size:12.5px;color:var(--text);font-weight:${m.unread ? 700 : 600}">${m.from}</b>
          <span class="mono-sm" style="flex-shrink:0">${m.time}</span>
        </div>
        <div style="font-size:12.5px;font-weight:${m.unread ? 600 : 500};color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.subject}</div>
        <div style="font-size:11.5px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.preview}</div>
      </div>
      ${m.unread ? '<span class="mail-dot"></span>' : ''}
    </div>`
  ).join('')
  rowsEl.querySelectorAll('.mail-row').forEach(row => {
    row.addEventListener('click', () => {
      const m = MESSAGES.find(x => x.id === Number(row.dataset.id))
      if (!m) return
      activeId = m.id
      if (m.unread) { m.unread = false; renderRows() }
      renderPane(m)
    })
  })
}

function renderPane(m) {
  paneEl.innerHTML = `
    <div class="pane-subject"><b>${m.subject}</b><span class="tag tag-slate ms-auto">${m.folder}</span></div>
    <div class="pane-meta">
      <div class="avatar-circle" style="background:${m.color}">${m.initials}</div>
      <div class="flex-1">
        <b style="font-size:13px;color:var(--text)">${m.from}</b>
        <div style="font-size:11.5px;color:var(--text3)">to me · ${m.time}</div>
      </div>
      <button type="button" class="icon-btn" title="Reply"><i data-lucide="reply"></i></button>
      <button type="button" class="icon-btn" title="Archive"><i data-lucide="archive"></i></button>
    </div>
    <div class="pane-body">${m.body.replace(/\n/g, '<br>')}</div>
    <div class="d-flex gap-2 mt-3">
      <button type="button" class="btn btn-sm btn-primary"><i data-lucide="reply"></i> Reply</button>
      <button type="button" class="btn btn-sm btn-ghost"><i data-lucide="forward"></i> Forward</button>
    </div>`
  paneEl.querySelectorAll('.icon-btn').forEach(b => b.addEventListener('click', () => {
    window.showToast && window.showToast('success', b.title + ' (demo)')
  }))
  paneEl.querySelectorAll('.btn').forEach(b => b.addEventListener('click', () => {
    window.showToast && window.showToast('success', b.textContent.trim() + ' (demo)')
  }))
}

foldersEl.querySelectorAll('.mail-folder').forEach(f => {
  f.addEventListener('click', () => {
    activeFolder = f.dataset.folder
    foldersEl.querySelectorAll('.mail-folder').forEach(x => x.classList.toggle('active', x === f))
    const first = visible()[0]
    activeId = first ? first.id : -1
    renderRows()
    renderPane(first || MESSAGES[0])
  })
})

if (searchEl) searchEl.addEventListener('input', () => {
  q = searchEl.value.trim().toLowerCase()
  renderRows()
})

renderRows()
renderPane(MESSAGES[0])
