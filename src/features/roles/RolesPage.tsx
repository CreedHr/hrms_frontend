import { Fragment, useMemo, useState } from 'react';
import { Check, Download, Search, UserCheck, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button, Pill } from '@/components/ui/button';
import { Avatar } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { usePermissions } from '@/hooks/usePermissions';
import { useRbacStore } from '@/store/rbac';
import { GROUP_LABELS, GROUP_ORDER, MODULE_LIST } from '@/features/modules/registry';
import { ROLES, type Action, type AnyModuleKey, type Role } from '@/types';

const ACTIONS: { key: Action; label: string }[] = [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'Read' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
];

const PAGE_ROWS: { key: AnyModuleKey; label: string; group: string }[] = [
  { key: 'roles', label: 'Roles & Permissions', group: 'Administration' },
  { key: 'plans', label: 'Plans', group: 'Administration' },
  { key: 'settings', label: 'Settings', group: 'Administration' },
  { key: 'mediaLibrary', label: 'Media Library', group: 'Administration' },
  { key: 'calendar', label: 'Calendar', group: 'Administration' },
  { key: 'admin', label: 'Platform Overview', group: 'Administration' },
];

export default function RolesPage() {
  const { matrix, role: sessionRole } = usePermissions();
  const setPermission = useRbacStore((s) => s.setPermission);
  const resetMatrix = useRbacStore((s) => s.resetMatrix);
  const { push } = useToast();
  const [role, setRole] = useState<Role>('HR');
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const moduleGroups = GROUP_ORDER.map((group) => ({
      id: group,
      label: GROUP_LABELS[group] ?? group,
      rows: MODULE_LIST.filter((module) => module.group === group)
        .filter((module) => !needle || module.title.toLowerCase().includes(needle))
        .map((module) => ({ key: module.key as AnyModuleKey, label: module.title })),
    }));
    const pages = PAGE_ROWS.filter((row) => !needle || row.label.toLowerCase().includes(needle));
    if (pages.length) {
      moduleGroups.push({
        id: 'administration',
        label: 'Administration',
        rows: pages.map(({ key, label }) => ({ key, label })),
      });
    }
    return moduleGroups.filter((group) => group.rows.length > 0);
  }, [search]);

  const visibleModules = MODULE_LIST.filter((module) => matrix[role][module.key]?.read).length;

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Edit module-level CRUD for each role, then switch role in the header to test it. Every nexhrms module is included."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Download size={14} />}
              onClick={() => push('Permission matrix exported (demo)')}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              icon={<Wrench size={14} />}
              onClick={() => {
                resetMatrix();
                push('Permissions reset to defaults');
              }}
            >
              Reset defaults
            </Button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {ROLES.map((item) => (
          <Pill key={item} active={role === item} onClick={() => setRole(item)}>
            {item}
          </Pill>
        ))}
        <div className="input-wrap" style={{ marginLeft: 'auto', maxWidth: 260 }}>
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter modules…"
            aria-label="Filter permission modules"
          />
        </div>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <Avatar name={role} />
          <div>
            <b style={{ fontSize: 14 }}>{role}</b>
            <div className="mut" style={{ fontSize: 12 }}>
              {visibleModules} of {MODULE_LIST.length} modules visible · {MODULE_LIST.length} modules +{' '}
              {PAGE_ROWS.length} pages
            </div>
          </div>
          <span className="mut" style={{ marginLeft: 'auto', fontSize: 12 }}>
            <UserCheck size={13} style={{ verticalAlign: 'middle' }} /> viewing as {sessionRole}
          </span>
        </div>

        <div className="tw" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          <table className="matrix">
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, zIndex: 2, background: 'var(--card)' }}>Module</th>
                {ACTIONS.map((action) => (
                  <th key={action.key}>{action.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.id}>
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'left',
                        fontSize: 10.5,
                        letterSpacing: '.09em',
                        textTransform: 'uppercase',
                        color: 'var(--mut)',
                        fontWeight: 700,
                        background: 'color-mix(in srgb, var(--bg) 45%, var(--card))',
                        position: 'sticky',
                        left: 0,
                      }}
                    >
                      {group.label}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.key}>
                      <td style={{ position: 'sticky', left: 0, background: 'var(--card)', zIndex: 1 }}>
                        {row.label}
                      </td>
                      {ACTIONS.map((action) => {
                        const checked = Boolean(matrix[role][row.key]?.[action.key]);
                        return (
                          <td key={action.key}>
                            <label className="checkbox" style={{ justifyContent: 'center' }}>
                              <input
                                type="checkbox"
                                checked={checked}
                                aria-label={`${role} ${row.label} ${action.label}`}
                                onChange={(event) => {
                                  setPermission(role, row.key, action.key, event.target.checked);
                                  push(`Permission updated for ${role}`);
                                }}
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mut" style={{ fontSize: 12, marginTop: 12 }}>
        <Check size={12} style={{ verticalAlign: 'middle' }} /> Sidebar groups, command palette, buttons and
        dashboard widgets react to this matrix immediately. Super Admin starts with full platform access,
        Company Admin with full company access (platform pages hidden), HR with payroll/assets restricted, and
        Employees with self-service create on leave, WFH, expenses, complaints and trips.
      </p>
    </div>
  );
}
