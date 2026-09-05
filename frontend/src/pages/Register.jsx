import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = ({ onSwitchToLogin, showToast }) => {
  const { register } = useAuth();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    try { setLoading(true); await register(name, email, password); showToast('Account created. Welcome to Taskflow.', 'success'); }
    catch (err) { setError(err.message || 'Registration failed. Please try again.'); showToast(err.message || 'Registration failed', 'error'); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div><div className="auth-decoration auth-decoration-two"></div>
      <div className="auth-layout">
        <div className="auth-story"><span className="brand-mark large"><span></span><span></span><span></span></span><p className="eyebrow">Taskflow</p><h1>Give your plans<br /><em>some shape.</em></h1><p>Build a simple rhythm: capture it, choose what matters, finish it, move on.</p><div className="story-line"><span>01</span><div></div><span>make the list yours</span></div></div>
        <div className="auth-card fade-in">
          <div className="auth-header"><span className="eyebrow">Start fresh</span><h2 className="auth-title">Create your space.</h2><p className="auth-subtitle">No complicated setup. Just your tasks.</p></div>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="reg-name">Full name</label><input id="reg-name" type="text" placeholder="e.g. Komal Sharma" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="reg-email">Email address</label><input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="reg-password">Password <span>(6+ characters)</span></label><input id="reg-password" type="password" placeholder="Choose a password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="reg-confirmpassword">Confirm password</label><input id="reg-confirmpassword" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>{loading ? 'Setting things up' : 'Create my workspace'}</button>
          </form>
          <div className="auth-footer">Already have an account? <button type="button" className="auth-link" onClick={onSwitchToLogin}>Sign in</button></div>
        </div>
      </div>
    </div>
  );
};
export default Register;
