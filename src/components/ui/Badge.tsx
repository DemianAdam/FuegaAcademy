import { cn } from '../../lib/utils';

type BadgeVariant = 'most-chosen' | 'new' | 'popular';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  'most-chosen': 'bg-secondary/10 text-secondary',
  new: 'bg-lima text-on-background',
  popular: 'bg-lavanda text-on-background',
};

const variantLabels: Record<BadgeVariant, string> = {
  'most-chosen': 'Más elegido',
  new: 'Nuevo',
  popular: 'Popular',
};

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span className={cn(
      'absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase',
      variantStyles[variant],
      className
    )}>
      {variantLabels[variant]}
    </span>
  );
}