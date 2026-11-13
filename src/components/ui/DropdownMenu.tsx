import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;
export const DropdownMenuGroup = RadixDropdown.Group;
export const DropdownMenuPortal = RadixDropdown.Portal;

export const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof RadixDropdown.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <RadixDropdown.Portal>
    <RadixDropdown.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-outline-variant bg-surface p-1 text-on-surface shadow-lg animate-in fade-in-80',
        className
      )}
      {...props}
    />
  </RadixDropdown.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof RadixDropdown.Item>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Item>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-surface-container-low focus:bg-surface-container-low data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuRadioGroup = RadixDropdown.RadioGroup;
export const DropdownMenuItemIndicator = RadixDropdown.ItemIndicator;
export const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof RadixDropdown.RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.RadioItem>
>(({ className, ...props }, ref) => (
  <RadixDropdown.RadioItem ref={ref} className={cn(
    'relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-container-high data-[state=checked]:text-primary',
    className,
  )} {...props} />
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
