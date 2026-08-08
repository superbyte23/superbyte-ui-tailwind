/* ══════════════════════════════════════════════════════════════════════════
   Superbyte UI v4 — page assembler
   Combines a shell template with a page fragment to produce static HTML.

   Inputs
     src/shell/<shell>.html          shell template with %TOKENS%
     src/pages/<name>.html           page fragment (front-matter comment + #content body)

   Outputs
     preview/<name>.html             app-shell pages
     index.html                      the landing page (shell: landing)

   Page front matter (must be the first <!-- --> comment in the file):
     title   : page title (required)
     crumb   : active breadcrumb item (default: title)
     script  : page module basename → /src/js/pages/<script>.js (optional)
     active  : nav link key to highlight (default: the page filename)
     layout  : app (default) | auth | landing
   ══════════════════════════════════════════════════════════════════════════ */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const PAGES = join(SRC, 'pages')
const SHELLS = join(SRC, 'shell')
const OUT = join(ROOT, 'preview')

const NAV_KEYS = new Set(
  ['index', 'create', 'analytics', 'records', 'users', 'datatables', 'forms', 'elements',
   'cards', 'overlays', 'utilities', 'components', 'all-components', 'icons', 'tables',
   'charts', 'visuals', 'maps', 'echarts', 'editors', 'crm', 'ecommerce', 'calendar',
   'kanban', 'email', 'file-manager', 'login', 'register', 'forgot', 'reset', 'lock',
   'verify', 'two-factor', 'session-expired', 'rtl', 'docs', 'components-docs',
   'layout-comfy', 'layout-condensed', 'layouts']
)

function parseFrontMatter(src) {
  const m = /^<!--\s*\n([\s\S]*?)\n\s*-->\s*\n?/.exec(src)
  const meta = { title: '', crumb: '', script: '', active: '', layout: 'app' }
  if (!m) return { meta, body: src }
  for (const line of m[1].split('\n')) {
    const kv = /^\s*([a-z-]+):\s*(.*?)\s*$/.exec(line)
    if (kv && (kv[1] in meta)) meta[kv[1]] = kv[2]
  }
  return { meta, body: src.slice(m[0].length) }
}

function loadShell(name) {
  return readFileSync(join(SHELLS, name + '.html'), 'utf8')
}

function breadcrumb(crumb) {
  return `<li class="breadcrumb-item active" aria-current="page">${crumb}</li>`
}

/* Mark the current page's side-link active. Layout preset pages highlight the
   matching Layout shortcut (data-layout-page); everything else matches href.
   Then auto-expand the side-group whose submenu holds the active link, so the
   current section is open on load (same behaviour as the Layout group). */
function markActive(html, page) {
  let out = html
  const layoutMatch = /^layout-(vertical|horizontal|mini-sidebar)(?:-(boxed|contained))?$/.exec(page)
  if (layoutMatch) {
    const key = layoutMatch[1] + (layoutMatch[2] ? '-' + layoutMatch[2] : '')
    out = out.replace(
      /<a class="side-link"([^>]*data-layout-page="([^"]*)")/g,
      ($0, $1, $2) => `<a class="side-link${$2 === key ? ' active' : ''}"${$1}`
    )
  } else {
    if (!NAV_KEYS.has(page)) return out
    const needle = `<a class="side-link" href="${page}.html"`
    if (!out.includes(needle)) return out
    out = out.split(needle).join(`<a class="side-link active" href="${page}.html"`)
  }
  out = out.replace(
    /(<div class="side-group)([^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)/g,
    ($0, $gTag, $gRest, $inner, $gClose) => {
      if (!$inner.includes('class="side-link active"')) return $0
      const opened = $gTag + ' open' + $gRest
      const withAria = $inner.replace(
        /(<div class="side-group-toggle[^>]*?)aria-expanded="false"/,
        '$1aria-expanded="true"'
      )
      return opened + withAria + $gClose
    }
  )
  return out
}

function buildPage(name, shellHtml) {
  const raw = readFileSync(join(PAGES, name + '.html'), 'utf8')
  const { meta, body } = parseFrontMatter(raw)
  const active = meta.active || name
  let html = shellHtml
    .split('%PAGE_TITLE%').join(meta.title)
    .split('%BREADCRUMB%').join(meta.crumb ? breadcrumb(meta.crumb) : '')
    .split('%PAGE_LIB_CSS%').join('')
    .split('%CONTENT%').join(body)
  html = html.replace('%PAGE_SCRIPT%', meta.script
    ? `<script type="module" src="/src/js/pages/${meta.script}.js"></script>`
    : '')
  html = markActive(html, active)
  return html
}

function main() {
  if (!existsSync(SHELLS) || !existsSync(PAGES)) {
    console.error('[assemble] missing src/shell or src/pages — nothing to build')
    process.exit(1)
  }
  mkdirSync(OUT, { recursive: true })

  const shell = loadShell('shell')
  const auth = loadShell('auth')
  const landingShell = loadShell('landing')

  const files = readdirSync(PAGES).filter(f => f.endsWith('.html')).sort()
  let count = 0

  for (const f of files) {
    const name = f.replace(/\.html$/, '')
    const raw = readFileSync(join(PAGES, name + '.html'), 'utf8')
    const { meta } = parseFrontMatter(raw)

    if (name === 'landing') {
      const html = landingShell.split('%PAGE_TITLE%').join(meta.title).split('%CONTENT%').join(parseFrontMatter(raw).body)
      writeFileSync(join(ROOT, 'index.html'), html)
      console.log(`[assemble] → index.html (landing)`)
      count++
      continue
    }

    const shellHtml = meta.layout === 'auth' ? auth : shell
    const html = buildPage(name, shellHtml)
    writeFileSync(join(OUT, name + '.html'), html)
    console.log(`[assemble] → preview/${name}.html (${meta.layout})`)
    count++
  }

  console.log(`[assemble] done — ${count} page(s)`)
}

main()
