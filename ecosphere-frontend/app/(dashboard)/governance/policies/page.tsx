'use client';

// app/(dashboard)/governance/policies/page.tsx
// ============================================================
// Governance – Policies (CRUD + Activate/Archive)
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus, Search, FileText, CheckCircle2, Archive, Eye,
  AlertTriangle, ShieldCheck, BookOpen,
} from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { policies as initial } from '@/lib/mock-data/governance';
import type { Policy, PolicyType } from '@/types';
import { cn } from '@/lib/utils';

// ── Helpers ───────────────────────────────────────────────────
const stateStyle: Record<string, string> = {
  draft: 'eco-badge-slate',
  active: 'eco-badge-green',
  archived: 'bg-slate-100 text-slate-500 border border-slate-200',
};
const stateLabel: Record<string, string> = { draft: 'Draft', active: 'Active', archived: 'Archived' };

const typeColor: Record<PolicyType, string> = {
  environmental: 'text-green-700  bg-green-50  border-green-200',
  social:        'text-blue-700   bg-blue-50   border-blue-200',
  governance:    'text-violet-700 bg-violet-50 border-violet-200',
  general:       'text-slate-700  bg-slate-50  border-slate-200',
};

function TypeBadge({ type }: { type: PolicyType }) {
  return (
    <span className={cn('eco-badge border text-[11px] capitalize', typeColor[type])}>
      {type}
    </span>
  );
}

function buildColumns(
  onView: (p: Policy) => void,
  onActivate: (id: string) => void,
  onArchive: (id: string) => void,
): ColumnDef<Policy, unknown>[] {
  return [
    {
      accessorKey: 'code',
      header: 'Code',
      size: 130,
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Policy Name',
      cell: ({ row }) => (
        <div className="flex items-start gap-2">
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">v{row.original.version} · {row.original.owner}</p>
          </div>
          {row.original.isMandatory && (
            <span className="eco-badge-red text-[10px] shrink-0 mt-0.5">Mandatory</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'policyType',
      header: 'Type',
      size: 120,
      cell: ({ row }) => <TypeBadge type={row.original.policyType} />,
    },
    {
      accessorKey: 'effectiveDate',
      header: 'Effective',
      size: 110,
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-slate-700">{row.original.effectiveDate}</p>
          {row.original.expiryDate && (
            <p className={cn('text-[11px]', row.original.isExpired ? 'text-red-500' : 'text-slate-400')}>
              {row.original.isExpired ? '⚠ Expired ' : 'Exp: '}{row.original.expiryDate}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'acknowledgementCount',
      header: 'Ack.',
      size: 70,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 tabular-nums">{row.original.acknowledgementCount}</span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 100,
      cell: ({ row }) => (
        <span className={cn(stateStyle[row.original.state], 'eco-badge text-[11px] capitalize')}>
          {stateLabel[row.original.state]}
        </span>
      ),
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
              <button onClick={() => onActivate(id)} title="Activate" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
            {state === 'active' && (
              <button onClick={() => onArchive(id)} title="Archive" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────
export default function PoliciesPage() {
  const [data, setData] = useState<Policy[]>(initial);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewItem, setViewItem] = useState<Policy | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', policyType: 'governance' as PolicyType, category: 'Ethics', version: 'v1.0', owner: '', effectiveDate: '', isMandatory: false, summary: '' });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q);
    const matchType  = typeFilter  === 'all' || p.policyType === typeFilter;
    const matchState = stateFilter === 'all' || p.state      === stateFilter;
    return matchSearch && matchType && matchState;
  }), [data, search, typeFilter, stateFilter]);

  const handleActivate = (id: string) => setData((prev) => prev.map((p) => p.id === id ? { ...p, state: 'active' } : p));
  const handleArchive  = (id: string) => setData((prev) => prev.map((p) => p.id === id ? { ...p, state: 'archived' } : p));

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const newPol: Policy = {
        id: `pol${Date.now()}`, ...form,
        acknowledgementCount: 0, state: 'draft', isExpired: false,
      };
      setData((prev) => [newPol, ...prev]);
      setAddModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(setViewItem, handleActivate, handleArchive), []);

  const stats = {
    total: data.length,
    active: data.filter((p) => p.state === 'active').length,
    draft: data.filter((p) => p.state === 'draft').length,
    expired: data.filter((p) => p.isExpired).length,
    mandatory: data.filter((p) => p.isMandatory && p.state === 'active').length,
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-600" /> Policies
          </h1>
          <p className="eco-page-subtitle">Manage ESG and corporate governance policies across the organization.</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Policy
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Policies', value: stats.total, color: 'text-slate-700' },
          { label: 'Active', value: stats.active, color: 'text-green-600' },
          { label: 'Draft / Pending', value: stats.draft, color: 'text-amber-600' },
          { label: 'Expired', value: stats.expired, color: 'text-red-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {stats.expired > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span><strong>{stats.expired} expired {stats.expired === 1 ? 'policy' : 'policies'}</strong> need renewal to maintain compliance.</span>
        </div>
      )}

      {/* Filters */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search policies…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Types</option>
            <option value="environmental">Environmental</option>
            <option value="social">Social</option>
            <option value="governance">Governance</option>
            <option value="general">General</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No policies match your filters." emptyIcon="📋" />
      </div>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name ?? ''} subtitle={viewItem?.code} size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            {viewItem.summary && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Summary</p>
                <p className="text-slate-700 leading-relaxed">{viewItem.summary}</p>
              </div>
            )}
            {[
              ['Type', <TypeBadge key="t" type={viewItem.policyType} />],
              ['Category', viewItem.category],
              ['Version', viewItem.version],
              ['Owner', viewItem.owner],
              ['Effective Date', viewItem.effectiveDate],
              ['Expiry Date', viewItem.expiryDate ?? 'No expiry'],
              ['Mandatory', viewItem.isMandatory ? '✅ Yes' : 'No'],
              ['Acknowledgements', viewItem.acknowledgementCount.toString()],
              ['Status', <span key="s" className={cn(stateStyle[viewItem.state], 'eco-badge text-[11px] capitalize')}>{stateLabel[viewItem.state]}</span>],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Add Policy Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="New Policy" subtitle="Create a new governance policy. Saved as Draft." size="md"
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name || !form.code || !form.owner || saving} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-sm min-w-[110px]">
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Policy Code <span className="text-red-500">*</span></label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="POL-GOV-003" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Version</label>
              <input value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))} placeholder="v1.0" className="eco-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Policy Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Conflict of Interest Policy" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select value={form.policyType} onChange={(e) => setForm((f) => ({ ...f, policyType: e.target.value as PolicyType }))} className="eco-input cursor-pointer">
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Ethics, Safety…" className="eco-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Policy Owner <span className="text-red-500">*</span></label>
              <input value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))} placeholder="Name" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Effective Date</label>
              <input type="date" value={form.effectiveDate} onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))} className="eco-input" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="mandatory" checked={form.isMandatory} onChange={(e) => setForm((f) => ({ ...f, isMandatory: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-violet-600 cursor-pointer" />
            <label htmlFor="mandatory" className="text-sm text-slate-700 font-medium cursor-pointer">Mark as Mandatory</label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Summary</label>
            <textarea rows={3} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Brief description of the policy…" className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
