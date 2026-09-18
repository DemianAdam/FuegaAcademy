import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enDashboard from '../locales/en/dashboard.json';
import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esDashboard from '../locales/es/dashboard.json';
import ptCommon from '../locales/pt/common.json';
import ptHome from '../locales/pt/home.json';
import ptDashboard from '../locales/pt/dashboard.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    dashboard: enDashboard,
  },
  es: {
    common: esCommon,
    home: esHome,
    dashboard: esDashboard,
  },
  pt: {
    common: ptCommon,
    home: ptHome,
    dashboard: ptDashboard,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'pt'],
    defaultNS: 'common',
    ns: ['common', 'home', 'dashboard'],
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;