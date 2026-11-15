import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpCircle, Loader2, Plus, RotateCcw, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog, Drawer } from '@/components/ui/overlay';
import { useToast } from '@/components/ui/toast';
import { DataTable, type DataColumn } from '@/components/data/DataTable';
import { ModuleForm } from '@/features/modules/ModuleForm';
import { DetailExtras, ModuleExtras, RecruitmentKanban } from '@/features/modules/extras';
import { MODULES } from '@/features/modules/config';
import { usePermissions } from '@/hooks/usePermissions';
import { useRecords, useRemoveRecord, useUpdateRecord } from '@/services/queries';
import { strings } from '@/lib/strings';
import { shortDate, money } from '@/lib/utils';
import type { FieldDef, HrRecord, ModuleKey } from '@/types';

const PAGE_SIZE = 6;

export function ModulePage({ module }: { module: ModuleKey }) {
  const config = MODULES[module];
  const { can, accessLetters } = usePermissions();
  const { push } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ by?: string; dir?: 'asc' | 'desc' }>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HrRecord | null>(null);
  const [detail, setDetail] = useState<HrRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HrRecord | null>(null);
  const [view, setView] = useState<'table' | 'board'>('table');

  const query = useRecords(module, {
    search,
    status,
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort.by,
    sortDir: sort.dir,
  });
  const update = useUpdateRecord(module);
  const remove = useRemoveRecord(module);

  const tableFields = useMemo(() => config.fields.filter((field) => field.inTable), [config.fields]);
  const firstKey = config.fields[0]?.key ?? 'id';

  const renderCell = (field: FieldDef) => (row: HrRecord) => {
    const value = row[field.key];
    if (field.type === 'money') return <span className="mono">{money(Number(value ?? 0))}</span>;
    if (field.type === 'date') return <span className="mut">{shortDate(String(value ?? ''))}</span>;
    if (field.key === firstKey) {
      return (
        <div className="cell-person">
          <Avatar name={String(value ?? '')} />
          <div>
            <b>{String(value ?? '—')}</b>
            <small>
              {row.id}
              {row.department && row.department !== value ? ` · ${String(row.department)}` : ''}
            </small>
          </div>
        </div>
      );
    }
    return <span>{String(value ?? '—')}</span>;
  };

  const cycleStatus = (row: HrRecord) => {
    if (!can(module, 'update')) {
      push(strings.noPermissionUpdate, 'error');
      return;
    }
    const index = config.statuses.indexOf(row.status);
    const next = config.statuses[(index + 1) % config.statuses.length] ?? config.statuses[0] ?? 'Pending';
    update.mutate(
      { id: row.id, patch: { status: next } },
      {
        onSuccess: () => push(`${row.id} to ${next}`),
        onError: () => push(strings.recordError, 'error'),
      },
    );
  };

  const statusColumn: DataColumn = {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <StatusBadge
        status={row.status}
        disabled={!can(module, 'update')}
        onClick={() => cycleStatus(row)}
      />
    ),
  };

  const columns: DataColumn[] = [
    ...tableFields.map((field) => ({
      key: field.key,
      header: field.label,
      sortable: true,
      render: renderCell(field),
    })),
    statusColumn,
  ];

  const rows = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  const patchDetail = (patch: Partial<HrRecord>) => {
    if (!detail) return;
    update.mutate(
      { id: detail.id, patch },
      {
        onSuccess: (next) => {
          setDetail(next);
          push(strings.recordUpdated);
        },
        onError: () => push(strings.recordError, 'error'),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title={`${config.title}`}
        subtitle={
          <>
            {config.description}
            <br />
            <span className="mut" style={{ fontSize: 12 }}>
              {config.group.replace('-', ' ')} · {strings.access}: {accessLetters(module) || '—'}
            </span>
          </>
        }
        actions={
          module === 'recruitment' ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <Button
                variant={view === 'table' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('table')}
              >
                Table
              </Button>
              <Button
                variant={view === 'board' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('board')}
              >
                Kanban
              </Button>
            </div>
          ) : undefined
        }
      />

      <ModuleExtras module={module} />

      <Card>
        <div className="toolbar">
          <div className="input-wrap">
            <Search />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={`Search ${config.title.toLowerCase()}…`}
              aria-label={`Search ${config.title}`}
            />
          </div>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="">{strings.allStatus}</option>
            {config.statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="spacer" />
          {can(module, 'create') ? (
            <Button
              icon={<Plus size={15} />}
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Add
            </Button>
          ) : (
            <Button
              variant="ghost"
              icon={<Plus size={15} />}
              onClick={() => push(strings.noPermissionCreate, 'error')}
            >
              Add
            </Button>
          )}
        </div>

        {module === 'recruitment' && view === 'board' ? (
          <RecruitmentKanban rows={rows} />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            loading={query.isLoading}
            error={query.isError ? (query.error as Error).message : null}
            onRetry={() => void query.refetch()}
            onRowClick={(row) => setDetail(row)}
            onSortChange={(key, direction) => {
              setSort({ by: key || undefined, dir: key ? direction : undefined });
              setPage(1);
            }}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPage={setPage}
            onDelete={
              can(module, 'delete')
                ? (row) => setPendingDelete(row)
                : (row) => {
                    push(strings.noPermissionDelete, 'error');
                    void row;
                  }
            }
            deleteLabel={`Delete ${config.title.toLowerCase()} record`}
            emptyTitle={strings.noRows}
            emptyBody={strings.emptyBody}
          />
        )}
      </Card>

      <ModuleForm
        module={module}
        open={formOpen}
        record={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          push(editing ? strings.recordUpdated : strings.recordAdded);
        }}
      />

      <Drawer
        open={Boolean(detail)}
        title={detail ? String(detail[firstKey] ?? detail.id) : strings.details}
        subtitle={detail ? `${config.title} · ${detail.id}` : undefined}
        onClose={() => setDetail(null)}
        wide
      >
        {detail ? (
          <>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <Avatar name={String(detail[firstKey] ?? detail.id)} size="lg" />
              <div>
                <StatusBadge status={detail.status} />
                <div className="mut" style={{ fontSize: 12, marginTop: 4 }}>
                  {detail.id}
                </div>
              </div>
            </div>

            <dl className="kv">
              {config.fields
                .filter((field) => field.key !== 'status')
                .map((field) => (
                  <div key={field.key} style={{ display: 'contents' }}>
                    <dt>{field.label}</dt>
                    <dd>
                      {field.type === 'money'
                        ? money(Number(detail[field.key] ?? 0))
                        : field.type === 'date'
                          ? shortDate(String(detail[field.key] ?? ''))
                          : String(detail[field.key] ?? '—')}
                    </dd>
                  </div>
                ))}
            </dl>

            {can(module, 'update') ? (
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw size={13} />}
                onClick={() => {
                  setEditing(detail);
                  setDetail(null);
                  setFormOpen(true);
                }}
              >
                Edit record
              </Button>
            ) : null}

            <DetailExtras module={module} row={detail} onPatch={patchDetail} />

            {module === 'payroll' ? (
              <button
                type="button"
                className="x"
                style={{ marginTop: 12 }}
                onClick={() => {
                  navigate('/plans');
                  push('Payroll is included in the Professional plan');
                }}
              >
                <ArrowUpCircle size={13} /> Plan limits
              </button>
            ) : null}
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        body={strings.confirmDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove.mutate(pendingDelete.id, {
            onSuccess: () => {
              push(strings.recordDeleted);
              setPendingDelete(null);
            },
            onError: () => push(strings.recordError, 'error'),
          });
        }}
      />

      {update.isPending || remove.isPending ? (
        <div style={{ position: 'fixed', bottom: 24, left: 24, color: 'var(--mut)', display: 'flex', gap: 6 }}>
          <Loader2 size={14} className="spin" /> <span style={{ fontSize: 12 }}>Saving…</span>
        </div>
      ) : null}

    </div>
  );
}
