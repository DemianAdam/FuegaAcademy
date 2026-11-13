import { useTheme } from '../../lib/useTheme';
import { themeRuntime } from '../../lib/themeRuntime';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItemIndicator } from './DropdownMenu';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const labels = { light: 'Claro', dark: 'Oscuro', system: 'Sistema' };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="relative w-9 h-9 p-0 rounded-full border border-outline-variant shrink-0" aria-label="Cambiar tema" title={`Tema: ${labels[theme]}`}>
          <span className="material-symbols-outlined text-xl" aria-hidden="true">{resolvedTheme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(themeRuntime().normalize(value))} aria-label="Tema">
          {(['light', 'dark', 'system'] as const).map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              <span className="w-4" aria-hidden="true"><DropdownMenuItemIndicator>✓</DropdownMenuItemIndicator></span>
              {labels[option]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
