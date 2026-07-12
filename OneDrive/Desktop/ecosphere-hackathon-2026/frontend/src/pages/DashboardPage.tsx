// src/pages/DashboardPage.tsx
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Leaf, Users, Shield, Trophy, TrendingUp, BarChart3,
  AlertCircle, Activity, CheckCircle2, ArrowUpRight, Zap,
} from 'lucide-react';

const kpis = [
  { id: 'esg-score', label: 'Overall ESG Score', value: '74.2', unit: '/100', delta: '+3.1', trend: 'up', icon: BarChart3, bg: 'from-green-500 to-emerald-600', iconBg: 'bg-white/20' },
  { id: 'env', label: 'Environmental Score', value: '68.5', unit: '/100', delta: '+5.2', trend: 'up', icon: Leaf, bg: 'from-teal-500 to-green-600', iconBg: 'bg-white/20' },
  { id: 'social', label: 'Social Score', value: '81.3', unit: '/100', delta: '+1.8', trend: 'up', icon: Users, bg: 'from-blue-500 to-blue-700', iconBg: 'bg-white/20' },
  { id: 'governance', label: 'Governance Score', value: '72.9', unit: '/100', delta: '-0.4', trend: 'down', icon: Shield, bg: 'from-violet-500 to-purple-700', iconBg: 'bg-white/20' },
];

const stats = [
  { label: 'Carbon Emissions', value: '1,284 tCO₂e', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'CSR Activities', value: '47 this month', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Open Compliance Issues', value: '3 critical', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Employee Participation', value: '89.3%', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Challenges Active', value: '12 running', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Goals Achieved', value: '8 / 14', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const leaderboard = [
  { rank: 1, name: 'Priya Sharma', dept: 'Engineering', xp: 4820, badge: '🏆' },
  { rank: 2, name: 'Rahul Mehta', dept: 'Operations', xp: 4210, badge: '🥈' },
  { rank: 3, name: 'Sneha Patel', dept: 'HR', xp: 3980, badge: '🥉' },
  { rank: 4, name: 'Arun Kumar', dept: 'Finance', xp: 3560, badge: '' },
  { rank: 5, name: 'Divya Nair', dept: 'Marketing', xp: 3120, badge: '' },
];

const recentActivities = [
  { icon: '🌱', text: 'Carbon transaction logged by Operations dept', time: '5m ago' },
  { icon: '🏅', text: 'Priya S. earned "Carbon Neutral Hero" badge', time: '1h ago' },
  { icon: '📋', text: 'Q2 CSR Activity "Tree Plantation" approved', time: '3h ago' },
  { icon: '⚠️', text: 'Compliance issue CI-2026-003 marked overdue', time: '5h ago' },
  { icon: '🎯', text: 'Environmental Goal EG-2026-0012 achieved', time: '1d ago' },
  { icon: '🔖', text: 'Data Privacy Policy v2.1 published', time: '2d ago' },
];

const departments = [
  { name: 'Engineering', score: 82, color: 'bg-green-500' },
  { name: 'HR', score: 78, color: 'bg-blue-500' },
  { name: 'Operations', score: 71, color: 'bg-teal-500' },
  { name: 'Finance', score: 65, color: 'bg-violet-500' },
  { name: 'Marketing', score: 60, color: 'bg-orange-500' },
];

const containerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariants: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title">ESG Dashboard</h1>
          <p className="eco-page-subtitle">Welcome back, Admin — here's your sustainability overview for <strong>July 2026</strong></p>
        </div>
        <div className="flex items-center gap-2">
          <span className="eco-badge-green"><CheckCircle2 className="w-3 h-3" />Live Data</span>
          <button className="eco-btn-primary"><ArrowUpRight className="w-4 h-4" />Export Report</button>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.id} variants={cardVariants} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${kpi.bg} p-5 text-white shadow-lg`}>
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative">
                <div className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
                <p className="text-sm font-medium text-white/80">{kpi.label}</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-bold">{kpi.value}</span>
                  <span className="text-base font-medium text-white/70 mb-0.5">{kpi.unit}</span>
                </div>
                <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${kpi.trend === 'up' ? 'text-white' : 'text-white/60'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${kpi.trend !== 'up' && 'rotate-180'}`} />
                  <span>{kpi.delta} vs last month</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={cardVariants} className="eco-card p-4 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}><Icon className={`w-4 h-4 ${stat.color}`} /></div>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">{stat.label}</p>
              <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 eco-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="eco-section-title">Carbon Emissions Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly CO₂e emissions (tonnes)</p>
            </div>
            <span className="eco-badge-green text-xs">Jan – Jul 2026</span>
          </div>
          <div className="h-56 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center border border-green-100">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <p className="text-sm text-green-600 font-medium">Carbon Trend Chart</p>
              <p className="text-xs text-green-400 mt-1">Live data from Supabase</p>
            </div>
          </div>
        </div>

        <div className="eco-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="eco-section-title flex items-center gap-2"><Trophy className="w-4 h-4 text-orange-500" />XP Leaderboard</h3>
            <button className="text-xs text-green-600 font-medium hover:text-green-700">View all →</button>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="shrink-0 w-6 text-center">
                  {entry.badge ? <span className="text-base">{entry.badge}</span> : <span className="text-xs font-bold text-slate-400">#{entry.rank}</span>}
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                  {entry.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{entry.name}</p>
                  <p className="text-xs text-slate-400 truncate">{entry.dept}</p>
                </div>
                <span className="eco-xp-chip shrink-0">⚡ {entry.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="eco-card p-5">
          <h3 className="eco-section-title mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" />Department ESG Rankings</h3>
          <div className="space-y-4">
            {departments.map((dept, i) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="shrink-0 w-5 text-xs font-semibold text-slate-400 text-right">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-800">{dept.name}</span>
                    <span className="text-slate-500 font-semibold">{dept.score}/100</span>
                  </div>
                  <div className="eco-progress-bar"><div className={`h-full ${dept.color} rounded-full transition-all duration-700`} style={{ width: `${dept.score}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="eco-card p-5">
          <h3 className="eco-section-title mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" />Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-lg shrink-0 mt-0.5">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
