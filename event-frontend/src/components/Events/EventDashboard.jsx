// src/components/Events/EventDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./EventDashboard.css";

const EventDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [managerEvents, setManagerEvents] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [activeTab, setActiveTab] = useState("bookings");
  const [manager, setManager] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("eventManager");
    if (!stored) {
      navigate("/event-login");
      return;
    }
    const parsed = JSON.parse(stored);
    setManager(parsed);

    let mounted = true;
    const fetchData = async () => {
      try {
        setFetchError("");
        const managerId = parsed?.id;
        const bookingsUrl = managerId ? `/api/bookings/manager/${managerId}` : "/api/bookings";

        const [bookingsRes, inquiriesRes, vendorBookingsRes, eventsRes] = await Promise.all([
          axios.get(bookingsUrl),
          axios.get("/api/inquiries"),
          axios.get("/vendor-booking"),
          axios.get(managerId ? `/events/admin/${managerId}` : "/events"),
        ]);

        if (!mounted) return;

        setBookings(bookingsRes.data || []);
        setInquiries(inquiriesRes.data || []);
        setVendorBookings(vendorBookingsRes.data || []);
        setManagerEvents(eventsRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (mounted) setFetchError("Failed to load data. Please retry or check backend.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  const handleBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status?status=${status}`);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status.toUpperCase() } : b)));
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleVendorBookingStatus = async (id, status) => {
    try {
      await axios.put(`/vendor-booking/${id}/${status}`);
      setVendorBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status.toUpperCase() } : b))
      );
    } catch (err) {
      console.error("Error updating vendor booking status:", err);
    }
  };

  const handleInquiryReply = async (id) => {
    try {
      const reply = (replyText[id] || "").trim();
      if (!reply) return alert("Please enter a reply.");
      await axios.put(`/api/inquiries/${id}/reply`, { reply });
      setInquiries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, reply, status: "Replied" } : q))
      );
      setReplyText((p) => ({ ...p, [id]: "" }));
    } catch (err) {
      console.error("Error replying to inquiry:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eventManager");
    navigate("/event-login");
  };

  const goToManagerFeedback = (vendorId) => {
    if (vendorId) navigate(`/view-feedback?vendor=${vendorId}`);
    else navigate("/view-feedback");
  };

  return (
    <div className="manager-dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Event Manager Dashboard</h2>
        <div>
        
          <button onClick={() => navigate("/create-event?ai=true")} style={{ marginRight: 8 }}> Create Event </button>
          <button onClick={() => goToManagerFeedback(null)} style={{ marginRight: 8 }}>View Vendor Feedback</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-tabs" style={{ marginTop: 16 }}>
        <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>📅 Event Bookings</button>
        <button className={activeTab === "managerEvents" ? "active" : ""} onClick={() => setActiveTab("managerEvents")}>📋  Events</button>
        <button className={activeTab === "inquiries" ? "active" : ""} onClick={() => setActiveTab("inquiries")}>💬 Inquiries</button>
        <button className={activeTab === "vendor" ? "active" : ""} onClick={() => setActiveTab("vendor")}>🧾 Vendor Bookings</button>
      </div>

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
          {!fetchError && bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="notif-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{b.userName}</strong> — {b.eventName}
                    <div style={{ fontSize: 13, color: "#666" }}>{b.eventDate}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</div>
                    {b.status === "PENDING" && (
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => handleBookingStatus(b.id, "CONFIRMED")} className="accept-btn">✅ Confirm</button>
                        <button onClick={() => handleBookingStatus(b.id, "REJECTED")} className="reject-btn" style={{ marginLeft: 8 }}>❌ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY EVENTS */}
      {activeTab === "managerEvents" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
          {!fetchError && managerEvents.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            managerEvents.map((ev) => (
              <div key={ev.id} className="notif-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{ev.name}</strong> — {ev.description || "No description"}
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {ev.eventDateTime ? new Date(ev.eventDateTime).toLocaleString() : "-"} •{" "}
                      {ev.location || "N/A"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={`status-badge ${ev.status?.toLowerCase()}`}>{ev.status || "Planned"}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
          {!fetchError && inquiries.length === 0 ? (
            <p>No inquiries yet.</p>
          ) : (
            inquiries.map((q) => (
              <div key={q.id} className="notif-item inquiry">
                <strong>{q.userName}</strong> — {q.eventName}
                <p>Question: {q.message}</p>

                <div style={{ marginTop: 8 }}>
                  <div className={`status-badge ${q.status === "Replied" ? "status-confirmed" : "status-pending"}`}>
                    {q.status}
                  </div>

                  {q.status === "Pending" && (
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        placeholder="Type your reply..."
                        value={replyText[q.id] || ""}
                        onChange={(e) =>
                          setReplyText((p) => ({ ...p, [q.id]: e.target.value }))
                        }
                        style={{ width: "100%", minHeight: 80 }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <button className="accept-btn" onClick={() => handleInquiryReply(q.id)}>
                          💬 Send Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {q.status === "Replied" && (
                    <p style={{ marginTop: 8 }}>
                      <strong>Reply:</strong> {q.reply}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VENDOR BOOKINGS */}
      {activeTab === "vendor" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
          {!fetchError && vendorBookings.length === 0 ? (
            <p>No vendor bookings yet.</p>
          ) : (
            vendorBookings.map((b) => (
              <div key={b.id} className="notif-item">
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <strong>Vendor #{b.vendorId}</strong> — {b.eventName}
                    <div style={{ fontSize: 13, color: "#666" }}>
                      User: {b.userId} • Date: {b.eventDate}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</div>

                    {b.status === "PENDING" && (
                      <div style={{ marginTop: 8 }}>
                        <button
                          onClick={() => handleVendorBookingStatus(b.id, "approve")}
                          className="accept-btn"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleVendorBookingStatus(b.id, "reject")}
                          className="reject-btn"
                          style={{ marginLeft: 8 }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => goToManagerFeedback(b.vendorId)}>View Feedback</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
