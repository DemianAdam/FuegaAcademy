import type { ReactNode } from 'react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { BrowserRouter } from 'react-router-dom';
import { convex } from '@/lib/convex';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { AppErrorBoundary } from './AppErrorBoundary';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ConvexAuthProvider>
    </AppErrorBoundary>
  );
}
