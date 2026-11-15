import type { Kpi } from '@/types';

export const PULSE = {
  rate: 92.4,
  checkedIn: 218,
  total: 248,
  late: 6,
  onLeave: 9,
  absent: 12,
};

export const KPIS: Kpi[] = [
  {
    label: 'Total employees',
    value: '248',
    delta: '+12.5% vs last month',
    tone: 'up',
    note: 'vs last month',
    icon: 'users',
  },
  {
    label: 'Present today',
    value: '218',
    delta: '92.4% rate',
    tone: 'up',
    note: 'check-in rate',
    icon: 'check',
  },
  {
    label: 'On leave',
    value: '9',
    delta: '3 departments',
    tone: 'down',
    note: '3 departments',
    icon: 'leave',
  },
  {
    label: 'Open roles',
    value: '12',
    delta: '5 offers out',
    tone: 'up',
    note: '5 offers out',
    icon: 'briefcase',
  },
];

export const GROWTH = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  data: [198, 207, 214, 226, 238, 248],
};

export const DEPARTMENTS = {
  labels: ['Engineering', 'Design', 'Sales', 'Marketing', 'HR'],
  data: [38, 22, 16, 14, 10],
};

export const TENURE = {
  labels: ['<1y', '1-2y', '2-3y', '3-5y', '5y+'],
  exits: [14, 9, 6, 4, 2],
  risk: [11, 10, 7, 5, 3],
};

export const ENGAGEMENT = {
  labels: ['Growth', 'Culture', 'Pay', 'Manager', 'Flexibility', 'Purpose'],
  now: [78, 86, 64, 81, 90, 72],
  target: [85, 85, 80, 85, 85, 80],
};

export const INSIGHTS: { tag: 'Risk' | 'Cost' | 'Win'; title: string; body: string }[] = [
  {
    tag: 'Risk',
    title: 'Engineering attrition may rise',
    body: '3 high performers show lower engagement',
  },
  {
    tag: 'Cost',
    title: 'Overtime up 18% in Design',
    body: 'Review project staffing this sprint',
  },
  {
    tag: 'Win',
    title: 'Time-to-hire down to 21 days',
    body: 'Best result in four quarters',
  },
];

export const LEAVE_BALANCE = [
  { type: 'Annual', left: 12, total: 18 },
  { type: 'Sick', left: 6, total: 8 },
  { type: 'Casual', left: 3, total: 6 },
  { type: 'Parental', left: 60, total: 60 },
];

export const HEATMAP = [
  1, 2, 3, 2, 1, 0, 1, 3, 4, 3, 2, 2, 1, 0, 2, 3, 4, 4, 3, 1, 0, 1, 2, 3, 3, 2, 1, 2,
];
