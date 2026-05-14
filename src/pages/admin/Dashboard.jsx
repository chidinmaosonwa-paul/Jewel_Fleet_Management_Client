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

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Fleet Management</h2>
          <p>Welcome, {user?.firstName}</p>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
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
