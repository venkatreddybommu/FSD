import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// MyBookings — shows all bookings made by the currently logged-in user
function MyBookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!user?.userId) { navigate('/login'); return; }

    fetch(`http://localhost:8081/bookings/user/${user.userId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Server error');
        return r.json();
      })
      .then((data) => { setBookings(data); })
      .catch(() => setError('Could not load your bookings. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.numberOfTickets || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🎟️ Tech Fest 2026</div>
        <div className="nav-actions">
          <span className="nav-user">👤 {user?.username}</span>
          <button className="btn-nav" onClick={() => navigate('/events')}>← Events</button>
          <button className="btn-nav btn-danger-nav" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <h1>📋 My Bookings</h1>
          <p>All your booked tickets in one place</p>
        </div>

        {/* Summary Cards */}
        {!loading && !error && bookings.length > 0 && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Events Booked</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🪑</div>
              <div className="stat-value">{totalTickets}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">₹{totalSpent}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="error-banner">{error}</div>}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h3>No bookings yet</h3>
            <p>You haven't booked any tickets. Start exploring events!</p>
            <button className="btn-primary" style={{marginTop:'1.5rem'}} onClick={() => navigate('/events')}>
              Browse Events →
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.bookingId} className="booking-card-item">
                <div className="booking-card-left">
                  <span className="event-dept-badge">{b.department || 'Events'}</span>
                  <h3>{b.eventName || `Event #${b.eventId}`}</h3>
                  <div className="booking-meta-row">
                    {b.eventDate && <span>📅 {b.eventDate}</span>}
                    {b.eventTime && <span>🕐 {b.eventTime}</span>}
                    {b.venue     && <span>📍 {b.venue}</span>}
                  </div>
                  <div className="booking-meta-row">
                    <span>👤 {b.name}</span>
                    <span>✉️ {b.email}</span>
                  </div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-ticket-count">
                    <span className="ticket-big">{b.numberOfTickets}</span>
                    <span className="ticket-label">ticket{b.numberOfTickets !== 1 ? 's' : ''}</span>
                  </div>
                  {b.totalAmount != null && (
                    <div className="booking-amount">₹{b.totalAmount}</div>
                  )}
                  <div className="booking-id-badge">#{b.bookingId}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
