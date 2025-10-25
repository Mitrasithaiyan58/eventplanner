import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function UserLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get('/users'); // fetch all users
      const user = response.data.find(u => u.email === credentials.email && u.password === credentials.password);
      if (user) {
        alert('Login successful!');
        navigate('/user-dashboard'); // Replace with your dashboard route
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div className="auth-switch">
        Don't have an account? <a href="/user-signup">Signup</a>
      </div>
    </div>
  );
}
