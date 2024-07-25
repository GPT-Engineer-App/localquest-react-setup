import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/integrations/supabase/auth";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";

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
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="profile" element={<Profile />} />
                <Route path="create-event" element={<CreateEvent />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;