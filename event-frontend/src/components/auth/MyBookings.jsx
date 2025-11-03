// 📄 src/components/Auth/MyBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./Auth/MyBookings.css";

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`/bookings/user/${user.id}`)
        .then((res) => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="my-bookings">
      <h2>📅 My Bookings</h2>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet. Start booking a vendor!</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <h3>{b.eventName}</h3>
              <p>
                📍 {b.location} | 📅 {new Date(b.eventDate).toLocaleString()}
              </p>
              <p>Vendor: <strong>{b.vendorName}</strong></p>
              <p className={`status ${b.status.toLowerCase()}`}>Status: {b.status}</p>
              {b.notes && <p className="notes">📝 {b.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
