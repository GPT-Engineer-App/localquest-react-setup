import { NavLink } from "react-router-dom";
import { Home, Calendar, User, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navItems = [
    { to: "/", icon: <Home className="w-4 h-4" />, label: "Home" },
    { to: "/events", icon: <Calendar className="w-4 h-4" />, label: "Events" },
    { to: "/profile", icon: <User className="w-4 h-4" />, label: "Profile" },
    { to: "/create-event", icon: <PlusCircle className="w-4 h-4" />, label: "Create Event" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div>
            <Button variant="outline">Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;