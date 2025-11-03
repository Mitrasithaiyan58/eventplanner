import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Auth/Auth.css";
import Swal from "sweetalert2";

const UserLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.get(`/users`);
      const userFound = res.data.find(
        (u) => u.email === email && u.password === password
      );

      if (userFound) {
        // ✅ store user in React state
        setUser(userFound);

        // ✅ also save in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userFound));

        Swal.fire("✅ Login Successful", "Welcome back!", "success");
        navigate("/user-dashboard");
      } else {
        setError("Invalid email or password");
        Swal.fire("❌ Login Failed", "Invalid email or password!", "error");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
      Swal.fire("❌ Error", "Something went wrong while logging in.", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>User Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        <span className="link-text" onClick={() => navigate("/user-signup")}>
          Don't have an account? Signup
        </span>
      </div>
    </div>
  );
};

export default UserLogin;
