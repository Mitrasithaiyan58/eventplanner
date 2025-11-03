import React, { useState } from "react";
import axios from "../../axiosConfig";
import "./InquiryPopup.css";

const InquiryPopup = ({ event, user, onClose }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inquiryData = {
        userId: user.id,
        managerId: event?.managerId || 12,
        eventId: event?.id, // ✅ Add this
        userName: user.name,
        eventName: event.name,
        message,
      };

      console.log("📤 Sending inquiry data:", inquiryData);
      await axios.post("/api/inquiries", inquiryData);

      setStatus("✅ Inquiry sent successfully!");
      setMessage("");

      // Auto close popup after 2 seconds
      setTimeout(() => {
        setStatus("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Inquiry failed:", err);
      const msg =
        err.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to send inquiry.";
      setStatus(`❌ ${msg}`);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>📩 Send Inquiry – {event.name}</h3>

        {!status ? (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <div className="popup-actions">
              <button type="submit">Send</button>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setStatus("");
                  onClose();
                }}
              >
                ✖
              </button>
            </div>
          </form>
        ) : (
          <p className="status-msg">{status}</p>
        )}
      </div>
    </div>
  );
};

export default InquiryPopup;
