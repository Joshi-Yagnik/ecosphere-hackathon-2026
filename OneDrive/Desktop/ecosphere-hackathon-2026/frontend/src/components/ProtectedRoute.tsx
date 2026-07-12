// src/components/ProtectedRoute.tsx
// ============================================================
// Redirect to /auth if the user is not logged in
// ============================================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';

export function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  // Still initializing Supabase session — show nothing (or a spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to /auth
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in → render the child routes
  return <Outlet />;
}
