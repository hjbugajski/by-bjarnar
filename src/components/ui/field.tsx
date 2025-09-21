import type { ComponentProps } from 'react';

import { Field as BaseField } from '@base-ui-components/react/field';

import { cn } from '@/utils/cn';

export function Field({ className, ...props }: ComponentProps<typeof BaseField.Root>) {
  return <BaseField.Root {...props} className={cn('space-y-1', className)} />;
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof BaseField.Label>) {
  return <BaseField.Label {...props} className={cn('text-sm font-medium', className)} />;
}

export function FieldControl({ className, ...props }: ComponentProps<typeof BaseField.Control>) {
  return (
    <BaseField.Control
      {...props}
      className={cn(
        'w-full rounded-sm border border-gold-6 bg-gold-3 px-2 text-base transition hover:border-gold-8 hover:bg-gold-4 focus:outline-none focus-visible:border-gold-8 focus-visible:ring-1 focus-visible:ring-gold-7 data-[invalid]:border-tomato-7 data-[invalid]:hover:border-tomato-8 data-[invalid]:focus-visible:border-tomato-8 data-[invalid]:focus-visible:ring-tomato-7',
        className,
      )}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      {...props}
      className={cn('text-xs data-[invalid]:hidden', className)}
      render={<div />}
    />
  );
}

export function FieldError({ className, ...props }: ComponentProps<typeof BaseField.Error>) {
  return <BaseField.Error {...props} className={cn('text-xs text-tomato-11', className)} />;
}
