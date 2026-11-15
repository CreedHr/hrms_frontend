import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Search } from 'lucide-react';
import { groupsForRole } from '@/lib/nav';
import { usePermissions } from '@/hooks/usePermissions';
import { useUiStore } from '@/store/ui';
import { useToast } from '@/components/ui/toast';
import { strings } from '@/lib/strings';

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen);
  const setOpen = useUiStore((s) => s.setPaletteOpen);
  const { can, role } = usePermissions();
  const navigate = useNavigate();
  const { push } = useToast();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(
    () =>
      groupsForRole(role)
        .flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })))
        .filter((item) => can(item.module, 'read')),
    [can, role],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) || item.group.toLowerCase().includes(needle),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelected((current) => Math.min(current + 1, Math.max(filtered.length - 1, 0)));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelected((current) => Math.max(current - 1, 0));
      }
      if (event.key === 'Enter') {
        const target = filtered[selected];
        if (target) {
          navigate(target.path);
          setOpen(false);
        } else {
          push(strings.noModule, 'error');
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, filtered, selected, navigate, setOpen, push]);

  if (!open) return null;

  return createPortal(
    <div className="palette" onClick={() => setOpen(false)}>
      <div className="palette-box" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input">
          <Search />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder="Jump to any module…"
            aria-label="Search modules"
          />
          <kbd>Esc</kbd>
        </div>
        {filtered.length === 0 ? (
          <div className="palette-empty">{strings.noModule}</div>
        ) : (
          <ul className="palette-list">
            {filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={`${item.path}-${item.label}`}>
                  <button
                    type="button"
                    className={index === selected ? 'sel' : undefined}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    <small style={{ marginLeft: 'auto', opacity: 0.6, fontSize: 10.5 }}>{item.group}</small>
                    {index === selected ? <CornerDownLeft size={13} /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
