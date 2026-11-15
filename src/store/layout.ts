import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WIDGETS } from '@/lib/utils';
import type { WidgetState } from '@/types';

interface LayoutState {
  widgets: WidgetState[];
  editing: boolean;
  setEditing: (editing: boolean) => void;
  toggleWidget: (id: WidgetState['id']) => void;
  cycleSpan: (id: WidgetState['id']) => void;
  moveWidget: (id: WidgetState['id'], direction: -1 | 1) => void;
  reorder: (from: number, to: number) => void;
  save: () => void;
  resetLayout: () => void;
}

const SPANS = [3, 4, 6, 8, 12];

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      widgets: DEFAULT_WIDGETS,
      editing: false,
      setEditing: (editing) => set({ editing }),
      toggleWidget: (id) =>
        set({
          widgets: get().widgets.map((w) => (w.id === id ? { ...w, hidden: !w.hidden } : w)),
        }),
      cycleSpan: (id) =>
        set({
          widgets: get().widgets.map((w) => {
            if (w.id !== id) return w;
            const index = SPANS.indexOf(w.span);
            const span = SPANS[(index + 1) % SPANS.length] ?? 4;
            return { ...w, span };
          }),
        }),
      moveWidget: (id, direction) =>
        set(() => {
          const widgets = [...get().widgets];
          const index = widgets.findIndex((w) => w.id === id);
          const target = index + direction;
          if (index < 0 || target < 0 || target >= widgets.length) return { widgets };
          const [item] = widgets.splice(index, 1);
          if (item) widgets.splice(target, 0, item);
          return { widgets };
        }),
      reorder: (from, to) =>
        set(() => {
          const widgets = [...get().widgets];
          const [item] = widgets.splice(from, 1);
          if (item) widgets.splice(to, 0, item);
          return { widgets };
        }),
      save: () => set({ editing: false }),
      resetLayout: () => set({ widgets: DEFAULT_WIDGETS, editing: false }),
    }),
    { name: 'hrms-layout-v1' },
  ),
);
