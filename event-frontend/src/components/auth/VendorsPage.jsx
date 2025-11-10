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
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bookingData, setBookingData] = useState({
    eventName: "",
    eventDate: "",
    notes: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/vendors")
      .then((res) => setVendors(res.data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  const openBookingPopup = (vendor) => {
    setSelectedVendor(vendor);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setBookingData({ eventName: "", eventDate: "", notes: "" });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg(`🎉 Booking planned with ${selectedVendor.name}!`);
    setShowPopup(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="vendors-page-wrapper">
      <div className="vendors-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="vendors-title">🎯 Vendor Plans</h1>
        <p className="vendors-subtitle">
          Discover trusted vendors who make your dream events come true — from
          royal catering to stunning decorations, everything you need in one
          place!
        </p>
      </div>

      {successMsg && <p className="success-message">{successMsg}</p>}

      <div className="vendor-list">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div className="vendor-card" key={vendor.id}>
              <h3 className="vendor-name">{vendor.name}</h3>

              <div className="vendor-info">
                <FaTools /> <span><strong>Type:</strong> {vendor.type}</span>
              </div>
              <div className="vendor-info">
                <FaMapMarkerAlt /> <span><strong>Location:</strong> {vendor.location}</span>
              </div>
              <div className="vendor-info">
                <FaMoneyBillWave /> <span><strong>Price Range:</strong> ₹{vendor.priceRange}</span>
              </div>
              <div className="vendor-contact">
                <FaEnvelope /> {vendor.contact}
              </div>

              <button
                className="vendor-book-btn"
                onClick={() => openBookingPopup(vendor)}
              >
                Plan with this Vendor
              </button>
            </div>
          ))
        ) : (
          <p className="no-vendors">No vendor plans available yet.</p>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2>📅 Plan with {selectedVendor?.name}</h2>
            <form onSubmit={handleBookingSubmit}>
              <label>Event Name</label>
              <input
                type="text"
                value={bookingData.eventName}
                onChange={(e) =>
                  setBookingData({ ...bookingData, eventName: e.target.value })
                }
                required
              />

              <label>Event Date</label>
              <input
                type="date"
                value={bookingData.eventDate}
                onChange={(e) =>
                  setBookingData({ ...bookingData, eventDate: e.target.value })
                }
                required
              />

              <label>Notes (optional)</label>
              <textarea
                rows="3"
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData({ ...bookingData, notes: e.target.value })
                }
              ></textarea>

              <div className="popup-buttons">
                <button type="submit" className="confirm-btn">
                  Confirm Plan
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
