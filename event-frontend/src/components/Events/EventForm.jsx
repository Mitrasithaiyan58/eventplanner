import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Auth/Auth.css";

const EventForm = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const editId = query.get("edit");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [message, setMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiError, setAiError] = useState(null);
  const [aiFallback, setAiFallback] = useState(false);
const [aiEventType, setAiEventType] = useState("");

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

  // ---------------------------------------------------------
  // AI BUTTON CLICK HANDLER
  // ---------------------------------------------------------
  const generateAIName = async () => {
  const eventTypeGuess = aiEventType || name || description || "event";
    setAiError(null);
    setAiFallback(false);
    try {
      setLoadingAI(true);
      const response = await axios.post("http://localhost:8080/api/ai/suggest-names", {
        eventType: eventTypeGuess,
        count: 5,
      });
      const fallbackUsed = response.headers["x-ai-fallback"] === "true";
      setAiFallback(fallbackUsed);
      const list = Array.isArray(response.data) ? response.data : [];
      setAiSuggestions(list);
      if (list.length) {
        setName(list[0]); // auto-fill first suggestion
      }
    } catch (error) {
      console.error(error);
      setAiError("AI failed to generate event name. Check backend/API key.");
    } finally {
      setLoadingAI(false);
    }
  };

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------
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

        {/* ------------ EVENT NAME + AI BUTTON ------------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <input
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={generateAIName}
              disabled={loadingAI}
              style={{ width: "120px" }}
            >
              {loadingAI ? "..." : "AI Suggest"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <select
              value={aiEventType}
              onChange={(e) => setAiEventType(e.target.value)}
              style={{ padding: "8px", borderRadius: 6, border: "1px solid #d1d5db" }}
            >
              <option value="">Select event type for AI</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="music concert">Music Concert</option>
              <option value="corporate event">Corporate Event</option>
              <option value="festival">Festival</option>
              <option value="party">Party</option>
              <option value="conference">Conference</option>
              <option value="sports">Sports</option>
            </select>
            <input
              placeholder="Or type custom type (e.g., tech meetup)"
              value={aiEventType}
              onChange={(e) => setAiEventType(e.target.value)}
              style={{ flex: 1, minWidth: 220 }}
            />
          </div>
        </div>

        {aiError && (
          <div style={{ color: "red", marginTop: 6 }}>{aiError}</div>
        )}

        {aiSuggestions.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: aiFallback ? "#b45309" : "#1f2937",
                fontWeight: 600,
              }}
            >
              {aiFallback ? "📋 Fallback suggestions" : "✨ AI suggestions"}
              <span style={{ fontWeight: 400, color: "#6b7280" }}>
                (click to use)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {aiSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setName(s)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------ OTHER INPUTS ------------- */}
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
