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

  // fetch events
  useEffect(() => {
    let mounted = true;
    axios
      .get("/events")
      .then((res) => {
        if (mounted) {
          setEvents(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  // helper to extract vendor id (supports vendor object or vendorId field)
  const getVendorId = (event) => {
    if (!event) return null;
    // event.vendor might be object, event.vendorId might exist
    return (event.vendor && (event.vendor.id ?? event.vendor.vendorId)) ?? event.vendorId ?? null;
  };

  // FINAL: one-button-per-event feedback handler
  const handleFeedbackClick = (event) => {
    if (!event) {
      toast.warn("Please select an event first to give feedback.");
      return;
    }

    // only completed events allowed
    if ((event.status || "").toLowerCase() !== "completed") {
      toast.warn("You can give feedback only after the event is completed.");
      return;
    }

    const vendorId = getVendorId(event);
    if (!vendorId) {
      toast.warn("Vendor not assigned for this event.");
      return;
    }

    // include current user id in query so FeedbackForm doesn't rely on localStorage only
    const params = new URLSearchParams({ vendor: vendorId, event: event.id, user: user?.id });
    navigate(`/give-feedback?${params.toString()}`);
  };

  const openInquiryPopup = (event) => {
    if ((event.status || "").toLowerCase() === "completed") {
      toast.warn("This event is completed — inquiry not available.");
      return;
    }
    setSelectedEvent(event);
    setShowInquiry(true);
  };

  const openBookingPopup = (event) => {
    if ((event.status || "").toLowerCase() === "completed") {
      toast.warn("Event completed — booking not available.");
      return;
    }
    setSelectedEvent(event);
    setShowBooking(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user-login");
  };

  const plannedEvents = events.filter((ev) => (ev.status || "").toLowerCase() === "planned");
  const completedEvents = events.filter((ev) => (ev.status || "").toLowerCase() === "completed");

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="greeting">Welcome, {user?.name}</div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/create-event")}><FaCalendarAlt /> Create Event</button>
          <button onClick={() => navigate("/my-events")}><FaTasks /> My Events</button>
          <button onClick={() => navigate("/vendors")}>🛍 Vendors</button>
          <button onClick={() => navigate("/my-saved-vendors")}>💾 Saved Vendors</button>
         

          <button onClick={() => navigate("/ai-suggestions")}>💡 AI Suggestions</button>
          <button onClick={() => navigate("/my-bookings")}><FaBook /> My Bookings</button>
          <button onClick={() => navigate("/user-inquiries")}><FaEnvelope /> My Inquiries</button>
          <button onClick={() => navigate("/user-profile")}>👤 Profile</button>

          
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p className="loading-text">⏳ Initializing dashboard...</p>
        ) : (
          <>
            <h1>Dashboard</h1>

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

            <h2>Available Events</h2>
            <div className="recent-events">
              {events.length === 0 ? (
                <p>No events available at the moment.</p>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="event-card-small">
                    <h4>{ev.name}</h4>
                    <p>{ev.eventDateTime ? new Date(ev.eventDateTime).toLocaleString() : "-"}</p>
                    <p>📍 {ev.location}</p>

                    <div className="event-actions">
                      <button className="inquiry-btn" onClick={() => openInquiryPopup(ev)}>
                        <FaEnvelope /> Inquiry
                      </button>

                      <button className="book-btn" onClick={() => openBookingPopup(ev)}>
                        <FaBook /> Book Now
                      </button>

                      {/* ALWAYS show the feedback button on every event card; handler enforces rules */}
                      <button className="give-feedback-small" onClick={() => handleFeedbackClick(ev)}>
                        ⭐ Give Feedback
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <section style={{ marginTop: 30 }}>
              <h2>Vendor Feedback Section</h2>
              {completedEvents.length > 0 ? (
                completedEvents.map((ev) => (
                  <div key={ev.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{ev.name}</strong>
                        <div style={{ fontSize: 13, color: "#666" }}>
                          {ev.location} • {ev.eventDateTime ? new Date(ev.eventDateTime).toLocaleDateString() : "-"}
                        </div>
                      </div>

                      <button onClick={() => handleFeedbackClick(ev)} style={{ padding: "8px 12px", borderRadius: 6 }}>

                        
                        ⭐ Give Feedback
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No completed events available for feedback.</p>
              )}
            </section>
          </>
        )}
      </div>

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
