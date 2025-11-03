import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧑‍🤝‍🧑 USER COMPONENTS
import UserLogin from "./components/Auth/UserLogin";
import UserSignup from "./components/Auth/UserSignup";
import UserDashboard from "./components/Auth/UserDashboard";
import UserProfile from "./components/Auth/UserProfile";
import InquiryPopup from "./components/Auth/InquiryPopup";
import UserInquiries from "./components/Auth/UserInquiries";
import InquiryPage from "./components/Auth/InquiryPage";
import MyBookings from "./components/Auth/MyBookings"; // ✅ NEW — added MyBookings
import AvailableEvents from "./components/Events/AvailableEvents";
import BookingForm from "./components/Auth/BookingForm";
import SavedVendors from "./components/Vendors/SavedVendors";
import AISuggestions from "./components/AI/AISuggestions";

// 🎉 EVENT MANAGER COMPONENTS
import EventLogin from "./components/Events/EventLogin";
import EventDashboard from "./components/Events/EventDashboard";
import EventList from "./components/Events/EventList";
import EventForm from "./components/Events/EventForm";

function App() {
  const [user, setUser] = useState(null);
  const [eventManager, setEventManager] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  const shownToasts = useRef(new Set());

  // 🔹 Load saved user/manager and toast history
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedManager = localStorage.getItem("eventManager");
    const savedToasts = JSON.parse(localStorage.getItem("shownToasts") || "[]");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedManager) setEventManager(JSON.parse(savedManager));
    shownToasts.current = new Set(savedToasts);
  }, []);

  // 🔹 Fetch user inquiries periodically
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

  // 🔹 Show toast for new replies — only once ever
  useEffect(() => {
    inquiries.forEach((inq) => {
      if (inq.status === "Replied" && !shownToasts.current.has(inq.id)) {
        toast.info(`📩 Event Manager replied to your inquiry: "${inq.eventName}"`);
        shownToasts.current.add(inq.id);

        // Persist shown IDs to localStorage
        localStorage.setItem("shownToasts", JSON.stringify([...shownToasts.current]));
      }
    });
  }, [inquiries]);

  // 🔹 Open Inquiry Popup
  const handleInquiryClick = (event) => {
    setSelectedEvent(event);
    setShowInquiry(true);
  };

  // 🔹 Open Booking Popup
  const handleBookingClick = (event) => {
    setSelectedEvent(event);
    setShowBooking(true);
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Inquiry Popup */}
      {showInquiry && (
        <InquiryPopup
          user={user}
          event={selectedEvent}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {/* Booking Popup */}
      {showBooking && (
        <BookingForm
          user={user}
          event={selectedEvent}
          onClose={() => setShowBooking(false)}
        />
      )}

      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        <Route
          path="/user-dashboard"
          element={user ? <UserDashboard user={user} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/user-profile"
          element={user ? <UserProfile user={user} setUser={setUser} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/user-inquiries"
          element={user ? <UserInquiries user={user} /> : <UserLogin setUser={setUser} />}
        />

        {/* ✅ New Inquiry Page */}
        <Route
          path="/inquiry-page"
          element={user ? <InquiryPage user={user} /> : <UserLogin setUser={setUser} />}
        />

        {/* ✅ New MyBookings Page */}
        <Route
          path="/my-bookings"
          element={user ? <MyBookings user={user} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/available-events"
          element={
            user ? (
              <AvailableEvents
                user={user}
                onInquiryClick={handleInquiryClick}
                onBookingClick={handleBookingClick}
              />
            ) : (
              <UserLogin setUser={setUser} />
            )
          }
        />

        <Route
          path="/my-saved-vendors"
          element={user ? <SavedVendors user={user} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/ai-suggestions"
          element={user ? <AISuggestions user={user} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/my-events"
          element={user ? <EventList user={user} /> : <UserLogin setUser={setUser} />}
        />

        <Route
          path="/create-event"
          element={user ? <EventForm user={user} /> : <UserLogin setUser={setUser} />}
        />

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
      </Routes>
    </Router>
  );
}

export default App;
