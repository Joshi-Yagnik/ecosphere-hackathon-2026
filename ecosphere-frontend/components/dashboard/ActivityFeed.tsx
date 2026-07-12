'use client';

// components/dashboard/ActivityFeed.tsx
// ============================================================
// Recent Activity timeline feed
// ============================================================
import { motion } from 'framer-motion';
import {
  Leaf, ShieldAlert, Heart, Award, AlertTriangle, FileText, Zap, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentActivities } from '@/lib/mock-data/dashboard';
import type { RecentActivity } from '@/types';

// ── Per-type config ───────────────────────────────────────────
const typeConfig: Record<
  RecentActivity['type'],
  { icon: React.ElementType; bg: string; text: string; border: string }
> = {
  carbon:     { icon: Leaf,          bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200' },
  csr:        { icon: Heart,         bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200'  },
  policy:     { icon: FileText,      bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200'},
  badge:      { icon: Award,         bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200' },
  compliance: { icon: AlertTriangle, bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200'   },
  audit:      { icon: ShieldAlert,   bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200' },
  challenge:  { icon: Zap,           bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200'},
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ActivityFeed() {
  return (
    <div className="eco-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="eco-section-title flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
        </div>
        <button className="text-xs text-green-600 font-semibold hover:text-green-700 transition-colors">
          View all →
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
        {recentActivities.map((activity, i) => {
          const cfg = typeConfig[activity.type] ?? typeConfig.policy;
          const Icon = cfg.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer',
                'hover:bg-slate-50',
                cfg.border,
                'bg-white'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                  cfg.bg
                )}
              >
                <Icon className={cn('w-4 h-4', cfg.text)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400">{activity.user}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-400">{relativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
