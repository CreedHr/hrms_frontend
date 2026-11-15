import { R, refRows } from '@/mocks/seeds/helpers';
import type { HrRecord } from '@/types';

export const workplaceSeeds: Partial<Record<string, HrRecord[]>> = {
  meetingTypes: refRows('MT-', ['Standup', 'Review', 'One-on-one', 'All hands', 'Interview panel']),
  meetingRooms: [
    R('MR-1', 'Active', { name: 'Everest', code: 'EVR', description: '12 seats, video conferencing' }),
    R('MR-2', 'Active', { name: 'Nandi', code: 'NND', description: '6 seats' }),
    R('MR-3', 'Active', { name: 'Virtual', code: 'VIR', description: 'Google Meet room' }),
  ],
  meetings: [
    R('ME-1', 'Scheduled', { title: 'Engineering weekly', type: 'Review', room: 'Everest', organizer: 'Ethan Wu', date: '2026-11-17', time: '10:00' }),
    R('ME-2', 'Scheduled', { title: 'Design critique', type: 'Review', room: 'Virtual', organizer: 'Zoe Lane', date: '2026-11-18', time: '14:00' }),
    R('ME-3', 'Completed', { title: 'Q3 town hall', type: 'All hands', room: 'Everest', organizer: 'Sara Khan', date: '2026-11-06', time: '16:00' }),
    R('ME-4', 'Cancelled', { title: 'Vendor sync', type: 'One-on-one', room: 'Nandi', organizer: 'Hana Sato', date: '2026-11-11', time: '12:30' }),
  ],
  meetingAttendees: [
    R('MA-1', 'Accepted', { meeting: 'Engineering weekly', name: 'Ava Patel', email: 'ava.patel@careercreed.com' }),
    R('MA-2', 'Pending', { meeting: 'Engineering weekly', name: 'Ivan Petrov', email: 'ivan.petrov@careercreed.com' }),
    R('MA-3', 'Declined', { meeting: 'Design critique', name: 'Noah Kim', email: 'noah.kim@careercreed.com' }),
  ],
  meetingMinutes: [
    R('MM-1', 'Published', { meeting: 'Q3 town hall', author: 'Sara Khan', date: '2026-11-06', notes: 'Headcount plan approved; payroll cut-off moved.' }),
    R('MM-2', 'Draft', { meeting: 'Engineering weekly', author: 'Ethan Wu', date: '2026-11-17', notes: 'Widget performance backlog.' }),
  ],
  actionItems: [
    R('AI-1', 'In Progress', { title: 'Move payroll cut-off to 26 Nov', owner: 'Sara Khan', meeting: 'Q3 town hall', due: '2026-11-20' }),
    R('AI-2', 'Done', { title: 'Publish security training', owner: 'Ivan Petrov', meeting: 'Engineering weekly', due: '2026-11-12' }),
    R('AI-3', 'Open', { title: 'Share design tokens audit', owner: 'Zoe Lane', meeting: 'Design critique', due: '2026-11-25' }),
  ],
  travel: [
    R('TR-1', 'Approved', { employee: 'Noah Kim', from: 'DEL', to: 'BLR', dates: 'Nov 12-14', purpose: 'Client workshop', advance: 450 }),
    R('TR-2', 'Pending', { employee: 'Sara Khan', from: 'DEL', to: 'SIN', dates: 'Dec 2-6', purpose: 'People summit', advance: 1200 }),
    R('TR-3', 'Booked', { employee: 'Ava Patel', from: 'BLR', to: 'LON', dates: 'Dec 9-15', purpose: 'Product offsite', advance: 2400 }),
    R('TR-4', 'Rejected', { employee: 'Zoe Lane', from: 'BLR', to: 'BOM', dates: 'Nov 20-22', purpose: 'Design review', advance: 300 }),
  ],
  expenses: [
    R('EX-1', 'Pending', { employee: 'Noah Kim', category: 'Client dinner', amount: 142, date: '2026-11-09' }),
    R('EX-2', 'Approved', { employee: 'Ava Patel', category: 'Software', amount: 89, date: '2026-11-07' }),
    R('EX-3', 'Rejected', { employee: 'Omar Diaz', category: 'Taxi', amount: 34, date: '2026-11-06' }),
    R('EX-4', 'Approved', { employee: 'Sara Khan', category: 'Training', amount: 420, date: '2026-11-04' }),
    R('EX-5', 'Pending', { employee: 'Priya Nair', category: 'Conference', amount: 610, date: '2026-11-02' }),
    R('EX-6', 'Approved', { employee: 'Maya Rao', category: 'Hardware', amount: 175, date: '2026-10-29' }),
  ],
  complaints: [
    R('T-1', 'Open', { subject: 'VPN access issue', employee: 'Ava Patel', priority: 'High', assignee: 'Ivan Petrov', opened: '2026-11-12' }),
    R('T-2', 'In Progress', { subject: 'Payslip mismatch', employee: 'Noah Kim', priority: 'Medium', assignee: 'Lucas Meyer', opened: '2026-11-11' }),
    R('T-3', 'Resolved', { subject: 'Badge replacement', employee: 'Omar Diaz', priority: 'Low', assignee: 'Tanya Bose', opened: '2026-11-09' }),
    R('T-4', 'Open', { subject: 'Laptop slow', employee: 'Sara Khan', priority: 'Medium', assignee: 'Ivan Petrov', opened: '2026-11-13' }),
    R('T-5', 'Closed', { subject: 'Seat allocation', employee: 'Maya Rao', priority: 'Low', assignee: 'Tanya Bose', opened: '2026-11-08' }),
  ],
  assets: [
    R('A-1', 'Assigned', { asset: 'MacBook Pro 14', type: 'Laptop', assignee: 'Ava Patel', assignedOn: '2025-04-02', value: 2400 }),
    R('A-2', 'Assigned', { asset: 'Dell U2723 Monitor', type: 'Monitor', assignee: 'Noah Kim', assignedOn: '2025-06-18', value: 620 }),
    R('A-3', 'Available', { asset: 'iPhone 15', type: 'Phone', assignee: '—', assignedOn: '—', value: 1100 }),
    R('A-4', 'Repair', { asset: 'ThinkPad T14', type: 'Laptop', assignee: 'Liam Chen', assignedOn: '2024-12-09', value: 1500 }),
    R('A-5', 'Retired', { asset: 'iPad Air 2', type: 'Tablet', assignee: '—', assignedOn: '—', value: 120 }),
  ],
  assetTypes: refRows('AST-', ['Laptop', 'Monitor', 'Phone', 'Tablet', 'Accessory']),
  assetMaintenance: [
    R('AM-1', 'Scheduled', { asset: 'ThinkPad T14', vendor: 'Lenovo Care', date: '2026-11-22', cost: 180 }),
    R('AM-2', 'Completed', { asset: 'Dell U2723 Monitor', vendor: 'Dell Service', date: '2026-10-05', cost: 90 }),
    R('AM-3', 'Overdue', { asset: 'MacBook Pro 14', vendor: 'Apple Care', date: '2026-11-01', cost: 240 }),
  ],
  assetDepreciation: [
    R('AD-1', 'Active', { asset: 'MacBook Pro 14', method: 'Straight line', year: '2026', amount: 800, bookValue: 1600 }),
    R('AD-2', 'Active', { asset: 'Dell U2723 Monitor', method: 'Straight line', year: '2026', amount: 155, bookValue: 465 }),
    R('AD-3', 'Active', { asset: 'ThinkPad T14', method: 'Reducing balance', year: '2026', amount: 450, bookValue: 1050 }),
  ],
};

export const documentSeeds: Partial<Record<string, HrRecord[]>> = {
  documents: [
    R('DC-1', 'Signed', { name: 'Offer Letter - Ava', owner: 'HR', size: '120 KB', updated: '2026-11-01' }),
    R('DC-2', 'Published', { name: 'Employee Handbook', owner: 'HR', size: '2.4 MB', updated: '2026-10-12' }),
    R('DC-3', 'Pending', { name: 'NDA - Noah', owner: 'Legal', size: '88 KB', updated: '2026-11-10' }),
    R('DC-4', 'Published', { name: 'Form 16', owner: 'Finance', size: '310 KB', updated: '2026-09-30' }),
    R('DC-5', 'Signed', { name: 'Appraisal Letter - Maya', owner: 'HR', size: '142 KB', updated: '2026-11-08' }),
    R('DC-6', 'Pending', { name: 'Vendor MSA', owner: 'Legal', size: '740 KB', updated: '2026-11-11' }),
  ],
  documentCategories: refRows('DCAT-', ['HR policies', 'Legal', 'Finance', 'Recruitment']),
  documentAcknowledgments: [
    R('ACK-1', 'Acknowledged', { document: 'Employee Handbook', employee: 'Ava Patel', due: '2026-10-31', acknowledgedOn: '2026-10-20' }),
    R('ACK-2', 'Pending', { document: 'Security policy', employee: 'Noah Kim', due: '2026-11-30', acknowledgedOn: '—' }),
    R('ACK-3', 'Overdue', { document: 'Code of conduct', employee: 'Omar Diaz', due: '2026-11-01', acknowledgedOn: '—' }),
  ],
  documentTemplates: refRows('DTMP-', ['Offer letter template', 'Experience letter', 'Warning letter', 'Relieving letter']),
};
