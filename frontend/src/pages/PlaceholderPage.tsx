// src/pages/PlaceholderPage.tsx
// Generic placeholder for all non-dashboard pages
import { useLocation } from 'react-router-dom';
import { breadcrumbLabels } from '@/lib/navigation';
import { Construction } from 'lucide-react';

export default function PlaceholderPage() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const lastSeg = segments[segments.length - 1] ?? '';
  const title = breadcrumbLabels[lastSeg] ?? lastSeg;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title">{title}</h1>
          <p className="eco-page-subtitle">This module will be fully wired in the next phase.</p>
        </div>
      </div>
      <div className="eco-card p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title} — Coming Soon</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          The full {title} module with real Supabase data will be delivered in Phase 2.
        </p>
      </div>
    </div>
  );
}
