import React, { useState } from 'react';
import EventService from '../services/EventService';
import { useNavigate } from 'react-router-dom';

function AddEvent() {
  const [event, setEvent] = useState({ name: '', description: '', location: '', eventDateTime: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setEvent({ ...event, [e.target.name]: e.target.value });

  const saveEvent = (e) => {
    e.preventDefault();
    EventService.createEvent(event).then(() => navigate('/events'));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Add New Event</h2>
        <form onSubmit={saveEvent}>
          <input name="name" placeholder="Event Name" value={event.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={event.description} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={event.location} onChange={handleChange} required />
          <input name="eventDateTime" type="datetime-local" value={event.eventDateTime} onChange={handleChange} required />
          <button type="submit">Save Event</button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
