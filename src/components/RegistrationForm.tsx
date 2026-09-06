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
      setAlertError("Passwords do not match.");
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
        "Registration failed";
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
            Start your
            <br />
            learning journey.
          </h1>

          <p>
            Create an account and explore an interactive learning
            experience built around argumentation.
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
            <h2>Create your account</h2>
            <p>Join ABML Tutor and start learning.</p>
          </div>

          <div className="registration-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
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
            <label htmlFor="passwordConfirm">Confirm password</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="Repeat your password"
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
            Create account
          </button>

          <p className="registration-login-text">
            Already have an account?{" "}
            <Link to="/" className="login-link">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
