'use client';

// app/employee/dashboard/page.tsx
// ============================================================
// Employee Dashboard (Personal Metrics)
// ============================================================

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

import {
  BarChart3,
  Leaf,
  Users,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Gift,
  Heart,
  TrendingDown,
  CheckSquare,
} from 'lucide-react';

import { DateRangeFilter }    from '@/components/dashboard/DateRangeFilter';
import { KpiCard }            from '@/components/dashboard/KpiCard';
import { CarbonTrendChart }   from '@/components/dashboard/CarbonTrendChart';
import { EsgScoreGauge }      from '@/components/dashboard/EsgScoreGauge';
import { LeaderboardTable }   from '@/components/dashboard/LeaderboardTable';
import { ActivityFeed }       from '@/components/dashboard/ActivityFeed';

import { cn } from '@/lib/utils';
import { mockGetSession } from '@/lib/mock-auth';

// ── Quick Stat Card ───────────────────────────────────────────
function QuickStatCard({
  stat, index,
}: {
  stat: any;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const Icon = stat.icon ?? Activity;
  const colorClass = stat.colorClass ?? 'text-slate-600 bg-slate-50';
  const [iconColor, bgColor] = colorClass.split(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="eco-card p-4 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-[11px] font-medium text-slate-500 leading-tight">{stat.label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className={`text-lg font-extrabold tabular-nums ${iconColor}`}>
            {stat.value}
          </span>
          <span className="text-xs text-slate-400 ml-0.5">{stat.unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function EmployeeDashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(mockGetSession());
  }, []);

  const employeeName = session?.user?.name || 'Employee';

  const kpiCards = [
    {
      label: 'Personal ESG Score',
      value: 82,
      delta: 4.2,
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-700',
      delay: 0,
    },
    {
      label: 'Department Score',
      value: 78,
      delta: 2.1,
      icon: Users,
      gradient: 'from-teal-500 to-green-600',
      delay: 80,
    },
    {
      label: 'XP Earned',
      value: 4820,
      delta: 120,
      icon: Zap,
      gradient: 'from-blue-500 to-blue-700',
      delay: 160,
    },
    {
      label: 'Badges Earned',
      value: 4,
      delta: 1,
      icon: Award,
      gradient: 'from-violet-500 to-purple-700',
      delay: 240,
    },
  ];

  const quickStats = [
    { label: 'Rewards Available', value: '2', icon: Gift, colorClass: 'text-orange-600 bg-orange-50' },
    { label: 'Challenges Joined', value: '3', icon: Zap, colorClass: 'text-blue-600 bg-blue-50' },
    { label: 'CSR Activities', value: '5', icon: Heart, colorClass: 'text-red-600 bg-red-50' },
    { label: 'Carbon Contributions', value: '1.2 tCO₂e', icon: TrendingDown, colorClass: 'text-green-600 bg-green-50' },
    { label: 'Pending Policies', value: '1', icon: CheckSquare, colorClass: 'text-violet-600 bg-violet-50' },
    { label: 'Upcoming Challenges', value: '2', icon: Activity, colorClass: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {employeeName}</h1>
          <p className="text-sm text-slate-500 mt-1">Track your personal ESG performance and achievements.</p>
        </div>
      </div>
      
      <DateRangeFilter />

      {/* ── 2. KPI Score Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            unit={card.label.includes('Score') ? '/100' : ''}
            delta={card.delta}
            icon={card.icon}
            gradient={card.gradient}
            delay={card.delay}
          />
        ))}
      </div>

      {/* ── 3. Quick Stat Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickStats.map((stat, i) => (
          <QuickStatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ── 4. Charts ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ minHeight: 340 }}>
        <div className="xl:col-span-2 relative">
          <CarbonTrendChart />
          <div className="absolute top-4 right-4 pointer-events-none">
             <span className="text-xs font-bold text-slate-400">Personal View</span>
          </div>
        </div>
        <div className="relative">
          <EsgScoreGauge />
          <div className="absolute top-4 right-4 pointer-events-none">
             <span className="text-xs font-bold text-slate-400">Personal Score</span>
          </div>
        </div>
      </div>

      {/* ── 5. Gamification ───────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ minHeight: 440 }}>
        <div className="xl:col-span-2 relative">
          <LeaderboardTable />
        </div>
        <div className="relative">
          <ActivityFeed />
        </div>
      </div>

    </div>
  );
}
