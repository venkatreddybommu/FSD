import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// EventList — shows all upcoming events fetched from the backend
function EventList() {
  const navigate = useNavigate();
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  }, []);

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Define fetchEvents BEFORE useEffect so it's not in temporal dead zone
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/events');
      const data = await response.json();
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Could not load events. Please start the backend server on port 8081.');
    }
    setLoading(false);
  }, []);

  // Fetch all events when the page loads
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  function handleBookNow(event) {
    navigate(`/book/${event.id}`, { state: { event } });
  }

  return (
    <div className="page-wrapper">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">🎟️ Tech Fest 2026</div>
        <div className="nav-actions">
          {user && <span className="nav-user">👤 {user.username}</span>}
          {user?.role === 'ADMIN' && (
            <button className="btn-nav" onClick={() => navigate('/admin')}>
              ⚙️ Admin Panel
            </button>
          )}
          <button className="btn-nav" onClick={() => navigate('/my-bookings')}>
            📋 My Bookings
          </button>
          <button className="btn-nav btn-danger-nav" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <h1>Upcoming Events</h1>
          <p>Browse and book tickets for our upcoming events</p>
        </div>

        {/* Error state */}
        {error && <div className="error-banner">{error}</div>}

        {/* Loading state */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && events.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No events yet</h3>
            <p>Check back soon for upcoming events!</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card-modern">
              <div className="event-card-header">
                <span className="event-dept-badge">{event.department}</span>
                <span className={`ticket-badge ${event.availableTickets === 0 ? 'sold-out' : ''}`}>
                  {event.availableTickets === 0 ? '🔴 Sold Out' : `🟢 ${event.availableTickets} left`}
                </span>
              </div>

              <h2 className="event-name">{event.name}</h2>

              <div className="event-meta">
                <div className="event-meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{event.eventDate}</span>
                </div>
                <div className="event-meta-item">
                  <span className="meta-icon">🕐</span>
                  <span>{event.eventTime}</span>
                </div>
                <div className="event-meta-item">
                  <span className="meta-icon">📍</span>
                  <span>{event.venue}</span>
                </div>
                <div className="event-meta-item">
                  <span className="meta-icon">💰</span>
                  <span>₹{event.ticketPrice} per ticket</span>
                </div>
              </div>

              <div className="ticket-progress">
                <div className="progress-label">
                  <span>Availability</span>
                  <span>{event.availableTickets} / {event.totalTickets}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                id={`book-event-${event.id}`}
                className="btn-book-event"
                disabled={event.availableTickets === 0}
                onClick={() => handleBookNow(event)}
              >
                {event.availableTickets === 0 ? 'Sold Out' : 'Book Now →'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventList;
