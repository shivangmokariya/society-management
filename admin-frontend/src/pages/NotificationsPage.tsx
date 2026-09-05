import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Send, Info, UserCheck, ShieldAlert, Plus, X, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AdminNotification } from '../types';
import {
  fetchDynamicNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addBroadcastNotification,
} from '../services/notificationService';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchDynamicNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    const ids = notifications.map((n) => n.id);
    markAllNotificationsAsRead(ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (n: AdminNotification) => {
    markNotificationAsRead(n.id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    if (n.route) {
      navigate(n.route);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const newNotif = addBroadcastNotification(broadcastTitle, broadcastMessage);
    setNotifications((prev) => [newNotif, ...prev]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Header 
        title="Notifications & Alerts" 
        subtitle="Manage system alerts, secretary requests, and broadcast notices."
        pendingCount={unreadCount}
      />

      <div className="page-body fade-in">
        {/* Actions Bar */}
        <div style={styles.actionsBar}>
          <div style={styles.unreadTag}>
            <Bell size={18} color="var(--primary)" />
            <span>Unread Notifications: <strong>{unreadCount}</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handleMarkAllAsRead}>
              <CheckCheck size={18} /> Mark All as Read
            </button>
            <button className="btn-primary" onClick={() => setShowBroadcastModal(true)}>
              <Plus size={18} /> Broadcast Announcement
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="calm-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No notifications available.
            </div>
          ) : (
            <>
              {paginatedNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    ...styles.notifItem,
                    ...(n.read ? styles.notifRead : styles.notifUnread),
                  }}
                  onClick={() => handleNotificationClick(n)}
                  title={n.route ? `Click to view target screen (${n.route})` : undefined}
                >
                  <div style={styles.iconBox}>
                    {n.type === 'access_request' ? (
                      <UserCheck size={20} color="var(--primary)" />
                    ) : n.type === 'alert' ? (
                      <ShieldAlert size={20} color="#935500" />
                    ) : (
                      <Info size={20} color="var(--secondary)" />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={styles.notifTitleRow}>
                      <h4 style={styles.notifTitle}>{n.title}</h4>
                      <span style={styles.timestamp}>{n.timestamp}</span>
                    </div>
                    <p style={styles.notifMessage}>{n.message}</p>
                  </div>

                  <div style={styles.statusDotWrapper}>
                    {!n.read && <span style={styles.blueDot} />}
                    {n.route && <ArrowRight size={16} color="var(--text-muted)" style={{ marginLeft: '0.5rem' }} />}
                  </div>
                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={notifications.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(newSize) => {
                  setItemsPerPage(newSize);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Broadcast Announcement</h3>
              <button style={styles.closeBtn} onClick={() => setShowBroadcastModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Scheduled System Maintenance"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Content</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Type notice message to broadcast..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  required
                />
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowBroadcastModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={16} /> Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  unreadTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    padding: '0.6rem 1.25rem',
    borderRadius: '14px',
    fontSize: '0.875rem',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '16px',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  notifUnread: {
    backgroundColor: 'rgba(63, 102, 81, 0.05)',
    border: '1px solid rgba(63, 102, 81, 0.15)',
  },
  notifRead: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-divider)',
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.25rem',
  },
  notifTitle: {
    fontSize: '0.975rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
  },
  timestamp: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  notifMessage: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  statusDotWrapper: {
    width: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  blueDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(27, 28, 25, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  closeBtn: {
    padding: '0.4rem',
    borderRadius: '8px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
  },
};
