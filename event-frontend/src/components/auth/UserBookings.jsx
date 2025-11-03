import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./UserBookings.css";

const UserBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings/user/${user.id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 5000); // 🔄 auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="user-bookings-page">
      <h2>🎟️ My Bookings</h2>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <h3>{b.eventName}</h3>
              <p><strong>Guests:</strong> {b.guestCount}</p>
              <p><strong>Date:</strong> {b.eventDate}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${
                    b.status === "CONFIRMED"
                      ? "status-confirmed"
                      : b.status === "REJECTED"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {b.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
