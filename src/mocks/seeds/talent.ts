import { R, refRows } from '@/mocks/seeds/helpers';
import type { HrRecord } from '@/types';

export const recruitmentSeeds: Partial<Record<string, HrRecord[]>> = {
  jobCategories: refRows('JC-', ['Engineering', 'Design', 'Sales', 'Marketing', 'Operations']),
  jobTypes: refRows('JT-', ['Full time', 'Part time', 'Contract', 'Internship']),
  jobLocations: refRows('JL-', ['Bengaluru', 'Mumbai', 'Delhi', 'Remote']),
  candidateSources: refRows('CS-', ['Referral', 'LinkedIn', 'Careers page', 'Agency', 'Job board']),
  interviewTypes: refRows('IT-', ['Screening call', 'Technical', 'Managerial', 'HR round', 'Panel']),
  colleges: refRows('CL-', ['RV College', 'BITS Pilani', 'NIT Trichy', 'IIM Bangalore']),
  vendors: refRows('VN-', ['TalentBridge', 'HireRight', 'Naukri Services']),
  pipelines: refRows('PL-', ['Engineering pipeline', 'Design pipeline', 'Sales pipeline']),
  onboardingChecklists: refRows('OC-', ['Standard onboarding', 'Remote onboarding', 'Leadership onboarding']),
  checklistItems: refRows('CI-', ['ID proof collection', 'Laptop allocation', 'Payroll setup', 'Policy acknowledgment']),
  jobRequisitions: [
    R('JR-1', 'Approved', { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Bengaluru', openings: 2, budget: 140000 }),
    R('JR-2', 'Pending', { title: 'Product Designer', department: 'Design', location: 'Remote', openings: 1, budget: 90000 }),
    R('JR-3', 'Closed', { title: 'Account Executive', department: 'Sales', location: 'Mumbai', openings: 3, budget: 80000 }),
  ],
  jobPostings: [
    R('JP-1', 'Published', { title: 'Senior Frontend Engineer', category: 'Engineering', location: 'Bengaluru', type: 'Full time', applicants: 42, closes: '2026-12-05', description: 'React + TypeScript, design systems.' }),
    R('JP-2', 'Published', { title: 'Product Designer', category: 'Design', location: 'Remote', type: 'Full time', applicants: 18, closes: '2026-12-12', description: 'Own the design system and product flows.' }),
    R('JP-3', 'Draft', { title: 'Finance Analyst', category: 'Operations', location: 'Mumbai', type: 'Full time', applicants: 0, closes: '2026-12-20', description: 'Payroll and FP&A support.' }),
    R('JP-4', 'Closed', { title: 'DevOps Engineer', category: 'Engineering', location: 'Remote', type: 'Contract', applicants: 26, closes: '2026-10-30', description: 'Kubernetes, Terraform, observability.' }),
  ],
  recruitment: [
    R('C-1', 'Active', { name: 'Maya Rao', role: 'Frontend Engineer', stage: 'Interview', experience: '4 yrs', source: 'Referral' }),
    R('C-2', 'Active', { name: 'Ethan Wu', role: 'Sales Lead', stage: 'Offer', experience: '7 yrs', source: 'LinkedIn' }),
    R('C-3', 'Active', { name: 'Zoe Lane', role: 'Product Designer', stage: 'Screening', experience: '5 yrs', source: 'Careers page' }),
    R('C-4', 'Closed', { name: 'Ivan Petrov', role: 'DevOps Engineer', stage: 'Rejected', experience: '6 yrs', source: 'Agency' }),
    R('C-5', 'Closed', { name: 'Priya Nair', role: 'Marketing Manager', stage: 'Hired', experience: '8 yrs', source: 'Referral' }),
    R('C-6', 'Active', { name: 'Lucas Meyer', role: 'Finance Analyst', stage: 'Screening', experience: '3 yrs', source: 'Job board' }),
  ],
  applications: [
    R('APP-1', 'Shortlisted', { candidate: 'Maya Rao', posting: 'Senior Frontend Engineer', appliedOn: '2026-11-02', stage: 'Interview', rating: 4 }),
    R('APP-2', 'In Review', { candidate: 'Zoe Lane', posting: 'Product Designer', appliedOn: '2026-11-08', stage: 'Screening', rating: 3 }),
    R('APP-3', 'Hired', { candidate: 'Priya Nair', posting: 'Marketing Manager', appliedOn: '2026-09-20', stage: 'Hired', rating: 5 }),
    R('APP-4', 'Rejected', { candidate: 'Ivan Petrov', posting: 'DevOps Engineer', appliedOn: '2026-10-01', stage: 'Rejected', rating: 2 }),
  ],
  campusDrives: [
    R('CD-1', 'Scheduled', { college: 'RV College', role: 'Graduate Engineer Trainee', date: '2026-12-06', candidates: 120, hired: 0 }),
    R('CD-2', 'Completed', { college: 'BITS Pilani', role: 'Product Intern', date: '2026-10-18', candidates: 80, hired: 6 }),
    R('CD-3', 'Cancelled', { college: 'NIT Trichy', role: 'QA Engineer', date: '2026-09-12', candidates: 60, hired: 0 }),
  ],
  interviewRounds: [
    R('IR-1', 'Active', { name: 'Screening', type: 'Screening call', order: 1, duration: 30 }),
    R('IR-2', 'Active', { name: 'Technical deep dive', type: 'Technical', order: 2, duration: 60 }),
    R('IR-3', 'Active', { name: 'Manager round', type: 'Managerial', order: 3, duration: 45 }),
    R('IR-4', 'Active', { name: 'HR round', type: 'HR round', order: 4, duration: 30 }),
  ],
  interviews: [
    R('IV-1', 'Scheduled', { candidate: 'Maya Rao', round: 'Technical deep dive', interviewer: 'Ivan Petrov', date: '2026-11-17', time: '11:00', mode: 'Video' }),
    R('IV-2', 'Completed', { candidate: 'Ethan Wu', round: 'Manager round', interviewer: 'Ava Patel', date: '2026-11-10', time: '15:30', mode: 'Onsite' }),
    R('IV-3', 'Scheduled', { candidate: 'Lucas Meyer', round: 'Screening', interviewer: 'Sara Khan', date: '2026-11-18', time: '10:00', mode: 'Phone' }),
    R('IV-4', 'Cancelled', { candidate: 'Ivan Petrov', round: 'HR round', interviewer: 'Hana Sato', date: '2026-10-22', time: '16:00', mode: 'Video' }),
  ],
  assessments: [
    R('AS-1', 'Passed', { candidate: 'Maya Rao', assessment: 'React take-home', score: 88, takenOn: '2026-11-05' }),
    R('AS-2', 'Pending', { candidate: 'Zoe Lane', assessment: 'Design exercise', score: 0, takenOn: '2026-11-15' }),
    R('AS-3', 'Failed', { candidate: 'Ivan Petrov', assessment: 'Kubernetes lab', score: 42, takenOn: '2026-10-03' }),
  ],
  offerTemplates: [
    R('OT-1', 'Active', { name: 'Standard full-time offer', designation: 'Engineer', subject: 'Your offer from Career Creed', body: 'Hi {{name}}, we are delighted to offer you {{designation}}.' }),
    R('OT-2', 'Active', { name: 'Internship offer', designation: 'Intern', subject: 'Internship offer', body: 'Hi {{name}}, welcome to the {{duration}} internship.' }),
  ],
  offers: [
    R('OF-1', 'Pending', { candidate: 'Ethan Wu', designation: 'Sales Lead', ctc: 142000, joining: '2026-12-15' }),
    R('OF-2', 'Accepted', { candidate: 'Priya Nair', designation: 'Marketing Manager', ctc: 118000, joining: '2026-10-01' }),
    R('OF-3', 'Declined', { candidate: 'Ivan Petrov', designation: 'DevOps Engineer', ctc: 126000, joining: '2026-11-01' }),
    R('OF-4', 'Expired', { candidate: 'Noah Kim', designation: 'Account Executive', ctc: 88000, joining: '2026-09-15' }),
  ],
  candidateOnboarding: [
    R('ON-1', 'In Progress', { candidate: 'Ethan Wu', checklist: 'Standard onboarding', owner: 'Hana Sato', startDate: '2026-12-15', progress: 40 }),
    R('ON-2', 'Completed', { candidate: 'Priya Nair', checklist: 'Standard onboarding', owner: 'Sara Khan', startDate: '2026-10-01', progress: 100 }),
    R('ON-3', 'Blocked', { candidate: 'Maya Rao', checklist: 'Remote onboarding', owner: 'Hana Sato', startDate: '2026-11-24', progress: 15 }),
  ],
};

export const performanceSeeds: Partial<Record<string, HrRecord[]>> = {
  indicatorCategories: refRows('IC-', ['Delivery', 'Collaboration', 'Craft', 'Ownership', 'Communication']),
  indicators: [
    R('IN-1', 'Active', { name: 'Ships on time', category: 'Delivery', weight: 30 }),
    R('IN-2', 'Active', { name: 'Code quality', category: 'Craft', weight: 25 }),
    R('IN-3', 'Active', { name: 'Team collaboration', category: 'Collaboration', weight: 20 }),
    R('IN-4', 'Active', { name: 'Customer impact', category: 'Ownership', weight: 25 }),
  ],
  goalTypes: refRows('GT-', ['OKR', 'KRA', 'Development goal', 'Project goal']),
  employeeGoals: [
    R('EG-1', 'In Progress', { employee: 'Ava Patel', goal: 'Ship analytics workspace', cycle: 'H2 2026', progress: 70, due: '2026-12-15' }),
    R('EG-2', 'Completed', { employee: 'Maya Rao', goal: 'Automate payroll reconciliation', cycle: 'H2 2026', progress: 100, due: '2026-10-30' }),
    R('EG-3', 'At Risk', { employee: 'Zoe Lane', goal: 'Design system audit', cycle: 'H2 2026', progress: 35, due: '2026-11-30' }),
    R('EG-4', 'Not Started', { employee: 'Omar Diaz', goal: 'FP&A dashboard', cycle: 'H1 2027', progress: 0, due: '2027-03-31' }),
  ],
  reviewCycles: [
    R('RC-1', 'Open', { name: 'H2 2026', startDate: '2026-12-01', endDate: '2027-01-15', reviews: 248 }),
    R('RC-2', 'Closed', { name: 'H1 2026', startDate: '2026-06-01', endDate: '2026-07-15', reviews: 242 }),
    R('RC-3', 'Draft', { name: 'H1 2027', startDate: '2027-06-01', endDate: '2027-07-15', reviews: 0 }),
  ],
  performance: [
    R('RV-1', 'Reviewed', { employee: 'Ava Patel', cycle: 'H2 2026', rating: 4.6, reviewer: 'Ethan Wu' }),
    R('RV-2', 'In Review', { employee: 'Noah Kim', cycle: 'H2 2026', rating: 3.9, reviewer: 'Ethan Wu' }),
    R('RV-3', 'Reviewed', { employee: 'Liam Chen', cycle: 'H2 2026', rating: 4.2, reviewer: 'Zoe Lane' }),
    R('RV-4', 'Not Started', { employee: 'Omar Diaz', cycle: 'H2 2026', rating: 0, reviewer: 'Lucas Meyer' }),
    R('RV-5', 'Reviewed', { employee: 'Maya Rao', cycle: 'H2 2026', rating: 4.4, reviewer: 'Ethan Wu' }),
    R('RV-6', 'In Review', { employee: 'Priya Nair', cycle: 'H2 2026', rating: 4.1, reviewer: 'Zoe Lane' }),
  ],
};

export const trainingSeeds: Partial<Record<string, HrRecord[]>> = {
  trainingTypes: refRows('TT-', ['Compliance', 'Technical', 'Leadership', 'Soft skills', 'Onboarding']),
  trainingPrograms: [
    R('TP-1', 'Active', { name: 'Security awareness 2026', type: 'Compliance', trainer: 'Ivan Petrov', enrolled: 248, startDate: '2026-11-01' }),
    R('TP-2', 'Active', { name: 'Design system deep dive', type: 'Technical', trainer: 'Zoe Lane', enrolled: 24, startDate: '2026-11-10' }),
    R('TP-3', 'Completed', { name: 'New manager bootcamp', type: 'Leadership', trainer: 'Sara Khan', enrolled: 18, startDate: '2026-09-01' }),
    R('TP-4', 'Draft', { name: 'Advanced SQL', type: 'Technical', trainer: 'Lucas Meyer', enrolled: 0, startDate: '2027-01-15' }),
  ],
  trainingSessions: [
    R('TS-1', 'Scheduled', { program: 'Security awareness 2026', date: '2026-11-20', time: '15:00', venue: 'Virtual', seats: 248 }),
    R('TS-2', 'Completed', { program: 'Design system deep dive', date: '2026-11-12', time: '11:00', venue: 'Bengaluru HQ', seats: 24 }),
    R('TS-3', 'Cancelled', { program: 'Advanced SQL', date: '2026-12-02', time: '10:00', venue: 'Virtual', seats: 30 }),
  ],
  employeeTrainings: [
    R('ET-1', 'Completed', { employee: 'Ava Patel', program: 'Security awareness 2026', enrolledOn: '2026-11-01', progress: 100 }),
    R('ET-2', 'In Progress', { employee: 'Noah Kim', program: 'Security awareness 2026', enrolledOn: '2026-11-01', progress: 60 }),
    R('ET-3', 'Not Started', { employee: 'Liam Chen', program: 'Design system deep dive', enrolledOn: '2026-11-10', progress: 0 }),
  ],
  trainingAssessments: [
    R('TA-1', 'Passed', { employee: 'Ava Patel', program: 'Security awareness 2026', score: 92, takenOn: '2026-11-08' }),
    R('TA-2', 'Pending', { employee: 'Noah Kim', program: 'Security awareness 2026', score: 0, takenOn: '2026-11-22' }),
    R('TA-3', 'Failed', { employee: 'Omar Diaz', program: 'Security awareness 2026', score: 48, takenOn: '2026-11-09' }),
  ],
};
