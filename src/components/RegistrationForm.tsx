import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/RegistrationForm.css";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:8000/api/register/", { username, password })
      .then((response) => {
        console.log("Registration successful:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Registration error:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="registration-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="registration-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="registration-input"
          required
        />
        <button type="submit" className="registration-button">
          Register
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/" className="login-link">
            Login here
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
