/** Domain types for the HRMS frontend. Every entity is typed; no `any` is used. */

export type Role = 'Super Admin' | 'Company Admin' | 'HR' | 'Employee';

export type Action = 'create' | 'read' | 'update' | 'delete';

export type Permission = Record<Action, boolean>;

export const ROLES: Role[] = ['Super Admin', 'Company Admin', 'HR', 'Employee'];

export type ModuleGroup =
  | 'people'
  | 'organization'
  | 'lifecycle'
  | 'attendance'
  | 'payroll'
  | 'recruitment'
  | 'performance'
  | 'training'
  | 'workplace'
  | 'documents'
  | 'business';

/** Every CRUD module in the nexhrms inventory (mirrors resources/js/pages/hr/**, platform pages). */
export type ModuleKey =
  | 'users'
  | 'staff'
  | 'employees'
  | 'branches'
  | 'departments'
  | 'designations'
  | 'documentTypes'
  | 'holidays'
  | 'announcements'
  | 'awardTypes'
  | 'awards'
  | 'promotions'
  | 'resignations'
  | 'terminations'
  | 'warnings'
  | 'transfers'
  | 'contractTypes'
  | 'employeeContracts'
  | 'contractRenewals'
  | 'contractTemplates'
  | 'attendance'
  | 'attendancePolicies'
  | 'attendanceRegularizations'
  | 'timeEntries'
  | 'shifts'
  | 'leave'
  | 'leaveTypes'
  | 'leavePolicies'
  | 'wfh'
  | 'leaveBalances'
  | 'salaryComponents'
  | 'employeeSalaries'
  | 'payrollRuns'
  | 'payroll'
  | 'recruitment'
  | 'jobRequisitions'
  | 'jobPostings'
  | 'jobCategories'
  | 'jobTypes'
  | 'jobLocations'
  | 'candidateSources'
  | 'applications'
  | 'pipelines'
  | 'campusDrives'
  | 'colleges'
  | 'interviewTypes'
  | 'interviewRounds'
  | 'interviews'
  | 'assessments'
  | 'offerTemplates'
  | 'offers'
  | 'vendors'
  | 'onboardingChecklists'
  | 'checklistItems'
  | 'candidateOnboarding'
  | 'indicatorCategories'
  | 'indicators'
  | 'goalTypes'
  | 'employeeGoals'
  | 'reviewCycles'
  | 'performance'
  | 'trainingTypes'
  | 'trainingPrograms'
  | 'trainingSessions'
  | 'employeeTrainings'
  | 'trainingAssessments'
  | 'meetings'
  | 'meetingTypes'
  | 'meetingRooms'
  | 'meetingAttendees'
  | 'meetingMinutes'
  | 'actionItems'
  | 'travel'
  | 'expenses'
  | 'complaints'
  | 'assets'
  | 'assetTypes'
  | 'assetMaintenance'
  | 'assetDepreciation'
  | 'documents'
  | 'documentCategories'
  | 'documentAcknowledgments'
  | 'documentTemplates'
  | 'planRequests'
  | 'planOrders'
  | 'coupons'
  | 'currencies'
  | 'referral'
  | 'emailTemplates'
  | 'permissions'
  | 'companies';

/** Pages that are bespoke UI rather than a generated CRUD table. */
export type PageKey = 'roles' | 'plans' | 'settings' | 'mediaLibrary' | 'calendar' | 'admin';

export type AdminModuleKey = PageKey | 'roles' | 'plans';

export type AnyModuleKey = ModuleKey | PageKey;

export type PermissionMatrix = Record<Role, Record<AnyModuleKey, Permission>>;

/** Cell values are text or numbers; money/hours are stored as numbers. */
export type FieldValue = string | number;

export interface HrRecord {
  id: string;
  status: string;
  [key: string]: FieldValue | undefined;
}

export type FieldType = 'text' | 'number' | 'money' | 'date' | 'select' | 'email' | 'tel' | 'textarea';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  inTable?: boolean;
  placeholder?: string;
}

export type ListParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

export type SortParams = {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Employees — mirrors the nexhrms employee record fields. */
export type Employee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  manager: string;
  employmentType: string;
  salaryBand: string;
  status: string;
};

export type AttendanceRecord = {
  id: string;
  employee: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: string;
};

export type LeaveRequest = {
  id: string;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: string;
};

export type Payslip = {
  id: string;
  employee: string;
  month: string;
  gross: number;
  net: number;
  deductions: number;
  status: string;
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  stage: string;
  experience: string;
  source: string;
  status: string;
};

export type Review = {
  id: string;
  employee: string;
  cycle: string;
  rating: number;
  reviewer: string;
  status: string;
};

export type Shift = {
  id: string;
  team: string;
  shift: string;
  hours: string;
  staff: number;
  status: string;
};

export type Expense = {
  id: string;
  employee: string;
  category: string;
  amount: number;
  date: string;
  status: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  owner: string;
  size: string;
  updated: string;
  status: string;
};

export type Asset = {
  id: string;
  asset: string;
  assignee: string;
  assignedOn: string;
  status: string;
};

export type Ticket = {
  id: string;
  subject: string;
  employee: string;
  priority: string;
  opened: string;
  status: string;
};

export type TravelRequest = {
  id: string;
  employee: string;
  from: string;
  to: string;
  dates: string;
  purpose: string;
  status: string;
};

export type Comment = {
  id: string;
  author: string;
  at: string;
  body: string;
};

export type Company = {
  id: string;
  name: string;
  email: string;
  plan: string;
  people: number;
  created: string;
  status: string;
};

export type WidgetId = 'pulse' | 'ai' | 'kpi' | 'grow' | 'mix' | 'attr' | 'eng';

export interface WidgetState {
  id: WidgetId;
  span: number;
  hidden: boolean;
}

export type Plan = {
  name: string;
  price: number | 'custom';
  tagline: string;
  features: string[];
  popular?: boolean;
  employees?: number;
  storage?: number;
  seats?: number;
};

export type KpiIcon = 'users' | 'check' | 'leave' | 'briefcase';

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: 'up' | 'down';
  note: string;
  icon: KpiIcon;
};
