'use client';

// app/manager/dashboard/page.tsx
// ============================================================
// Manager Dashboard (Department Specific)
// ============================================================

import { useRef } from 'react';
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
} from 'lucide-react';

import { DateRangeFilter }    from '@/components/dashboard/DateRangeFilter';
import { KpiCard }            from '@/components/dashboard/KpiCard';
import { CarbonTrendChart }   from '@/components/dashboard/CarbonTrendChart';
import { EsgScoreGauge }      from '@/components/dashboard/EsgScoreGauge';
import { LeaderboardTable }   from '@/components/dashboard/LeaderboardTable';
import { ActivityFeed }       from '@/components/dashboard/ActivityFeed';

import { currentKpis, quickStats } from '@/lib/mock-data/dashboard';
import { cn } from '@/lib/utils';

// ── Quick Stat Card ───────────────────────────────────────────
const statIcons: Record<string, React.ElementType> = {
  carbon: Leaf, csr: Activity, issues: AlertCircle,
  engage: Users, challenge: Zap, goals: CheckCircle2,
};
const statColors: Record<string, string> = {
  carbon:    'text-green-600  bg-green-50',
  csr:       'text-blue-600   bg-blue-50',
  issues:    'text-red-600    bg-red-50',
  engage:    'text-violet-600 bg-violet-50',
  challenge: 'text-orange-600 bg-orange-50',
  goals:     'text-teal-600   bg-teal-50',
};

function QuickStatCard({
  stat, index,
}: {
  stat: (typeof quickStats)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const Icon = statIcons[stat.id] ?? Activity;
  const colorClass = statColors[stat.id] ?? 'text-slate-600 bg-slate-50';
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
      <p className="text-[11px] font-medium text-slate-500 leading-tight">Department {stat.label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className={`text-lg font-extrabold tabular-nums ${iconColor}`}>
            {stat.value}
          </span>
          <span className="text-xs text-slate-400 ml-0.5">{stat.unit}</span>
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 text-[10px] font-bold rounded-full px-1.5 py-0.5',
            stat.positive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          )}
        >
          {stat.positive
            ? <ArrowUpRight className="w-2.5 h-2.5" />
            : <ArrowDownRight className="w-2.5 h-2.5" />}
          {stat.delta}
        </span>
      </div>
    </motion.div>
  );
}

// ── KPI card config ───────────────────────────────────────────
const kpiCards = [
  {
    label: 'Department ESG Score',
    key: 'overall',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-700',
    delay: 0,
  },
  {
    label: 'Environmental Score',
    key: 'environmental',
    icon: Leaf,
    gradient: 'from-teal-500 to-green-600',
    delay: 80,
  },
  {
    label: 'Social Score',
    key: 'social',
    icon: Users,
    gradient: 'from-blue-500 to-blue-700',
    delay: 160,
  },
  {
    label: 'Governance Score',
    key: 'governance',
    icon: Shield,
    gradient: 'from-violet-500 to-purple-700',
    delay: 240,
  },

];

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Engineering Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Track your department's ESG performance.</p>
        </div>
      </div>
      {/* ── 1. Header + Date Filter ─────────────────────────── */}
      <DateRangeFilter />

      {/* ── 2. KPI Score Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const kpi = currentKpis[card.key as keyof typeof currentKpis];
          return (
            <KpiCard
              key={card.key}
              label={card.label}
              value={kpi.value}
              unit="/100"
              delta={kpi.delta}
              icon={card.icon}
              gradient={card.gradient}
              delay={card.delay}
            />
          );
        })}
      </div>

      {/* ── 3. Quick Stat Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickStats.map((stat, i) => (
          <QuickStatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* ── 4. Carbon Trend + ESG Gauge ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ minHeight: 340 }}>
        <div className="xl:col-span-2 relative">
          <CarbonTrendChart />
          {/* Overlay to show this is just a dummy dashboard representation for manager */}
          <div className="absolute top-4 right-4 pointer-events-none">
             <span className="text-xs font-bold text-slate-400">Department View</span>
          </div>
        </div>
        <div className="relative">
          <EsgScoreGauge />
        </div>
      </div>

      {/* ── 6. Leaderboard + Activity ───────────────────────── */}
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
