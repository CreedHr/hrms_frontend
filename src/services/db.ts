import { SEED_DB } from '@/mocks/seed';
import type { HrRecord, ModuleKey } from '@/types';

const KEY = 'hrms-mock-db-v1';

type Db = Record<ModuleKey, HrRecord[]>;

const clone = (db: Db): Db =>
  Object.fromEntries(Object.entries(db).map(([key, rows]) => [key, rows.map((row) => ({ ...row }))])) as Db;

let cache: Db | null = null;

const read = (): Db => {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Db>;
      const merged = {} as Db;
      (Object.keys(SEED_DB) as ModuleKey[]).forEach((key) => {
        merged[key] = Array.isArray(parsed[key]) ? (parsed[key] as HrRecord[]) : clone(SEED_DB)[key];
      });
      cache = merged;
      return merged;
    }
  } catch {
    // corrupted storage — fall back to seed
  }
  cache = clone(SEED_DB);
  return cache;
};

const write = (db: Db): void => {
  cache = db;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // storage full or unavailable — the demo keeps running in memory
  }
};

export const readDb = (): Db => read();

export const writeDb = (db: Db): void => write(db);

export const rowsOf = (module: ModuleKey): HrRecord[] => read()[module];

export const replaceRows = (module: ModuleKey, rows: HrRecord[]): void => {
  const db = { ...read(), [module]: rows };
  write(db);
};

export const resetDb = (): void => {
  cache = clone(SEED_DB);
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};

/** 200–400 ms artificial latency so loading and error states are real. */
export const delay = (min = 200, max = 400): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, min + Math.random() * (max - min));
  });
