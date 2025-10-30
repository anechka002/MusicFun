import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Header} from "@/components/header/Header.tsx";
import {Routing} from "@/routing/Routing.tsx";

// Создаем клиента
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60,
    }
  }
})

// @ts-expect-error we dont need typing
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export const App = () => {
  return (
    // Даём его всему приложению
    <QueryClientProvider client={queryClient}>
      <Header/>
      <Routing/>
    </QueryClientProvider>
  );
};

