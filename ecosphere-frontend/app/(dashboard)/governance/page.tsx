'use client';
import { Shield, FileText, CheckSquare, ClipboardList, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const subPages = [
  { title: 'Policies', href: '/governance/policies', icon: FileText, desc: 'Manage ESG policies, versions and distribution.', badge: '24 Active', color: 'text-violet-600', bg: 'bg-violet-50' },
  { title: 'Policy Acknowledgements', href: '/governance/policy-acknowledgements', icon: CheckSquare, desc: 'Track employee acknowledgements and compliance.', badge: '96.1% ack rate', color: 'text-purple-600', bg: 'bg-purple-50' },
  { title: 'Audits', href: '/governance/audits', icon: ClipboardList, desc: 'Schedule and manage ESG audit records.', badge: '3 Scheduled', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Compliance Issues', href: '/governance/compliance-issues', icon: AlertTriangle, desc: 'Track open compliance issues by severity.', badge: '3 Critical', color: 'text-red-600', bg: 'bg-red-50' },
];

export default function GovernancePage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-600" /> Governance
          </h1>
          <p className="eco-page-subtitle">Manage policies, audits, compliance issues and policy acknowledgements.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="eco-card-hover p-5 block group">
              <div className={`w-10 h-10 ${page.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${page.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">{page.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">{page.desc}</p>
              <div className="flex items-center justify-between">
                <span className="eco-badge-violet text-xs">{page.badge}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="eco-card p-4 border-l-4 border-violet-500 bg-violet-50/50 text-sm text-violet-800">
        ⚡ Policy cards, audit tables, compliance severity chips and approval buttons arrive in <strong>Phase 5</strong>.
      </div>
    </div>
  );
}
