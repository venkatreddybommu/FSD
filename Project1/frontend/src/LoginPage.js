import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// LoginPage — allows existing users to log in
function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Save user info in localStorage so we stay "logged in" across pages
        localStorage.setItem('user', JSON.stringify({
          userId:   data.userId,
          username: data.username,
          role:     data.role
        }));
        // Redirect admin to admin dashboard, users to event list
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 8081.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎟️</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Tech Fest account</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button id="login-btn" type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </p>

        <div className="demo-hint">
          <span>Demo Admin:</span> admin / admin123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
