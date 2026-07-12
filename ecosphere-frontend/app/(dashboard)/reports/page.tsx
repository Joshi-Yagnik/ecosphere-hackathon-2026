'use client';

// app/(dashboard)/reports/page.tsx
// ============================================================
// Reports Builder & Export Center
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { FileText, Download, FileSpreadsheet, FileJson, Search, Filter, Loader2, AlertCircle, PlayCircle, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { savedReports as initial } from '@/lib/mock-data/reports';
import type { Report, ReportStatus, ReportType } from '@/types';
import { cn } from '@/lib/utils';

// ── Icons and badges ──────────────────────────────────────────
const typeIcons: Record<ReportType, { icon: React.ElementType; cls: string; label: string }> = {
  pdf:  { icon: FileText, cls: 'text-red-600 bg-red-50 border-red-200', label: 'PDF' },
  xlsx: { icon: FileSpreadsheet, cls: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'XLSX' },
  csv:  { icon: FileJson, cls: 'text-blue-600 bg-blue-50 border-blue-200', label: 'CSV' },
};

const statusStyle: Record<ReportStatus, string> = {
  ready:      'eco-badge-green',
  generating: 'eco-badge-amber',
  failed:     'eco-badge-red',
};

function TypeBadge({ type }: { type: ReportType }) {
  const cfg = typeIcons[type];
  return (
    <span className={cn('eco-badge border text-[10px] flex items-center gap-1 font-bold tracking-wider', cfg.cls)}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={cn(statusStyle[status], 'eco-badge text-[11px] flex items-center gap-1 capitalize')}>
      {status === 'generating' && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === 'failed' && <AlertCircle className="w-3 h-3" />}
      {status}
    </span>
  );
}

// ── Columns ───────────────────────────────────────────────────
function buildColumns(onDownload: (id: string) => void): ColumnDef<Report, unknown>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Report Name',
      size: 300,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 130,
      cell: ({ row }) => <span className="text-sm font-medium text-slate-700">{row.original.category}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Format',
      size: 100,
      cell: ({ row }) => <TypeBadge type={row.original.type as ReportType} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Generated On',
      size: 150,
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {new Date(row.original.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 110,
      cell: ({ row }) => <StatusBadge status={row.original.status as ReportStatus} />,
    },
    {
      id: 'actions',
      header: '',
      size: 60,
      cell: ({ row }) => (
        row.original.status === 'ready' ? (
          <button onClick={() => onDownload(row.original.id)} title="Download Report" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" />
          </button>
        ) : null
      ),
    },
  ];
}

export default function ReportsPage() {
  const [data, setData] = useState<Report[]>(initial);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [building, setBuilding] = useState(false);

  // Builder Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Environmental',
    type: 'pdf' as ReportType,
    dateRange: 'this_quarter',
    includeGraphs: true
  });

  const filtered = useMemo(() => data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || (r.description?.toLowerCase().includes(q) ?? false);
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchSearch && matchCat;
  }), [data, search, categoryFilter]);

  const handleDownload = (id: string) => {
    const report = data.find((r) => r.id === id);
    if (!report) return;

    const content = [
      `==============================================`,
      `       ECOSPHERE ESG PLATFORM REPORT          `,
      `==============================================`,
      `Report ID    : ${report.id}`,
      `Report Name  : ${report.name}`,
      `Description  : ${report.description}`,
      `Category     : ${report.category}`,
      `Format       : ${report.type.toUpperCase()}`,
      `Generated On : ${new Date(report.createdAt).toLocaleString('en-IN')}`,
      `Status       : ${report.status.toUpperCase()}`,
      `==============================================`,
      `Disclaimer: This is a generated prototype report summary.`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.name.toLowerCase().replace(/\s+/g, '_')}_summary.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBuild = () => {
    setBuilding(true);
    setTimeout(() => {
      const newReport: Report = {
        id: `rep${Date.now()}`,
        name: form.name || 'Custom Generated Report',
        description: form.description || `Generated ${form.category} report for ${form.dateRange.replace('_', ' ')}.`,
        category: form.category,
        type: form.type,
        createdAt: new Date().toISOString(),
        author: 'Current User', // Mock
        status: 'generating', // Mock generation process
      };
      
      setData((prev) => [newReport, ...prev]);
      setBuildModalOpen(false);
      setBuilding(false);

      // Simulate the report finishing generation after 4 seconds
      setTimeout(() => {
        setData((prev) => prev.map(r => r.id === newReport.id ? { ...r, status: 'ready', size: '1.2 MB' } : r));
      }, 4000);

    }, 600);
  };

  const columns = useMemo(() => buildColumns(handleDownload), []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Report Builder
          </h1>
          <p className="eco-page-subtitle">Generate, export, and manage comprehensive ESG and compliance reports.</p>
        </div>
        <button onClick={() => setBuildModalOpen(true)} className="eco-btn-primary bg-blue-600 hover:bg-blue-700 text-xs px-4 py-2 gap-2">
          <PlayCircle className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search saved reports…" className="eco-input pl-9 text-sm" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="eco-input pl-9 w-auto text-sm cursor-pointer">
              <option value="all">All Categories</option>
              <option value="General">General summary</option>
              <option value="Environmental">Environmental</option>
              <option value="Social">Social / CSR</option>
              <option value="Governance">Governance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter="" pageSize={10} emptyMessage="No reports found." emptyIcon="📄" />
      </div>

      {/* Build Modal */}
      <Modal open={buildModalOpen} onClose={() => setBuildModalOpen(false)} title="Generate Custom Report" subtitle="Configure data sources and output format." size="lg"
        footer={
          <>
            <button onClick={() => setBuildModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleBuild} disabled={!form.name || building} className="eco-btn-primary bg-blue-600 hover:bg-blue-700 text-sm min-w-[140px]">
              {building ? 'Starting...' : 'Generate Report'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Left Col: Basics */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Report Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Q3 Environmental Review" className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description (Optional)</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Purpose of this report..." className="eco-input resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date Range</label>
              <select value={form.dateRange} onChange={(e) => setForm((f) => ({ ...f, dateRange: e.target.value }))} className="eco-input cursor-pointer">
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="ytd">Year to Date (YTD)</option>
                <option value="last_year">Last Year (FY)</option>
                <option value="all_time">All Time</option>
              </select>
            </div>
          </div>

          {/* Right Col: Format & Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Module Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="eco-input cursor-pointer">
                <option value="General">General / Consolidated</option>
                <option value="Environmental">Environmental (Carbon, Waste, Water)</option>
                <option value="Social">Social (CSR, Participation)</option>
                <option value="Governance">Governance (Policies, Audits)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Export Format <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {(['pdf', 'xlsx', 'csv'] as ReportType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setForm(f => ({ ...f, type }))}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                      form.type === type ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {type === 'pdf' && <FileText className={cn("w-6 h-6 mb-1", form.type === 'pdf' ? "text-blue-600" : "text-slate-400")} />}
                    {type === 'xlsx' && <FileSpreadsheet className={cn("w-6 h-6 mb-1", form.type === 'xlsx' ? "text-blue-600" : "text-slate-400")} />}
                    {type === 'csv' && <FileJson className={cn("w-6 h-6 mb-1", form.type === 'csv' ? "text-blue-600" : "text-slate-400")} />}
                    <span className={cn("text-xs font-bold uppercase", form.type === type ? "text-blue-700" : "text-slate-500")}>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {form.type === 'pdf' && (
              <div className="pt-2">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setForm(f => ({ ...f, includeGraphs: !f.includeGraphs }))}>
                  <input type="checkbox" checked={form.includeGraphs} onChange={() => {}} className="w-4 h-4 rounded border-slate-300 text-blue-600 pointer-events-none" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Include Visualizations</p>
                    <p className="text-[11px] text-slate-500">Embed Chart.js graphs into the PDF.</p>
                  </div>
                </div>
              </div>
            )}
            
            {form.type !== 'pdf' && (
               <div className="pt-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[11px] text-amber-800 font-medium flex gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {form.type.toUpperCase()} exports contain raw data rows and tabular aggregations only. Visualizations will be excluded.
                </p>
             </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
