'use client';

// app/(dashboard)/governance/audits/page.tsx
// ============================================================
// Governance – Audits
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus, Search, Eye, ClipboardCheck, Calendar,
  CheckCircle2, Clock, Activity, XCircle
} from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { audits as initial } from '@/lib/mock-data/governance';
import { mockGetSession } from '@/lib/mock-auth';
import type { Audit, AuditState } from '@/types';
import { cn } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────
const stateConfig: Record<AuditState, { label: string; cls: string; icon: React.ElementType }> = {
  scheduled:   { label: 'Scheduled',    cls: 'eco-badge-blue',   icon: Calendar },
  in_progress: { label: 'In Progress',  cls: 'eco-badge-amber',  icon: Activity },
  completed:   { label: 'Completed',    cls: 'eco-badge-green',  icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',    cls: 'eco-badge-slate',  icon: XCircle },
};

function AuditBadge({ state }: { state: AuditState }) {
  const cfg = stateConfig[state];
  return (
    <span className={cn(cfg.cls, 'eco-badge text-[11px] flex items-center gap-1')}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ScorePill({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-slate-300 text-xs">—</span>;
  const color = score >= 90 ? 'text-green-700 bg-green-50' : score >= 75 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50';
  return <span className={cn('px-2.5 py-0.5 rounded-full text-sm font-bold border', color)}>{score}</span>;
}

function buildColumns(onView: (a: Audit) => void): ColumnDef<Audit, unknown>[] {
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
      accessorKey: 'name',
      header: 'Audit Name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.original.scope}</p>
        </div>
      ),
    },
    {
      accessorKey: 'auditor',
      header: 'Auditor',
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.auditor}</span>
      ),
    },
    {
      accessorKey: 'auditDate',
      header: 'Date',
      size: 110,
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.auditDate}</span>,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.department}</span>,
    },
    {
      accessorKey: 'score',
      header: 'Score',
      size: 80,
      cell: ({ row }) => <ScorePill score={row.original.score} />,
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 120,
      cell: ({ row }) => <AuditBadge state={row.original.state as AuditState} />,
    },
    {
      id: 'actions',
      header: '',
      size: 60,
      cell: ({ row }) => (
        <button onClick={() => onView(row.original)} title="View" className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];
}

export default function AuditsPage() {
  const session = mockGetSession();
  const isManager = session?.user?.role === 'manager';
  const managerDept = session?.user?.department || '';

  const [data, setData] = useState<Audit[]>(initial);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewItem, setViewItem] = useState<Audit | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', auditor: '', auditDate: '', scope: '', department: '' });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.reference.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q);
    const matchState = stateFilter === 'all' || a.state === stateFilter;
    const matchDept = isManager ? a.department === managerDept : true;
    return matchSearch && matchState && matchDept;
  }), [data, search, stateFilter, isManager, managerDept]);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const newAudit: Audit = {
        id: `aud${Date.now()}`,
        reference: `AUD-2026-00${data.length + 1}`,
        state: 'scheduled',
        ...form,
      };
      setData((prev) => [newAudit, ...prev]);
      setAddModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(setViewItem), []);

  const avgScore = (() => {
    const scored = filtered.filter((a) => a.score !== undefined);
    return scored.length ? (scored.reduce((s, a) => s + (a.score ?? 0), 0) / scored.length).toFixed(1) : '—';
  })();

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-violet-600" /> Audits
          </h1>
          <p className="eco-page-subtitle">Schedule and track internal and external compliance audits.</p>
        </div>
        {!isManager && (
          <button onClick={() => setAddModalOpen(true)} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-xs px-3 py-2 gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Schedule Audit
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Audits', value: filtered.length, color: 'text-slate-700' },
          { label: 'Scheduled', value: filtered.filter(a => a.state === 'scheduled').length, color: 'text-blue-600' },
          { label: 'Completed', value: filtered.filter(a => a.state === 'completed').length, color: 'text-green-600' },
          { label: 'Avg. Score', value: avgScore, color: 'text-violet-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audits…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No audits found." emptyIcon="🔍" />
      </div>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name ?? ''} subtitle={viewItem?.reference} size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            {[
              ['Auditor', viewItem.auditor],
              ['Date', viewItem.auditDate],
              ['Department', viewItem.department],
              ['Scope', viewItem.scope],
              ['Score', <ScorePill key="sc" score={viewItem.score} />],
              ['Status', <AuditBadge key="st" state={viewItem.state as AuditState} />],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
            {viewItem.findings && (
              <div className="pt-2">
                <p className="text-slate-500 font-medium mb-1">Findings</p>
                <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{viewItem.findings}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Schedule New Audit" subtitle="Audits are created with Scheduled status." size="md"
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name || !form.auditor || !form.auditDate || saving} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-sm min-w-[110px]">
              {saving ? 'Scheduling…' : 'Schedule'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Audit Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Q3 Environmental Compliance Audit" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Auditor <span className="text-red-500">*</span></label>
              <input value={form.auditor} onChange={(e) => setForm((f) => ({ ...f, auditor: e.target.value }))} placeholder="Internal / External name" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Audit Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.auditDate} onChange={(e) => setForm((f) => ({ ...f, auditDate: e.target.value }))} className="eco-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="e.g. Finance" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Scope</label>
              <input value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))} placeholder="e.g. Carbon, Waste" className="eco-input" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
