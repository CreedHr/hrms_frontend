import { useMemo, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button, Pill } from '@/components/ui/button';
import { Progress } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';
import { DEMO_ORG } from '@/lib/demo';
import { money } from '@/lib/utils';
import type { Plan } from '@/types';

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: 0,
    tagline: 'Tiny teams getting started',
    features: ['25 employees', '3 core modules', 'Basic reports', 'Community support'],
  },
  {
    name: 'Starter',
    price: 4,
    tagline: 'Growing teams, core HR',
    features: ['100 employees', '8 modules', 'Basic roles & permissions', 'Email support'],
  },
  {
    name: 'Professional',
    price: 9,
    tagline: 'Full HR suite + analytics',
    features: ['500 employees', 'All 12 modules', 'Granular permissions', 'Advanced analytics'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'custom',
    tagline: 'Scale, security, SLAs',
    features: ['Unlimited employees', 'All 12 + custom modules', 'SSO & audit trail', 'Dedicated support'],
  },
];

const LIMITS = {
  employees: [25, 100, 500, 5000],
  storage: [1, 20, 100, 1000],
  adminSeats: [1, 3, 10, 50],
};

const USAGE = { employees: 498, storage: 38, adminSeats: 7 };

const COMPARE: { feature: string; values: string[] }[] = [
  { feature: 'Employees', values: ['25', '100', '500', 'Unlimited'] },
  { feature: 'Modules', values: ['3', '8', 'All 12', 'All 12 + custom'] },
  { feature: 'Custom dashboards', values: ['—', '—', '✓', '✓'] },
  { feature: 'Roles & permissions', values: ['—', 'Basic', 'Granular', 'Granular + SSO'] },
  { feature: 'Advanced analytics', values: ['—', '—', '✓', '✓'] },
  { feature: 'Storage', values: ['1 GB', '20 GB', '100 GB', '1 TB'] },
  { feature: 'Support', values: ['Community', 'Email', 'Priority', 'Dedicated'] },
];

const usageTone = (pct: number): 'warn' | 'over' | undefined =>
  pct > 100 ? 'over' : pct >= 90 ? 'warn' : undefined;

export default function PlansPage() {
  const [yearly, setYearly] = useState(false);
  const [current, setCurrent] = useState('Professional');
  const { push } = useToast();

  const currentIndex = Math.max(
    0,
    PLANS.findIndex((plan) => plan.name === current),
  );

  const usage = useMemo(
    () => [
      {
        label: 'Employees',
        used: USAGE.employees,
        limit: LIMITS.employees[currentIndex] ?? 500,
      },
      { label: 'Storage', used: USAGE.storage, limit: LIMITS.storage[currentIndex] ?? 100, unit: 'GB' },
      {
        label: 'Admin seats',
        used: USAGE.adminSeats,
        limit: LIMITS.adminSeats[currentIndex] ?? 10,
      },
    ],
    [currentIndex],
  );

  const priceFor = (plan: Plan): string => {
    if (plan.price === 'custom') return 'Custom';
    if (plan.price === 0) return '$0';
    const value = yearly ? plan.price * 0.8 : plan.price;
    return `$${Number(value.toFixed(1))}`;
  };

  return (
    <div>
      <PageHeader
        title="Subscription plans"
        subtitle={
          <>
            Current plan: <b style={{ color: 'var(--fg)' }}>{current}</b> · {DEMO_ORG.people} people
          </>
        }
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <Pill active={!yearly} onClick={() => setYearly(false)}>
              Billed monthly
            </Pill>
            <Pill active={yearly} onClick={() => setYearly(true)}>
              Billed yearly −20%
            </Pill>
          </div>
        }
      />

      <div className="plans">
        {PLANS.map((plan, index) => {
          const isCurrent = plan.name === current;
          const isHigher = index > currentIndex;
          const label = isCurrent
            ? 'Current plan'
            : plan.price === 'custom'
              ? 'Contact sales'
              : isHigher
                ? 'Upgrade'
                : 'Downgrade';
          return (
            <div
              key={plan.name}
              className={`plan${plan.popular ? ' pop' : ''}${isCurrent ? ' current' : ''}`}
            >
              {plan.popular ? (
                <span className="flag">
                  <Sparkles size={9} style={{ verticalAlign: 'middle' }} /> POPULAR
                </span>
              ) : null}
              <h4>{plan.name}</h4>
              <div className="price">
                {priceFor(plan)}
                {plan.price !== 'custom' ? (
                  <small> /emp/mo{yearly ? ', billed yearly' : ''}</small>
                ) : (
                  <small> pricing</small>
                )}
              </div>
              <div className="mut" style={{ fontSize: 12 }}>
                {plan.tagline}
              </div>
              <ul className="fl">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check /> {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={isCurrent ? 'ghost' : plan.popular ? 'primary' : 'ghost'}
                disabled={isCurrent}
                onClick={() => {
                  if (plan.price === 'custom') {
                    push('Sales will reach out (demo)');
                    return;
                  }
                  setCurrent(plan.name);
                  push(`Plan changed to ${plan.name} (demo)`);
                }}
              >
                {label}
              </Button>
            </div>
          );
        })}
      </div>

      <Card title="Usage & limits" style={{ marginBottom: 18 }}>
        <div className="kp">
          {usage.map((item) => {
            const pct = (item.used / item.limit) * 100;
            const tone = usageTone(pct);
            return (
              <div key={item.label} className="kc" style={{ padding: 0, border: 0, background: 'none' }}>
                <small>
                  {item.label} · {item.used}
                  {item.unit ? ` ${item.unit}` : ''} of {item.limit}
                  {item.unit ? ` ${item.unit}` : ''}
                </small>
                <Progress value={pct} tone={tone} />
                <em
                  className={tone === 'over' ? 'ng' : tone === 'warn' ? '' : 'up'}
                  style={{ color: tone === 'warn' ? 'var(--y)' : undefined, fontSize: 12 }}
                >
                  {tone === 'over'
                    ? 'Over limit — upgrade required'
                    : tone === 'warn'
                      ? 'Near limit'
                      : `${Math.round(pct)}% used`}
                </em>
              </div>
            );
          })}
        </div>
        <p className="mut" style={{ fontSize: 12, marginTop: 10 }}>
          {money(0)} usage is illustrative demo data. Limit checks run against the {current} plan.
        </p>
      </Card>

      <Card title="Compare plans">
        <div className="tw">
          <table className="compare">
            <thead>
              <tr>
                <th>Feature</th>
                {PLANS.map((plan) => (
                  <th key={plan.name} className={plan.name === current ? 'on' : undefined}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  {row.values.map((value, index) => (
                    <td key={PLANS[index]?.name ?? index} className={PLANS[index]?.name === current ? 'on' : undefined}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
