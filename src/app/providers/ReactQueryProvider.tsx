"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

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
            staleTime: 10 * 60 * 1000, // 10 min
            gcTime: 30 * 60 * 1000,    // 30 min
            retry: 2,
            retryOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
