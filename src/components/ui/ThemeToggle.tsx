import { useTheme } from '../../lib/ThemeContext';
import { useLanguage } from '../../lib/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './DropdownMenu';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-9 h-9 p-0 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container"
          aria-label={t('theme.toggle')}
        >
          {resolvedTheme === 'dark' ? (
            <span className="material-symbols-outlined text-xl text-lima" aria-hidden="true">
              dark_mode
            </span>
          ) : (
            <span className="material-symbols-outlined text-xl text-primary" aria-hidden="true">
              light_mode
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'font-bold text-primary' : ''}`}
        >
          <span className="material-symbols-outlined text-base">light_mode</span>
          <span>{t('theme.light')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'font-bold text-primary' : ''}`}
        >
          <span className="material-symbols-outlined text-base">dark_mode</span>
          <span>{t('theme.dark')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 cursor-pointer ${theme === 'system' ? 'font-bold text-primary' : ''}`}
        >
          <span className="material-symbols-outlined text-base">settings_brightness</span>
          <span>{t('theme.system')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
