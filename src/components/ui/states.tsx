import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <Inbox />
      <b>{title}</b>
      {body ? <span style={{ fontSize: 12.5 }}>{body}</span> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <AlertTriangle />
      <b>Could not load this list</b>
      <span style={{ fontSize: 12.5 }}>{message ?? 'The demo service failed to respond.'}</span>
      {onRetry ? (
        <Button variant="ghost" size="sm" icon={<RefreshCw />} onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export function SkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ display: 'grid', gap: 10, padding: 8 }} aria-busy="true" aria-label="Loading records">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
          {Array.from({ length: cols }).map((__, colIndex) => (
            <div
              key={colIndex}
              className="sk"
              style={{ height: rowIndex === 0 ? 10 : 16, opacity: rowIndex === 0 ? 0.6 : 1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Progress({ value, tone }: { value: number; tone?: 'warn' | 'over' }) {
  return (
    <div className={cn('meter', tone)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
