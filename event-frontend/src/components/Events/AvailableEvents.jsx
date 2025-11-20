import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import "./AvailableEvents.css";

const AvailableEvents = ({ user, onFeedbackClick }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // helper to get vendor id if event includes vendor object or vendorId
  const getVendorId = (event) => {
    if (!event) return null;
    return (event.vendor && (event.vendor.id ?? event.vendor.vendorId)) ?? event.vendorId ?? null;
  };

  return (
    <div className="available-events-container">
      <h2>Available Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>{event.eventDateTime ? new Date(event.eventDateTime).toLocaleString() : "-"}</p>
            <p>Location: {event.location}</p>
            <p>Status: {event.status}</p>
            <button onClick={() => {
              // forward event object to handler which will perform checks
              if (onFeedbackClick) onFeedbackClick({ ...event, vendorId: getVendorId(event) });
            }}>Give Feedback</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableEvents;
