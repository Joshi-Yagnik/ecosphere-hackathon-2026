'use client';

// components/dashboard/DateRangeFilter.tsx
// ============================================================
// Date range tab filter + period display
// ============================================================
import { useState } from 'react';
import { cn, exportToCsv } from '@/lib/utils';
import { CalendarDays, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

type Period = 'month' | 'q3' | 'ytd' | 'all';

const periods: { id: Period; label: string }[] = [
  { id: 'month', label: 'This Month' },
  { id: 'q3',    label: 'Q3 2026'    },
  { id: 'ytd',   label: 'YTD 2026'   },
  { id: 'all',   label: 'All Time'   },
];

const periodLabels: Record<Period, string> = {
  month: 'July 2026',
  q3:    'Jul – Sep 2026',
  ytd:   'Jan – Jul 2026',
  all:   'All Time',
};

interface DateRangeFilterProps {
  onPeriodChange?: (period: Period) => void;
}

export function DateRangeFilter({ onPeriodChange }: DateRangeFilterProps) {
  const [active, setActive] = useState<Period>('ytd');
  const [refreshing, setRefreshing] = useState(false);

  const handlePeriod = (p: Period) => {
    setActive(p);
    onPeriodChange?.(p);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExport = () => {
    const headers = ['Metric', 'Value', 'Pillar', 'Period'];
    const rows = [
      ['Overall ESG Score', '84.2', 'Consolidated', periodLabels[active]],
      ['Environmental Score', '85.4', 'Environmental', periodLabels[active]],
      ['Social Score', '83.1', 'Social', periodLabels[active]],
      ['Governance Score', '84.0', 'Governance', periodLabels[active]],
      ['July Carbon Emissions', '1284 tCO2e', 'Environmental', periodLabels[active]],
      ['July CSR Activities', '47', 'Social', periodLabels[active]],
      ['Compliance Issues Active', '3', 'Governance', periodLabels[active]],
    ];
    exportToCsv(`ecosphere_dashboard_summary_${active}.csv`, headers, rows);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Left: title + period indicator */}
      <div>
        <h1 className="eco-page-title">ESG Dashboard</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm text-slate-500">{periodLabels[active]}</span>
          <span className="eco-badge-green text-xs">● Live</span>
        </div>
      </div>

      {/* Right: tabs + actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Period tabs */}
        <div className="relative flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePeriod(p.id)}
              className={cn(
                'relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10',
                active === p.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {active === p.id && (
                <motion.span
                  layoutId="period-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors',
            refreshing && 'animate-spin text-green-600'
          )}
          title="Refresh data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Export */}
        <button onClick={handleExport} className="eco-btn-primary text-xs px-3 py-2 gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
