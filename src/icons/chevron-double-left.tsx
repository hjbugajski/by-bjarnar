import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronDoubleLeft({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M10.0001 6.93945L4.93945 12.0001L10.0001 17.0608L11.0608 16.0001L7.06077 12.0001L11.0608 8.00011L10.0001 6.93945Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0001 6.93945L11.9395 12.0001L17.0001 17.0608L18.0608 16.0001L14.0608 12.0001L18.0608 8.00011L17.0001 6.93945Z"
        fill="currentColor"
      />
    </svg>
  );
}
