import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./components/Auth/UserLogin";
import UserSignup from "./components/Auth/UserSignup";
import UserDashboard from "./components/Auth/UserDashboard";
import UserProfile from "./components/Auth/UserProfile";
import EventForm from "./components/Events/EventForm";
import EventList from "./components/Events/EventList";
import AISuggestions from "./components/AI/AISuggestions";
import SavedVendors from "./components/Vendors/SavedVendors"; // ✅ Add this import

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Auth Routes */}
        <Route path="/" element={<UserLogin setUser={handleUserLogin} />} />
        <Route path="/user-login" element={<UserLogin setUser={handleUserLogin} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/user-dashboard"
          element={user ? <UserDashboard user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />

        <Route
          path="/user-profile"
          element={user ? <UserProfile user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />

        <Route
          path="/create-event"
          element={user ? <EventForm user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />

        <Route
          path="/my-events"
          element={user ? <EventList user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />

        <Route
          path="/ai-suggestions"
          element={user ? <AISuggestions user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />

        {/* 💾 Saved Vendors page (from User Dashboard button) */}
        <Route
          path="/my-saved-vendors"
          element={user ? <SavedVendors user={user} /> : <UserLogin setUser={handleUserLogin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
