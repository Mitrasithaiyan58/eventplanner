// src/components/Events/NotificationList.jsx
import React from "react";
import "./EventDashboard.css";

const NotificationList = ({ notifications, onConfirm, onReject }) => {
  if (!notifications || notifications.length === 0) {
    return <p>No new notifications 🎉</p>;
  }

  return (
    <div className="notification-list">
      {notifications.map((n) => (
        <div key={n.id} className="notification-card">
          <h4>{n.eventName}</h4>
          <p>
            👤 <strong>{n.userName}</strong> sent a {n.bookingType.toLowerCase()} request
          </p>
          <p>Status: <strong>{n.status}</strong></p>

          {n.status === "PENDING" && (
            <div className="btn-group">
              <button className="confirm-btn" onClick={() => onConfirm(n.id)}>
                ✅ Confirm
              </button>
              <button className="reject-btn" onClick={() => onReject(n.id)}>
                ❌ Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
