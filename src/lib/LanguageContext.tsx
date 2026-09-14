import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from './i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lng: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}