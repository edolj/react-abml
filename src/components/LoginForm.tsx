import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "./NavBar";
import axios from "axios";
import "../css/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/api-token-auth/", { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true); // Update the authentication state
        navigate("/selectExample"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Authentication error: ", error);
      });
  };

  return (
    <div className="login-container">
      <NavBar />
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don't have a username?{" "}
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
