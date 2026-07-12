'use client';

// app/(dashboard)/gamification/rewards/page.tsx
// ============================================================
// Gamification – Rewards Store
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Gift, Package, BatteryWarning, CheckCircle2, ShoppingBag } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { rewards as initial } from '@/lib/mock-data/gamification';
import type { Reward, RewardState } from '@/types';
import { cn } from '@/lib/utils';

const stateConfig: Record<RewardState, { label: string; cls: string; icon: React.ElementType }> = {
  available: { label: 'Available', cls: 'eco-badge-green', icon: CheckCircle2 },
  limited:   { label: 'Limited',   cls: 'eco-badge-amber', icon: BatteryWarning },
  exhausted: { label: 'Exhausted', cls: 'eco-badge-red',   icon: Package },
};

function RewardStateBadge({ state }: { state: RewardState }) {
  const cfg = stateConfig[state];
  return (
    <span className={cn(cfg.cls, 'eco-badge text-[11px] flex items-center gap-1')}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function buildColumns(): ColumnDef<Reward, unknown>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Reward Name',
      size: 250,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.original.category}</p>
        </div>
      ),
    },
    {
      accessorKey: 'xpCost',
      header: 'XP Cost',
      size: 100,
      cell: ({ row }) => <span className="eco-xp-chip text-xs font-bold text-orange-600 bg-orange-50 border-orange-200">⚡ {row.original.xpCost}</span>,
    },
    {
      accessorKey: 'inventory',
      header: 'Inventory',
      size: 140,
      cell: ({ row }) => {
        if (row.original.isUnlimited) return <span className="text-sm font-medium text-slate-500">∞ Unlimited</span>;
        const pct = (row.original.remainingQuantity! / row.original.totalQuantity!) * 100;
        return (
          <div className="w-full pr-4">
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className={pct < 20 ? 'text-red-500' : 'text-slate-600'}>{row.original.remainingQuantity} left</span>
              <span className="text-slate-400">/ {row.original.totalQuantity}</span>
            </div>
            <div className="eco-progress-bar h-1.5">
              <div className={cn("h-full rounded-full", pct < 20 ? 'bg-red-500' : 'bg-slate-400')} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'redeemedCount',
      header: 'Redeemed',
      size: 100,
      cell: ({ row }) => <span className="font-semibold text-slate-700">{row.original.redeemedCount}</span>,
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 120,
      cell: ({ row }) => <RewardStateBadge state={row.original.state} />,
    },
  ];
}

export default function RewardsPage() {
  const [data, setData] = useState<Reward[]>(initial);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'Perk', xpCost: 1000, isUnlimited: false, totalQuantity: 100 });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q);
    const matchState = stateFilter === 'all' || r.state === stateFilter;
    return matchSearch && matchState;
  }), [data, search, stateFilter]);

  const handleCreate = () => {
    setSaving(true);
    setTimeout(() => {
      const newReward: Reward = {
        id: `rw${Date.now()}`,
        state: form.isUnlimited ? 'available' : 'limited',
        redeemedCount: 0,
        remainingQuantity: form.isUnlimited ? undefined : form.totalQuantity,
        ...form,
      };
      setData((prev) => [newReward, ...prev]);
      setCreateModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(), []);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Gift className="w-6 h-6 text-orange-500" /> Rewards Store
          </h1>
          <p className="eco-page-subtitle">Manage items, perks, and experiences employees can redeem with their XP.</p>
        </div>
        <button onClick={() => setCreateModalOpen(true)} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Reward
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Items', value: data.length, color: 'text-slate-700' },
          { label: 'Available', value: data.filter(r => r.state === 'available').length, color: 'text-green-600' },
          { label: 'Exhausted', value: data.filter(r => r.state === 'exhausted').length, color: 'text-red-600' },
          { label: 'Total Redemptions', value: data.reduce((acc, r) => acc + r.redeemedCount, 0), color: 'text-blue-600' },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rewards…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Inventory</option>
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="exhausted">Exhausted</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No rewards found." emptyIcon="🎁" />
      </div>

      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Reward Item" size="md"
        footer={
          <>
            <button onClick={() => setCreateModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={!form.name || !form.xpCost || saving} className="eco-btn-primary bg-orange-500 hover:bg-orange-600 text-sm min-w-[100px]">
              {saving ? 'Adding…' : 'Add Item'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Reward Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Eco-friendly Water Bottle" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                {['Perk', 'Merch', 'Donation', 'Experience'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">XP Cost <span className="text-red-500">*</span></label>
              <input type="number" value={form.xpCost || ''} onChange={(e) => setForm((f) => ({ ...f, xpCost: Number(e.target.value) }))} className="eco-input" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="unlimited" checked={form.isUnlimited} onChange={(e) => setForm((f) => ({ ...f, isUnlimited: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-orange-500 cursor-pointer" />
            <label htmlFor="unlimited" className="text-sm text-slate-700 font-medium cursor-pointer">Unlimited Inventory (e.g. Donations)</label>
          </div>
          {!form.isUnlimited && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Total Quantity</label>
              <input type="number" value={form.totalQuantity || ''} onChange={(e) => setForm((f) => ({ ...f, totalQuantity: Number(e.target.value) }))} className="eco-input w-1/2" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description..." className="eco-input resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
