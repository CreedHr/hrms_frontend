import { useCallback } from 'react';
import { useRbacStore } from '@/store/rbac';
import { useUiStore } from '@/store/ui';
import type { Action, AnyModuleKey, Permission } from '@/types';

export interface PermissionsApi {
  role: ReturnType<typeof useUiStore.getState>['role'];
  can: (module: AnyModuleKey, action: Action) => boolean;
  forModule: (module: AnyModuleKey) => Permission;
  /** "C R U D" letters the current role holds on a module. */
  accessLetters: (module: AnyModuleKey) => string;
  matrix: ReturnType<typeof useRbacStore.getState>['matrix'];
}

export function usePermissions(): PermissionsApi {
  const role = useUiStore((s) => s.role);
  const matrix = useRbacStore((s) => s.matrix);

  const can = useCallback(
    (module: AnyModuleKey, action: Action) => Boolean(matrix[role]?.[module]?.[action]),
    [matrix, role],
  );

  const forModule = useCallback(
    (module: AnyModuleKey): Permission =>
      matrix[role]?.[module] ?? { create: false, read: false, update: false, delete: false },
    [matrix, role],
  );

  const accessLetters = useCallback(
    (module: AnyModuleKey) => {
      const p = forModule(module);
      return (['create', 'read', 'update', 'delete'] as Action[])
        .filter((action) => p[action])
        .map((action) => action[0]?.toUpperCase() ?? '')
        .join(' ');
    },
    [forModule],
  );

  return { role, can, forModule, accessLetters, matrix };
}
