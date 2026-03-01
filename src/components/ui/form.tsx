import type { ComponentProps } from 'react';

import { Form as BaseForm } from '@base-ui/react/form';

import { cn } from '@/utils/cn';

export function Form({ className, ...props }: ComponentProps<typeof BaseForm>) {
  return <BaseForm className={cn('grid gap-x-6 gap-y-4 sm:grid-cols-2', className)} {...props} />;
}
