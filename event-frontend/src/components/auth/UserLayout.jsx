import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserLayout = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="greeting">Welcome, {user?.name}</div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/user-dashboard")}>🏠 Home</button>
          <button onClick={() => navigate("/create-event")}>📅 Create Event</button>
          <button onClick={() => navigate("/my-events")}>📋 My Events</button>
          <button onClick={() => navigate("/vendors")}>🛍 Vendors</button>
          <button onClick={() => navigate("/my-saved-vendors")}>💾 Saved Vendors</button>
          <button onClick={() => navigate("/ai-suggestions")}>💡 AI Suggestions</button>
          <button onClick={() => navigate("/my-bookings")}>🧾 My Bookings</button>
          <button onClick={() => navigate("/user-inquiries")}>💬 My Inquiries</button>
          <button onClick={() => navigate("/user-profile")}>👤 Profile</button>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("user");
            navigate("/user-login");
          }}>Logout</button>
        </div>
      </header>

      {/* 👇 All pages will load here */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
