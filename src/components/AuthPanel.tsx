import React, { useState } from 'react';
import { authenticateUser, type AuthData } from '../api/auth';
import { Log } from '../utils/logger';

interface Props {
  initialData: Partial<AuthData>;
  onAuthSuccess: (token: string) => void;
}

export const AuthPanel: React.FC<Props> = ({ initialData, onAuthSuccess }) => {
  const [formData, setFormData] = useState<AuthData>({
    email: initialData.email || '',
    name: initialData.name || '',
    rollNo: initialData.rollNo || '',
    accessCode: initialData.accessCode || '',
    clientID: initialData.clientID || '',
    clientSecret: initialData.clientSecret || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authenticateUser(formData);
      localStorage.setItem('access_token', response.access_token);
      await Log('frontend', 'info', 'auth', 'Authentication successful, token saved.');
      onAuthSuccess(response.access_token);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Authentication failed';
      setError(errorMsg);
      await Log('frontend', 'error', 'auth', `Authentication failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2><span className="badge badge-warning">Step 2</span> Authentication</h2>
      <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
        Obtain an Authorization Token to access Test Server APIs.
      </p>

      {error && <div className="badge badge-error" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Roll Number</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Access Code</label>
          <input type="text" name="accessCode" value={formData.accessCode} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Client ID</label>
          <input type="text" name="clientID" value={formData.clientID} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Client Secret</label>
          <input type="password" name="clientSecret" value={formData.clientSecret} onChange={handleChange} className="input-field" required />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Authenticating...' : 'Authenticate'}
        </button>
      </form>
    </div>
  );
};
