import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none disabled:opacity-50 active:scale-95 shadow-sm",
          variant === 'primary' && "bg-art-primary text-white hover:bg-art-secondary",
          variant === 'secondary' && "bg-art-accent text-art-text hover:bg-art-border",
          variant === 'ghost' && "hover:bg-art-accent/10 text-art-primary",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
