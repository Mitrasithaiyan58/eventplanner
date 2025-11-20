import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = ({ user }) => {
  const [activeTab, setActiveTab] = useState("event");
  const [eventBookings, setEventBookings] = useState([]);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const eventRes = await axios.get(`/api/bookings/user/${user.id}`);
        setEventBookings(eventRes.data || []);

        const vendorRes = await axios.get(`/vendor-booking/user/${user.id}`);
        setVendorBookings(vendorRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="bookings-page">
      <h2>My Bookings</h2>

      <div className="tabs">
        <button className={activeTab === "event" ? "active" : ""} onClick={() => setActiveTab("event")}>
          🎉 Event Bookings
        </button>
        <button className={activeTab === "vendor" ? "active" : ""} onClick={() => setActiveTab("vendor")}>
          🛍 Vendor Bookings
        </button>
      </div>

      {activeTab === "event" && (
        <div>
          {eventBookings.length === 0 ? <p>No event bookings found.</p> : (
            eventBookings.map((b, idx) => (
              <div key={idx} className="booking-card">
                <h3>{b.eventName}</h3>
                <p>Date: {b.eventDate?.split("T")[0]}</p>
                <p>Status: {b.status || "PENDING"}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "vendor" && (
        <div>
          {vendorBookings.length === 0 ? <p>No vendor bookings found.</p> : (
            vendorBookings.map((v, idx) => (
              <div key={idx} className="booking-card">
                <h3>{v.eventName}</h3>
                <p>Vendor ID: {v.vendorId}</p>
                <p>Date: {v.eventDate?.split("T")[0]}</p>
                <p>Notes: {v.notes || "-"}</p>
                <p>Status: {v.status || "PENDING"}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
