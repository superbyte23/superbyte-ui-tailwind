/* Integrity check for superbyte-ui-tailwind.
   Verifies generated HTML in preview/ + index.html:
   1. no leftover assemble tokens, 2. local refs resolve (preview-relative or / root-absolute),
   3. zero CDN/network loads, 4. referenced page scripts exist, 5. sidebar links resolve.
   Run: node scripts/check.mjs  (after `npm run generate`) */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, normalize, dirname, basename } from 'node:path'

const ROOT = process.cwd()
const HTML_DIRS = [ROOT, join(ROOT, 'preview')]
const IGNORE = new Set(['example.html'])

let fail = 0

function htmlFiles(dir) {
  return readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => join(dir, f))
}

const allFiles = HTML_DIRS.flatMap(htmlFiles).filter(f => !IGNORE.has(basename(f)))
const allNames = new Set(allFiles.map(f => basename(f)))

// ── 1. No leftover assemble tokens ──────────────────────────────────────────
for (const file of allFiles) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/%[A-Z_]+%/g)) {
    fail++
    console.error('LEFTOVER TOKEN in ' + basename(file) + ': ' + m[0])
  }
}
console.log('tokens clean across', allFiles.length, 'pages')

// ── 2. Local src/href refs resolve (preview-relative or / root-absolute) ───
for (const file of allFiles) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/(?:src|href)=["']([^"'#]+)(?:#[^"']*)?["']/g)) {
    const ref = m[1]
    if (/^https?:\/\//.test(ref) || /^mailto:|^tel:|^data:|^javascript:/.test(ref)) continue
    const clean = ref.split('?')[0]
    const full = clean.startsWith('/')
      ? (existsSync(normalize(join(ROOT, 'public', clean)))
          ? normalize(join(ROOT, 'public', clean))
          : normalize(join(ROOT, clean)))
      : normalize(join(dirname(file), clean))
    if (!existsSync(full)) {
      fail++
      console.error('MISSING REF in ' + basename(file) + ': ' + ref)
    }
  }
}
console.log('local refs resolved')

// ── 3. Zero CDN / network resource loads ────────────────────────────────────
const cdn = []
for (const file of allFiles) {
  const src = readFileSync(file, 'utf8')
  const matches = [...src.matchAll(/<(script|link|img|iframe)\b[^>]*?\b(?:src|href)=["'](https?:\/\/[^"']+)["']/g)]
    .map(m => m[2])
    .filter(u => !/^http:\/\/www\.w3\.org\/2000\/svg$/.test(u))
  if (matches.length) {
    fail += matches.length
    cdn.push(basename(file) + ': ' + matches.join(', '))
  }
}
console.log('external refs:', cdn.length)
cdn.forEach(l => console.error('CDN/EXTERNAL REF in ' + l))

// ── 4. Referenced page scripts exist ────────────────────────────────────────
for (const file of allFiles) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/src=["']\/src\/js\/pages\/([^"']+)\.js["']/g)) {
    const full = join(ROOT, 'src', 'js', 'pages', m[1] + '.js')
    if (!existsSync(full)) {
      fail++
      console.error('MISSING PAGE SCRIPT in ' + basename(file) + ': src/js/pages/' + m[1] + '.js')
    }
  }
}
console.log('page scripts checked')

// ── 5. Sidebar links resolve to generated pages ─────────────────────────────
for (const file of allFiles) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/<a class="side-link[^"]*" href="([^"]+)"/g)) {
    if (!allNames.has(m[1])) {
      fail++
      console.error('SIDEBAR LINK MISSING in ' + basename(file) + ': ' + m[1])
    }
  }
}
console.log('sidebar links checked')

// ── 6. Page scripts parse via node --check ─────────────────────────────────
const pagesDir = join(ROOT, 'src', 'js', 'pages')
if (existsSync(pagesDir)) {
  for (const f of readdirSync(pagesDir).filter(f => f.endsWith('.js'))) {
    const r = spawnSync(process.execPath, ['--check', join(pagesDir, f)], { encoding: 'utf8' })
    if (r.status !== 0) {
      fail++
      console.error('PAGE SCRIPT PARSE FAIL: ' + f + ' — ' + (r.stderr || '').trim().split('\n')[0])
    }
  }
  console.log('page scripts parse-checked')
}

console.log(fail === 0 ? 'ALL CHECKS PASSED' : fail + ' PROBLEM(S) FOUND')
process.exit(fail === 0 ? 0 : 1)
