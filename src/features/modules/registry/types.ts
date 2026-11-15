import type { LucideIcon } from 'lucide-react';
import type { FieldDef, ModuleGroup, ModuleKey } from '@/types';

export interface ModuleConfig {
  key: ModuleKey;
  path: string;
  title: string;
  group: ModuleGroup;
  icon: LucideIcon;
  idPrefix: string;
  statuses: string[];
  searchKeys: string[];
  fields: FieldDef[];
  extra?: ModuleKey;
  csv?: boolean;
  aliases?: string[];
  description?: string;
}

export interface BaseModuleInput {
  key: ModuleKey;
  path: string;
  title: string;
  group: ModuleGroup;
  icon: LucideIcon;
  prefix: string;
  statuses?: string[];
  fields?: FieldDef[];
  aliases?: string[];
  description?: string;
  searchKeys?: string[];
  csv?: boolean;
  extra?: ModuleKey;
}

export const STATUS_ACTIVE = ['Active', 'Inactive'];
export const STATUS_APPROVAL = ['Approved', 'Pending', 'Rejected'];

export const baseFields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text', required: true, inTable: true },
  { key: 'code', label: 'Code', type: 'text', inTable: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: STATUS_ACTIVE },
];

/** Build a configuration for the many small reference tables. */
export const refModule = (input: BaseModuleInput): ModuleConfig => ({
  key: input.key,
  path: input.path,
  title: input.title,
  group: input.group,
  icon: input.icon,
  idPrefix: input.prefix,
  statuses: input.statuses ?? STATUS_ACTIVE,
  searchKeys: input.searchKeys ?? ['name', 'code', 'description', 'status'],
  fields: input.fields ?? baseFields,
  aliases: input.aliases,
  description: input.description,
  csv: input.csv,
  extra: input.extra,
});

/** Person-style table: avatar + ID + a secondary column. */
export const personFields = (secondaryLabel: string, options: string[]): FieldDef[] => [
  { key: 'name', label: secondaryLabel, type: 'text', required: true, inTable: true },
  { key: 'role', label: 'Role', type: 'select', options, required: true, inTable: true },
  { key: 'email', label: 'Email', type: 'email', required: true, inTable: true },
  { key: 'department', label: 'Department', type: 'text', inTable: true },
  { key: 'status', label: 'Status', type: 'select', options: STATUS_ACTIVE },
];
