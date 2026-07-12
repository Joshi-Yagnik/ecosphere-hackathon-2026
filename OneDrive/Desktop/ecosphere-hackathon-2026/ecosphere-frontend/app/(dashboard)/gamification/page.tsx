'use client';

// app/(dashboard)/gamification/page.tsx
// ============================================================
// Gamification Section Landing Page
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Zap, Award, Gift, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useCountUp } from '@/hooks/useCountUp';
import { challenges, badges, rewards, leaderboard } from '@/lib/mock-data/gamification';

// ── Computed stats ────────────────────────────────────────────
const activeChallenges = challenges.filter(c => c.state === 'active').length;
const totalBadges = badges.length;
const availableRewards = rewards.filter(r => r.state === 'available' || r.state === 'limited').length;
const totalXpEarned = leaderboard.reduce((acc, l) => acc + l.totalXp, 0);

// ── Animated stat card ────────────────────────────────────────
function StatCard({ value, label, color, prefix = '' }: { value: number; label: string; color: string; prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useCountUp(value, { decimals: 0, enabled: inView, delay: 200 });

  return (
    <div ref={ref} className="eco-card p-5 flex flex-col gap-1 border-l-4 border-transparent hover:border-orange-500 transition-colors">
      <p className={`text-3xl font-extrabold tabular-nums ${color}`}>
        {prefix}{animated.toLocaleString()}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ── Module cards ──────────────────────────────────────────────
const modules = [
  {
    href: '/gamification/leaderboard',
    icon: Trophy,
    title: 'Leaderboard',
    desc: 'View top sustainability champions and department rankings.',
    badge: 'Live Rankings',
    color: 'text-yellow-600', bg: 'bg-yellow-50',
    accentColor: 'group-hover:text-yellow-700',
  },
  {
    href: '/gamification/challenges',
    icon: Zap,
    title: 'Challenges',
    desc: 'Create and manage gamified sustainability targets.',
    badge: `${activeChallenges} Active`,
    color: 'text-orange-600', bg: 'bg-orange-50',
    accentColor: 'group-hover:text-orange-700',
  },
  {
    href: '/gamification/badges',
    icon: Award,
    title: 'Badges',
    desc: 'Manage achievements and unlock criteria.',
    badge: `${totalBadges} Badges`,
    color: 'text-rose-600', bg: 'bg-rose-50',
    accentColor: 'group-hover:text-rose-700',
  },
  {
    href: '/gamification/rewards',
    icon: Gift,
    title: 'Rewards Store',
    desc: 'Manage items and perks employees can redeem with XP.',
    badge: `${availableRewards} Available`,
    color: 'text-indigo-600', bg: 'bg-indigo-50',
    accentColor: 'group-hover:text-indigo-700',
  }
];

export default function GamificationPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-500" /> Gamification & Rewards
          </h1>
          <p className="eco-page-subtitle">
            Drive employee engagement through challenges, badges, and tangible rewards.
          </p>
        </div>
      </div>

      {/* ── KPI stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={activeChallenges} label="Active Challenges" color="text-orange-600"   />
        <StatCard value={totalBadges}      label="Unlockable Badges" color="text-rose-600"    />
        <StatCard value={availableRewards} label="Rewards in Store"  color="text-indigo-600"    />
        <StatCard value={totalXpEarned}    label="Total XP Earned"   color="text-green-600" prefix="⚡ " />
      </div>

      {/* ── Module cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={mod.href} className="eco-card-hover p-6 flex flex-col h-full group">
                <div className={`w-12 h-12 ${mod.bg} rounded-xl flex items-center justify-center mb-4 shrink-0`}>
                  <Icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <h3 className={`text-base font-bold text-slate-900 transition-colors mb-2 ${mod.accentColor}`}>
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow">{mod.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                    {mod.badge}
                  </span>
                  <ArrowUpRight className={`w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors`} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick insights ───────────────────────────────── */}
      <div className="eco-card p-5 border-l-4 border-orange-500 mt-6">
        <h3 className="eco-section-title mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          Engagement Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500">Most Active Dept</p>
              <p className="font-bold text-slate-900 text-base">Engineering</p>
              <p className="text-xs text-green-600 font-medium">35 active participants</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-slate-500">Top Challenge</p>
              <p className="font-bold text-slate-900 text-base line-clamp-1">Zero Waste Month</p>
              <p className="text-xs text-orange-600 font-medium">142 participants</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500">Most Redeemed Reward</p>
              <p className="font-bold text-slate-900 text-base line-clamp-1">Eco-Store Gift Card</p>
              <p className="text-xs text-slate-400 font-medium">188 times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
