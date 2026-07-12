'use client';
import { Settings, Building2, Tag, Cog, Bell, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const settingsCards = [
  { title: 'Departments', href: '/settings/departments', icon: Building2, desc: 'Manage company departments and their ESG scores.', color: 'text-slate-600', bg: 'bg-slate-100', badge: '12 Departments' },
  { title: 'Categories', href: '/settings/categories', icon: Tag, desc: 'Configure ESG categories for Environmental, Social and Governance.', color: 'text-green-600', bg: 'bg-green-50', badge: '8 Categories' },
  { title: 'ESG Configuration', href: '/settings/configuration', icon: Cog, desc: 'Set pillar weights, scoring rules and feature toggles.', color: 'text-violet-600', bg: 'bg-violet-50', badge: 'System Config' },
  { title: 'Notification Settings', href: '/settings/notifications', icon: Bell, desc: 'Configure email and in-app notification preferences.', color: 'text-orange-600', bg: 'bg-orange-50', badge: '6 Types' },
];

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-600" /> Settings
          </h1>
          <p className="eco-page-subtitle">Configure departments, categories, ESG scoring and notifications.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {settingsCards.map((card) => {
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
        ⚡ Department and category tables, configuration forms, toggle switches and notification preferences arrive in <strong>Phase 8</strong>.
      </div>
    </div>
  );
}
