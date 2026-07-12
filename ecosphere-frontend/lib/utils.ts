// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Tailwind class merger ─────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Number formatters ─────────────────────────────────────────
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCO2(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k tCO₂e`;
  }
  return `${value.toFixed(1)} tCO₂e`;
}

export function formatXP(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k XP`;
  return `${value} XP`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatScore(value: number): string {
  return value.toFixed(1);
}

// ── Date formatters ───────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
}

// ── Score color helpers ───────────────────────────────────────
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  if (score >= 40) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Poor';
}

export function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-600';
  if (score >= 60) return 'from-yellow-400 to-orange-500';
  if (score >= 40) return 'from-orange-400 to-red-500';
  return 'from-red-500 to-rose-600';
}

// ── Status helpers ────────────────────────────────────────────
export function getStateVariant(
  state: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    approved: 'default',
    completed: 'default',
    achieved: 'default',
    available: 'default',
    draft: 'secondary',
    pending: 'secondary',
    submitted: 'secondary',
    under_review: 'secondary',
    in_progress: 'outline',
    scheduled: 'outline',
    limited: 'outline',
    rejected: 'destructive',
    missed: 'destructive',
    exhausted: 'destructive',
    overdue: 'destructive',
    archived: 'secondary',
    cancelled: 'secondary',
  };
  return map[state] ?? 'secondary';
}

export function getSeverityColor(severity: string): string {
  const map: Record<string, string> = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[severity] ?? 'bg-slate-50 text-slate-700';
}

export function getPillarColor(type: string): string {
  const map: Record<string, string> = {
    environmental: 'text-green-600 bg-green-50',
    social: 'text-blue-600 bg-blue-50',
    governance: 'text-violet-600 bg-violet-50',
    gamification: 'text-orange-600 bg-orange-50',
    general: 'text-slate-600 bg-slate-50',
  };
  return map[type] ?? 'text-slate-600 bg-slate-50';
}

// ── Initials generator ────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Progress color ────────────────────────────────────────────
export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 50) return 'bg-yellow-500';
  if (percent >= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

// ── Clamp ─────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function exportToCsv(filename: string, headers: string[], rows: any[][]) {
  const content = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(val => {
      const cell = val === null || val === undefined ? '' : String(val);
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

