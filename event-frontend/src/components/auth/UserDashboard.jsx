import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { FaCalendarAlt, FaCheckCircle, FaTasks } from "react-icons/fa";
import "./UserDashboard.css";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get(`/events/user/${user.id}`)
        .then((res) => {
          setEvents(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    navigate("/user-login");
  };

  const upcomingEvents = events.filter(
    (e) => e.status && e.status.toLowerCase() === "planned"
  );
  const completedEvents = events.filter(
    (e) => e.status && e.status.toLowerCase() === "completed"
  );

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="greeting">Welcome, {user.name} !!</div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/create-event")}>Create Event</button>
          <button onClick={() => navigate("/my-events")}>My Events</button>
          <button onClick={() => navigate("/user-profile")}>Profile</button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <h1>Dashboard</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card total">
                <FaTasks />
                <h3>{events.length}</h3>
                <p>Total Events</p>
              </div>

              <div className="stat-card upcoming">
                <FaCalendarAlt />
                <h3>{upcomingEvents.length}</h3>
                <p>Planned Events</p>
              </div>

              <div className="stat-card completed">
                <FaCheckCircle />
                <h3>{completedEvents.length}</h3>
                <p>Completed Events</p>
              </div>
            </div>

            <h2>Recent Events</h2>
            <div className="recent-events">
              {events.length > 0 ? (
                events.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="event-card-small"
                  >
                    <h4>{event.name}</h4>
                    <p>{new Date(event.eventDateTime).toLocaleString()}</p>
                    <p>{event.location}</p>
                    {/* ✅ Status Badge */}
                    <p>
                      Status:{" "}
                      <span
                        className={`status-badge ${
                          event.status.toLowerCase() === "planned"
                            ? "status-planned"
                            : event.status.toLowerCase() === "completed"
                            ? "status-completed"
                            : "status-total"
                        }`}
                      >
                        {event.status}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No events created yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
