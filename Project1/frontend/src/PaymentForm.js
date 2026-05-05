import React, { useState } from 'react';

// PaymentForm — simulates a credit card payment step
// Props:
//   bookingData  - the booking details from BookingForm
//   event        - the event being booked
//   onSuccess    - callback when payment is "confirmed"
//   onCancel     - callback to go back to booking form
function PaymentForm({ bookingData, event, onSuccess, onCancel }) {
  const [cardNumber,  setCardNumber]  = useState('');
  const [cardName,    setCardName]    = useState('');
  const [expiry,      setExpiry]      = useState('');
  const [cvv,         setCvv]         = useState('');
  const [processing,  setProcessing]  = useState(false);
  const [errors,      setErrors]      = useState({});

  // Format card number with spaces: 1234 5678 9012 3456
  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  // Format expiry as MM/YY
  function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function validate() {
    const newErrors = {};
    const rawCard = cardNumber.replace(/\s/g, '');

    if (!cardName.trim())             newErrors.cardName   = 'Cardholder name is required.';
    if (rawCard.length !== 16)        newErrors.cardNumber = 'Enter a valid 16-digit card number.';
    if (!expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = 'Enter expiry as MM/YY.';
    if (!cvv.match(/^\d{3}$/))        newErrors.cvv       = 'CVV must be 3 digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePay(e) {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);

    // Now send the actual booking request to the backend
    try {
      const response = await fetch('http://localhost:8081/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess(data);
      } else {
        setErrors({ general: data.message || 'Payment failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: 'Cannot connect to server. Please check your connection.' });
    }

    setProcessing(false);
  }

  const totalAmount = bookingData.numberOfTickets * event.ticketPrice;

  return (
    <div className="payment-wrapper">
      <div className="payment-card">

        {/* Order Summary */}
        <div className="payment-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Event</span>
            <span>{event.name}</span>
          </div>
          <div className="summary-row">
            <span>Tickets</span>
            <span>{bookingData.numberOfTickets} × ₹{event.ticketPrice}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form-section">
          <div className="payment-header">
            <h2>💳 Secure Payment</h2>
            <div className="demo-badge">Demo Mode</div>
          </div>

          {errors.general && <div className="error-banner">{errors.general}</div>}

          <form onSubmit={handlePay} noValidate>
            {/* Card Number */}
            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
              {errors.cardNumber && <p className="field-error">{errors.cardNumber}</p>}
            </div>

            {/* Cardholder Name */}
            <div className="form-group">
              <label htmlFor="card-name">Cardholder Name</label>
              <input
                id="card-name"
                type="text"
                placeholder="Name as on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              {errors.cardName && <p className="field-error">{errors.cardName}</p>}
            </div>

            {/* Expiry + CVV in a row */}
            <div className="card-row">
              <div className="form-group">
                <label htmlFor="card-expiry">Expiry Date</label>
                <input
                  id="card-expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
                {errors.expiry && <p className="field-error">{errors.expiry}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv">CVV</label>
                <input
                  id="card-cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                />
                {errors.cvv && <p className="field-error">{errors.cvv}</p>}
              </div>
            </div>

            <div className="payment-actions">
              <button type="button" className="btn-secondary" onClick={onCancel} disabled={processing}>
                ← Go Back
              </button>
              <button id="pay-now-btn" type="submit" className="btn-primary pay-btn" disabled={processing}>
                {processing ? (
                  <span>⏳ Processing...</span>
                ) : (
                  <span>Pay ₹{totalAmount}</span>
                )}
              </button>
            </div>
          </form>

          <p className="payment-note">🔒 This is a simulated payment. No real money is charged.</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
