import { useLanguage } from '../../lib/LanguageContext';
import type { TestimonialData } from '../../data/testimonials';

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { t } = useLanguage();

  return (
    <div className="before-after-card rounded-2xl overflow-hidden shadow-md flex flex-col h-full">
      <div className="flex h-48 border-b border-outline-variant">
        <div className="w-1/2 relative bg-surface-container-low/30">
          <img
            alt={`Antes: ${testimonial.name}`}
            src={testimonial.beforeImageUrl}
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase text-on-surface-variant">
            {t('testimonials.antes')}
          </span>
        </div>
        <div className="w-1/2 relative">
          <img
            alt={`Ahora: ${testimonial.name}`}
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
          <p className="text-sm text-secondary font-bold mb-4">{testimonial.role}</p>
          <p className="text-xs text-on-surface-variant mb-2">{testimonial.company}</p>
          <p className="text-lg font-black text-on-surface">{testimonial.earning}</p>
        </div>
      </div>
    </div>
  );
}