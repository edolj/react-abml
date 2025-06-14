import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/apiRegister";
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
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setAlertError(null);
          }}
          className="registration-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setAlertError(null);
          }}
          className="registration-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            setAlertError(null);
          }}
          className="registration-input"
          required
        />
        {alertError && <div className="error-text">{alertError}</div>}
        <button type="submit" className="registration-button">
          Register
        </button>
        <p style={{ marginTop: "20px" }}>
          Already have an account?
          <br />
          <Link to="/" className="login-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
