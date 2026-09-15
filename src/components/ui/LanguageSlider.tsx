import { useLanguage } from '../../lib/LanguageContext';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
] as const;

export function LanguageSlider() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" aria-hidden="true" />
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-10"
        role="group"
        aria-label="Language selection"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all',
              'border-2',
              language === lang.code
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            )}
            aria-pressed={language === lang.code}
            aria-label={lang.label}
          >
            <span aria-hidden="true">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}