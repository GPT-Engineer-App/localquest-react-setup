import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./layouts/navbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {navItems.map((item) => (
            <Route key={item.to} path={item.to} element={item.page} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;