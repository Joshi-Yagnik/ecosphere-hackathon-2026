'use client';

// app/(dashboard)/social/employee-participation/page.tsx
// ============================================================
// Social – Employee Participation
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Search, Download, Users, CheckCircle2, XCircle, Clock, Award
} from 'lucide-react';
import { mockGetSession } from '@/lib/mock-auth';

import { DataTable } from '@/components/ui/DataTable';
import { employeeParticipations as initial } from '@/lib/mock-data/social';
import type { EmployeeParticipation } from '@/types';
import { cn, getInitials } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  pending: 'eco-badge-slate',
  approved: 'eco-badge-green',
  rejected: 'eco-badge-red',
};

const statusIcon: Record<string, React.ElementType> = {
  pending: Clock, approved: CheckCircle2, rejected: XCircle,
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
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): ColumnDef<EmployeeParticipation, unknown>[] {
  return [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
            {getInitials(row.original.employeeName)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{row.original.employeeName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{row.original.department}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'activityName',
      header: 'Activity',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">{row.original.activityName}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 110,
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.date}</span>,
    },
    {
      accessorKey: 'hoursContributed',
      header: 'Hours',
      size: 90,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.hoursContributed}h</span>
      ),
    },
    {
      accessorKey: 'xpEarned',
      header: 'XP Earned',
      size: 100,
      cell: ({ row }) => (
        <span className="eco-xp-chip text-xs">⚡ {row.original.xpEarned}</span>
      ),
    },
    {
      accessorKey: 'badgeAwarded',
      header: 'Badge',
      size: 130,
      cell: ({ row }) => (
        row.original.badgeAwarded ? (
            <span className="eco-badge-amber text-[10px] flex items-center gap-1">
                <Award className="w-3 h-3" /> {row.original.badgeAwarded}
            </span>
        ) : (
            <span className="text-slate-400 text-xs">-</span>
        )
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
      size: 100,
      cell: ({ row }) => {
        const { state, id } = row.original;
        return (
          <div className="flex items-center gap-1">
            {state === 'pending' ? (
              (!mockGetSession()?.user?.role || (mockGetSession()?.user?.role !== 'manager' && mockGetSession()?.user?.role !== 'employee')) ? (
                <>
                  <button onClick={() => onApprove(id)} title="Approve" className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onReject(id)} title="Reject" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span className="text-slate-300 text-xs px-2">Pending</span>
              )
            ) : (
                <span className="text-slate-300 text-xs px-2">Processed</span>
            )}
          </div>
        );
      },
    },
  ];
}

export default function EmployeeParticipationPage() {
  const session = mockGetSession();
  const isManager = session?.user?.role === 'manager';
  const isEmployee = session?.user?.role === 'employee';
  const managerDept = session?.user?.department || '';
  const employeeName = session?.user?.name || '';

  const [data, setData] = useState<EmployeeParticipation[]>(initial);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.employeeName.toLowerCase().includes(q) || item.activityName.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || item.state === statusFilter;
      const matchDept = !isManager || item.department === managerDept;
      const matchEmp = !isEmployee || item.employeeName === employeeName;
      return matchSearch && matchStatus && matchDept && matchEmp;
    });
  }, [data, search, statusFilter, isManager, managerDept]);

  const handleApprove = (id: string) => setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'approved' } : r));
  const handleReject = (id: string) => setData((prev) => prev.map((r) => r.id === id ? { ...r, state: 'rejected' } : r));

  const columns = useMemo(
    () => buildColumns(handleApprove, handleReject),
    []
  );

  const pendingCount = filtered.filter((d) => d.state === 'pending').length;
  const approvedCount = filtered.filter((d) => d.state === 'approved').length;
  const totalHours = filtered.filter(d => d.state === 'approved').reduce((acc, curr) => acc + curr.hoursContributed, 0);

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Employee Participation
          </h1>
          <p className="eco-page-subtitle">Track individual employee contributions to CSR and sustainability initiatives.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Exporting participation records...')} className="eco-btn-secondary text-xs px-3 py-2 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export Log
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: filtered.length, color: 'text-slate-700 bg-slate-100' },
          { label: 'Pending Verification', value: pendingCount, color: 'text-orange-700 bg-orange-50' },
          { label: 'Verified Participations', value: approvedCount, color: 'text-blue-700 bg-blue-50' },
          { label: 'Total Volunteer Hours', value: `${totalHours}h`, color: 'text-green-700 bg-green-50' },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or activity…" className="eco-input pl-9 text-sm focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter={search} pageSize={10} emptyMessage="No participation records found." emptyIcon="👤" />
      </div>

    </div>
  );
}
