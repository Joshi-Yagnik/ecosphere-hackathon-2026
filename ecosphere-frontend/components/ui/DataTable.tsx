'use client';

// components/ui/DataTable.tsx
// ============================================================
// Reusable TanStack Table v8 wrapper
// ============================================================
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  globalFilter?: string;
  pageSize?: number;
  emptyMessage?: string;
  emptyIcon?: string;
}

export function DataTable<T>({
  columns,
  data,
  globalFilter = '',
  pageSize = 10,
  emptyMessage = 'No records found.',
  emptyIcon = '📋',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { rows } = table.getRowModel();
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalFiltered);

  // Page buttons: show at most 5 around current page
  const totalPages = table.getPageCount();
  const pageButtons = Array.from({ length: totalPages }, (_, i) => i).slice(
    Math.max(0, pageIndex - 2),
    Math.min(totalPages, pageIndex + 3)
  );

  return (
    <div className="flex flex-col">
      {/* ── Table ─────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {table.getFlatHeaders().map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  className={cn(
                    'px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap',
                    header.column.getCanSort() &&
                      'cursor-pointer select-none hover:text-slate-700 hover:bg-slate-100 transition-colors'
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="text-slate-400">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5 text-green-600" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <span className="text-3xl">{emptyIcon}</span>
                    <p className="text-sm text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalFiltered > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalFiltered}</span> records
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            {pageIndex > 2 && (
              <>
                <button
                  onClick={() => table.setPageIndex(0)}
                  className="w-8 h-8 text-xs text-slate-600 rounded-lg border border-slate-200 hover:bg-white"
                >
                  1
                </button>
                {pageIndex > 3 && (
                  <span className="text-slate-300 text-sm px-1">…</span>
                )}
              </>
            )}

            {pageButtons.map((p) => (
              <button
                key={p}
                onClick={() => table.setPageIndex(p)}
                className={cn(
                  'w-8 h-8 text-xs rounded-lg transition-colors border',
                  p === pageIndex
                    ? 'bg-green-600 text-white border-green-600 font-bold shadow-sm'
                    : 'text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
                )}
              >
                {p + 1}
              </button>
            ))}

            {pageIndex < totalPages - 3 && (
              <>
                {pageIndex < totalPages - 4 && (
                  <span className="text-slate-300 text-sm px-1">…</span>
                )}
                <button
                  onClick={() => table.setPageIndex(totalPages - 1)}
                  className="w-8 h-8 text-xs text-slate-600 rounded-lg border border-slate-200 hover:bg-white"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
