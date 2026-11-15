import { Building2, CreditCard, DollarSign, RefreshCw, Ticket, TrendingUp, UserPlus, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartCard, HeadcountLine, PayrollBars } from '@/components/charts';
import { useRecords } from '@/services/queries';
import { useNavigate } from 'react-router-dom';
import { money } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

const STATS = [
  { label: 'Total companies', value: '156', icon: Building2, tone: 'up', delta: '+9 this month' },
  { label: 'Total users', value: '3,420', icon: Users, tone: 'up', delta: '+12.4%' },
  { label: 'Total revenue', value: '$45,678', icon: DollarSign, tone: 'up', delta: 'MRR' },
  { label: 'Active plans', value: '89', icon: CreditCard, tone: 'up', delta: 'paid subscriptions' },
  { label: 'Pending requests', value: '12', icon: Ticket, tone: 'down', delta: 'need review' },
  { label: 'Monthly growth', value: '+15.2%', icon: TrendingUp, tone: 'up', delta: 'vs October' },
];

const ACTIVITY = [
  { id: 1, type: 'company', message: 'New company registered: TechCorp Inc.', time: '2 hours ago' },
  { id: 2, type: 'plan', message: 'Plan upgrade request from ABC Ltd.', time: '4 hours ago' },
  { id: 3, type: 'payment', message: 'Payment received: $299 from XYZ Corp', time: '6 hours ago' },
  { id: 4, type: 'domain', message: 'Domain request pending approval', time: '8 hours ago' },
  { id: 5, type: 'company', message: 'Nimbus Studio login disabled', time: 'yesterday' },
];

const TOP_PLANS = [
  { name: 'Professional', subscribers: 45, revenue: 13500 },
  { name: 'Starter', subscribers: 32, revenue: 9600 },
  { name: 'Enterprise', subscribers: 12, revenue: 7200 },
];

const REVENUE = { labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], data: [31200, 33800, 36400, 39100, 42300, 45678] };

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const companies = useRecords('companies', { pageSize: 5 });
  const rows = companies.data?.items ?? [];

  const planLabels = TOP_PLANS.map((plan) => plan.name);
  const planSubscribers = TOP_PLANS.map((plan) => plan.subscribers);

  return (
    <div>
      <PageHeader
        title="Platform overview"
        subtitle="Every tenant, subscription and platform event across Career Creed HR."
        actions={
          <Button
            variant="ghost"
            icon={<RefreshCw size={14} />}
            onClick={() => {
              void companies.refetch();
              push('Platform metrics refreshed');
            }}
          >
            Refresh
          </Button>
        }
      />

      <div className="kp" style={{ marginBottom: 18 }}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="kc" key={stat.label}>
              <div className="ki">
                <Icon />
              </div>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
              <em className={stat.tone === 'up' ? 'up' : 'ng'}>{stat.delta}</em>
            </div>
          );
        })}
      </div>

      <div className="grid12" style={{ marginBottom: 18 }}>
        <div style={{ gridColumn: 'span 8' }}>
          <ChartCard title="Recurring revenue (US$)" height={230}>
            <HeadcountLine labels={REVENUE.labels} data={REVENUE.data} />
          </ChartCard>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard title="Subscribers by plan" height={230}>
            <PayrollBars labels={planLabels} gross={planSubscribers} net={planSubscribers.map((value) => value + 18)} />
          </ChartCard>
        </div>
      </div>

      <div className="grid12">
        <div style={{ gridColumn: 'span 6' }}>
          <Card title="Recent activity">
            {ACTIVITY.map((item) => (
              <div className="ai" key={item.id}>
                <span
                  className={`led ${item.type === 'payment' ? '' : item.type === 'plan' ? 'y' : 'b'}`}
                  aria-hidden="true"
                />
                <div style={{ flex: 1 }}>
                  <b>{item.message}</b>
                  <small>
                    {item.time} · {item.type}
                  </small>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ gridColumn: 'span 6' }}>
          <Card
            title="Top performing plans"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/plan-orders')}>
                Orders
              </Button>
            }
          >
            {TOP_PLANS.map((plan, index) => (
              <div className="lr" key={plan.name}>
                <div className="ki" style={{ width: 32, height: 32, margin: 0 }}>
                  <b style={{ fontSize: 12 }}>#{index + 1}</b>
                </div>
                <div>
                  <b style={{ fontSize: 13 }}>{plan.name}</b>
                  <small>{plan.subscribers} subscribers</small>
                </div>
                <b className="mono">{money(plan.revenue)}</b>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <Card
            title="Newest companies"
            action={
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="ghost" size="sm" icon={<UserPlus size={13} />} onClick={() => navigate('/companies')}>
                  Manage tenants
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/plan-requests')}>
                  Plan requests
                </Button>
              </div>
            }
          >
            <div className="tw">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Plan</th>
                    <th>People</th>
                    <th>Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} onClick={() => navigate('/companies')}>
                      <td>
                        <div className="cell-person">
                          <div>
                            <b>{String(row.name)}</b>
                            <small>{String(row.email ?? '')}</small>
                          </div>
                        </div>
                      </td>
                      <td>{String(row.plan ?? '—')}</td>
                      <td className="mono">{String(row.people ?? 0)}</td>
                      <td className="mut">{String(row.created ?? '—')}</td>
                      <td>
                        <span className={`badge ${row.status === 'Active' ? 'sg' : 'sy'}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="mut" style={{ textAlign: 'center', padding: 24 }}>
                        Loading tenants…
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
