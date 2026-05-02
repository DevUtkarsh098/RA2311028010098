import { useState, useEffect } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { AuthPanel } from './components/AuthPanel';
import { LoggingDashboard } from './components/LoggingDashboard';
import { Activity } from 'lucide-react';
import './App.css'; // Has been cleared

function App() {
  const [clientID, setClientID] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegisterSuccess = (id: string, secret: string) => {
    setClientID(id);
    setClientSecret(secret);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
          <Activity size={40} color="#3b82f6" />
          Frontend Evaluation
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Registration, Authentication, and Logging Middleware
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {!isAuthenticated && (
          <div className="grid-2">
            <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
            <AuthPanel 
              initialData={{ clientID, clientSecret }} 
              onAuthSuccess={handleAuthSuccess} 
            />
          </div>
        )}

        {isAuthenticated && (
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>✓ Authenticated Successfully</h3>
              <p style={{ color: '#94a3b8' }}>You can now test the logging middleware.</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  setIsAuthenticated(false);
                }} 
                className="btn btn-secondary" 
                style={{ marginTop: '1rem', fontSize: '0.875rem' }}
              >
                Sign Out
              </button>
            </div>
            <LoggingDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
