import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/useAuth";
import { AuthLoadingScreen } from "@/components/shared";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface ProtectedLayoutProps {
  allowedRole?: "admin" | "student";
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  allowedRole,
}) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  if (allowedRole === "admin" && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRole === "student" && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // If Admin Layout, delegate entirely to AdminPage
  if (allowedRole === "admin") {
    return <Outlet />;
  }

  // If Student Layout
  if (allowedRole === "student") {
    const dashboardUser = {
      _id: user?._id ?? "",
      _creationTime: user?._creationTime ?? 0,
      name: user?.name ?? user?.email ?? "Fuega student",
      role: user?.role ?? "student",
      avatarUrl: user?.image ?? "/favicon.svg",
    };

    return (
      <DashboardLayout user={dashboardUser}>
        <Outlet />
      </DashboardLayout>
    );
  }

  return <Outlet />;
};
