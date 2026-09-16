import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBookOpen, FaChartBar, FaHome, FaInfoCircle } from "react-icons/fa";
import { FaSignOutAlt, FaUserCircle, FaPlus } from "react-icons/fa";
import apiClient from "../api/apiClient";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn, username, isSuperuser } = useAuth();

  const handleLogout = () => {
    apiClient
      .post("/logout/")
      .then(() => {
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (!isLoggedIn) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Left sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <FaBookOpen />
          </div>

          <div className="sidebar-title">ABML Tutor</div>
        </div>

        <nav className="sidebar-navigation">
          <div className="sidebar-section-label">MENI</div>

          <button
            className={`sidebar-link ${
              isActive("/home") ? "active" : ""
            }`}
            onClick={() => navigate("/home")}
          >
            <FaHome />
            <span>Nadzorna plošča</span>
          </button>

          <button
            className={`sidebar-link ${
              isActive("/selectDomain") ? "active" : ""
            }`}
            onClick={() => navigate("/selectDomain")}
          >
            <FaPlus />
            <span>Nova seja</span>
          </button>

          <button
            className={`sidebar-link ${
              isActive("/history") || isActive("/users") ? "active" : ""
            }`}
            onClick={() =>
              navigate(isSuperuser ? "/users" : "/history")
            }
          >
            <FaChartBar />
            <span>{isSuperuser ? "Uporabniki" : "Zgodovina"}</span>
          </button>

          <button
            className={`sidebar-link ${
              isActive("/instructions") ? "active" : ""
            }`}
            onClick={() => navigate("/instructions")}
          >
            <FaInfoCircle />
            <span>Navodila</span>
          </button>
        </nav>
      </aside>

      {/* Small top bar */}
      <header className="app-topbar">
        <div className="topbar-user">
          <FaUserCircle className="topbar-user-icon" />
          <span>{username}</span>

          <button
            className="topbar-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Odjava</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;