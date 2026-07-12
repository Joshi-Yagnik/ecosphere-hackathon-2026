'use client';
import { Leaf, Factory, TrendingDown, Target, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const subPages = [
  { title: 'Emission Factors', href: '/environmental/emission-factors', icon: Factory, desc: 'Manage GHG emission factors by scope, activity type and source.', badge: 'Scope 1 · 2 · 3', color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'Carbon Transactions', href: '/environmental/carbon-transactions', icon: TrendingDown, desc: 'Log and track carbon emission transactions by department.', badge: '1,284 tCO₂e', color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'Environmental Goals', href: '/environmental/goals', icon: Target, desc: 'Monitor environmental targets, deadlines and progress.', badge: '8/14 Achieved', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function EnvironmentalPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" /> Environmental
          </h1>
          <p className="eco-page-subtitle">Track carbon emissions, manage emission factors and environmental goals.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="eco-card-hover p-5 block group">
              <div className={`w-10 h-10 ${page.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${page.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-green-700 transition-colors">{page.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">{page.desc}</p>
              <div className="flex items-center justify-between">
                <span className="eco-badge-green text-xs">{page.badge}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="eco-card p-4 border-l-4 border-green-500 bg-green-50/50 text-sm text-green-800">
        ⚡ Full data tables, search, filters, create/edit forms and status management will be added in <strong>Phase 3</strong>.
      </div>
    </div>
  );
}
