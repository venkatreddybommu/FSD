import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';

// BookingPage — wraps the booking form and the payment form into one flow
// Step 1: Fill booking details  →  Step 2: Payment  →  Step 3: Confirmation
function BookingPage() {
  const { eventId } = useParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const user        = JSON.parse(localStorage.getItem('user') || 'null');

  // The event can be passed via navigation state (from EventList) OR fetched from backend
  const [event,        setEvent]        = useState(location.state?.event || null);
  const [loadingEvent, setLoadingEvent] = useState(!event);

  // Form fields
  const [name,            setName]            = useState(user?.username || '');
  const [email,           setEmail]           = useState('');
  const [department,      setDepartment]      = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState('');

  // Field errors
  const [nameError,    setNameError]    = useState('');
  const [emailError,   setEmailError]   = useState('');
  const [deptError,    setDeptError]    = useState('');
  const [ticketsError, setTicketsError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // UI state
  const [step,  setStep]  = useState(1); // 1 = booking form, 2 = payment, 3 = confirmation
  const [bookingData,     setBookingData]     = useState(null);
  const [confirmation,    setConfirmation]    = useState(null);

  // If event was not passed via state, fetch it from backend
  useEffect(() => {
    if (!event) {
      fetch(`http://localhost:8081/events/${eventId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setEvent(data.event);
          else navigate('/events');
        })
        .catch(() => navigate('/events'))
        .finally(() => setLoadingEvent(false));
    }
  }, [event, eventId, navigate]);

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validate() {
    let valid = true;
    if (!name.trim())               { setNameError('Name is required.');                      valid = false; } else setNameError('');
    if (!email.trim())              { setEmailError('Email is required.');                     valid = false; }
    else if (!isValidEmail(email))  { setEmailError('Enter a valid email address.');           valid = false; } else setEmailError('');
    if (!department.trim())         { setDeptError('Department is required.');                 valid = false; } else setDeptError('');

    const tickets = parseInt(numberOfTickets);
    if (!numberOfTickets || isNaN(tickets) || tickets <= 0) {
      setTicketsError('Enter a valid number of tickets (minimum 1).');
      valid = false;
    } else if (tickets > event?.availableTickets) {
      setTicketsError(`Only ${event.availableTickets} tickets are available.`);
      valid = false;
    } else {
      setTicketsError('');
    }
    return valid;
  }

  function handleProceedToPayment(e) {
    e.preventDefault();
    setGeneralError('');
    if (!validate()) return;

    // Build the booking payload to pass to PaymentForm
    setBookingData({
      userId:          user?.userId || null,
      eventId:         event.id,
      name:            name.trim(),
      email:           email.trim(),
      department:      department.trim(),
      numberOfTickets: parseInt(numberOfTickets)
    });
    setStep(2); // go to payment screen
  }

  function handlePaymentSuccess(data) {
    setConfirmation(data);
    setStep(3); // go to confirmation screen
  }

  function handleReset() {
    setName(user?.username || '');
    setEmail(''); setDepartment(''); setNumberOfTickets('');
    setNameError(''); setEmailError(''); setDeptError(''); setTicketsError(''); setGeneralError('');
  }

  if (loadingEvent) {
    return (
      <div className="page-wrapper">
        <div className="loading-state"><div className="spinner"></div><p>Loading event details...</p></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🎟️ Tech Fest 2026</div>
        <div className="nav-actions">
          {user && <span className="nav-user">👤 {user.username}</span>}
          <button className="btn-nav" onClick={() => navigate('/events')}>← Back to Events</button>
        </div>
      </nav>

      <div className="page-content">

        {/* Step 1: Booking Form */}
        {step === 1 && event && (
          <>
            {/* Event summary at top */}
            <div className="booking-event-summary">
              <span className="event-dept-badge">{event.department}</span>
              <h2>{event.name}</h2>
              <div className="booking-event-meta">
                <span>📅 {event.eventDate}</span>
                <span>📍 {event.venue}</span>
                <span>💰 ₹{event.ticketPrice} per ticket</span>
                <span>🎫 {event.availableTickets} tickets left</span>
              </div>
            </div>

            <div className="booking-card">
              <h2>Booking Details</h2>
              {generalError && <div className="error-banner">{generalError}</div>}

              <form onSubmit={handleProceedToPayment} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" type="text" placeholder="Enter your full name"
                    value={name} onChange={(e) => setName(e.target.value)} />
                  {nameError && <p className="field-error">{nameError}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input id="email" type="email" placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  {emailError && <p className="field-error">{emailError}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department *</label>
                  <input id="department" type="text" placeholder="Your department"
                    value={department} onChange={(e) => setDepartment(e.target.value)} />
                  {deptError && <p className="field-error">{deptError}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="numberOfTickets">Number of Tickets *</label>
                  <input id="numberOfTickets" type="number" placeholder="How many tickets?" min="1"
                    value={numberOfTickets} onChange={(e) => setNumberOfTickets(e.target.value)} />
                  {ticketsError && <p className="field-error">{ticketsError}</p>}
                </div>

                {numberOfTickets > 0 && event && (
                  <div className="total-preview">
                    Total: ₹{parseInt(numberOfTickets || 0) * event.ticketPrice}
                  </div>
                )}

                <div className="button-row">
                  <button id="proceed-payment-btn" type="submit" className="btn-primary">
                    Proceed to Payment →
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Step 2: Payment Form */}
        {step === 2 && bookingData && event && (
          <PaymentForm
            bookingData={bookingData}
            event={event}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setStep(1)}
          />
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && confirmation && (
          <div className="confirmation-box">
            <div className="confirmation-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p className="confirmation-sub">Your payment was successful and your tickets are booked.</p>

            <div className="confirmation-details">
              <div className="conf-row"><span>Name</span><span>{confirmation.name}</span></div>
              <div className="conf-row"><span>Event</span><span>{confirmation.eventName}</span></div>
              <div className="conf-row"><span>Tickets Booked</span><span>{confirmation.ticketsBooked}</span></div>
              <div className="conf-row"><span>Total Paid</span><span>₹{confirmation.totalAmount}</span></div>
            </div>

            <button id="book-another-btn" className="btn-primary" onClick={() => navigate('/events')}>
              Browse More Events
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookingPage;
