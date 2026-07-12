'use client';

// components/dashboard/CarbonTrendChart.tsx
// ============================================================
// Chart.js Line Chart – Carbon Emissions Trend (monthly)
// ============================================================
import { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cn } from '@/lib/utils';
import {
  carbonLabels,
  carbonScope1,
  carbonScope2,
  carbonScope3,
  carbonTotal,
  carbonTarget,
} from '@/lib/mock-data/dashboard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ViewMode = 'total' | 'by-scope';

const totalDatasets = [
  {
    label: 'Total Emissions',
    data: carbonTotal,
    borderColor: '#16a34a',
    backgroundColor: 'rgba(22,163,74,0.08)',
    borderWidth: 2.5,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#16a34a',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverRadius: 6,
  },
  {
    label: 'Reduction Target',
    data: carbonTarget,
    borderColor: '#f59e0b',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderDash: [6, 4],
    fill: false,
    tension: 0.1,
    pointRadius: 3,
    pointBackgroundColor: '#f59e0b',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverRadius: 5,
  },
];

const scopeDatasets = [
  {
    label: 'Scope 1 – Direct',
    data: carbonScope1,
    borderColor: '#16a34a',
    backgroundColor: 'rgba(22,163,74,0.1)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#16a34a',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverRadius: 5,
  },
  {
    label: 'Scope 2 – Indirect',
    data: carbonScope2,
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#2563eb',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverRadius: 5,
  },
  {
    label: 'Scope 3 – Value Chain',
    data: carbonScope3,
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#7c3aed',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHoverRadius: 5,
  },
];

const baseOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        font: { family: 'Inter', size: 11, weight: 500 },
        color: '#64748b',
        padding: 16,
        boxWidth: 8,
        boxHeight: 8,
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} tCO₂e`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#94a3b8',
      },
    },
    y: {
      grid: {
        color: '#f1f5f9',
        lineWidth: 1,
      },
      border: { display: false, dash: [4, 4] },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#94a3b8',
        callback: (val) => `${val}`,
        maxTicksLimit: 6,
      },
    },
  },
};

export function CarbonTrendChart() {
  const [view, setView] = useState<ViewMode>('total');

  const chartData = {
    labels: carbonLabels,
    datasets: view === 'total' ? totalDatasets : scopeDatasets,
  };

  return (
    <div className="eco-card p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="eco-section-title">Carbon Emissions Trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly CO₂e (tonnes) · Jan–Jul 2026</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
          {(['total', 'by-scope'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-all',
                view === v
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {v === 'total' ? 'Total' : 'By Scope'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-slate-600">Jul total: <strong className="text-slate-900">395 tCO₂e</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-slate-600">vs target: <strong className="text-green-600">-28.5% ✓</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-600">vs Jan: <strong className="text-green-600">-28.4%</strong></span>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0" style={{ height: 220 }}>
        <Line data={chartData} options={baseOptions} />
      </div>
    </div>
  );
}
