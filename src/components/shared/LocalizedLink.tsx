import { Link, type LinkProps, useParams } from 'react-router-dom';
import { useLanguage } from '../../lib/LanguageContext';

export function LocalizedLink({ to, ...props }: LinkProps) {
  const { lang } = useParams<{ lang?: string }>();
  const { language } = useLanguage();
  const currentLang = lang || language || 'en';

  let localizedTo = to;
  if (typeof to === 'string') {
    if (
      to.startsWith('http://') ||
      to.startsWith('https://') ||
      to.startsWith('mailto:') ||
      to.startsWith('tel:') ||
      to === '#'
    ) {
      localizedTo = to;
    } else if (to.startsWith('#')) {
      localizedTo = `/${currentLang}${to}`;
    } else {
      const cleanPath = to.startsWith('/') ? to : `/${to}`;
      const langPrefixRegex = /^\/([a-z]{2})(\/|$)/;
      if (!langPrefixRegex.test(cleanPath)) {
        localizedTo = `/${currentLang}${cleanPath === '/' ? '' : cleanPath}`;
      } else {
        localizedTo = cleanPath.replace(langPrefixRegex, `/${currentLang}$2`);
      }
    }
  } else if (to && typeof to === 'object' && 'pathname' in to && typeof to.pathname === 'string') {
    const cleanPath = to.pathname.startsWith('/') ? to.pathname : `/${to.pathname}`;
    const langPrefixRegex = /^\/([a-z]{2})(\/|$)/;
    let newPath = cleanPath;
    if (!langPrefixRegex.test(cleanPath)) {
      newPath = `/${currentLang}${cleanPath === '/' ? '' : cleanPath}`;
    } else {
      newPath = cleanPath.replace(langPrefixRegex, `/${currentLang}$2`);
    }
    localizedTo = { ...to, pathname: newPath };
  }

  return <Link to={localizedTo} {...props} />;
}
