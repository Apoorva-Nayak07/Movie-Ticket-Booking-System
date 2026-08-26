import { Film, LogOut, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/movies" className="navbar-brand">
          <span className="brand-icon">
            <Film size={21} />
          </span>

          <span>
            Cine<span className="brand-accent">Sync</span>
          </span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/shows"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Shows
          </NavLink>

          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            My Bookings
          </NavLink>
        </nav>

        <div className="nav-user">
          <span className="user-name">
            <User size={15} style={{ verticalAlign: "middle" }} />{" "}
            {user?.name || "User"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}