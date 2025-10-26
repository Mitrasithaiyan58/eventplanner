import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Auth/Auth.css";


const UserLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.get(`/users`);
      const userFound = res.data.find(u => u.email === email && u.password === password);
      if (userFound) {
        setUser(userFound);
        navigate("/user-dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>User Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <span className="link-text" onClick={() => navigate("/user-signup")}>
        Don't have an account? Signup
      </span>
    </div>
  );
};

export default UserLogin;
