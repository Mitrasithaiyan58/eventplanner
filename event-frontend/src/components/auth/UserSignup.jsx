import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function UserSignup() {
  const [user, setUser] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', user);
      alert('Signup successful! Please login.');
      navigate('/user-login'); // redirect to login
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>User Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={user.phone} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>
      <div className="auth-switch">
        Already have an account? <a href="/user-login">Login</a>
      </div>
    </div>
  );
}
