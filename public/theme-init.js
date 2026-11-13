/* Shared pre-paint runtime. Keep this script blocking in both HTML entrypoints. */
(function () {
  const key = 'fuega-theme';
  function normalize(value) {
    return value === 'light' || value === 'dark' ? value : 'system';
  }
  function read() {
    try { return normalize(window.localStorage.getItem(key)); }
    catch { return 'system'; }
  }
  function resolve(theme) {
    return theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
  }
  function apply(theme) {
    const resolved = resolve(theme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    return resolved;
  }
  window.fuegaTheme = { key, normalize, read, resolve, apply };
  apply(read());
})();
