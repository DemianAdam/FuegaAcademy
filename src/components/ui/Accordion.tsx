import * as RadixAccordion from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDownIcon } from './Icons';

export const Accordion = forwardRef<
  React.ElementRef<typeof RadixAccordion.Root>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>
>(({ className, ...props }, ref) => (
  <RadixAccordion.Root
    ref={ref}
    className={cn('border border-outline-variant rounded-xl divide-y divide-outline-variant', className)}
    {...props}
  />
));
Accordion.displayName = 'Accordion';

export const AccordionItem = forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(({ className, ...props }, ref) => (
  <RadixAccordion.Item
    ref={ref}
    className={cn('overflow-hidden first:rounded-t-xl last:rounded-b-xl', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Header className="flex">
    <RadixAccordion.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between px-6 py-5 text-left font-medium text-on-surface hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset group',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-5 w-5 text-on-surface-variant transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </RadixAccordion.Trigger>
  </RadixAccordion.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm text-on-surface-variant data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="px-6 pb-6 pt-1">{children}</div>
  </RadixAccordion.Content>
));
AccordionContent.displayName = 'AccordionContent';
