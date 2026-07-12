// lib/mock-data/reports.ts
// ============================================================
// EcoSphere – Reports Module Mock Data
// ============================================================
import type { Report } from '@/types';

export const savedReports: Report[] = [
  {
    id: 'rep01',
    name: 'Q2 2026 Comprehensive ESG Summary',
    description: 'Detailed breakdown of Carbon, Water, and Waste metrics alongside CSR activity impact for Q2.',
    category: 'General',
    createdAt: '2026-07-01T10:00:00Z',
    author: 'Sunita Joshi',
    type: 'pdf',
    status: 'ready',
    size: '2.4 MB'
  },
  {
    id: 'rep02',
    name: 'Scope 1 & 2 Emissions Data Extract',
    description: 'Raw transactional data of all electricity and fuel consumption for the year to date.',
    category: 'Environmental',
    createdAt: '2026-07-10T14:30:00Z',
    author: 'Rahul Mehta',
    type: 'xlsx',
    status: 'ready',
    size: '4.1 MB'
  },
  {
    id: 'rep03',
    name: 'Policy Acknowledgement Compliance Status',
    description: 'List of all employees and their current compliance status regarding mandatory governance policies.',
    category: 'Governance',
    createdAt: '2026-07-11T09:15:00Z',
    author: 'Suresh Iyer',
    type: 'csv',
    status: 'ready',
    size: '850 KB'
  },
  {
    id: 'rep04',
    name: 'Employee CSR Hours YTD',
    description: 'Breakdown of total volunteering hours contributed by department and individual employees.',
    category: 'Social',
    createdAt: '2026-07-12T08:00:00Z',
    author: 'Anita Sharma',
    type: 'pdf',
    status: 'generating',
  },
  {
    id: 'rep05',
    name: 'Waste Management Audit Findings',
    description: 'Detailed report of findings and corrective actions from the Q1 waste audit.',
    category: 'Environmental',
    createdAt: '2026-06-25T16:45:00Z',
    author: 'Priya Sharma',
    type: 'pdf',
    status: 'failed',
    errorMessage: 'Data source timeout while aggregating facility records.'
  },
];
