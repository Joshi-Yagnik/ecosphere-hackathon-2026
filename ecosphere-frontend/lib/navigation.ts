// lib/navigation.ts
// ============================================================
// EcoSphere – Sidebar Navigation Configuration
// ============================================================
import {
  LayoutDashboard,
  Leaf,
  Users,
  Shield,
  Trophy,
  FileBarChart,
  Settings,
  Factory,
  TrendingDown,
  Target,
  Heart,
  UserCheck,
  FileText,
  CheckSquare,
  ClipboardList,
  AlertTriangle,
  Zap,
  Award,
  Gift,
  Medal,
  BarChart3,
  Building2,
  Tag,
  Cog,
  Bell,
} from 'lucide-react';
import type { NavItem } from '@/types';
export type { NavItem };

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'environmental',
    title: 'Environmental',
    icon: Leaf,
    color: 'text-green-600',
    children: [
      {
        id: 'emission-factors',
        title: 'Emission Factors',
        href: '/environmental/emission-factors',
        icon: Factory,
      },
      {
        id: 'carbon-transactions',
        title: 'Carbon Transactions',
        href: '/environmental/carbon-transactions',
        icon: TrendingDown,
      },
      {
        id: 'environmental-goals',
        title: 'Environmental Goals',
        href: '/environmental/goals',
        icon: Target,
      },
    ],
  },
  {
    id: 'social',
    title: 'Social',
    icon: Users,
    color: 'text-blue-600',
    children: [
      {
        id: 'csr-activities',
        title: 'CSR Activities',
        href: '/social/csr-activities',
        icon: Heart,
      },
      {
        id: 'employee-participation',
        title: 'Employee Participation',
        href: '/social/employee-participation',
        icon: UserCheck,
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance',
    icon: Shield,
    color: 'text-violet-600',
    children: [
      {
        id: 'policies',
        title: 'Policies',
        href: '/governance/policies',
        icon: FileText,
      },
      {
        id: 'policy-acknowledgements',
        title: 'Policy Acknowledgements',
        href: '/governance/policy-acknowledgements',
        icon: CheckSquare,
      },
      {
        id: 'audits',
        title: 'Audits',
        href: '/governance/audits',
        icon: ClipboardList,
      },
      {
        id: 'compliance-issues',
        title: 'Compliance Issues',
        href: '/governance/compliance-issues',
        icon: AlertTriangle,
        badge: 3,
      },
    ],
  },
  {
    id: 'gamification',
    title: 'Gamification',
    icon: Trophy,
    color: 'text-orange-600',
    children: [
      {
        id: 'challenges',
        title: 'Challenges',
        href: '/gamification/challenges',
        icon: Zap,
      },
      {
        id: 'challenge-participation',
        title: 'My Participations',
        href: '/gamification/challenge-participation',
        icon: UserCheck,
      },
      {
        id: 'badges',
        title: 'Badges',
        href: '/gamification/badges',
        icon: Award,
      },
      {
        id: 'rewards',
        title: 'Rewards',
        href: '/gamification/rewards',
        icon: Gift,
      },
      {
        id: 'leaderboard',
        title: 'Leaderboard',
        href: '/gamification/leaderboard',
        icon: Medal,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FileBarChart,
    color: 'text-slate-600',
    children: [
      {
        id: 'report-environmental',
        title: 'Environmental Report',
        href: '/reports/environmental',
        icon: Leaf,
      },
      {
        id: 'report-social',
        title: 'Social Report',
        href: '/reports/social',
        icon: Users,
      },
      {
        id: 'report-governance',
        title: 'Governance Report',
        href: '/reports/governance',
        icon: Shield,
      },
      {
        id: 'report-esg-summary',
        title: 'ESG Summary',
        href: '/reports/esg-summary',
        icon: BarChart3,
      },
      {
        id: 'report-custom',
        title: 'Custom Report Builder',
        href: '/reports/custom-builder',
        icon: Cog,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    color: 'text-slate-600',
    children: [
      {
        id: 'settings-departments',
        title: 'Departments',
        href: '/settings/departments',
        icon: Building2,
      },
      {
        id: 'settings-categories',
        title: 'Categories',
        href: '/settings/categories',
        icon: Tag,
      },
      {
        id: 'settings-configuration',
        title: 'ESG Configuration',
        href: '/settings/configuration',
        icon: Cog,
      },
      {
        id: 'settings-notifications',
        title: 'Notification Settings',
        href: '/settings/notifications',
        icon: Bell,
      },
    ],
  },
];

export const managerNavigationItems: NavItem[] = [
  {
    id: 'manager-dashboard',
    title: 'Dashboard',
    href: '/manager/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'manager-environmental',
    title: 'Environmental',
    icon: Leaf,
    color: 'text-green-600',
    children: [
      {
        id: 'manager-carbon-transactions',
        title: 'Carbon Transactions',
        href: '/manager/environmental/carbon-transactions',
        icon: TrendingDown,
      },
      {
        id: 'manager-environmental-goals',
        title: 'Environmental Goals',
        href: '/manager/environmental/goals',
        icon: Target,
      },
    ],
  },
  {
    id: 'manager-social',
    title: 'Social',
    icon: Users,
    color: 'text-blue-600',
    children: [
      {
        id: 'manager-csr-activities',
        title: 'CSR Activities',
        href: '/manager/social/csr-activities',
        icon: Heart,
      },
      {
        id: 'manager-employee-participation',
        title: 'Employee Participation',
        href: '/manager/social/employee-participation',
        icon: UserCheck,
      },
    ],
  },
  {
    id: 'manager-governance',
    title: 'Governance',
    icon: Shield,
    color: 'text-violet-600',
    children: [
      {
        id: 'manager-policies',
        title: 'Policies',
        href: '/manager/governance/policies',
        icon: FileText,
      },
      {
        id: 'manager-audits',
        title: 'Audits',
        href: '/manager/governance/audits',
        icon: ClipboardList,
      },
    ],
  },
  {
    id: 'manager-reports',
    title: 'Reports',
    href: '/manager/reports',
    icon: FileBarChart,
    color: 'text-slate-600',
  },
];

export const employeeNavigationItems: NavItem[] = [
  {
    id: 'employee-dashboard',
    title: 'Dashboard',
    href: '/employee/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'employee-environmental',
    title: 'Environmental',
    icon: Leaf,
    color: 'text-green-600',
    children: [
      {
        id: 'employee-carbon-activity',
        title: 'My Carbon Activity',
        href: '/employee/environmental/carbon-activity',
        icon: TrendingDown,
      },
    ],
  },
  {
    id: 'employee-social',
    title: 'Social',
    icon: Users,
    color: 'text-blue-600',
    children: [
      {
        id: 'employee-csr-activities',
        title: 'CSR Activities',
        href: '/employee/social/csr-activities',
        icon: Heart,
      },
      {
        id: 'employee-my-participation',
        title: 'My Participation',
        href: '/employee/social/my-participation',
        icon: UserCheck,
      },
    ],
  },
  {
    id: 'employee-governance',
    title: 'Governance',
    icon: Shield,
    color: 'text-violet-600',
    children: [
      {
        id: 'employee-policies',
        title: 'Policies',
        href: '/employee/governance/policies',
        icon: FileText,
      },
      {
        id: 'employee-policy-acknowledgements',
        title: 'Policy Acknowledgements',
        href: '/employee/governance/policy-acknowledgements',
        icon: CheckSquare,
      },
    ],
  },
  {
    id: 'employee-gamification',
    title: 'Gamification',
    icon: Trophy,
    color: 'text-orange-600',
    children: [
      {
        id: 'employee-challenges',
        title: 'Challenges',
        href: '/employee/gamification/challenges',
        icon: Zap,
      },
      {
        id: 'employee-badges',
        title: 'My Badges',
        href: '/employee/gamification/badges',
        icon: Award,
      },
      {
        id: 'employee-rewards',
        title: 'Rewards',
        href: '/employee/gamification/rewards',
        icon: Gift,
      },
      {
        id: 'employee-leaderboard',
        title: 'Leaderboard',
        href: '/employee/gamification/leaderboard',
        icon: Medal,
      },
    ],
  },
  {
    id: 'employee-reports',
    title: 'Reports',
    href: '/employee/reports',
    icon: FileBarChart,
    color: 'text-slate-600',
  },
];

// ── Breadcrumb Label Map ──────────────────────────────────────
// Maps URL segments → human-readable labels
export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  environmental: 'Environmental',
  'emission-factors': 'Emission Factors',
  'carbon-transactions': 'Carbon Transactions',
  goals: 'Environmental Goals',
  social: 'Social',
  'csr-activities': 'CSR Activities',
  'employee-participation': 'Employee Participation',
  governance: 'Governance',
  policies: 'Policies',
  'policy-acknowledgements': 'Policy Acknowledgements',
  audits: 'Audits',
  'compliance-issues': 'Compliance Issues',
  gamification: 'Gamification',
  challenges: 'Challenges',
  'challenge-participation': 'My Participations',
  badges: 'Badges',
  rewards: 'Rewards',
  leaderboard: 'Leaderboard',
  reports: 'Reports',
  'esg-summary': 'ESG Summary',
  'custom-builder': 'Custom Report Builder',
  settings: 'Settings',
  departments: 'Departments',
  categories: 'Categories',
  configuration: 'ESG Configuration',
  notifications: 'Notification Settings',
};
