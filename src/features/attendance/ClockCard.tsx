import { useEffect, useMemo, useState } from 'react';
import { LogIn, LogOut, MapPin, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToneTag } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useCreateRecord, useRecords, useUpdateRecord } from '@/services/queries';
import { DEMO_USER } from '@/lib/demo';
import { SEED_DB } from '@/mocks/seed';
import { useUiStore } from '@/store/ui';

const pad = (value: number) => String(value).padStart(2, '0');

const hhmm = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const isoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const minutesBetween = (from: Date, to: Date) => Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${pad(rest)}m` : `${rest}m`;
};

const startOf = (time: string, reference: Date) => {
  const [hours, minutes] = time.split(':').map(Number);
  const start = new Date(reference);
  start.setHours(hours || 0, minutes || 0, 0, 0);
  return start;
};

/**
 * Clock in / clock out is employee self-service only (nexhrms `permission:clock-in-out`
 * is granted to the employee role). Every other role never sees the punch controls.
 */
export const useIsEmployee = (): boolean => useUiStore((state) => state.role) === 'Employee';

export function ClockPanel({ compact = false }: { compact?: boolean }) {
  const isEmployee = useIsEmployee();
  if (!isEmployee) return null;
  return <ClockPanelInner compact={compact} />;
}

function ClockPanelInner({ compact = false }: { compact?: boolean }) {
  const { push } = useToast();
  const { data } = useRecords('attendance', { pageSize: 200 });
  const create = useCreateRecord('attendance');
  const update = useUpdateRecord('attendance');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const today = isoDate(now);
  const record = (data?.items ?? []).find((row) => row.employee === DEMO_USER && String(row.date) === today);
  const checkIn = record ? String(record.checkIn ?? '') : '';
  const checkOutRaw = record ? String(record.checkOut ?? '') : '';
  const clockedIn = Boolean(record) && checkIn !== '' && checkIn !== '—';
  const clockedOut = clockedIn && checkOutRaw !== '' && checkOutRaw !== '—';
  const checkOut = clockedOut ? checkOutRaw : '';
  const busy = create.isPending || update.isPending;

  const shift = useMemo(() => {
    const rows = SEED_DB.shifts ?? [];
    return rows.find((row) => row.team === 'Engineering') ?? rows[0];
  }, []);

  const elapsed = useMemo(() => {
    if (!clockedIn || clockedOut) return 0;
    return minutesBetween(startOf(checkIn, now), now);
  }, [clockedIn, clockedOut, checkIn, now]);

  const clockInNow = () => {
    if (clockedIn) {
      push('You are already clocked in today', 'error');
      return;
    }
    const time = hhmm(new Date());
    create.mutate(
      {
        employee: DEMO_USER,
        department: 'Engineering',
        date: today,
        checkIn: time,
        checkOut: '—',
        hours: 0,
        status: time > '09:15' ? 'Late' : 'Present',
      },
      {
        onSuccess: () => push(`Clocked in at ${time} · location captured`),
        onError: () => push('Could not clock in. Please try again.', 'error'),
      },
    );
  };

  const clockOutNow = () => {
    if (!record || !clockedIn) {
      push('Clock in first', 'error');
      return;
    }
    if (clockedOut) {
      push('You have already clocked out today', 'error');
      return;
    }
    const time = hhmm(new Date());
    const hours = Math.max(0.1, Math.round((minutesBetween(startOf(checkIn, new Date()), new Date()) / 60) * 10) / 10);
    update.mutate(
      { id: record.id, patch: { checkOut: time, hours } },
      {
        onSuccess: () => push(`Clocked out at ${time} · ${hours}h recorded`),
        onError: () => push('Could not clock out. Please try again.', 'error'),
      },
    );
  };

  const status = clockedOut ? (
    <ToneTag tone="t0">Day complete · {String(record?.hours ?? 0)}h</ToneTag>
  ) : clockedIn ? (
    <ToneTag tone="t1">Clocked in · {formatDuration(elapsed)} so far</ToneTag>
  ) : (
    <ToneTag tone="t3">Not clocked in</ToneTag>
  );

  const timeBox = (label: string, value: string, tone: string) => (
    <div
      style={{
        minWidth: 104,
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid var(--bd)',
        background: 'color-mix(in srgb, var(--bg) 45%, var(--card))',
      }}
    >
      <small style={{ display: 'block', fontSize: 10.5, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
        {label}
      </small>
      <b className="mono" style={{ fontSize: compact ? 15 : 17, color: tone }}>
        {value || '--:--'}
      </b>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: compact ? 12 : 20 }}>
      <div style={{ minWidth: 128 }}>
        <small style={{ fontSize: 11, color: 'var(--mut)', display: 'block' }}>
          {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })} · local time
        </small>
        <b className="mono" style={{ fontSize: compact ? 24 : 32, lineHeight: 1.15, display: 'block' }}>
          {hhmm(now)}
        </b>
        {status}
      </div>

      <div style={{ minWidth: 170, flex: 1 }}>
        <small style={{ fontSize: 11, color: 'var(--mut)', display: 'block' }}>
          {shift ? `${String(shift.shift)} · ${String(shift.hours)}` : 'General shift · 09:00–18:00'}
        </small>
        <small style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--mut)', marginTop: 4 }}>
          <MapPin size={12} /> Bengaluru HQ · GPS captured on punch
        </small>
        <small style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--mut)', marginTop: 2 }}>
          <Timer size={12} /> One session per day · hours calculated on clock out
        </small>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {timeBox('Clock in', checkIn === '—' ? '' : checkIn, 'var(--g)')}
        {timeBox('Clock out', checkOut, 'var(--dg)')}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button icon={<LogIn size={14} />} onClick={clockInNow} disabled={clockedIn || busy}>
          {create.isPending ? 'Clocking in…' : 'Clock in'}
        </Button>
        <Button
          variant={clockedIn && !clockedOut ? 'primary' : 'ghost'}
          icon={<LogOut size={14} />}
          onClick={clockOutNow}
          disabled={!clockedIn || clockedOut || busy}
        >
          {update.isPending ? 'Clocking out…' : 'Clock out'}
        </Button>
      </div>
    </div>
  );
}

export function ClockCard() {
  const isEmployee = useIsEmployee();
  if (!isEmployee) return null;
  return (
    <Card title="Attendance · clock in / clock out" style={{ marginBottom: 18 }}>
      <ClockPanelInner />
    </Card>
  );
}
