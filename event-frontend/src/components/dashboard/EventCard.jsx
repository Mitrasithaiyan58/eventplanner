import React from 'react';

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p><strong>Date & Time:</strong> {new Date(event.eventDateTime).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location || 'TBD'}</p>
      <p><strong>Description:</strong> {event.description || 'No description'}</p>
      <p>
        <strong>Organizer:</strong> 
        {event.adminOrganizer ? `Admin - ${event.adminOrganizer.username}` :
        event.userOrganizer ? `User - ${event.userOrganizer.name}` : 'N/A'}
      </p>
    </div>
  );
}
