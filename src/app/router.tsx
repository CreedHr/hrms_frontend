import { Suspense, lazy, type ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { usePermissions } from '@/hooks/usePermissions';
import { SkeletonRows } from '@/components/ui/states';
import { MODULE_LIST } from '@/features/modules/registry';
import type { AnyModuleKey } from '@/types';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ModulePage = lazy(async () => {
  const module = await import('@/features/modules/ModulePage');
  return { default: module.ModulePage };
});
const RolesPage = lazy(() => import('@/features/roles/RolesPage'));
const PlansPage = lazy(() => import('@/features/plans/PlansPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const SuperAdminPage = lazy(() => import('@/features/admin/SuperAdminPage'));
const MediaLibraryPage = lazy(() => import('@/features/media/MediaLibraryPage'));
const CalendarPage = lazy(() => import('@/features/calendar/CalendarPage'));

const Fallback = () => (
  <div className="card" style={{ marginTop: 20 }}>
    <SkeletonRows rows={6} cols={4} />
  </div>
);

const Guard = ({ module, children }: { module: AnyModuleKey; children: ReactNode }) => {
  const { can } = usePermissions();
  if (!can(module, 'read')) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const page = (element: ReactNode) => <Suspense fallback={<Fallback />}>{element}</Suspense>;

const routePath = (path: string): string => path.replace(/^\//, '');

const moduleRoutes = MODULE_LIST.flatMap((config) => {
  const element = () => (
    <Guard module={config.key}>{page(<ModulePage module={config.key} />)}</Guard>
  );
  return [
    { path: routePath(config.path), element: element() },
    ...(config.aliases ?? []).map((alias) => ({ path: routePath(alias), element: element() })),
  ];
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: page(<DashboardPage />) },
      {
        path: 'admin',
        element: <Guard module="admin">{page(<SuperAdminPage />)}</Guard>,
      },
      ...moduleRoutes,
      {
        path: 'roles',
        element: <Guard module="roles">{page(<RolesPage />)}</Guard>,
      },
      {
        path: 'plans',
        element: <Guard module="plans">{page(<PlansPage />)}</Guard>,
      },
      {
        path: 'settings',
        element: <Guard module="settings">{page(<SettingsPage />)}</Guard>,
      },
      {
        path: 'media',
        element: <Guard module="mediaLibrary">{page(<MediaLibraryPage />)}</Guard>,
      },
      {
        path: 'calendar',
        element: <Guard module="calendar">{page(<CalendarPage />)}</Guard>,
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
