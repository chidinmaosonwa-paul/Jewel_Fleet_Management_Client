import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Journeys from "./Journeys.jsx";
import Tickets from "./Tickets.jsx";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("journeys");
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
    { key: "journeys", label: "Available Journeys" },
    { key: "tickets", label: "My Tickets" },
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
          <h2>Safara</h2>
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
            <h2>Safara</h2>
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
        {activePage === "journeys" && <Journeys />}
        {activePage === "tickets" && <Tickets />}
      </main>
    </div>
  );
};

export default UserDashboard;
