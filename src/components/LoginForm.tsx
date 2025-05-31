import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Alert from "./Alert";
import "../css/LoginForm.css";

const getCSRFToken = () => {
  const csrfToken = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("csrftoken="))
    ?.split("=")[1];
  return csrfToken;
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setAuthUsername } = useAuth();
  const navigate = useNavigate();

  const [alertError, setAlertError] = useState<string | null>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const csrfToken = getCSRFToken();

    axios
      .post(
        "http://localhost:8000/api/login/",
        { username, password },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setAuthUsername(response.data.user.username);
        setIsLoggedIn(true);
        setAlertError(null);
        navigate("/selectDomain");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setAlertError("Invalid credentials");
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setAlertError(null);
          }}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setAlertError(null);
          }}
          placeholder="Password"
          className="login-input"
        />
        {alertError && (
          <Alert onClose={() => setAlertError(null)}>{alertError}</Alert>
        )}
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register here
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
