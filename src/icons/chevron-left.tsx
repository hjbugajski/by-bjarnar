import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronLeft({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M8.93945 11.9999L14.0001 6.93923L15.0608 7.99989L11.0608 11.9999L15.0608 15.9999L14.0001 17.0605L8.93945 11.9999Z"
        fill="currentColor"
      />
    </svg>
  );
}
