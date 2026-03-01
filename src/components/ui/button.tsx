'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-sm font-medium no-underline transition focus-visible:ring-2 focus-visible:ring-gold-7 focus-visible:ring-offset-2 focus-visible:ring-offset-gold-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gold-3 disabled:text-gold-8',
  {
    variants: {
      variant: {
        primary:
          'not-disabled:bg-green-11 not-disabled:text-green-1 not-disabled:hover:bg-green-12 not-disabled:hover:text-green-2',
        secondary:
          'not-disabled:border not-disabled:border-gold-6 not-disabled:bg-gold-3 not-disabled:text-gold-11 not-disabled:hover:border-gold-8 not-disabled:hover:bg-gold-4 not-disabled:hover:text-gold-12',
        tertiary: 'not-disabled:hover:bg-gold-4 not-disabled:hover:text-gold-12',
      },
      size: {
        sm: 'h-8 gap-1 text-xs',
        md: 'h-9 gap-1.5 text-sm',
        lg: 'h-10 gap-2 text-base',
      },
      iconPosition: {
        left: 'flex-row-reverse',
        right: 'flex-row',
        center: 'flex-row',
        none: 'flex-row',
      },
    },
    compoundVariants: [
      {
        iconPosition: 'none',
        size: 'sm',
        className: 'px-3',
      },
      {
        iconPosition: 'none',
        size: 'md',
        className: 'px-4',
      },
      {
        iconPosition: 'none',
        size: 'lg',
        className: 'px-5',
      },
      {
        iconPosition: 'left',
        size: 'sm',
        className: 'pr-3 pl-2',
      },
      {
        iconPosition: 'left',
        size: 'md',
        className: 'pr-4 pl-3',
      },
      {
        iconPosition: 'left',
        size: 'lg',
        className: 'pr-5 pl-4',
      },
      {
        iconPosition: 'right',
        size: 'sm',
        className: 'pr-2 pl-3',
      },
      {
        iconPosition: 'right',
        size: 'md',
        className: 'pr-3 pl-4',
      },
      {
        iconPosition: 'right',
        size: 'lg',
        className: 'pr-4 pl-5',
      },
      {
        iconPosition: 'center',
        size: 'sm',
        className: 'size-8',
      },
      {
        iconPosition: 'center',
        size: 'md',
        className: 'size-9',
      },
      {
        iconPosition: 'center',
        size: 'lg',
        className: 'size-10',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconPosition: 'none',
    },
  },
);

type Props = useRender.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  iconPosition,
  // oxlint-disable-next-line react/button-has-type
  render = <button />,
  size,
  variant,
  ...props
}: Props) {
  const defaultProps: Props = {
    className: cn(buttonVariants({ variant, size, iconPosition }), className),
  };

  return useRender({ defaultTagName: 'button', render, props: mergeProps(defaultProps, props) });
}
