'use client';

// components/dashboard/EsgScoreGauge.tsx
// ============================================================
// Doughnut chart – ESG Score Gauge with center text plugin
// ============================================================
import { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type Plugin,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useCountUp } from '@/hooks/useCountUp';
import { currentKpis, esgPillarWeights } from '@/lib/mock-data/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

// ── Custom center-text plugin ─────────────────────────────────
function makeCenterPlugin(score: number, label: string): Plugin<'doughnut'> {
  return {
    id: 'centerText',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta?.data?.[0]) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { x, y } = meta.data[0] as any;
      ctx.save();

      // Score number
      ctx.font = "800 32px 'Inter', sans-serif";
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(score.toFixed(1), x, y - 10);

      // Label
      ctx.font = "500 11px 'Inter', sans-serif";
      ctx.fillStyle = '#64748b';
      ctx.fillText(label, x, y + 16);

      ctx.restore();
    },
  };
}

const ENV   = currentKpis.environmental.value;
const SOC   = currentKpis.social.value;
const GOV   = currentKpis.governance.value;
const TOTAL = currentKpis.overall.value;

const doughnutData = {
  labels: ['Environmental', 'Social', 'Governance'],
  datasets: [
    {
      data: [
        ENV  * esgPillarWeights.environmental,
        SOC  * esgPillarWeights.social,
        GOV  * esgPillarWeights.governance,
      ],
      backgroundColor: ['#16a34a', '#2563eb', '#7c3aed'],
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
  cutout: '72%',
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
          const pillarScores = [ENV, SOC, GOV];
          return ` Score: ${pillarScores[ctx.dataIndex].toFixed(1)}/100`;
        },
      },
    },
  },
};

const pillarDetails = [
  { label: 'Environmental', value: ENV,  color: '#16a34a', bg: 'bg-green-50',  text: 'text-green-700',  weight: '40%' },
  { label: 'Social',        value: SOC,  color: '#2563eb', bg: 'bg-blue-50',   text: 'text-blue-700',   weight: '35%' },
  { label: 'Governance',    value: GOV,  color: '#7c3aed', bg: 'bg-violet-50', text: 'text-violet-700', weight: '25%' },
];

export function EsgScoreGauge() {
  const centerPlugin = makeCenterPlugin(TOTAL, 'Overall ESG');

  return (
    <div className="eco-card p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="eco-section-title">ESG Score Breakdown</h3>
        <p className="text-xs text-slate-400 mt-0.5">Weighted pillar scores · Jul 2026</p>
      </div>

      {/* Donut */}
      <div className="flex justify-center" style={{ height: 200 }}>
        <Doughnut
          data={doughnutData}
          options={options}
          plugins={[centerPlugin]}
        />
      </div>

      {/* Pillar legend */}
      <div className="mt-4 space-y-2">
        {pillarDetails.map((p) => (
          <div key={p.label} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-sm text-slate-600 flex-1">{p.label}</span>
            <span className="text-[10px] text-slate-400">{p.weight}</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums w-12 text-right">
              {p.value.toFixed(1)}
            </span>
            <div className="w-20 eco-progress-bar">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${p.value}%`, backgroundColor: p.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Score grade badge */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">Overall Grade</span>
        <span className="eco-badge-green text-sm font-bold px-3 py-1">
          B+ · Good Performance
        </span>
      </div>
    </div>
  );
}
