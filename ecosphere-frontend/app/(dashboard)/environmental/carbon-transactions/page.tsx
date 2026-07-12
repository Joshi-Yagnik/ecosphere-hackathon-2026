'use client';

// app/(dashboard)/environmental/carbon-transactions/page.tsx
// ============================================================
// Carbon Transactions – Log + Status Workflow
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus, Search, Download, TrendingDown, CheckCircle2,
  XCircle, Clock, Eye, Activity,
} from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal }     from '@/components/ui/Modal';
import { carbonTransactions as initial, emissionFactors } from '@/lib/mock-data/environmental';
import { departmentScores } from '@/lib/mock-data/dashboard';
import type { CarbonTransaction } from '@/types';
import { cn } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  draft:     'eco-badge-slate',
  confirmed: 'eco-badge-green',
  cancelled: 'eco-badge-red',
};
const statusIcon: Record<string, React.ElementType> = {
  draft: Clock, confirmed: CheckCircle2, cancelled: XCircle,
};

function StatusBadge({ state }: { state: string }) {
  const Icon = statusIcon[state] ?? Clock;
  return (
    <span className={cn(statusStyle[state], 'eco-badge text-xs flex items-center gap-1 w-fit capitalize')}>
      <Icon className="w-3 h-3" />
      {state}
    </span>
  );
}

// Scope badge
const scopeStyle: Record<string, string> = {
  scope1: 'text-green-700 bg-green-50 border-green-200',
  scope2: 'text-blue-700  bg-blue-50  border-blue-200',
  scope3: 'text-violet-700 bg-violet-50 border-violet-200',
};

function buildColumns(
  onView: (ct: CarbonTransaction) => void,
  onConfirm: (id: string) => void,
  onCancel:  (id: string) => void,
): ColumnDef<CarbonTransaction, unknown>[] {
  return [
    {
      accessorKey: 'reference',
      header: 'Reference',
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 100,
      cell: ({ row }) => (
        <span className="text-slate-600 text-sm">{row.original.date}</span>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <span className="text-slate-700 text-sm font-medium">{row.original.department}</span>
      ),
    },
    {
      accessorKey: 'emissionFactor',
      header: 'Emission Factor',
      cell: ({ row }) => (
        <div>
          <p className="text-slate-900 text-sm font-medium leading-tight line-clamp-1">
            {row.original.emissionFactor}
          </p>
          <p className="text-xs text-slate-400">{row.original.category}</p>
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty / Unit',
      size: 110,
      cell: ({ row }) => (
        <div className="text-right">
          <p className="font-semibold text-slate-900 tabular-nums">{row.original.quantity.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">{row.original.unit}</p>
        </div>
      ),
    },
    {
      accessorKey: 'co2Equivalent',
      header: 'CO₂e (t)',
      size: 100,
      cell: ({ row }) => {
        const val = row.original.co2Equivalent;
        return (
          <span className={cn(
            'font-bold tabular-nums text-sm',
            val < 0 ? 'text-green-600' : 'text-slate-900'
          )}>
            {val < 0 ? '-' : '+'}{Math.abs(val).toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      size: 90,
      cell: ({ row }) => (
        <span className={cn('eco-badge border text-[11px]', scopeStyle[row.original.scope])}>
          {row.original.scope.replace('scope', 'Scope ')}
        </span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 120,
      cell: ({ row }) => <StatusBadge state={row.original.state} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 110,
      cell: ({ row }) => {
        const { state, id } = row.original;
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => onView(row.original)} title="View" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </button>
            {state === 'draft' && (
              <>
                <button onClick={() => onConfirm(id)} title="Confirm" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onCancel(id)} title="Cancel" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────
export default function CarbonTransactionsPage() {
  const [data, setData]           = useState<CarbonTransaction[]>(initial);
  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewItem, setViewItem]   = useState<CarbonTransaction | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logForm, setLogForm]     = useState({
    date: new Date().toISOString().split('T')[0],
    departmentId: 'd1',
    emissionFactorId: 'ef01',
    quantity: 0,
    notes: '',
  });
  const [saving, setSaving]       = useState(false);

  // Computed stats
  const totalCo2  = data.filter((c) => c.state === 'confirmed').reduce((s, c) => s + c.co2Equivalent, 0);
  const scope1Co2 = data.filter((c) => c.state === 'confirmed' && c.scope === 'scope1').reduce((s, c) => s + c.co2Equivalent, 0);
  const scope2Co2 = data.filter((c) => c.state === 'confirmed' && c.scope === 'scope2').reduce((s, c) => s + c.co2Equivalent, 0);
  const scope3Co2 = data.filter((c) => c.state === 'confirmed' && c.scope === 'scope3').reduce((s, c) => s + c.co2Equivalent, 0);
  const draftCount = data.filter((c) => c.state === 'draft').length;

  const depts = [...new Set(data.map((c) => c.department))].sort();

  const filtered = useMemo(() => {
    return data.filter((ct) => {
      const q = search.toLowerCase();
      const matchSearch = !q || ct.reference.toLowerCase().includes(q) || ct.department.toLowerCase().includes(q) || ct.emissionFactor.toLowerCase().includes(q);
      const matchDept   = deptFilter   === 'all' || ct.department === deptFilter;
      const matchScope  = scopeFilter  === 'all' || ct.scope      === scopeFilter;
      const matchStatus = statusFilter === 'all' || ct.state      === statusFilter;
      return matchSearch && matchDept && matchScope && matchStatus;
    });
  }, [data, search, deptFilter, scopeFilter, statusFilter]);

  const handleConfirm = (id: string) =>
    setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'confirmed' } : r));
  const handleCancel  = (id: string) =>
    setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'cancelled' } : r));

  const handleLog = () => {
    setSaving(true);
    setTimeout(() => {
      const ef = emissionFactors.find((e) => e.id === logForm.emissionFactorId);
      const dept = departmentScores.find((d) => d.id === logForm.departmentId);
      if (!ef || !dept) return;
      const co2e = (logForm.quantity * ef.factorValue) / 1000;
      const newTx: CarbonTransaction = {
        id: `ct${Date.now()}`,
        reference: `CT-2026-${String(data.length + 1).padStart(3, '0')}`,
        date: logForm.date,
        department: dept.name,
        departmentId: dept.id,
        category: ef.category,
        emissionFactor: ef.name,
        emissionFactorId: ef.id,
        quantity: logForm.quantity,
        unit: ef.activityUnit,
        co2Equivalent: parseFloat(co2e.toFixed(2)),
        scope: ef.scope,
        state: 'draft',
        notes: logForm.notes,
      };
      setData((prev) => [newTx, ...prev]);
      setLogModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(
    () => buildColumns(setViewItem, handleConfirm, handleCancel),
    []
  );

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-600" /> Carbon Transactions
          </h1>
          <p className="eco-page-subtitle">Log, confirm and track all GHG emission entries.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Exporting records...')} className="eco-btn-secondary text-xs px-3 py-2 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => setLogModalOpen(true)} className="eco-btn-primary text-xs px-3 py-2 gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Log Transaction
          </button>
        </div>
      </div>

      {/* ── Summary stat cards ───────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total CO₂e (Confirmed)', value: `${totalCo2.toFixed(1)} t`, icon: TrendingDown, color: 'text-green-600 bg-green-50' },
          { label: 'Scope 1 – Direct',        value: `${scope1Co2.toFixed(1)} t`, icon: TrendingDown, color: 'text-teal-600 bg-teal-50' },
          { label: 'Scope 2 – Indirect',       value: `${scope2Co2.toFixed(1)} t`, icon: TrendingDown, color: 'text-blue-600 bg-blue-50' },
          { label: 'Scope 3 – Value Chain',    value: `${scope3Co2.toFixed(1)} t`, icon: TrendingDown, color: 'text-violet-600 bg-violet-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const [textColor, bgColor] = stat.color.split(' ');
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="eco-card p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
                <Icon className={`w-4 h-4 ${textColor}`} />
              </div>
              <div>
                <p className={`text-lg font-extrabold tabular-nums ${textColor}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Draft alert */}
      {draftCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{draftCount} draft transaction{draftCount > 1 ? 's' : ''}</strong> pending confirmation. Review and confirm to include them in totals.
          </span>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions…"
              className="eco-input pl-9 text-sm"
            />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Departments</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Scopes</option>
            <option value="scope1">Scope 1</option>
            <option value="scope2">Scope 2</option>
            <option value="scope3">Scope 3</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No transactions match your filters." emptyIcon="📊" />
      </div>

      {/* ── View detail modal ────────────────────────────── */}
      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.reference ?? ''}
        subtitle="Carbon Transaction Detail"
        size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            {[
              ['Reference', viewItem.reference],
              ['Date', viewItem.date],
              ['Department', viewItem.department],
              ['Category', viewItem.category],
              ['Emission Factor', viewItem.emissionFactor],
              ['Quantity', `${viewItem.quantity.toLocaleString()} ${viewItem.unit}`],
              ['CO₂ Equivalent', `${viewItem.co2Equivalent.toFixed(2)} tCO₂e`],
              ['GHG Scope', viewItem.scope.replace('scope', 'Scope ')],
              ['Status', <StatusBadge key="s" state={viewItem.state} />],
              ...(viewItem.notes ? [['Notes', viewItem.notes]] : []),
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Log Transaction Modal ────────────────────────── */}
      <Modal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Log Carbon Transaction"
        subtitle="Record a new GHG emission entry. Status will be Draft until confirmed."
        size="md"
        footer={
          <>
            <button onClick={() => setLogModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleLog} disabled={!logForm.quantity || saving} className="eco-btn-primary text-sm min-w-[100px]">
              {saving ? 'Saving…' : 'Log Transaction'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" value={logForm.date} onChange={(e) => setLogForm((f) => ({ ...f, date: e.target.value }))} className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department <span className="text-red-500">*</span></label>
              <select value={logForm.departmentId} onChange={(e) => setLogForm((f) => ({ ...f, departmentId: e.target.value }))} className="eco-input cursor-pointer">
                {departmentScores.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Emission Factor <span className="text-red-500">*</span></label>
            <select value={logForm.emissionFactorId} onChange={(e) => setLogForm((f) => ({ ...f, emissionFactorId: e.target.value }))} className="eco-input cursor-pointer">
              {emissionFactors.filter((e) => e.active).map((ef) => (
                <option key={ef.id} value={ef.id}>{ef.name} ({ef.factorUnit})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Quantity ({emissionFactors.find((e) => e.id === logForm.emissionFactorId)?.activityUnit ?? ''}) <span className="text-red-500">*</span>
            </label>
            <input type="number" min="0" value={logForm.quantity || ''} onChange={(e) => setLogForm((f) => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))} placeholder="0" className="eco-input" />
          </div>
          {logForm.quantity > 0 && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-xs text-green-700">
                Estimated CO₂e: <strong>
                  {((logForm.quantity * (emissionFactors.find((e) => e.id === logForm.emissionFactorId)?.factorValue ?? 0)) / 1000).toFixed(4)} tCO₂e
                </strong>
              </p>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <textarea rows={2} value={logForm.notes} onChange={(e) => setLogForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
