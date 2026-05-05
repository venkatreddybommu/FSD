import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// AdminDashboard — ADMIN-only page: create events, view all events, delete events, view all bookings
function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Active tab: 'create' | 'events' | 'bookings'
  const [activeTab, setActiveTab] = useState('create');

  // ── Create Event form state ─────────────────────────────────────────
  const [name,         setName]         = useState('');
  const [department,   setDepartment]   = useState('');
  const [eventDate,    setEventDate]    = useState('');
  const [eventTime,    setEventTime]    = useState('');
  const [venue,        setVenue]        = useState('');
  const [ticketPrice,  setTicketPrice]  = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError,   setCreateError]   = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // ── Events list state ───────────────────────────────────────────────
  const [events,        setEvents]        = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError,   setEventsError]   = useState('');
  const [deletingId,    setDeletingId]    = useState(null);

  // ── All Bookings state ──────────────────────────────────────────────
  const [allBookings,     setAllBookings]     = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError,   setBookingsError]   = useState('');

  // Load events when "Manage Events" tab is active
  useEffect(() => { if (activeTab === 'events')   fetchEvents();   }, [activeTab]);
  useEffect(() => { if (activeTab === 'bookings') fetchBookings(); }, [activeTab]);

  function handleLogout() { localStorage.removeItem('user'); navigate('/login'); }

  function resetForm() {
    setName(''); setDepartment(''); setEventDate('');
    setEventTime(''); setVenue(''); setTicketPrice(''); setTotalTickets('');
  }

  // ── Fetch events ───────────────────────────────────────────────────
  async function fetchEvents() {
    setEventsLoading(true); setEventsError('');
    try {
      const r = await fetch('http://localhost:8081/events');
      setEvents(await r.json());
    } catch { setEventsError('Could not load events. Is the backend running?'); }
    setEventsLoading(false);
  }

  // ── Delete event ──────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:8081/events/${id}`, { method: 'DELETE' });
      const data = await r.json();
      if (data.success) setEvents((prev) => prev.filter((e) => e.id !== id));
      else setEventsError(data.message || 'Failed to delete event.');
    } catch { setEventsError('Server error. Please try again.'); }
    setDeletingId(null);
  }

  // ── Fetch all bookings ─────────────────────────────────────────────
  async function fetchBookings() {
    setBookingsLoading(true); setBookingsError('');
    try {
      const r = await fetch('http://localhost:8081/bookings');
      setAllBookings(await r.json());
    } catch { setBookingsError('Could not load bookings. Is the backend running?'); }
    setBookingsLoading(false);
  }

  // ── Create event ───────────────────────────────────────────────────
  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreateError(''); setCreateSuccess('');

    if (!name.trim() || !department.trim() || !eventDate || !eventTime || !venue.trim()) {
      setCreateError('Please fill in all required fields.'); return;
    }
    const price   = parseInt(ticketPrice);
    const tickets = parseInt(totalTickets);
    if (isNaN(price)   || price < 0)   { setCreateError('Ticket price must be 0 or more.'); return; }
    if (isNaN(tickets) || tickets <= 0) { setCreateError('Total tickets must be at least 1.'); return; }

    setCreateLoading(true);
    try {
      const r    = await fetch('http://localhost:8081/events', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), department: department.trim(),
          eventDate, eventTime, venue: venue.trim(),
          ticketPrice: price, totalTickets: tickets
        })
      });
      const data = await r.json();
      if (r.ok && data.success) {
        setCreateSuccess(`✅ Event "${name}" created! (ID: ${data.eventId})`);
        resetForm();
      } else {
        setCreateError(data.message || 'Failed to create event.');
      }
    } catch { setCreateError('Cannot connect to server. Make sure the backend is running on port 8081.'); }
    setCreateLoading(false);
  }

  // ── Compute admin stats ────────────────────────────────────────────
  const totalRevenue = allBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🎟️ Tech Fest 2026</div>
        <div className="nav-actions">
          <span className="nav-user admin-badge">👑 {user?.username} (Admin)</span>
          <button className="btn-nav" onClick={() => navigate('/events')}>View Events</button>
          <button className="btn-nav btn-danger-nav" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage events and monitor bookings for Tech Fest 2026</p>
        </div>

        {/* Tab navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'create'   ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}>
            ＋ Create Event
          </button>
          <button
            className={`admin-tab ${activeTab === 'events'   ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}>
            📋 Manage Events
          </button>
          <button
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}>
            🎫 All Bookings
          </button>
        </div>

        {/* ── TAB: Create Event ─────────────────────────────────── */}
        {activeTab === 'create' && (
          <div className="admin-card">
            <h2>Create New Event</h2>

            {createError   && <div className="error-banner">{createError}</div>}
            {createSuccess && <div className="success-banner">{createSuccess}</div>}

            <form onSubmit={handleCreateEvent} noValidate>
              <div className="form-group">
                <label htmlFor="admin-event-name">Event Name *</label>
                <input id="admin-event-name" type="text" placeholder="e.g. Hackathon 2026"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="admin-dept">Department *</label>
                <input id="admin-dept" type="text" placeholder="e.g. Computer Science"
                  value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>

              <div className="card-row">
                <div className="form-group">
                  <label htmlFor="admin-date">Event Date *</label>
                  <input id="admin-date" type="date" value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="admin-time">Event Time *</label>
                  <input id="admin-time" type="time" value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="admin-venue">Venue *</label>
                <input id="admin-venue" type="text" placeholder="e.g. College Auditorium"
                  value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>

              <div className="card-row">
                <div className="form-group">
                  <label htmlFor="admin-price">Ticket Price (₹) *</label>
                  <input id="admin-price" type="number" placeholder="e.g. 100" min="0"
                    value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="admin-tickets">Total Tickets *</label>
                  <input id="admin-tickets" type="number" placeholder="e.g. 50" min="1"
                    value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
                </div>
              </div>

              <div className="button-row">
                <button id="create-event-btn" type="submit" className="btn-primary" disabled={createLoading}>
                  {createLoading ? 'Creating...' : '＋ Create Event'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB: Manage Events ───────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="admin-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h2 style={{margin:0}}>All Events ({events.length})</h2>
              <button className="btn-secondary" onClick={fetchEvents} style={{padding:'0.5rem 1rem'}}>
                🔄 Refresh
              </button>
            </div>

            {eventsError   && <div className="error-banner">{eventsError}</div>}
            {eventsLoading && <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>}

            {!eventsLoading && events.length === 0 && !eventsError && (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No events found. Create one using the "Create Event" tab.</p>
              </div>
            )}

            <div className="admin-events-table">
              {events.map((ev) => (
                <div key={ev.id} className="admin-event-row">
                  <div className="admin-event-info">
                    <span className="event-dept-badge">{ev.department}</span>
                    <strong>{ev.name}</strong>
                    <div className="admin-event-meta">
                      <span>📅 {ev.eventDate}</span>
                      <span>🕐 {ev.eventTime}</span>
                      <span>📍 {ev.venue}</span>
                      <span>💰 ₹{ev.ticketPrice}</span>
                      <span>🎫 {ev.availableTickets}/{ev.totalTickets} left</span>
                    </div>
                  </div>
                  <div className="admin-event-actions">
                    <button
                      className="btn-delete"
                      disabled={deletingId === ev.id}
                      onClick={() => handleDelete(ev.id)}>
                      {deletingId === ev.id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: All Bookings ────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="admin-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
              <h2 style={{margin:0}}>All Bookings ({allBookings.length})</h2>
              <button className="btn-secondary" onClick={fetchBookings} style={{padding:'0.5rem 1rem'}}>
                🔄 Refresh
              </button>
            </div>

            {/* Revenue summary */}
            {allBookings.length > 0 && (
              <div className="stats-row" style={{marginBottom:'1.5rem'}}>
                <div className="stat-card">
                  <div className="stat-icon">🎫</div>
                  <div className="stat-value">{allBookings.length}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{totalRevenue}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🪑</div>
                  <div className="stat-value">{allBookings.reduce((s,b)=>s+(b.numberOfTickets||0),0)}</div>
                  <div className="stat-label">Tickets Sold</div>
                </div>
              </div>
            )}

            {bookingsError   && <div className="error-banner">{bookingsError}</div>}
            {bookingsLoading && <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>}

            {!bookingsLoading && allBookings.length === 0 && !bookingsError && (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No bookings yet.</p>
              </div>
            )}

            {!bookingsLoading && allBookings.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Event</th>
                      <th>Tickets</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((b) => (
                      <tr key={b.bookingId}>
                        <td><span className="booking-id-badge">#{b.bookingId}</span></td>
                        <td>{b.name}</td>
                        <td style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{b.email}</td>
                        <td><strong>{b.eventName || `Event #${b.eventId}`}</strong></td>
                        <td style={{textAlign:'center'}}>{b.numberOfTickets}</td>
                        <td><span style={{color:'var(--accent-green)', fontWeight:700}}>₹{b.totalAmount || '—'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
