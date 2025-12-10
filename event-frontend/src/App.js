// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ================= USER COMPONENTS =================
import UserLogin from "./components/Auth/UserLogin";
import UserSignup from "./components/Auth/UserSignup";
import UserDashboard from "./components/Auth/UserDashboard";
import UserProfile from "./components/Auth/UserProfile";
import InquiryPopup from "./components/Auth/InquiryPopup";
import UserInquiries from "./components/Auth/UserInquiries";
import InquiryPage from "./components/Auth/InquiryPage";
import MyBookings from "./components/Auth/MyBookings";
import AvailableEvents from "./components/Events/AvailableEvents";
import BookingForm from "./components/Auth/BookingForm";
import SavedVendors from "./components/Vendors/SavedVendors";
import AISuggestions from "./components/AI/AISuggestions";
import VendorsPage from "./components/Auth/VendorsPage";
import VendorBookingForm from "./components/Auth/EventBookingForm";

// ================= FEEDBACK =================
import FeedbackForm from "./components/Auth/FeedbackForm";
import ManagerFeedback from "./components/Auth/ManagerFeedback";

// ================= EVENT MANAGER =================
import EventLogin from "./components/Events/EventLogin";
import EventDashboard from "./components/Events/EventDashboard";
import EventList from "./components/Events/EventList";
import EventForm from "./components/Events/EventForm";
import EventBookingsList from "./components/Events/EventBookingsList";

// ================= EVENT DETAILS =================
import EventDetails from "./components/Auth/EventDetails";

// ================= AI TEST =================
import EventNameAI from "./components/Auth/EventNameAI";

// ================= LAYOUT =================
import UserLayout from "./components/Auth/UserLayout";

// ================= HELPER HOOK =================
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ================= GIVE FEEDBACK WRAPPER =================
function GiveFeedbackWrapper({ user }) {
  const query = useQuery();
  const vendorId = query.get("vendor");
  const eventId = query.get("event");

  if (!vendorId || !eventId) {
    return (
      <div style={{ padding: "20px", color: "#fff" }}>
        <h2>Please select an event first to give feedback.</h2>
      </div>
    );
  }

  return <FeedbackForm userId={user.id} eventId={eventId} />;
}

// ================= MAIN APP =================
function App() {
  const [user, setUser] = useState(null);
  const [eventManager, setEventManager] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const shownToasts = useRef(new Set());

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedManager = localStorage.getItem("eventManager");
    const savedToasts = JSON.parse(localStorage.getItem("shownToasts") || "[]");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedManager) setEventManager(JSON.parse(savedManager));
    shownToasts.current = new Set(savedToasts);
  }, []);

  // Fetch inquiries for user
  useEffect(() => {
    if (!user) return;

    const fetchInquiries = async () => {
      try {
        const res = await axios.get(`/api/inquiries/user/${user.id}`);
        setInquiries(res.data);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      }
    };

    fetchInquiries();
    const interval = setInterval(fetchInquiries, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Toast notification when manager replies
  useEffect(() => {
    inquiries.forEach((inq) => {
      if (inq.status === "Replied" && !shownToasts.current.has(inq.id)) {
        toast.info(`📩 Event Manager replied: "${inq.eventName}"`);
        shownToasts.current.add(inq.id);
        localStorage.setItem("shownToasts", JSON.stringify([...shownToasts.current]));
      }
    });
  }, [inquiries]);

  // Handlers for popups
  const handleInquiryClick = (event) => {
    setSelectedEvent(event);
    setShowInquiry(true);
  };

  const handleBookingClick = (event) => {
    setSelectedEvent(event);
    setShowBooking(true);
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* POPUPS */}
      {showInquiry && selectedEvent && (
        <InquiryPopup user={user} event={selectedEvent} onClose={() => setShowInquiry(false)} />
      )}
      {showBooking && selectedEvent && (
        <BookingForm user={user} event={selectedEvent} onClose={() => setShowBooking(false)} />
      )}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        {/* ================= PROTECTED USER ROUTES ================= */}
        <Route
          path="/"
          element={user ? <UserLayout user={user} /> : <UserLogin setUser={setUser} />}
        >
          <Route path="user-dashboard" element={<UserDashboard user={user} />} />
          <Route path="user-profile" element={<UserProfile user={user} setUser={setUser} />} />
          <Route path="user-inquiries" element={<UserInquiries user={user} />} />
          <Route path="inquiry-page" element={<InquiryPage user={user} />} />
          <Route path="my-bookings" element={<MyBookings user={user} />} />
          <Route path="give-feedback" element={<GiveFeedbackWrapper user={user} />} />

          {/* EVENT DETAILS */}
          <Route path="event-details/:vendorId" element={<EventDetails user={user} />} />

          {/* EVENTS */}
          <Route path="create-event" element={<EventForm user={user} />} />
          <Route path="my-events" element={<EventList user={user} />} />
          <Route
            path="available-events"
            element={
              <AvailableEvents
                user={user}
                onInquiryClick={handleInquiryClick}
                onBookingClick={handleBookingClick}
                onFeedbackClick={(event) => setSelectedEvent(event)}
              />
            }
          />
          <Route path="my-saved-vendors" element={<SavedVendors user={user} />} />
          <Route path="ai-suggestions" element={<AISuggestions user={user} />} />
          <Route path="vendors" element={<VendorsPage user={user} />} />
          <Route path="book-vendor/:vendorId" element={<VendorBookingForm user={user} />} />
          <Route path="event-booking/:eventId" element={<BookingForm user={user} />} />
        </Route>

        {/* ================= EVENT MANAGER ROUTES ================= */}
        <Route path="/event-login" element={<EventLogin setEventManager={setEventManager} />} />
        <Route
          path="/event-dashboard"
          element={
            eventManager ? (
              <EventDashboard eventManager={eventManager} />
            ) : (
              <EventLogin setEventManager={setEventManager} />
            )
          }
        />
        <Route
          path="/event-bookings"
          element={
            eventManager ? <EventBookingsList /> : <EventLogin setEventManager={setEventManager} />
          }
        />

        {/* ================= AI TEST ================= */}
        <Route path="/ai-test" element={<EventNameAI />} />
      </Routes>
    </Router>
  );
}

export default App;
