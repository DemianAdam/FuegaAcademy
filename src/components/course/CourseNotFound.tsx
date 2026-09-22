import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export function CourseNotFound() {
  const { t } = useTranslation('course');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-2">{t('details.notFoundTitle')}</h1>
      <p className="text-on-surface-variant mb-6">{t('details.notFoundDesc')}</p>
      <Link to="/">
        <Button variant="primary">{t('details.backHome')}</Button>
      </Link>
    </div>
  );
}
