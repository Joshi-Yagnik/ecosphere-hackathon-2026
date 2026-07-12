'use client';

// app/(dashboard)/gamification/challenges/page.tsx
// ============================================================
// Gamification – Challenges
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Zap, CheckCircle2, Clock, Users, Award, Play } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { challenges as initial } from '@/lib/mock-data/gamification';
import type { Challenge, ChallengeState } from '@/types';
import { cn } from '@/lib/utils';

const stateConfig: Record<ChallengeState, { label: string; cls: string; icon: React.ElementType }> = {
  draft:        { label: 'Draft',        cls: 'eco-badge-slate',  icon: Clock },
  active:       { label: 'Active',       cls: 'eco-badge-blue',   icon: Play },
  under_review: { label: 'Under Review', cls: 'eco-badge-amber',  icon: Search },
  completed:    { label: 'Completed',    cls: 'eco-badge-green',  icon: CheckCircle2 },
  archived:     { label: 'Archived',     cls: 'eco-badge-slate',  icon: Clock },
};

function ChallengeStateBadge({ state }: { state: ChallengeState }) {
  const cfg = stateConfig[state];
  return (
    <span className={cn(cfg.cls, 'eco-badge text-[11px] flex items-center gap-1')}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function buildColumns(onView: (c: Challenge) => void): ColumnDef<Challenge, unknown>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Challenge',
      size: 250,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 110,
      cell: ({ row }) => <span className="text-sm font-medium text-slate-700">{row.original.category}</span>,
    },
    {
      accessorKey: 'xpTarget',
      header: 'XP Reward',
      size: 100,
      cell: ({ row }) => <span className="eco-xp-chip text-xs">⚡ {row.original.xpTarget}</span>,
    },
    {
      accessorKey: 'badge',
      header: 'Badge',
      size: 130,
      cell: ({ row }) => (
        row.original.badge ? (
          <span className="eco-badge-amber text-[10px] flex items-center gap-1">
            <Award className="w-3 h-3" /> {row.original.badge}
          </span>
        ) : <span className="text-slate-400 text-xs">—</span>
      ),
    },
    {
      accessorKey: 'participantCount',
      header: 'Participants',
      size: 100,
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Users className="w-4 h-4 text-slate-400" /> {row.original.participantCount}
        </span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 110,
      cell: ({ row }) => <ChallengeStateBadge state={row.original.state} />,
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row }) => (
        <button onClick={() => onView(row.original)} className="eco-btn-secondary text-xs px-2 py-1">View</button>
      ),
    },
  ];
}

export default function ChallengesPage() {
  const [data, setData] = useState<Challenge[]>(initial);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewItem, setViewItem] = useState<Challenge | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', xpTarget: 500, deadline: '' });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchState = stateFilter === 'all' || c.state === stateFilter;
    return matchSearch && matchState;
  }), [data, search, stateFilter]);

  const handleCreate = () => {
    setSaving(true);
    setTimeout(() => {
      const newCh: Challenge = {
        id: `ch${Date.now()}`,
        reference: `CH-2026-00${data.length + 1}`,
        state: 'draft',
        currentXp: 0,
        progress: 0,
        participantCount: 0,
        ...form,
      };
      setData((prev) => [newCh, ...prev]);
      setCreateModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(setViewItem), []);

  const stats = {
    total: data.length,
    active: data.filter(c => c.state === 'active').length,
    participants: data.reduce((acc, c) => acc + c.participantCount, 0),
    avgProgress: data.length ? data.reduce((acc, c) => acc + c.progress, 0) / data.length : 0,
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-500" /> Sustainability Challenges
          </h1>
          <p className="eco-page-subtitle">Engage employees with gamified sustainability targets and XP rewards.</p>
        </div>
        <button onClick={() => setCreateModalOpen(true)} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Create Challenge
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Challenges', value: stats.total, color: 'text-slate-700' },
          { label: 'Active Now', value: stats.active, color: 'text-orange-600' },
          { label: 'Total Participants', value: stats.participants, color: 'text-blue-600' },
          { label: 'Avg Progress', value: `${stats.avgProgress.toFixed(0)}%`, color: 'text-green-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search challenges…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No challenges found." emptyIcon="🎯" />
      </div>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title ?? ''} subtitle={viewItem?.reference} size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 font-medium">Overall Progress</span>
                <span className="text-lg font-extrabold text-slate-900">{viewItem.progress}%</span>
              </div>
              <div className="eco-progress-bar h-2.5">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${viewItem.progress}%` }} />
              </div>
            </div>
            {[
              ['Category', viewItem.category],
              ['Department', viewItem.department ?? 'All Departments'],
              ['Participants', viewItem.participantCount.toString()],
              ['XP Reward', `${viewItem.xpTarget} XP`],
              ['Deadline', viewItem.deadline],
              ['Status', <ChallengeStateBadge key="st" state={viewItem.state} />],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
            <div className="pt-2">
              <p className="text-slate-500 font-medium mb-1">Description</p>
              <p className="text-slate-700 leading-relaxed">{viewItem.description}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Challenge" subtitle="New challenges begin as Draft." size="md"
        footer={
          <>
            <button onClick={() => setCreateModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={!form.title || !form.xpTarget || saving} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-sm min-w-[100px]">
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Challenge Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Zero Waste Month" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                {['Waste', 'Energy', 'Transport', 'Resource', 'Community', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">XP Target <span className="text-red-500">*</span></label>
              <input type="number" value={form.xpTarget || ''} onChange={(e) => setForm((f) => ({ ...f, xpTarget: Number(e.target.value) }))} className="eco-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="eco-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Rules and requirements..." className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
