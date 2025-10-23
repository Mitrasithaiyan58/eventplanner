import React, { useEffect, useState } from 'react';
import EventService from '../services/EventService';
import { Link } from 'react-router-dom';
import './EventList.css';

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    EventService.getAllEvents().then(res => setEvents(res.data));
  }, []);

  const deleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      EventService.deleteEvent(id).then(() => {
        setEvents(events.filter(e => e.id !== id));
      });
    }
  };

  return (
    <div className="table-container">
      <div className="table-card">
        <div className="table-header">
          <h2>Event Management</h2>
          <Link to="/add-event" className="btn-primary">Add Event</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Description</th><th>Location</th><th>Date & Time</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">No events found.</td>
              </tr>
            )}
            {events.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td><td>{e.name}</td><td>{e.description}</td>
                <td>{e.location}</td><td>{e.eventDateTime}</td>
                <td>
                  <Link to={`/edit-event/${e.id}`} className="btn-warning">Edit</Link>
                  <button onClick={() => deleteEvent(e.id)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventList;
