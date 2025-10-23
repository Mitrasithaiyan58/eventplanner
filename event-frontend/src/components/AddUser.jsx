import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import './AddUser.css'; // Import CSS

function AddUser() {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const saveUser = (e) => {
    e.preventDefault();
    UserService.createUser(user).then(() => navigate('/users'));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Add New User</h2>
        <form onSubmit={saveUser}>
          <input
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={user.phone}
            onChange={handleChange}
            required
          />
          <button type="submit">Save User</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
