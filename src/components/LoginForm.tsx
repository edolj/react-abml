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
      setAlertError("Napačno uporabniško ime ali geslo");
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
          <h1>Učite se skozi <br />argumentacijo.</h1>

          <p>
            Raziščite kritične primere, oblikujte argumente in se učite skozi interaktivno učno izkušnjo.
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
            <h2>Dobrodošli</h2>
            <p>Prijavite se in nadaljujte v ABML Tutorju.</p>
          </div>

          <div className="login-field">
            <label htmlFor="username">Uporabniško ime</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAlertError(null);
              }}
              placeholder="Vnesite uporabniško ime"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Geslo</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAlertError(null);
              }}
              placeholder="Vnesite geslo"
              className="login-input"
            />
          </div>

          {alertError && <div className="error-text">{alertError}</div>}

          <button type="submit" className="login-button">
            Prijava
          </button>

          <p className="login-register-text">
            Še nimate računa?{" "}
            <Link to="/register" className="register-link">
              Registrirajte se tukaj
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
