import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MODULE_LIST } from '@/features/modules/registry';
import type { Action, AnyModuleKey, Permission, PermissionMatrix, Role } from '@/types';

const PAGE_KEYS: AnyModuleKey[] = ['roles', 'plans', 'settings', 'mediaLibrary', 'calendar', 'admin'];

const ALL_KEYS: AnyModuleKey[] = [...MODULE_LIST.map((module) => module.key), ...PAGE_KEYS];

const FULL: Permission = { create: true, read: true, update: true, delete: true };
const READ: Permission = { create: false, read: true, update: false, delete: false };
const CREATE_READ: Permission = { create: true, read: true, update: false, delete: false };
const UPDATE_READ: Permission = { create: false, read: true, update: true, delete: false };
const NONE: Permission = { create: false, read: false, update: false, delete: false };

const PLATFORM_ONLY: AnyModuleKey[] = [
  'companies',
  'admin',
  'planRequests',
  'planOrders',
  'coupons',
  'permissions',
];

const COMPANY_ADMIN_READABLE: AnyModuleKey[] = [
  'plans',
  'planRequests',
  'planOrders',
  'coupons',
  'currencies',
  'referral',
  'emailTemplates',
  'mediaLibrary',
  'settings',
];

const EMPLOYEE_CREATE: AnyModuleKey[] = [
  'leave',
  'wfh',
  'expenses',
  'complaints',
  'travel',
  'timeEntries',
  'attendanceRegularizations',
];

const EMPLOYEE_HIDDEN: AnyModuleKey[] = [
  'recruitment',
  'applications',
  'interviews',
  'offers',
  'payrollRuns',
  'employeeSalaries',
  'salaryComponents',
  'users',
  'roles',
  'permissions',
  'companies',
  'admin',
  'planRequests',
  'planOrders',
  'coupons',
  'settings',
  'reviewCycles',
  'employeeContracts',
  'resignations',
  'terminations',
  'warnings',
  'promotions',
  'transfers',
  'employeeGoals',
];

const PAYROLL_LOCKED: AnyModuleKey[] = ['payroll', 'payrollRuns', 'employeeSalaries', 'salaryComponents'];
const ASSET_LOCKED: AnyModuleKey[] = ['assets', 'assetTypes', 'assetMaintenance', 'assetDepreciation'];

const permissionFor = (module: AnyModuleKey, role: Role): Permission => {
  if (role === 'Super Admin') return FULL;

  if (role === 'Company Admin') {
    if (PLATFORM_ONLY.includes(module)) return NONE;
    if (COMPANY_ADMIN_READABLE.includes(module)) return UPDATE_READ;
    return FULL;
  }

  if (role === 'HR') {
    if (PLATFORM_ONLY.includes(module)) return NONE;
    if (PAYROLL_LOCKED.includes(module)) return UPDATE_READ;
    if (ASSET_LOCKED.includes(module)) return UPDATE_READ;
    if (module === 'settings' || module === 'mediaLibrary') return READ;
    if (module === 'roles' || module === 'plans' || module === 'admin') return NONE;
    return FULL;
  }

  // Employee
  if (EMPLOYEE_HIDDEN.includes(module)) return NONE;
  if (module === 'roles' || module === 'plans' || module === 'settings' || module === 'mediaLibrary') return NONE;
  if (EMPLOYEE_CREATE.includes(module)) return CREATE_READ;
  return READ;
};

const defaults = (): PermissionMatrix => {
  const matrix = {} as PermissionMatrix;
  (['Super Admin', 'Company Admin', 'HR', 'Employee'] as Role[]).forEach((role) => {
    matrix[role] = {} as Record<AnyModuleKey, Permission>;
    ALL_KEYS.forEach((module) => {
      matrix[role][module] = { ...permissionFor(module, role) };
    });
  });
  return matrix;
};

interface RbacState {
  matrix: PermissionMatrix;
  setPermission: (role: Role, module: AnyModuleKey, action: Action, value: boolean) => void;
  resetMatrix: () => void;
}

export const useRbacStore = create<RbacState>()(
  persist(
    (set, get) => ({
      matrix: defaults(),
      setPermission: (role, module, action, value) =>
        set({
          matrix: {
            ...get().matrix,
            [role]: {
              ...get().matrix[role],
              [module]: { ...get().matrix[role][module], [action]: value },
            },
          },
        }),
      resetMatrix: () => set({ matrix: defaults() }),
    }),
    {
      name: 'hrms-rbac-v2',
      version: 2,
      migrate: () => ({ matrix: defaults() }),
    },
  ),
);

export const RBAC_DEFAULTS = defaults;
export const RBAC_MODULE_KEYS = ALL_KEYS;
