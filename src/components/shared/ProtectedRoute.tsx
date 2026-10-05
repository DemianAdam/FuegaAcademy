import { Navigate, useParams } from 'react-router-dom';
import { useConvexAuth } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const { lang } = useParams<{ lang?: string }>();
  const currentUser = useQuery(api.users.queries.getCurrentUser, isAuthenticated ? {} : "skip");

  if (isAuthLoading || (isAuthenticated && currentUser === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && currentUser?.role !== 'admin')) {
    const homePath = lang ? `/${lang}` : '/';
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
}
