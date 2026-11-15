import { describe, expect, it } from 'vitest';
import { MODULES, MODULE_LIST, NAV_GROUPS } from '@/features/modules/registry';
import { SEED_DB } from '@/mocks/seed';
import { RBAC_DEFAULTS, RBAC_MODULE_KEYS } from '@/store/rbac';

describe('module registry', () => {
  it('defines a config and seed rows for every module', () => {
    const keys = Object.keys(SEED_DB);
    expect(keys.length).toBeGreaterThan(80);
    keys.forEach((key) => {
      expect(MODULES[key as keyof typeof MODULES], `missing config for ${key}`).toBeDefined();
      expect(SEED_DB[key as keyof typeof SEED_DB].length, `no seed rows for ${key}`).toBeGreaterThan(0);
    });
    expect(MODULE_LIST.length).toBe(keys.length);
  });

  it('gives every module a unique path', () => {
    const paths = MODULE_LIST.map((module) => module.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('exposes every module somewhere in the navigation', () => {
    const navModules = new Set(NAV_GROUPS.flatMap((group) => group.items.map((item) => item.module)));
    ['employees', 'payroll', 'planOrders', 'companies', 'assets', 'meetings', 'trainingPrograms'].forEach((key) => {
      expect(navModules.has(key as never), `navigation is missing ${key}`).toBe(true);
    });
  });

  it('covers every module in the permission matrix', () => {
    const matrix = RBAC_DEFAULTS();
    RBAC_MODULE_KEYS.forEach((key) => {
      expect(matrix['Super Admin'][key], `super admin missing ${key}`).toBeDefined();
      expect(matrix.Employee[key], `employee missing ${key}`).toBeDefined();
    });
  });

  it('keeps platform pages away from company roles', () => {
    const matrix = RBAC_DEFAULTS();
    expect(matrix['Super Admin'].companies.create).toBe(true);
    expect(matrix['Company Admin'].companies.read).toBe(false);
    expect(matrix['Company Admin'].planOrders.read).toBe(false);
    expect(matrix.HR.companies.read).toBe(false);
    expect(matrix.Employee.complaints.create).toBe(true);
    expect(matrix.Employee.payrollRuns.read).toBe(false);
    expect(matrix.HR.payroll.update).toBe(true);
    expect(matrix.HR.payroll.create).toBe(false);
  });
});
