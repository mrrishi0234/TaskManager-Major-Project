import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const goHome = () => { window.dispatchEvent(new CustomEvent('taskflow-home')); };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="nav-brand nav-brand-button" onClick={goHome} aria-label="Go to Taskflow home">
          <span className="brand-mark" aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
          <div>
            <span className="brand-name">Taskflow</span>
            <span className="brand-tagline">your day, sorted</span>
          </div>
        </button>

        {user ? (
          <div className="nav-user-section">
            <div className="user-chip">
              <span className="avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="user-greeting">
                <small>Signed in as</small>
                <strong className="user-name-highlight">{user.name}</strong>
              </span>
            </div>
            <button onClick={logout} className="btn btn-ghost btn-sm" title="Sign out of your account">
              Sign out
            </button>
          </div>
        ) : (
          <div className="nav-public-actions">
            <button className="nav-link-btn" onClick={() => window.dispatchEvent(new CustomEvent('taskflow-login'))}>Sign in</button>
            <button className="btn btn-primary btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('taskflow-register'))}>Get started</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
