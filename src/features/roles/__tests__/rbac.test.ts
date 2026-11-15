import { describe, expect, it, beforeEach } from 'vitest';
import { useRbacStore } from '@/store/rbac';

const matrix = () => useRbacStore.getState().matrix;

describe('RBAC defaults', () => {
  beforeEach(() => {
    useRbacStore.getState().resetMatrix();
  });

  it('gives HR read + update but no create/delete on payroll', () => {
    expect(matrix()['HR'].payroll).toEqual({ create: false, read: true, update: true, delete: false });
    expect(matrix()['HR'].assets).toEqual({ create: false, read: true, update: true, delete: false });
  });

  it('gives HR full CRUD on employees', () => {
    expect(matrix()['HR'].employees).toEqual({ create: true, read: true, update: true, delete: true });
  });

  it('hides recruitment from employees and lets them create leave', () => {
    expect(matrix().Employee.recruitment).toEqual({ create: false, read: false, update: false, delete: false });
    expect(matrix().Employee.leave).toEqual({ create: true, read: true, update: false, delete: false });
    expect(matrix().Employee.payroll).toEqual({ create: false, read: true, update: false, delete: false });
  });

  it('keeps admin pages admin-only', () => {
    expect(matrix().HR.roles.read).toBe(false);
    expect(matrix()['Super Admin'].roles.read).toBe(true);
    expect(matrix()['Company Admin'].plans.read).toBe(true);
  });

  it('applies a single permission change', () => {
    useRbacStore.getState().setPermission('Employee', 'leave', 'update', true);
    expect(matrix().Employee.leave.update).toBe(true);
    useRbacStore.getState().resetMatrix();
    expect(matrix().Employee.leave.update).toBe(false);
  });
});
