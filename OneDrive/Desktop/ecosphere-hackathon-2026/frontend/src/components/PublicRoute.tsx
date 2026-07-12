// src/components/PublicRoute.tsx
// ============================================================
// Shows login/auth page immediately.
// Redirects to /dashboard only once we CONFIRM a session exists.
// ============================================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';

export function PublicRoute() {
  const { session, isLoading } = useAuth();

  // Already logged in (and we're sure about it) → send to dashboard
  if (!isLoading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Still initializing OR not logged in → show the auth form immediately
  // (no spinner here — login page is the default unauthenticated experience)
  return <Outlet />;
}
