import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8000/api/logout/",
        {},
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Update the authentication state
        navigate("/"); // Redirect to login page
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
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
