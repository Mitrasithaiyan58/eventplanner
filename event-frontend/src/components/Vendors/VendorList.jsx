import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import InquiryPopup from "../Inquiries/InquiryPopup";
import BookingForm from "../Bookings/BookingForm";
import "./VendorList.css";

const VendorList = ({ vendors, user }) => {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  // 🔹 Save vendor
  const handleSave = async (vendor) => {
    try {
      const savedVendor = {
        userId: user.id,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorType: vendor.vendorType || vendor.type,
        location: vendor.location,
        priceRange: vendor.priceRange,
        contact: vendor.contact,
      };

      await axios.post("/saved-vendors/save", savedVendor);
      alert("✅ Vendor saved successfully!");
    } catch (error) {
      console.error("❌ Error saving vendor:", error);
      alert("❌ Failed to save vendor.");
    }
  };

  // 🔹 Inquiry popup
  const handleInquiry = (vendor) => {
    setSelectedVendor(vendor);
    setShowInquiry(true);
  };

  // 🔹 (Old) Book popup (you can keep if needed)
  const handleBook = (vendor) => {
    setSelectedVendor(vendor);
    setShowBooking(true);
  };

  // 🔹 🆕 Navigate to Vendor Booking Form
  const handlePlanWithVendor = (vendorId) => {
    navigate(`/vendor-book/${vendorId}`);
  };

  return (
    <div className="vendor-list">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="vendor-card">
          <h3>{vendor.name}</h3>
          <p>Type: {vendor.vendorType || vendor.type}</p>
          <p>Location: {vendor.location}</p>
          <p>Price: ₹{vendor.priceRange}</p>
          <p>Contact: {vendor.contact}</p>

          <div className="vendor-actions">
            <button onClick={() => handleBook(vendor)}>📅 Book</button>
            <button onClick={() => handleSave(vendor)}>💾 Save</button>
            <button onClick={() => handleInquiry(vendor)}>📩 Enquiry</button>
            {/* 🆕 Plan with Vendor Button */}
            <button onClick={() => handlePlanWithVendor(vendor.id)}>🤝 Plan with Vendor</button>
          </div>
        </div>
      ))}

      {/* 💬 Inquiry Popup */}
      {showInquiry && selectedVendor && (
        <InquiryPopup
          userId={user.id}
          vendorId={selectedVendor.id}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {/* 🪪 Booking Form */}
      {showBooking && selectedVendor && (
        <BookingForm
          userId={user.id}
          vendorId={selectedVendor.id}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
};

export default VendorList;
