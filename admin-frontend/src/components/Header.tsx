import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, ShieldCheck, Check, ArrowRight, UserCheck, ShieldAlert, Info, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { AdminNotification } from '../types';
import { fetchDynamicNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';

interface HeaderProps {
  title: string;
  subtitle?: string;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, pendingCount }) => {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetchDynamicNotifications().then((data) => {
      if (isMounted) {
        setNotifications(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const displayBadgeCount = pendingCount !== undefined ? pendingCount : unreadNotifs.length;

  const handleNotifClick = (n: AdminNotification) => {
    markNotificationAsRead(n.id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    setShowPopover(false);
    if (n.route) {
      navigate(n.route);
    } else {
      navigate('/requests');
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ids = notifications.map((n) => n.id);
    markAllNotificationsAsRead(ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="mobile-menu-btn" onClick={toggle} title="Open menu">
          <Menu size={22} color="var(--text-main)" />
        </button>
        <div>
          <h1 style={styles.title} className="header-title-text">{title}</h1>
          {subtitle && <p style={styles.subtitle} className="header-subtitle-text">{subtitle}</p>}
        </div>
      </div>

      <div style={styles.rightGroup} className="header-right-group">
        {/* Search Bar */}
        <div style={styles.searchBox} className="header-search-box">
          <Search size={18} color="var(--outline)" />
          <input
            type="text"
            placeholder="Search societies, secretaries..."
            style={styles.searchInput}
            className="header-search-input"
          />
        </div>

        {/* Notifications Icon Button & Popover */}
        <div style={{ position: 'relative' }} ref={popoverRef}>
          <button
            style={styles.iconBtn}
            onClick={() => setShowPopover(!showPopover)}
            title="Notifications"
          >
            <Bell size={20} color="var(--text-muted)" />
            {displayBadgeCount > 0 && (
              <span style={styles.badge}>{displayBadgeCount}</span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showPopover && (
            <div style={styles.popover} className="popover fade-in">
              <div style={styles.popoverHeader}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Notifications ({unreadNotifs.length} unread)
                </div>
                {unreadNotifs.length > 0 && (
                  <button style={styles.markReadBtn} onClick={handleMarkAllRead}>
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div style={styles.popoverList}>
                {notifications.length === 0 ? (
                  <div style={styles.emptyPopover}>No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      style={{
                        ...styles.popoverItem,
                        backgroundColor: n.read ? '#ffffff' : 'rgba(63, 102, 81, 0.06)',
                      }}
                      onClick={() => handleNotifClick(n)}
                    >
                      <div style={styles.popoverIconBox}>
                        {n.type === 'access_request' ? (
                          <UserCheck size={16} color="var(--primary)" />
                        ) : n.type === 'alert' ? (
                          <ShieldAlert size={16} color="#935500" />
                        ) : (
                          <Info size={16} color="var(--secondary)" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.popoverTitle}>{n.title}</div>
                        <div style={styles.popoverMessage}>{n.message}</div>
                        <div style={styles.popoverTime}>{n.timestamp}</div>
                      </div>
                      {!n.read && <span style={styles.dot} />}
                    </div>
                  ))
                )}
              </div>

              <div
                style={styles.popoverFooter}
                onClick={() => {
                  setShowPopover(false);
                  navigate('/notifications');
                }}
              >
                View all notifications <ArrowRight size={14} />
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge Pill */}
        <div style={styles.adminPill} onClick={() => navigate('/profile')} className="admin-pill" title={user?.fullName || 'Admin Profile'}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profile Avatar"
              style={styles.adminAvatarImg}
            />
          ) : (
            <div style={styles.adminAvatarCircle}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          <span style={styles.adminPillText} className="admin-pill-text">{user?.fullName || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: '75px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-default)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: '12px',
    padding: '0.5rem 0.875rem',
    width: '260px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    width: '100%',
  },
  iconBtn: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ba1a1a',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '700',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popover: {
    position: 'absolute',
    top: '50px',
    right: 0,
    width: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
    border: '1px solid var(--border-default)',
    zIndex: 100,
    overflow: 'hidden',
  },
  popoverHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1rem',
    borderBottom: '1px solid var(--border-divider)',
    backgroundColor: 'var(--bg-surface)',
  },
  markReadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  popoverList: {
    maxHeight: '320px',
    overflowY: 'auto',
  },
  emptyPopover: {
    padding: '1.5rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  popoverItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    borderBottom: '1px solid var(--border-divider)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  popoverIconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  popoverTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    lineHeight: 1.2,
  },
  popoverMessage: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  popoverTime: {
    fontSize: '0.7rem',
    color: 'var(--outline)',
    marginTop: '4px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    flexShrink: 0,
    marginTop: '6px',
  },
  popoverFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.75rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--primary)',
    borderTop: '1px solid var(--border-divider)',
    cursor: 'pointer',
    backgroundColor: 'var(--bg-surface)',
  },
  adminPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: 'rgba(63, 102, 81, 0.08)',
    border: '1px solid rgba(63, 102, 81, 0.2)',
    padding: '0.35rem 0.875rem 0.35rem 0.45rem',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  adminAvatarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid var(--primary)',
  },
  adminAvatarCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminPillText: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
};

