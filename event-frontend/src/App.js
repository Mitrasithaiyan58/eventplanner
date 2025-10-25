import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserSignup from "./components/auth/UserSignup";
import UserLogin from "./components/auth/UserLogin";
import UserDashboard from "./components/dashboard/UserDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 🌐 Navigation Bar */}
        <nav className="navbar">
          <div className="nav-logo">🎉 EventMate</div>
          <div className="nav-links">
            <Link to="/user-signup">Signup</Link>
            <Link to="/user-login">Login</Link>
            <Link to="/user-dashboard">Dashboard</Link>
          </div>
        </nav>

        {/* 🚦 Routes */}
        <Routes>
          <Route path="/" element={<UserSignup />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
