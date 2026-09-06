import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Users,
  UserPlus,
  AlertCircle,
  Droplet,
  Settings,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Search,
  Truck,
  FileText,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { Header } from '../components/Header';
import {
  getSecretaryRegistrations,
  getSocietyDetails,
  getSocietyDashboardData,
  getSocietyResidents,
  addOwner,
  addTenant,
  deleteResident,
  getSocietyComplaints,
  createComplaint,
  updateComplaintStatus,
  getSocietyWaterTanks,
  getSocietyWaterTankers,
  recordWaterTanker,
  updateSocietyProfile,
} from '../services/adminService';
import { SecretaryRegistration, Society, Resident, Complaint, WaterTanker } from '../types';

export const SecretaryDetailDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [secretary, setSecretary] = useState<SecretaryRegistration | null>(null);
  const [society, setSociety] = useState<Society | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'residents' | 'complaints' | 'water' | 'settings'>('overview');

  // Residents State
  const [residents, setResidents] = useState<Resident[]>([]);
  const [residentFilter, setResidentFilter] = useState<'All' | 'Owners' | 'Tenants'>('All');
  const [residentSearch, setResidentSearch] = useState('');
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);

  // Add Owner Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerFlat, setOwnerFlat] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Add Tenant Form State
  const [tenantName, setTenantName] = useState('');
  const [tenantFlat, setTenantFlat] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');

  // Complaints State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Plumbing');
  const [complaintFlat, setComplaintFlat] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Water Operations State
  const [waterTanksInfo, setWaterTanksInfo] = useState<any>(null);
  const [waterTankers, setWaterTankers] = useState<WaterTanker[]>([]);
  const [showTankerModal, setShowTankerModal] = useState(false);
  const [tankerSupplier, setTankerSupplier] = useState('');
  const [tankerCapacity, setTankerCapacity] = useState('');
  const [tankerDate, setTankerDate] = useState(new Date().toISOString().split('T')[0]);
  const [tankerNotes, setTankerNotes] = useState('');

  // Settings State
  const [editSocietyName, setEditSocietyName] = useState('');
  const [editSecretaryName, setEditSecretaryName] = useState('');
  const [editMaintenanceFee, setEditMaintenanceFee] = useState<number>(2500);
  const [editDueDate, setEditDueDate] = useState('5th of every month');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Secretary Application Info
      const regs = await getSecretaryRegistrations();
      const matchedSec = regs.find((r) => r._id === id);
      if (matchedSec) {
        setSecretary(matchedSec);
        setEditSocietyName(matchedSec.societyName);
        setEditSecretaryName(matchedSec.fullName);
      }

      const socId = matchedSec ? matchedSec.societyName : id;

      // 2. Fetch Society & Dashboard Data
      const socData = await getSocietyDetails(socId);
      setSociety(socData);
      if (socData) {
        setEditSocietyName(socData.name);
        if (socData.secretaryFullName) setEditSecretaryName(socData.secretaryFullName);
        if (socData.maintenanceAmount) setEditMaintenanceFee(socData.maintenanceAmount);
        if (socData.maintenanceDueDate) setEditDueDate(socData.maintenanceDueDate);
      }

      const dbData = await getSocietyDashboardData(socData?._id || socId);
      setDashboardStats(dbData);

      // 3. Fetch Residents
      const resList = await getSocietyResidents(socData?._id || socId);
      setResidents(resList);

      // 4. Fetch Complaints
      const compList = await getSocietyComplaints(socData?._id || socId);
      setComplaints(compList);

      // 5. Fetch Water Operations
      const tanks = await getSocietyWaterTanks(socData?._id || socId);
      setWaterTanksInfo(tanks);

      const tankersLog = await getSocietyWaterTankers(socData?._id || socId);
      setWaterTankers(tankersLog);
    } catch (err) {
      console.error('Error loading secretary details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Handlers for Adding Owner & Tenant
  const handleAddOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerFlat || !ownerPhone) return;
    try {
      await addOwner({
        fullName: ownerName,
        flatNumber: ownerFlat,
        phone: ownerPhone,
        email: ownerEmail,
        societyId: society?._id,
      });
      setShowAddOwnerModal(false);
      setOwnerName('');
      setOwnerFlat('');
      setOwnerPhone('');
      setOwnerEmail('');
      loadData();
    } catch (err) {
      console.error('Error adding owner:', err);
    }
  };

  const handleAddTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantFlat || !tenantPhone) return;
    try {
      await addTenant({
        fullName: tenantName,
        flatAssignment: tenantFlat,
        phone: tenantPhone,
        societyId: society?._id,
      });
      setShowAddTenantModal(false);
      setTenantName('');
      setTenantFlat('');
      setTenantPhone('');
      loadData();
    } catch (err) {
      console.error('Error adding tenant:', err);
    }
  };

  const handleDeleteResident = async (resId: string) => {
    if (!window.confirm('Are you sure you want to remove this resident entry?')) return;
    try {
      await deleteResident(resId);
      loadData();
    } catch (err) {
      console.error('Error deleting resident:', err);
    }
  };

  // Handler for Log Complaint
  const handleCreateComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle || !complaintFlat) return;
    try {
      await createComplaint({
        title: complaintTitle,
        category: complaintCategory,
        flat: complaintFlat,
        description: complaintDesc,
        societyId: society?._id,
      });
      setShowComplaintModal(false);
      setComplaintTitle('');
      setComplaintFlat('');
      setComplaintDesc('');
      loadData();
    } catch (err) {
      console.error('Error creating complaint:', err);
    }
  };

  const handleStatusChange = async (compId: string, status: string) => {
    try {
      await updateComplaintStatus(compId, status);
      loadData();
    } catch (err) {
      console.error('Error updating complaint status:', err);
    }
  };

  // Handler for Record Tanker
  const handleRecordTankerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tankerSupplier || !tankerCapacity) return;
    try {
      await recordWaterTanker({
        supplier: tankerSupplier,
        capacity: tankerCapacity,
        arrivalDate: tankerDate,
        notes: tankerNotes,
        societyId: society?._id,
      });
      setShowTankerModal(false);
      setTankerSupplier('');
      setTankerNotes('');
      loadData();
    } catch (err) {
      console.error('Error recording tanker:', err);
    }
  };

  // Handler for Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!society) return;
    try {
      await updateSocietyProfile(society._id, {
        name: editSocietyName,
        secretaryFullName: editSecretaryName,
        maintenanceAmount: Number(editMaintenanceFee),
        maintenanceDueDate: editDueDate,
      });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
      loadData();
    } catch (err) {
      console.error('Error updating society profile:', err);
    }
  };

  const filteredResidents = residents.filter((r) => {
    const matchesFilter =
      residentFilter === 'All' ||
      (residentFilter === 'Owners' && r.isSelfOwner) ||
      (residentFilter === 'Tenants' && !r.isSelfOwner);
    const matchesSearch =
      r.residentName.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.flat.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.phone.includes(residentSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <Header
        title={secretary?.societyName || society?.name || 'Society Portal'}
        subtitle="Manage residents, complaints, water tankers, and society configurations on behalf of secretary."
      />

      <div className="page-body fade-in">
        {/* Back Navigation Bar */}
        <div style={styles.topBackBar}>
          <button style={styles.backBtn} onClick={() => navigate('/secretaries')} className="btn-secondary">
            <ArrowLeft size={18} /> Back to Directory
          </button>

          <div style={styles.onBehalfBanner}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>
              Admin Mode: Managing <strong>{secretary?.societyName || society?.name || 'Society'}</strong> on behalf of <strong>{secretary?.fullName || society?.secretaryFullName || 'Secretary'}</strong>
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading society dashboard details...
          </div>
        ) : (
          <>
            {/* Header Info Card */}
            <div className="calm-card" style={styles.headerCard}>
              <div style={styles.headerLeft}>
                <div style={styles.societyIconBox}>
                  <Building2 size={32} color="var(--primary)" />
                </div>
                <div>
                  <h2 style={styles.societyTitle}>{secretary?.societyName || society?.name}</h2>
                  <div style={styles.secDetailsRow}>
                    <span>Secretary: <strong>{secretary?.fullName || society?.secretaryFullName}</strong></span>
                    <span>•</span>
                    <Mail size={14} color="var(--outline)" />
                    <span>{secretary?.email || 'secretary@calm.com'}</span>
                    <span>•</span>
                    <Phone size={14} color="var(--outline)" />
                    <span>{secretary?.phone || '+91 9876543210'}</span>
                  </div>
                </div>
              </div>

              <div style={styles.headerRight}>
                <span style={styles.activeTag}>
                  <CheckCircle size={15} /> Active System Access
                </span>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setActiveTab('residents');
                    setShowAddOwnerModal(true);
                  }}
                >
                  <UserPlus size={18} /> Register Resident
                </button>
              </div>
            </div>

            {/* Dashboard Tabs Bar */}
            <div style={styles.tabsRow} className="tabs-container">
              {[
                { key: 'overview', label: 'Overview', icon: LayoutDashboard, count: undefined },
                { key: 'residents', label: 'Residents & Members', icon: Users, count: residents.length },
                { key: 'complaints', label: 'Complaints & Tickets', icon: AlertCircle, count: complaints.filter(c => c.status !== 'Resolved').length },
                { key: 'water', label: 'Water Tankers', icon: Droplet, count: waterTankers.length },
                { key: 'settings', label: 'Society Config', icon: Settings, count: undefined },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className="tab-btn"
                    style={{
                      ...styles.tabBtn,
                      ...(activeTab === tab.key ? styles.activeTabBtn : {}),
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span style={{
                        ...styles.tabBadge,
                        ...(activeTab === tab.key ? styles.activeTabBadge : {}),
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Metrics Grid */}
                <div style={styles.metricsGrid}>
                  <div className="calm-card" style={styles.metricCard}>
                    <div style={styles.metricLabel}>Current Society Balance</div>
                    <div style={styles.metricVal}>
                      {dashboardStats?.dashboardStats?.currentBalance || '₹12,45,000'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-approved-text)', marginTop: '0.4rem', fontWeight: '600' }}>
                      +2.4% vs last month
                    </div>
                  </div>

                  <div className="calm-card" style={styles.metricCard}>
                    <div style={styles.metricLabel}>Total Registered Residents</div>
                    <div style={styles.metricVal}>{residents.length || 24}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {residents.filter(r => r.isSelfOwner).length} Owners • {residents.filter(r => !r.isSelfOwner).length} Tenants
                    </div>
                  </div>

                  <div className="calm-card" style={styles.metricCard}>
                    <div style={styles.metricLabel}>Active Complaints</div>
                    <div style={{ ...styles.metricVal, color: complaints.filter(c => c.status !== 'Resolved').length > 0 ? '#ba1a1a' : 'var(--text-main)' }}>
                      {complaints.filter(c => c.status !== 'Resolved').length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Pending Resolution
                    </div>
                  </div>

                  <div className="calm-card" style={styles.metricCard}>
                    <div style={styles.metricLabel}>Water Tank Cleaning</div>
                    <div style={styles.metricVal}>
                      {waterTanksInfo?.waterNextDue || '15 Sep'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Next Due Service
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="calm-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Quick Actions (On-Behalf of Secretary)</h3>
                  <div style={styles.actionsGrid}>
                    <div style={styles.actionCard} onClick={() => { setActiveTab('residents'); setShowAddOwnerModal(true); }}>
                      <UserPlus size={24} color="var(--primary)" />
                      <div>
                        <div style={styles.actionTitle}>Add Property Owner</div>
                        <div style={styles.actionDesc}>Register a new flat owner in the society directory.</div>
                      </div>
                    </div>

                    <div style={styles.actionCard} onClick={() => { setActiveTab('residents'); setShowAddTenantModal(true); }}>
                      <Users size={24} color="var(--primary)" />
                      <div>
                        <div style={styles.actionTitle}>Add Tenant Resident</div>
                        <div style={styles.actionDesc}>Register a tenant with assigned flat number & contact.</div>
                      </div>
                    </div>

                    <div style={styles.actionCard} onClick={() => { setActiveTab('complaints'); setShowComplaintModal(true); }}>
                      <AlertCircle size={24} color="#935500" />
                      <div>
                        <div style={styles.actionTitle}>Log Society Complaint</div>
                        <div style={styles.actionDesc}>File a maintenance issue or grievance for resolution.</div>
                      </div>
                    </div>

                    <div style={styles.actionCard} onClick={() => { setActiveTab('water'); setShowTankerModal(true); }}>
                      <Truck size={24} color="var(--secondary)" />
                      <div>
                        <div style={styles.actionTitle}>Record Water Tanker</div>
                        <div style={styles.actionDesc}>Log incoming water tanker delivery details & receipt.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RESIDENTS */}
            {activeTab === 'residents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={styles.residentsHeader}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['All', 'Owners', 'Tenants'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setResidentFilter(filter)}
                        style={{
                          ...styles.filterBtn,
                          ...(residentFilter === filter ? styles.activeFilterBtn : {}),
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={styles.searchBox}>
                      <Search size={16} color="var(--outline)" />
                      <input
                        type="text"
                        placeholder="Search flat or name..."
                        value={residentSearch}
                        onChange={(e) => setResidentSearch(e.target.value)}
                        style={styles.searchInput}
                      />
                    </div>

                    <button className="btn-primary" onClick={() => setShowAddOwnerModal(true)}>
                      <Plus size={16} /> Add Owner
                    </button>
                    <button className="btn-secondary" onClick={() => setShowAddTenantModal(true)}>
                      <Plus size={16} /> Add Tenant
                    </button>
                  </div>
                </div>

                {filteredResidents.length === 0 ? (
                  <div className="calm-card" style={styles.emptyBox}>
                    <Users size={40} color="var(--outline)" />
                    <h4 style={{ marginTop: '0.8rem', marginBottom: '0.2rem' }}>No Residents Found</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Register an owner or tenant to populate the society directory.
                    </p>
                  </div>
                ) : (
                  <div style={styles.residentGrid}>
                    {filteredResidents.map((r) => (
                      <div key={r._id} className="calm-card" style={styles.residentCard}>
                        <div style={styles.resCardHeader}>
                          <div style={styles.flatPill}>{r.flat}</div>
                          <span style={{
                            ...styles.resBadge,
                            backgroundColor: r.isSelfOwner ? 'rgba(63, 102, 81, 0.1)' : 'rgba(38, 100, 142, 0.1)',
                            color: r.isSelfOwner ? 'var(--primary)' : '#26648e',
                          }}>
                            {r.isSelfOwner ? 'Owner' : 'Tenant'}
                          </span>
                        </div>

                        <div style={{ margin: '0.75rem 0' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{r.residentName}</h4>
                          {!r.isSelfOwner && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner: {r.ownerName}</div>
                          )}
                        </div>

                        <div style={styles.resDetailRow}>
                          <Phone size={14} color="var(--outline)" />
                          <span>{r.phone}</span>
                        </div>
                        {r.email && (
                          <div style={styles.resDetailRow}>
                            <Mail size={14} color="var(--outline)" />
                            <span>{r.email}</span>
                          </div>
                        )}

                        <div style={styles.resFooter}>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteResident(r._id)}
                            title="Remove Resident Entry"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Society Complaints & Issues</h3>
                  <button className="btn-primary" onClick={() => setShowComplaintModal(true)}>
                    <Plus size={18} /> Log New Complaint
                  </button>
                </div>

                {complaints.length === 0 ? (
                  <div className="calm-card" style={styles.emptyBox}>
                    <AlertCircle size={40} color="var(--outline)" />
                    <h4 style={{ marginTop: '0.8rem', marginBottom: '0.2rem' }}>No Active Complaints</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      No grievances or maintenance complaints currently recorded for this society.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {complaints.map((c) => (
                      <div key={c._id} className="calm-card" style={styles.complaintRow}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                            <span style={styles.flatTag}>{c.flat}</span>
                            <span style={styles.categoryBadge}>{c.category}</span>
                            <h4 style={{ margin: 0, fontSize: '0.975rem', color: 'var(--text-main)' }}>{c.title}</h4>
                          </div>
                          {c.description && <p style={styles.complaintDesc}>{c.description}</p>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              backgroundColor: c.status === 'Resolved' ? '#e6f4ea' : c.status === 'In Progress' ? '#fef7e0' : '#fce8e6',
                              color: c.status === 'Resolved' ? '#137333' : c.status === 'In Progress' ? '#b06000' : '#c5221f',
                            }}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: WATER TANKERS */}
            {activeTab === 'water' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Water Supply & Tanker Management</h3>
                  <button className="btn-primary" onClick={() => setShowTankerModal(true)}>
                    <Truck size={18} /> Record Water Tanker
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div className="calm-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Droplet size={24} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Main Water Tank</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Operational (85% Capacity)</div>
                      </div>
                    </div>
                  </div>

                  <div className="calm-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Calendar size={24} color="var(--secondary)" />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last Cleaned Date</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{waterTanksInfo?.waterLastCleaned || '12 Aug'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calm-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Recent Water Tanker Deliveries Log</h4>
                  {waterTankers.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No tanker deliveries recorded yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Supplier</th>
                            <th style={styles.th}>Capacity</th>
                            <th style={styles.th}>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waterTankers.map((t) => (
                            <tr key={t._id}>
                              <td style={styles.td}>{t.arrivalDate}</td>
                              <td style={styles.td}><strong>{t.supplier}</strong></td>
                              <td style={styles.td}>{t.capacity}</td>
                              <td style={styles.td}>{t.notes || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="calm-card" style={{ maxWidth: '600px', padding: '1.75rem' }}>
                <h3 style={{ margin: '0 0 1.25rem 0' }}>Configure Society Details</h3>

                {settingsSuccess && (
                  <div style={styles.successBanner}>
                    <CheckCircle size={18} /> Society profile updated successfully!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Society Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editSocietyName}
                      onChange={(e) => setEditSocietyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secretary Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editSecretaryName}
                      onChange={(e) => setEditSecretaryName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Maintenance Amount (₹ per flat)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editMaintenanceFee}
                      onChange={(e) => setEditMaintenanceFee(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maintenance Due Date Schedule</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                    Save Society Profile Settings
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL: Add Owner */}
      {showAddOwnerModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Register New Property Owner</h3>
              <button style={styles.closeBtn} onClick={() => setShowAddOwnerModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOwnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Owner Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajesh Kumar"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Flat Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. A-302"
                  value={ownerFlat}
                  onChange={(e) => setOwnerFlat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. rajesh@gmail.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddOwnerModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Tenant */}
      {showAddTenantModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Register New Tenant</h3>
              <button style={styles.closeBtn} onClick={() => setShowAddTenantModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTenantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tenant Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Amit Sharma"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Flat Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B-104"
                  value={tenantFlat}
                  onChange={(e) => setTenantFlat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9123456789"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  required
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddTenantModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Log Complaint */}
      {showComplaintModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Log Society Complaint</h3>
              <button style={styles.closeBtn} onClick={() => setShowComplaintModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Complaint Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Elevator B Noise"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Elevator">Elevator</option>
                  <option value="Security">Security</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Flat / Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block A Lobby or A-201"
                  value={complaintFlat}
                  onChange={(e) => setComplaintFlat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Describe issue..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setShowComplaintModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Record Tanker */}
      {showTankerModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="fade-in">
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Record Water Tanker Delivery</h3>
              <button style={styles.closeBtn} onClick={() => setShowTankerModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordTankerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Express Water Supplies"
                  value={tankerSupplier}
                  onChange={(e) => setTankerSupplier(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 10,000 Litres"
                  value={tankerCapacity}
                  onChange={(e) => setTankerCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={tankerDate}
                  onChange={(e) => setTankerDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Receipt #98412"
                  value={tankerNotes}
                  onChange={(e) => setTankerNotes(e.target.value)}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setShowTankerModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Record Tanker
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
  topBackBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  backBtn: {
    padding: '0.45rem 0.875rem',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  onBehalfBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(63, 102, 81, 0.08)',
    border: '1px solid rgba(63, 102, 81, 0.2)',
    borderRadius: '12px',
    padding: '0.45rem 0.875rem',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  headerCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  societyIconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    backgroundColor: 'rgba(63, 102, 81, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  societyTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0 0 0.3rem 0',
  },
  secDetailsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  activeTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.825rem',
    fontWeight: '600',
    color: 'var(--status-approved-text)',
    backgroundColor: 'rgba(40, 78, 59, 0.08)',
    padding: '0.4rem 0.75rem',
    borderRadius: '10px',
  },
  tabsRow: {
    display: 'flex',
    gap: '0.4rem',
    backgroundColor: '#ffffff',
    padding: '0.35rem',
    borderRadius: '16px',
    border: '1px solid var(--border-default)',
    marginBottom: '1.5rem',
    overflowX: 'auto',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1rem',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    flex: 1,
    minWidth: 'max-content',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  activeTabBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(63, 102, 81, 0.2)',
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
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  metricCard: {
    padding: '1.25rem',
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginTop: '0.25rem',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    padding: '1rem',
    borderRadius: '14px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  actionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  actionDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.2rem',
  },
  residentsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '0.45rem 0.875rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
  },
  activeFilterBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderColor: 'var(--primary)',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    borderRadius: '12px',
    padding: '0.45rem 0.875rem',
    minWidth: '220px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.85rem',
    width: '100%',
  },
  residentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  residentCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem',
  },
  resCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flatPill: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    backgroundColor: 'var(--bg-surface)',
    padding: '0.25rem 0.6rem',
    borderRadius: '8px',
    border: '1px solid var(--border-default)',
  },
  resBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.2rem 0.55rem',
    borderRadius: '10px',
  },
  resDetailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.825rem',
    color: 'var(--text-muted)',
    marginTop: '0.3rem',
  },
  resFooter: {
    borderTop: '1px solid var(--border-divider)',
    marginTop: '0.875rem',
    paddingTop: '0.75rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    fontSize: '0.78rem',
    color: '#ba1a1a',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  complaintRow: {
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  flatTag: {
    fontWeight: '700',
    fontSize: '0.85rem',
    backgroundColor: 'var(--bg-surface)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
  },
  categoryBadge: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '700',
    backgroundColor: 'rgba(63, 102, 81, 0.1)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
  },
  complaintDesc: {
    margin: '0.4rem 0 0 0',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  statusSelect: {
    padding: '0.4rem 0.75rem',
    borderRadius: '10px',
    border: '1px solid var(--border-default)',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
  },
  emptyBox: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-divider)',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  td: {
    padding: '0.875rem 1rem',
    borderBottom: '1px solid var(--border-divider)',
    color: 'var(--text-main)',
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
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(40, 78, 59, 0.1)',
    color: 'var(--status-approved-text)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
  },
};
