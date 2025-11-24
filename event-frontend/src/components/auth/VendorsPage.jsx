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

import PaymentButton from "./PaymentButton";

import "./VendorsPage.css";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingData, setBookingData] = useState({ notes: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [bookingId, setBookingId] = useState(null); // <-- ADDED
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get("/events")
      .then(res => {
        const planned = (res.data || []).filter(ev =>
          (ev.status || "").toLowerCase() === "planned"
        );
        setEvents(planned);
      })
      .catch(err => console.error(err));
  }, []);

  const openBookingPopup = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedEvent(null);
    setBookingData({ notes: "" });
    setBookingId(null);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedVendor(null);
    setSelectedEvent(null);
    setBookingData({ notes: "" });
    setBookingId(null);
  };

  const createVendorBooking = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("Please log in first.");
      navigate("/user-login");
      return;
    }

    if (!selectedEvent?.id) {
      alert("Select an event.");
      return;
    }

    try {
      const payload = {
        userId: user.id,
        vendorId: selectedVendor.id,
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        eventDate: selectedEvent.eventDateTime,
        notes: bookingData.notes,
        price: selectedVendor.priceRange
      };

      const resp = await axios.post("/vendor-booking", payload);
      setBookingId(resp.data.id); // <-- SAVE BOOKING ID
      alert("Vendor booking created! Now complete payment.");

    } catch (err) {
      console.error(err);
      alert("Booking failed.");
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

            <button onClick={() => openBookingPopup(vendor)}>
              Plan with this Vendor
            </button>
          </div>
        ))}
      </div>

      {showPopup && selectedVendor && (
        <div className="popup-overlay">
          <div className="popup-container">

            <h2>📅 Plan with {selectedVendor.name}</h2>

            {/* ⛳ EVENT SELECT & NOTES */}
            <form onSubmit={createVendorBooking}>
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

              {!bookingId && (
                <div className="popup-buttons">
                  <button type="submit">Create Booking</button>
                  <button type="button" onClick={closePopup}>Cancel</button>
                </div>
              )}
            </form>

            {/* ⛳ PAYMENT BUTTON AFTER BOOKING CREATED */}
            {bookingId && (
              <div style={{ marginTop: "15px" }}>
                <h3>Complete Payment</h3>

                <PaymentButton
                  type="VENDOR"
                  bookingId={bookingId}
                  amount={selectedVendor.priceRange}
                  userId={JSON.parse(localStorage.getItem("user")).id}
                  eventId={selectedEvent?.id}
                  vendorId={selectedVendor.id}
                  onSuccess={() => {
                    alert("🎉 Vendor booking confirmed!");
                    closePopup();
                  }}
                />
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
