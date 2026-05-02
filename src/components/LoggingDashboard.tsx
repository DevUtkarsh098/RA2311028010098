import React, { useState } from 'react';
import { Log, type LogLevel, type LogPackage } from '../utils/logger';

export const LoggingDashboard: React.FC = () => {
  const [level, setLevel] = useState<LogLevel>('info');
  const [pkg, setPkg] = useState<LogPackage>('component');
  const [message, setMessage] = useState('This is a test log message.');
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await Log('frontend', level, pkg, message);
      setStatus({ type: 'success', text: `Successfully sent a ${level} log from ${pkg}. Check console to verify local output.` });
    } catch (err: any) {
      setStatus({ type: 'error', text: `Failed to send log: ${err.message}` });
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2><span className="badge badge-success">Step 3</span> Logging Dashboard</h2>
      <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
        Test the logging middleware. Messages will be printed to the console and sent to the Evaluation Server.
      </p>

      {status && (
        <div className={`badge ${status.type === 'success' ? 'badge-success' : 'badge-error'}`} style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem' }}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleLogSubmit}>
        <div className="grid-2">
          <div className="input-group">
            <label>Log Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as LogLevel)} className="input-field" style={{ appearance: 'auto' }}>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="fatal">Fatal</option>
            </select>
          </div>
          <div className="input-group">
            <label>Package</label>
            <select value={pkg} onChange={(e) => setPkg(e.target.value as LogPackage)} className="input-field" style={{ appearance: 'auto' }}>
              <option value="api">api</option>
              <option value="component">component</option>
              <option value="hook">hook</option>
              <option value="page">page</option>
              <option value="state">state</option>
              <option value="style">style</option>
              <option value="auth">auth</option>
              <option value="config">config</option>
              <option value="middleware">middleware</option>
              <option value="utils">utils</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Message</label>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="input-field" required />
        </div>

        <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
          Trigger Log
        </button>
      </form>
    </div>
  );
};
