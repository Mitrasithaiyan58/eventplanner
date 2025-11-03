import React, { useState } from "react";
import axios from "../../axiosConfig";
import "./BookingForm.css";

const BookingForm = ({ user, event, onClose }) => {
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        userId: user.id,
        managerId: event?.managerId || 12, // fallback manager ID
        eventId: event?.id,
        userName: user.name,
        eventName: event.name,
        bookingType: "BOOKING",
        status: "PENDING",

        // ✅ match backend fields
        eventDate: `${eventDate}T00:00:00`,
        guestCount: parseInt(guestCount, 10),
      };

      console.log("📤 Sending booking data:", bookingData);
      const res = await axios.post("/api/bookings", bookingData);

      setStatusMsg("🎉 Booking successful!");
      console.log("✅ Booking created:", res.data);

      setTimeout(() => {
        setStatusMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("❌ Booking failed:", err);
      const msg =
        err.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Booking failed. Try again.";
      setStatusMsg(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>📘 Book Event – {event.name}</h3>

        {!statusMsg ? (
          <form onSubmit={handleBooking}>
            <label>Date:</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />

            <label>Number of Guests:</label>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              required
            />

            <div className="popup-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              <button type="button" className="close-btn" onClick={onClose}>
                ✖
              </button>
            </div>
          </form>
        ) : (
          <p className="status-msg">{statusMsg}</p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
