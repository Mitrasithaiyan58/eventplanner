// src/components/Auth/MyBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./MyBookings.css";

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings/user/${user.id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="bookings-page">
      <h2 className="bookings-title"> My Bookings</h2>

      {loading ? (
        <p className="loading-text">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings yet.</p>
          <button
            className="explore-btn"
            onClick={() => (window.location.href = "/available-events")}
          >
            ➕ Start Booking a Vendor
          </button>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((b, index) => (
            <div key={index} className="booking-card">
              <h3>{b.eventName}</h3>
              <p>
                <strong>Booked By:</strong> {b.userName}
              </p>
              <p>
                <strong>Guests:</strong> {b.guestCount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {b.eventDate ? b.eventDate.split("T")[0] : "—"}
              </p>
              <span
                className={`status-badge ${
                  b.status?.toLowerCase() === "confirmed"
                    ? "status-confirmed"
                    : b.status?.toLowerCase() === "rejected"
                    ? "status-rejected"
                    : "status-pending"
                }`}
              >
                {b.status || "PENDING"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
