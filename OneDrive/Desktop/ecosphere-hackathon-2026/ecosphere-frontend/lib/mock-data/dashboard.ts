// lib/mock-data/dashboard.ts
// ============================================================
// EcoSphere – Dashboard Mock Data
// ============================================================

import type {
  LeaderboardEntry,
  RecentActivity,
  Department,
  ChartDataPoint,
  TimeSeriesPoint,
} from '@/types';

// ── Monthly Carbon Trend (Jan–Jul 2026) ──────────────────────
export const carbonMonthlyData = [
  { month: 'Jan', scope1: 122, scope2: 88, scope3: 342, total: 552 },
  { month: 'Feb', scope1: 116, scope2: 83, scope3: 325, total: 524 },
  { month: 'Mar', scope1: 131, scope2: 91, scope3: 381, total: 603 },
  { month: 'Apr', scope1: 109, scope2: 79, scope3: 299, total: 487 },
  { month: 'May', scope1:  96, scope2: 73, scope3: 276, total: 445 },
  { month: 'Jun', scope1:  89, scope2: 69, scope3: 261, total: 419 },
  { month: 'Jul', scope1:  83, scope2: 66, scope3: 246, total: 395 },
];

export const carbonLabels = carbonMonthlyData.map((d) => d.month);
export const carbonScope1 = carbonMonthlyData.map((d) => d.scope1);
export const carbonScope2 = carbonMonthlyData.map((d) => d.scope2);
export const carbonScope3 = carbonMonthlyData.map((d) => d.scope3);
export const carbonTotal  = carbonMonthlyData.map((d) => d.total);

// Reduction target line (straight line from 520 → 350)
export const carbonTarget = [520, 492, 464, 436, 408, 380, 350];

// ── ESG Score Trend ──────────────────────────────────────────
export const esgScoreTrend = [
  { month: 'Jan', env: 60.2, social: 74.1, gov: 68.5, overall: 67.6 },
  { month: 'Feb', env: 62.5, social: 75.8, gov: 69.2, overall: 69.2 },
  { month: 'Mar', env: 61.8, social: 77.2, gov: 70.1, overall: 69.7 },
  { month: 'Apr', env: 64.2, social: 78.5, gov: 71.3, overall: 71.3 },
  { month: 'May', env: 65.8, social: 79.8, gov: 72.0, overall: 72.5 },
  { month: 'Jun', env: 67.1, social: 80.5, gov: 72.5, overall: 73.4 },
  { month: 'Jul', env: 68.5, social: 81.3, gov: 72.9, overall: 74.2 },
];

// ── Current KPI Values ───────────────────────────────────────
export const currentKpis = {
  overall:       { value: 74.2, delta: +3.1, prev: 71.1 },
  environmental: { value: 68.5, delta: +5.2, prev: 63.3 },
  social:        { value: 81.3, delta: +1.8, prev: 79.5 },
  governance:    { value: 72.9, delta: -0.4, prev: 73.3 },
};

// Weights for the ESG pillar donut
export const esgPillarWeights = {
  environmental: 0.4,
  social:        0.35,
  governance:    0.25,
};

// ── Department Scores ────────────────────────────────────────
export const departmentScores: Department[] = [
  {
    id: 'd1', name: 'Engineering', manager: 'Rahul Mehta',
    esgScore: 82, envScore: 75, socialScore: 88, govScore: 82,
    carbonTarget: 180, carbonActual: 132, employeeCount: 48, rank: 1,
  },
  {
    id: 'd2', name: 'Human Resources', manager: 'Anita Sharma',
    esgScore: 78, envScore: 68, socialScore: 92, govScore: 74,
    carbonTarget: 60, carbonActual: 44, employeeCount: 18, rank: 2,
  },
  {
    id: 'd3', name: 'Operations', manager: 'Kiran Patel',
    esgScore: 71, envScore: 71, socialScore: 75, govScore: 68,
    carbonTarget: 240, carbonActual: 187, employeeCount: 62, rank: 3,
  },
  {
    id: 'd4', name: 'Finance', manager: 'Sunita Joshi',
    esgScore: 65, envScore: 58, socialScore: 68, govScore: 72,
    carbonTarget: 90, carbonActual: 78, employeeCount: 24, rank: 4,
  },
  {
    id: 'd5', name: 'Marketing', manager: 'Vikram Nair',
    esgScore: 60, envScore: 55, socialScore: 72, govScore: 55,
    carbonTarget: 70, carbonActual: 62, employeeCount: 21, rank: 5,
  },
];

// ── Emission by Scope (Jul 2026) ─────────────────────────────
export const emissionByScope = {
  labels: ['Scope 1 – Direct', 'Scope 2 – Indirect', 'Scope 3 – Value Chain'],
  values: [83, 66, 246],          // tCO₂e Jul 2026
  colors: ['#16a34a', '#2563eb', '#7c3aed'],
  lightColors: ['#f0fdf4', '#eff6ff', '#f5f3ff'],
};

// ── Leaderboard ───────────────────────────────────────────────
export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, employeeId: 'e01', employeeName: 'Priya Sharma',    department: 'Engineering',      totalXp: 4820, badgeCount: 12, challengesCompleted: 8,  trend: 'stable', rankChange: 0 },
  { rank: 2, employeeId: 'e02', employeeName: 'Rahul Mehta',     department: 'Operations',       totalXp: 4210, badgeCount: 9,  challengesCompleted: 7,  trend: 'up',     rankChange: 1 },
  { rank: 3, employeeId: 'e03', employeeName: 'Sneha Patel',     department: 'Human Resources',  totalXp: 3980, badgeCount: 11, challengesCompleted: 6,  trend: 'down',   rankChange: -1 },
  { rank: 4, employeeId: 'e04', employeeName: 'Arun Kumar',      department: 'Finance',          totalXp: 3560, badgeCount: 7,  challengesCompleted: 5,  trend: 'up',     rankChange: 2 },
  { rank: 5, employeeId: 'e05', employeeName: 'Divya Nair',      department: 'Marketing',        totalXp: 3120, badgeCount: 8,  challengesCompleted: 4,  trend: 'down',   rankChange: -1 },
  { rank: 6, employeeId: 'e06', employeeName: 'Suresh Iyer',     department: 'Engineering',      totalXp: 2980, badgeCount: 6,  challengesCompleted: 5,  trend: 'stable', rankChange: 0 },
  { rank: 7, employeeId: 'e07', employeeName: 'Meena Reddy',     department: 'Operations',       totalXp: 2750, badgeCount: 5,  challengesCompleted: 4,  trend: 'up',     rankChange: 1 },
  { rank: 8, employeeId: 'e08', employeeName: 'Farhan Siddiqui', department: 'Finance',          totalXp: 2640, badgeCount: 4,  challengesCompleted: 3,  trend: 'down',   rankChange: -2 },
  { rank: 9, employeeId: 'e09', employeeName: 'Kavya Menon',     department: 'Marketing',        totalXp: 2310, badgeCount: 5,  challengesCompleted: 3,  trend: 'stable', rankChange: 0 },
  { rank: 10, employeeId: 'e10', employeeName: 'Rohan Desai',   department: 'Human Resources',  totalXp: 2100, badgeCount: 3,  challengesCompleted: 2,  trend: 'up',     rankChange: 3 },
];

// ── Recent Activity ───────────────────────────────────────────
export const recentActivities: RecentActivity[] = [
  {
    id: 'a1', type: 'carbon',
    title: 'Carbon Transaction Logged',
    description: 'Operations – 83 tCO₂e (Electricity, Jul 2026)',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    user: 'Kiran Patel', department: 'Operations',
  },
  {
    id: 'a2', type: 'badge',
    title: 'Badge Awarded 🏅',
    description: 'Priya Sharma earned "Carbon Neutral Hero"',
    timestamp: new Date(Date.now() - 62 * 60000).toISOString(),
    user: 'System', department: 'Engineering',
  },
  {
    id: 'a3', type: 'csr',
    title: 'CSR Activity Approved',
    description: '"Tree Plantation Drive" approved for HR dept',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    user: 'Anita Sharma', department: 'Human Resources',
  },
  {
    id: 'a4', type: 'compliance',
    title: 'Compliance Issue Escalated ⚠️',
    description: 'CI-2026-003 marked overdue (Finance dept)',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    user: 'Sunita Joshi', department: 'Finance',
  },
  {
    id: 'a5', type: 'carbon',
    title: 'Environmental Goal Achieved',
    description: 'EG-2026-012 "Reduce AC Usage" – 100% complete',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: 'Engineering Team', department: 'Engineering',
  },
  {
    id: 'a6', type: 'policy',
    title: 'Policy Published',
    description: 'Data Privacy Policy v2.1 published by Legal',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: 'Legal Team', department: 'Governance',
  },
  {
    id: 'a7', type: 'challenge',
    title: 'New Challenge Launched',
    description: '"Zero Waste Week" challenge is now active',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    user: 'Admin', department: 'All Departments',
  },
  {
    id: 'a8', type: 'csr',
    title: 'CSR Activity Submitted',
    description: '"Blood Donation Camp" submitted by Finance',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    user: 'Sunita Joshi', department: 'Finance',
  },
];

// ── Quick Stats ───────────────────────────────────────────────
export const quickStats = [
  { id: 'carbon',    label: 'Carbon Emissions',       value: '1,284', unit: 'tCO₂e',     delta: '-7.2%', positive: true },
  { id: 'csr',       label: 'CSR Activities',          value: '47',    unit: 'this month', delta: '+12',   positive: true },
  { id: 'issues',    label: 'Open Issues',             value: '3',     unit: 'critical',   delta: '+1',    positive: false },
  { id: 'engage',    label: 'Employee Participation',  value: '89.3',  unit: '%',          delta: '+2.1%', positive: true },
  { id: 'challenge', label: 'Active Challenges',       value: '12',    unit: 'running',    delta: '+3',    positive: true },
  { id: 'goals',     label: 'Goals Achieved',          value: '8',     unit: '/ 14',       delta: '+2',    positive: true },
];
