'use client';

// app/(dashboard)/gamification/leaderboard/page.tsx
// ============================================================
// Gamification – Leaderboard
// ============================================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Trophy, Search, ChevronUp, ChevronDown, Minus, Medal, Award, Target } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { leaderboard as initial } from '@/lib/mock-data/gamification';
import type { LeaderboardEntry } from '@/types';
import { cn, getInitials } from '@/lib/utils';

function TrendIndicator({ trend, rankChange }: { trend: 'up' | 'down' | 'stable'; rankChange: number }) {
  if (trend === 'up') return <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-600"><ChevronUp className="w-3 h-3" />{rankChange}</span>;
  if (trend === 'down') return <span className="flex items-center gap-0.5 text-[11px] font-bold text-red-500"><ChevronDown className="w-3 h-3" />{Math.abs(rankChange)}</span>;
  return <span className="flex items-center gap-0.5 text-[11px] font-bold text-slate-400"><Minus className="w-3 h-3" /></span>;
}

function buildColumns(): ColumnDef<LeaderboardEntry, unknown>[] {
  return [
    {
      accessorKey: 'rank',
      header: 'Rank',
      size: 80,
      cell: ({ row }) => {
        const r = row.original.rank;
        return (
          <div className="flex items-center justify-center w-8 h-8 font-extrabold text-sm relative">
            {r === 1 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
             r === 2 ? <Medal className="w-6 h-6 text-slate-400" /> :
             r === 3 ? <Medal className="w-6 h-6 text-amber-700" /> :
             <span className="text-slate-500">#{r}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'trend',
      header: 'Trend',
      size: 70,
      cell: ({ row }) => <TrendIndicator trend={row.original.trend} rankChange={row.original.rankChange} />,
    },
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border shadow-sm">
            {getInitials(row.original.employeeName)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.original.employeeName}</p>
            <p className="text-xs text-slate-500">{row.original.department}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'badgeCount',
      header: 'Badges',
      size: 100,
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Award className="w-4 h-4 text-orange-500" /> {row.original.badgeCount}
        </span>
      ),
    },
    {
      accessorKey: 'challengesCompleted',
      header: 'Challenges',
      size: 110,
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Target className="w-4 h-4 text-blue-500" /> {row.original.challengesCompleted}
        </span>
      ),
    },
    {
      accessorKey: 'totalXp',
      header: 'Total XP',
      size: 130,
      cell: ({ row }) => <span className="eco-xp-chip text-sm font-extrabold text-orange-700 bg-orange-100 border-orange-200">⚡ {row.original.totalXp.toLocaleString()}</span>,
    },
  ];
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = initial;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.employeeName.toLowerCase().includes(q));
    }
    if (deptFilter !== 'all') {
      result = result.filter(r => r.department === deptFilter);
    }
    // Re-rank dynamically if filtered
    if (search || deptFilter !== 'all') {
      result = result.map((r, i) => ({ ...r, rank: i + 1, trend: 'stable' as const, rankChange: 0 }));
    }
    return result;
  }, [search, deptFilter]);

  const columns = useMemo(() => buildColumns(), []);

  // Top 3 for podium
  const top3 = initial.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Global Leaderboard
          </h1>
          <p className="eco-page-subtitle">Recognizing our top sustainability champions across the organization.</p>
        </div>
      </div>

      {/* Podium */}
      {!search && deptFilter === 'all' && (
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 my-8 h-48">
          {/* Rank 2 */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-32 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shadow-md mb-2">{getInitials(top3[1].employeeName)}</div>
            <p className="font-bold text-sm text-center text-slate-800 line-clamp-1">{top3[1].employeeName}</p>
            <p className="text-[10px] text-slate-500 mb-2">{top3[1].totalXp} XP</p>
            <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl border-t border-x border-slate-300 flex items-start justify-center pt-2">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-36 flex flex-col items-center z-10">
            <Trophy className="w-8 h-8 text-yellow-500 mb-1" />
            <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-yellow-400 flex items-center justify-center font-bold text-orange-700 shadow-xl mb-2 text-lg">{getInitials(top3[0].employeeName)}</div>
            <p className="font-bold text-base text-center text-slate-900 line-clamp-1">{top3[0].employeeName}</p>
            <p className="text-xs text-orange-600 font-bold mb-2">{top3[0].totalXp} XP</p>
            <div className="w-full h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-xl border-t-2 border-x-2 border-yellow-300 flex items-start justify-center pt-2 shadow-inner">
              <span className="text-3xl font-extrabold text-yellow-600/50">1</span>
            </div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-32 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center font-bold text-amber-700 shadow-md mb-2">{getInitials(top3[2].employeeName)}</div>
            <p className="font-bold text-sm text-center text-slate-800 line-clamp-1">{top3[2].employeeName}</p>
            <p className="text-[10px] text-slate-500 mb-2">{top3[2].totalXp} XP</p>
            <div className="w-full h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-xl border-t border-x border-amber-300 flex items-start justify-center pt-2">
              <Medal className="w-6 h-6 text-amber-700" />
            </div>
          </motion.div>
        </div>
      )}

      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter="" pageSize={10} emptyMessage="No employees found." emptyIcon="👤" />
      </div>
    </div>
  );
}
