// src/components/Auth/EventDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import ManagerFeedback from "./ManagerFeedback";

const EventDetails = ({ user }) => {
  const { vendorId } = useParams(); // get vendorId from URL

  if (!vendorId) return <p>No vendor selected.</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Vendor Feedback</h2>
      <p>Vendor ID: {vendorId}</p>

      {/* Feedback Form */}
      <FeedbackForm
        vendorId={parseInt(vendorId)}
        userId={user?.id}
      />

      {/* Feedback List */}
      <ManagerFeedback vendorId={parseInt(vendorId)} />
    </div>
  );
};

export default EventDetails;
