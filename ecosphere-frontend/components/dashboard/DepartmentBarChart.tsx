'use client';

// components/dashboard/DepartmentBarChart.tsx
// ============================================================
// Horizontal Bar Chart – Department ESG Score Rankings
// ============================================================
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { departmentScores } from '@/lib/mock-data/dashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Color by score range
function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 65) return '#f59e0b';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

const sorted = [...departmentScores].sort((a, b) => a.esgScore - b.esgScore);

const chartData = {
  labels: sorted.map((d) => d.name),
  datasets: [
    {
      label: 'ESG Score',
      data: sorted.map((d) => d.esgScore),
      backgroundColor: sorted.map((d) => scoreColor(d.esgScore)),
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 22,
    },
  ],
};

const options: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx) => ` ESG Score: ${ctx.parsed.x}/100`,
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: 100,
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#94a3b8',
        callback: (val) => `${val}`,
        maxTicksLimit: 6,
      },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 12, weight: 500 },
        color: '#475569',
      },
    },
  },
};

export function DepartmentBarChart() {
  return (
    <div className="eco-card p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="eco-section-title">Department ESG Rankings</h3>
        <p className="text-xs text-slate-400 mt-0.5">Overall score out of 100</p>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {[
          { label: 'Excellent (80+)', color: '#16a34a' },
          { label: 'Good (65–79)', color: '#f59e0b' },
          { label: 'Average (50–64)', color: '#f97316' },
          { label: 'Poor (<50)', color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ height: 200 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
