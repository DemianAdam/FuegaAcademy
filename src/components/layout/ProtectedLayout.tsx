import React from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import { AuthLoadingScreen } from '@/components/shared';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { mockDashboardData } from '@/data/mockDashboardData';

interface ProtectedLayoutProps {
  allowedRole?: 'admin' | 'student';
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRole }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { lang } = useParams<{ lang?: string }>();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    const authPath = lang ? `/${lang}/auth` : '/auth';
    return <Navigate to={authPath} replace />;
  }

  if (allowedRole === 'admin' && user?.role !== 'admin') {
    const dashPath = lang ? `/${lang}/dashboard` : '/dashboard';
    return <Navigate to={dashPath} replace />;
  }

  if (allowedRole === 'student' && user?.role === 'admin') {
    const adminPath = lang ? `/${lang}/admin` : '/admin';
    return <Navigate to={adminPath} replace />;
  }

  // If Admin Layout, delegate entirely to AdminPage
  if (allowedRole === 'admin') {
    return <Outlet />;
  }

  // If Student Layout
  if (allowedRole === 'student') {
    const dashboardUser = {
      _id: user?._id || mockDashboardData.user._id,
      _creationTime: user?._creationTime || mockDashboardData.user._creationTime,
      name: user?.name || mockDashboardData.user.name,
      role: user?.role || mockDashboardData.user.role,
      avatarUrl: user?.image || mockDashboardData.user.avatarUrl,
    };

    return (
      <DashboardLayout user={dashboardUser}>
        <Outlet />
      </DashboardLayout>
    );
  }

  return <Outlet />;
};
