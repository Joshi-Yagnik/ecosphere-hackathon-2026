'use client';

// components/dashboard/EmissionScopeDonut.tsx
// ============================================================
// Doughnut – Emission breakdown by GHG Scope (Jul 2026)
// ============================================================
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { emissionByScope } from '@/lib/mock-data/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

const total = emissionByScope.values.reduce((a, b) => a + b, 0);

const centerPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.[0]) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { x, y } = meta.data[0] as any;
    ctx.save();
    ctx.font = "800 26px 'Inter', sans-serif";
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${total}`, x, y - 8);
    ctx.font = "500 10px 'Inter', sans-serif";
    ctx.fillStyle = '#64748b';
    ctx.fillText('tCO₂e total', x, y + 12);
    ctx.restore();
  },
};

const chartData = {
  labels: emissionByScope.labels,
  datasets: [
    {
      data: emissionByScope.values,
      backgroundColor: emissionByScope.colors,
      hoverBackgroundColor: ['#15803d', '#1d4ed8', '#6d28d9'],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 6,
    },
  ],
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => {
          const pct = ((ctx.parsed / total) * 100).toFixed(1);
          return ` ${ctx.parsed} tCO₂e (${pct}%)`;
        },
      },
    },
  },
};

export function EmissionScopeDonut() {
  return (
    <div className="eco-card p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="eco-section-title">Emissions by GHG Scope</h3>
        <p className="text-xs text-slate-400 mt-0.5">July 2026 · tCO₂e</p>
      </div>

      {/* Donut */}
      <div className="flex justify-center" style={{ height: 180 }}>
        <Doughnut data={chartData} options={options} plugins={[centerPlugin]} />
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2.5">
        {emissionByScope.labels.map((label, i) => {
          const value = emissionByScope.values[i];
          const pct = ((value / total) * 100).toFixed(1);
          return (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: emissionByScope.colors[i] }}
              />
              <span className="text-xs text-slate-600 flex-1 leading-tight">{label}</span>
              <span className="text-xs text-slate-400">{pct}%</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums w-16 text-right">
                {value} t
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
