import React from "react";
import axios from "../../axiosConfig";
import "./VendorList.css";

const VendorList = ({ vendors, user }) => {
  const handleSave = async (vendor) => {
    try {
      const savedVendor = {
        userId: user.id,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorType: vendor.vendorType || vendor.type, // ✅ Handles both cases
        location: vendor.location,
        priceRange: vendor.priceRange,
        contact: vendor.contact,
      };

      await axios.post("http://localhost:8080/api/saved-vendors/save", savedVendor);
      alert("✅ Vendor saved successfully!");
    } catch (error) {
      console.error("❌ Error saving vendor:", error);
      alert("❌ Failed to save vendor.");
    }
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
          <button onClick={() => handleSave(vendor)}>💾 Save Vendor</button>
        </div>
      ))}
    </div>
  );
};

export default VendorList;
