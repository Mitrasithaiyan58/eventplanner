import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./EventDashboard.css";

const EventDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [popup, setPopup] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [prevBookingCount, setPrevBookingCount] = useState(0);
  const [prevInquiryCount, setPrevInquiryCount] = useState(0);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, inquiriesRes] = await Promise.all([
          axios.get("/api/bookings"),
          axios.get("/api/inquiries"),
        ]);

        const newBookings = bookingsRes.data;
        const newInquiries = inquiriesRes.data;

        if (newBookings.length > prevBookingCount) {
          const latestBooking = newBookings[newBookings.length - 1];
          showNotification("Booking", latestBooking.userName, latestBooking.eventName);
        }

        if (newInquiries.length > prevInquiryCount) {
          const latestInquiry = newInquiries[newInquiries.length - 1];
          showNotification("Inquiry", latestInquiry.userName, latestInquiry.eventName);
        }

        setBookings(newBookings);
        setInquiries(newInquiries);
        setPrevBookingCount(newBookings.length);
        setPrevInquiryCount(newInquiries.length);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [prevBookingCount, prevInquiryCount]);

  const showNotification = (type, userName, eventName) => {
    const title = type === "Booking" ? "🔔 New Booking Alert" : "📩 New Inquiry Alert";
    const message = `${type} from ${userName} for "${eventName}"`;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png",
      });
    }

    setPopup(message);
    setTimeout(() => setPopup(null), 4000);
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status?status=${status}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: status.toUpperCase() } : b
        )
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleInquiryReply = async (id) => {
    try {
      const reply = replyText[id];
      if (!reply || reply.trim() === "") return alert("Please enter a reply.");

      await axios.put(`/api/inquiries/${id}/reply`, { reply });
      setInquiries((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, reply, status: "Replied" } : q
        )
      );
      setReplyText({ ...replyText, [id]: "" });
    } catch (err) {
      console.error("Error replying to inquiry:", err);
    }
  };

  return (
    <div className="manager-dashboard">
      <h2>📅 Event Manager Dashboard</h2>
      <button className="logout-btn">Logout</button>

      <div className="dashboard-stats">
        <div className="stat-card">
          Total Bookings<br />{bookings.length}
        </div>
        <div className="stat-card">
          Total Inquiries<br />{inquiries.length}
        </div>
      </div>

      <h3>Notifications</h3>

      {bookings.length === 0 && inquiries.length === 0 ? (
        <p>No bookings or inquiries yet.</p>
      ) : (
        <>
          {/* BOOKINGS */}
          <h4>Bookings</h4>
          {bookings.map((b) => (
            <div key={b.id} className="notif-item">
              <strong>{b.userName}</strong> — {b.eventName}<br />
              <span>Status: {b.status}</span>
              {b.status === "PENDING" && (
                <div className="action-btns">
                  <button
                    onClick={() => handleBookingStatus(b.id, "CONFIRMED")}
                    className="accept-btn"
                  >
                    ✅ Confirm
                  </button>
                  <button
                    onClick={() => handleBookingStatus(b.id, "REJECTED")}
                    className="reject-btn"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* INQUIRIES */}
          <h4>Inquiries</h4>
          {inquiries.map((q) => (
            <div key={q.id} className="notif-item inquiry">
              <strong>{q.userName}</strong> — {q.eventName}<br />
              <p>Question: {q.message}</p>
              <span>Status: {q.status}</span><br />
              {q.status === "Pending" && (
                <div className="reply-section">
                  <textarea
                    placeholder="Type your reply..."
                    value={replyText[q.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [q.id]: e.target.value })
                    }
                  />
                  <button
                    className="accept-btn"
                    onClick={() => handleInquiryReply(q.id)}
                  >
                    💬 Send Reply
                  </button>
                </div>
              )}
              {q.status === "Replied" && (
                <p><strong>Reply:</strong> {q.reply}</p>
              )}
            </div>
          ))}
        </>
      )}

      {popup && <div className="popup-banner">{popup}</div>}
    </div>
  );
};

export default EventDashboard;
