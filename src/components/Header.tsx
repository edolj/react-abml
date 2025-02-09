import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const csrfToken = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("csrftoken="))
    ?.split("=")[1];

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8000/api/logout/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      )
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
      <div className="logo">ABML</div>
      <div className="nav">
        {isLoggedIn && (
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt size={18} style={{ marginRight: "8px" }} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
