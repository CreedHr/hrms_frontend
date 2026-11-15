import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  action?: ReactNode;
  raw?: boolean;
}

export function Card({ title, action, raw, className, children, ...rest }: CardProps) {
  return (
    <div className={cn('card', raw && 'raw', className)} {...rest}>
      {title ? (
        <h3>
          <span>{title}</span>
          {action}
        </h3>
      ) : null}
      {children}
    </div>
  );
}
