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
