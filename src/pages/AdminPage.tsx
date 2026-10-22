import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent, ThemeToggle, Button } from '@/components/ui';
import { AppLink } from '@/components/shared';
import { AdminStatsOverview } from '@/components/admin/AdminStatsOverview';
import { TeacherManager } from '@/components/admin/TeacherManager';
import { CourseManager } from '@/components/admin/CourseManager';

export const AdminPage: React.FC = () => {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300">
      <header className="border-b border-outline-variant bg-surface-container/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <AppLink to="/" className="flex items-center gap-2 shrink-0" aria-label="Fuega Academy">
              <svg className="w-7 h-7 fill-lima" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z" opacity="0.3"></path>
                <path d="M12 6C12 6 14 8.5 14 11C14 13.5 12 16 12 16C12 16 10 13.5 10 11C10 8.5 12 6 12 6Z"></path>
              </svg>
              <span className="font-display-lg text-base md:text-lg font-black tracking-tighter text-on-surface uppercase">
                Fuega <span className="text-secondary">Academy</span>
              </span>
            </AppLink>
            <span className="text-outline-variant">|</span>
            <h1 className="text-lg font-bold tracking-tight">Panel de administración</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-error border-outline-variant hover:bg-error/10"
            >
              <span className="material-symbols-outlined text-base mr-1">logout</span>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="bg-surface-container p-1 rounded-2xl border border-outline-variant flex space-x-2">
            <TabsTrigger value="stats" className="rounded-xl px-4 py-2 font-medium">
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="teachers" className="rounded-xl px-4 py-2 font-medium">
              Profesores
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-xl px-4 py-2 font-medium">
              Cursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <AdminStatsOverview />
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <TeacherManager />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CourseManager />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};
