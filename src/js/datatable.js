/* ══════════════════════════════════════════════════════════════════════════
   SuperDataTable — dependency-free client-side data table for Superbyte UI.
   Builds toolbar + sortable table + pagination footer from a plain data array.

   createDataTable(root, opts)
     root     : container element (gets .dt-root)
     opts     : { columns:[{key,label,sortable,render,className,align}],
                 data:[…], pageSize, searchable, searchPlaceholder,
                 onRowClick(row) }
   Returns   : { render(), setData(rows), getState() }
   ══════════════════════════════════════════════════════════════════════════ */

export function createDataTable(root, opts) {
  const state = {
    data: opts.data || [],
    filtered: (opts.data || []).slice(),
    sortKey: opts.sortKey || null,
    sortDir: opts.sortDir || -1,
    page: 0,
    perPage: opts.pageSize || 8,
    search: '',
  }

  const wrap = document.createElement('div')
  wrap.className = 'dt-root'
  root.appendChild(wrap)

  const toolbar = document.createElement('div')
  toolbar.className = 'table-toolbar'
  toolbar.innerHTML = `
    <div class="search-wrap">
      <i data-lucide="search" class="search-icon"></i>
      <input type="text" class="form-control search-input" placeholder="${opts.searchPlaceholder || 'Search…'}">
    </div>
    <div class="d-flex align-center gap-2">
      <label class="form-label" style="margin:0;font-size:11px">Show</label>
      <select class="form-select dt-perpage" style="width:76px;padding:5px 8px;font-size:12px">
        <option value="5">5</option>
        <option value="8" selected>8</option>
        <option value="15">15</option>
        <option value="30">30</option>
      </select>
    </div>`
  wrap.appendChild(toolbar)

  const table = document.createElement('table')
  table.className = 'data-table'
  const thead = document.createElement('thead')
  const headRow = document.createElement('tr')
  opts.columns.forEach((col) => {
    const th = document.createElement('th')
    th.textContent = col.label || col.key
    if (col.align) th.style.textAlign = col.align
    if (col.sortable !== false) {
      th.style.cursor = 'pointer'
      th.addEventListener('click', () => {
        if (state.sortKey === col.key) state.sortDir *= -1
        else { state.sortKey = col.key; state.sortDir = -1 }
        state.page = 0
        render()
      })
    }
    headRow.appendChild(th)
  })
  thead.appendChild(headRow)
  table.appendChild(thead)
  const tbody = document.createElement('tbody')
  table.appendChild(tbody)
  wrap.appendChild(table)

  const empty = document.createElement('div')
  empty.className = 'empty-state d-none'
  empty.innerHTML = '<i data-lucide="search-x" style="width:34px;height:34px"></i><p>No rows match your filter.</p>'
  wrap.appendChild(empty)

  const footer = document.createElement('div')
  footer.className = 'dt-footer'
  wrap.appendChild(footer)

  toolbar.querySelector('.search-input').addEventListener('input', (e) => {
    state.search = e.target.value.trim().toLowerCase()
    state.page = 0
    render()
  })

  toolbar.querySelector('.dt-perpage').addEventListener('change', (e) => {
    state.perPage = Number(e.target.value)
    state.page = 0
    render()
  })

  function applyFilter() {
    const q = state.search
    state.filtered = q
      ? state.data.filter(row => opts.columns.some(col =>
          String(col.accessor ? col.accessor(row) : row[col.key] ?? '').toLowerCase().includes(q)))
      : state.data.slice()
    if (state.sortKey) {
      const col = opts.columns.find(c => c.key === state.sortKey)
      const get = col && col.accessor
      state.filtered.sort((a, b) => {
        const av = get ? get(a) : a[state.sortKey]
        const bv = get ? get(b) : b[state.sortKey]
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * state.sortDir
        return String(av ?? '').localeCompare(String(bv ?? '')) * state.sortDir
      })
    }
  }

  function render() {
    applyFilter()
    const total = state.filtered.length
    const pages = Math.max(1, Math.ceil(total / state.perPage))
    if (state.page >= pages) state.page = pages - 1
    const start = state.page * state.perPage
    const slice = state.filtered.slice(start, start + state.perPage)

    tbody.innerHTML = slice.map(row => {
      const cells = opts.columns.map((col) => {
        const raw = col.accessor ? col.accessor(row) : row[col.key]
        const val = col.render ? col.render(raw, row) : String(raw ?? '')
        const cls = [col.className || '', col.mono ? 'mono-cell' : ''].join(' ').trim()
        return cls ? `<td class="${cls}">${val}</td>` : `<td>${val}</td>`
      }).join('')
      return `<tr>${cells}</tr>`
    }).join('')

    empty.classList.toggle('d-none', total > 0)
    const pageRows = pageButtons(pages)
    footer.innerHTML = `<span class="mono-sm">Showing ${total ? start + 1 : 0}–${Math.min(start + state.perPage, total)} of ${total}</span>
      <ul class="pagination">${pageRows}</ul>`
    footer.querySelectorAll('[data-page]').forEach(b => {
      b.addEventListener('click', () => { state.page = Number(b.dataset.page); render() })
    })
    footer.querySelectorAll('.dt-prev,.dt-next').forEach(b => {
      b.addEventListener('click', () => {
        state.page += b.classList.contains('dt-prev') ? -1 : 1
        render()
      })
    })
    if (opts.onRowClick) {
      tbody.querySelectorAll('tr').forEach((tr, i) => {
        tr.style.cursor = 'pointer'
        tr.addEventListener('click', () => opts.onRowClick(state.filtered[start + i]))
      })
    }
    headRow.querySelectorAll('th').forEach((th, i) => {
      const col = opts.columns[i]
      th.classList.toggle('sort-asc', state.sortKey === col.key && state.sortDir === 1)
      th.classList.toggle('sort-desc', state.sortKey === col.key && state.sortDir === -1)
    })
    if (window.__lucideRefresh) window.__lucideRefresh(footer)
  }

  function pageButtons(pages) {
    let out = `<li class="page-item ${state.page === 0 ? 'disabled' : ''}"><button type="button" class="page-link dt-prev"><i data-lucide="chevron-left" style="width:14px;height:14px"></i></button></li>`
    const span = Math.min(pages, 7)
    const win = []
    if (pages <= 7) {
      for (let i = 0; i < pages; i++) win.push(i)
    } else {
      win.push(0)
      if (state.page > 3) win.push('…')
      for (let i = Math.max(1, state.page - 1); i <= Math.min(pages - 2, state.page + 1); i++) win.push(i)
      if (state.page < pages - 4) win.push('…')
      win.push(pages - 1)
    }
    win.forEach(i => {
      if (i === '…') { out += '<li class="page-item disabled"><button type="button" class="page-link">…</button></li>'; return }
      out += `<li class="page-item ${i === state.page ? 'active' : ''}"><button type="button" class="page-link" data-page="${i}">${i + 1}</button></li>`
    })
    out += `<li class="page-item ${state.page === pages - 1 ? 'disabled' : ''}"><button type="button" class="page-link dt-next"><i data-lucide="chevron-right" style="width:14px;height:14px"></i></button></li>`
    return out
  }

  render()
  return {
    render,
    setData(rows) { state.data = rows; state.page = 0; render() },
    getState: () => ({ ...state }),
  }
}
