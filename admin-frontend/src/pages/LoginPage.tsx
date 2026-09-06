import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Decorative Blob Background Elements */}
      <div style={styles.blobLeft} />
      <div style={styles.blobRight} />

      <div style={styles.card} className="fade-in">
        {/* Header Logo & Title */}
        <div style={styles.headerBox}>
          <div style={styles.logoWrapper}>
            <Building2 size={36} color="var(--primary)" />
          </div>
          <h2 style={styles.title}>Admin Portal</h2>
          <p style={styles.subtitle}>Sign in to manage society access and system operations.</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={styles.errorBanner}>
            <AlertCircle size={18} color="#991B1B" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="var(--outline)" style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={styles.passwordLabelRow}>
              <label className="form-label">Password</label>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="var(--outline)" style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} color="var(--outline)" />
                ) : (
                  <Eye size={18} color="var(--outline)" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={styles.rememberRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div style={styles.footerRow}>
          <span style={styles.footerText}>CALM Society Management System</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-surface)',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blobLeft: {
    position: 'absolute',
    top: '-80px',
    left: '-80px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    backgroundColor: 'rgba(193, 237, 210, 0.45)',
    filter: 'blur(30px)',
  },
  blobRight: {
    position: 'absolute',
    bottom: '-100px',
    right: '-100px',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    backgroundColor: 'rgba(182, 236, 241, 0.4)',
    filter: 'blur(30px)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 12px 36px rgba(51, 58, 61, 0.08)',
    border: '1px solid var(--border-default)',
    position: 'relative',
    zIndex: 10,
  },
  headerBox: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  logoWrapper: {
    width: '68px',
    height: '68px',
    borderRadius: '20px',
    backgroundColor: 'var(--surface-container-low, #f5f4ef)',
    border: '1px solid var(--border-default)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0 0 0.4rem 0',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  hintBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: 'rgba(63, 102, 81, 0.08)',
    border: '1px solid rgba(63, 102, 81, 0.2)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
  },
  hintText: {
    fontSize: '0.8rem',
    color: 'var(--primary)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    zIndex: 2,
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 2,
  },
  rememberRow: {
    margin: '0.5rem 0 1.25rem 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: 'var(--primary)',
    width: '16px',
    height: '16px',
  },
  footerRow: {
    marginTop: '1.75rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
};
