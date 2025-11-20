// src/components/Auth/ManagerFeedback.jsx
import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";

const ManagerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("/api/feedback");
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  if (!feedbacks.length) return <p>No feedbacks yet.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>All Feedbacks</h2>
      {feedbacks.map((f) => (
        <div
          key={f.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 6,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p><strong>Event:</strong> {f.eventName || f.eventId}</p>
          <p><strong>Vendor:</strong> {f.vendorName || f.vendorId}</p>
          <p><strong>Feedback:</strong> {f.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default ManagerFeedback;
