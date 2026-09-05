import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Save, ShieldCheck, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { updateMe, uploadAvatar } from '../services/authService';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const result = await uploadAvatar(file);
        setAvatarUrl(result.avatarUrl);
        if (user) {
          const updated = await updateMe({ avatarUrl: result.avatarUrl });
          updateUser(updated);
        }
        setMessage('Avatar uploaded successfully!');
      } catch (err) {
        console.error('Avatar upload error:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateMe({ fullName, phone });
      updateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header 
        title="Admin Profile Management" 
        subtitle="Manage administrator profile, account credentials, and system settings."
      />

      <div className="page-body fade-in">
        <div style={styles.container} className="profile-container">
          {/* Left Avatar & Summary Card */}
          <div className="calm-card" style={styles.summaryCard}>
            <div style={styles.avatarWrapper}>
              <div style={styles.avatarCircle}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Admin Avatar" style={styles.avatarImg} />
                ) : (
                  user?.fullName?.charAt(0).toUpperCase() || 'A'
                )}
              </div>
              <label style={styles.uploadBtn}>
                <Camera size={16} color="#ffffff" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
            </div>

            <h3 style={styles.adminName}>{user?.fullName || 'System Administrator'}</h3>
            <span style={styles.roleBadge}>
              <ShieldCheck size={14} color="var(--primary)" /> Super Admin
            </span>

            <div style={styles.infoDivider} />

            <div style={styles.infoRow}>
              <span>Account Type:</span> <strong>Master Admin</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Status:</span> <strong style={{ color: 'var(--status-approved-text)' }}>Active & Verified</strong>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="calm-card" style={styles.formCard}>
            <h3 style={styles.formTitle}>Edit Personal Details</h3>

            {message && (
              <div style={styles.successBanner}>
                <CheckCircle size={18} color="var(--status-approved-text)" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} color="var(--outline)" style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="var(--outline)" style={styles.inputIcon} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-surface)' }}
                    value={user?.email || 'shivangmokariya.dev@gmail.com'}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={styles.inputWrapper}>
                  <Phone size={18} color="var(--outline)" style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 320px) 1fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  summaryCard: {
    textAlign: 'center',
    padding: '2rem 1.5rem',
  },
  avatarWrapper: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '1.25rem',
  },
  avatarCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-container)',
    color: 'var(--on-primary-container)',
    fontSize: '2.2rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '4px solid #ffffff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  uploadBtn: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: 'var(--primary)',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  adminName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0 0 0.4rem 0',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(63, 102, 81, 0.1)',
    color: 'var(--primary)',
    padding: '0.35rem 0.875rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  infoDivider: {
    height: '1px',
    backgroundColor: 'var(--border-divider)',
    margin: '1.5rem 0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '0.6rem',
  },
  formCard: {
    padding: '2rem',
  },
  formTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '1.25rem',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--status-approved-bg)',
    color: 'var(--status-approved-text)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
  },
};
