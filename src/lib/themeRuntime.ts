import type { Theme } from './ThemeContextObject';

declare global {
  interface Window {
    fuegaTheme: {
      key: string;
      normalize: (value: string | null) => Theme;
      read: () => Theme;
      resolve: (theme: Theme) => 'light' | 'dark';
      apply: (theme: Theme) => 'light' | 'dark';
    };
  }
}

// Installed by the blocking script in index.html, before the application mounts.
export function themeRuntime() {
  return window.fuegaTheme;
}
