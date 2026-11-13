import { readFileSync } from 'node:fs';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './useTheme';
import { themeRuntime } from './themeRuntime';

const source = readFileSync('public/theme-init.js', 'utf8');
let dark = false;
let handlers: Set<() => void>;
function Consumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return <><output>{theme}:{resolvedTheme}</output>{(['light', 'dark', 'system'] as const).map(value => <button key={value} onClick={() => setTheme(value)}>{value}</button>)}</>;
}
function boot() { window.eval(source); }
beforeEach(() => {
  localStorage.clear(); dark = false; handlers = new Set();
  vi.stubGlobal('matchMedia', () => ({
    get matches() { return dark; },
    addEventListener: (_: string, handler: () => void) => handlers.add(handler),
    removeEventListener: (_: string, handler: () => void) => handlers.delete(handler),
  }));
  boot();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('theme lifecycle', () => {
  it('applies saved dark before mounting React', () => {
    localStorage.setItem('fuega-theme', 'dark'); boot();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(screen.getByRole('status').textContent).toBe('dark:dark');
  });
  it('normalizes invalid preferences to system and follows OS changes only in system', () => {
    localStorage.setItem('fuega-theme', 'invalid'); boot();
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    act(() => { dark = true; handlers.forEach(fn => fn()); });
    expect(screen.getByRole('status').textContent).toBe('system:dark');
    fireEvent.click(screen.getByText('light', { selector: 'button' }));
    act(() => { dark = false; handlers.forEach(fn => fn()); dark = true; handlers.forEach(fn => fn()); });
    expect(screen.getByRole('status').textContent).toBe('light:light');
    expect(localStorage.getItem('fuega-theme')).toBe('light');
    expect(handlers.size).toBe(0);
  });
  it('survives denied storage reads and writes', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    boot();
    expect(themeRuntime().read()).toBe('system');
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    fireEvent.click(screen.getByText('dark', { selector: 'button' }));
    expect(screen.getByRole('status').textContent).toBe('dark:dark');
  });
  it('synchronizes cross-tab changes, restores system on removal, ignores unrelated keys and cleans up', () => {
    const { unmount } = render(<ThemeProvider><Consumer /></ThemeProvider>);
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'fuega-theme', newValue: 'dark' })));
    expect(screen.getByRole('status').textContent).toBe('dark:dark');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated', newValue: 'light' })));
    expect(screen.getByRole('status').textContent).toBe('dark:dark');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'fuega-theme', newValue: null })));
    expect(screen.getByRole('status').textContent).toBe('system:light');
    expect(handlers.size).toBe(1);
    unmount(); expect(handlers.size).toBe(0);
    document.documentElement.className = 'light';
    window.dispatchEvent(new StorageEvent('storage', { key: 'fuega-theme', newValue: 'dark' }));
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
