'use client';

// app/(dashboard)/environmental/page.tsx
// ============================================================
// Environmental Section Landing Page
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, Factory, Activity, Target, TrendingDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCountUp } from '@/hooks/useCountUp';
import { carbonTransactions, environmentalGoals, emissionFactors } from '@/lib/mock-data/environmental';

// ── Computed stats ────────────────────────────────────────────
const totalCo2   = carbonTransactions.filter((c) => c.state === 'confirmed').reduce((s, c) => s + c.co2Equivalent, 0);
const activeGoals= environmentalGoals.filter((g) => g.state === 'active').length;
const achievedGoals = environmentalGoals.filter((g) => g.state === 'achieved').length;
const activeFactors = emissionFactors.filter((e) => e.active).length;

// ── Animated stat card ────────────────────────────────────────
function StatCard({ value, label, unit, decimals, color }: { value: number; label: string; unit?: string; decimals?: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useCountUp(value, { decimals: decimals ?? 0, enabled: inView, delay: 200 });

  return (
    <div ref={ref} className="eco-card p-5 flex flex-col gap-1">
      <p className={`text-3xl font-extrabold tabular-nums ${color}`}>
        {animated.toFixed(decimals ?? 0)}{unit}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ── Module cards ──────────────────────────────────────────────
const modules = [
  {
    href: '/environmental/emission-factors',
    icon: Factory,
    title: 'Emission Factors',
    desc: 'Manage GHG conversion factors for all activity types.',
    badge: `${activeFactors} Active Factors`,
    color: 'text-teal-600', bg: 'bg-teal-50',
    accentColor: 'group-hover:text-teal-700',
  },
  {
    href: '/environmental/carbon-transactions',
    icon: Activity,
    title: 'Carbon Transactions',
    desc: 'Log, confirm and track all carbon emission entries.',
    badge: `${carbonTransactions.length} Total Entries`,
    color: 'text-green-600', bg: 'bg-green-50',
    accentColor: 'group-hover:text-green-700',
  },
  {
    href: '/environmental/goals',
    icon: Target,
    title: 'Environmental Goals',
    desc: 'Track progress on sustainability targets and commitments.',
    badge: `${achievedGoals}/${environmentalGoals.length} Achieved`,
    color: 'text-emerald-600', bg: 'bg-emerald-50',
    accentColor: 'group-hover:text-emerald-700',
  },
];

export default function EnvironmentalPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" /> Environmental
          </h1>
          <p className="eco-page-subtitle">
            Measure and manage your organization's carbon footprint and environmental commitments.
          </p>
        </div>
      </div>

      {/* ── KPI stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={totalCo2}       label="Total CO₂e (Jul 2026)"  unit=" t"  decimals={1} color="text-green-600"   />
        <StatCard value={activeFactors}  label="Active Emission Factors"              decimals={0} color="text-teal-600"    />
        <StatCard value={activeGoals}    label="Goals In Progress"                    decimals={0} color="text-blue-600"    />
        <StatCard value={achievedGoals}  label="Goals Achieved"                       decimals={0} color="text-emerald-600" />
      </div>

      {/* ── Module cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={mod.href} className="eco-card-hover p-6 block group">
                <div className={`w-12 h-12 ${mod.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <h3 className={`text-base font-bold text-slate-900 transition-colors mb-2 ${mod.accentColor}`}>
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{mod.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="eco-badge-green text-xs">{mod.badge}</span>
                  <ArrowUpRight className={`w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors`} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick insights ───────────────────────────────── */}
      <div className="eco-card p-5 eco-pillar-env">
        <h3 className="eco-section-title mb-4 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-600" />
          July 2026 Snapshot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Best performing dept</p>
            <p className="font-semibold text-slate-900">🏆 Engineering (82 pts)</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">vs Jan 2026 baseline</p>
            <p className="font-semibold text-green-600">↓ 28.4% carbon reduction</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Next milestone</p>
            <p className="font-semibold text-slate-900">Scope 2 ≤ 60t by Sep 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
