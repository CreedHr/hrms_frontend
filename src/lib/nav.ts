import { NAV_GROUPS, type NavGroup, type NavItem } from '@/features/modules/registry';
import type { Role } from '@/types';

/** Groups visible to a role audience (platform vs company). */
export const groupsForRole = (role: Role): NavGroup[] =>
  NAV_GROUPS.filter((group) => {
    if (!group.audience) return true;
    return group.audience === 'platform' ? role === 'Super Admin' : role !== 'Super Admin';
  });

export const allNavItems = (role: Role): NavItem[] =>
  groupsForRole(role).flatMap((group) => group.items);

export const moduleNavAll = (): NavItem[] => NAV_GROUPS.flatMap((group) => group.items);

export const groupLabelFor = (path: string): string => {
  const group = NAV_GROUPS.find((candidate) => candidate.items.some((item) => item.path === path));
  return group?.label ?? 'Workspace';
};
