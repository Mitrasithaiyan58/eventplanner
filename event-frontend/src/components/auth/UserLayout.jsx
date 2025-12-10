import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./UserDashboard.css";

const UserLayout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation(); // to detect current route

  // Track active tab
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Automatically highlight tab based on current route
    const path = location.pathname;
    if(path === "/dashboard") setActiveTab("home");
    else if(path === "/create-event") setActiveTab("create-event");
    else if(path === "/my-events") setActiveTab("my-events");
    else if(path === "/vendors") setActiveTab("vendors");
    else if(path === "/my-saved-vendors") setActiveTab("saved-vendors");
    else if(path === "/ai-suggestions") setActiveTab("ai-suggestions");
    else if(path === "/my-bookings") setActiveTab("bookings");
    else if(path === "/user-inquiries") setActiveTab("inquiries");
    else if(path === "/user-profile") setActiveTab("profile");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user-login");
  };

  const handleNavClick = (path, tabName) => {
    setActiveTab(tabName);
    navigate(path);
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="greeting">Welcome, {user?.name}</div>
        <div className="nav-buttons">
          <button
            className={activeTab === "home" ? "active" : ""}
            onClick={() => handleNavClick("/user-dashboard", "home")}
          >
            🏠 Home
          </button>

          <button
            className={activeTab === "create-event" ? "active" : ""}
            onClick={() => handleNavClick("/create-event", "create-event")}
          >
            📅 Create Event
          </button>

          <button
            className={activeTab === "my-events" ? "active" : ""}
            onClick={() => handleNavClick("/my-events", "my-events")}
          >
            📋 My Events
          </button>

          <button
            className={activeTab === "vendors" ? "active" : ""}
            onClick={() => handleNavClick("/vendors", "vendors")}
          >
            🛍 Vendors
          </button>

          <button
            className={activeTab === "saved-vendors" ? "active" : ""}
            onClick={() => handleNavClick("/my-saved-vendors", "saved-vendors")}
          >
            💾 Saved Vendors
          </button>

          <button
            className={activeTab === "ai-suggestions" ? "active" : ""}
            onClick={() => handleNavClick("/ai-suggestions", "ai-suggestions")}
          >
            💡 AI Suggestions
          </button>

          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => handleNavClick("/my-bookings", "bookings")}
          >
            📖 My Bookings
          </button>

          <button
            className={activeTab === "inquiries" ? "active" : ""}
            onClick={() => handleNavClick("/user-inquiries", "inquiries")}
          >
            📩 My Inquiries
          </button>

          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => handleNavClick("/user-profile", "profile")}
          >
            👤 Profile
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
