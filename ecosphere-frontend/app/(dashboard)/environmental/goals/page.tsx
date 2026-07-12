'use client';

// app/(dashboard)/environmental/goals/page.tsx
// ============================================================
// Environmental Goals – Progress Card Grid
// ============================================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Target, CheckCircle2, AlertTriangle, Clock,
  Trophy, XCircle, Calendar, User, ChevronRight,
} from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { environmentalGoals as initialGoals } from '@/lib/mock-data/environmental';
import { departmentScores } from '@/lib/mock-data/dashboard';
import type { EnvironmentalGoal } from '@/types';
import { cn } from '@/lib/utils';

// ── State config ──────────────────────────────────────────────
const stateConfig = {
  draft:    { label: 'Draft',    icon: Clock,        bg: 'bg-slate-100',   text: 'text-slate-600',  border: 'border-slate-200', headerBg: 'bg-slate-50'  },
  active:   { label: 'Active',   icon: Target,       bg: 'bg-blue-50',     text: 'text-blue-700',   border: 'border-blue-200',  headerBg: 'bg-blue-50'   },
  achieved: { label: 'Achieved', icon: CheckCircle2, bg: 'bg-green-50',    text: 'text-green-700',  border: 'border-green-200', headerBg: 'bg-green-50'  },
  missed:   { label: 'Missed',   icon: XCircle,      bg: 'bg-red-50',      text: 'text-red-700',    border: 'border-red-200',   headerBg: 'bg-red-50'    },
};

const priorityLabel: Record<string, { label: string; color: string }> = {
  '2': { label: 'High',   color: 'text-red-600    bg-red-50    border-red-200'    },
  '1': { label: 'Medium', color: 'text-amber-600  bg-amber-50  border-amber-100'  },
  '0': { label: 'Low',    color: 'text-slate-500  bg-slate-100 border-slate-200'  },
};

// Progress bar color by percent
function progressColor(pct: number, state: string) {
  if (state === 'achieved') return 'bg-green-500';
  if (state === 'missed')   return 'bg-red-400';
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 50) return 'bg-amber-400';
  return 'bg-orange-500';
}

// ── Goal Card ─────────────────────────────────────────────────
function GoalCard({ goal, onView }: { goal: EnvironmentalGoal; onView: (g: EnvironmentalGoal) => void }) {
  const cfg = stateConfig[goal.state as keyof typeof stateConfig] ?? stateConfig.draft;
  const StateIcon = cfg.icon;
  const pct = Math.min(goal.progress, 100);
  const pri = priorityLabel[goal.priority] ?? priorityLabel['0'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'eco-card flex flex-col overflow-hidden hover:shadow-md transition-all cursor-pointer group',
        goal.isOverdue && 'ring-1 ring-red-200'
      )}
      onClick={() => onView(goal)}
    >
      {/* Top color band by state */}
      <div className={cn('px-4 py-3 flex items-center justify-between', cfg.headerBg)}>
        <span className="font-mono text-xs text-slate-500">{goal.reference}</span>
        <div className="flex items-center gap-2">
          {goal.isOverdue && (
            <span className="eco-badge-red text-[10px] flex items-center gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" /> Overdue
            </span>
          )}
          <span className={cn('eco-badge border text-[11px] flex items-center gap-1', cfg.bg, cfg.text, cfg.border)}>
            <StateIcon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Goal name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug">
            {goal.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors shrink-0 mt-0.5" />
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {goal.department}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {goal.deadline}
            {goal.daysRemaining > 0 && (
              <span className={cn(
                'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                goal.daysRemaining > 30 ? 'bg-green-100 text-green-700'
                  : goal.daysRemaining > 10 ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              )}>
                {goal.daysRemaining}d left
              </span>
            )}
          </span>
          <span className={cn('eco-badge border text-[10px]', pri.color)}>{pri.label}</span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Progress</span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">{pct.toFixed(1)}%</span>
          </div>
          <div className="eco-progress-bar">
            <motion.div
              className={cn('h-full rounded-full', progressColor(pct, goal.state))}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>

        {/* Target vs current */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Current: <strong className="text-slate-900">{goal.currentValue} {goal.unit}</strong>
          </span>
          <span>
            Target: <strong className="text-slate-900">{goal.targetValue} {goal.unit}</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function EnvironmentalGoalsPage() {
  const [goals, setGoals]         = useState<EnvironmentalGoal[]>(initialGoals);
  const [search, setSearch]       = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [deptFilter, setDeptFilter]   = useState('all');
  const [viewGoal, setViewGoal]   = useState<EnvironmentalGoal | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', departmentId: 'd1', category: 'Carbon', targetValue: 0, unit: 'tCO₂e', deadline: '', priority: '1', responsiblePerson: '' });
  const [saving, setSaving]       = useState(false);

  const depts = [...new Set(goals.map((g) => g.department))].sort();

  const filtered = useMemo(() => {
    return goals.filter((g) => {
      const q = search.toLowerCase();
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.reference.toLowerCase().includes(q) || g.department.toLowerCase().includes(q);
      const matchState  = stateFilter === 'all' || g.state === stateFilter;
      const matchDept   = deptFilter  === 'all' || g.department === deptFilter;
      return matchSearch && matchState && matchDept;
    });
  }, [goals, search, stateFilter, deptFilter]);

  const stats = {
    total:    goals.length,
    active:   goals.filter((g) => g.state === 'active').length,
    achieved: goals.filter((g) => g.state === 'achieved').length,
    missed:   goals.filter((g) => g.state === 'missed').length,
    overdue:  goals.filter((g) => g.isOverdue).length,
  };

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      const dept = departmentScores.find((d) => d.id === form.departmentId);
      const newGoal: EnvironmentalGoal = {
        id: `eg${Date.now()}`,
        reference: `EG-2026-${String(goals.length + 1).padStart(3, '0')}`,
        name: form.name,
        department: dept?.name ?? 'All Departments',
        departmentId: form.departmentId,
        category: form.category,
        targetValue: form.targetValue,
        currentValue: 0,
        unit: form.unit,
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        deadline: form.deadline,
        daysRemaining: form.deadline
          ? Math.max(0, Math.round((new Date(form.deadline).getTime() - Date.now()) / 86400000))
          : 0,
        responsiblePerson: form.responsiblePerson,
        state: 'draft',
        isOverdue: false,
        priority: form.priority as any,
      };
      setGoals((prev) => [newGoal, ...prev]);
      setAddModalOpen(false);
      setSaving(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" /> Environmental Goals
          </h1>
          <p className="eco-page-subtitle">Track progress on environmental targets and sustainability commitments.</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="eco-btn-primary text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Goal
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Goals',     value: stats.total,    icon: Target,       color: 'text-slate-700 bg-slate-100' },
          { label: 'Active',          value: stats.active,   icon: Target,       color: 'text-blue-700  bg-blue-50'   },
          { label: 'Achieved ✓',      value: stats.achieved, icon: Trophy,       color: 'text-green-700 bg-green-50'  },
          { label: 'Missed / Overdue',value: stats.missed + stats.overdue, icon: AlertTriangle, color: 'text-red-700 bg-red-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const [text, bg] = stat.color.split(' ');
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="eco-card p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${text}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search goals…" className="eco-input pl-9 text-sm" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All States</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="achieved">Achieved</option>
            <option value="missed">Missed</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="eco-input w-auto text-sm cursor-pointer">
            <option value="all">All Departments</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ── Goal Cards ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="eco-card p-12 flex flex-col items-center justify-center text-center gap-3">
          <span className="text-3xl">🎯</span>
          <p className="text-slate-400 text-sm">No goals match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onView={setViewGoal} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── View Goal Detail Modal ───────────────────────── */}
      <Modal
        open={!!viewGoal}
        onClose={() => setViewGoal(null)}
        title={viewGoal?.name ?? ''}
        subtitle={viewGoal?.reference}
        size="md"
        footer={<button onClick={() => setViewGoal(null)} className="eco-btn-secondary text-sm">Close</button>}
      >
        {viewGoal && (
          <div className="space-y-3 text-sm">
            {/* Progress */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium">Progress</span>
                <span className="text-lg font-extrabold text-slate-900">{viewGoal.progress.toFixed(1)}%</span>
              </div>
              <div className="eco-progress-bar h-3">
                <div
                  className={cn('h-full rounded-full', progressColor(viewGoal.progress, viewGoal.state))}
                  style={{ width: `${Math.min(viewGoal.progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Current: {viewGoal.currentValue} {viewGoal.unit}</span>
                <span>Target: {viewGoal.targetValue} {viewGoal.unit}</span>
              </div>
            </div>

            {[
              ['Department', viewGoal.department],
              ['Category', viewGoal.category],
              ['Responsible', viewGoal.responsiblePerson],
              ['Start Date', viewGoal.startDate],
              ['Deadline', viewGoal.deadline],
              ['Days Remaining', viewGoal.daysRemaining > 0 ? `${viewGoal.daysRemaining} days` : viewGoal.state === 'achieved' ? '✓ Completed' : 'Overdue'],
              ['Priority', priorityLabel[viewGoal.priority]?.label ?? 'Low'],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-900 font-semibold">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Add Goal Modal ───────────────────────────────── */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Environmental Goal"
        subtitle="Set a new sustainability target for tracking."
        size="md"
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name || !form.targetValue || !form.deadline || saving} className="eco-btn-primary text-sm min-w-[100px]">
              {saving ? 'Creating…' : 'Create Goal'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Goal Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Reduce Carbon by 20%" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="eco-input cursor-pointer">
                {departmentScores.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                {['Carbon','Energy','Water','Waste','Fuel','Travel','Material','Biodiversity','Compliance'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target Value <span className="text-red-500">*</span></label>
              <input type="number" value={form.targetValue || ''} onChange={(e) => setForm((f) => ({ ...f, targetValue: parseFloat(e.target.value) || 0 }))} placeholder="0" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
              <input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="tCO₂e, %, pieces…" className="eco-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Deadline <span className="text-red-500">*</span></label>
              <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="eco-input cursor-pointer">
                <option value="2">High</option>
                <option value="1">Medium</option>
                <option value="0">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Responsible Person</label>
            <input value={form.responsiblePerson} onChange={(e) => setForm((f) => ({ ...f, responsiblePerson: e.target.value }))} placeholder="Name of responsible person" className="eco-input" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
