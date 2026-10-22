import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { AppLink } from '../shared/AppLink';
import type { DashboardUser } from '@/features/dashboard/types';

interface DashboardLayoutProps {
  user: DashboardUser;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const isCatalog = location.pathname.includes('/dashboard/courses');
  const isDashboard = !isCatalog;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen">
      {/* App Layout Container */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-70 bg-surface-container border-r border-outline-variant/30 sticky top-0 h-screen p-stack-lg">
          <div className="mb-stack-lg">
            <span className="font-display-lg text-[28px] font-extrabold tracking-tighter text-on-surface flex items-center gap-2">
              <svg className="w-8 h-8 fill-primary-fixed" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z" opacity="0.3"></path>
                <path d="M12 6C12 6 14 8.5 14 11C14 13.5 12 16 12 16C12 16 10 13.5 10 11C10 8.5 12 6 12 6Z"></path>
              </svg>
              FUEGA <span className="text-secondary">ACADEMY</span>
            </span>
          </div>
          <nav className="flex-1 space-y-unit">
            <AppLink
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isDashboard
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined" style={isDashboard ? { fontVariationSettings: "'FILL' 1" } : undefined}>school</span>
              <span className="font-label-md text-label-md">Mis cursos</span>
            </AppLink>
            <AppLink
              to="/dashboard/courses"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isCatalog
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined" style={isCatalog ? { fontVariationSettings: "'FILL' 1" } : undefined}>explore</span>
              <span className="font-label-md text-label-md">Catálogo</span>
            </AppLink>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-label-md text-label-md">Calendario</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">diversity_3</span>
              <span className="font-label-md text-label-md">Comunidad</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md text-label-md">Perfil</span>
            </a>
          </nav>
          <div className="mt-auto pt-stack-lg border-t border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-surface">
                <img className="w-full h-full object-cover" alt={user.name} src={user.avatarUrl} />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-xs text-on-surface-variant truncate">Creador digital</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all font-medium text-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-margin-mobile py-4 bg-surface-bright sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-primary-fixed" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z" opacity="0.3"></path>
              <path d="M12 6C12 6 14 8.5 14 11C14 13.5 12 16 12 16C12 16 10 13.5 10 11C10 8.5 12 6 12 6Z"></path>
            </svg>
            <span className="font-display-lg text-headline-lg-mobile font-extrabold tracking-tighter text-on-surface uppercase">Fuega <span className="text-secondary">Academy</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-error hover:bg-error/10 transition-colors"
              aria-label="Cerrar sesión"
              type="button"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high" aria-label="Menu" type="button">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto pb-24 md:pb-12">
          {children}

          {/* Footer area */}
          <footer className="mt-24 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
            <p>© 2024 Fuega Academy. Aprendé, creá y viví de eso.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">Privacidad</a>
              <a className="hover:text-primary transition-colors" href="#">Soporte</a>
              <a className="hover:text-primary transition-colors" href="#">Comunidad</a>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center py-3 px-2 z-50">
        <AppLink
          to="/dashboard"
          className={`flex flex-col items-center gap-1 ${isDashboard ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={isDashboard ? { fontVariationSettings: "'FILL' 1" } : undefined}>school</span>
          <span className="text-[10px] font-bold">Mis cursos</span>
        </AppLink>
        <AppLink
          to="/dashboard/courses"
          className={`flex flex-col items-center gap-1 ${isCatalog ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={isCatalog ? { fontVariationSettings: "'FILL' 1" } : undefined}>explore</span>
          <span className="text-[10px] font-bold">Catálogo</span>
        </AppLink>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px]">Calendario</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">diversity_3</span>
          <span className="text-[10px]">Comunidad</span>
        </a>
      </nav>
    </div>
  );
}
