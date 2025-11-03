import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./EventList.css";

const EventList = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`/events/user/${user.id}`);
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch events:", err);
      setMessage("Failed to fetch events.");
    }
  };

  const handleDelete = async (eventId, status) => {
    if (status?.toUpperCase() === "COMPLETED") {
      setMessage("❌ You cannot delete a completed event.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/events/${eventId}`);
      setMessage("✅ Event deleted successfully!");
      setEvents(events.filter((e) => e.id !== eventId));
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      setMessage("Failed to delete event.");
    }
  };

  const handleEdit = (eventId, status) => {
    if (status?.toUpperCase() === "COMPLETED") {
      setMessage("❌ You cannot edit a completed event.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    navigate(`/create-event?edit=${eventId}`);
  };

  return (
    <div className="eventlist-wrapper">
      <h2>📅 My Events</h2>
      {message && <p className="event-message">{message}</p>}

      {events.length === 0 ? (
        <p>No events found. Create one!</p>
      ) : (
        <div className="event-cards">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>

              <p><strong>Description:</strong> {event.description || "-"}</p>
              <p><strong>Location:</strong> {event.location || "-"}</p>
              <p>
                <strong>Date & Time:</strong>{" "}
                {event.eventDateTime
                  ? new Date(event.eventDateTime).toLocaleString()
                  : "-"}
              </p>

              {/* ✅ Status Badge */}
              <p>
                <strong>Status: </strong>
                <span
                  className={`status-badge ${
                    event.status?.toLowerCase() === "completed"
                      ? "completed"
                      : "planned"
                  }`}
                >
                  {event.status || "Planned"}
                </span>
              </p>

              <div className="event-card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(event.id, event.status)}
                  disabled={event.status?.toUpperCase() === "COMPLETED"}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event.id, event.status)}
                  disabled={event.status?.toUpperCase() === "COMPLETED"}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
