import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./EventBookingForm.css"; // optional for styling

const EventBookingForm = ({ user }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const booking = {
      userId: user.id, // Logged-in user ID
      eventName,
      eventDate,
      notes,
      status: "PENDING", // default
    };

    try {
      await axios.post("/vendor-bookings", booking);
      alert("🎉 Booking request sent successfully!");
      navigate("/my-bookings"); // redirect to user's bookings page
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting booking request!");
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Plan Your Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Event Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <label>Event Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional details..."
        />

        <button type="submit" className="confirm-btn">
          ✅ Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default EventBookingForm;
