import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCheckCircle, FaTasks, FaEnvelope, FaBook } from "react-icons/fa";
import { toast } from "react-toastify";
import InquiryPopup from "../Auth/InquiryPopup";
import BookingForm from "../Auth/BookingForm";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios.get("/events")
      .then((res) => { if(mounted) { setEvents(res.data || []); setLoading(false); }})
      .catch((err) => { console.error(err); if(mounted) setLoading(false); });
    return () => mounted = false;
  }, []);

  const plannedEvents = events.filter(ev => (ev.status||"").toLowerCase() === "planned");
  const completedEvents = events.filter(ev => (ev.status||"").toLowerCase() === "completed");

  const openInquiryPopup = (ev) => { setSelectedEvent(ev); setShowInquiry(true); };
  const openBookingPopup = (ev) => { setSelectedEvent(ev); setShowBooking(true); };
  const handleFeedbackClick = (ev) => {
    if(!ev || (ev.status||"").toLowerCase() !== "completed") {
      toast.warn("Only completed events can get feedback.");
      return;
    }
    const vendorId = ev.vendor?.id ?? ev.vendorId;
    if(!vendorId) { toast.warn("Vendor not assigned."); return; }
    navigate(`/give-feedback?vendor=${vendorId}&event=${ev.id}&user=${user?.id}`);
  };

  return (
    <div>
      {loading ? <p>⏳ Loading...</p> : (
        <>
          <h1>Dashboard</h1>
          <div className="dashboard-stats">
            <div className="stat-card total"><FaTasks /><h3>{events.length}</h3><p>Total Events</p></div>
            <div className="stat-card upcoming"><FaCalendarAlt /><h3>{plannedEvents.length}</h3><p>Planned Events</p></div>
            <div className="stat-card completed"><FaCheckCircle /><h3>{completedEvents.length}</h3><p>Completed Events</p></div>
          </div>

          <h2>Available Events</h2>
          <div className="recent-events">
            {events.map(ev => (
              <div key={ev.id} className="event-card-small">
                <h4>{ev.name}</h4>
                <p>{ev.eventDateTime ? new Date(ev.eventDateTime).toLocaleString() : "-"}</p>
                <p>📍 {ev.location}</p>
                <div className="event-actions">
                  <button className="inquiry-btn" onClick={()=>openInquiryPopup(ev)}><FaEnvelope /> Inquiry</button>
                  <button className="book-btn" onClick={()=>openBookingPopup(ev)}><FaBook /> Book</button>
                  <button className="give-feedback-small" onClick={()=>handleFeedbackClick(ev)}>⭐ Feedback</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showInquiry && <InquiryPopup user={user} event={selectedEvent} onClose={()=>setShowInquiry(false)} />}
      {showBooking && <BookingForm user={user} event={selectedEvent} onClose={()=>setShowBooking(false)} />}
    </div>
  );
};

export default UserDashboard;
