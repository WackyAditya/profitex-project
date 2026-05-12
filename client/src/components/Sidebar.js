import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">Profitex</h2>

      <nav>
        <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">
          Dashboard
        </Link>

        <Link className={location.pathname === "/products" ? "active" : ""} to="/products">
          Products
        </Link>

        <Link to="/invoices">Invoices</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
