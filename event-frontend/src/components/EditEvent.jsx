import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';

function EditEvent() {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: '',
    description: '',
    location: '',
    eventDateTime: ''
  });

  useEffect(() => {
    // Fetch the event data by ID
    EventService.getEventById(id).then(res => {
      setEvent(res.data);
    }).catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const updateEvent = (e) => {
    e.preventDefault();
    EventService.updateEvent(id, event)
      .then(() => navigate('/events'))
      .catch(err => console.error(err));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Edit Event</h2>
        <form onSubmit={updateEvent}>
          <input
            name="name"
            placeholder="Event Name"
            value={event.name}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={event.description}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={event.location}
            onChange={handleChange}
            required
          />
          <input
            name="eventDateTime"
            type="datetime-local"
            value={event.eventDateTime}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Event</button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
