import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import apiClient from "../api/apiClient";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
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

  return (
    <div className="header">
      <div className="left-nav">
        <div className="logo">ABML</div>
        {isLoggedIn && (
          <div className="menu">
            <button onClick={() => navigate("/home")}>HOME</button>
            <button onClick={() => navigate("/selectDomain")}>DOMAIN</button>
            {isSuperuser && (
              <button onClick={() => navigate("/users")}>USERS</button>
            )}
          </div>
        )}
      </div>
      {isLoggedIn && (
        <>
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 20 }}
          >
            <span style={{ color: "#fff", fontWeight: 500, marginRight: 0 }}>
              {username}
            </span>
            <button
              className="logout-button"
              onClick={handleLogout}
              style={{ marginLeft: 0 }}
            >
              <FaSignOutAlt size={18} style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
