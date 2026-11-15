import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, LayoutDashboard, RotateCcw, Search } from 'lucide-react';
import { groupsForRole } from '@/lib/nav';
import { usePermissions } from '@/hooks/usePermissions';
import { useUiStore } from '@/store/ui';
import { useToast } from '@/components/ui/toast';
import { resetDemoData } from '@/services/crud';
import { cn } from '@/lib/utils';
import type { AnyModuleKey } from '@/types';

interface LinkSpec {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  module: AnyModuleKey;
}

const SideLink = ({ item, onNavigate }: { item: LinkSpec; onNavigate: () => void }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => cn('nav-link', isActive && 'on')}
      title={item.label}
      onClick={onNavigate}
    >
      <Icon />
      <span>{item.label}</span>
    </NavLink>
  );
};

export function Sidebar() {
  const { can, role } = usePermissions();
  const setDrawer = useUiStore((s) => s.setDrawer);
  const navigate = useNavigate();
  const { push } = useToast();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string[]>(['overview', 'people']);

  const close = () => setDrawer(false);

  const groups = useMemo(
    () =>
      groupsForRole(role)
        .map((group) => ({ ...group, items: group.items.filter((item) => can(item.module, 'read')) }))
        .filter((group) => group.items.length > 0),
    [can, role],
  );

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return groups
      .flatMap((group) => group.items)
      .filter((item) => item.label.toLowerCase().includes(needle));
  }, [groups, query]);

  const toggle = (id: string) =>
    setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="brand">
        <span className="brand-mark">CC</span>
        <div className="brand-text">
          <b>Career Creed HR</b>
          <small>HR SERVICES</small>
        </div>
      </div>

      <div className="org">
        <b>CC</b>
        <div>
          Career Creed HR
          <small>{role === 'Super Admin' ? 'Platform admin' : '248 people · Pro plan'}</small>
        </div>
      </div>

      <label className="nav-search">
        <Search size={13} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter menu…"
          aria-label="Filter navigation"
        />
      </label>

      {query.trim() ? (
        <div style={{ paddingTop: 6 }}>
          {matches.length === 0 ? (
            <p className="mut" style={{ fontSize: 12, padding: '6px 12px' }}>
              No module found
            </p>
          ) : (
            matches.map((item) => <SideLink key={`${item.path}-${item.label}`} item={item} onNavigate={close} />)
          )}
        </div>
      ) : (
        groups.map((group) => {
          const expanded = open.includes(group.id);
          return (
            <div key={group.id}>
              <button
                type="button"
                className="nav-group"
                onClick={() => toggle(group.id)}
                aria-expanded={expanded}
              >
                <span>{group.label}</span>
                {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {expanded ? group.items.map((item) => <SideLink key={`${item.path}-${item.label}`} item={item} onNavigate={close} />) : null}
            </div>
          );
        })
      )}

      <div className="nav-ft">
        <button
          type="button"
          className="nav-link cta"
          onClick={() => {
            navigate('/payroll');
            close();
          }}
        >
          Payroll closes in 2 days
          <small>14 approvals pending</small>
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            resetDemoData();
            push('Demo data reset');
            window.setTimeout(() => window.location.reload(), 400);
          }}
        >
          <RotateCcw />
          <span>Reset demo data</span>
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            navigate('/plans');
            close();
          }}
        >
          <ChevronRight />
          <span>Org: Professional plan</span>
        </button>
      </div>
    </nav>
  );
}
