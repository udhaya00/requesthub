import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AppShell = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />

      <div className="app-shell-content">
        <header className="app-header">
          <div>
            <span className="eyebrow">Enterprise Request Management</span>
            <h2>Welcome back, {user?.name?.split(" ")[0] || user?.username}</h2>
          </div>

          <div className="header-actions">
            <div className="user-chip">
              <strong>{user?.username}</strong>
              <span>{user?.role}</span>
            </div>
            <button className="secondary-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
