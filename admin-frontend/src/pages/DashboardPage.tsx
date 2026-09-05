import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Users, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { ApproveModal } from '../components/ApproveModal';
import { RejectModal } from '../components/RejectModal';
import { getSecretaryRegistrations, approveSecretaryRequest, rejectSecretaryRequest } from '../services/adminService';
import { SecretaryRegistration } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<SecretaryRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<SecretaryRegistration | null>(null);
  const [rejectReq, setRejectReq] = useState<SecretaryRegistration | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getSecretaryRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingRequests = registrations.filter((r) => r.status === 'Pending');
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;

  const handleApproveConfirm = async (id: string, customPassword?: string) => {
    await approveSecretaryRequest(id, customPassword);
    fetchDashboardData();
  };

  const handleRejectConfirm = async (id: string) => {
    await rejectSecretaryRequest(id);
    fetchDashboardData();
  };

  return (
    <div>
      <Header 
        title="Admin Overview" 
        subtitle="System dashboard & secretary request management" 
        pendingCount={pendingRequests.length}
      />

      <div className="page-body fade-in">
        {/* Metric Cards Grid */}
        <div style={styles.metricsGrid} className="metrics-grid">
          <div className="calm-card metric-card" style={styles.metricCard}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(255, 244, 229, 1)', color: '#935500' }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={styles.metricLabel}>Pending Requests</span>
              <h3 style={styles.metricValue}>{pendingRequests.length}</h3>
              <span style={styles.metricSub}>Awaiting admin action</span>
            </div>
          </div>

          <div className="calm-card metric-card" style={styles.metricCard}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(232, 243, 237, 1)', color: '#284E3B' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <span style={styles.metricLabel}>Approved Secretaries</span>
              <h3 style={styles.metricValue}>{approvedCount}</h3>
              <span style={styles.metricSub}>Active society admins</span>
            </div>
          </div>

          <div className="calm-card metric-card" style={styles.metricCard}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(182, 236, 241, 0.5)', color: '#31666b' }}>
              <Building size={24} />
            </div>
            <div>
              <span style={styles.metricLabel}>Total Registrations</span>
              <h3 style={styles.metricValue}>{registrations.length}</h3>
              <span style={styles.metricSub}>Total applications filed</span>
            </div>
          </div>

          <div className="calm-card metric-card" style={styles.metricCard}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(63, 102, 81, 0.1)', color: '#3f6651' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <span style={styles.metricLabel}>System Health</span>
              <h3 style={styles.metricValue}>100% Operational</h3>
              <span style={styles.metricSub}>Backend connected</span>
            </div>
          </div>
        </div>

        {/* Action Banners & Quick Links */}
        <div style={styles.sectionHeader}>
          <h2>Secretary Access Requests</h2>
          <button className="btn-secondary" onClick={() => navigate('/requests')}>
            View All ({registrations.length}) <ArrowRight size={16} />
          </button>
        </div>

        {/* Pending Requests Table / Card List */}
        <div className="calm-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading requests...
            </div>
          ) : pendingRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <CheckCircle size={40} color="var(--primary)" />
              <h3 style={{ margin: '0.5rem 0 0.2rem 0' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                There are no pending secretary access requests requiring review.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Secretary Name</th>
                    <th style={styles.th}>Society Name</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Requested On</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.slice(0, 5).map((req) => (
                    <tr key={req._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong style={{ color: 'var(--text-main)' }}>{req.fullName}</strong>
                      </td>
                      <td style={styles.td}>{req.societyName}</td>
                      <td style={styles.td}>
                        <div>{req.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.phone}</div>
                      </td>
                      <td style={styles.td}>
                        {new Date(req.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={styles.td}>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn-success"
                            onClick={() => setSelectedReq(req)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => setRejectReq(req)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <ApproveModal
        registration={selectedReq}
        onClose={() => setSelectedReq(null)}
        onConfirm={handleApproveConfirm}
      />

      {/* Reject Modal */}
      <RejectModal
        registration={rejectReq}
        onClose={() => setRejectReq(null)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  metricCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.5rem',
  },
  iconWrapper: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    display: 'block',
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0.2rem 0',
  },
  metricSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  th: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border-default)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.825rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid var(--border-divider)',
  },
  td: {
    padding: '1rem 1.25rem',
    color: 'var(--text-muted)',
    verticalAlign: 'middle',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
