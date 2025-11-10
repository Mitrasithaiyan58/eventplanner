import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTasks,
  FaEnvelope,
  FaBook,
} from "react-icons/fa";
import { toast } from "react-toastify";
import InquiryPopup from "../Auth/InquiryPopup";
import BookingForm from "../Auth/BookingForm";
import "./UserDashboard.css";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  // Fetch Events
  useEffect(() => {
    axios
      .get("/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  // SSE - listen for inquiry replies
  useEffect(() => {
    let eventSource;

    if (!window.__inquiryEventListenerAdded) {
      window.__inquiryEventListenerAdded = true;

      eventSource = new EventSource("http://localhost:8080/api/inquiries/notifications");
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.eventName) {
            toast.info(`Event Manager replied to your inquiry: "${data.eventName}"`, {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          console.error("Error parsing event data:", error);
        }
      };
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user-login");
  };

  const plannedEvents = events.filter(
    (e) => e.status?.toLowerCase() === "planned"
  );
  const completedEvents = events.filter(
    (e) => e.status?.toLowerCase() === "completed"
  );

  // Temporary Popup
  const showTemporaryPopup = (eventId, message, type) => {
    setPopupMessage({ id: eventId, text: message, type });
    setTimeout(() => setPopupMessage(null), 2500);
  };

  // Inquiry Popup
  const openInquiryPopup = (event) => {
    if (event.status?.toLowerCase() === "completed") {
      showTemporaryPopup(
        event.id,
        "❌ This event is already completed. Inquiry not available.",
        "inquiry"
      );
      return;
    }
    setSelectedEvent(event);
    setShowInquiry(true);
  };

  // Booking Popup
  const openBookingPopup = (event) => {
    if (event.status?.toLowerCase() === "completed") {
      showTemporaryPopup(
        event.id,
        "❌ This event is already completed. Booking not available.",
        "booking"
      );
      return;
    }
    setSelectedEvent(event);
    setShowBooking(true);
  };

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="greeting">Welcome, {user?.name} </div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/create-event")}><FaCalendarAlt /> Create Event</button>
          <button onClick={() => navigate("/my-events")}><FaTasks /> My Events</button>
          <button onClick={() => navigate("/vendors")}>🛍 Vendors</button>
          <button onClick={() => navigate("/my-saved-vendors")}>💾 Saved Vendors</button>
          <button onClick={() => navigate("/ai-suggestions")}>💡 AI Suggestions</button>
          <button onClick={() => navigate("/my-bookings")}><FaBook /> My Bookings</button>
          <button onClick={() => navigate("/user-inquiries")}>💬 My Inquiries</button>
          <button onClick={() => navigate("/user-profile")}>👤 Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="dashboard-content">
        {loading ? (
          <p className="loading-text">⏳ Initializing dashboard...</p>
        ) : (
          <>
            <h1>Dashboard</h1>

            {/* STATS */}
            <div className="dashboard-stats">
              <div className="stat-card total">
                <FaTasks />
                <h3>{events.length}</h3>
                <p>Total Events</p>
              </div>

              <div className="stat-card upcoming">
                <FaCalendarAlt />
                <h3>{plannedEvents.length}</h3>
                <p>Planned Events</p>
              </div>

              <div className="stat-card completed">
                <FaCheckCircle />
                <h3>{completedEvents.length}</h3>
                <p>Completed Events</p>
              </div>
            </div>

            {/* EVENTS LIST */}
            <h2>Available Events</h2>
            <div className="recent-events">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="event-card-small">
                    <h4>{event.name}</h4>
                    <p>{new Date(event.eventDateTime).toLocaleString()}</p>
                    <p>📍 {event.location}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`status-badge ${
                          event.status?.toLowerCase() === "planned"
                            ? "status-planned"
                            : "status-completed"
                        }`}
                      >
                        {event.status}
                      </span>
                    </p>

                    <div className="event-actions">
                      <div className="action-btn-wrapper">
                        <button className="inquiry-btn" onClick={() => openInquiryPopup(event)}>
                          <FaEnvelope /> Inquiry
                        </button>
                        {popupMessage?.id === event.id &&
                          popupMessage.type === "inquiry" && (
                            <div className="tooltip-popup">
                              {popupMessage.text}
                            </div>
                          )}
                      </div>

                      <div className="action-btn-wrapper">
                        <button className="book-btn" onClick={() => openBookingPopup(event)}>
                          <FaBook /> Book Now
                        </button>
                        {popupMessage?.id === event.id &&
                          popupMessage.type === "booking" && (
                            <div className="tooltip-popup">
                              {popupMessage.text}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No events available at the moment.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* POPUPS */}
      {showInquiry && selectedEvent && (
        <InquiryPopup event={selectedEvent} user={user} onClose={() => setShowInquiry(false)} />
      )}

      {showBooking && selectedEvent && (
        <BookingForm event={selectedEvent} user={user} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
