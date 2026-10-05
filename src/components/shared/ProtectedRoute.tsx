import { Navigate, useParams } from 'react-router-dom';
import { useConvexAuth } from '@convex-dev/auth/react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { lang } = useParams<{ lang?: string }>();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const homePath = lang ? `/${lang}` : '/';
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
}
