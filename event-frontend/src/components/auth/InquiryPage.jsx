import React, { useState } from "react";
import axios from "../../axiosConfig";
import "./InquiryPopup.css";

const InquiryPopup = ({ event, user, onClose }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/inquiries", {
        userId: user.id,
        eventId: event.id,
        message,
      });
      setStatus("✅ Inquiry sent successfully!");
      setMessage("");

      // Auto close popup after 2 seconds
      setTimeout(() => {
        setStatus("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send inquiry. Try again.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>Send Inquiry - {event.name}</h3>

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
                Close
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
