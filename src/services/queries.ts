import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resetDemoData } from '@/services/crud';
import { serviceFor } from '@/services';
import type { HrRecord, ListParams, ModuleKey, Page } from '@/types';

export const recordsKey = (module: ModuleKey, params: ListParams = {}) =>
  ['records', module, params] as const;

export function useRecords(module: ModuleKey, params: ListParams = {}) {
  return useQuery<Page<HrRecord>>({
    queryKey: recordsKey(module, params),
    queryFn: async () => (await serviceFor(module).list(params)) as Page<HrRecord>,
    placeholderData: (previous) => previous,
  });
}

export function useCreateRecord(module: ModuleKey) {
  const queryClient = useQueryClient();
  return useMutation<HrRecord, Error, Partial<HrRecord>>({
    mutationFn: async (input) => (await serviceFor(module).create(input)) as HrRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['records', module] }),
  });
}

export function useUpdateRecord(module: ModuleKey) {
  const queryClient = useQueryClient();
  return useMutation<HrRecord, Error, { id: string; patch: Partial<HrRecord> }>({
    mutationFn: async ({ id, patch }) => (await serviceFor(module).update(id, patch)) as HrRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['records', module] }),
  });
}

export function useRemoveRecord(module: ModuleKey) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => serviceFor(module).remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['records', module] }),
  });
}

export function useResetDemoData(module: ModuleKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      resetDemoData();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['records', module] }),
  });
}
