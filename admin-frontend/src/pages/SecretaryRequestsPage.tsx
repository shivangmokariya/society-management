import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Phone,
  Calendar
} from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { ApproveModal } from '../components/ApproveModal';
import { RejectModal } from '../components/RejectModal';
import { Pagination } from '../components/Pagination';
import { getSecretaryRegistrations, approveSecretaryRequest, rejectSecretaryRequest } from '../services/adminService';
import { SecretaryRegistration } from '../types';

export const SecretaryRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<SecretaryRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReq, setSelectedReq] = useState<SecretaryRegistration | null>(null);
  const [rejectReq, setRejectReq] = useState<SecretaryRegistration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await getSecretaryRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((req) => {
    const matchesTab = activeTab === 'All' || req.status === activeTab;
    const matchesSearch = 
      req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.societyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApproveConfirm = async (id: string, customPassword?: string) => {
    await approveSecretaryRequest(id, customPassword);
    fetchRegistrations();
  };

  const handleRejectConfirm = async (id: string) => {
    await rejectSecretaryRequest(id);
    fetchRegistrations();
  };

  const counts = {
    All: registrations.length,
    Pending: registrations.filter(r => r.status === 'Pending').length,
    Approved: registrations.filter(r => r.status === 'Approved').length,
    Rejected: registrations.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div>
      <Header 
        title="Secretary Access Requests" 
        subtitle="Review, approve, or decline society secretary registration applications."
        pendingCount={counts.Pending}
      />

      <div className="page-body fade-in">
        {/* Controls Bar */}
        <div style={styles.controlsBar} className="controls-bar">
          {/* Status Tabs */}
          <div style={styles.tabsContainer} className="tabs-container">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="tab-btn"
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === tab ? styles.activeTabBtn : {}),
                }}
              >
                <span>{tab}</span>
                <span style={{
                  ...styles.tabBadge,
                  ...(activeTab === tab ? styles.activeTabBadge : {}),
                }}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={styles.searchWrapper} className="search-wrapper">
            <Search size={18} color="var(--outline)" />
            <input
              type="text"
              placeholder="Search by name, society, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Requests Cards List */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading registration requests...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="calm-card" style={styles.emptyCard}>
            <UserCheck size={48} color="var(--outline)" />
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>No Requests Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No secretary registration requests matched your active filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.cardsGrid} className="requests-cards-grid">
              {paginatedRegistrations.map((req) => (
              <div key={req._id} className="calm-card" style={styles.reqCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.societyIconBox}>
                    <Building2 size={24} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.societyName}>{req.societyName}</h3>
                    <div style={styles.applicantName}>Applicant: <strong>{req.fullName}</strong></div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <Mail size={16} color="var(--outline)" />
                    <span>{req.email}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <Phone size={16} color="var(--outline)" />
                    <span>{req.phone}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <Calendar size={16} color="var(--outline)" />
                    <span>Requested on {new Date(req.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>

                {req.status === 'Pending' ? (
                  <div style={styles.cardFooter}>
                    <button
                      className="btn-success"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setSelectedReq(req)}
                    >
                      <CheckCircle size={16} /> Approve Access
                    </button>
                    <button
                      className="btn-danger"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setRejectReq(req)}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                ) : req.status === 'Approved' ? (
                  <div style={styles.approvedFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#284E3B', fontWeight: '600' }}>
                      <CheckCircle size={15} /> Access Granted
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => navigate(`/secretaries/${req._id}`)}
                    >
                      Open Dashboard
                    </button>
                  </div>
                ) : (
                  <div style={styles.rejectedFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#ba1a1a', fontWeight: '600' }}>
                      <XCircle size={15} /> Request Declined
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => setSelectedReq(req)}
                    >
                      Re-Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRegistrations.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </>
        )}
      </div>

      <ApproveModal
        registration={selectedReq}
        onClose={() => setSelectedReq(null)}
        onConfirm={handleApproveConfirm}
      />

      <RejectModal
        registration={rejectReq}
        onClose={() => setRejectReq(null)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  controlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  tabsContainer: {
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    padding: '0.35rem',
    borderRadius: '14px',
    border: '1px solid var(--border-default)',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    transition: 'all 0.2s ease',
  },
  activeTabBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-muted)',
    padding: '0.1rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    borderRadius: '14px',
    padding: '0.6rem 1rem',
    minWidth: '280px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.9rem',
    width: '100%',
    color: 'var(--text-main)',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem',
    alignItems: 'start',
  },
  reqCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    marginBottom: '1rem',
  },
  societyIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: 'rgba(63, 102, 81, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  societyName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0 0 0.2rem 0',
  },
  applicantName: {
    fontSize: '0.825rem',
    color: 'var(--text-muted)',
  },
  cardDetails: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
    padding: '0.875rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid var(--border-default)',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  cardFooter: {
    display: 'flex',
    gap: '0.75rem',
  },
  approvedFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(40, 78, 59, 0.06)',
    border: '1px solid rgba(40, 78, 59, 0.15)',
    borderRadius: '12px',
    padding: '0.5rem 0.75rem',
  },
  rejectedFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(186, 26, 26, 0.06)',
    border: '1px solid rgba(186, 26, 26, 0.15)',
    borderRadius: '12px',
    padding: '0.5rem 0.75rem',
  },
  emptyCard: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
