import React from 'react';

// EventDetails component — shows static event info + available tickets from backend
function EventDetails({ availableTickets }) {
  return (
    <div className="event-card">
      <h2>Event Details</h2>

      <table className="event-info-table">
        <tbody>
          <tr>
            <td>Event Name</td>
            <td>Tech Fest 2026</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>Computer Science</td>
          </tr>
          <tr>
            <td>Date &amp; Time</td>
            <td>10 May 2026, 10:00 AM</td>
          </tr>
          <tr>
            <td>Venue</td>
            <td>College Auditorium</td>
          </tr>
          <tr>
            <td>Ticket Price</td>
            <td>&#8377;100 per ticket</td>
          </tr>
        </tbody>
      </table>

      {/* Show available tickets fetched from backend */}
      <p className="tickets-available">
        Available Tickets: <span>{availableTickets}</span>
      </p>
    </div>
  );
}

export default EventDetails;
