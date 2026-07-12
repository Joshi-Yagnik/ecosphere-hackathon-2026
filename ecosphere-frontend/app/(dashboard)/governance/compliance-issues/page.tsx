'use client';

// app/(dashboard)/governance/compliance-issues/page.tsx
// ============================================================
// Governance – Compliance Issues (Risk Register)
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus, Search, Eye, AlertTriangle, ShieldAlert,
  CheckCircle2, Activity, TrendingUp, XCircle
} from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { complianceIssues as initial } from '@/lib/mock-data/governance';
import type { ComplianceIssue, Severity, ComplianceState } from '@/types';
import { cn, getSeverityColor } from '@/lib/utils';

// ── Badges ────────────────────────────────────────────────────
const stateConfig: Record<ComplianceState, { label: string; cls: string; icon: React.ElementType }> = {
  open:        { label: 'Open',        cls: 'eco-badge-slate',  icon: AlertTriangle },
  in_progress: { label: 'In Progress', cls: 'eco-badge-blue',   icon: Activity },
  resolved:    { label: 'Resolved',    cls: 'eco-badge-green',  icon: CheckCircle2 },
  escalated:   { label: 'Escalated',   cls: 'eco-badge-red',    icon: TrendingUp },
};

function StateBadge({ state }: { state: ComplianceState }) {
  const cfg = stateConfig[state];
  return (
    <span className={cn(cfg.cls, 'eco-badge text-[11px] flex items-center gap-1')}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const labels: Record<Severity, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };
  return (
    <span className={cn('eco-badge border text-[11px] capitalize font-semibold', getSeverityColor(severity))}>
      {labels[severity]}
    </span>
  );
}

function buildColumns(onView: (c: ComplianceIssue) => void): ColumnDef<ComplianceIssue, unknown>[] {
  return [
    {
      accessorKey: 'reference',
      header: 'Ref',
      size: 130,
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Issue',
      cell: ({ row }) => (
        <div className="flex items-start gap-2">
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{row.original.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{row.original.category} · {row.original.department}</p>
          </div>
          {row.original.isOverdue && (
            <span className="eco-badge-red text-[10px] shrink-0 mt-0.5 flex items-center gap-0.5">
              <XCircle className="w-2.5 h-2.5" /> Overdue
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      size: 100,
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      size: 130,
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.owner}</span>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 110,
      cell: ({ row }) => (
        <span className={cn('text-sm', row.original.isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600')}>
          {row.original.dueDate}
        </span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 120,
      cell: ({ row }) => <StateBadge state={row.original.state as ComplianceState} />,
    },
    {
      id: 'actions',
      header: '',
      size: 60,
      cell: ({ row }) => (
        <button onClick={() => onView(row.original)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];
}

export default function ComplianceIssuesPage() {
  const [data, setData] = useState<ComplianceIssue[]>(initial);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewItem, setViewItem] = useState<ComplianceIssue | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', severity: 'medium' as Severity, category: 'Governance', department: '', owner: '', dueDate: '', description: '' });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.reference.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q);
    const matchSev = severityFilter === 'all' || c.severity === severityFilter;
    const matchState = stateFilter === 'all' || c.state === stateFilter;
    return matchSearch && matchSev && matchState;
  }), [data, search, severityFilter, stateFilter]);

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const newIssue: ComplianceIssue = {
        id: `ci${Date.now()}`,
        reference: `CI-2026-00${data.length + 1}`,
        ...form,
        state: 'open',
        isOverdue: false,
      };
      setData((prev) => [newIssue, ...prev]);
      setAddModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(setViewItem), []);

  const stats = {
    open: data.filter((c) => c.state === 'open').length,
    critical: data.filter((c) => c.severity === 'critical').length,
    overdue: data.filter((c) => c.isOverdue).length,
    resolved: data.filter((c) => c.state === 'resolved').length,
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-violet-600" /> Compliance Issues
          </h1>
          <p className="eco-page-subtitle">Track and resolve compliance gaps, risks and findings from audits.</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Log Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open Issues', value: stats.open, color: 'text-slate-700' },
          { label: 'Critical Severity', value: stats.critical, color: 'text-red-600' },
          { label: 'Overdue', value: stats.overdue, color: 'text-orange-600' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {stats.critical > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span><strong>{stats.critical} critical issue{stats.critical > 1 ? 's' : ''}</strong> require immediate attention.</span>
        </div>
      )}

      {/* Filters */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search issues…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No compliance issues found." emptyIcon="🛡️" />
      </div>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title ?? ''} subtitle={viewItem?.reference} size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            {[
              ['Severity', <SeverityBadge key="sv" severity={viewItem.severity} />],
              ['Category', viewItem.category],
              ['Department', viewItem.department],
              ['Owner', viewItem.owner],
              ['Due Date', viewItem.dueDate],
              ['Status', <StateBadge key="st" state={viewItem.state as ComplianceState} />],
              ['Overdue', viewItem.isOverdue ? '⚠️ Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
            {viewItem.description && (
              <div className="pt-2">
                <p className="text-slate-500 font-medium mb-1">Description</p>
                <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{viewItem.description}</p>
              </div>
            )}
            {viewItem.resolution && (
              <div className="pt-1">
                <p className="text-slate-500 font-medium mb-1">Resolution Notes</p>
                <p className="text-green-700 leading-relaxed bg-green-50 border border-green-100 rounded-xl p-3">{viewItem.resolution}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Issue Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Log Compliance Issue" subtitle="New issues start as Open." size="md"
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.title || !form.owner || !form.dueDate || saving} className="eco-btn-primary bg-violet-600 hover:bg-violet-700 text-sm min-w-[100px]">
              {saving ? 'Logging…' : 'Log Issue'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Brief description of the issue" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
              <select value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))} className="eco-input cursor-pointer">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                {['Environmental', 'Social', 'Governance', 'Safety', 'Legal'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="e.g. Engineering" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Owner <span className="text-red-500">*</span></label>
              <input value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))} placeholder="Name" className="eco-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date <span className="text-red-500">*</span></label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="eco-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Detailed description of the compliance issue…" className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
