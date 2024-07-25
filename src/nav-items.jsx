import { Home, Map, Calendar, User, LogIn } from "lucide-react";
import Index from "./pages/Index.jsx";
import Explore from "./pages/Explore.jsx";
import Events from "./pages/Events.jsx";
import Profile from "./pages/Profile.jsx";
import Auth from "./pages/Auth.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Explore",
    to: "/explore",
    icon: <Map className="h-4 w-4" />,
    page: <Explore />,
  },
  {
    title: "Events",
    to: "/events",
    icon: <Calendar className="h-4 w-4" />,
    page: <Events />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <LogIn className="h-4 w-4" />,
    page: <Auth />,
  },
];