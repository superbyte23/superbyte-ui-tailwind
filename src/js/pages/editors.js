/* ══════════════════════════════════════════════════════════════════════════
   EDITORS (preview/editors.html) — Quill + CodeMirror
   ══════════════════════════════════════════════════════════════════════════ */
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'

const quill = new Quill('#ql-editor', {
  theme: 'snow',
  placeholder: 'Write something…',
})

document.getElementById('ql-clear').addEventListener('click', () => {
  quill.setText('')
  window.showToast && window.showToast('success', 'Editor cleared')
})

const qlOut = document.getElementById('ql-out')
document.getElementById('ql-export').addEventListener('click', () => {
  qlOut.textContent = quill.root.innerHTML
  qlOut.classList.remove('d-none')
})

const cmArea = document.getElementById('cm-textarea')
const cm = CodeMirror.fromTextArea(cmArea, {
  mode: 'javascript',
  theme: 'superbyte',
  lineNumbers: true,
  lineWrapping: false,
  tabSize: 2,
})

const cmStatus = document.getElementById('cm-status')
const cmOut = document.getElementById('cm-out')
document.getElementById('cm-mode').addEventListener('change', e => {
  cm.setOption('mode', e.target.value)
  cmStatus.textContent = e.target.value
})
document.getElementById('cm-run').addEventListener('click', () => {
  cmOut.classList.remove('d-none')
  cmOut.textContent = '— output area (demo) —\nNothing was evaluated; this is a static preview.'
})
document.getElementById('cm-format').addEventListener('click', () => {
  const out = []
  let depth = 0
  for (const line of cm.getValue().split('\n')) {
    const trimmed = line.trim()
    const closes = (trimmed.match(/[}\])]/g) || []).length
    const opens = (trimmed.match(/[{\[(]/g) || []).length
    depth = Math.max(0, depth - closes)
    if (trimmed) out.push('  '.repeat(depth) + trimmed)
    depth += opens
  }
  cm.setValue(out.join('\n'))
  cmStatus.textContent = 'indented'
})
