import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconMenu({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('size-5 shrink-0', className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 6.5H22V8H2V6.5ZM2 16H22V17.5H2V16Z"
        fill="currentColor"
      />
    </svg>
  );
}
