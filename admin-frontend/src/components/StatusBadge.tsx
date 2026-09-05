import React from 'react';

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bg = 'var(--status-pending-bg)';
  let color = 'var(--status-pending-text)';

  if (status === 'Approved') {
    bg = 'var(--status-approved-bg)';
    color = 'var(--status-approved-text)';
  } else if (status === 'Rejected') {
    bg = 'var(--status-rejected-bg)';
    color = 'var(--status-rejected-text)';
  }

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: '0.35rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.78rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        letterSpacing: '0.3px',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {status}
    </span>
  );
};
