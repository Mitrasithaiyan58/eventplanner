import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [completedEvents, setCompletedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    fetchCompletedEvents();
  }, []);

  // Fetch completed events for this user
  const fetchCompletedEvents = async () => {
    try {
      if (!user || !user.id) {
        toast.error("User not logged in");
        return;
      }

      // ⭐ Correct API
      const res = await axios.get(`/events/completed/${user.id}`);

      const filtered = res.data.filter(ev => ev.vendor != null);

      setCompletedEvents(filtered);
    } catch (err) {
      console.error("Error loading completed events:", err);
      toast.error("Could not load completed events");
    }
  };

  const handleSubmit = async () => {
    if (!selectedEvent) {
      return toast.error("Please select an event first!");
    }

    if (!user?.id) {
      return toast.error("User not logged in!");
    }

    const body = {
      eventId: selectedEvent.id,
      vendorId: selectedEvent.vendor.id,   // ⭐ vendorId comes from vendor object
      userId: user.id,
      rating,
      feedback,
    };

    console.log("Sending feedback body:", body);

    try {
      await axios.post("/api/feedback/add", body);
      toast.success("Feedback submitted successfully!");

      // Reset
      setSelectedEvent(null);
      setRating(5);
      setFeedback("");

    } catch (error) {
      console.error("BACKEND ERROR:", error.response?.data || error);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-container">
      <h2>Give Feedback to Vendors</h2>

      {/* Event Dropdown */}
      <select
        className="event-select"
        value={selectedEvent ? selectedEvent.id : ""}
        onChange={(e) => {
          const ev = completedEvents.find(
            item => item.id === Number(e.target.value)
          );
          setSelectedEvent(ev || null);
        }}
      >
        <option value="">-- Select Completed Event --</option>

        {completedEvents.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.name} — Vendor: {ev.vendor?.name || ev.vendor?.id}
          </option>
        ))}
      </select>

      {completedEvents.length === 0 && (
        <p>No completed events available for feedback.</p>
      )}

      <label>Rating (1–5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <label>Your Feedback</label>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback..."
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackForm;
