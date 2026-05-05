import React, { useState } from 'react';

// BookingForm component — handles form state, validation, and API call
function BookingForm({ availableTickets, onBookingSuccess }) {

  // Form field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState('');

  // Error states for each field
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
  const [ticketsError, setTicketsError] = useState('');

  // General error from backend (e.g., not enough tickets)
  const [generalError, setGeneralError] = useState('');

  // Loading state while waiting for backend response
  const [loading, setLoading] = useState(false);

  // Simple email format check
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate all fields — returns true if everything is fine
  function validate() {
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!department.trim()) {
      setDepartmentError('Department is required.');
      valid = false;
    } else {
      setDepartmentError('');
    }

    const tickets = parseInt(numberOfTickets);
    if (!numberOfTickets || isNaN(tickets) || tickets <= 0) {
      setTicketsError('Enter a valid number of tickets (minimum 1).');
      valid = false;
    } else if (tickets > availableTickets) {
      setTicketsError(`Only ${availableTickets} tickets are available.`);
      valid = false;
    } else {
      setTicketsError('');
    }

    return valid;
  }

  // Reset all form fields and errors
  function handleReset() {
    setName('');
    setEmail('');
    setDepartment('');
    setNumberOfTickets('');
    setNameError('');
    setEmailError('');
    setDepartmentError('');
    setTicketsError('');
    setGeneralError('');
  }

  // Submit form — call backend POST /book
  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');

    // Frontend validation first
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          department: department.trim(),
          numberOfTickets: parseInt(numberOfTickets)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Pass booking result up to App.js to show confirmation
        onBookingSuccess(data);
      } else {
        setGeneralError(data.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('Cannot connect to server. Make sure the backend is running on port 8080.');
    }

    setLoading(false);
  }

  return (
    <div className="booking-card">
      <h2>Book Your Ticket</h2>

      {/* Show general error if any */}
      {generalError && (
        <div className="error-message">{generalError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Name field */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p className="field-error">{nameError}</p>}
        </div>

        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="field-error">{emailError}</p>}
        </div>

        {/* Department field */}
        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            id="department"
            type="text"
            placeholder="Enter your department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          {departmentError && <p className="field-error">{departmentError}</p>}
        </div>

        {/* Number of tickets field */}
        <div className="form-group">
          <label htmlFor="numberOfTickets">Number of Tickets *</label>
          <input
            id="numberOfTickets"
            type="number"
            placeholder="Enter number of tickets"
            min="1"
            value={numberOfTickets}
            onChange={(e) => setNumberOfTickets(e.target.value)}
          />
          {ticketsError && <p className="field-error">{ticketsError}</p>}
        </div>

        {/* Submit and Reset buttons */}
        <div className="button-row">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Booking...' : 'Book Now'}
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}

export default BookingForm;
