import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Auth/Auth.css"; // ✅ make sure CSS is imported

const EventForm = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const editId = query.get("edit"); // ?edit=eventId

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editId) {
      axios
        .get(`/events/${editId}`)
        .then((res) => {
          const event = res.data;
          setName(event.name);
          setDescription(event.description || "");
          setLocationEvent(event.location || "");
          setEventDateTime(
            event.eventDateTime ? event.eventDateTime.slice(0, 16) : ""
          );
        })
        .catch((err) => {
          console.error(err);
          setMessage("Failed to load event for editing.");
        });
    }
  }, [editId]);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/events/${editId}`, {
          name,
          description,
          location: locationEvent,
          eventDateTime,
          userOrganizer: { id: user.id },
        });
        setMessage("Event updated successfully!");
      } else {
        await axios.post("/events", {
          name,
          description,
          location: locationEvent,
          eventDateTime,
          userOrganizer: { id: user.id },
        });
        setMessage("Event created successfully!");
        setName("");
        setDescription("");
        setLocationEvent("");
        setEventDateTime("");
      }
      navigate("/my-events");
    } catch (err) {
      console.error(err);
      setMessage(editId ? "Failed to update event." : "Failed to create event.");
    }
  };

  return (
    <div className="event-page">
      <div className="form-container">
        <h2>{editId ? "Edit Event" : "Create Event"}</h2>
        {message && <p>{message}</p>}
        <input
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Location"
          value={locationEvent}
          onChange={(e) => setLocationEvent(e.target.value)}
        />
        <input
          type="datetime-local"
          value={eventDateTime}
          onChange={(e) => setEventDateTime(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editId ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
};

export default EventForm;