import * as RadixTooltip from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export const TooltipContent = forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <RadixTooltip.Portal>
    <RadixTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-surface-container-high px-3 py-1.5 text-xs text-on-surface shadow-md animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    />
  </RadixTooltip.Portal>
));
TooltipContent.displayName = 'TooltipContent';
