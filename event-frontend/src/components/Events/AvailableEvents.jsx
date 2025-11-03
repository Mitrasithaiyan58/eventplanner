import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import InquiryPopup from "../Auth/InquiryPopup";
import BookingForm from "../Auth/BookingForm";
import "./AvailableEvents.css";

const AvailableEvents = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events"); // ✅ get all events
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="loading-text">Loading events...</p>;

  return (
    <div className="available-events-container">
      <h2 className="page-title">Available Events</h2>

      <div className="vendors-grid">
        {events.map((event) => (
          <div className="vendor-card" key={event.id}>
            <h3 className="vendor-name">{event.name}</h3>
            <p>{new Date(event.dateTime).toLocaleString()}</p>
            <p>📍 {event.location}</p>
            <p>Status: {event.status}</p>

            <div className="vendor-actions">
              <button
                className="inquiry-btn"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowInquiry(true);
                }}
              >
                Inquiry
              </button>
              <button
                className="book-btn"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowBooking(true);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Inquiry Popup */}
      {showInquiry && (
        <InquiryPopup
          event={selectedEvent}
          user={user}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {/* 🔹 Booking Popup */}
      {showBooking && (
        <BookingForm
          event={selectedEvent}
          user={user}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
};

export default AvailableEvents;
