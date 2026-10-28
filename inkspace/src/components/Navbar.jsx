import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Feather, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/write", label: "Write" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? "/" : "/login"} className="logo" onClick={close}>
          <Feather size={22} /> Ink<span>Space</span>
        </Link>

        {user && (
          <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="nav-actions">
          <ThemeToggle />

          {user && (
            <>
              <span
                className="avatar nav-avatar"
                title={user.name}
                aria-label={`Signed in as ${user.name}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <button
                className="icon-btn"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
              <button
                className="icon-btn menu-btn"
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}