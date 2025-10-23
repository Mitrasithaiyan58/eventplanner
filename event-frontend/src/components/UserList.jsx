import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { Link } from 'react-router-dom';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UserService.getAllUsers().then(res => setUsers(res.data));
  }, []);

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      UserService.deleteUser(id).then(() => {
        setUsers(users.filter(u => u.id !== id));
      });
    }
  };

  return (
    <div className="table-container">
      <div className="table-card">
        <div className="table-header">
          <h2>User Management</h2>
          <Link to="/add-user" className="btn-primary">Add User</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">No users found.</td>
              </tr>
            )}
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td>
                <td>
                  <Link to={`/edit-user/${u.id}`} className="btn-warning">Edit</Link>
                  <button onClick={() => deleteUser(u.id)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
