import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import Swal from "sweetalert2";
import "./AI.css";

const AISuggestions = () => {
  const [eventType, setEventType] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [savedVendors, setSavedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);

  // ✅ Ensure user is loaded from localStorage properly
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  // 🧠 Fetch AI suggestions
  const handleSuggest = async () => {
    if (!eventType || !budget || !location) {
      Swal.fire("⚠️ Oops!", "Please fill all fields!", "warning");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        eventType,
        budget,
        location,
      }).toString();
      const response = await axios.get(`/ai/suggest?${params}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      Swal.fire("❌ Error", "Failed to fetch suggestions.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Save vendor
  const handleSaveVendor = async (vendor) => {
    if (!user || !user.id) {
      Swal.fire("Please login first!", "", "info");
      return;
    }

    try {
      setSaving(vendor.id);
      const vendorData = {
        userId: user.id,
        name: vendor.name,
        type: vendor.type,
        location: vendor.location,
        priceRange: vendor.priceRange,
        contact: vendor.contact,
      };

      const response = await axios.post(
        "http://localhost:8080/api/saved-vendors/save",
        vendorData
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire("✅ Saved!", `${vendor.name} added to your saved vendors.`, "success");
        fetchSavedVendors();
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      Swal.fire("❌ Error", "Could not save vendor.", "error");
    } finally {
      setSaving(null);
    }
  };

  // 🗂️ Fetch saved vendors for this user
  const fetchSavedVendors = async () => {
    if (!user || !user.id) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/saved-vendors/user/${user.id}`
      );
      setSavedVendors(response.data);
    } catch (error) {
      console.error("Error fetching saved vendors:", error);
    }
  };

  // 🗑️ Delete saved vendor
  const handleDeleteVendor = async (vendorId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the vendor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/saved-vendors/${vendorId}`);
        setSavedVendors((prev) => prev.filter((v) => v.id !== vendorId));
        Swal.fire("Deleted!", "Vendor has been removed.", "success");
      } catch (error) {
        console.error("Error deleting vendor:", error);
        Swal.fire("❌ Error", "Failed to delete vendor.", "error");
      }
    }
  };

  // 🧭 Fetch saved vendors when user changes
  useEffect(() => {
    if (user && user.id) fetchSavedVendors();
  }, [user]);

  return (
    <div className="ai-container">
      <h1 className="ai-title"> AI Vendor Suggestions</h1>

      {/* 🔹 Suggestion Input Section */}
      <div className="ai-input-section">
        <input
          type="text"
          placeholder="Event Type (e.g., Wedding)"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (e.g., Coimbatore)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSuggest} className="ai-btn">
          {loading ? "Fetching..." : "Get Suggestions"}
        </button>
      </div>

      {/* 🔹 Suggestions */}
      <div className="ai-results">
        {loading ? (
          <p className="no-data">🔄 Fetching smart vendor suggestions...</p>
        ) : suggestions.length > 0 ? (
          suggestions.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <h3>{vendor.name}</h3>
              <p><strong>Type:</strong> {vendor.type}</p>
              <p><strong>Location:</strong> {vendor.location}</p>
              <p><strong>Price Range:</strong> ₹{vendor.priceRange}</p>
              <p><strong>Contact:</strong> {vendor.contact}</p>
              <button
                className="save-btn"
                onClick={() => handleSaveVendor(vendor)}
                disabled={saving === vendor.id}
              >
                {saving === vendor.id ? "Saving..." : "💾 Save Vendor"}
              </button>
            </div>
          ))
        ) : (
          <p className="no-data">No suggestions yet. Try searching!</p>
        )}
      </div>

      {/* 🔹 Saved Vendors */}
      <h2 className="saved-title">💼 Your Saved Vendors</h2>
      <div className="ai-results">
        {savedVendors.length > 0 ? (
          savedVendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <h3>{vendor.name}</h3>
              <p><strong>Type:</strong> {vendor.type}</p>
              <p><strong>Location:</strong> {vendor.location}</p>
              <p><strong>Price Range:</strong> ₹{vendor.priceRange}</p>
              <p><strong>Contact:</strong> {vendor.contact}</p>
              <button
                className="delete-btn"
                onClick={() => handleDeleteVendor(vendor.id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="no-data">No saved vendors yet.</p>
        )}
      </div>
    </div>
  );
};

export default AISuggestions;