import type { FieldValue, HrRecord } from '@/types';

/** Build a row with a stable id + status and any extra field values. */
export const R = (id: string, status: string, rest: Record<string, FieldValue> = {}): HrRecord => ({
  id,
  status,
  ...rest,
});

/** Deterministic reference-table rows (name + code + description + status). */
export const refRows = (
  prefix: string,
  names: string[],
  extra: Record<string, FieldValue> = {},
): HrRecord[] =>
  names.map((name, index) =>
    R(`${prefix}${index + 1}`, 'Active', {
      code: `${prefix}-${100 + index}`,
      description: extra.description ?? '',
      ...extra,
      name,
    }),
  );

export const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Marketing', 'HR', 'Finance', 'Support'];
