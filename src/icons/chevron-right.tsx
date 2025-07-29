import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronRight({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M15.0605 11.9999L9.99989 6.93923L8.93923 7.99989L12.9392 11.9999L8.93923 15.9999L9.99989 17.0605L15.0605 11.9999Z"
        fill="currentColor"
      />
    </svg>
  );
}
