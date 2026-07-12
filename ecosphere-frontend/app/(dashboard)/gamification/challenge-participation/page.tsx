'use client';

// app/(dashboard)/gamification/challenge-participation/page.tsx
// ============================================================
// Gamification – Employee Challenge Participation
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Search, Users, CheckCircle2, Play, AlertCircle, Award } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { challengeParticipations as initial } from '@/lib/mock-data/gamification';
import type { ChallengeParticipation } from '@/types';
import { cn, getInitials } from '@/lib/utils';

const statusConfig: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  active:    { label: 'Active',    cls: 'eco-badge-blue',   icon: Play },
  completed: { label: 'Completed', cls: 'eco-badge-green',  icon: CheckCircle2 },
  withdrawn: { label: 'Withdrawn', cls: 'eco-badge-slate',  icon: AlertCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn(cfg.cls, 'eco-badge text-[11px] flex items-center gap-1')}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function buildColumns(): ColumnDef<ChallengeParticipation, unknown>[] {
  return [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700 shrink-0">
            {getInitials(row.original.employeeName)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{row.original.employeeName}</p>
            <p className="text-xs text-slate-400">{row.original.department}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'challengeTitle',
      header: 'Challenge',
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.challengeTitle}</span>,
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined Date',
      size: 110,
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.joinedAt}</span>,
    },
    {
      accessorKey: 'xpEarned',
      header: 'XP Earned',
      size: 100,
      cell: ({ row }) => <span className="eco-xp-chip text-xs">⚡ {row.original.xpEarned}</span>,
    },
    {
      accessorKey: 'badgeAwarded',
      header: 'Badge',
      size: 130,
      cell: ({ row }) => (
        row.original.badgeAwarded ? (
          <span className="eco-badge-amber text-[10px] flex items-center gap-1">
            <Award className="w-3 h-3" /> {row.original.badgeName}
          </span>
        ) : <span className="text-slate-400 text-xs">—</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 110,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];
}

export default function ChallengeParticipationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => initial.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.employeeName.toLowerCase().includes(q) || p.challengeTitle.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  }), [search, statusFilter]);

  const columns = useMemo(() => buildColumns(), []);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" /> Challenge Participation
          </h1>
          <p className="eco-page-subtitle">Monitor employee enrollment and progress in active sustainability challenges.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Enrollments', value: initial.length, color: 'text-slate-700' },
          { label: 'Active', value: initial.filter(p => p.status === 'active').length, color: 'text-blue-600' },
          { label: 'Completed', value: initial.filter(p => p.status === 'completed').length, color: 'text-green-600' },
          { label: 'Badges Awarded', value: initial.filter(p => p.badgeAwarded).length, color: 'text-amber-600' },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by employee or challenge…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No participation records found." emptyIcon="🏃" />
      </div>
    </div>
  );
}
