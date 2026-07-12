'use client';

// app/(dashboard)/social/page.tsx
// ============================================================
// Social Section Landing Page
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, ArrowUpRight, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCountUp } from '@/hooks/useCountUp';
import { csrActivities, employeeParticipations } from '@/lib/mock-data/social';

// ── Computed stats ────────────────────────────────────────────
const approvedCsr = csrActivities.filter((a) => a.state === 'approved').length;
const pendingCsr = csrActivities.filter((a) => a.state === 'submitted').length;
const totalVolunteerHours = employeeParticipations.filter(p => p.state === 'approved').reduce((sum, p) => sum + p.hoursContributed, 0);
const totalParticipants = csrActivities.filter(a => a.state === 'approved').reduce((sum, a) => sum + a.participantCount, 0);

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
    href: '/social/csr-activities',
    icon: Heart,
    title: 'CSR Activities',
    desc: 'Manage corporate social responsibility events, from planning to approval.',
    badge: `${pendingCsr} Pending Approval`,
    color: 'text-rose-600', bg: 'bg-rose-50',
    accentColor: 'group-hover:text-rose-700',
  },
  {
    href: '/social/employee-participation',
    icon: Users,
    title: 'Employee Participation',
    desc: 'Track individual volunteer hours and verify employee contributions.',
    badge: `${employeeParticipations.filter(p => p.state === 'pending').length} Actions Required`,
    color: 'text-blue-600', bg: 'bg-blue-50',
    accentColor: 'group-hover:text-blue-700',
  }
];

export default function SocialPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Social
          </h1>
          <p className="eco-page-subtitle">
            Manage corporate social responsibility initiatives, employee volunteering, and community impact.
          </p>
        </div>
      </div>

      {/* ── KPI stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={approvedCsr}       label="Approved CSR Events"                 decimals={0} color="text-blue-600"   />
        <StatCard value={totalParticipants} label="Total Participants"                  decimals={0} color="text-green-600"    />
        <StatCard value={totalVolunteerHours} label="Volunteer Hours" unit="h"          decimals={0} color="text-teal-600"    />
        <StatCard value={85}                label="Employee Engagement" unit="%"        decimals={1} color="text-violet-600" />
      </div>

      {/* ── Module cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <span className="eco-badge-blue text-xs">{mod.badge}</span>
                  <ArrowUpRight className={`w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors`} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick insights ───────────────────────────────── */}
      <div className="eco-card p-5 border-l-4 border-blue-500">
        <h3 className="eco-section-title mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Community Impact Snapshot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Top cause this quarter</p>
            <p className="font-semibold text-slate-900">📚 Education (3 events)</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Most active department</p>
            <p className="font-semibold text-blue-600">🏆 Engineering (48 hours)</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Next major event</p>
            <p className="font-semibold text-slate-900">Blood Donation Drive (Jul 15)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
