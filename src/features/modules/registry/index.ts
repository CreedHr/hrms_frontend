import { CalendarDays, CreditCard, Images, LayoutDashboard, Settings, ShieldCheck, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ModuleKey } from '@/types';
import type { ModuleConfig } from '@/features/modules/registry/types';
import { organizationModules, peopleModules } from '@/features/modules/registry/people';
import { lifecycleModules } from '@/features/modules/registry/lifecycle';
import { attendanceModules } from '@/features/modules/registry/attendance';
import { payrollModules } from '@/features/modules/registry/payroll';
import { recruitmentModules } from '@/features/modules/registry/recruitment';
import { performanceModules, trainingModules } from '@/features/modules/registry/performance';
import { workplaceModules } from '@/features/modules/registry/workplace';
import { documentModules } from '@/features/modules/registry/documents';
import { businessModules } from '@/features/modules/registry/business';

export type ExtraKind = ModuleKey;

const ALL_MODULES: ModuleConfig[] = [
  ...peopleModules,
  ...organizationModules,
  ...lifecycleModules,
  ...attendanceModules,
  ...payrollModules,
  ...recruitmentModules,
  ...performanceModules,
  ...trainingModules,
  ...workplaceModules,
  ...documentModules,
  ...businessModules,
];

export const MODULES = ALL_MODULES.reduce<Record<string, ModuleConfig>>((acc, module) => {
  acc[module.key] = module;
  return acc;
}, {}) as Record<ModuleKey, ModuleConfig>;

export const MODULE_LIST: ModuleConfig[] = ALL_MODULES;

export const moduleConfig = (key: ModuleKey): ModuleConfig => MODULES[key];

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  module: ModuleKey | 'roles' | 'plans' | 'settings' | 'mediaLibrary' | 'calendar' | 'admin';
}

export interface NavGroup {
  id: string;
  label: string;
  /** Which demo role audience sees the group at all. */
  audience?: 'platform' | 'company';
  items: NavItem[];
}

const nav = (keys: ModuleKey[]): NavItem[] =>
  keys.map((key) => {
    const config = MODULES[key];
    return { path: config.path, label: config.title, icon: config.icon, module: config.key };
  });

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Workspace',
    items: [
      { path: '/', label: 'Overview', icon: LayoutDashboard, module: 'employees' },
      { path: '/admin', label: 'Platform overview', icon: Globe, module: 'admin' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      ...nav(['users', 'staff', 'employees']),
      { path: '/roles', label: 'Roles & Permissions', icon: ShieldCheck, module: 'roles' },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    items: nav(['branches', 'departments', 'designations', 'documentTypes', 'holidays', 'announcements']),
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    items: nav([
      'awards',
      'awardTypes',
      'promotions',
      'transfers',
      'resignations',
      'terminations',
      'warnings',
      'employeeContracts',
      'contractTypes',
      'contractRenewals',
      'contractTemplates',
    ]),
  },
  {
    id: 'attendance',
    label: 'Attendance & Leave',
    items: nav([
      'attendance',
      'attendancePolicies',
      'attendanceRegularizations',
      'timeEntries',
      'shifts',
      'leave',
      'leaveTypes',
      'leavePolicies',
      'wfh',
      'leaveBalances',
    ]),
  },
  {
    id: 'payroll',
    label: 'Payroll',
    items: nav(['payrollRuns', 'payroll', 'salaryComponents', 'employeeSalaries']),
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    items: nav([
      'recruitment',
      'jobRequisitions',
      'jobPostings',
      'applications',
      'interviews',
      'offers',
      'candidateOnboarding',
      'campusDrives',
      'jobCategories',
      'jobTypes',
      'jobLocations',
      'candidateSources',
      'pipelines',
      'interviewTypes',
      'interviewRounds',
      'assessments',
      'offerTemplates',
      'vendors',
      'colleges',
      'onboardingChecklists',
      'checklistItems',
    ]),
  },
  {
    id: 'performance',
    label: 'Performance',
    items: nav(['performance', 'reviewCycles', 'employeeGoals', 'goalTypes', 'indicators', 'indicatorCategories']),
  },
  {
    id: 'training',
    label: 'Training',
    items: nav(['trainingPrograms', 'trainingSessions', 'employeeTrainings', 'trainingAssessments', 'trainingTypes']),
  },
  {
    id: 'workplace',
    label: 'Workplace',
    items: [
      { path: '/calendar', label: 'Calendar', icon: CalendarDays, module: 'calendar' },
      ...nav([
        'meetings',
        'meetingTypes',
        'meetingRooms',
        'meetingAttendees',
        'meetingMinutes',
        'actionItems',
        'travel',
        'expenses',
        'complaints',
        'assets',
        'assetTypes',
        'assetMaintenance',
        'assetDepreciation',
      ]),
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    items: nav(['documents', 'documentCategories', 'documentAcknowledgments', 'documentTemplates']),
  },
  {
    id: 'business',
    label: 'Business & Billing',
    audience: 'company',
    items: [
      { path: '/plans', label: 'Plans', icon: CreditCard, module: 'plans' },
      ...nav(['planRequests', 'planOrders', 'coupons', 'currencies', 'referral', 'emailTemplates']),
      { path: '/media', label: 'Media Library', icon: Images, module: 'mediaLibrary' },
      { path: '/settings', label: 'Settings', icon: Settings, module: 'settings' },
      ...nav(['permissions']),
    ],
  },
  {
    id: 'platform',
    label: 'Platform Admin',
    audience: 'platform',
    items: [
      { path: '/companies', label: 'Companies', icon: Globe, module: 'companies' },
      { path: '/plans', label: 'Plans', icon: CreditCard, module: 'plans' },
      ...nav(['planRequests', 'planOrders', 'coupons', 'currencies', 'referral', 'emailTemplates', 'permissions']),
      { path: '/media', label: 'Media Library', icon: Images, module: 'mediaLibrary' },
      { path: '/settings', label: 'Settings', icon: Settings, module: 'settings' },
    ],
  },
];

export const MODULE_PATHS = ALL_MODULES.map((module) => module.path);

export const GROUP_LABELS: Record<string, string> = {
  people: 'People',
  organization: 'Organization',
  lifecycle: 'Lifecycle',
  attendance: 'Attendance & Leave',
  payroll: 'Payroll',
  recruitment: 'Recruitment',
  performance: 'Performance',
  training: 'Training',
  workplace: 'Workplace',
  documents: 'Documents',
  business: 'Business & Billing',
};

export const GROUP_ORDER = [
  'people',
  'organization',
  'lifecycle',
  'attendance',
  'payroll',
  'recruitment',
  'performance',
  'training',
  'workplace',
  'documents',
  'business',
];
