import { createCrudService, type CrudService } from '@/services/crud';
import type { AttendanceRecord, DocumentRecord, Employee, HrRecord, ModuleKey } from '@/types';

/** One typed CRUD service per module; every page goes through these. */
export const serviceFor = (module: ModuleKey): CrudService<HrRecord> =>
  createCrudService<HrRecord>(module);

/** Direct access for the few extras that create records outside the table. */
export const services = {
  employees: createCrudService<Employee>('employees'),
  attendance: createCrudService<AttendanceRecord>('attendance'),
  documents: createCrudService<DocumentRecord>('documents'),
};
