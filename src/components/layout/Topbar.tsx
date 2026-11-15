import { Bell, Menu, Moon, PanelLeftClose, Search, Sun } from 'lucide-react';
import { ACCENTS, DEFAULT_ACCENT, useUiStore } from '@/store/ui';
import { ROLES } from '@/types';
import { useToast } from '@/components/ui/toast';
import { strings } from '@/lib/strings';

export function Topbar() {
  const {
    mode,
    toggleMode,
    accent,
    setAccent,
    resetAccent,
    role,
    setRole,
    toggleRail,
    setDrawer,
    setPaletteOpen,
  } = useUiStore();
  const { push } = useToast();

  return (
    <header className="top">
      <button
        type="button"
        className="icon-btn only-mobile"
        aria-label="Open navigation"
        onClick={() => {
          setDrawer(true);
        }}
      >
        <Menu />
      </button>

      <button type="button" className="search" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
        <Search />
        <span>{strings.searchPlaceholder}</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="top-actions">
        <div className="swatches" role="group" aria-label="Accent colour">
          {ACCENTS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Accent ${swatch}`}
              aria-pressed={accent === swatch}
              className={accent === swatch ? 'on' : undefined}
              style={{ background: swatch }}
              onClick={() => setAccent(swatch)}
            />
          ))}
          <button
            type="button"
            aria-label="Reset accent"
            title="Reset accent"
            style={{ background: DEFAULT_ACCENT, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11 }}
            onClick={() => {
              resetAccent();
              push('Accent reset');
            }}
          >
            ↺
          </button>
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label={mode === 'night' ? 'Switch to day mode' : 'Switch to night mode'}
          title={mode === 'night' ? 'Day mode' : 'Night mode'}
          onClick={toggleMode}
        >
          {mode === 'night' ? <Sun /> : <Moon />}
        </button>

        <button type="button" className="icon-btn" aria-label="Notifications" title="Notifications" onClick={() => push('3 unread notifications')}>
          <Bell />
          <s className="dot" />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          onClick={toggleRail}
        >
          <PanelLeftClose />
        </button>

        <select
          className="role-select"
          value={role}
          onChange={(event) => {
            setRole(event.target.value as (typeof ROLES)[number]);
            push(`Viewing as ${event.target.value}`);
          }}
          aria-label="Switch demo role"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--bd)',
            borderRadius: 'var(--rs)',
            padding: '0 10px',
            cursor: 'pointer',
          }}
        >
          {ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
