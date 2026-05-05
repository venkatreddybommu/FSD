import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage      from './LoginPage';
import RegisterPage   from './RegisterPage';
import EventList      from './EventList';
import BookingPage    from './BookingPage';
import AdminDashboard from './AdminDashboard';
import MyBookings     from './MyBookings';

// Helper: returns the logged-in user from localStorage, or null
function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
}

// PrivateRoute — redirects to /login if user is not logged in
function PrivateRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" replace />;
}

// AdminRoute — redirects to /events if user is not an ADMIN
function AdminRoute({ children }) {
  const user = getUser();
  if (!user)                return <Navigate to="/login"  replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/events" replace />;
  return children;
}

// App — sets up all routes for the application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can visit */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — must be logged in */}
        <Route path="/events"
          element={<PrivateRoute><EventList /></PrivateRoute>} />
        <Route path="/book/:eventId"
          element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/my-bookings"
          element={<PrivateRoute><MyBookings /></PrivateRoute>} />

        {/* Admin-only route */}
        <Route path="/admin"
          element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Default redirect */}
        <Route path="*"
          element={getUser() ? <Navigate to="/events" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
