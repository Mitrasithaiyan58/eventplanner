// src/pages/InquiryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import "./InquiryPage.css";

const InquiryPage = ({ user }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchInquiries = async () => {
      try {
        const res = await axios.get(`/api/inquiries/user/${user.id}`);
        setInquiries(res.data);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [user]);

  return (
    <div className="inquiry-page">
      <h2 className="inquiry-title">💬 My Inquiries</h2>

      {loading ? (
        <p className="inquiry-loading">Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p className="no-inquiries">No inquiries found.</p>
      ) : (
        <div className="inquiry-list">
          {inquiries.map((inq, index) => (
            <div key={index} className="inquiry-card">
              <h3 className="event-name">{inq.eventName}</h3>
              <p className="inquiry-question">
                <strong>Question:</strong> {inq.message}
              </p>

              <span
                className={`status-badge ${
                  inq.status?.toLowerCase() === "replied"
                    ? "status-replied"
                    : "status-pending"
                }`}
              >
                {inq.status || "Pending"}
              </span>

              {inq.status === "Replied" && (
                <p className="inquiry-reply">
                  <strong>Reply:</strong> {inq.reply}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiryPage;
