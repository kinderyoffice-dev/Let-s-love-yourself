import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-art-accent bg-white text-art-text shadow-[0_2px_8px_rgba(255,138,101,0.1)] transition-all",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
