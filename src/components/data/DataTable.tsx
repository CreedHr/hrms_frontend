import { useState, type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import type { HrRecord } from '@/types';
import { cn } from '@/lib/utils';
import { EmptyState, ErrorState, SkeletonRows } from '@/components/ui/states';
import { Button } from '@/components/ui/button';

export interface DataColumn {
  key: string;
  header: string;
  render: (row: HrRecord) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right';
}

interface DataTableProps {
  columns: DataColumn[];
  rows: HrRecord[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRowClick?: (row: HrRecord) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  emptyTitle?: string;
  emptyBody?: string;
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onDelete?: (row: HrRecord) => void;
  deleteLabel?: string;
}

export function DataTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  onRowClick,
  onSortChange,
  emptyTitle = 'Nothing here yet',
  emptyBody = 'Add the first record or adjust the filters.',
  page,
  pageSize,
  total,
  onPage,
  onDelete,
  deleteLabel = 'Delete record',
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const definitions: ColumnDef<HrRecord>[] = columns.map((column) => ({
    id: column.key,
    accessorFn: (row) => row[column.key],
    header: column.header,
    enableSorting: column.sortable !== false,
    cell: (info) => column.render(info.row.original),
  }));

  if (onDelete) {
    definitions.push({
      id: '__actions',
      header: '',
      enableSorting: false,
      cell: (info) => (
        <button
          className="x"
          aria-label={deleteLabel}
          title={deleteLabel}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(info.row.original);
          }}
        >
          <Trash2 />
        </button>
      ),
    });
  }

  const table = useReactTable({
    data: rows,
    columns: definitions,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      const first = next[0];
      if (first) onSortChange?.(first.id, first.desc ? 'desc' : 'asc');
      else onSortChange?.('', 'asc');
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : loading ? (
        <SkeletonRows rows={5} cols={Math.min(columns.length, 6)} />
      ) : rows.length === 0 ? (
        <EmptyState title={emptyTitle} body={emptyBody} />
      ) : (
        <div className="tw">
          <table className="tbl">
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th key={header.id} style={{ textAlign: header.column.id === '__actions' ? 'right' : 'left' }}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button onClick={header.column.getToggleSortingHandler()} type="button">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={12} />
                          ) : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} onClick={() => onRowClick?.(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(cell.column.id === '__actions' && 'actions')}
                      style={{ textAlign: cell.column.id === '__actions' ? 'right' : undefined }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pager">
        <span>
          {total === 0 ? 'No records' : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`}
        </span>
        <div className="pager-controls">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Prev
          </Button>
          <span>
            Page {page} / {pages}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
