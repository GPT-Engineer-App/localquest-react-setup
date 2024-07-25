import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import { NotificationWrapper } from "@/components/Notification";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        <NotificationWrapper>
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
        </NotificationWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;