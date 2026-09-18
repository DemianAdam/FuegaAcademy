import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '../../data/mockDashboardData';

interface DashboardLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const { t } = useTranslation('dashboard');

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
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-container text-on-primary-container font-bold transition-all" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <span className="font-label-md text-label-md">{t('sidebar.courses')}</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-label-md text-label-md">{t('sidebar.calendar')}</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">diversity_3</span>
              <span className="font-label-md text-label-md">{t('sidebar.community')}</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md text-label-md">{t('sidebar.profile')}</span>
            </a>
          </nav>
          <div className="mt-auto pt-stack-lg border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-surface">
                <img className="w-full h-full object-cover" alt={user.name} src={user.avatarUrl} />
              </div>
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-on-surface-variant">{t('sidebar.role')}</p>
              </div>
            </div>
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
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high" aria-label="Menu" type="button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto pb-24 md:pb-12">
          {children}

          {/* Footer area */}
          <footer className="mt-24 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">{t('footer.privacy')}</a>
              <a className="hover:text-primary transition-colors" href="#">{t('footer.support')}</a>
              <a className="hover:text-primary transition-colors" href="#">{t('footer.community')}</a>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center py-3 px-2 z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          <span className="text-[10px] font-bold">{t('sidebar.courses')}</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px]">{t('sidebar.calendar')}</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">diversity_3</span>
          <span className="text-[10px]">{t('sidebar.community')}</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">{t('sidebar.profile')}</span>
        </a>
      </nav>
    </div>
  );
}
