'use client';

// app/(dashboard)/gamification/badges/page.tsx
// ============================================================
// Gamification – Badges
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Award, Shield, ToggleLeft, ToggleRight, CheckCircle2, Eye } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { badges as initial } from '@/lib/mock-data/gamification';
import type { Badge } from '@/types';
import { cn } from '@/lib/utils';

function buildColumns(
  onView: (b: Badge) => void,
  onToggleActive: (id: string) => void
): ColumnDef<Badge, unknown>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Badge',
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm', row.original.color)}>
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">{row.original.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'xpValue',
      header: 'XP Value',
      size: 100,
      cell: ({ row }) => <span className="eco-xp-chip text-xs">⚡ {row.original.xpValue}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-sm text-slate-600 line-clamp-1">{row.original.description}</span>,
    },
    {
      accessorKey: 'awardedCount',
      header: 'Awarded',
      size: 100,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-700">{row.original.awardedCount}</span>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Active',
      size: 90,
      cell: ({ row }) => (
        row.original.active ? (
          <span className="eco-badge-green text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Yes
          </span>
        ) : (
          <span className="eco-badge-slate text-[11px]">No</span>
        )
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onView(row.original)} title="View Details" className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onToggleActive(row.original.id)} title={row.original.active ? 'Deactivate' : 'Activate'} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            {row.original.active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];
}

export default function BadgesPage() {
  const [data, setData] = useState<Badge[]>(initial);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<Badge | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'General', xpValue: 100, unlockRule: 'challenge_complete' as Badge['unlockRule'] });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
  }), [data, search]);

  const handleToggleActive = (id: string) => setData(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));

  const handleCreate = () => {
    setSaving(true);
    setTimeout(() => {
      const newBadge: Badge = {
        id: `bdg${Date.now()}`,
        active: true,
        awardedCount: 0,
        color: 'text-slate-700 bg-slate-50 border-slate-200', // Default generic color
        ...form,
      };
      setData((prev) => [newBadge, ...prev]);
      setCreateModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(setViewItem, handleToggleActive), []);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" /> Achievement Badges
          </h1>
          <p className="eco-page-subtitle">Manage collectable badges and their unlock criteria.</p>
        </div>
        <button onClick={() => setCreateModalOpen(true)} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Badge
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Badges', value: data.length, color: 'text-slate-700' },
          { label: 'Active', value: data.filter(b => b.active).length, color: 'text-green-600' },
          { label: 'Inactive', value: data.filter(b => !b.active).length, color: 'text-slate-400' },
          { label: 'Total Awarded', value: data.reduce((acc, b) => acc + b.awardedCount, 0), color: 'text-orange-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="eco-card p-4">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search badges…" className="eco-input pl-9 text-sm" />
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No badges found." emptyIcon="🛡️" />
      </div>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name ?? ''} subtitle={viewItem?.category} size="md"
        footer={<button onClick={() => setViewItem(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="flex justify-center py-4">
              <div className={cn('w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg', viewItem.color)}>
                <Award className="w-10 h-10" />
              </div>
            </div>
            {[
              ['XP Value', `${viewItem.xpValue} XP`],
              ['Unlock Rule', viewItem.unlockRule.replace('_', ' ')],
              ['Total Awarded', viewItem.awardedCount.toString()],
              ['Status', viewItem.active ? 'Active' : 'Inactive'],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 capitalize">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
            <div className="pt-2">
              <p className="text-slate-500 font-medium mb-1">Description</p>
              <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{viewItem.description}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Badge" size="md"
        footer={
          <>
            <button onClick={() => setCreateModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={!form.name || !form.xpValue || saving} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-sm min-w-[100px]">
              {saving ? 'Creating…' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Badge Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Zero Waste Hero" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                {['Transport', 'Community', 'Waste', 'Energy', 'Resource', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">XP Value <span className="text-red-500">*</span></label>
              <input type="number" value={form.xpValue || ''} onChange={(e) => setForm((f) => ({ ...f, xpValue: Number(e.target.value) }))} className="eco-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Unlock Rule</label>
            <select value={form.unlockRule} onChange={(e) => setForm((f) => ({ ...f, unlockRule: e.target.value as Badge['unlockRule'] }))} className="eco-input cursor-pointer">
              <option value="challenge_complete">Challenge Complete</option>
              <option value="activity_count">Activity Count Threshold</option>
              <option value="xp_threshold">XP Threshold</option>
              <option value="carbon_reduction">Carbon Reduction Target</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Explain how to earn this badge..." className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
