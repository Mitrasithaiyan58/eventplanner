import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./components/Auth/UserLogin";
import UserSignup from "./components/Auth/UserSignup";
import UserDashboard from "./components/Auth/UserDashboard";
import UserProfile from "./components/Auth/UserProfile";
import EventForm from "./components/Events/EventForm";
import EventList from "./components/Events/EventList";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Keep user logged in even after refresh
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Routes for Login & Signup */}
        <Route path="/" element={<UserLogin setUser={handleUserLogin} />} />
        <Route path="/login" element={<UserLogin setUser={handleUserLogin} />} />
        <Route path="/user-login" element={<UserLogin setUser={handleUserLogin} />} />
        <Route path="/user-signup" element={<UserSignup />} />

        {/* ✅ Protected Routes (only for logged-in users) */}
        <Route
          path="/user-dashboard"
          element={
            user ? (
              <UserDashboard user={user} setUser={setUser} />
            ) : (
              <UserLogin setUser={handleUserLogin} />
            )
          }
        />

        <Route
          path="/user-profile"
          element={
            user ? (
              <UserProfile user={user} setUser={setUser} />
            ) : (
              <UserLogin setUser={handleUserLogin} />
            )
          }
        />

        <Route
          path="/create-event"
          element={
            user ? (
              <EventForm user={user} />
            ) : (
              <UserLogin setUser={handleUserLogin} />
            )
          }
        />

        <Route
          path="/my-events"
          element={
            user ? (
              <EventList user={user} />
            ) : (
              <UserLogin setUser={handleUserLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
