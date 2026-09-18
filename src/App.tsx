import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { convex } from './lib/convex';
import { LanguageProvider } from './lib/LanguageContext';
import './lib/i18n';
import { MainLayout } from './components/layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/:lang?" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* Future routes will go here */}
      </Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/:lang/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </ConvexProvider>
  );
}

export default App;