import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function IconChevronGrabber({ className, ...props }: ComponentProps<'svg'>) {
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
        d="M12.0001 3.93945L17.0608 9.00011L16.0001 10.0608L12.0001 6.06077L8.00011 10.0608L6.93945 9.00011L12.0001 3.93945ZM8.00011 13.9395L12.0001 17.9395L16.0001 13.9395L17.0608 15.0001L12.0001 20.0608L6.93945 15.0001L8.00011 13.9395Z"
        fill="currentColor"
      />
    </svg>
  );
}
