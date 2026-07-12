'use client';

// app/(dashboard)/settings/departments/page.tsx
// ============================================================
// Organization / Departments Settings
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Building, Plus, Search, Edit, Users, Leaf, HeartHandshake, ShieldCheck } from 'lucide-react';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { departmentScores as initial } from '@/lib/mock-data/dashboard';
import type { Department } from '@/types';
import { cn } from '@/lib/utils';

// ── Components ────────────────────────────────────────────────
function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-700 bg-green-50' : score >= 60 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50';
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', color)}>
      {score}
    </span>
  );
}

function buildColumns(onEdit: (d: Department) => void): ColumnDef<Department, unknown>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Department Name',
      size: 200,
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-slate-900 leading-tight">{row.original.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">Rank: #{row.original.rank}</p>
        </div>
      ),
    },
    {
      accessorKey: 'manager',
      header: 'Manager',
      size: 150,
      cell: ({ row }) => <span className="text-sm font-medium text-slate-700">{row.original.manager}</span>,
    },
    {
      accessorKey: 'employeeCount',
      header: 'Employees',
      size: 100,
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm font-semibold text-slate-600">
          <Users className="w-3.5 h-3.5 text-slate-400" /> {row.original.employeeCount}
        </span>
      ),
    },
    {
      accessorKey: 'esgScore',
      header: 'ESG Score',
      size: 100,
      cell: ({ row }) => <ScorePill score={row.original.esgScore} />,
    },
    {
      accessorKey: 'carbonTarget',
      header: 'Carbon Target',
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{row.original.carbonTarget}</span> tCO₂e
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 60,
      cell: ({ row }) => (
        <button onClick={() => onEdit(row.original)} title="Edit Department" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      ),
    },
  ];
}

export default function DepartmentsPage() {
  const [data, setData] = useState<Department[]>(initial);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', manager: '', employeeCount: 1, carbonTarget: 1000 });

  const filtered = useMemo(() => data.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.manager.toLowerCase().includes(q);
  }), [data, search]);

  const handleEdit = (d: Department) => {
    setEditingItem(d);
    setForm({ name: d.name, manager: d.manager, employeeCount: d.employeeCount, carbonTarget: d.carbonTarget });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ name: '', manager: '', employeeCount: 10, carbonTarget: 500 });
    setModalOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editingItem) {
        setData(prev => prev.map(d => d.id === editingItem.id ? { ...d, ...form } : d));
      } else {
        const newDept: Department = {
          id: `d${Date.now()}`,
          ...form,
          esgScore: 0,
          envScore: 0,
          socialScore: 0,
          govScore: 0,
          carbonActual: 0,
          rank: data.length + 1,
        };
        setData(prev => [...prev, newDept]);
      }
      setModalOpen(false);
      setSaving(false);
    }, 600);
  };

  const columns = useMemo(() => buildColumns(handleEdit), []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Building className="w-6 h-6 text-slate-600" /> Organization Departments
          </h1>
          <p className="eco-page-subtitle">Manage business units, managers, and department-level ESG targets.</p>
        </div>
        <button onClick={handleAdd} className="eco-btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs px-3 py-2 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Department
        </button>
      </div>

      <div className="eco-card p-4">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search departments…" className="eco-input pl-9 text-sm" />
        </div>
      </div>

      <div className="eco-card overflow-hidden">
        <DataTable columns={columns} data={filtered} globalFilter="" pageSize={10} emptyMessage="No departments found." emptyIcon="🏢" />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Department' : 'Add Department'} subtitle={editingItem ? `Editing ${editingItem.name}` : 'Create a new business unit.'} size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="eco-btn-secondary text-sm">Cancel</button>
            <button onClick={handleSave} disabled={!form.name || !form.manager || saving} className="eco-btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm min-w-[100px]">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Research & Development" className="eco-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Manager / Lead <span className="text-red-500">*</span></label>
            <input value={form.manager} onChange={(e) => setForm((f) => ({ ...f, manager: e.target.value }))} placeholder="e.g. John Doe" className="eco-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Headcount</label>
              <input type="number" min="1" value={form.employeeCount || ''} onChange={(e) => setForm((f) => ({ ...f, employeeCount: Number(e.target.value) }))} className="eco-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Carbon Target (tCO₂e)</label>
              <input type="number" min="0" value={form.carbonTarget || ''} onChange={(e) => setForm((f) => ({ ...f, carbonTarget: Number(e.target.value) }))} className="eco-input" />
            </div>
          </div>

          {editingItem && (
            <div className="pt-4 border-t border-slate-100 mt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Current ESG Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                  <Leaf className="w-4 h-4 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-slate-900">{editingItem.envScore}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                  <HeartHandshake className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-lg font-bold text-slate-900">{editingItem.socialScore}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-violet-600 mb-1" />
                  <span className="text-lg font-bold text-slate-900">{editingItem.govScore}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
