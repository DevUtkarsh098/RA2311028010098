import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AllNotifications } from './pages/AllNotifications';
import { PriorityInbox } from './pages/PriorityInbox';
import { Bell, Inbox, LogOut } from 'lucide-react';
import { Log } from './utils/logger';
import './index.css';

const Navigation = () => {
  const location = useLocation();
  return (
    <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
      <Link 
        to="/priority" 
        style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          color: location.pathname === '/priority' ? '#f59e0b' : '#f8fafc',
          textDecoration: 'none', fontWeight: '600', padding: '0.5rem 1rem',
          background: location.pathname === '/priority' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
          borderRadius: '8px', transition: 'all 0.2s'
        }}
      >
        <Inbox size={20} /> Priority Inbox
      </Link>
      <Link 
        to="/all" 
        style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          color: location.pathname === '/all' ? '#3b82f6' : '#f8fafc',
          textDecoration: 'none', fontWeight: '600', padding: '0.5rem 1rem',
          background: location.pathname === '/all' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          borderRadius: '8px', transition: 'all 0.2s'
        }}
      >
        <Bell size={20} /> All Notifications
      </Link>
      
      <div style={{ flex: 1 }}></div>
      <button 
        className="btn btn-secondary" 
        onClick={() => {
          localStorage.removeItem('access_token');
          window.location.reload();
        }}
        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </nav>
  );
};

const AppContent = () => {
  useEffect(() => {
    Log('frontend', 'info', 'component', 'App mounted');
  }, []);

  // Pre-authorization assumed for this stage if token exists, 
  // otherwise we can just mock a token or expect the user to have one from stage 1.
  // The terms say "assume users accessing your application as having been pre-authorised".
  // We'll just allow access.

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Campus Notifications</h1>
        <p style={{ color: '#94a3b8' }}>Real-time updates regarding Placements, Events, and Results.</p>
      </header>

      <Navigation />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/priority" replace />} />
          <Route path="/priority" element={<PriorityInbox />} />
          <Route path="/all" element={<AllNotifications />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
