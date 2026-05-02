import React, { useEffect, useState } from 'react';
import { fetchNotifications, type FetchNotificationsParams } from '../api/notifications';
import { type Notification } from '../priority_inbox';
import { Log } from '../utils/logger';

export const AllNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState<string>('');
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load viewed IDs from localStorage
    const stored = localStorage.getItem('viewed_notifications');
    if (stored) {
      setViewedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [page, limit, type]);

  const loadNotifications = async () => {
    setLoading(true);
    await Log('frontend', 'info', 'page', `Fetching notifications page ${page}, limit ${limit}, type ${type || 'all'}`);
    try {
      const params: FetchNotificationsParams = { page, limit };
      if (type) params.notification_type = type;
      
      const res = await fetchNotifications(params);
      setNotifications(res.notifications || []);
      await Log('frontend', 'info', 'page', `Successfully fetched ${res.notifications?.length || 0} notifications`);
    } catch (error: any) {
      await Log('frontend', 'error', 'page', `Failed to fetch notifications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id: string) => {
    const newSet = new Set(viewedIds);
    newSet.add(id);
    setViewedIds(newSet);
    localStorage.setItem('viewed_notifications', JSON.stringify(Array.from(newSet)));
    Log('frontend', 'debug', 'component', `Marked notification ${id} as viewed`);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>All Notifications</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={type} onChange={e => setType(e.target.value)} className="input-field" style={{ width: 'auto', padding: '0.5rem' }}>
            <option value="">All Types</option>
            <option value="Event">Event</option>
            <option value="Result">Result</option>
            <option value="Placement">Placement</option>
          </select>
          <select value={limit} onChange={e => setLimit(Number(e.target.value))} className="input-field" style={{ width: 'auto', padding: '0.5rem' }}>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading notifications...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => {
            const isViewed = viewedIds.has(notif.ID);
            return (
              <div 
                key={notif.ID} 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem', 
                  opacity: isViewed ? 0.7 : 1,
                  borderLeft: isViewed ? 'none' : '4px solid #3b82f6',
                  cursor: 'pointer'
                }}
                onClick={() => markAsViewed(notif.ID)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`badge ${notif.Type === 'Placement' ? 'badge-success' : notif.Type === 'Result' ? 'badge-warning' : 'badge-info'}`}>
                    {notif.Type}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{notif.Timestamp}</span>
                </div>
                <p style={{ fontWeight: isViewed ? 'normal' : '600' }}>{notif.Message}</p>
                {!isViewed && <span style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.5rem', display: 'inline-block' }}>● New</span>}
              </div>
            );
          })}
          {notifications.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8' }}>No notifications found.</div>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>Previous</button>
        <span style={{ display: 'flex', alignItems: 'center' }}>Page {page}</span>
        <button className="btn btn-secondary" onClick={() => setPage(p => p + 1)} disabled={notifications.length < limit || loading}>Next</button>
      </div>
    </div>
  );
};
