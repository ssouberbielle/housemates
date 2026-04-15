import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full border-0 border-b bg-transparent px-0 py-3 font-mono text-lg tracking-[0.4em] text-bone placeholder:text-bone/15 caret-ember focus:outline-none focus:ring-0',
        invalid
          ? 'border-ember text-ember'
          : 'border-bone/25 focus:border-bone',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
