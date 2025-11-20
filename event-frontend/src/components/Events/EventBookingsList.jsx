import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./EventBookingsList.css";

const EventBookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/vendor-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/vendor-bookings/${id}/${newStatus}`);
      alert(`Booking ${newStatus.toUpperCase()} successfully!`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error updating booking status");
    }
  };

  return (
    <div className="bookings-list-container">
      <h2>📋 Vendor Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.userId}</td>
                <td>{b.eventName}</td>
                <td>{b.eventDate}</td>
                <td>{b.notes || "-"}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "PENDING" ? (
                    <>
                      <button onClick={() => updateStatus(b.id, "approve")}>
                        ✅ Approve
                      </button>
                      <button onClick={() => updateStatus(b.id, "reject")}>
                        ❌ Reject
                      </button>
                    </>
                  ) : (
                    <span>{b.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventBookingsList;
