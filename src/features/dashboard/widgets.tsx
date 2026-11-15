import { Briefcase, CalendarCheck, CalendarDays, TrendingUp, Users } from 'lucide-react';
import type { Kpi } from '@/types';
import { Card } from '@/components/ui/card';
import { ToneTag } from '@/components/ui/badge';
import { DEPARTMENTS, ENGAGEMENT, GROWTH, INSIGHTS, KPIS, PULSE, TENURE } from '@/mocks/dashboard';
import {
  AttritionChart,
  ChartCard,
  DepartmentDoughnut,
  EngagementRadar,
  HeadcountLine,
} from '@/components/charts';

const KPI_ICONS = {
  users: Users,
  check: CalendarCheck,
  leave: CalendarDays,
  briefcase: Briefcase,
};

export function PulseWidget() {
  const pct = `${PULSE.checkedIn / PULSE.total * 100}`;
  return (
    <div className="hero">
      <small>Today&apos;s workforce pulse</small>
      <strong>
        {PULSE.rate.toFixed(1)}
        <span>%</span>
      </strong>
      <div style={{ fontSize: 13, opacity: 0.9 }}>
        {PULSE.checkedIn} of {PULSE.total} people checked in so far
      </div>
      <div className="bar" role="progressbar" aria-label="Check-in rate" aria-valuenow={PULSE.rate} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="hs">
        <span>
          <b>{String(PULSE.late).padStart(2, '0')}</b>
          Late arrivals
        </span>
        <span>
          <b>{String(PULSE.onLeave).padStart(2, '0')}</b>
          On leave
        </span>
        <span>
          <b>{String(PULSE.absent).padStart(2, '0')}</b>
          Absent
        </span>
      </div>
    </div>
  );
}

export function AiWidget() {
  const tones: Record<string, 't1' | 't2' | 't3'> = { Risk: 't3', Cost: 't2', Win: 't1' };
  return (
    <Card title="AI insights">
      {INSIGHTS.map((insight) => (
        <div className="ai" key={insight.title}>
          <ToneTag tone={tones[insight.tag] ?? 't0'}>{insight.tag}</ToneTag>
          <div>
            <b>{insight.title}</b>
            <small>{insight.body}</small>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function KpiStrip() {
  return (
    <div className="kp">
      {KPIS.map((kpi: Kpi) => {
        const Icon = KPI_ICONS[kpi.icon];
        return (
          <div className="kc" key={kpi.label}>
            <div className="ki">
              <Icon />
            </div>
            <small>{kpi.label}</small>
            <strong>{kpi.value}</strong>
            <em className={kpi.tone === 'up' ? 'up' : 'ng'}>
              {kpi.tone === 'up' ? '▲' : '▼'} {kpi.delta}
            </em>
          </div>
        );
      })}
    </div>
  );
}

export function GrowthWidget() {
  return (
    <ChartCard title="Headcount growth" action={<TrendingUp size={15} className="mut" />}>
      <HeadcountLine labels={GROWTH.labels} data={GROWTH.data} />
    </ChartCard>
  );
}

export function MixWidget() {
  const total = DEPARTMENTS.data.reduce((sum, value) => sum + value, 0);
  return (
    <Card title="Department mix">
      <div className="donut-wrap">
        <div className="donut" style={{ height: 176 }}>
          <DepartmentDoughnut labels={DEPARTMENTS.labels} data={DEPARTMENTS.data} />
          <div className="donut-center">
            <div>
              <b>248</b>
              <small>people</small>
            </div>
          </div>
        </div>
        <ul className="legend">
          {DEPARTMENTS.labels.map((label, index) => (
            <li key={label}>
              <i style={{ background: ['#2b9cf2', '#a78bfa', '#34d399', '#fb923c', '#f472b6'][index] }} />
              {label}
              <b>{Math.round(((DEPARTMENTS.data[index] ?? 0) / total) * 100)}%</b>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function AttritionWidget() {
  return (
    <ChartCard title="Attrition by tenure">
      <AttritionChart labels={TENURE.labels} exits={TENURE.exits} risk={TENURE.risk} />
      <div className="chart-legend">
        <span>
          <i style={{ background: 'rgba(43,156,242,.7)' }} /> Exits
        </span>
        <span>
          <i style={{ background: '#a78bfa' }} /> Risk score
        </span>
      </div>
    </ChartCard>
  );
}

export function EngagementWidget() {
  return (
    <ChartCard title="Engagement drivers">
      <EngagementRadar labels={ENGAGEMENT.labels} now={ENGAGEMENT.now} target={ENGAGEMENT.target} />
      <div className="chart-legend">
        <span>
          <i style={{ background: 'var(--ac)' }} /> Now
        </span>
        <span>
          <i style={{ background: '#a78bfa' }} /> Target
        </span>
      </div>
    </ChartCard>
  );
}
