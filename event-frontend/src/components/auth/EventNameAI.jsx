import React, { useState } from "react";
import axios from "axios";

function EventNameAI() {
  const [eventType, setEventType] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const generateNames = async () => {
    if (!eventType.trim()) return;
    setLoading(true);
    setError(null);
    setIsFallback(false);
    try {
      const res = await axios.post("http://localhost:8080/api/ai/suggest-names", {
        eventType,
        count: parseInt(count, 10) || 5
      });
      // Check if fallback was used
      const fallbackUsed = res.headers['x-ai-fallback'] === 'true';
      setIsFallback(fallbackUsed);
      setSuggestions(res.data);
      if (fallbackUsed) {
        setError("⚠️ Using fallback suggestions (OpenAI quota exceeded). Add credits to your OpenAI account for AI-generated names.");
      }
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("⚠️ OpenAI quota exceeded. Using fallback suggestions. Please add credits to your OpenAI account for AI-generated names.");
        setIsFallback(true);
        // Try to show fallback data if available
        if (err.response.data && Array.isArray(err.response.data)) {
          setSuggestions(err.response.data);
        }
      } else {
        setError("Failed to generate names. " + (err.response?.data?.error || "Check backend & API key."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f4f6fb",
        minHeight: "100vh",
        color: "#1f2933"
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          padding: "20px 24px"
        }}
      >
        <h2 style={{ marginTop: 0, color: "#111827" }}>
          AI Event Name Generator (OpenAI)
        </h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Enter event type (ex: Music Concert)"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{
              padding: "10px 12px",
              width: "320px",
              flex: "1 1 280px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111827"
            }}
          />

          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min={1}
            max={25}
            style={{
              width: "90px",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111827"
            }}
          />

          <button
            onClick={generateNames}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
            }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

      {error && (
        <div style={{ 
          color: isFallback ? "orange" : "red", 
          marginTop: 10, 
          padding: "10px",
          backgroundColor: isFallback ? "#fff3cd" : "#f8d7da",
          borderRadius: "5px",
          border: `1px solid ${isFallback ? "#ffc107" : "#dc3545"}`
        }}>
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: isFallback ? "#856404" : "#333" }}>
            {isFallback ? "📋 Fallback Suggestions:" : " AI-Generated Suggestions:"}
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {suggestions.map((name, index) => (
              <li 
                key={index} 
                style={{ 
                  marginTop: "10px", 
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  color: "#111827"
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

export default EventNameAI;
