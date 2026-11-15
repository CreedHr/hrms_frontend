import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@/types';
import { contrastText } from '@/lib/utils';

export type Mode = 'night' | 'day';

export const ACCENTS = ['#4f46e5', '#f97316', '#2d8cf0', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];
export const DEFAULT_ACCENT = '#2b9cf2';

interface UiState {
  mode: Mode;
  accent: string;
  role: Role;
  rail: boolean;
  drawer: boolean;
  paletteOpen: boolean;
  widgetsOpen: boolean;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setAccent: (accent: string) => void;
  resetAccent: () => void;
  setRole: (role: Role) => void;
  toggleRail: () => void;
  setDrawer: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  setWidgetsOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      mode: 'night',
      accent: DEFAULT_ACCENT,
      role: 'Super Admin',
      rail: false,
      drawer: false,
      paletteOpen: false,
      widgetsOpen: false,
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'night' ? 'day' : 'night' }),
      setAccent: (accent) => set({ accent }),
      resetAccent: () => set({ accent: DEFAULT_ACCENT }),
      setRole: (role) => set({ role }),
      toggleRail: () => set({ rail: !get().rail }),
      setDrawer: (drawer) => set({ drawer }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      setWidgetsOpen: (widgetsOpen) => set({ widgetsOpen }),
    }),
    { name: 'hrms-ui-v1' },
  ),
);

/** Apply mode + accent to the document so CSS variables recolour at runtime. */
export const applyTheme = (mode: Mode, accent: string): void => {
  const root = document.documentElement;
  root.dataset.mode = mode;
  root.style.setProperty('--ac', accent);
  root.style.setProperty('--bt', contrastText(accent));
  document.body.dataset.mode = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'night' ? '#0a0f1e' : '#eef3fb');
};
