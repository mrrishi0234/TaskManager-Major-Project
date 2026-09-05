import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Toast from './components/Toast';
import './App.css';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('home'); // 'home' | 'login' | 'register'
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const home = () => setAuthMode('home');
    const login = () => setAuthMode('login');
    const register = () => setAuthMode('register');
    window.addEventListener('taskflow-home', home);
    window.addEventListener('taskflow-login', login);
    window.addEventListener('taskflow-register', register);
    return () => {
      window.removeEventListener('taskflow-home', home);
      window.removeEventListener('taskflow-login', login);
      window.removeEventListener('taskflow-register', register);
    };
  }, []);

  // Toast notification system
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />

      <main>
        {user ? (
          <Dashboard showToast={showToast} />
        ) : authMode === 'home' ? (
          <Home onLogin={() => setAuthMode('login')} onRegister={() => setAuthMode('register')} />
        ) : authMode === 'login' ? (
          <Login
            onSwitchToRegister={() => setAuthMode('register')}
            showToast={showToast}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setAuthMode('login')}
            showToast={showToast}
          />
        )}
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
