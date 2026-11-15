import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { useUiStore } from '@/store/ui';

export function AppShell() {
  const drawer = useUiStore((s) => s.drawer);
  const setDrawer = useUiStore((s) => s.setDrawer);
  const setPaletteOpen = useUiStore((s) => s.setPaletteOpen);
  const rail = useUiStore((s) => s.rail);
  const location = useLocation();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setPaletteOpen]);

  useEffect(() => {
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, setDrawer]);

  return (
    <div className="shell" data-rail={rail ? 'true' : 'false'} data-drawer={drawer ? 'true' : 'false'}>
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      <Sidebar />
      <Topbar />
      <main className="main" id="main" key={location.pathname}>
        <Outlet />
      </main>
      <CommandPalette />
      {drawer ? <div className="scrim" onClick={() => setDrawer(false)} aria-hidden="true" /> : null}
    </div>
  );
}
