import { navItems } from "../../nav-items";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <nav>
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;