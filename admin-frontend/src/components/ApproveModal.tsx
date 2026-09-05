import React, { useState } from 'react';
import { X, CheckCircle, Key } from 'lucide-react';
import { SecretaryRegistration } from '../types';

interface ApproveModalProps {
  registration: SecretaryRegistration | null;
  onClose: () => void;
  onConfirm: (registrationId: string, customPassword?: string) => Promise<void>;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({ registration, onClose, onConfirm }) => {
  const [customPassword, setCustomPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!registration) return null;

  const firstName = registration.fullName.trim().split(' ')[0];
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const phoneDigits = registration.phone.replace(/\D/g, '');
  const phoneSuffix = phoneDigits.slice(-4) || '1234';
  const defaultPassword = `${capitalizedFirstName}@${phoneSuffix}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(registration._id, customPassword.trim() || undefined);
      onClose();
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="fade-in">
        <div style={styles.modalHeader}>
          <div style={styles.headerTitleGroup}>
            <CheckCircle size={24} color="var(--primary)" />
            <h3 style={styles.title}>Approve Secretary Access</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            You are approving <strong>{registration.fullName}</strong> as the Secretary for <strong>{registration.societyName}</strong>.
          </p>
          <div style={styles.detailRow}>
            <span>Email:</span> <strong>{registration.email}</strong>
          </div>
          <div style={styles.detailRow}>
            <span>Phone:</span> <strong>{registration.phone}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Custom Password (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder={`Default: ${defaultPassword}`}
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
              />
              <Key size={18} color="var(--outline)" style={styles.keyIcon} />
            </div>
            <span style={styles.helpText}>
              If left blank, auto-generated password will be: <strong>{defaultPassword}</strong>
            </span>
          </div>

          <div style={styles.actionRow}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
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
  modal: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    border: '1px solid var(--border-default)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
  },
  closeBtn: {
    padding: '0.4rem',
    borderRadius: '8px',
  },
  infoBox: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  infoText: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    marginBottom: '0.75rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
  },
  keyIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  helpText: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '0.35rem',
    display: 'block',
  },
  actionRow: {
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
