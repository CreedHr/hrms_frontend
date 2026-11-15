import { delay, replaceRows, rowsOf, readDb, resetDb, writeDb } from '@/services/db';
import { MODULES } from '@/features/modules/config';
import type { HrRecord, ListParams, ModuleKey, Page } from '@/types';

export interface CrudService<T extends HrRecord> {
  list: (params?: ListParams) => Promise<Page<T>>;
  get: (id: string) => Promise<T>;
  create: (input: Partial<T>) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

const PAGE_SIZE = 6;

const matches = (row: HrRecord, search: string, keys: string[]): boolean => {
  if (!search) return true;
  const needle = search.toLowerCase();
  return keys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle));
};

const nextId = (module: ModuleKey): string => {
  const config = MODULES[module];
  const rows = rowsOf(module);
  const highest = rows.reduce((max, row) => {
    const digits = Number(row.id.replace(/\D/g, ''));
    return Number.isFinite(digits) && digits > max ? digits : max;
  }, 0);
  return `${config.idPrefix}${highest + 1}`;
};

export const createCrudService = <T extends HrRecord>(module: ModuleKey): CrudService<T> => {
  const config = MODULES[module];

  return {
    async list(params: ListParams = {}): Promise<Page<T>> {
      await delay();
      const { search = '', status = '', page = 1, pageSize = PAGE_SIZE, sortBy, sortDir } = params;
      let rows = rowsOf(module).filter(
        (row) =>
          (!status || row.status === status) && matches(row, search, config.searchKeys),
      );

      if (sortBy && sortDir) {
        const direction = sortDir === 'asc' ? 1 : -1;
        rows = [...rows].sort((a, b) => {
          const av = a[sortBy];
          const bv = b[sortBy];
          if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
          return String(av ?? '').localeCompare(String(bv ?? '')) * direction;
        });
      }

      const total = rows.length;
      const start = (page - 1) * pageSize;
      return {
        items: rows.slice(start, start + pageSize) as T[],
        total,
        page,
        pageSize,
      };
    },

    async get(id: string): Promise<T> {
      await delay(120, 220);
      const row = rowsOf(module).find((item) => item.id === id);
      if (!row) throw new Error(`${module}: record ${id} not found`);
      return row as T;
    },

    async create(input: Partial<T>): Promise<T> {
      await delay();
      const row = {
        ...input,
        id: String(input.id ?? '') || nextId(module),
        status: String(input.status ?? 'Pending'),
      } as T;
      replaceRows(module, [row, ...rowsOf(module)]);
      return row;
    },

    async update(id: string, patch: Partial<T>): Promise<T> {
      await delay();
      const rows = rowsOf(module);
      const index = rows.findIndex((row) => row.id === id);
      if (index < 0) throw new Error(`${module}: record ${id} not found`);
      const next = { ...rows[index], ...patch, id } as T;
      replaceRows(module, rows.map((row, i) => (i === index ? next : row)));
      return next;
    },

    async remove(id: string): Promise<void> {
      await delay(150, 300);
      replaceRows(
        module,
        rowsOf(module).filter((row) => row.id !== id),
      );
    },
  };
};

/** Reset every module back to the seeded data set. */
export const resetDemoData = (): void => {
  resetDb();
  readDb();
};

export { writeDb };
