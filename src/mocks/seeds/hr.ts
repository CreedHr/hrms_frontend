import { R, refRows } from '@/mocks/seeds/helpers';
import type { Employee, HrRecord } from '@/types';

const employees: Employee[] = [
  { id: 'E101', name: 'Ava Patel', department: 'Engineering', designation: 'Senior Frontend Engineer', email: 'ava.patel@careercreed.com', phone: '+91 98200 11021', location: 'Bengaluru', joined: '2021-03-08', manager: 'Ethan Wu', employmentType: 'Full time', salaryBand: 'B3', status: 'Active' },
  { id: 'E102', name: 'Noah Kim', department: 'Sales', designation: 'Account Executive', email: 'noah.kim@careercreed.com', phone: '+91 98200 11022', location: 'Mumbai', joined: '2022-01-17', manager: 'Ethan Wu', employmentType: 'Full time', salaryBand: 'B2', status: 'Active' },
  { id: 'E103', name: 'Liam Chen', department: 'Design', designation: 'Product Designer', email: 'liam.chen@careercreed.com', phone: '+91 98200 11023', location: 'Bengaluru', joined: '2020-07-01', manager: 'Zoe Lane', employmentType: 'Full time', salaryBand: 'B2', status: 'On Leave' },
  { id: 'E104', name: 'Sara Khan', department: 'HR', designation: 'People Partner', email: 'sara.khan@careercreed.com', phone: '+91 98200 11024', location: 'Delhi', joined: '2019-11-12', manager: 'Sara Khan', employmentType: 'Full time', salaryBand: 'B2', status: 'Active' },
  { id: 'E105', name: 'Omar Diaz', department: 'Finance', designation: 'Financial Analyst', email: 'omar.diaz@careercreed.com', phone: '+91 98200 11025', location: 'Mumbai', joined: '2026-08-04', manager: 'Lucas Meyer', employmentType: 'Probation', salaryBand: 'B1', status: 'Probation' },
  { id: 'E106', name: 'Maya Rao', department: 'Engineering', designation: 'Backend Engineer', email: 'maya.rao@careercreed.com', phone: '+91 98200 11026', location: 'Bengaluru', joined: '2023-02-20', manager: 'Ethan Wu', employmentType: 'Full time', salaryBand: 'B2', status: 'Active' },
  { id: 'E107', name: 'Ethan Wu', department: 'Sales', designation: 'Sales Lead', email: 'ethan.wu@careercreed.com', phone: '+91 98200 11027', location: 'Mumbai', joined: '2018-05-14', manager: 'Ava Patel', employmentType: 'Full time', salaryBand: 'B4', status: 'Active' },
  { id: 'E108', name: 'Zoe Lane', department: 'Design', designation: 'Design Lead', email: 'zoe.lane@careercreed.com', phone: '+91 98200 11028', location: 'Bengaluru', joined: '2019-09-02', manager: 'Ava Patel', employmentType: 'Full time', salaryBand: 'B4', status: 'Active' },
  { id: 'E109', name: 'Ivan Petrov', department: 'Engineering', designation: 'DevOps Engineer', email: 'ivan.petrov@careercreed.com', phone: '+91 98200 11029', location: 'Remote', joined: '2024-06-10', manager: 'Ethan Wu', employmentType: 'Contract', salaryBand: 'B2', status: 'Active' },
  { id: 'E110', name: 'Priya Nair', department: 'Marketing', designation: 'Content Strategist', email: 'priya.nair@careercreed.com', phone: '+91 98200 11030', location: 'Delhi', joined: '2022-10-03', manager: 'Zoe Lane', employmentType: 'Full time', salaryBand: 'B2', status: 'Active' },
  { id: 'E111', name: 'Lucas Meyer', department: 'Finance', designation: 'Financial Controller', email: 'lucas.meyer@careercreed.com', phone: '+91 98200 11031', location: 'Mumbai', joined: '2017-04-24', manager: 'Ava Patel', employmentType: 'Full time', salaryBand: 'B5', status: 'Active' },
  { id: 'E112', name: 'Hana Sato', department: 'HR', designation: 'Recruiting Coordinator', email: 'hana.sato@careercreed.com', phone: '+91 98200 11032', location: 'Remote', joined: '2025-01-15', manager: 'Sara Khan', employmentType: 'Full time', salaryBand: 'B1', status: 'Active' },
];

export const peopleSeeds: Partial<Record<string, HrRecord[]>> = {
  users: [
    R('U-1', 'Active', { name: 'Priya Sharma', email: 'priya@careercreed.com', role: 'Super Admin', phone: '+91 98111 20001', lastLogin: '2026-11-14' }),
    R('U-2', 'Active', { name: 'Arjun Mehta', email: 'arjun@careercreed.com', role: 'Company Admin', phone: '+91 98111 20002', lastLogin: '2026-11-14' }),
    R('U-3', 'Active', { name: 'Sara Khan', email: 'sara.khan@careercreed.com', role: 'HR', phone: '+91 98111 20003', lastLogin: '2026-11-13' }),
    R('U-4', 'Active', { name: 'Ava Patel', email: 'ava.patel@careercreed.com', role: 'Employee', phone: '+91 98111 20004', lastLogin: '2026-11-14' }),
    R('U-5', 'Inactive', { name: 'Rohit Verma', email: 'rohit@careercreed.com', role: 'HR', phone: '+91 98111 20005', lastLogin: '2026-09-02' }),
  ],
  staff: [
    R('S-1', 'Active', { name: 'Meera Iyer', department: 'HR', designation: 'HR Executive', email: 'meera@careercreed.com', phone: '+91 98200 30001', joined: '2023-04-11' }),
    R('S-2', 'Active', { name: 'Kabir Shah', department: 'Finance', designation: 'Accounts Assistant', email: 'kabir@careercreed.com', phone: '+91 98200 30002', joined: '2024-02-19' }),
    R('S-3', 'On Leave', { name: 'Tanya Bose', department: 'Support', designation: 'Office Coordinator', email: 'tanya@careercreed.com', phone: '+91 98200 30003', joined: '2022-08-01' }),
  ],
  employees,
};

export const organizationSeeds: Partial<Record<string, HrRecord[]>> = {
  branches: refRows('BR-', ['Bengaluru HQ', 'Mumbai', 'Delhi', 'Remote'], { description: 'Primary operating branch' }),
  departments: [
    R('DP-1', 'Active', { name: 'Engineering', code: 'ENG', description: 'Product engineering', head: 'Ethan Wu' }),
    R('DP-2', 'Active', { name: 'Design', code: 'DES', description: 'Product design', head: 'Zoe Lane' }),
    R('DP-3', 'Active', { name: 'Sales', code: 'SAL', description: 'Revenue team', head: 'Ethan Wu' }),
    R('DP-4', 'Active', { name: 'Marketing', code: 'MKT', description: 'Brand and content', head: 'Priya Nair' }),
    R('DP-5', 'Active', { name: 'HR', code: 'HR', description: 'People operations', head: 'Sara Khan' }),
    R('DP-6', 'Active', { name: 'Finance', code: 'FIN', description: 'Finance and payroll', head: 'Lucas Meyer' }),
  ],
  designations: refRows('DG-', ['Senior Frontend Engineer', 'Backend Engineer', 'Product Designer', 'Account Executive', 'People Partner', 'Financial Analyst', 'DevOps Engineer']),
  documentTypes: refRows('DT-', ['Offer letter', 'NDA', 'Form 16', 'Appraisal letter', 'Payslip']),
  holidays: [
    R('HD-1', 'Active', { name: 'Diwali', date: '2026-11-08', type: 'Public', branch: 'All' }),
    R('HD-2', 'Active', { name: 'Christmas', date: '2026-12-25', type: 'Public', branch: 'All' }),
    R('HD-3', 'Active', { name: 'Founders Day', date: '2026-12-12', type: 'Company', branch: 'Bengaluru HQ' }),
    R('HD-4', 'Active', { name: 'New Year', date: '2027-01-01', type: 'Public', branch: 'All' }),
  ],
  announcements: [
    R('AN-1', 'Published', { title: 'Payroll cut-off moved to 26 Nov', category: 'Payroll', audience: 'Everyone', publishedAt: '2026-11-12', body: 'Submit reimbursements before 25 Nov to be included in this run.' }),
    R('AN-2', 'Published', { title: 'Annual health check-up', category: 'Event', audience: 'Everyone', publishedAt: '2026-11-10', body: 'Camp on 18 Nov at Bengaluru HQ, 9am to 1pm.' }),
    R('AN-3', 'Draft', { title: 'Updated leave policy 2027', category: 'Policy', audience: 'Everyone', publishedAt: '2026-11-14', body: 'Carry-forward capped at 10 days from next year.' }),
    R('AN-4', 'Archived', { title: 'Diwali celebration photos', category: 'General', audience: 'Everyone', publishedAt: '2026-11-09', body: 'Photos from the celebration are on the media library.' }),
  ],
};

export const lifecycleSeeds: Partial<Record<string, HrRecord[]>> = {
  awardTypes: refRows('AT-', ['Employee of the month', 'Innovation award', 'Customer first', 'Team player']),
  awards: [
    R('AW-1', 'Published', { employee: 'Ava Patel', award: 'Employee of the month', date: '2026-11-01', givenBy: 'Ethan Wu', description: 'Shipped the analytics workspace.' }),
    R('AW-2', 'Published', { employee: 'Maya Rao', award: 'Innovation award', date: '2026-10-05', givenBy: 'Sara Khan', description: 'Automated the payroll reconciliation.' }),
    R('AW-3', 'Pending', { employee: 'Priya Nair', award: 'Team player', date: '2026-11-13', givenBy: 'Zoe Lane', description: 'Nominated for the Q4 awards.' }),
  ],
  promotions: [
    R('PM-1', 'Approved', { employee: 'Ava Patel', fromDesignation: 'Frontend Engineer', toDesignation: 'Senior Frontend Engineer', effectiveDate: '2026-07-01' }),
    R('PM-2', 'Pending', { employee: 'Maya Rao', fromDesignation: 'Backend Engineer', toDesignation: 'Backend Lead', effectiveDate: '2026-12-01' }),
    R('PM-3', 'Rejected', { employee: 'Omar Diaz', fromDesignation: 'Analyst', toDesignation: 'Senior Analyst', effectiveDate: '2026-11-01' }),
  ],
  resignations: [
    R('RS-1', 'Approved', { employee: 'Tanya Bose', resignationDate: '2026-10-02', lastDay: '2026-11-01', noticeDays: 30, reason: 'Relocating' }),
    R('RS-2', 'Pending', { employee: 'Hana Sato', resignationDate: '2026-11-11', lastDay: '2026-12-10', noticeDays: 30, reason: 'Higher studies' }),
  ],
  terminations: [
    R('TM-1', 'Approved', { employee: 'Rohit Verma', type: 'Misconduct', terminationDate: '2026-09-15', settlement: 4200, reason: 'Policy violation' }),
    R('TM-2', 'Pending', { employee: 'Contractor 41', type: 'Performance', terminationDate: '2026-12-01', settlement: 1800, reason: 'Missed review goals' }),
  ],
  warnings: [
    R('WN-1', 'Issued', { employee: 'Omar Diaz', subject: 'Repeated late check-ins', severity: 'Verbal', issuedOn: '2026-10-20', improvementPlan: 'Punctuality plan for 30 days' }),
    R('WN-2', 'Pending', { employee: 'Noah Kim', subject: 'Expense policy breach', severity: 'Written', issuedOn: '2026-11-12', improvementPlan: '' }),
    R('WN-3', 'Closed', { employee: 'Ivan Petrov', subject: 'Missed standup', severity: 'Verbal', issuedOn: '2026-08-05', improvementPlan: 'Completed' }),
  ],
  transfers: [
    R('TRF-1', 'Approved', { employee: 'Priya Nair', fromBranch: 'Delhi', toBranch: 'Mumbai', effectiveDate: '2026-12-01', reason: 'Marketing hub move' }),
    R('TRF-2', 'Pending', { employee: 'Kabir Shah', fromBranch: 'Bengaluru HQ', toBranch: 'Remote', effectiveDate: '2026-12-15', reason: 'Relocation' }),
  ],
  contractTypes: refRows('CT-', ['Permanent', 'Fixed term', 'Consultant', 'Internship']),
  employeeContracts: [
    R('EC-1', 'Active', { employee: 'Ava Patel', type: 'Permanent', startDate: '2021-03-08', endDate: '2027-03-07', salary: 112000 }),
    R('EC-2', 'Active', { employee: 'Ivan Petrov', type: 'Consultant', startDate: '2026-01-10', endDate: '2026-12-31', salary: 96000 }),
    R('EC-3', 'Expired', { employee: 'Hana Sato', type: 'Fixed term', startDate: '2025-01-15', endDate: '2025-12-31', salary: 72000 }),
  ],
  contractRenewals: [
    R('CR-1', 'Pending', { employee: 'Ivan Petrov', contract: 'EC-2', renewalDate: '2026-12-01', newEndDate: '2027-12-31' }),
    R('CR-2', 'Approved', { employee: 'Maya Rao', contract: 'EC-4', renewalDate: '2026-09-01', newEndDate: '2028-08-31' }),
  ],
  contractTemplates: refRows('CTP-', ['Permanent employment agreement', 'Fixed-term agreement', 'Consultant agreement']),
};

export const attendanceSeeds: Partial<Record<string, HrRecord[]>> = {
  shifts: [
    R('SH-1', 'Active', { team: 'Support', shift: 'Morning 06-14', hours: '06:00–14:00', staff: 24 }),
    R('SH-2', 'Active', { team: 'Support', shift: 'Night 22-06', hours: '22:00–06:00', staff: 11 }),
    R('SH-3', 'Scheduled', { team: 'Warehouse', shift: 'Evening 14-22', hours: '14:00–22:00', staff: 18 }),
    R('SH-4', 'Active', { team: 'Engineering', shift: 'Flexi', hours: 'Flexible', staff: 60 }),
    R('SH-5', 'Scheduled', { team: 'Sales', shift: 'Day 09-18', hours: '09:00–18:00', staff: 32 }),
  ],
  attendancePolicies: [
    R('AP-1', 'Active', { name: 'Standard IST', code: 'STD', description: '09:00-18:00, 15 min grace, half-day after 2h late' }),
    R('AP-2', 'Active', { name: 'Support rotating', code: 'SUP', description: 'Rotating shifts with 10 min grace' }),
    R('AP-3', 'Inactive', { name: 'Legacy policy', code: 'OLD', description: 'Superseded in 2025' }),
  ],
  attendance: [
    R('AT-1', 'Present', { employee: 'Ava Patel', department: 'Engineering', date: '2026-11-14', checkIn: '09:02', checkOut: '—', hours: 0 }),
    R('AT-2', 'Late', { employee: 'Noah Kim', department: 'Sales', date: '2026-11-14', checkIn: '09:41', checkOut: '17:35', hours: 7.9 }),
    R('AT-3', 'Absent', { employee: 'Liam Chen', department: 'Design', date: '2026-11-14', checkIn: '—', checkOut: '—', hours: 0 }),
    R('AT-4', 'Present', { employee: 'Sara Khan', department: 'HR', date: '2026-11-14', checkIn: '08:55', checkOut: '17:01', hours: 8.1 }),
    R('AT-5', 'Present', { employee: 'Omar Diaz', department: 'Finance', date: '2026-11-14', checkIn: '09:12', checkOut: '18:04', hours: 8.8 }),
    R('AT-6', 'Late', { employee: 'Ethan Wu', department: 'Sales', date: '2026-11-13', checkIn: '09:33', checkOut: '18:10', hours: 8.6 }),
    R('AT-7', 'Present', { employee: 'Zoe Lane', department: 'Design', date: '2026-11-13', checkIn: '08:48', checkOut: '17:12', hours: 8.4 }),
    R('AT-8', 'Absent', { employee: 'Hana Sato', department: 'HR', date: '2026-11-12', checkIn: '—', checkOut: '—', hours: 0 }),
  ],
  attendanceRegularizations: [
    R('AR-1', 'Pending', { employee: 'Noah Kim', date: '2026-11-11', requestedIn: '09:40', requestedOut: '18:05', reason: 'Client call at 9am' }),
    R('AR-2', 'Approved', { employee: 'Ivan Petrov', date: '2026-11-05', requestedIn: '10:05', requestedOut: '18:40', reason: 'Deployment window' }),
    R('AR-3', 'Rejected', { employee: 'Omar Diaz', date: '2026-10-29', requestedIn: '11:00', requestedOut: '19:00', reason: 'No approval from manager' }),
  ],
  timeEntries: [
    R('TE-1', 'Approved', { employee: 'Ava Patel', project: 'Analytics workspace', task: 'Dashboard widgets', date: '2026-11-13', hours: 6.5, billable: 'Yes' }),
    R('TE-2', 'Approved', { employee: 'Maya Rao', project: 'Payroll automation', task: 'Reconciliation', date: '2026-11-13', hours: 7, billable: 'No' }),
    R('TE-3', 'Pending', { employee: 'Zoe Lane', project: 'Design system', task: 'Tokens audit', date: '2026-11-14', hours: 4, billable: 'Yes' }),
  ],
  leave: [
    R('LV-1', 'Approved', { employee: 'Liam Chen', type: 'Annual', from: '2026-11-10', to: '2026-11-16', days: 5 }),
    R('LV-2', 'Pending', { employee: 'Sara Khan', type: 'Sick', from: '2026-11-18', to: '2026-11-19', days: 2 }),
    R('LV-3', 'Pending', { employee: 'Omar Diaz', type: 'Casual', from: '2026-11-21', to: '2026-11-21', days: 1 }),
    R('LV-4', 'Approved', { employee: 'Ava Patel', type: 'Parental', from: '2026-12-01', to: '2027-01-29', days: 60 }),
    R('LV-5', 'Rejected', { employee: 'Noah Kim', type: 'Annual', from: '2026-12-22', to: '2026-12-24', days: 3 }),
  ],
  leaveTypes: refRows('LT-', ['Annual leave', 'Sick leave', 'Casual leave', 'Parental leave', 'Unpaid leave']),
  leavePolicies: refRows('LP-', ['Default accrual policy', 'Probation policy', 'Parental policy']),
  wfh: [
    R('WFH-1', 'Approved', { employee: 'Ava Patel', date: '2026-11-15', days: 1, reason: 'Home internet install' }),
    R('WFH-2', 'Pending', { employee: 'Noah Kim', date: '2026-11-19', days: 2, reason: 'Family visit' }),
    R('WFH-3', 'Rejected', { employee: 'Omar Diaz', date: '2026-11-06', days: 1, reason: 'Month-end close' }),
  ],
  leaveBalances: [
    R('LB-1', 'Active', { employee: 'Ava Patel', type: 'Annual', year: '2026', allocated: 18, used: 6 }),
    R('LB-2', 'Active', { employee: 'Ava Patel', type: 'Sick', year: '2026', allocated: 8, used: 2 }),
    R('LB-3', 'Active', { employee: 'Liam Chen', type: 'Annual', year: '2026', allocated: 18, used: 13 }),
    R('LB-4', 'Active', { employee: 'Sara Khan', type: 'Casual', year: '2026', allocated: 6, used: 3 }),
  ],
};

export const payrollSeeds: Partial<Record<string, HrRecord[]>> = {
  salaryComponents: [
    R('SC-1', 'Active', { name: 'Basic salary', type: 'Earning', calc: 'Percentage', value: 50 }),
    R('SC-2', 'Active', { name: 'HRA', type: 'Earning', calc: 'Percentage', value: 20 }),
    R('SC-3', 'Active', { name: 'Transport allowance', type: 'Earning', calc: 'Fixed', value: 150 }),
    R('SC-4', 'Active', { name: 'Provident fund', type: 'Deduction', calc: 'Percentage', value: 12 }),
    R('SC-5', 'Active', { name: 'Professional tax', type: 'Deduction', calc: 'Fixed', value: 20 }),
  ],
  employeeSalaries: [
    R('ES-1', 'Active', { employee: 'Ava Patel', band: 'B3', gross: 9200, effectiveFrom: '2026-07-01' }),
    R('ES-2', 'Active', { employee: 'Noah Kim', band: 'B2', gross: 7400, effectiveFrom: '2026-01-01' }),
    R('ES-3', 'Active', { employee: 'Ethan Wu', band: 'B4', gross: 11800, effectiveFrom: '2026-04-01' }),
    R('ES-4', 'Active', { employee: 'Zoe Lane', band: 'B4', gross: 10900, effectiveFrom: '2026-04-01' }),
    R('ES-5', 'Active', { employee: 'Omar Diaz', band: 'B1', gross: 5200, effectiveFrom: '2026-08-04' }),
  ],
  payrollRuns: [
    R('RUN-1', 'Paid', { period: 'October 2026', month: '2026-10', employees: 248, gross: 488200, net: 372400 }),
    R('RUN-2', 'Processing', { period: 'November 2026', month: '2026-11', employees: 248, gross: 492100, net: 375100 }),
    R('RUN-3', 'Draft', { period: 'December 2026', month: '2026-12', employees: 248, gross: 0, net: 0 }),
  ],
  payroll: [
    R('PR-1', 'Paid', { employee: 'Ava Patel', month: '2026-10', gross: 9200, net: 7100, deductions: 2100 }),
    R('PR-2', 'Paid', { employee: 'Noah Kim', month: '2026-10', gross: 7400, net: 5800, deductions: 1600 }),
    R('PR-3', 'Pending', { employee: 'Liam Chen', month: '2026-10', gross: 6800, net: 5300, deductions: 1500 }),
    R('PR-4', 'Processing', { employee: 'Sara Khan', month: '2026-10', gross: 6100, net: 4800, deductions: 1300 }),
    R('PR-5', 'Paid', { employee: 'Maya Rao', month: '2026-10', gross: 6600, net: 5100, deductions: 1500 }),
    R('PR-6', 'Paid', { employee: 'Ethan Wu', month: '2026-10', gross: 11800, net: 8900, deductions: 2900 }),
    R('PR-7', 'Pending', { employee: 'Zoe Lane', month: '2026-10', gross: 10900, net: 8200, deductions: 2700 }),
  ],
};
