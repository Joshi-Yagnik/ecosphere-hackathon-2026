'use client';

// components/layout/Breadcrumb.tsx
// ============================================================
// Auto-generated breadcrumb from current pathname
// ============================================================
import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbLabels } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const pathname = usePathname();

  // Split path into segments, filter empty strings
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  // Build crumbs array
  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = breadcrumbLabels[segment] ?? segment.replace(/-/g, ' ');
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  // If only one segment (e.g. /dashboard), just show the label as a title
  if (crumbs.length === 1) {
    return (
      <div className="flex items-center">
        <h1 className="text-base font-semibold text-slate-900">
          {crumbs[0].label}
        </h1>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1">
        {/* Home icon */}
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>

        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            {/* Separator */}
            <li>
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </li>

            {/* Crumb */}
            <li>
              {crumb.isLast ? (
                <span className="text-sm font-semibold text-slate-900 capitalize">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm text-slate-500 hover:text-slate-700 capitalize transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
