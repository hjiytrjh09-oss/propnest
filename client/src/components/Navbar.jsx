import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          Prop<span>Nest</span>
        </Link>
        <nav>
          {user ? (
            <>
              {(user.role === "agent" || user.role === "admin") && (
                <Link to="/dashboard">Dashboard</Link>
              )}
              <Link to="/favorites">Favorites</Link>
              <span className="muted">Hi, {user.name.split(" ")[0]}</span>
              <button
                className="btn btn-outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
