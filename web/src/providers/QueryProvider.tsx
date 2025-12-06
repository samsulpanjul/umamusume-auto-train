import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const getMinute = (minute: number) => {
  return minute * 60 * 1000;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: getMinute(60),
    },
  },
});

if (typeof window !== "undefined") {
  const localStoragePersister = createAsyncStoragePersister({
    storage: {
      getItem: async (key) => window.localStorage.getItem(key),
      setItem: async (key, value) => window.localStorage.setItem(key, value),
      removeItem: async (key) => window.localStorage.removeItem(key),
    },
  });

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: getMinute(60),
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
