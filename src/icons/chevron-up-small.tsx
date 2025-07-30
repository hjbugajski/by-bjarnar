import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronUpSmall({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M12.0001 8.93945L17.0608 14.0001L16.0001 15.0608L12.0001 11.0608L8.00011 15.0608L6.93945 14.0001L12.0001 8.93945Z"
        fill="currentColor"
      />
    </svg>
  );
}
