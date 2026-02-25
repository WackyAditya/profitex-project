import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">

        <h2 className="logo">Profitex</h2>

        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active-link" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/products"
          className={location.pathname === "/products" ? "active-link" : ""}
        >
          Products
        </Link>

        <Link
          to="/invoices"
          className={location.pathname === "/invoices" ? "active-link" : ""}
        >
          Invoices
        </Link>

        <Link
          to="/purchases"
          className={location.pathname === "/purchases" ? "active-link" : ""}
        >
          Purchases
        </Link>

        <Link
          to="/expenses"
          className={location.pathname === "/expenses" ? "active-link" : ""}
        >
          Expenses
        </Link>

        <Link
          to="/settings"
          className={location.pathname === "/settings" ? "active-link" : ""}
        >
          Settings
        </Link>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">

        {/* ===== TOPBAR ===== */}
        <div className="topbar">

          <input
            className="search-input"
            placeholder="Search products, invoices..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                alert(`Search for: ${e.target.value}`);
              }
            }}
          />

          <div className="topbar-right">

            <span className="welcome-text">
              Welcome, {user?.name || "User"}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* ===== PAGE CONTENT ===== */}
        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
};

export default Layout;
    