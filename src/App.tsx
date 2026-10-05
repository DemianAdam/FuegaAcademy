import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { convex } from './lib/convex';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import './lib/i18n';
import { MainLayout } from './components/layout';
import { ProtectedRoute } from './components/shared';
import { Home } from './pages/Home';
import { CoursePage } from './pages/CoursePage';
import { CoursesPage } from './pages/CoursesPage';
import { TeachersPage } from './pages/TeachersPage';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/:lang?" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="course/:slug" element={<CoursePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage />} />
      </Route>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/:lang/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <ConvexAuthProvider client={convex}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

export default App;
