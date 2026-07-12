'use client';

// components/dashboard/KpiCard.tsx
// ============================================================
// Animated gradient KPI score card
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  delta: number;
  icon: React.ElementType;
  gradient: string;      // e.g. "from-green-500 to-emerald-700"
  delay?: number;
}

function TrendBadge({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="flex items-center gap-1 text-white/90 text-xs font-semibold">
        <TrendingUp className="w-3.5 h-3.5" />
        +{delta.toFixed(1)} pts
      </span>
    );
  if (delta < 0)
    return (
      <span className="flex items-center gap-1 text-white/70 text-xs font-semibold">
        <TrendingDown className="w-3.5 h-3.5" />
        {delta.toFixed(1)} pts
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-white/70 text-xs font-semibold">
      <Minus className="w-3.5 h-3.5" />
      No change
    </span>
  );
}

export function KpiCard({ label, value, unit, delta, icon: Icon, gradient, delay = 0 }: KpiCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const animatedValue = useCountUp(value, { decimals: 1, enabled: isInView, delay });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      {/* Background orbs */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-3 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-white/80 mb-1">{label}</p>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums">
            {animatedValue.toFixed(1)}
          </span>
          {unit && (
            <span className="text-lg font-semibold text-white/60">{unit}</span>
          )}
        </div>

        {/* Progress bar (value out of 100) */}
        <div className="h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-white/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isInView ? `${value}%` : '0%' }}
            transition={{ duration: 1.2, delay: (delay + 300) / 1000, ease: 'easeOut' }}
          />
        </div>

        {/* Trend */}
        <TrendBadge delta={delta} />
      </div>
    </motion.div>
  );
}
