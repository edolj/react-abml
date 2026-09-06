import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/apiLogin";
import { FaBookOpen } from "react-icons/fa";
import "../css/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { checkSession } = useAuth();
  const navigate = useNavigate();

  const [alertError, setAlertError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login({ username, password });
      await checkSession();
      setAlertError(null);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setAlertError("Wrong username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <FaBookOpen />
          </div>
          <span>ABML Tutor</span>
        </div>

        <div className="login-intro">
          <h1>Learn through<br />argumentation.</h1>

          <p>
            Explore critical examples, build arguments, and learn
            through an interactive tutoring experience.
          </p>
        </div>

        <div className="login-illustration">
          <div className="illustration-card illustration-card-main">
            <span className="illustration-dot"></span>
            <div className="illustration-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="illustration-card illustration-card-small">
            <FaBookOpen />
          </div>

          <div className="illustration-node node-one"></div>
          <div className="illustration-node node-two"></div>
          <div className="illustration-line line-one"></div>
          <div className="illustration-line line-two"></div>
        </div>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-heading">
            <h2>Welcome back</h2>
            <p>Sign in to continue to ABML Tutor.</p>
          </div>

          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAlertError(null);
              }}
              placeholder="Enter your username"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAlertError(null);
              }}
              placeholder="Enter your password"
              className="login-input"
            />
          </div>

          {alertError && <div className="error-text">{alertError}</div>}

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
