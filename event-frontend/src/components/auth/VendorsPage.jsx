import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import "./VendorsPage.css";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingData, setBookingData] = useState({ notes: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // Fetch vendors
  useEffect(() => {
    axios.get("/vendors").then(res => setVendors(res.data)).catch(err => console.error(err));
  }, []);

  // Fetch user's planned events
  useEffect(() => {
    axios.get("/events").then(res => {
      const planned = (res.data || []).filter(ev => (ev.status || "").toLowerCase() === "planned");
      setEvents(planned);
    }).catch(err => console.error(err));
  }, []);

  const openBookingPopup = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedEvent(null);
    setBookingData({ notes: "" });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedVendor(null);
    setSelectedEvent(null);
    setBookingData({ notes: "" });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("Please log in to plan with a vendor.");
      navigate("/user-login");
      return;
    }

    if (!selectedEvent?.id) {
      alert("Please select an event to plan with this vendor.");
      return;
    }

    try {
      const bookingPayload = {
        userId: user.id,
        vendorId: selectedVendor.id,
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        eventDate: selectedEvent.eventDateTime,
        notes: bookingData.notes,
      };

      await axios.post("/vendor-booking", bookingPayload);
      setSuccessMsg(`🎉 Booking planned with ${selectedVendor.name} for ${selectedEvent.name}!`);
      closePopup();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to plan vendor booking. Please try again.");
    }
  };

  return (
    <div className="vendors-page-wrapper">
      <div className="vendors-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>
        <h1>🎯 Vendor Plans</h1>
      </div>

      {successMsg && <p className="success-message">{successMsg}</p>}

      <div className="vendor-list">
        {vendors.length === 0 && <p>No vendors available.</p>}
        {vendors.map(vendor => (
          <div key={vendor.id} className="vendor-card">
            <h3>{vendor.name}</h3>
            <p><FaTools /> {vendor.type}</p>
            <p><FaMapMarkerAlt /> {vendor.location}</p>
            <p><FaMoneyBillWave /> ₹{vendor.priceRange}</p>
            <p><FaEnvelope /> {vendor.contact}</p>

            <button onClick={() => openBookingPopup(vendor)}>Plan with this Vendor</button>
          </div>
        ))}
      </div>

      {showPopup && selectedVendor && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2>📅 Plan with {selectedVendor.name}</h2>
            {events.length === 0 ? (
              <p>No planned events available. Please create an event first.</p>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <label>Select Event</label>
                <select
                  value={selectedEvent?.id || ""}
                  onChange={(e) =>
                    setSelectedEvent(events.find(ev => ev.id === parseInt(e.target.value)))
                  }
                  required
                >
                  <option value="">-- Select Event --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({new Date(ev.eventDateTime).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                <label>Notes (optional)</label>
                <textarea
                  rows="3"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ notes: e.target.value })}
                ></textarea>

                <div className="popup-buttons">
                  <button type="submit">Confirm Plan</button>
                  <button type="button" onClick={closePopup}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
