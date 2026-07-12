'use client';

// app/(dashboard)/governance/page.tsx
// ============================================================
// Governance Section Landing Page
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, BookOpen, ClipboardCheck, ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { policies, audits, complianceIssues, policyAcknowledgements } from '@/lib/mock-data/governance';

// ── Computed stats ────────────────────────────────────────────
const activePolicies = policies.filter(p => p.state === 'active').length;
const pendingAudits = audits.filter(a => a.state === 'scheduled' || a.state === 'in_progress').length;
const criticalIssues = complianceIssues.filter(c => c.severity === 'critical' && c.state !== 'resolved').length;
const openIssues = complianceIssues.filter(c => c.state === 'open' || c.state === 'in_progress' || c.state === 'escalated').length;
const overdueAcks = policyAcknowledgements.filter(a => a.isOverdue).length;

// ── Animated stat card ────────────────────────────────────────
function StatCard({ value, label, unit, decimals, color }: { value: number; label: string; unit?: string; decimals?: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useCountUp(value, { decimals: decimals ?? 0, enabled: inView, delay: 200 });

  return (
    <div ref={ref} className="eco-card p-5 flex flex-col gap-1 border-l-4 border-transparent hover:border-violet-500 transition-colors">
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
    href: '/governance/policies',
    icon: BookOpen,
    title: 'Policies',
    desc: 'Manage ESG policies, directives, and mandatory guidelines.',
    badge: `${activePolicies} Active`,
    color: 'text-violet-600', bg: 'bg-violet-50',
    accentColor: 'group-hover:text-violet-700',
  },
  {
    href: '/governance/policy-acknowledgements',
    icon: ShieldCheck,
    title: 'Acknowledgements',
    desc: 'Track employee policy reading and acknowledgement compliance.',
    badge: `${overdueAcks} Overdue`,
    color: 'text-indigo-600', bg: 'bg-indigo-50',
    accentColor: 'group-hover:text-indigo-700',
  },
  {
    href: '/governance/audits',
    icon: ClipboardCheck,
    title: 'Audits',
    desc: 'Schedule and manage internal and external compliance audits.',
    badge: `${pendingAudits} Pending`,
    color: 'text-teal-600', bg: 'bg-teal-50',
    accentColor: 'group-hover:text-teal-700',
  },
  {
    href: '/governance/compliance-issues',
    icon: ShieldAlert,
    title: 'Compliance Issues',
    desc: 'Risk register for tracking compliance gaps, findings and resolutions.',
    badge: `${openIssues} Open`,
    color: 'text-rose-600', bg: 'bg-rose-50',
    accentColor: 'group-hover:text-rose-700',
  }
];

export default function GovernancePage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-600" /> Governance
          </h1>
          <p className="eco-page-subtitle">
            Maintain organizational integrity through robust policy management, audits, and risk tracking.
          </p>
        </div>
      </div>

      {/* ── KPI stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={activePolicies} label="Active Policies"                 decimals={0} color="text-violet-600"   />
        <StatCard value={pendingAudits}  label="Upcoming/Ongoing Audits"         decimals={0} color="text-blue-600"    />
        <StatCard value={openIssues}     label="Open Compliance Issues"          decimals={0} color="text-amber-600"    />
        <StatCard value={criticalIssues} label="Critical Risks"                  decimals={0} color="text-red-600" />
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
                  <span className={cn(
                    'text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md',
                    mod.badge.includes('Overdue') || mod.badge.includes('Open') && parseInt(mod.badge) > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  )}>{mod.badge}</span>
                  <ArrowUpRight className={`w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors`} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick insights ───────────────────────────────── */}
      <div className="eco-card p-5 border-l-4 border-violet-500">
        <h3 className="eco-section-title mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-600" />
          Governance Posture (Q3 2026)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Policy Compliance</p>
            <p className="font-semibold text-green-600">📈 92% Ack. Rate</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Audit Performance</p>
            <p className="font-semibold text-slate-900">Average Score: 85/100</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-500">Top Risk Area</p>
            <p className="font-semibold text-red-600">⚠️ Data Privacy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
