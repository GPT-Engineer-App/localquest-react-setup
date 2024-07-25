import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/integrations/supabase/auth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                {navItems.map((item) => (
                  <Route key={item.to} path={item.to} element={item.page} />
                ))}
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;