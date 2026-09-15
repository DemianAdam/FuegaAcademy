import { cn } from '../../lib/utils';
import type { StepData } from '../../data/steps';

interface StepCardProps {
  step: StepData;
}

export function StepCard({ step }: StepCardProps) {
  const iconBgClass = step.iconBg === 'lavanda' ? 'bg-lavanda/20' : 'bg-lima/20';
  const iconColorClass = step.iconBg === 'lavanda' ? 'text-secondary' : 'text-on-background';

  return (
    <div className="flex items-start gap-6">
      <div className={cn('p-4 rounded-2xl', iconBgClass)}>
        <step.icon className={cn('text-4xl', iconColorClass)} aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-bold text-xl text-on-surface mb-3">{step.title}</h4>
        <p className="text-on-surface-variant leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}