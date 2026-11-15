import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type DataColumn } from '@/components/data/DataTable';
import type { HrRecord } from '@/types';

const rows: HrRecord[] = [
  { id: 'E101', name: 'Ava Patel', department: 'Engineering', status: 'Active' },
  { id: 'E102', name: 'Noah Kim', department: 'Sales', status: 'Active' },
];

const columns: DataColumn[] = [
  { key: 'name', header: 'Name', render: (row) => String(row.name) },
  { key: 'department', header: 'Department', render: (row) => String(row.department) },
];

describe('DataTable', () => {
  it('renders rows and the pagination summary', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        page={1}
        pageSize={6}
        total={8}
        onPage={() => undefined}
      />,
    );
    expect(screen.getByText('Ava Patel')).toBeInTheDocument();
    expect(screen.getByText('Noah Kim')).toBeInTheDocument();
    expect(screen.getByText('Showing 1–6 of 8')).toBeInTheDocument();
  });

  it('calls onPage when Next is pressed', async () => {
    const onPage = vi.fn();
    render(
      <DataTable columns={columns} rows={rows} page={1} pageSize={2} total={6} onPage={onPage} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it('shows the empty state when there are no rows', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        page={1}
        pageSize={6}
        total={0}
        onPage={() => undefined}
        emptyTitle="No records match your filters"
      />,
    );
    expect(screen.getByText('No records match your filters')).toBeInTheDocument();
  });

  it('deletes a row through the row action', async () => {
    const onDelete = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        page={1}
        pageSize={6}
        total={2}
        onPage={() => undefined}
        onDelete={onDelete}
      />,
    );
    const buttons = screen.getAllByRole('button', { name: 'Delete record' });
    await userEvent.click(buttons[0] as HTMLElement);
    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });
});
