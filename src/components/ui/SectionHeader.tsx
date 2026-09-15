import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  tag?: string;
  tagKey?: string;
  title?: string;
  titleKey?: string;
  action?: {
    label?: string;
    labelKey?: string;
    href: string;
  };
  className?: string;
}

export function SectionHeader({ tag, tagKey, title, titleKey, action, className }: SectionHeaderProps) {
  const { t } = useTranslation('home');

  const tagText = tagKey ? t(tagKey) : tag;
  const titleText = titleKey ? t(titleKey) : title || '';
  const actionLabel = action?.labelKey ? t(action.labelKey) : action?.label;

  return (
    <div className={cn('flex justify-between items-end mb-12', className)}>
      <div>
        {tagText && (
          <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">
            {tagText}
          </p>
        )}
        {titleText && (
          <h2 className="font-display-lg text-4xl font-extrabold text-on-surface">
            {titleText}
          </h2>
        )}
      </div>
      {action && (
        <Link
          to={action.href}
          className="flex items-center gap-2 font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          {actionLabel}
          <span className="material-symbols-outlined" aria-hidden="true">arrow_right_alt</span>
        </Link>
      )}
    </div>
  );
}