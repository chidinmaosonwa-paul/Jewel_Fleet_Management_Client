import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Vehicles from './vehicles.jsx';
import Destinations from './Destinations.jsx';
import Journeys from './Journeys.jsx';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'destinations', label: 'Destinations' },
    { key: 'journeys', label: 'Journeys' },
    { key: 'tickets', label: 'Tickets' },
    { key: 'reports', label: 'Reports' },
    { key: 'financial', label: 'Financial' },
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
              className={`nav-item ${activePage === item.key ? 'active' : ''}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>
      <main className="main-content">
        {activePage === 'overview' && (
          <div>
            <h1>Overview</h1>
            <p>Select a section from the sidebar to get started.</p>
          </div>
        )}
        {activePage === 'vehicles' && <Vehicles />}
        {activePage === 'destinations' && <Destinations />}
        {activePage === 'journeys' && <Journeys />}
        {activePage === 'tickets' && <p>Tickets section coming soon.</p>}
        {activePage === 'reports' && <p>Reports section coming soon.</p>}
        {activePage === 'financial' && <p>Financial section coming soon.</p>}
      </main>
    </div>
  );
};

export default AdminDashboard;