import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import './AddUser.css';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    UserService.getUserById(id)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const updateUser = (e) => {
    e.preventDefault();
    UserService.updateUser(id, user)
      .then(() => navigate('/users'))
      .catch(err => console.error(err));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Edit User</h2>
        <form onSubmit={updateUser}>
          <input name="name" value={user.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" type="email" value={user.email} onChange={handleChange} placeholder="Email Address" required />
          <input name="phone" value={user.phone} onChange={handleChange} placeholder="Phone Number" required />
          <button type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
