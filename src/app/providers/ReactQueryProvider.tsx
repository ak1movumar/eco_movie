"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * Провайдер для React Query с оптимизированной конфигурацией кеширования
 */
export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Какосит данные в течение 5 минут
            staleTime: 5 * 60 * 1000,
            // Удаляет неиспользованные данные из памяти через 10 минут
            gcTime: 10 * 60 * 1000,
            // Автоматический повтор при ошибке сети (максимум 3 раза)
            retry: 3,
            // Не повторять при ошибке 4xx
            retryOnMount: false,
          },
          mutations: {
            // Автоматический повтор при ошибке (максимум 2 раза)
            retry: 2,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
