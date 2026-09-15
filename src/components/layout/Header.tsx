import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../lib/LanguageContext';
import { cn } from '../../lib/utils';

const navLinks = [
  { href: '#cursos', labelKey: 'nav.courses' },
  { href: '#profesores', labelKey: 'nav.teachers' },
  { href: '#como-funciona', labelKey: 'nav.howItWorks' },
  { href: '#testimonios', labelKey: 'nav.testimonials' },
] as const;

const languages = [
  { code: 'en', label: 'English', flag: 'us' },
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'pt', label: 'Português', flag: 'br' },
] as const;

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <nav className="flex justify-between items-center w-full px-margin-desktop py-4" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label={t('common.appName')}>
          <svg className="w-8 h-8 fill-lima" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z" opacity="0.3"></path>
            <path d="M12 6C12 6 14 8.5 14 11C14 13.5 12 16 12 16C12 16 10 13.5 10 11C10 8.5 12 6 12 6Z"></path>
          </svg>
          <span className="font-display-lg text-xl font-black tracking-tighter text-on-surface uppercase">
            Fuega <span className="text-secondary">Academy</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'font-label-md text-label-md transition-colors',
                location.hash === link.href
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right side: Language + Auth */}
        <div className="flex items-center gap-4">
          {/* Language Selector with Flag Images */}
          <div className="flex items-center gap-3 mr-2">
            <span className="material-symbols-outlined text-on-surface-variant text-lg" aria-hidden="true">language</span>
            <div className="flex gap-1.5" role="group" aria-label="Language selection">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-6 h-6 rounded-full overflow-hidden border border-outline-variant hover:scale-110 transition-transform ${
                    language === lang.code ? 'ring-2 ring-primary' : ''
                  }`}
                  aria-pressed={language === lang.code}
                  aria-label={lang.label}
                  title={lang.label}
                >
                  <img
                    src={`https://flagcdn.com/w40/${lang.flag}.png`}
                    alt={lang.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Match Stitch Design */}
          <Link to="/login" className="text-on-surface font-label-md hover:text-primary transition-colors px-4">
            {t('nav.login')}
          </Link>
          <Link to="/register">
            <button className="px-6 py-2.5 bg-lima text-on-background font-bold rounded-full text-label-md hover:scale-105 transition-transform">
              {t('nav.startNow')}
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}