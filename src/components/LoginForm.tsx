import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/apiLogin";
import "../css/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setAuthUsername } = useAuth();
  const navigate = useNavigate();

  const [alertError, setAlertError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await login({ username, password });
      setAuthUsername(data.user.username);
      setIsLoggedIn(true);
      setAlertError(null);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setAlertError("Wrong username or password");
    }
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
        {alertError && <div className="error-text">{alertError}</div>}
        <button type="submit" className="login-button">
          Login
        </button>
        <p style={{ marginTop: "20px" }}>
          Don't have an account?
          <br />
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
