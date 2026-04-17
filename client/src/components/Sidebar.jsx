import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed, user }) => {
  const items = [
    { label: "Dashboard", path: "/dashboard", short: "DB" },
    { label: "New Request", path: "/new-request", short: "NR" },
    { label: "My Requests", path: "/my-requests", short: "MR" },
    ...(user?.role === "admin"
      ? [{ label: "Admin", path: "/admin", short: "AD" }]
      : []),
    { label: "AI Assistant", path: "/assistant", short: "AI" },
  ];

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: collapsed ? 92 : 276 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="sidebar-top">
        <div className="brand-mark">SRH</div>
        {!collapsed && (
          <div>
            <h1>Smart Request Hub</h1>
            <p>Service operations cockpit</p>
          </div>
        )}
      </div>

      <button
        className="ghost-button sidebar-toggle"
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((value) => !value)}
      >
        {collapsed ? "›" : "Collapse sidebar"}
      </button>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            <span className="nav-icon">{item.short}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <p>
            Signed in as <strong>{user?.username}</strong>
          </p>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;

