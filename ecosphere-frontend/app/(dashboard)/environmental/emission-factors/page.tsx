'use client';

// app/(dashboard)/environmental/emission-factors/page.tsx
// ============================================================
// Environmental – Emission Factors CRUD Page
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Download, Upload, Factory, Filter,
  Edit2, ToggleLeft, ToggleRight, CheckCircle2, XCircle,
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal }     from '@/components/ui/Modal';
import { emissionFactors as initialData } from '@/lib/mock-data/environmental';
import type { EmissionFactor, ActivityType } from '@/types';
import { cn } from '@/lib/utils';

// ── Scope badge ───────────────────────────────────────────────
const scopeStyle: Record<string, string> = {
  scope1: 'bg-green-50 text-green-700 border-green-200',
  scope2: 'bg-blue-50  text-blue-700  border-blue-200',
  scope3: 'bg-violet-50 text-violet-700 border-violet-200',
};
const scopeLabel: Record<string, string> = {
  scope1: 'Scope 1', scope2: 'Scope 2', scope3: 'Scope 3',
};

function ScopeBadge({ scope }: { scope: string }) {
  return (
    <span className={cn('eco-badge border text-[11px]', scopeStyle[scope])}>
      {scopeLabel[scope]}
    </span>
  );
}

// ── Emission Factor create form ───────────────────────────────
const SCOPE_OPTIONS   = ['scope1','scope2','scope3'];
const ACTIVITY_TYPES  = ['electricity','fuel','travel_air','travel_road','travel_rail','water','waste','refrigerant','material'];
const CATEGORIES      = ['Energy','Fuel','Travel','Water','Waste','Refrigerant','Material','Biodiversity'];

const BLANK: Omit<EmissionFactor,'id'|'code'> = {
  name: '', scope: 'scope2', activityType: 'electricity',
  factorValue: 0, factorUnit: 'kgCO₂e/kWh', activityUnit: 'kWh',
  source: '', year: 2026, category: 'Energy', active: true,
};

// ── Column definitions ────────────────────────────────────────
function buildColumns(
  onEdit: (ef: EmissionFactor) => void,
  onToggle: (id: string) => void
): ColumnDef<EmissionFactor, unknown>[] {
  return [
    {
      accessorKey: 'code',
      header: 'Code',
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name / Activity Type',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 capitalize mt-0.5">
            {row.original.activityType.replace(/_/g, ' ')}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'scope',
      header: 'GHG Scope',
      size: 110,
      cell: ({ row }) => <ScopeBadge scope={row.original.scope} />,
    },
    {
      accessorKey: 'factorValue',
      header: 'Factor Value',
      size: 160,
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-slate-900 tabular-nums">
            {row.original.factorValue.toFixed(4)}
          </p>
          <p className="text-[11px] text-slate-400">{row.original.factorUnit}</p>
        </div>
      ),
    },
    {
      accessorKey: 'activityUnit',
      header: 'Activity Unit',
      size: 110,
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">{row.original.activityUnit}</span>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      size: 130,
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">{row.original.source}</span>
      ),
    },
    {
      accessorKey: 'year',
      header: 'Year',
      size: 80,
      cell: ({ row }) => (
        <span className="text-slate-600 text-sm">{row.original.year}</span>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      size: 100,
      cell: ({ row }) =>
        row.original.active ? (
          <span className="eco-badge-green text-xs flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="eco-badge-slate text-xs flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Inactive
          </span>
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggle(row.original.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              row.original.active
                ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
            )}
            title={row.original.active ? 'Deactivate' : 'Activate'}
          >
            {row.original.active
              ? <ToggleRight className="w-4 h-4" />
              : <ToggleLeft className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────
export default function EmissionFactorsPage() {
  const [data, setData]           = useState<EmissionFactor[]>(initialData);
  const [search, setSearch]       = useState('');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all'|'active'|'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem]   = useState<EmissionFactor | null>(null);
  const [form, setForm]           = useState<Omit<EmissionFactor,'id'|'code'>>(BLANK);
  const [saving, setSaving]       = useState(false);

  // Filtered data
  const filtered = useMemo(() => {
    return data.filter((ef) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        ef.name.toLowerCase().includes(q) ||
        ef.code.toLowerCase().includes(q) ||
        ef.source.toLowerCase().includes(q);
      const matchScope  = scopeFilter  === 'all' || ef.scope === scopeFilter;
      const matchActive =
        activeFilter === 'all' ||
        (activeFilter === 'active'   && ef.active) ||
        (activeFilter === 'inactive' && !ef.active);
      return matchSearch && matchScope && matchActive;
    });
  }, [data, search, scopeFilter, activeFilter]);

  const columns = useMemo(
    () =>
      buildColumns(
        (ef) => { setEditItem(ef); setForm(ef); setModalOpen(true); },
        (id) => setData((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r))
      ),
    []
  );

  const openCreate = () => { setEditItem(null); setForm(BLANK); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSaving(false); };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editItem) {
        setData((prev) => prev.map((r) => r.id === editItem.id ? { ...r, ...form } : r));
      } else {
        const newItem: EmissionFactor = {
          ...form,
          id: `ef${Date.now()}`,
          code: `EF-2026-${String(data.length + 1).padStart(3, '0')}`,
        };
        setData((prev) => [newItem, ...prev]);
      }
      closeModal();
    }, 600);
  };

  // Stats
  const scope1Count = data.filter((e) => e.scope === 'scope1' && e.active).length;
  const scope2Count = data.filter((e) => e.scope === 'scope2' && e.active).length;
  const scope3Count = data.filter((e) => e.scope === 'scope3' && e.active).length;
  const activeCount = data.filter((e) => e.active).length;

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Factory className="w-6 h-6 text-green-600" /> Emission Factors
          </h1>
          <p className="eco-page-subtitle">
            GHG emission conversion factors used to calculate carbon transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Downloading template...')} className="eco-btn-secondary text-xs px-3 py-2 gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button onClick={() => alert('Uploading factors...')} className="eco-btn-secondary text-xs px-3 py-2 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={openCreate} className="eco-btn-primary text-xs px-3 py-2 gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Factor
          </button>
        </div>
      </div>

      {/* ── Stat chips ──────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: `${activeCount} Active`,     color: 'text-green-700 bg-green-50  border-green-200' },
          { label: `${scope1Count} Scope 1`,    color: 'text-green-700 bg-green-50  border-green-200' },
          { label: `${scope2Count} Scope 2`,    color: 'text-blue-700  bg-blue-50   border-blue-200'  },
          { label: `${scope3Count} Scope 3`,    color: 'text-violet-700 bg-violet-50 border-violet-200'},
          { label: `${data.length} Total`,      color: 'text-slate-600 bg-slate-100 border-slate-200' },
        ].map((chip) => (
          <span key={chip.label} className={cn('eco-badge border text-xs', chip.color)}>
            {chip.label}
          </span>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="eco-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code or source…"
              className="eco-input pl-9 text-sm"
            />
          </div>

          {/* Scope filter */}
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="eco-input w-auto text-sm text-slate-700 cursor-pointer"
          >
            <option value="all">All Scopes</option>
            <option value="scope1">Scope 1</option>
            <option value="scope2">Scope 2</option>
            <option value="scope3">Scope 3</option>
          </select>

          {/* Active filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
            className="eco-input w-auto text-sm text-slate-700 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {(search || scopeFilter !== 'all' || activeFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setScopeFilter('all'); setActiveFilter('all'); }}
              className="eco-btn-ghost text-xs gap-1 whitespace-nowrap"
            >
              <XCircle className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="eco-card overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          globalFilter={search}
          pageSize={10}
          emptyMessage="No emission factors match your filters."
          emptyIcon="🏭"
        />
      </div>

      {/* ── Create / Edit Modal ──────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editItem ? `Edit: ${editItem.code}` : 'New Emission Factor'}
        subtitle={editItem ? 'Update the emission factor details below.' : 'Add a new GHG emission conversion factor.'}
        size="lg"
        footer={
          <>
            <button onClick={closeModal} className="eco-btn-secondary text-sm">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.factorValue || saving}
              className="eco-btn-primary text-sm min-w-[100px]"
            >
              {saving ? 'Saving…' : editItem ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Factor Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Grid Electricity – National Average"
              className="eco-input"
            />
          </div>

          {/* Scope + Activity Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                GHG Scope <span className="text-red-500">*</span>
              </label>
              <select
                value={form.scope}
                onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value as EmissionFactor['scope'] }))}
                className="eco-input cursor-pointer"
              >
                {SCOPE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{scopeLabel[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Type</label>
              <select
                value={form.activityType}
                onChange={(e) => setForm((f) => ({ ...f, activityType: e.target.value as ActivityType }))}
                className="eco-input cursor-pointer capitalize"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Factor Value + Units */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Factor Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                value={form.factorValue || ''}
                onChange={(e) => setForm((f) => ({ ...f, factorValue: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0000"
                className="eco-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Factor Unit</label>
              <input
                value={form.factorUnit}
                onChange={(e) => setForm((f) => ({ ...f, factorUnit: e.target.value }))}
                placeholder="kgCO₂e/kWh"
                className="eco-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Unit</label>
              <input
                value={form.activityUnit}
                onChange={(e) => setForm((f) => ({ ...f, activityUnit: e.target.value }))}
                placeholder="kWh"
                className="eco-input"
              />
            </div>
          </div>

          {/* Source + Year + Category */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Data Source</label>
              <input
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="e.g. IPCC AR6, DEFRA 2026"
                className="eco-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reference Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || 2026 }))}
                className="eco-input"
              />
            </div>
          </div>

          {/* Category + Active */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="eco-input cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
