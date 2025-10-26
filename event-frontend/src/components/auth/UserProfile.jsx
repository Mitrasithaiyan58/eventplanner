import React, { useState } from "react";
import axios from "../../axiosConfig";
import "../Auth/Auth.css";


const UserProfile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState(user.password);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/users/${user.id}`, { name, email, phone, password });
      setUser(res.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    }
  };

  return (
    <div className="auth-container">
      <h2>My Profile</h2>
      {message && <p>{message}</p>}
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default UserProfile;
