import { createContext } from 'react';

export interface LanguageContextType {
  language: string;
  setLanguage: (lng: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
