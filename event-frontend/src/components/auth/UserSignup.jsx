import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Auth/Auth.css";


const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("/users", { name, email, phone, password });
      setMessage("Signup successful!");
      setTimeout(() => navigate("/user-login"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>User Signup</h2>
      {message && <p>{message}</p>}
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
      <span className="link-text" onClick={() => navigate("/user-login")}>
        Already have an account? Login
      </span>
    </div>
  );
};

export default UserSignup;
