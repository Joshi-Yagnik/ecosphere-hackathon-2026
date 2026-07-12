// src/components/PublicRoute.tsx
// ============================================================
// Redirect to /dashboard if the user is already logged in
// ============================================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';

export function PublicRoute() {
  const { session, isLoading } = useAuth();

  // Still initializing — show nothing until we know session state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in → send to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → show the auth form
  return <Outlet />;
}
