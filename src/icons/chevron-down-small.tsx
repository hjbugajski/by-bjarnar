import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronDownSmall({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M12.0001 15.0605L17.0608 9.99989L16.0001 8.93923L12.0001 12.9392L8.00011 8.93923L6.93945 9.99989L12.0001 15.0605Z"
        fill="currentColor"
      />
    </svg>
  );
}
