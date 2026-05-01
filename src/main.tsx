import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,           // 10 minutes — no re-fetch within window
      gcTime: 30 * 60 * 1000,              // 30 minutes — keep in cache after unmount
      retry: 2,                             // Retry failed requests twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000), // exp. backoff
      refetchOnWindowFocus: true,           // Re-fetch on tab focus if stale
      refetchOnReconnect: true,             // Re-fetch on network recovery
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
