import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/overlay';
import { useToast } from '@/components/ui/toast';
import { SEED_DB } from '@/mocks/seed';
import { shortDate } from '@/lib/utils';

type EventKind = 'holiday' | 'leave' | 'interview' | 'training' | 'meeting';

interface CalendarEvent {
  date: string;
  title: string;
  kind: EventKind;
  meta: string;
}

const KIND_TONE: Record<EventKind, string> = {
  holiday: 't1',
  leave: 't2',
  interview: 't0',
  training: 't3',
  meeting: 't0',
};

const iso = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const buildEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  (SEED_DB.holidays ?? []).forEach((row) =>
    events.push({ date: String(row.date), title: String(row.name), kind: 'holiday', meta: String(row.type ?? '') }),
  );
  (SEED_DB.leave ?? []).forEach((row) =>
    events.push({
      date: String(row.from),
      title: `${row.employee} on leave`,
      kind: 'leave',
      meta: `${row.type} · ${row.days} days`,
    }),
  );
  (SEED_DB.interviews ?? []).forEach((row) =>
    events.push({
      date: String(row.date),
      title: `${row.candidate} interview`,
      kind: 'interview',
      meta: `${row.round} · ${row.time}`,
    }),
  );
  (SEED_DB.trainingSessions ?? []).forEach((row) =>
    events.push({ date: String(row.date), title: String(row.program), kind: 'training', meta: String(row.venue ?? '') }),
  );
  (SEED_DB.meetings ?? []).forEach((row) =>
    events.push({
      date: String(row.date),
      title: String(row.title),
      kind: 'meeting',
      meta: `${row.time} · ${row.room}`,
    }),
  );
  return events;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarPage() {
  const { push } = useToast();
  const events = useMemo(buildEvents, []);
  const [cursor, setCursor] = useState({ year: 2026, month: 10 });
  const [selected, setSelected] = useState<string | null>(null);
  const [kind, setKind] = useState<'all' | EventKind>('all');

  const filtered = events.filter((event) => kind === 'all' || event.kind === kind);

  const firstDay = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leading = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsOn = (day: number): CalendarEvent[] =>
    filtered.filter((event) => event.date === iso(cursor.year, cursor.month, day));

  const shift = (direction: -1 | 1) => {
    setCursor((current) => {
      const month = current.month + direction;
      if (month < 0) return { year: current.year - 1, month: 11 };
      if (month > 11) return { year: current.year + 1, month: 0 };
      return { year: current.year, month };
    });
  };

  const selectedEvents = selected ? filtered.filter((event) => event.date === selected) : [];

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Holidays, leave, interviews, training sessions and meetings in one view."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Download size={14} />}
              onClick={() => push('Calendar exported as iCal (demo)')}
            >
              Export iCal
            </Button>
            <Button icon={<Plus size={14} />} onClick={() => push('Open the Holidays module to add an event')}>
              Add event
            </Button>
          </>
        }
      />

      <div className="toolbar">
        <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />} onClick={() => shift(-1)}>
          Prev
        </Button>
        <b style={{ fontSize: 15 }}>
          {MONTHS[cursor.month]} {cursor.year}
        </b>
        <Button variant="ghost" size="sm" onClick={() => shift(1)}>
          Next <ChevronRight size={14} />
        </Button>
        <div className="spacer" />
        {(['all', 'holiday', 'leave', 'interview', 'training', 'meeting'] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`pill${kind === item ? ' on' : ''}`}
            onClick={() => setKind(item)}
          >
            {item === 'all' ? 'All events' : item}
          </button>
        ))}
      </div>

      <Card style={{ padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, fontSize: 10.5, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} style={{ padding: '0 6px' }}>
              {day}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
          {cells.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;
            const date = iso(cursor.year, cursor.month, day);
            const dayEvents = eventsOn(day);
            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelected(date)}
                style={{
                  textAlign: 'left',
                  minHeight: 86,
                  padding: 7,
                  borderRadius: 10,
                  border: `1px solid ${date === selected ? 'var(--ac)' : 'var(--bd)'}`,
                  background: 'color-mix(in srgb, var(--bg) 40%, var(--card))',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  font: 'inherit',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mut)' }}>{day}</span>
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={`${event.title}-${event.date}`}
                    className={`tg ${KIND_TONE[event.kind]}`}
                    style={{ fontSize: 9.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 ? (
                  <span className="mut" style={{ fontSize: 9.5 }}>
                    +{dayEvents.length - 2} more
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <Drawer
        open={Boolean(selected)}
        title={selected ? shortDate(selected) : 'Day'}
        subtitle={`${selectedEvents.length} event(s)`}
        onClose={() => setSelected(null)}
      >
        {selectedEvents.length === 0 ? (
          <p className="mut" style={{ fontSize: 12.5 }}>
            Nothing scheduled on this day.
          </p>
        ) : (
          selectedEvents.map((event) => (
            <div className="thread" key={`${event.title}-${event.date}`}>
              <span className={`tg ${KIND_TONE[event.kind]}`}>{event.kind}</span>
              <div>
                <b>{event.title}</b>
                <small>{event.meta}</small>
              </div>
            </div>
          ))
        )}
      </Drawer>
    </div>
  );
}
