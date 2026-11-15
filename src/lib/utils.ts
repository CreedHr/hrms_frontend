import type { Role, WidgetState } from '@/types';

/** Tiny classname joiner. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const uid = (prefix = 'r'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

export const CHART_PALETTE = ['#2b9cf2', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#facc15'];

export const AVATAR_PALETTE = [
  '#2b9cf2',
  '#a78bfa',
  '#34d399',
  '#fb923c',
  '#f472b6',
  '#facc15',
  '#38bdf8',
  '#c084fc',
];

export const avatarColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] as string;
};

/** Status tone: success = green, danger = red, everything else = amber. */
const SUCCESS = new Set([
  'Active',
  'Present',
  'Paid',
  'Approved',
  'Signed',
  'Published',
  'Assigned',
  'Resolved',
  'Booked',
  'Reviewed',
  'Available',
  'Hired',
]);

const DANGER = new Set([
  'Absent',
  'Rejected',
  'Repair',
  'Closed',
  'Not Started',
  'Open',
  'Over limit',
]);

export type Tone = 'g' | 'y' | 'r';

export const toneFor = (status: string): Tone => {
  if (SUCCESS.has(status)) return 'g';
  if (DANGER.has(status)) return 'r';
  return 'y';
};

export const money = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1000) return `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return `$${value}`;
  }
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};

export const num = (value: number): string => value.toLocaleString('en-US');

/** Readable text colour for an accent background. */
export const contrastText = (hex: string): string => {
  const clean = hex.replace('#', '');
  const expand =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(expand.slice(0, 2), 16) / 255;
  const g = parseInt(expand.slice(2, 4), 16) / 255;
  const b = parseInt(expand.slice(4, 6), 16) / 255;
  const lin = (c: number): number => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.6 ? '#111111' : '#ffffff';
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const shortDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const monthLabel = (value: string): string => {
  const date = new Date(`${value}-01`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const DEFAULT_WIDGETS: WidgetState[] = [
  { id: 'pulse', span: 8, hidden: false },
  { id: 'ai', span: 4, hidden: false },
  { id: 'kpi', span: 12, hidden: false },
  { id: 'grow', span: 7, hidden: false },
  { id: 'mix', span: 5, hidden: false },
  { id: 'attr', span: 6, hidden: false },
  { id: 'eng', span: 6, hidden: false },
];

/** Chart.js runtime defaults — fonts and ticks follow the tokens. */
export const chartFont = (): string => {
  if (typeof window === 'undefined') return 'Plus Jakarta Sans, sans-serif';
  return getComputedStyle(document.documentElement).getPropertyValue('--ff').trim() || 'sans-serif';
};

export const mutedColor = (): string => {
  if (typeof window === 'undefined') return '#8b97b5';
  return getComputedStyle(document.documentElement).getPropertyValue('--mut').trim() || '#8b97b5';
};

export const accentColor = (): string => {
  if (typeof window === 'undefined') return '#2b9cf2';
  return getComputedStyle(document.documentElement).getPropertyValue('--ac').trim() || '#2b9cf2';
};

export const isSensitiveWidget = (id: string, role: Role): boolean =>
  role === 'Employee' && (id === 'mix' || id === 'attr');
