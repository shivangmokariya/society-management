import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 6,
  onItemsPerPageChange,
  pageSizeOptions = [6, 12, 24, 50],
}) => {
  if (totalItems === 0 || (totalPages <= 1 && !onItemsPerPageChange)) return null;

  const startItem = totalItems ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  return (
    <div style={styles.paginationWrapper} className="pagination-container">
      <div style={styles.leftInfoGroup}>
        {totalItems !== undefined && (
          <div style={styles.infoText}>
            Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{totalItems}</strong> items
          </div>
        )}

        {onItemsPerPageChange && (
          <div style={styles.perPageSelector}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              style={styles.selectInput}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={styles.controlsGroup}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...styles.navBtn,
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
            className="btn-secondary"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <div style={styles.pageNumbers}>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === p ? styles.activePageBtn : {}),
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              ...styles.navBtn,
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
            className="btn-secondary"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  paginationWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--border-divider)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  leftInfoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
  },
  perPageSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  selectInput: {
    padding: '0.35rem 0.6rem',
    borderRadius: '8px',
    border: '1px solid var(--border-default)',
    backgroundColor: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    cursor: 'pointer',
    outline: 'none',
  },
  controlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  navBtn: {
    padding: '0.45rem 0.875rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  pageNumbers: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  pageBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-default)',
    transition: 'all 0.15s ease',
  },
  activePageBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderColor: 'var(--primary)',
  },
};
