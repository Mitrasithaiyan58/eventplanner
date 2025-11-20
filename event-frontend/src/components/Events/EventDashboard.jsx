// src/components/Events/EventDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./EventDashboard.css";

const EventDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  // request notifications permission once
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // fetch dashboard data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [bookingsRes, inquiriesRes, vendorBookingsRes] = await Promise.all([
          axios.get("/api/bookings"),
          axios.get("/api/inquiries"),
          axios.get("/vendor-bookings"),
        ]);
        if (!mounted) return;
        setBookings(bookingsRes.data || []);
        setInquiries(inquiriesRes.data || []);
        setVendorBookings(vendorBookingsRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // booking status update
  const handleBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status?status=${status}`);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status.toUpperCase() } : b)));
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  // vendor booking status update
  const handleVendorBookingStatus = async (id, status) => {
    try {
      // note: backend endpoints expected: PUT /vendor-bookings/{id}/{action} where action is approve/reject
      await axios.put(`/vendor-bookings/${id}/${status}`);
      setVendorBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status.toUpperCase() } : b)));
    } catch (err) {
      console.error("Error updating vendor booking status:", err);
    }
  };

  // reply to an inquiry
  const handleInquiryReply = async (id) => {
    try {
      const reply = (replyText[id] || "").trim();
      if (!reply) return alert("Please enter a reply.");
      await axios.put(`/api/inquiries/${id}/reply`, { reply });
      setInquiries((prev) => prev.map((q) => (q.id === id ? { ...q, reply, status: "Replied" } : q)));
      setReplyText((p) => ({ ...p, [id]: "" }));
    } catch (err) {
      console.error("Error replying to inquiry:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eventManager");
    navigate("/event-login");
  };

  // go to manager feedback overview (can show all vendors or accept query params)
  const goToManagerFeedback = (vendorId) => {
    if (vendorId) {
      navigate(`/view-feedback?vendor=${vendorId}`);
    } else {
      navigate("/view-feedback");
    }
  };

  return (
    <div className="manager-dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Event Manager Dashboard</h2>
        <div>
          <button onClick={() => goToManagerFeedback(null)} style={{ marginRight: 8 }}>View Vendor Feedback</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-tabs" style={{ marginTop: 16 }}>
        <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>📅 Event Bookings</button>
        <button className={activeTab === "inquiries" ? "active" : ""} onClick={() => setActiveTab("inquiries")}>💬 Inquiries</button>
        <button className={activeTab === "vendor" ? "active" : ""} onClick={() => setActiveTab("vendor")}>🧾 Vendor Bookings</button>
      </div>

      {/* Bookings */}
      {activeTab === "bookings" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {bookings.length === 0 ? <p>No bookings yet.</p> : bookings.map((b) => (
            <div key={b.id} className="notif-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{b.userName}</strong> — {b.eventName}
                  <div style={{ fontSize: 13, color: "#666" }}>{b.eventDate}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className={`status-badge ${b.status?.toLowerCase() || "pending"}`}>{b.status}</div>
                  {b.status === "PENDING" && (
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => handleBookingStatus(b.id, "CONFIRMED")} className="accept-btn">✅ Confirm</button>
                      <button onClick={() => handleBookingStatus(b.id, "REJECTED")} className="reject-btn" style={{ marginLeft: 8 }}>❌ Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiries */}
      {activeTab === "inquiries" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {inquiries.length === 0 ? <p>No inquiries yet.</p> : inquiries.map((q) => (
            <div key={q.id} className="notif-item inquiry">
              <strong>{q.userName}</strong> — {q.eventName}
              <p>Question: {q.message}</p>

              <div style={{ marginTop: 8 }}>
                <div className={`status-badge ${q.status === "Replied" ? "status-confirmed" : "status-pending"}`}>{q.status}</div>

                {q.status === "Pending" && (
                  <div style={{ marginTop: 8 }}>
                    <textarea placeholder="Type your reply..." value={replyText[q.id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [q.id]: e.target.value }))} style={{ width: "100%", minHeight: 80 }} />
                    <div style={{ marginTop: 8 }}>
                      <button className="accept-btn" onClick={() => handleInquiryReply(q.id)}>💬 Send Reply</button>
                    </div>
                  </div>
                )}

                {q.status === "Replied" && <p style={{ marginTop: 8 }}><strong>Reply:</strong> {q.reply}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendor Bookings */}
      {activeTab === "vendor" && (
        <div className="tab-content" style={{ marginTop: 12 }}>
          {vendorBookings.length === 0 ? <p>No vendor bookings yet.</p> : vendorBookings.map((b) => (
            <div key={b.id} className="notif-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>Vendor #{b.vendorId}</strong> — {b.eventName}
                  <div style={{ fontSize: 13, color: "#666" }}>User: {b.userId} • Date: {b.eventDate}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className={`status-badge ${b.status?.toLowerCase() || "pending"}`}>{b.status || "PENDING"}</div>

                  {b.status === "PENDING" && (
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => handleVendorBookingStatus(b.id, "approve")} className="accept-btn">✅ Approve</button>
                      <button onClick={() => handleVendorBookingStatus(b.id, "reject")} className="reject-btn" style={{ marginLeft: 8 }}>❌ Reject</button>
                    </div>
                  )}

                  {/* quick view feedback per vendor -> manager route will handle vendor query param */}
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => goToManagerFeedback(b.vendorId)}>View Feedback</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
