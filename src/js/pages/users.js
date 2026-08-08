/* ══════════════════════════════════════════════════════════════════════════
   USERS (preview/users.html) — user cards rendered from static data
   ══════════════════════════════════════════════════════════════════════════ */
import { esc } from '../components.js'

const users = [
  { n: 'John Canete',  r: 'Administrator', e: 'john@superbyte.io',   init: 'JC', grad: '#2961fd', on: true },
  { n: 'Maria Santos', r: 'Editor',        e: 'maria@superbyte.io',  init: 'MS', grad: '#22c55e', on: true },
  { n: 'Rafael Torres',r: 'Editor',        e: 'rafael@superbyte.io', init: 'RT', grad: '#f59e0b', on: false },
  { n: 'Grace Kim',    r: 'Viewer',        e: 'grace@superbyte.io',  init: 'GK', grad: '#ef4444', on: true },
  { n: 'Hiroshi Sato', r: 'Viewer',        e: 'hiroshi@superbyte.io',init: 'HS', grad: '#38bdf8', on: false },
  { n: 'Elena Ferro',  r: 'Editor',        e: 'elena@superbyte.io',  init: 'EF', grad: '#f472b6', on: true },
]

const tag = u => u.r === 'Administrator' ? 'tag-indigo' : u.r === 'Editor' ? 'tag-green' : 'tag-slate'

const grid = document.getElementById('users-grid')
if (grid) {
  grid.innerHTML = users.map(u => (
    '<div class="card card-body d-flex align-center gap-3" style="flex-direction:row">' +
    '<div class="avatar-circle flex-shrink-0" style="width:42px;height:42px;border-radius:10px;font-size:13px;background:' + u.grad + '">' + esc(u.init) + '</div>' +
    '<div class="flex-1">' +
    '<div style="color:var(--text);font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(u.n) + '</div>' +
    '<div class="font-mono" style="font-size:11px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(u.e) + '</div>' +
    '</div>' +
    '<div class="text-end flex-shrink-0">' +
    '<span class="tag ' + tag(u) + '">' + esc(u.r) + '</span>' +
    '<div style="font-size:11px;color:var(--text3);margin-top:5px"><span class="status-dot ' + (u.on ? 'on' : 'off') + '"></span>' + (u.on ? 'Online' : 'Offline') + '</div>' +
    '</div></div>'
  )).join('')
}
