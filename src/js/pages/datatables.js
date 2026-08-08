/* ══════════════════════════════════════════════════════════════════════════
   DATATABLES (preview/datatables.html)
   ══════════════════════════════════════════════════════════════════════════ */
import { createDataTable } from '../datatable.js'

const ORDERS = [
  { id: 'ORD-2041', customer: 'Ada Lovelace', product: 'Pro Plan', qty: 1, amount: 29, status: 'paid', date: '2026-08-07' },
  { id: 'ORD-2040', customer: 'Jonas Dahl', product: 'Team Plan', qty: 5, amount: 149, status: 'paid', date: '2026-08-07' },
  { id: 'ORD-2039', customer: 'Mina Kato', product: 'Add-ons', qty: 3, amount: 19, status: 'pending', date: '2026-08-06' },
  { id: 'ORD-2038', customer: 'Sara Chen', product: 'Enterprise', qty: 1, amount: 499, status: 'paid', date: '2026-08-06' },
  { id: 'ORD-2037', customer: 'Omar Farouk', product: 'Pro Plan', qty: 2, amount: 58, status: 'refunded', date: '2026-08-05' },
  { id: 'ORD-2036', customer: 'Priya Sharma', product: 'Starter', qty: 1, amount: 9, status: 'paid', date: '2026-08-05' },
  { id: 'ORD-2035', customer: 'Lucia Ferrari', product: 'Team Plan', qty: 8, amount: 239, status: 'pending', date: '2026-08-04' },
  { id: 'ORD-2034', customer: 'Tom Becker', product: 'Add-ons', qty: 1, amount: 7, status: 'failed', date: '2026-08-04' },
  { id: 'ORD-2033', customer: 'Noa Kimura', product: 'Pro Plan', qty: 1, amount: 29, status: 'paid', date: '2026-08-03' },
  { id: 'ORD-2032', customer: 'Hannah Weiss', product: 'Starter', qty: 3, amount: 27, status: 'paid', date: '2026-08-03' },
  { id: 'ORD-2031', customer: 'Diego Ramos', product: 'Enterprise', qty: 1, amount: 499, status: 'pending', date: '2026-08-02' },
  { id: 'ORD-2030', customer: 'Anouk Blanc', product: 'Team Plan', qty: 4, amount: 119, status: 'paid', date: '2026-08-02' },
]

const STATUS = {
  paid: '<span class="tag tag-green"><i data-lucide="circle-check" style="width:11px;height:11px"></i> Paid</span>',
  pending: '<span class="tag tag-amber"><i data-lucide="clock" style="width:11px;height:11px"></i> Pending</span>',
  refunded: '<span class="tag tag-sky"><i data-lucide="rotate-ccw" style="width:11px;height:11px"></i> Refunded</span>',
  failed: '<span class="tag tag-red"><i data-lucide="circle-x" style="width:11px;height:11px"></i> Failed</span>',
}

const root = document.getElementById('orders-table')
if (root) {
  createDataTable(root, {
    data: ORDERS,
    searchPlaceholder: 'Filter orders…',
    sortKey: 'date',
    columns: [
      { key: 'id', label: 'Order', mono: true },
      { key: 'customer', label: 'Customer', className: 'name-cell' },
      { key: 'product', label: 'Product' },
      { key: 'amount', label: 'Total', mono: true, render: v => '$' + v.toFixed(2), sortable: true },
      { key: 'status', label: 'Status', render: v => STATUS[v] },
      { key: 'date', label: 'Date', mono: true },
    ],
    onRowClick(row) {
      window.showToast && window.showToast('success', `Opened ${row.id} — ${row.customer}`)
    },
  })
}
