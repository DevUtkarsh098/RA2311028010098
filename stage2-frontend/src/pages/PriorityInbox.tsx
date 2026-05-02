import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../api/notifications';
import { type Notification, PriorityInbox as PriorityInboxAlgorithm } from '../priority_inbox';
import { Log } from '../utils/logger';

export const PriorityInbox: React.FC = () => {
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [nLimit, setNLimit] = useState(10);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('viewed_notifications');
    if (stored) {
      setViewedIds(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    loadPriorityNotifications();
  }, [nLimit, viewedIds]); // Reload if viewedIds change to remove them from priority inbox

  const loadPriorityNotifications = async () => {
    setLoading(true);
    await Log('frontend', 'info', 'page', `Fetching top ${nLimit} priority unread notifications`);
    try {
      // In a real app, this might be a specific backend endpoint or stream.
      // Here, we fetch a large batch to simulate a stream and apply our algorithm.
      const res = await fetchNotifications({ limit: 100, page: 1 });
      const notifications = res.notifications || [];
      
      const inbox = new PriorityInboxAlgorithm(nLimit);
      
      // Only process unread notifications
      let unreadCount = 0;
      for (const notif of notifications) {
        if (!viewedIds.has(notif.ID)) {
          inbox.addNotification(notif);
          unreadCount++;
        }
      }
      
      setPriorityNotifications(inbox.getTopNotifications());
      await Log('frontend', 'info', 'page', `Processed ${unreadCount} unread notifications to find top ${nLimit}`);
    } catch (error: any) {
      await Log('frontend', 'error', 'page', `Failed to load priority notifications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id: string) => {
    const newSet = new Set(viewedIds);
    newSet.add(id);
    setViewedIds(newSet);
    localStorage.setItem('viewed_notifications', JSON.stringify(Array.from(newSet)));
    Log('frontend', 'debug', 'component', `Marked priority notification ${id} as viewed`);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Priority Inbox <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>(Unread)</span></h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Top N:</label>
          <select value={nLimit} onChange={e => setNLimit(Number(e.target.value))} className="input-field" style={{ width: 'auto', padding: '0.5rem' }}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading priority inbox...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {priorityNotifications.map((notif, index) => (
            <div 
              key={notif.ID} 
              className="glass-card" 
              style={{ 
                padding: '1.5rem',
                borderLeft: '4px solid #f59e0b', // Amber for priority
                cursor: 'pointer',
                background: 'rgba(245, 158, 11, 0.05)'
              }}
              onClick={() => markAsViewed(notif.ID)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>#{index + 1}</span>
                  <span className={`badge ${notif.Type === 'Placement' ? 'badge-success' : notif.Type === 'Result' ? 'badge-warning' : 'badge-info'}`}>
                    {notif.Type}
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{notif.Timestamp}</span>
              </div>
              <p style={{ fontWeight: '600' }}>{notif.Message}</p>
            </div>
          ))}
          {priorityNotifications.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
              No unread priority notifications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
