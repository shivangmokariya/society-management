import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Bell, 
  User, 
  LogOut, 
  ShieldAlert,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    close();
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Secretary Requests', path: '/requests', icon: UserCheck },
    { label: 'Secretaries Directory', path: '/secretaries', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Admin Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={close}
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={styles.brandBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={styles.logoWrapper}>
              <Building2 size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={styles.brandTitle}>CALM Admin</h2>
              <span style={styles.brandSubtitle}>System Portal</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={close} title="Close menu">
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={styles.navMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={close}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div style={styles.sidebarFooter}>
          <div 
            style={{ ...styles.adminMiniCard, cursor: 'pointer' }}
            onClick={() => {
              close();
              navigate('/profile');
            }}
            title="View Profile"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Admin Avatar"
                style={styles.avatarImg}
              />
            ) : (
              <div style={styles.avatarCircle}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <div style={styles.adminInfo}>
              <div style={styles.adminName}>{user?.fullName || 'System Admin'}</div>
              <div style={styles.adminRole}>Administrator</div>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '270px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid var(--border-default)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brandBox: {
    padding: '1.5rem 1.5rem 1.2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    borderBottom: '1px solid var(--border-divider)',
  },
  logoWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(63, 102, 81, 0.25)',
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  navMenu: {
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.925rem',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'rgba(63, 102, 81, 0.1)',
    color: 'var(--primary)',
  },
  sidebarFooter: {
    padding: '1.25rem 1rem',
    borderTop: '1px solid var(--border-divider)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  adminMiniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.8rem',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
  },
  avatarImg: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid var(--primary)',
    flexShrink: 0,
  },
  avatarCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-container)',
    color: 'var(--on-primary-container)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.95rem',
    flexShrink: 0,
  },
  adminInfo: {
    overflow: 'hidden',
  },
  adminName: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  adminRole: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s ease',
  },
};
