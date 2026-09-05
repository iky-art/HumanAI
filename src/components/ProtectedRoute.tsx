import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/database';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

/**
 * Wraps a set of nested routes (via <Outlet/>). Redirects to /login if
 * nobody is signed in, or to /chat if the signed-in role isn't allowed
 * here — same shape as the old prototype's requireAuth/requireRole.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink text-ash-500 text-sm">
        Memuat...
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
