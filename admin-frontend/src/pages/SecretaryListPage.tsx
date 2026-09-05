import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Building2, Mail, Phone, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';
import { getSecretaryRegistrations } from '../services/adminService';
import { SecretaryRegistration } from '../types';

export const SecretaryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [secretaries, setSecretaries] = useState<SecretaryRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchSecretaries = async () => {
    setLoading(true);
    try {
      const data = await getSecretaryRegistrations('Approved');
      setSecretaries(data);
    } catch (err) {
      console.error('Error fetching secretaries directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const filtered = secretaries.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.societyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedSecretaries = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Header 
        title="Secretaries Directory" 
        subtitle="Manage active society secretaries and associated residential societies."
      />

      <div className="page-body fade-in">
        {/* Search & Stats Header */}
        <div style={styles.topRow} className="top-row">
          <div style={styles.searchWrapper} className="search-wrapper">
            <Search size={18} color="var(--outline)" />
            <input
              type="text"
              placeholder="Search secretary name or society..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.statsPill}>
            <Users size={18} color="var(--primary)" />
            <span>Active Secretaries: <strong>{secretaries.length}</strong></span>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading secretaries directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="calm-card" style={styles.emptyCard}>
            <Users size={48} color="var(--outline)" />
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>No Approved Secretaries Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Secretaries will appear here once their access request is approved by the admin.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.grid} className="directory-grid">
              {paginatedSecretaries.map((sec) => (
              <div
                key={sec._id}
                className="calm-card"
                style={{ ...styles.secCard, cursor: 'pointer' }}
                onClick={() => navigate(`/secretaries/${sec._id}`)}
              >
                <div style={styles.cardTop}>
                  <div style={styles.avatarCircle}>
                    {sec.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.secName}>{sec.fullName}</h3>
                    <div style={styles.roleTag}>Society Secretary</div>
                  </div>
                  <StatusBadge status="Approved" />
                </div>

                <div style={styles.societyBox}>
                  <Building2 size={18} color="var(--primary)" />
                  <div>
                    <div style={styles.societyLabel}>Assigned Society</div>
                    <div style={styles.societyTitle}>{sec.societyName}</div>
                  </div>
                </div>

                <div style={styles.contactList}>
                  <div style={styles.contactItem}>
                    <Mail size={15} color="var(--outline)" />
                    <span>{sec.email}</span>
                  </div>
                  <div style={styles.contactItem}>
                    <Phone size={15} color="var(--outline)" />
                    <span>{sec.phone}</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.accessActiveTag}>
                    <ShieldCheck size={14} color="var(--status-approved-text)" />
                    <span>Active Access</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/secretaries/${sec._id}`);
                    }}
                  >
                    Open Dashboard <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
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
  );
};

const styles: Record<string, React.CSSProperties> = {
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    borderRadius: '14px',
    padding: '0.6rem 1rem',
    minWidth: '320px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.9rem',
    width: '100%',
    color: 'var(--text-main)',
  },
  statsPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    borderRadius: '14px',
    padding: '0.6rem 1.25rem',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  secCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    marginBottom: '1.2rem',
  },
  avatarCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.2rem',
  },
  secName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
  },
  roleTag: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  societyBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(63, 102, 81, 0.08)',
    border: '1px solid rgba(63, 102, 81, 0.15)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  },
  societyLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  societyTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  cardFooter: {
    borderTop: '1px solid var(--border-divider)',
    paddingTop: '0.875rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessActiveTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--status-approved-text)',
  },
  emptyCard: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
