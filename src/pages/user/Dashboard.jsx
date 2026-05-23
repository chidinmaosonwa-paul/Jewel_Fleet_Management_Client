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
          <h2>Safaraa</h2>
        </div>
      </div>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
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
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
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
