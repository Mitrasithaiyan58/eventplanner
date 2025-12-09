// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "./axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// USER COMPONENTS
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

// FEEDBACK FILES
import FeedbackForm from "./components/Auth/FeedbackForm"; // Give Feedback
import ManagerFeedback from "./components/Auth/ManagerFeedback"; // View Feedback

// EVENT MANAGER COMPONENTS
import EventLogin from "./components/Events/EventLogin";
import EventDashboard from "./components/Events/EventDashboard";
import EventList from "./components/Events/EventList";
import EventForm from "./components/Events/EventForm";
import EventBookingsList from "./components/Events/EventBookingsList";

// EVENT DETAILS
import EventDetails from "./components/Auth/EventDetails";





import EventNameAI from "./components/Auth/EventNameAI";

import UserLayout from "./components/Auth/UserLayout";



// Helper hook to get query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function GiveFeedbackWrapper({ user }) {
  const query = useQuery();
  const vendorId = query.get("vendor");
  const eventId = query.get("event");

  if (!vendorId || !eventId) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Please select an event first to give feedback.</h2>
      </div>
    );
  }

  return <FeedbackForm userId={user.id} eventId={eventId} />;
}

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
        {/* USER LOGIN / SIGNUP */}
        <Route path="/" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        {/* USER DASHBOARD */}
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
        <Route
          path="/inquiry-page"
          element={user ? <InquiryPage user={user} /> : <UserLogin setUser={setUser} />}
        />
        <Route
          path="/my-bookings"
          element={user ? <MyBookings user={user} /> : <UserLogin setUser={setUser} />}
        />

        {/* FEEDBACK ROUTES */}
        <Route
          path="/give-feedback"
          element={user ? <GiveFeedbackWrapper user={user} /> : <UserLogin setUser={setUser} />}
        />
        <Route
          path="/view-feedback"
          element={eventManager ? <ManagerFeedback /> : <EventLogin setEventManager={setEventManager} />}
        />

        {/* EVENT DETAILS */}
        <Route
          path="/event-details/:vendorId"
          element={user ? <EventDetails user={user} /> : <UserLogin setUser={setUser} />}
        />

        {/* EVENTS */}
        <Route
          path="/create-event"
          element={user ? <EventForm user={user} /> : <UserLogin setUser={setUser} />}
        />
        <Route
          path="/my-events"
          element={user ? <EventList user={user} /> : <UserLogin setUser={setUser} />}
        />
        <Route
          path="/available-events"
          element={
            user ? (
              <AvailableEvents
                user={user}
                onInquiryClick={handleInquiryClick}
                onBookingClick={handleBookingClick}
                onFeedbackClick={(event) => setSelectedEvent(event)}
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
          path="/vendors"
          element={user ? <VendorsPage user={user} /> : <UserLogin setUser={setUser} />}
        />
        <Route
          path="/book-vendor/:vendorId"
          element={user ? <VendorBookingForm user={user} /> : <UserLogin setUser={setUser} />}
        />

        {/* EVENT MANAGER ROUTES */}
        <Route path="/event-login" element={<EventLogin setEventManager={setEventManager} />} />
        <Route
          path="/event-dashboard"
          element={eventManager ? <EventDashboard eventManager={eventManager} /> : <EventLogin setEventManager={setEventManager} />}
        />
        <Route
          path="/event-bookings"
          element={eventManager ? <EventBookingsList /> : <EventLogin setEventManager={setEventManager} />}
        />

<Route path="/ai-test" element={<EventNameAI />} />





        <Route
  path="/event-booking/:eventId"
  element={user ? <BookingForm user={user} /> : <UserLogin setUser={setUser} />}
  
/>

      </Routes>
    </Router>
  );
}

export default App;

