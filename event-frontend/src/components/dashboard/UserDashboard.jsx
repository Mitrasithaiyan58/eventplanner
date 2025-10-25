import React from "react";
import "./Dashboard.css";

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to EventMate 🎉</h1>
        <p>Your personal AI-powered event planner</p>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h3>Vendors Booked</h3>
          <p>8</p>
        </div>
        <div className="stat-card">
          <h3>Budget Used</h3>
          <p>₹45,000</p>
        </div>
      </section>

      <section className="ai-section">
        <h2>🤖 AI Recommendations</h2>
        <ul>
          <li>Suggested Venue: Grand Palace Banquet Hall</li>
          <li>Recommended Caterer: Spice & Delight</li>
          <li>Budget Tip: Book vendors 2 weeks early to save 15%</li>
        </ul>
      </section>

      <section className="event-list-section">
        <h2>📅 Upcoming Events</h2>
        <div className="event-card">
          <h3>Wedding Reception</h3>
          <p>Date: 20 Nov 2025</p>
          <p>Location: Le Royal Hotel</p>
          <button className="view-btn">View Details</button>
        </div>
        <div className="event-card">
          <h3>Corporate Meet</h3>
          <p>Date: 12 Dec 2025</p>
          <p>Location: Taj Convention Center</p>
          <button className="view-btn">View Details</button>
        </div>
      </section>

      <section className="actions-section">
        <h2>⚙️ Quick Actions</h2>
        <div className="actions">
          <button className="action-btn">➕ Plan New Event</button>
          <button className="action-btn">📋 Manage Vendors</button>
          <button className="action-btn">💬 Contact Support</button>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
