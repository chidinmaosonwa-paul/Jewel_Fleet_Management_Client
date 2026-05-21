import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Vehicles from "./Vehicles.jsx";
import Destinations from "./Destinations.jsx";
import Journeys from "./Journeys.jsx";
import Tickets from "./Tickets.jsx";
import Reports from "./Reports.jsx";
import Financial from "./Financial.jsx";
import Drivers from "./Drivers.jsx";
import Overview from "./Overview.jsx";
import Users from "./Users.jsx";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (key) => {
    setActivePage(key);
    setSidebarOpen(false);
  };

  const menuItems = [
    { key: "drivers", label: "Drivers" },
    { key: "overview", label: "Overview" },
    { key: "vehicles", label: "Vehicles" },
    { key: "destinations", label: "Destinations" },
    { key: "journeys", label: "Journeys" },
    { key: "tickets", label: "Tickets" },
    { key: "reports", label: "Reports" },
    { key: "financial", label: "Financial" },
    { key: "users", label: "Users" },
  ];

  return (
    <div className="dashboard">
      <div className="mobile-topbar">
        <button
          className="topbar-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
        <div className="sidebar-logo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="26" r="4" fill="var(--accent)" />
            <circle cx="26" cy="6" r="4" fill="var(--accent)" opacity="0.5" />
            <path
              d="M6 26 C6 14 26 18 26 6"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <h2>Safaraa</h2>
        </div>
      </div>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6" cy="26" r="4" fill="var(--accent)" />
              <circle cx="26" cy="6" r="4" fill="var(--accent)" opacity="0.5" />
              <path
                d="M6 26 C6 14 26 18 26 6"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <h2>Safaraa</h2>
          </div>
          <p>Welcome, {user?.firstName}</p>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => handleNavClick(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        {activePage === "overview" && <Overview />}
        {activePage === "drivers" && <Drivers />}
        {activePage === "vehicles" && <Vehicles />}
        {activePage === "destinations" && <Destinations />}
        {activePage === "journeys" && <Journeys />}
        {activePage === "tickets" && <Tickets />}
        {activePage === "reports" && <Reports />}
        {activePage === "financial" && <Financial />}
        {activePage === "users" && <Users />}
      </main>
    </div>
  );
};

export default AdminDashboard;
