import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "./axiosConfig";

// 🧑‍🤝‍🧑 USER COMPONENTS
import UserLogin from "./components/Auth/UserLogin";
import UserSignup from "./components/Auth/UserSignup";
import UserDashboard from "./components/Auth/UserDashboard";
import UserProfile from "./components/Auth/UserProfile";
import InquiryPopup from "./components/Auth/InquiryPopup";
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

  // 🔹 For popups
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  // Load saved user or event manager from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedManager = localStorage.getItem("eventManager");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedManager) setEventManager(JSON.parse(savedManager));
  }, []);

  // 🔹 Open Inquiry Popup
  const handleInquiryClick = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowInquiry(true);
  };

  // 🔹 Open Booking Popup
  const handleBookingClick = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowBooking(true);
  };

  return (
    <Router>
      {/* ✅ Popup Modals */}
      {showInquiry && (
        <InquiryPopup
          user={user}
          vendorId={selectedVendorId}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {showBooking && (
        <BookingForm
          user={user}
          vendorId={selectedVendorId}
          onClose={() => setShowBooking(false)}
        />
      )}

      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        {/* 🏠 Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            user ? (
              <UserDashboard user={user} />
            ) : (
              <UserLogin setUser={setUser} />
            )
          }
        />

        {/* 👤 Profile */}
        <Route
          path="/user-profile"
          element={
            user ? (
              <UserProfile user={user} setUser={setUser} />
            ) : (
              <UserLogin setUser={setUser} />
            )
          }
        />

        {/* 🎉 Available Events */}
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

        {/* 💬 Inquiry (Full Page) */}
        <Route
          path="/inquiry/:vendorId"
          element={
            user ? <InquiryPopup user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* 📅 Booking Form (Full Page) */}
        <Route
          path="/book-vendor/:vendorId"
          element={
            user ? <BookingForm user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* 💾 Saved Vendors */}
        <Route
          path="/my-saved-vendors"
          element={
            user ? <SavedVendors user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* 💡 AI Suggestions */}
        <Route
          path="/ai-suggestions"
          element={
            user ? <AISuggestions user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* 📋 My Events */}
        <Route
          path="/my-events"
          element={
            user ? <EventList user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* ✏️ Create/Edit Event */}
        <Route
          path="/create-event"
          element={
            user ? <EventForm user={user} /> : <UserLogin setUser={setUser} />
          }
        />

        {/* ================= EVENT MANAGER ROUTES ================= */}
        <Route
          path="/event-login"
          element={<EventLogin setEventManager={setEventManager} />}
        />

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
