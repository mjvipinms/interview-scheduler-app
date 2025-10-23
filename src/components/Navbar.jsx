import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MENU_CONFIG = {
  ADMIN: [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Configuration", path: "/admin/configuration" },
  ],
  HR: [
    { label: "Dashboard", path: "/hr-dashboard" },
    { label: "Calendar", path: "/hr/calendar" },
    { label: "Candidates", path: "/users/role/CANDIDATE" },
    { label: "Panelist", path: "/users/role/PANEL" },
    { label: "Notifications", path: "/hr/notifications" },
    { label: "Change Request", path: "/hr/change-requests" },
    { label: "Reports", path: "/hr/reports" },
  ],
  PANEL: [
    { label: "Dashboard", path: "/panel-dashboard" },
    { label: "Calendar", path: "/panel/calendar" },
    { label: "Notifications", path: "/panel/notifications" },
    { label: "Change Request", path: "/panel/change-request" },
  ],
};

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const storedName = localStorage.getItem("userFullName");
    if (storedName) setUserName(storedName);
    setRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menus = MENU_CONFIG[role] || [];

  return (
<nav className="bg-primary text-white px-6 py-3 flex items-center sticky top-0 z-50 shadow-md">
      <div className="flex gap-4 font-medium">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className="hover:underline"
          >
            {menu.label}
          </Link>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm">Interview Scheduler</span>
        {userName && (
          <span className="text-gray-600 text-lg font-medium">
            – {userName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-3 py-1 rounded hover:bg-sky-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
