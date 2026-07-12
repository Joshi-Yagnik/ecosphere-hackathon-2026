'use client';

// app/(dashboard)/social/csr-activities/page.tsx
// ============================================================
// Social – CSR Activities
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus, Search, Download, CheckCircle2, XCircle, Clock,
  Eye, Heart, Activity, Upload
} from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { csrActivities as initial, employeeParticipations } from '@/lib/mock-data/social';
import { departmentScores } from '@/lib/mock-data/dashboard';
import type { CsrActivity } from '@/types';
import { cn } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  draft: 'eco-badge-slate',
  submitted: 'eco-badge-blue',
  approved: 'eco-badge-green',
  rejected: 'eco-badge-red',
};

const statusIcon: Record<string, React.ElementType> = {
  draft: Clock, submitted: Activity, approved: CheckCircle2, rejected: XCircle,
};

function StatusBadge({ state }: { state: string }) {
  const Icon = statusIcon[state] ?? Clock;
  return (
    <span className={cn(statusStyle[state], 'eco-badge text-[11px] flex items-center gap-1 w-fit capitalize')}>
      <Icon className="w-3 h-3" />
      {state}
    </span>
  );
}

function buildColumns(
  onView: (ct: CsrActivity) => void,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): ColumnDef<CsrActivity, unknown>[] {
  return [
    {
      accessorKey: 'reference',
      header: 'Reference',
      size: 130,
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Activity Name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.original.category}</p>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 110,
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.date}</span>,
    },
    {
      accessorKey: 'department',
      header: 'Department / Organizer',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-slate-700">{row.original.department}</p>
          <p className="text-xs text-slate-400">{row.original.organizer}</p>
        </div>
      ),
    },
    {
      accessorKey: 'participantCount',
      header: 'Participants',
      size: 100,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.participantCount}</span>
      ),
    },
    {
      accessorKey: 'xpAwarded',
      header: 'XP',
      size: 90,
      cell: ({ row }) => (
        <span className="eco-xp-chip text-xs">⚡ {row.original.xpAwarded}</span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 110,
      cell: ({ row }) => <StatusBadge state={row.original.state} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      cell: ({ row }) => {
        const { state, id } = row.original;
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => onView(row.original)} title="View Details" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </button>
            {state === 'submitted' && (
              <>
                <button onClick={() => onApprove(id)} title="Approve" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onReject(id)} title="Reject" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default function CsrActivitiesPage() {
  const [data, setData] = useState<CsrActivity[]>(initial);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewItem, setViewItem] = useState<CsrActivity | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    category: 'Community',
    date: new Date().toISOString().split('T')[0],
    departmentId: 'd1',
    organizer: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const depts = [...new Set(data.map((c) => c.department))].sort();

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.reference.toLowerCase().includes(q) || item.organizer.toLowerCase().includes(q);
      const matchDept = deptFilter === 'all' || item.department === deptFilter;
      const matchStatus = statusFilter === 'all' || item.state === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [data, search, deptFilter, statusFilter]);

  const handleApprove = (id: string) => setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'approved' } : r));
  const handleReject = (id: string) => setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'rejected' } : r));

  const handleCreate = () => {
    setSaving(true);
    setTimeout(() => {
      const dept = departmentScores.find((d) => d.id === form.departmentId);
      if (!dept) return;
      const newActivity: CsrActivity = {
        id: `csr${Date.now()}`,
        reference: `CSR-2026-${String(data.length + 1).padStart(3, '0')}`,
        name: form.name,
        category: form.category,
        date: form.date,
        department: dept.name,
        departmentId: dept.id,
        organizer: form.organizer,
        organizerId: `e${Date.now()}`,
        participantCount: 0,
        xpAwarded: 0,
        hasProof: false,
        state: 'draft',
        description: form.description,
      };
      setData((prev) => [newActivity, ...prev]);
      setCreateModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(
    () => buildColumns(setViewItem, handleApprove, handleReject),
    []
  );

  const pendingCount = data.filter((d) => d.state === 'submitted').length;
  const approvedCount = data.filter((d) => d.state === 'approved').length;
  const totalParticipants = data.filter(d => d.state === 'approved').reduce((acc, curr) => acc + curr.participantCount, 0);

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Heart className="w-6 h-6 text-blue-600" /> CSR Activities
          </h1>
          <p className="eco-page-subtitle">Manage corporate social responsibility events and community initiatives.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="eco-btn-secondary text-xs px-3 py-2 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="eco-btn-primary text-xs px-3 py-2 gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" /> Plan Activity
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Activities', value: data.length, color: 'text-slate-700 bg-slate-100' },
          { label: 'Pending Approval', value: pendingCount, color: 'text-orange-700 bg-orange-50' },
          { label: 'Approved Events', value: approvedCount, color: 'text-blue-700 bg-blue-50' },
          { label: 'Total Participants', value: totalParticipants, color: 'text-green-700 bg-green-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="eco-card p-4 flex flex-col justify-center"
          >
            <p className={`text-2xl font-extrabold ${stat.color.split(' ')[0]}`}>{stat.value}</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities…" className="eco-input pl-9 text-sm focus:ring-blue-500" />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer focus:ring-blue-500">
            <option value="all">All Departments</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No CSR activities found." emptyIcon="🤝" />
      </div>

      {/* ── View Modal ──────────────────────────────────── */}
      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ''}
        subtitle={viewItem?.reference}
        size="md"
        footer={
          <>
            <button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>
            {viewItem?.state === 'submitted' && (
              <>
                <button onClick={() => { handleReject(viewItem.id); setViewItem(null); }} className="eco-btn-secondary text-red-600 hover:bg-red-50 text-sm">Reject</button>
                <button onClick={() => { handleApprove(viewItem.id); setViewItem(null); }} className="eco-btn-primary bg-green-600 hover:bg-green-700 text-sm">Approve</button>
              </>
            )}
          </>
        }
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            {[
              ['Department', viewItem.department],
              ['Category', viewItem.category],
              ['Date', viewItem.date],
              ['Organizer', viewItem.organizer],
              ['Participants', viewItem.participantCount.toString()],
              ['XP Awarded', `${viewItem.xpAwarded} XP`],
              ['Status', <StatusBadge key="status" state={viewItem.state} />],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold text-right">{v}</span>
              </div>
            ))}
            {viewItem.description && (
              <div className="pt-2">
                <p className="text-slate-500 font-medium mb-1">Description</p>
                <p className="text-slate-700">{viewItem.description}</p>
              </div>
            )}
            <div className="pt-2">
                <p className="text-slate-500 font-medium mb-1">Proof Documentation</p>
                {viewItem.hasProof ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <a href="#" className="text-blue-600 font-medium hover:underline">event_photos_and_receipts.zip</a>
                    </div>
                ) : (
                    <p className="text-slate-400 italic">No proof uploaded.</p>
                )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Create Modal ────────────────────────────────── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Plan CSR Activity"
        subtitle="Create a new CSR event. It will be saved as Draft."
        size="md"
        footer={
          <>
            <button onClick={() => setCreateModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={!form.name || !form.organizer || saving} className="eco-btn-primary bg-blue-600 hover:bg-blue-700 text-sm min-w-[100px]">
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. River Cleanup" className="eco-input focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="eco-input focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer focus:ring-blue-500">
                {['Community', 'Environment', 'Health', 'Education', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department <span className="text-red-500">*</span></label>
              <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="eco-input cursor-pointer focus:ring-blue-500">
                {departmentScores.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Organizer <span className="text-red-500">*</span></label>
              <input value={form.organizer} onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))} placeholder="John Doe" className="eco-input focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Provide details about the activity..." className="eco-input resize-none focus:ring-blue-500" />
          </div>
        </div>
      </Modal>

    </div>
  );
}
