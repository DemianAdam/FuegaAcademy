import React from 'react';
import { cn } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'object-cover rounded-full',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface AvatarStackProps {
  children: React.ReactNode;
  className?: string;
  maxVisible?: number;
}

export function AvatarStack({ children, className, maxVisible = 3 }: AvatarStackProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, maxVisible);
  const remainingCount = childrenArray.length - maxVisible;

  return (
    <div className={cn('flex -space-x-3', className)}>
      {visibleChildren.map((child, index) => (
        <span key={index} className="relative z-[{childrenArray.length - index}]">
          {child}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="relative z-0 w-8 h-8 rounded-full border-2 border-inverse-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}