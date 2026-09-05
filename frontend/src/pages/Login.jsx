import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToRegister, showToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!email.trim() || !password.trim()) { setError('Please fill in both fields.'); return; }
    try { setLoading(true); await login(email, password); showToast('Welcome back.', 'success'); }
    catch (err) { setError(err.message || 'Login failed. Please check your details.'); showToast(err.message || 'Invalid email or password', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div><div className="auth-decoration auth-decoration-two"></div>
      <div className="auth-layout">
        <div className="auth-story">
          <span className="brand-mark large"><span></span><span></span><span></span></span>
          <p className="eyebrow">Taskflow</p>
          <h1>Less chaos.<br /><em>More done.</em></h1>
          <p>Keep assignments, errands, deadlines and tiny “don’t forget this” thoughts in one place.</p>
          <div className="story-line"><span>01</span><div></div><span>focus on one thing</span></div>
        </div>
        <div className="auth-card fade-in">
          <div className="auth-header"><span className="eyebrow">Good to see you</span><h2 className="auth-title">Welcome back.</h2><p className="auth-subtitle">Sign in and pick up where you left off.</p></div>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="login-password">Password</label><input id="login-password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>{loading ? 'Checking' : 'Enter workspace'}</button>
          </form>
          <div className="auth-footer">New here? <button type="button" className="auth-link" onClick={onSwitchToRegister}>Create an account</button></div>
        </div>
      </div>
    </div>
  );
};
export default Login;
