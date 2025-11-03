import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./EventLogin.css";

const EventLogin = ({ setEventManager }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      if (res.data?.message?.includes("✅")) {
        if (res.data.role === "EVENT_MANAGER") {
          localStorage.setItem("eventManager", JSON.stringify(res.data));
          setEventManager(res.data);
          navigate("/event-dashboard");
        } else {
          setError("❌ You are not an Event Manager!");
        }
      } else {
        setError("❌ Invalid email or password!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Login failed. Please try again.");
    }
  };

  return (
    <div className="event-login-page">
      <div className="event-auth-container">
        <h2>Event Manager Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <span className="link-text" onClick={() => navigate("/user-login")}>
          🔙 Back to User Login
        </span>
      </div>
    </div>
  );
};

export default EventLogin;
