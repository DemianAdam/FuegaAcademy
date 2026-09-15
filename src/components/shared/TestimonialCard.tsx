import { useTranslation } from 'react-i18next';
import type { TestimonialData } from '../../data/testimonials';

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { t } = useTranslation('home');

  return (
    <div className="before-after-card rounded-2xl overflow-hidden shadow-md flex flex-col h-full bg-white border border-outline-variant">
      <div className="flex h-48 border-b border-outline-variant">
        <div className="w-1/2 relative bg-surface-container-low/30">
          <img
            alt={`${t('testimonials.antes')}: ${testimonial.name}`}
            src={testimonial.beforeImageUrl}
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase text-on-surface-variant">
            {t('testimonials.antes')}
          </span>
        </div>
        <div className="w-1/2 relative">
          <img
            alt={`${t('testimonials.ahora')}: ${testimonial.name}`}
            src={testimonial.afterImageUrl}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 right-2 text-[10px] font-black uppercase text-secondary">
            {t('testimonials.ahora')}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-lg text-on-surface mb-1">{testimonial.name}</h4>
          <p className="text-sm text-secondary font-bold mb-4">
            {t(`testimonials.items.${testimonial.id}.beforeRole`, { defaultValue: testimonial.role })}
          </p>
          <p className="text-xs text-on-surface-variant mb-2">
            {t(`testimonials.items.${testimonial.id}.beforeCompany`, { defaultValue: testimonial.company })}
          </p>
          <p className="text-lg font-black text-on-surface">
            {t(`testimonials.items.${testimonial.id}.beforeSalary`, { defaultValue: testimonial.earning })}
          </p>
        </div>
      </div>
    </div>
  );
}