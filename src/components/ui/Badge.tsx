import { cn } from '../../lib/utils';
type BadgeVariant = 'most-chosen' | 'new' | 'popular';
const styles: Record<BadgeVariant, string> = { 'most-chosen': 'bg-secondary/10 text-secondary', new: 'bg-lima text-on-background', popular: 'bg-lavanda text-on-background' };
const labels: Record<BadgeVariant, string> = { 'most-chosen': 'Más elegido', new: 'Nuevo', popular: 'Tendencia' };
export function Badge({ variant, className }: { variant: BadgeVariant; className?: string }) { return <span className={cn('absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase', styles[variant], className)}>{labels[variant]}</span>; }
