'use client';
import { Users, Heart, UserCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const subPages = [
  { title: 'CSR Activities', href: '/social/csr-activities', icon: Heart, desc: 'Manage and approve Corporate Social Responsibility activities.', badge: '47 this month', color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Employee Participation', href: '/social/employee-participation', icon: UserCheck, desc: 'Track individual employee ESG participation and XP earned.', badge: '89.3% rate', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function SocialPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Social
          </h1>
          <p className="eco-page-subtitle">Manage CSR activities and track employee participation in ESG initiatives.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="eco-card-hover p-6 block group">
              <div className={`w-10 h-10 ${page.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${page.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{page.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">{page.desc}</p>
              <div className="flex items-center justify-between">
                <span className="eco-badge-blue text-xs">{page.badge}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="eco-card p-4 border-l-4 border-blue-500 bg-blue-50/50 text-sm text-blue-800">
        ⚡ CSR cards, approval workflows, proof upload UI and participation tables arrive in <strong>Phase 4</strong>.
      </div>
    </div>
  );
}
