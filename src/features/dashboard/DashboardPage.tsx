import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, Pencil, Settings, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ClockCard } from '@/features/attendance/ClockCard';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/overlay';
import { useToast } from '@/components/ui/toast';
import { useLayoutStore } from '@/store/layout';
import { useUiStore } from '@/store/ui';
import { isSensitiveWidget } from '@/lib/utils';
import { strings } from '@/lib/strings';
import type { WidgetId } from '@/types';
import {
  AiWidget,
  AttritionWidget,
  EngagementWidget,
  GrowthWidget,
  KpiStrip,
  MixWidget,
  PulseWidget,
} from '@/features/dashboard/widgets';

const TITLES: Record<WidgetId, string> = {
  pulse: 'Workforce pulse',
  ai: 'AI insights',
  kpi: 'Key metrics',
  grow: 'Headcount growth',
  mix: 'Department mix',
  attr: 'Attrition by tenure',
  eng: 'Engagement drivers',
};

const renderWidget = (id: WidgetId) => {
  switch (id) {
    case 'pulse':
      return <PulseWidget />;
    case 'ai':
      return <AiWidget />;
    case 'kpi':
      return <KpiStrip />;
    case 'grow':
      return <GrowthWidget />;
    case 'mix':
      return <MixWidget />;
    case 'attr':
      return <AttritionWidget />;
    case 'eng':
      return <EngagementWidget />;
    default:
      return null;
  }
};

function SortableWidget({
  id,
  span,
  index,
  editing,
}: {
  id: WidgetId;
  span: number;
  index: number;
  editing: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { moveWidget, cycleSpan, toggleWidget } = useLayoutStore();

  return (
    <div
      ref={setNodeRef}
      className={`widget${editing ? ' editing' : ''} stagger`}
      style={
        {
          gridColumn: `span ${span}`,
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.6 : 1,
          zIndex: isDragging ? 5 : undefined,
          '--i': index,
        } as React.CSSProperties
      }
      {...(editing ? attributes : {})}
      {...(editing ? listeners : {})}
    >
      {editing ? (
        <div className="wt" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" aria-label="Move widget left" onClick={() => moveWidget(id, -1)}>
            <ChevronLeft size={12} />
          </button>
          <button type="button" aria-label="Move widget right" onClick={() => moveWidget(id, 1)}>
            <ChevronRight size={12} />
          </button>
          <button type="button" aria-label="Change widget width" onClick={() => cycleSpan(id)}>
            ⇔ {span}
          </button>
          <button type="button" aria-label="Hide widget" onClick={() => toggleWidget(id)}>
            <X size={12} />
          </button>
        </div>
      ) : null}
      {renderWidget(id)}
    </div>
  );
}

function WidgetDrawer() {
  const open = useUiStore((s) => s.widgetsOpen);
  const setOpen = useUiStore((s) => s.setWidgetsOpen);
  const { widgets, toggleWidget, resetLayout } = useLayoutStore();
  const { push } = useToast();
  const [draft, setDraft] = useState(widgets);

  useEffect(() => {
    if (open) setDraft(widgets);
  }, [open, widgets]);

  return (
    <Drawer open={open} title="Widgets" subtitle="Choose what appears on your overview" onClose={() => setOpen(false)}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {draft.map((widget) => (
          <label
            key={widget.id}
            className="checkbox"
            style={{ padding: '9px 0', borderBottom: '1px solid var(--bd)', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={!widget.hidden}
              onChange={() => {
                setDraft((current) =>
                  current.map((item) => (item.id === widget.id ? { ...item, hidden: !item.hidden } : item)),
                );
                toggleWidget(widget.id);
              }}
            />
            {TITLES[widget.id]}
          </label>
        ))}
      </div>
      <div className="form-actions" style={{ justifyContent: 'space-between' }}>
        <Button
          variant="ghost"
          onClick={() => {
            resetLayout();
            push(strings.layoutReset);
            setOpen(false);
          }}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            useLayoutStore.getState().save();
            push(strings.layoutSaved);
            setOpen(false);
          }}
        >
          Save
        </Button>
      </div>
    </Drawer>
  );
}

export default function DashboardPage() {
  const role = useUiStore((s) => s.role);
  const setWidgetsOpen = useUiStore((s) => s.setWidgetsOpen);
  const { widgets, editing, setEditing, reorder } = useLayoutStore();
  const { push } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const visible = useMemo(
    () => widgets.filter((widget) => !widget.hidden && !isSensitiveWidget(widget.id, role)),
    [widgets, role],
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = widgets.findIndex((widget) => widget.id === active.id);
    const to = widgets.findIndex((widget) => widget.id === over.id);
    if (from >= 0 && to >= 0) reorder(from, to);
  };

  return (
    <div>
      <PageHeader
        title={`Good morning, Ava`}
        subtitle={
          editing
            ? `${strings.greetingSub} ${strings.customizeHint}.`
            : strings.greetingSub
        }
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Pencil size={14} />}
              onClick={() => {
                const next = !editing;
                setEditing(next);
                if (!next) push(strings.layoutSaved);
              }}
            >
              {editing ? strings.done : strings.customize}
            </Button>
            <Button variant="ghost" icon={<Settings size={14} />} onClick={() => setWidgetsOpen(true)}>
              {strings.widgets}
            </Button>
          </>
        }
      />

      <ClockCard />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visible.map((widget) => widget.id)} strategy={rectSortingStrategy}>
          <div className="grid12">
            {visible.map((widget, index) => (
              <SortableWidget
                key={widget.id}
                id={widget.id}
                span={widget.span}
                index={index}
                editing={editing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <WidgetDrawer />
    </div>
  );
}
