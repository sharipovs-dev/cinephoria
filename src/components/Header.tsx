import { useAuth } from "../Contexts/AuthContext";
import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header-container">
      <div className="logo-container">
        <h1 className="logo">Cinephoria</h1>
      </div>

      <div className="header-navigations">
        <div className="header-navigations-main">
          <NavLink className="header-links" to="/">Popular</NavLink>
          <NavLink className="header-links" to="/top-rated">Top Rated</NavLink>
          <NavLink className="header-links" to="/upcoming">Upcoming</NavLink>
          <NavLink className="header-links" to="/genres">Genres</NavLink>
          <NavLink className="header-links" to="/favorites">Favorites</NavLink>
        </div>

        <div className="header-navigations-auth">
          {user ? (
            <>
              <button className="header-auth" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="header-auth" to="/signup">Sign Up</NavLink>
              <NavLink className="header-auth" to="/login">Login</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}