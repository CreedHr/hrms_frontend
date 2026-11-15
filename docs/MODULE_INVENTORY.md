# Module inventory

Behaviour/fields come from the **nexhrms** Laravel app (`E:\NexHRM`: `resources/js/pages/**`, `app/Models/**`, `routes/web.php`); visuals come from `dark_analytics_theme.html`.
Where they disagreed, nexhrms won for data/behaviour and the prototype won for visuals.

**91 CRUD modules + 6 bespoke pages**, all on static mock data. Every module is declared once in
`src/features/modules/registry/*.ts` and rendered by the shared `ModulePage`, so the list below *is* the app.

Roles: `Super Admin`, `Company Admin`, `HR`, `Employee`. Every module uses the `[C, R, U, D]` matrix.

## 1. Shell

| Area | Behaviour |
|---|---|
| Sidebar | Brand + org card, filter input, collapsible groups (**Workspace, People, Organization, Lifecycle, Attendance & Leave, Payroll, Recruitment, Performance, Training, Workplace, Documents, Business & Billing, Platform Admin**), payroll CTA, reset demo data. Items filtered by `read`; platform group only for Super Admin. |
| Topbar | Command palette (`Ctrl/⌘+K`) searching every permitted module with group labels, day/night toggle, notifications, sidebar rail toggle, role switcher (Super Admin, Company Admin, HR, Employee). |
| Routes | One route per module (see below) + `/roles`, `/plans`, `/settings`, `/media`, `/calendar`, `/admin`. Aliases: `/helpdesk` → `/complaints`, `/travel` → `/trips`. Deep links and unauthorised routes both resolve safely. |
| Shared module page | Header (title, description, group, access letters), extras panel, search, status filter, board view for recruitment, sortable paginated table, create/edit drawer with Zod validation, detail drawer, delete confirmation, toast feedback. |
| Clock in / clock out | Dashboard card and Attendance page panel: live clock, shift from the Shifts module, mock GPS location, clock-in time, clock-out time, elapsed time while clocked in, hours written on clock-out (`hr.attendance.clock-in` / `clock-out` behaviour, one session per day). |

## 2. Modules (91)

### People (3)
| Route | Module | Notes |
|---|---|---|
| `/users` | Users | platform-style accounts; Super Admin only by default |
| `/staff` | Staff | non-teaching/support staff register |
| `/employees` | Employees | profile drawer, CSV export/import, headcount strip |

### Organization (6)
`/branches` Branches · `/departments` Departments · `/designations` Designations · `/document-types` Document Types · `/holidays` Holidays (feeds Calendar) · `/announcements` Announcements

### Lifecycle (11)
`/awards` Awards · `/award-types` Award Types · `/promotions` Promotions · `/resignations` Resignations · `/terminations` Terminations · `/warnings` Warnings · `/transfers` Transfers · `/contracts` Employee Contracts · `/contract-types` Contract Types · `/contract-renewals` Contract Renewals · `/contract-templates` Contract Templates

### Attendance & Leave (10)
| Route | Module | Notes |
|---|---|---|
| `/attendance` | Attendance Records | 28-day check-in density heatmap, clock in + clock out panel (shared with dashboard) |
| `/attendance-policies` | Attendance Policies | |
| `/attendance-regularizations` | Regularizations | employee can raise |
| `/time-entries` | Time Entries | employee can log |
| `/shifts` | Shifts | weekly roster grid |
| `/leave` | Leave Applications | balance cards, inline approve/reject |
| `/leave-types` | Leave Types | |
| `/leave-policies` | Leave Policies | |
| `/wfh` | WFH Applications | employee can raise |
| `/leave-balances` | Leave Balances | |

### Payroll (4)
| Route | Module | Notes |
|---|---|---|
| `/payroll-runs` | Payroll Runs | gross/net chart, close-run stepper |
| `/payroll` | Payslips | payslip drawer with breakdown |
| `/salary-components` | Salary Components | |
| `/employee-salaries` | Employee Salaries | |

### Recruitment (21)
`/recruitment` Candidates (kanban by stage; candidates table) · `/job-requisitions` Job Requisitions · `/job-postings` Job Postings (publish/close) · `/applications` Applications · `/interviews` Interviews · `/offers` Offers (accept/decline) · `/candidate-onboarding` Candidate Onboarding · `/campus-drives` Campus Drives · `/colleges` Colleges · `/vendors` Recruitment Vendors · `/hiring-pipelines`→`/pipelines` Hiring Pipelines · `/job-categories` · `/job-types` · `/job-locations` · `/candidate-sources` · `/interview-types` · `/interview-rounds` · `/candidate-assessments` · `/offer-templates` · `/onboarding-checklists` · `/checklist-items`

### Performance (6)
`/performance` Employee Reviews (rating distribution) · `/review-cycles` Review Cycles · `/employee-goals` Employee Goals · `/goal-types` Goal Types · `/indicators` Indicators · `/indicator-categories` Indicator Categories

### Training (5)
`/training-programs` Training Programs · `/training-sessions` Training Sessions · `/employee-trainings` Employee Trainings · `/training-assessments` Training Assessments · `/training-types` Training Types

### Workplace (13)
| Route | Module | Notes |
|---|---|---|
| `/meetings` | Meetings | agree/attendance via detail |
| `/meeting-types` | Meeting Types | |
| `/meeting-rooms` | Meeting Rooms | |
| `/meeting-attendees` | Meeting Attendees | |
| `/meeting-minutes` | Meeting Minutes | |
| `/action-items` | Action Items | |
| `/trips` (`/travel`) | Trips & Travel | request/approve/book |
| `/expenses` | Expenses | approve + receipt attach |
| `/complaints` (`/helpdesk`) | Complaints & Helpdesk | priority, threaded comments, resolve |
| `/assets` | Assets | assign/return in drawer |
| `/asset-types` | Asset Types | |
| `/asset-maintenance` | Asset Maintenance | |
| `/asset-depreciation` | Asset Depreciation | |

### Documents (4)
`/documents` HR Documents (mock upload, sign) · `/document-categories` · `/document-acknowledgments` Acknowledgments · `/document-templates`

### Business & Billing (8)
| Route | Module | Notes |
|---|---|---|
| `/plan-requests` | Plan Requests | approve/reject |
| `/plan-orders` | Plan Orders | mark paid / reject, coupon math |
| `/coupons` | Coupons | |
| `/currencies` | Currencies | |
| `/referral` | Referral Program | approve/reject payouts |
| `/email-templates` | Email Templates | |
| `/permissions` | Permissions | |
| `/companies` | Companies | tenant stats, plan mix |

## 3. Bespoke pages (6)

| Route | Behaviour |
|---|---|
| `/` | Drag-reorder dashboard (persisted), KPIs, headcount/payroll/attendance charts, approvals, birthdays, activity, onboarding, department mix, attrition |
| `/admin` | Super Admin platform overview: tenants, users, MRR, plans, pending requests, growth, revenue chart, plan subscribers, newest-companies table, cross-links to Companies / Plan Orders / Plan Requests |
| `/roles` | Permission matrix for **all 91 modules + 6 pages**, grouped, searchable, sticky headers, role pills, reset defaults |
| `/plans` | Current plan, monthly/yearly toggle, 4 plan cards, usage meters and feature comparison |
| `/settings` | 11 sections (Company, Branding, Localization, Email, Payments, Storage, Notifications, Security, SEO, Landing page, System) persisted in `hrms-settings-v1`; custom pages table, cache panel, webhook editor; reset all |
| `/media` | Media library: folder/type filters, search, upload (mock), copy-link and delete |
| `/calendar` | Month grid combining holidays, leave, interviews, training sessions and meetings, kind filters, day drawer, iCal export stub |

## 4. Default permission matrix

| Role | Company modules | Platform pages |
|---|---|---|
| Super Admin | `[1,1,1,1]` | full |
| Company Admin | `[1,1,1,1]`; payroll/assets/billing settings `[0,1,1,1]`; plans, plan requests/orders, coupons, currencies, referral, email templates, media, settings `[0,1,1,0]` | hidden |
| HR | `[1,1,1,1]`; payroll + assets `[0,1,1,0]`; settings/media `[0,1,0,0]`; roles, plans, admin, companies, billing hidden | hidden |
| Employee | read-only; create on leave, WFH, expenses, complaints, trips, time entries, regularizations; recruitment, payroll runs, salaries, users, lifecycle decisions, goals, roles, plans, settings, billing, companies hidden | hidden |

Employee dashboard hides the *department mix* and *attrition* widgets.

## 5. Deliberately not implemented

No server, authentication, real payments, email, file storage, PDF/Excel generation or background jobs: every
action writes to the local mock store and shows a toast. Backend wiring is described in `docs/DECISIONS.md` §4.
