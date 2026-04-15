'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:            30 * 1000,
        gcTime:               5 * 60 * 1000,
        retry:                2,
        retryDelay:           (i) => Math.min(1000 * Math.pow(2, i), 10000),
        refetchOnWindowFocus: true,
        refetchOnReconnect:   true,
        throwOnError:         false,
      },
      mutations: { retry: 0 },
    },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
