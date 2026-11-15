import type { ReactNode } from 'react';
import { cn, initials, avatarColor, toneFor } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';

type Tone = ReturnType<typeof toneFor>;

const toneClass: Record<Tone, string> = { g: 'sg', y: 'sy', r: 'sr' };

export function StatusBadge({ status, onClick, disabled }: { status: string; onClick?: () => void; disabled?: boolean }) {
  const tone = toneFor(status);
  if (!onClick) {
    return <span className={cn('badge', toneClass[tone])}>{status}</span>;
  }
  return (
    <button
      type="button"
      className={cn('bd', toneClass[tone])}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title={disabled ? 'Your role cannot update records' : `Cycle status from ${status}`}
      aria-label={`Status ${status}. Activate to change status`}
    >
      {status}
    </button>
  );
}

export function ToneTag({ children, tone = 't0' }: { children: ReactNode; tone?: 't0' | 't1' | 't2' | 't3' }) {
  return <span className={cn('tg', tone)}>{children}</span>;
}

export function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  return (
    <span
      className={cn('av', size === 'lg' && 'lg')}
      style={{ background: avatarColor(name) }}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </span>
  );
}

/** Guard content by module + action. */
export function Can({
  module,
  action,
  children,
  fallback = null,
}: {
  module: Parameters<ReturnType<typeof usePermissions>['can']>[0];
  action: Parameters<ReturnType<typeof usePermissions>['can']>[1];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = usePermissions();
  return <>{can(module, action) ? children : fallback}</>;
}
