import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/apiRegister";
import { FaBookOpen } from "react-icons/fa";
import "../css/RegistrationForm.css";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const [alertError, setAlertError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setAlertError("Gesli se ne ujemata.");
      return;
    }

    try {
      await register({ username, password, password_confirm: passwordConfirm });
      // redirect after success
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.non_field_errors ||
        error.message ||
        "Registracija neuspešna.";
      setAlertError(errorMessage);
    }
  };

  return (
    <div className="registration-page">
      {/* LEFT SIDE */}
      <div className="registration-left">
        <div className="registration-brand">
          <div className="registration-logo">
            <FaBookOpen />
          </div>
          <span>ABML Tutor</span>
        </div>

        <div className="registration-intro">
          <h1>
            Začnite svojo
            <br />
            učno pot.
          </h1>

          <p>
            Ustvarite račun in raziščite interaktivno učno izkušnjo, ki temelji na argumentaciji.
          </p>
        </div>

        {/* ABSTRACT ILLUSTRATION */}
        <div className="registration-illustration">
          <div className="registration-card registration-card-main">
            <span className="registration-dot"></span>

            <div className="registration-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="registration-card registration-card-small">
            <FaBookOpen />
          </div>

          <div className="registration-node registration-node-one"></div>
          <div className="registration-node registration-node-two"></div>

          <div className="registration-line registration-line-one"></div>
          <div className="registration-line registration-line-two"></div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="registration-right">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="registration-heading">
            <h2>Ustvarite račun</h2>
            <p>Pridružite se ABML Tutorju in začnite z učenjem.</p>
          </div>

          <div className="registration-field">
            <label htmlFor="username">Uporabniško ime</label>
            <input
              id="username"
              type="text"
              placeholder="Izberite uporabniško ime"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAlertError(null);
              }}
              className="registration-input"
              required
            />
          </div>

          <div className="registration-field">
            <label htmlFor="password">Geslo</label>
            <input
              id="password"
              type="password"
              placeholder="Ustvarite geslo"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAlertError(null);
              }}
              className="registration-input"
              required
            />
          </div>

          <div className="registration-field">
            <label htmlFor="passwordConfirm">Potrdite geslo</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="Ponovite geslo"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setAlertError(null);
              }}
              className="registration-input"
              required
            />
          </div>

          {alertError && (
            <div className="registration-error">{alertError}</div>
          )}

          <button type="submit" className="registration-button">
            Ustvari račun
          </button>

          <p className="registration-login-text">
            Že imate račun?{" "}
            <Link to="/" className="login-link">
              Prijavite se tukaj
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
