import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Check,
  Download,
  Paperclip,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useRecords, useUpdateRecord } from '@/services/queries';
import { services } from '@/services';
import { commentsFor, addComment } from '@/services/comments';
import { DEMO_USER } from '@/lib/demo';
import { HEATMAP, LEAVE_BALANCE } from '@/mocks/dashboard';
import { money, todayISO } from '@/lib/utils';
import { PayrollBars, RatingBars, ChartCard } from '@/components/charts';
import { ClockPanel, useIsEmployee } from '@/features/attendance/ClockCard';
import type { Comment, Employee, HrRecord, ModuleKey } from '@/types';

const countBy = (rows: HrRecord[], key: string, value: string): number =>
  rows.filter((row) => String(row[key] ?? '') === value).length;

const download = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

function EmployeesExtras() {
  const { data } = useRecords('employees', { pageSize: 200 });
  const { push } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const rows = data?.items ?? [];

  const exportCsv = () => {
    const header = 'id,name,department,designation,email,status';
    const body = rows
      .map((row) =>
        [row.id, row.name, row.department, row.designation, row.email, row.status]
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');
    download('employees.csv', `${header}\n${body}`);
    push('employees.csv exported');
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = (lines[0] ?? '').split(',').map((h) => h.trim().replace(/"/g, ''));
    if (!headers.includes('name')) {
      push('CSV needs a "name" column', 'error');
      return;
    }
    const records = lines.slice(1).map((line) => {
      const cells = line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
      const record: Partial<HrRecord> = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] ?? '';
      });
      delete record.id;
      return record as Partial<Employee>;
    });
    for (const record of records) await services.employees.create(record);
    await queryClient.invalidateQueries({ queryKey: ['records', 'employees'] });
    push(`${records.length} employees imported`);
  };

  return (
    <>
      <div className="stats-strip">
        <div>
          <small>Headcount</small>
          <b>{rows.length}</b>
          <em>demo records</em>
        </div>
        <div>
          <small>Active</small>
          <b>{countBy(rows, 'status', 'Active')}</b>
          <em>on payroll</em>
        </div>
        <div>
          <small>On leave</small>
          <b>{countBy(rows, 'status', 'On Leave')}</b>
          <em>today</em>
        </div>
        <div>
          <small>Probation</small>
          <b>{countBy(rows, 'status', 'Probation')}</b>
          <em>review due</em>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRight: 0 }}>
          <Button variant="ghost" size="sm" icon={<Download size={13} />} onClick={exportCsv}>
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" icon={<Upload size={13} />} onClick={() => fileRef.current?.click()}>
            Import CSV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="text/csv"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importCsv(file);
              event.target.value = '';
            }}
          />
        </div>
      </div>
    </>
  );
}

function AttendanceExtras() {
  const isEmployee = useIsEmployee();
  return (
    <div className="extras two">
      <Card title="Check-in density · last 28 days">
        <div className="heat">
          {HEATMAP.map((level, index) => (
            <i
              key={index}
              title={`Day ${index + 1}: ${level} check-ins`}
              style={{ opacity: level === 0 ? 0.14 : 0.28 + level * 0.18 }}
            />
          ))}
        </div>
        <div className="heat-legend">
          <span>
            <i style={{ background: 'var(--ac)', opacity: 0.2 }} /> low
          </span>
          <span>
            <i style={{ background: 'var(--ac)', opacity: 0.9 }} /> high
          </span>
        </div>
      </Card>
      {isEmployee ? (
        <Card title="Today · clock in / clock out">
          <ClockPanel compact />
        </Card>
      ) : (
        <Card title="Today">
          <p className="mut" style={{ fontSize: 12.5 }}>
            Clock in / clock out is employee self-service. Switch the demo role to Employee to punch in.
          </p>
        </Card>
      )}
    </div>
  );
}

function LeaveExtras() {
  const { data } = useRecords('leave', { pageSize: 200 });
  const update = useUpdateRecord('leave');
  const { push } = useToast();
  const pending = (data?.items ?? []).filter((row) => row.status === 'Pending');

  return (
    <div className="extras two">
      <Card title="Leave balance">
        <div className="balances">
          {LEAVE_BALANCE.map((item) => (
            <div className="balance" key={item.type}>
              <small>{item.type}</small>
              <b>
                {item.left}
                <span className="mut" style={{ fontSize: 12 }}>
                  /{item.total}
                </span>
              </b>
              <div className="meter">
                <i style={{ width: `${(item.left / item.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title={`Approvals · ${pending.length} pending`}>
        {pending.length === 0 ? (
          <p className="mut" style={{ fontSize: 12.5 }}>
            No leave requests waiting for approval.
          </p>
        ) : (
          pending.slice(0, 3).map((row) => (
            <div className="thread" key={row.id}>
              <Avatar name={String(row.employee ?? '')} />
              <div style={{ flex: 1 }}>
                <b>
                  {String(row.employee)} · {String(row.type)}
                </b>
                <small>
                  {String(row.from)} → {String(row.to)} · {String(row.days)} days
                </small>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="x"
                  aria-label="Approve"
                  onClick={() =>
                    update.mutate(
                      { id: row.id, patch: { status: 'Approved' } },
                      { onSuccess: () => push('Leave approved') },
                    )
                  }
                  style={{ color: 'var(--g)' }}
                >
                  <Check />
                </button>
                <button
                  className="x"
                  aria-label="Reject"
                  onClick={() =>
                    update.mutate(
                      { id: row.id, patch: { status: 'Rejected' } },
                      { onSuccess: () => push('Leave rejected') },
                    )
                  }
                >
                  <X />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

function PayrollExtras() {
  const { data } = useRecords('payroll', { pageSize: 200 });
  const { push } = useToast();
  const rows = data?.items ?? [];
  const labels = rows.slice(0, 6).map((row) => String(row.employee ?? '').split(' ')[0] ?? '');
  const gross = rows.slice(0, 6).map((row) => Number(row.gross ?? 0));
  const net = rows.slice(0, 6).map((row) => Number(row.net ?? 0));
  const totalGross = rows.reduce((sum, row) => sum + Number(row.gross ?? 0), 0);
  const totalNet = rows.reduce((sum, row) => sum + Number(row.net ?? 0), 0);
  const [step, setStep] = useState(0);
  const steps = ['Review run', 'Approve payslips', 'Close payroll'];

  return (
    <div className="extras two">
      <ChartCard title="Gross vs net · current run" height={190}>
        <PayrollBars labels={labels} gross={gross} net={net} />
      </ChartCard>
      <Card title="Close payroll">
        <div className="stats-strip" style={{ marginBottom: 12 }}>
          <div>
            <small>Gross</small>
            <b>{money(totalGross)}</b>
          </div>
          <div>
            <small>Net</small>
            <b>{money(totalNet)}</b>
          </div>
        </div>
        <div style={{ fontSize: 12.5, marginBottom: 10 }}>
          {steps.map((label, index) => (
            <div key={label} style={{ display: 'flex', gap: 8, padding: '4px 0', color: index <= step ? 'var(--fg)' : 'var(--mut)' }}>
              <span aria-hidden="true">{index < step ? '✓' : index === step ? '◉' : '○'}</span>
              {label}
            </div>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (step >= steps.length - 1) {
              push('Payroll closed for this cycle (demo)');
              return;
            }
            setStep(step + 1);
            push(`${steps[step + 1]} ready`);
          }}
        >
          {step >= steps.length - 1 ? 'Finish' : steps[step + 1]}
        </Button>
      </Card>
    </div>
  );
}

export function RecruitmentKanban({ rows }: { rows: HrRecord[] }) {
  const stages = ['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  return (
    <>
      {rows.length === 0 ? (
        <p className="mut" style={{ fontSize: 12.5 }}>
          No candidates in this filter.
        </p>
      ) : (
        <div className="kanban">
          {stages.map((stage) => {
            const items = rows.filter((row) => row.stage === stage);
            return (
              <div className="kcol" key={stage}>
                <h4>
                  {stage} <span>{items.length}</span>
                </h4>
                {items.map((row) => (
                  <div className="kcard" key={row.id}>
                    <b>{String(row.name)}</b>
                    <small>{String(row.role)}</small>
                    <div className="mut" style={{ fontSize: 11, marginTop: 4 }}>
                      {String(row.experience ?? '')} · {String(row.source ?? '')}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function PerformanceExtras() {
  const { data } = useRecords('performance', { pageSize: 200 });
  const rows = data?.items ?? [];
  const buckets = [1, 2, 3, 4, 5].map(
    (bucket) => rows.filter((row) => Math.floor(Number(row.rating ?? 0)) === bucket).length,
  );
  const rated = rows.filter((row) => Number(row.rating ?? 0) > 0);
  const average = rated.length
    ? rated.reduce((sum, row) => sum + Number(row.rating ?? 0), 0) / rated.length
    : 0;

  return (
    <div className="extras two">
      <ChartCard title="Rating distribution" height={190}>
        <RatingBars labels={['1★', '2★', '3★', '4★', '5★']} data={buckets} />
      </ChartCard>
      <Card title="Cycle summary">
        <div className="stats-strip" style={{ border: 0, margin: 0 }}>
          <div>
            <small>Average rating</small>
            <b>{average.toFixed(1)}</b>
          </div>
          <div>
            <small>Reviewed</small>
            <b>{countBy(rows, 'status', 'Reviewed')}</b>
          </div>
          <div style={{ borderRight: 0 }}>
            <small>In review</small>
            <b>{countBy(rows, 'status', 'In Review')}</b>
          </div>
        </div>
        <p className="mut" style={{ fontSize: 12.5 }}>
          Self-review opens for all employees on 1 Dec. Ratings are visible to managers and HR only.
        </p>
      </Card>
    </div>
  );
}

function ShiftsExtras() {
  const { data } = useRecords('shifts', { pageSize: 200 });
  const rows = data?.items ?? [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <Card title="Weekly roster">
      <div className="tw">
        <table className="roster">
          <thead>
            <tr>
              <th>Team</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(new Set(rows.map((row) => String(row.team)))).map((team) => {
              const shift = rows.find((row) => row.team === team);
              return (
                <tr key={team}>
                  <td className="team">{team}</td>
                  {days.map((day, index) => (
                    <td key={day}>
                      {index < 5 || team === 'Support' ? (
                        <span>{String(shift?.shift ?? '').split(' ')[0]}</span>
                      ) : (
                        <span className="mut">off</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ExpensesExtras() {
  const { data } = useRecords('expenses', { pageSize: 200 });
  const rows = data?.items ?? [];
  const sum = (status: string) =>
    rows.filter((row) => row.status === status).reduce((total, row) => total + Number(row.amount ?? 0), 0);

  return (
    <div className="stats-strip">
      <div>
        <small>Pending</small>
        <b>{money(sum('Pending'))}</b>
        <em>
          <Paperclip size={10} style={{ verticalAlign: 'middle' }} /> receipts attached
        </em>
      </div>
      <div>
        <small>Approved</small>
        <b>{money(sum('Approved'))}</b>
        <em>this cycle</em>
      </div>
      <div style={{ borderRight: 0 }}>
        <small>Rejected</small>
        <b>{money(sum('Rejected'))}</b>
        <em>needs resubmission</em>
      </div>
    </div>
  );
}

function DocumentsExtras() {
  const { data } = useRecords('documents', { pageSize: 200 });
  const { push } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const rows = data?.items ?? [];

  return (
    <div className="stats-strip">
      <div>
        <small>Signed</small>
        <b>{countBy(rows, 'status', 'Signed')}</b>
      </div>
      <div>
        <small>Published</small>
        <b>{countBy(rows, 'status', 'Published')}</b>
      </div>
      <div>
        <small>Pending signature</small>
        <b>{countBy(rows, 'status', 'Pending')}</b>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', borderRight: 0 }}>
        <Button variant="ghost" size="sm" icon={<Upload size={13} />} onClick={() => fileRef.current?.click()}>
          Upload file
        </Button>
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            await services.documents.create({
              name: file.name.replace(/\.[^.]+$/, ''),
              owner: 'HR',
              size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
              updated: todayISO(),
              status: 'Pending',
            });
            await queryClient.invalidateQueries({ queryKey: ['records', 'documents'] });
            push(`${file.name} uploaded`);
            event.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

function AssetsExtras() {
  const { data } = useRecords('assets', { pageSize: 200 });
  const rows = data?.items ?? [];
  return (
    <div className="stats-strip">
      <div>
        <small>Assigned</small>
        <b>{countBy(rows, 'status', 'Assigned')}</b>
      </div>
      <div>
        <small>Available</small>
        <b>{countBy(rows, 'status', 'Available')}</b>
      </div>
      <div style={{ borderRight: 0 }}>
        <small>In repair</small>
        <b>{countBy(rows, 'status', 'Repair')}</b>
      </div>
    </div>
  );
}

function ComplaintsExtras() {
  const { data } = useRecords('complaints', { pageSize: 200 });
  const rows = data?.items ?? [];
  return (
    <div className="stats-strip">
      <div>
        <small>Open</small>
        <b>{countBy(rows, 'status', 'Open')}</b>
      </div>
      <div>
        <small>In progress</small>
        <b>{countBy(rows, 'status', 'In Progress')}</b>
      </div>
      <div>
        <small>High priority</small>
        <b>{countBy(rows, 'priority', 'High')}</b>
      </div>
      <div style={{ borderRight: 0 }}>
        <small>Resolved</small>
        <b>{countBy(rows, 'status', 'Resolved')}</b>
      </div>
    </div>
  );
}

function TravelExtras() {
  const { data } = useRecords('travel', { pageSize: 200 });
  const rows = data?.items ?? [];
  return (
    <div className="stats-strip">
      <div>
        <small>Requested</small>
        <b>{rows.length}</b>
      </div>
      <div>
        <small>Approved</small>
        <b>{countBy(rows, 'status', 'Approved')}</b>
      </div>
      <div style={{ borderRight: 0 }}>
        <small>Booked</small>
        <b>{countBy(rows, 'status', 'Booked')}</b>
      </div>
    </div>
  );
}

function ApprovalExtras({
  module,
  label,
  approveLabel = 'Approve',
  rejectLabel = 'Reject',
  approvedStatus = 'Approved',
  rejectedStatus = 'Rejected',
}: {
  module: ModuleKey;
  label: string;
  approveLabel?: string;
  rejectLabel?: string;
  approvedStatus?: string;
  rejectedStatus?: string;
}) {
  const { data } = useRecords(module, { pageSize: 200 });
  const update = useUpdateRecord(module);
  const { push } = useToast();
  const rows = data?.items ?? [];
  const pending = rows.filter((row) => row.status === 'Pending');

  return (
    <div className="extras two">
      <div className="stats-strip">
        <div>
          <small>Total</small>
          <b>{rows.length}</b>
        </div>
        <div>
          <small>Pending</small>
          <b>{pending.length}</b>
        </div>
        <div style={{ borderRight: 0 }}>
          <small>{approvedStatus}</small>
          <b>{rows.filter((row) => row.status === approvedStatus).length}</b>
        </div>
      </div>
      <Card title={`${label} · ${pending.length} waiting`}>
        {pending.length === 0 ? (
          <p className="mut" style={{ fontSize: 12.5 }}>
            Nothing waiting for approval.
          </p>
        ) : (
          pending.slice(0, 3).map((row) => (
            <div className="thread" key={row.id}>
              <Avatar name={String(row.company ?? row.candidate ?? row.name ?? row.id)} />
              <div style={{ flex: 1 }}>
                <b>{String(row.company ?? row.candidate ?? row.name ?? row.id)}</b>
                <small>
                  {row.plan ? `${String(row.plan)} · ` : ''}
                  {String(row.requestedOn ?? row.joinedOn ?? row.date ?? '')}
                </small>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="x"
                  aria-label={approveLabel}
                  style={{ color: 'var(--g)' }}
                  onClick={() =>
                    update.mutate(
                      { id: row.id, patch: { status: approvedStatus } },
                      { onSuccess: () => push(`${row.id} ${approvedStatus.toLowerCase()}`) },
                    )
                  }
                >
                  <Check />
                </button>
                <button
                  className="x"
                  aria-label={rejectLabel}
                  onClick={() =>
                    update.mutate(
                      { id: row.id, patch: { status: rejectedStatus } },
                      { onSuccess: () => push(`${row.id} ${rejectedStatus.toLowerCase()}`) },
                    )
                  }
                >
                  <X />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

function CompaniesExtras() {
  const { data } = useRecords('companies', { pageSize: 200 });
  const rows = data?.items ?? [];
  const plans = ['Free', 'Starter', 'Professional', 'Enterprise'];
  return (
    <div className="stats-strip">
      <div>
        <small>Tenants</small>
        <b>{rows.length}</b>
        <em>demo companies</em>
      </div>
      <div>
        <small>Active</small>
        <b>{countBy(rows, 'status', 'Active')}</b>
      </div>
      {plans.map((plan, index) => (
        <div key={plan} style={index === plans.length - 1 ? { borderRight: 0 } : undefined}>
          <small>{plan}</small>
          <b>{countBy(rows, 'plan', plan)}</b>
        </div>
      ))}
    </div>
  );
}

function PayrollRunsExtras() {
  const { data } = useRecords('payrollRuns', { pageSize: 200 });
  const { push } = useToast();
  const rows = data?.items ?? [];
  const labels = rows.map((row) => String(row.period ?? '').split(' ')[0] ?? '');
  const gross = rows.map((row) => Number(row.gross ?? 0));
  const net = rows.map((row) => Number(row.net ?? 0));
  const [step, setStep] = useState(0);
  const steps = ['Review run', 'Approve payslips', 'Close payroll'];

  return (
    <div className="extras two">
      <ChartCard title="Run totals · gross vs net" height={190}>
        <PayrollBars labels={labels} gross={gross} net={net} />
      </ChartCard>
      <Card title="Close current run">
        <div style={{ fontSize: 12.5, marginBottom: 10 }}>
          {steps.map((label, index) => (
            <div key={label} style={{ display: 'flex', gap: 8, padding: '4px 0', color: index <= step ? 'var(--fg)' : 'var(--mut)' }}>
              <span aria-hidden="true">{index < step ? '✓' : index === step ? '◉' : '○'}</span>
              {label}
            </div>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (step >= steps.length - 1) {
              push('Payroll closed for November (demo)');
              return;
            }
            setStep(step + 1);
            push(`${steps[step + 1]} ready`);
          }}
        >
          {step >= steps.length - 1 ? 'Finish' : steps[step + 1]}
        </Button>
      </Card>
    </div>
  );
}

function JobPostingsExtras() {
  const { data } = useRecords('jobPostings', { pageSize: 200 });
  const update = useUpdateRecord('jobPostings');
  const { push } = useToast();
  const rows = data?.items ?? [];
  return (
    <div className="stats-strip">
      <div>
        <small>Published</small>
        <b>{countBy(rows, 'status', 'Published')}</b>
      </div>
      <div>
        <small>Drafts</small>
        <b>{countBy(rows, 'status', 'Draft')}</b>
      </div>
      <div>
        <small>Applicants</small>
        <b>{rows.reduce((sum, row) => sum + Number(row.applicants ?? 0), 0)}</b>
      </div>
      <div style={{ borderRight: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const draft = rows.find((row) => row.status === 'Draft');
            if (!draft) {
              push('No drafts to publish', 'error');
              return;
            }
            update.mutate(
              { id: draft.id, patch: { status: 'Published' } },
              { onSuccess: () => push(`${draft.title} published`) },
            );
          }}
        >
          Publish next draft
        </Button>
      </div>
    </div>
  );
}

export function ModuleExtras({ module }: { module: ModuleKey }) {
  switch (module) {
    case 'employees':
      return <EmployeesExtras />;
    case 'attendance':
      return <AttendanceExtras />;
    case 'leave':
      return <LeaveExtras />;
    case 'payroll':
      return <PayrollExtras />;
    case 'performance':
      return <PerformanceExtras />;
    case 'shifts':
      return <ShiftsExtras />;
    case 'expenses':
      return <ExpensesExtras />;
    case 'documents':
      return <DocumentsExtras />;
    case 'assets':
      return <AssetsExtras />;
    case 'complaints':
      return <ComplaintsExtras />;
    case 'companies':
      return <CompaniesExtras />;
    case 'payrollRuns':
      return <PayrollRunsExtras />;
    case 'jobPostings':
      return <JobPostingsExtras />;
    case 'planOrders':
      return <ApprovalExtras module="planOrders" label="Plan orders" approveLabel="Mark paid" rejectLabel="Reject order" approvedStatus="Paid" />;
    case 'planRequests':
      return <ApprovalExtras module="planRequests" label="Plan requests" />;
    case 'offers':
      return <ApprovalExtras module="offers" label="Offers" approveLabel="Accept" rejectLabel="Decline" approvedStatus="Accepted" rejectedStatus="Declined" />;
    case 'referral':
      return <ApprovalExtras module="referral" label="Referral payouts" approveLabel="Mark paid" rejectLabel="Reject payout" approvedStatus="Paid" />;
    case 'travel':
      return <TravelExtras />;
    default:
      return null;
  }
}

export function DetailExtras({
  module,
  row,
  onPatch,
}: {
  module: ModuleKey;
  row: HrRecord;
  onPatch: (patch: Partial<HrRecord>) => void;
}) {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState('');
  const [thread, setThread] = useState<Comment[]>(() => commentsFor(row.id));

  if (module === 'complaints') {
    return (
      <section>
        <h4>Conversation</h4>
        {thread.map((item) => (
          <div className="thread" key={item.id}>
            <Avatar name={item.author} />
            <div>
              <b>{item.author}</b>
              <small>{item.at}</small>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="comment">Add a comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a reply…"
          />
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (!comment.trim()) return;
            setThread(addComment(row.id, comment.trim(), DEMO_USER));
            setComment('');
            push('Comment posted');
          }}
        >
          Post reply
        </Button>
      </section>
    );
  }

  if (module === 'assets') {
    const assigned = row.status === 'Assigned';
    return (
      <section>
        <h4>Assignment</h4>
        <Button
          size="sm"
          variant={assigned ? 'ghost' : 'primary'}
          onClick={() => {
            onPatch(
              assigned
                ? { status: 'Available', assignee: '—', assignedOn: '—' }
                : { status: 'Assigned', assignee: DEMO_USER, assignedOn: todayISO() },
            );
            push(assigned ? 'Asset returned' : 'Asset assigned');
          }}
        >
          {assigned ? 'Return asset' : 'Assign to me'}
        </Button>
      </section>
    );
  }

  if (module === 'documents') {
    return (
      <section>
        <h4>Signature</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="ghost"
            icon={<Download size={13} />}
            onClick={() => push('Download stub — no file in the demo')}
          >
            Download
          </Button>
          {row.status !== 'Signed' ? (
            <Button size="sm" onClick={() => onPatch({ status: 'Signed' })}>
              Sign document
            </Button>
          ) : null}
        </div>
      </section>
    );
  }

  if (module === 'expenses') {
    return (
      <section>
        <h4>Receipt</h4>
        <Button size="sm" variant="ghost" icon={<Paperclip size={13} />} onClick={() => fileRef.current?.click()}>
          {row.receipt ? String(row.receipt) : 'Attach receipt'}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            onPatch({ receipt: file.name });
            push(`${file.name} attached`);
            event.target.value = '';
          }}
        />
        {row.status === 'Pending' ? (
          <Button size="sm" style={{ marginLeft: 8 }} onClick={() => onPatch({ status: 'Approved' })}>
            Approve expense
          </Button>
        ) : null}
      </section>
    );
  }

  if (module === 'leave' && row.status === 'Pending') {
    return (
      <section>
        <h4>Decision</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => onPatch({ status: 'Approved' })}>
            Approve
          </Button>
          <Button size="sm" variant="danger" onClick={() => onPatch({ status: 'Rejected' })}>
            Reject
          </Button>
        </div>
      </section>
    );
  }

  if (module === 'payroll') {
    return (
      <section>
        <h4>Payslip</h4>
        <dl className="kv">
          <dt>Gross</dt>
          <dd className="mono">{money(Number(row.gross ?? 0))}</dd>
          <dt>Deductions</dt>
          <dd className="mono">−{money(Number(row.deductions ?? 0))}</dd>
          <dt>Net pay</dt>
          <dd className="mono">{money(Number(row.net ?? 0))}</dd>
        </dl>
        <Button size="sm" variant="ghost" icon={<Download size={13} />} onClick={() => push('Payslip PDF stub')}>
          Download payslip
        </Button>
      </section>
    );
  }

  if (module === 'recruitment') {
    return (
      <section>
        <h4>Move stage</h4>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map((stage) => (
            <button
              key={stage}
              type="button"
              className={`pill${row.stage === stage ? ' on' : ''}`}
              onClick={() => onPatch({ stage })}
            >
              {stage}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (module === 'travel' && row.status === 'Pending') {
    return (
      <section>
        <h4>Approval</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => onPatch({ status: 'Approved' })}>
            Approve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onPatch({ status: 'Booked' })}>
            Book
          </Button>
        </div>
      </section>
    );
  }

  if (module === 'planOrders' && row.status !== 'Paid') {
    return (
      <section>
        <h4>Order decision</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => onPatch({ status: 'Paid' })}>
            Mark paid
          </Button>
          <Button size="sm" variant="danger" onClick={() => onPatch({ status: 'Rejected' })}>
            Reject order
          </Button>
        </div>
      </section>
    );
  }

  if (module === 'offers' && row.status === 'Pending') {
    return (
      <section>
        <h4>Offer decision</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => onPatch({ status: 'Accepted' })}>
            Mark accepted
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onPatch({ status: 'Declined' })}>
            Mark declined
          </Button>
        </div>
      </section>
    );
  }

  if (module === 'jobPostings') {
    return (
      <section>
        <h4>Posting</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="sm"
            onClick={() => onPatch({ status: row.status === 'Published' ? 'Closed' : 'Published' })}
          >
            {row.status === 'Published' ? 'Close posting' : 'Publish posting'}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h4>History</h4>
      <p className="mut" style={{ fontSize: 12.5 }}>
        Record created in the demo data set. Status changes and edits are stored locally.
      </p>
      <Button size="sm" variant="ghost" icon={<RefreshCw size={13} />} onClick={() => push('History refreshed')}>
        Refresh history
      </Button>
    </section>
  );
}
