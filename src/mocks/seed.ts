import { attendanceSeeds, lifecycleSeeds, organizationSeeds, payrollSeeds, peopleSeeds } from '@/mocks/seeds/hr';
import { documentSeeds, workplaceSeeds } from '@/mocks/seeds/workplace';
import { platformSeeds } from '@/mocks/seeds/platform';
import { performanceSeeds, recruitmentSeeds, trainingSeeds } from '@/mocks/seeds/talent';
import type { HrRecord, ModuleKey } from '@/types';

/**
 * Seed data for every module in the nexhrms inventory.
 * Typed as a full record so a missing module fails the build.
 */
export const SEED_DB: Record<ModuleKey, HrRecord[]> = {
  ...(peopleSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(organizationSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(lifecycleSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(attendanceSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(payrollSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(recruitmentSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(performanceSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(trainingSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(workplaceSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(documentSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
  ...(platformSeeds as Partial<Record<ModuleKey, HrRecord[]>>),
} as Record<ModuleKey, HrRecord[]>;

export { R, refRows } from '@/mocks/seeds/helpers';
