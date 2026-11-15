import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/app/router';
import { ToastProvider } from '@/components/ui/toast';
import { applyTheme, useUiStore } from '@/store/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 15_000,
    },
  },
});

export function App() {
  const mode = useUiStore((s) => s.mode);
  const accent = useUiStore((s) => s.accent);

  useEffect(() => {
    applyTheme(mode, accent);
  }, [mode, accent]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
