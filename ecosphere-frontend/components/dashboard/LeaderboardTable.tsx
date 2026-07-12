'use client';

// components/dashboard/LeaderboardTable.tsx
// ============================================================
// XP Leaderboard – Top 10 employees
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Zap } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { leaderboardData } from '@/lib/mock-data/dashboard';

const MEDAL: Record<number, { icon: string; bg: string; text: string }> = {
  1: { icon: '🏆', bg: 'bg-amber-50',  text: 'text-amber-700'  },
  2: { icon: '🥈', bg: 'bg-slate-50',  text: 'text-slate-600'  },
  3: { icon: '🥉', bg: 'bg-orange-50', text: 'text-orange-700' },
};

const DEPT_COLORS: Record<string, string> = {
  Engineering:     'bg-green-100 text-green-700',
  'Human Resources':'bg-blue-100 text-blue-700',
  Operations:      'bg-teal-100 text-teal-700',
  Finance:         'bg-violet-100 text-violet-700',
  Marketing:       'bg-orange-100 text-orange-700',
};

function TrendIcon({ trend, change }: { trend: string; change: number }) {
  if (trend === 'up')
    return (
      <span className="flex items-center gap-0.5 text-green-600 text-xs font-semibold">
        <TrendingUp className="w-3.5 h-3.5" /> +{change}
      </span>
    );
  if (trend === 'down')
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold">
        <TrendingDown className="w-3.5 h-3.5" /> {change}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-slate-400 text-xs">
      <Minus className="w-3.5 h-3.5" />
    </span>
  );
}

export function LeaderboardTable() {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? leaderboardData : leaderboardData.slice(0, 7);

  return (
    <div className="eco-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="eco-section-title flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            XP Leaderboard
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Company-wide · July 2026</p>
        </div>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-green-600 font-semibold hover:text-green-700 transition-colors"
        >
          {showAll ? 'Show less' : 'Show all 10 →'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Department
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                XP
              </th>
              <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Badges
              </th>
              <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, i) => {
              const medal = MEDAL[entry.rank];
              const deptClass = DEPT_COLORS[entry.department] ?? 'bg-slate-100 text-slate-600';

              return (
                <motion.tr
                  key={entry.employeeId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    {medal ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm ${medal.bg}`}>
                        {medal.icon}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-slate-400 pl-1">
                        {entry.rank}
                      </span>
                    )}
                  </td>

                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                        {getInitials(entry.employeeName)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {entry.employeeName}
                        </p>
                        <p className="text-xs text-slate-400 hidden sm:block">
                          {entry.challengesCompleted} challenges
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn('eco-badge text-[11px]', deptClass)}>
                      {entry.department}
                    </span>
                  </td>

                  {/* XP */}
                  <td className="px-4 py-3 text-right">
                    <span className="eco-xp-chip text-xs whitespace-nowrap">
                      ⚡ {entry.totalXp.toLocaleString()}
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1 text-amber-600">
                      <Award className="w-3.5 h-3.5" />
                      <span className="text-sm font-semibold">{entry.badgeCount}</span>
                    </div>
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <TrendIcon trend={entry.trend} change={entry.rankChange} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
