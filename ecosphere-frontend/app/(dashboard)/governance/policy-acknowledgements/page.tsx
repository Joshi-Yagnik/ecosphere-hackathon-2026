'use client';

// app/(dashboard)/governance/policy-acknowledgements/page.tsx
// ============================================================
// Governance – Policy Acknowledgements Tracker
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Search, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { policyAcknowledgements as initial, policies } from '@/lib/mock-data/governance';
import type { PolicyAcknowledgement } from '@/types';
import { cn, getInitials } from '@/lib/utils';

function buildColumns(): ColumnDef<PolicyAcknowledgement, unknown>[] {
  return [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
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
      accessorKey: 'policyName',
      header: 'Policy',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">{row.original.policyName}</span>
      ),
    },
    {
      accessorKey: 'acknowledgedAt',
      header: 'Acknowledged At',
      size: 160,
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {new Date(row.original.acknowledgedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      accessorKey: 'isOverdue',
      header: 'Overdue?',
      size: 100,
      cell: ({ row }) => (
        row.original.isOverdue ? (
          <span className="eco-badge-red text-[11px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        ) : (
          <span className="eco-badge-green text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> On Time
          </span>
        )
      ),
    },
  ];
}

export default function PolicyAcknowledgementsPage() {
  const [search, setSearch] = useState('');
  const [policyFilter, setPolicyFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');

  const filtered = useMemo(() => initial.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.employeeName.toLowerCase().includes(q) || a.policyName.toLowerCase().includes(q);
    const matchPolicy = policyFilter === 'all' || a.policyId === policyFilter;
    const matchOverdue = overdueFilter === 'all' || (overdueFilter === 'overdue' ? a.isOverdue : !a.isOverdue);
    return matchSearch && matchPolicy && matchOverdue;
  }), [search, policyFilter, overdueFilter]);

  const overdueCount = initial.filter((a) => a.isOverdue).length;
  const onTimeCount = initial.length - overdueCount;

  const columns = useMemo(() => buildColumns(), []);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-600" /> Policy Acknowledgements
          </h1>
          <p className="eco-page-subtitle">Track which employees have acknowledged mandatory and active policies.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Records', value: initial.length, color: 'text-slate-700' },
          { label: 'Acknowledged On Time', value: onTimeCount, color: 'text-green-600' },
          { label: 'Overdue', value: overdueCount, color: 'text-red-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="eco-card p-4">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {overdueCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span><strong>{overdueCount} acknowledgement{overdueCount > 1 ? 's' : ''}</strong> are overdue. Send reminders to the employees.</span>
        </div>
      )}

      {/* Filters */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by employee or policy…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={policyFilter} onChange={(e) => setPolicyFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Policies</option>
            {policies.map((p) => <option key={p.id} value={p.id}>{p.code} – {p.name}</option>)}
          </select>
          <select value={overdueFilter} onChange={(e) => setOverdueFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Records</option>
            <option value="overdue">Overdue Only</option>
            <option value="ontime">On Time Only</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No acknowledgement records found." emptyIcon="📑" />
      </div>
    </div>
  );
}
