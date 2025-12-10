import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./SavedVendors.css";

const SavedVendors = ({ user }) => {
  const [savedVendors, setSavedVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:8080/api/saved-vendors/user/${user.id}`)
        .then((res) => {
          setSavedVendors(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch saved vendors:", err);
          setLoading(false);
        });
    }
  }, [user.id]); // ✅ Clean dependency, no warning now

  const handleDelete = async (vendorId) => {
    try {
      await axios.delete(`http://localhost:8080/api/saved-vendors/${vendorId}`);
      setSavedVendors((prev) => prev.filter((v) => v.id !== vendorId));
    } catch (err) {
      console.error("❌ Failed to delete vendor:", err);
      alert("Failed to delete vendor.");
    }
  };

  if (loading) return <p className="loading">Loading saved vendors...</p>;

  return (
    <div className="saved-vendors-container">
      <h2> My Saved Vendors</h2>

      {savedVendors.length === 0 ? (
        <p className="no-vendors">You haven’t saved any vendors yet.</p>
      ) : (
        <div className="vendor-grid">
          {savedVendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <h3>{vendor.vendorName || vendor.name}</h3>
              <p>Type: {vendor.vendorType || vendor.type}</p>
              <p>Location: {vendor.location}</p>
              <p>Price: ₹{vendor.priceRange}</p>
              <p>Contact: {vendor.contact}</p>
              <button
                onClick={() => handleDelete(vendor.id)}
                className="delete-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedVendors;
