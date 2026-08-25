import { NavLink, Link, useNavigate, Outlet } from "react-router-dom";
import {
  Film,
  Home,
  LogOut,
  Ticket,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

    return (
    <>
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/movies" className="navbar-brand">
          <span className="navbar-logo">
            <Film size={22} />
          </span>

          <span>CineSync</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/movies">
            <Home size={18} />
            Movies
          </NavLink>

          <NavLink to="/shows">
            <Ticket size={18} />
            Shows
          </NavLink>

          <NavLink to="/my-bookings">
            <Ticket size={18} />
            My Bookings
          </NavLink>
        </nav>

        <div className="navbar-user">
          <div className="user-info">
            <User size={18} />
            <span>{user?.name || "User"}</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      </header>
      <Outlet />
    </>
  );
}