import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn('btn', variant !== 'primary' && variant, size === 'sm' && 'small', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  indicator?: boolean;
}

export function IconButton({ label, children, indicator, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cn('icon-btn', className)} aria-label={label} title={label} {...rest}>
      {children}
      {indicator ? <s className="dot" /> : null}
    </button>
  );
}

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Pill({ active, className, children, type = 'button', ...rest }: PillProps) {
  return (
    <button type={type} className={cn('pill', active && 'on', className)} aria-pressed={active} {...rest}>
      {children}
    </button>
  );
}
