'use client';
import { FileBarChart, Leaf, Users, Shield, BarChart3, Cog, Download, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const reportCards = [
  { title: 'Environmental Report', href: '/reports/environmental', icon: Leaf, desc: 'Carbon emissions, energy usage, goal progress by department.', color: 'text-green-600', bg: 'bg-green-50', badge: 'PDF · Excel · CSV' },
  { title: 'Social Report', href: '/reports/social', icon: Users, desc: 'CSR activities, employee participation and volunteering metrics.', color: 'text-blue-600', bg: 'bg-blue-50', badge: 'PDF · Excel · CSV' },
  { title: 'Governance Report', href: '/reports/governance', icon: Shield, desc: 'Policy compliance, audit results and issue resolution.', color: 'text-violet-600', bg: 'bg-violet-50', badge: 'PDF · Excel · CSV' },
  { title: 'ESG Summary', href: '/reports/esg-summary', icon: BarChart3, desc: 'Consolidated ESG scorecard across all three pillars.', color: 'text-slate-600', bg: 'bg-slate-100', badge: 'Full Report' },
  { title: 'Custom Report Builder', href: '/reports/custom-builder', icon: Cog, desc: 'Build custom reports with any combination of filters.', color: 'text-orange-600', bg: 'bg-orange-50', badge: 'Builder' },
];

export default function ReportsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-slate-600" /> Reports
          </h1>
          <p className="eco-page-subtitle">Generate, filter and export ESG reports across all pillars.</p>
        </div>
        <button className="eco-btn-primary">
          <Download className="w-4 h-4" /> Quick Export
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="eco-card-hover p-5 block group">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">{card.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">{card.desc}</p>
              <div className="flex items-center justify-between">
                <span className="eco-badge-slate text-xs">{card.badge}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="eco-card p-4 border-l-4 border-slate-400 bg-slate-50 text-sm text-slate-700">
        ⚡ Report filters (date range, department, employee, category), export buttons (PDF, Excel, CSV) and data previews arrive in <strong>Phase 7</strong>.
      </div>
    </div>
  );
}
