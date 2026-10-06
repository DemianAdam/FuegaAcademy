import React from 'react';
import { Button } from '../ui';
import { LocalizedLink } from './LocalizedLink';

interface PromoBannerProps {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  to?: string;
  onClick?: () => void;
  icon?: string;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  badge,
  title,
  description,
  ctaLabel,
  to,
  onClick,
  icon = 'school',
  className = '',
}) => {
  const content = (
    <div className={`lg:col-span-2 bg-secondary-container rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-outline-variant shadow-lg ${className}`}>
      <div className="flex-1 z-10">
        <span className="bg-white dark:bg-surface-container text-secondary px-3 py-1 font-label-md text-[11px] font-bold rounded-full mb-4 inline-block">
          {badge}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-on-secondary-container mb-3 tracking-tight">
          {title}
        </h2>
        <p className="text-on-secondary-container opacity-80 mb-6 text-sm md:text-base leading-relaxed">
          {description}
        </p>
        <Button 
          variant="secondary" 
          onClick={onClick}
          className="bg-white dark:bg-surface-container text-on-secondary-fixed dark:text-on-surface shadow-md"
        >
          {ctaLabel}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Button>
      </div>
      <div className="hidden md:block absolute -right-6 -bottom-6 w-60 h-60 opacity-15 pointer-events-none">
        <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
    </div>
  );

  if (to) {
    return <LocalizedLink to={to} className="contents">{content}</LocalizedLink>;
  }

  return content;
};
