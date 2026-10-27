import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthLoadingScreen } from '@/components/shared';
import { MainLayout, ProtectedLayout } from '@/components/layout';
import { useAuth } from '@/lib/useAuth';

const Home = lazy(() => import('@/pages/Home').then((module) => ({ default: module.Home })));
const CoursesPage = lazy(() => import('@/pages/CoursesPage').then((module) => ({ default: module.CoursesPage })));
const CoursePage = lazy(() => import('@/pages/CoursePage').then((module) => ({ default: module.CoursePage })));
const TeachersPage = lazy(() => import('@/pages/TeachersPage').then((module) => ({ default: module.TeachersPage })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const DashboardCoursesPage = lazy(() => import('@/pages/DashboardCoursesPage').then((module) => ({ default: module.DashboardCoursesPage })));
const CheckoutStatusPage = lazy(() => import('@/pages/CheckoutStatusPage').then((module) => ({ default: module.CheckoutStatusPage })));
const AuthPage = lazy(() => import('@/pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const AdminPage = lazy(() => import('@/pages/AdminPage').then((module) => ({ default: module.AdminPage })));
const AdminCourseCreatePage = lazy(() => import('@/pages/AdminCourseCreatePage').then((module) => ({ default: module.AdminCourseCreatePage })));

function AuthEntryRoute() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Outlet />;
}

export function AppRouter() {
  return <Suspense fallback={<AuthLoadingScreen />}><Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Home />} /><Route path="courses" element={<CoursesPage />} /><Route path="teachers" element={<TeachersPage />} /><Route path="course/:slug" element={<CoursePage />} />
      <Route element={<AuthEntryRoute />}><Route path="auth" element={<AuthPage />} /><Route path="login" element={<AuthPage />} /><Route path="register" element={<AuthPage />} /></Route>
    </Route>
    <Route element={<ProtectedLayout allowedRole="student" />}><Route path="dashboard" element={<Dashboard />} /><Route path="dashboard/courses" element={<DashboardCoursesPage />} /><Route path="checkout/:orderId" element={<CheckoutStatusPage />} /></Route>
    <Route element={<ProtectedLayout allowedRole="admin" />}><Route path="admin" element={<AdminPage />} /><Route path="admin/courses/new" element={<AdminCourseCreatePage />} /><Route path="admin/courses/:courseId/edit" element={<AdminCourseCreatePage />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense>;
}
