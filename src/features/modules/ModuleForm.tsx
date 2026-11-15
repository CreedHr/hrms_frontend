import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/overlay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { MODULES } from '@/features/modules/config';
import { useCreateRecord, useUpdateRecord } from '@/services/queries';
import { strings } from '@/lib/strings';
import type { FieldDef, FieldValue, HrRecord, ModuleKey } from '@/types';

type FormValues = Record<string, FieldValue | undefined>;

const buildSchema = (fields: FieldDef[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    if (field.type === 'number' || field.type === 'money') {
      const base = z.coerce.number({ invalid_type_error: 'Enter a number' });
      shape[field.key] = field.required ? base : base.optional();
    } else {
      const base = z.string();
      shape[field.key] = field.required ? base.min(1, 'Required') : base.optional();
    }
  });
  return z.object(shape);
};

const defaultsFor = (fields: FieldDef[], record: HrRecord | null): FormValues => {
  const values: FormValues = {};
  fields.forEach((field) => {
    const current = record?.[field.key];
    if (current !== undefined) values[field.key] = current;
    else if (field.key === 'status') values[field.key] = 'Pending';
    else values[field.key] = field.type === 'select' ? (field.options?.[0] ?? '') : '';
  });
  return values;
};

export function ModuleForm({
  module,
  open,
  record,
  onClose,
  onSaved,
}: {
  module: ModuleKey;
  open: boolean;
  record: HrRecord | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const config = MODULES[module];
  const create = useCreateRecord(module);
  const update = useUpdateRecord(module);
  const { push } = useToast();

  const schema = buildSchema(config.fields);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: defaultsFor(config.fields, record),
  });

  useEffect(() => {
    if (open) reset(defaultsFor(config.fields, record));
  }, [open, record, reset, config.fields]);

  const fieldError = (key: string): string | undefined => {
    const entry = errors[key];
    return typeof entry?.message === 'string' ? entry.message : undefined;
  };

  const submit = handleSubmit(async (values) => {
    const payload: Record<string, FieldValue> = {};
    config.fields.forEach((field) => {
      const value = values[field.key];
      if (value === '' || value === undefined) return;
      if (field.type === 'number' || field.type === 'money') payload[field.key] = Number(value);
      else payload[field.key] = value;
    });

    try {
      if (record) {
        await update.mutateAsync({ id: record.id, patch: payload });
        push(`${strings.recordUpdated} · ${record.id}`);
      } else {
        await create.mutateAsync(payload);
        push(strings.recordAdded);
      }
      onSaved();
    } catch {
      push(strings.recordError, 'error');
    }
  });

  return (
    <Modal
      open={open}
      title={record ? `Edit ${config.title}` : `Add ${config.title}`}
      subtitle={record ? record.id : 'New records start in Pending status'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {strings.cancel}
          </Button>
          <Button onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : strings.save}
          </Button>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          {config.fields.map((field) => {
            const wide = field.type === 'textarea';
            const id = `${module}-${field.key}`;
            return (
              <div className="field" key={field.key} style={wide ? { gridColumn: 'span 2' } : undefined}>
                <label htmlFor={id}>
                  {field.label}
                  {field.required ? '*' : ''}
                </label>
                {field.type === 'select' ? (
                  <select id={id} {...register(field.key)}>
                    <option value="">Select…</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea id={id} placeholder={field.placeholder} {...register(field.key)} />
                ) : (
                  <input
                    id={id}
                    type={
                      field.type === 'money'
                        ? 'number'
                        : field.type === 'number'
                          ? 'number'
                          : field.type === 'date'
                            ? 'date'
                            : field.type === 'email'
                              ? 'email'
                              : field.type === 'tel'
                                ? 'tel'
                                : 'text'
                    }
                    step={field.type === 'money' ? '0.01' : undefined}
                    placeholder={field.placeholder}
                    {...register(field.key)}
                  />
                )}
                {fieldError(field.key) ? <span className="err">{fieldError(field.key)}</span> : null}
              </div>
            );
          })}
        </div>
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
