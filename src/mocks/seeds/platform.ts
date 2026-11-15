import { R, refRows } from '@/mocks/seeds/helpers';
import type { HrRecord } from '@/types';

export const platformSeeds: Partial<Record<string, HrRecord[]>> = {
  companies: [
    R('CO-1', 'Active', { name: 'TechCorp Inc.', email: 'admin@techcorp.com', plan: 'Professional', people: 248, created: '2025-02-14' }),
    R('CO-2', 'Active', { name: 'ABC Ltd.', email: 'hr@abcltd.com', plan: 'Starter', people: 84, created: '2025-08-03' }),
    R('CO-3', 'Active', { name: 'XYZ Corp', email: 'ops@xyzcorp.com', plan: 'Enterprise', people: 1420, created: '2024-11-21' }),
    R('CO-4', 'Inactive', { name: 'Nimbus Studio', email: 'hello@nimbus.studio', plan: 'Free', people: 12, created: '2026-06-09' }),
    R('CO-5', 'Active', { name: 'Orbit Labs', email: 'team@orbitlabs.io', plan: 'Professional', people: 312, created: '2026-01-30' }),
  ],
  planRequests: [
    R('REQ-1', 'Pending', { company: 'ABC Ltd.', plan: 'Professional', requestedBy: 'hr@abcltd.com', requestedOn: '2026-11-12', note: 'Growing headcount past the Starter limit.' }),
    R('REQ-2', 'Approved', { company: 'Orbit Labs', plan: 'Enterprise', requestedBy: 'team@orbitlabs.io', requestedOn: '2026-10-04', note: 'SSO requirement.' }),
    R('REQ-3', 'Rejected', { company: 'Nimbus Studio', plan: 'Starter', requestedBy: 'hello@nimbus.studio', requestedOn: '2026-09-18', note: 'Duplicate request.' }),
  ],
  planOrders: [
    R('ORD-1', 'Paid', { company: 'TechCorp Inc.', plan: 'Professional yearly', invoice: 'INV-2026-0412', billing: 'Yearly', original: 8640, discount: 1728, final: 6912, orderedOn: '2026-11-01' }),
    R('ORD-2', 'Pending', { company: 'ABC Ltd.', plan: 'Starter monthly', invoice: 'INV-2026-0413', billing: 'Monthly', original: 336, discount: 0, final: 336, orderedOn: '2026-11-10' }),
    R('ORD-3', 'Paid', { company: 'XYZ Corp', plan: 'Enterprise yearly', invoice: 'INV-2026-0388', billing: 'Yearly', original: 24000, discount: 2400, final: 21600, orderedOn: '2026-09-15' }),
    R('ORD-4', 'Rejected', { company: 'Nimbus Studio', plan: 'Starter monthly', invoice: 'INV-2026-0350', billing: 'Monthly', original: 48, discount: 0, final: 48, orderedOn: '2026-08-02' }),
  ],
  coupons: [
    R('CP-1', 'Active', { code: 'LAUNCH20', type: 'Percentage', value: 20, used: 42, limit: 200, expires: '2027-03-31' }),
    R('CP-2', 'Active', { code: 'ANNUAL10', type: 'Percentage', value: 10, used: 118, limit: 500, expires: '2027-12-31' }),
    R('CP-3', 'Inactive', { code: 'SUMMER50', type: 'Fixed', value: 50, used: 500, limit: 500, expires: '2026-08-31' }),
  ],
  currencies: [
    R('CUR-1', 'Active', { name: 'US Dollar', code: 'USD', symbol: '$', rate: 1 }),
    R('CUR-2', 'Active', { name: 'Indian Rupee', code: 'INR', symbol: '₹', rate: 83.2 }),
    R('CUR-3', 'Active', { name: 'Euro', code: 'EUR', symbol: '€', rate: 0.92 }),
    R('CUR-4', 'Inactive', { name: 'Pound Sterling', code: 'GBP', symbol: '£', rate: 0.79 }),
  ],
  referral: [
    R('RF-1', 'Paid', { referrer: 'TechCorp Inc.', referee: 'Orbit Labs', reward: 200, date: '2026-10-30' }),
    R('RF-2', 'Pending', { referrer: 'ABC Ltd.', referee: 'Nimbus Studio', reward: 100, date: '2026-11-09' }),
    R('RF-3', 'Rejected', { referrer: 'XYZ Corp', referee: 'Self referral', reward: 0, date: '2026-08-21' }),
  ],
  emailTemplates: [
    R('EM-1', 'Active', { name: 'Welcome email', category: 'Account', subject: 'Welcome to Career Creed HR', body: 'Hi {{name}}, your workspace is ready.' }),
    R('EM-2', 'Active', { name: 'Payslip ready', category: 'Payroll', subject: 'Your payslip for {{month}}', body: 'Hi {{name}}, your payslip is available in the portal.' }),
    R('EM-3', 'Active', { name: 'Interview invite', category: 'Recruitment', subject: 'Interview scheduled', body: 'Hi {{name}}, your interview is on {{date}} at {{time}}.' }),
    R('EM-4', 'Inactive', { name: 'Invoice paid', category: 'Billing', subject: 'Payment received', body: 'Thanks! Invoice {{invoice}} has been paid.' }),
  ],
  permissions: [
    R('PS-1', 'Active', { name: 'manage-users', group: 'Users', guard: 'web', description: 'List and view users' }),
    R('PS-2', 'Active', { name: 'create-employees', group: 'Employees', guard: 'web', description: 'Create employee records' }),
    R('PS-3', 'Active', { name: 'view-payroll', group: 'Payroll', guard: 'web', description: 'View payroll runs and payslips' }),
    R('PS-4', 'Active', { name: 'manage-companies', group: 'Platform', guard: 'web', description: 'Manage tenant companies' }),
    R('PS-5', 'Active', { name: 'manage-settings', group: 'Settings', guard: 'web', description: 'Update system settings' }),
  ],
};

export const platformReference = refRows;
