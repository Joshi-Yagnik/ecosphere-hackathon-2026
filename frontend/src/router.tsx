// src/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import DashboardPage from '@/pages/DashboardPage';
import PlaceholderPage from '@/pages/PlaceholderPage';
import { AuthContainer } from '@/features/auth/AuthContainer';

export const router = createBrowserRouter([
  // ── Public only (redirect to /dashboard if already logged in) ──
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [{ index: true, element: <AuthContainer /> }],
  },
  { path: '/login',          element: <Navigate to="/auth" replace /> },
  { path: '/signup',         element: <Navigate to="/auth" replace /> },
  { path: '/forgot-password', element: <Navigate to="/auth" replace /> },

  // ── Protected (must be logged in) ──────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },

          { path: 'environmental',                        element: <PlaceholderPage /> },
          { path: 'environmental/emission-factors',       element: <PlaceholderPage /> },
          { path: 'environmental/carbon-transactions',    element: <PlaceholderPage /> },
          { path: 'environmental/goals',                  element: <PlaceholderPage /> },

          { path: 'social',                               element: <PlaceholderPage /> },
          { path: 'social/csr-activities',                element: <PlaceholderPage /> },
          { path: 'social/employee-participation',        element: <PlaceholderPage /> },

          { path: 'governance',                           element: <PlaceholderPage /> },
          { path: 'governance/policies',                  element: <PlaceholderPage /> },
          { path: 'governance/policy-acknowledgements',   element: <PlaceholderPage /> },
          { path: 'governance/audits',                    element: <PlaceholderPage /> },
          { path: 'governance/compliance-issues',         element: <PlaceholderPage /> },

          { path: 'gamification',                         element: <PlaceholderPage /> },
          { path: 'gamification/challenges',              element: <PlaceholderPage /> },
          { path: 'gamification/challenge-participation', element: <PlaceholderPage /> },
          { path: 'gamification/badges',                  element: <PlaceholderPage /> },
          { path: 'gamification/rewards',                 element: <PlaceholderPage /> },
          { path: 'gamification/leaderboard',             element: <PlaceholderPage /> },

          { path: 'reports',                              element: <PlaceholderPage /> },
          { path: 'reports/environmental',                element: <PlaceholderPage /> },
          { path: 'reports/social',                       element: <PlaceholderPage /> },
          { path: 'reports/governance',                   element: <PlaceholderPage /> },
          { path: 'reports/esg-summary',                  element: <PlaceholderPage /> },
          { path: 'reports/custom-builder',               element: <PlaceholderPage /> },

          { path: 'settings',                             element: <PlaceholderPage /> },
          { path: 'settings/departments',                 element: <PlaceholderPage /> },
          { path: 'settings/categories',                  element: <PlaceholderPage /> },
          { path: 'settings/configuration',               element: <PlaceholderPage /> },
          { path: 'settings/notifications',               element: <PlaceholderPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/auth" replace /> },
]);
