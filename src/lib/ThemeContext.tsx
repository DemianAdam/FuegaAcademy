import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContextObject';
import { themeRuntime } from './themeRuntime';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const runtime = themeRuntime();
  const [theme, setThemeState] = useState<Theme>(() => runtime.read());
  const [resolvedTheme, setResolvedTheme] = useState(() => runtime.resolve(theme));

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setResolvedTheme(runtime.apply(theme));
    update();
    if (theme !== 'system') return;
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [theme, runtime]);

  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if (event.key !== runtime.key && event.key !== null) return;
      const next = runtime.normalize(event.newValue);
      setThemeState(next);
      setResolvedTheme(runtime.apply(next));
    };
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, [runtime]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    setResolvedTheme(runtime.apply(next));
    try { window.localStorage.setItem(runtime.key, next); }
    catch { /* The selected theme remains usable for this session. */ }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
