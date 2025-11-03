import React, { useEffect, useState, useRef } from "react";
import axios from "../../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserInquiries.css";

const UserInquiries = ({ user }) => {
  const [inquiries, setInquiries] = useState([]);
  const previousReplies = useRef({}); // useRef to persist without re-renders
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchInquiries = async () => {
      try {
        const res = await axios.get(`/api/inquiries/user/${user.id}`);
        if (!isMounted.current) return; // stop if unmounted

        setInquiries(res.data);

        // Notify new replies only once
        res.data.forEach((inq) => {
          if (inq.status === "Replied" && !previousReplies.current[inq.id]) {
            toast.info(
              `Event Manager replied to your inquiry: "${inq.eventName}"`,
              { toastId: inq.id } // prevents duplicate toasts
            );
          }
        });

        // update reply memory
        const updated = {};
        res.data.forEach((inq) => {
          if (inq.status === "Replied") updated[inq.id] = true;
        });
        previousReplies.current = updated;
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      }
    };

    fetchInquiries();
    const interval = setInterval(fetchInquiries, 5000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [user.id]);

  return (
    <div className="inquiry-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>My Inquiries</h2>
      <div className="inquiry-list">
        {inquiries.length === 0 ? (
          <p className="loading-text">No inquiries found.</p>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} className="inquiry-card">
              <p><b>Event:</b> {inq.eventName}</p>
              <p><b>Question:</b> {inq.message}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={`status ${inq.status}`}>{inq.status}</span>
              </p>
              {inq.reply && <p><b>Reply:</b> {inq.reply}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserInquiries;
