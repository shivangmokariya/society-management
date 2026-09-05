import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import { SecretaryRegistration } from '../types';

interface RejectModalProps {
  registration: SecretaryRegistration | null;
  onClose: () => void;
  onConfirm: (registrationId: string) => Promise<void>;
}

export const RejectModal: React.FC<RejectModalProps> = ({ registration, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  if (!registration) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(registration._id);
      onClose();
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="fade-in">
        <div style={styles.modalHeader}>
          <div style={styles.headerTitleGroup}>
            <AlertTriangle size={24} color="#991B1B" />
            <h3 style={styles.title}>Reject Secretary Access</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            You are declining the secretary registration request for <strong>{registration.fullName}</strong> at <strong>{registration.societyName}</strong>.
          </p>
          <div style={styles.detailRow}>
            <span>Email:</span> <strong>{registration.email}</strong>
          </div>
          <div style={styles.detailRow}>
            <span>Phone:</span> <strong>{registration.phone}</strong>
          </div>
        </div>

        <p style={styles.warningNote}>
          This action will change the application status to <strong>Rejected</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.actionRow}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-danger" disabled={loading} style={{ padding: '0.75rem 1.25rem' }}>
              <XCircle size={18} /> {loading ? 'Rejecting...' : 'Confirm Rejection'}
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
    backgroundColor: '#FEE2E2',
    border: '1px solid #FCA5A5',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  infoText: {
    fontSize: '0.9rem',
    color: '#991B1B',
    marginBottom: '0.75rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#7F1D1D',
    marginTop: '0.25rem',
  },
  warningNote: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
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
