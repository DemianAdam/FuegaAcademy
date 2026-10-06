import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { convex } from './lib/convex';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './lib/useAuth';
import './lib/i18n';
import { MainLayout, ProtectedLayout } from './components/layout';
import { AuthLoadingScreen } from './components/shared';
import { Home } from './pages/Home';
import { CoursePage } from './pages/CoursePage';
import { CoursesPage } from './pages/CoursesPage';
import { TeachersPage } from './pages/TeachersPage';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { AdminCourseCreatePage } from './pages/AdminCourseCreatePage';
import { AdminPage } from './pages/AdminPage';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

function RoutesContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { lang } = useParams<{ lang?: string }>();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  const targetLang = lang;
  const dashboardPath = targetLang ? `/${targetLang}/dashboard` : '/dashboard';
  const adminPath = targetLang ? `/${targetLang}/admin` : '/admin';
  const authRedirect = user?.role === 'admin' ? adminPath : dashboardPath;

  return (
    <Routes>
      <Route path="/:lang?" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="course/:slug" element={<CoursePage />} />
        <Route
          path="auth"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to={authRedirect} replace />}
        />
        <Route
          path="login"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to={authRedirect} replace />}
        />
        <Route
          path="register"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to={authRedirect} replace />}
        />
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedLayout allowedRole="student" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:lang/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedLayout allowedRole="admin" />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/:lang/admin" element={<AdminPage />} />
        <Route path="/admin/courses/new" element={<AdminCourseCreatePage />} />
        <Route path="/:lang/admin/courses/new" element={<AdminCourseCreatePage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ConvexAuthProvider client={convex}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <RoutesContent />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

export default App;
