import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./EventDashboard.css";

const EventDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [popup, setPopup] = useState(null);
  const [prevBookingCount, setPrevBookingCount] = useState(0);
  const [prevInquiryCount, setPrevInquiryCount] = useState(0);

  // Ask permission for browser notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch bookings + inquiries periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, inquiriesRes] = await Promise.all([
          axios.get("/api/bookings"),
          axios.get("/api/inquiries"),
        ]);

        const newBookings = bookingsRes.data;
        const newInquiries = inquiriesRes.data;

        // 🔔 Booking notification
        if (newBookings.length > prevBookingCount) {
          const latestBooking = newBookings[newBookings.length - 1];
          showNotification("Booking", latestBooking.userName, latestBooking.eventName);
        }

        // 🔔 Inquiry notification
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
    const interval = setInterval(fetchData, 10000); // every 10s
    return () => clearInterval(interval);
  }, [prevBookingCount, prevInquiryCount]);

  // 🔔 Notification popup logic
  const showNotification = (type, userName, eventName) => {
    const title = type === "Booking" ? "🔔 New Booking Alert" : "📩 New Inquiry Alert";
    const message = `${type} from ${userName} for "${eventName}"`;

    // Browser popup
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png",
      });
    }

    // In-page popup
    setPopup(message);
    setTimeout(() => setPopup(null), 4000);
  };

  return (
    <div className="manager-dashboard">
      <h2>📅 Event Manager Dashboard</h2>
      <button className="logout-btn">Logout</button>

      <div className="dashboard-stats">
        <div className="stat-card">Total Bookings<br />{bookings.length}</div>
        <div className="stat-card">Total Inquiries<br />{inquiries.length}</div>
      </div>

      <h3>Notifications</h3>
      {bookings.length === 0 && inquiries.length === 0 ? (
        <p>No bookings or inquiries yet.</p>
      ) : (
        <>
          {bookings.map((b, i) => (
            <div key={i} className="notif-item">
              <strong>Booking:</strong> {b.userName} — {b.eventName}
            </div>
          ))}
          {inquiries.map((q, i) => (
            <div key={i} className="notif-item inquiry">
              <strong>Inquiry:</strong> {q.userName} — {q.eventName}
            </div>
          ))}
        </>
      )}

      {popup && <div className="popup-banner">{popup}</div>}
    </div>
  );
};

export default EventDashboard;
