import { useEffect, useState, type ReactNode } from 'react';
import i18n from './i18n';
import { LanguageContext } from './LanguageContextObject';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(i18n.language || 'en');

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const setLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const t = (key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
