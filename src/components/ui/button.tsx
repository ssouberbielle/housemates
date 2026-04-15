import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.3em] text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bone focus-visible:ring-offset-4 focus-visible:ring-offset-ink',
  {
    variants: {
      variant: {
        solid: 'bg-bone text-ink hover:bg-ember hover:text-bone',
        ghost:
          'border border-bone/25 text-bone/80 hover:border-bone hover:text-bone',
        link:
          'text-bone/60 underline underline-offset-4 decoration-bone/20 hover:text-ember hover:decoration-ember',
      },
      size: {
        sm: 'h-8 px-4',
        md: 'h-11 px-7',
        lg: 'h-12 px-9',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
