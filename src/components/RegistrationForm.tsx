import React, { useState } from 'react';
import { registerUser, type RegistrationData } from '../api/auth';
import { Log } from '../utils/logger';

interface Props {
  onRegisterSuccess: (clientId: string, clientSecret: string) => void;
}

export const RegistrationForm: React.FC<Props> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    name: '',
    mobileNo: '',
    githubUsername: '',
    rollNo: 'RA2311028010098', // Pre-filled from workspace
    accessCode: '',
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
      const response = await registerUser(formData);
      // We don't have the token yet to log to the remote server, but we can log locally or attempt it.
      await Log('frontend', 'info', 'component', 'Registration successful');
      onRegisterSuccess(response.clientID, response.clientSecret);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
      await Log('frontend', 'error', 'component', `Registration failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h2><span className="badge badge-info">Step 1</span> Registration</h2>
      <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
        Register with the Test Server to obtain your Client ID and Client Secret.
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
          <label>Mobile Number</label>
          <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>GitHub Username</label>
          <input type="text" name="githubUsername" value={formData.githubUsername} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Roll Number</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} className="input-field" required />
        </div>
        <div className="input-group">
          <label>Access Code</label>
          <input type="text" name="accessCode" value={formData.accessCode} onChange={handleChange} className="input-field" required />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};
