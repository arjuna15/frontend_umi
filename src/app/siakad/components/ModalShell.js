'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from './portalRoot';

export default function ModalShell({
  title,
  onClose,
  maxWidth = '600px',
  children,
  footer
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const portalRoot = getPortalRoot();
  if (!mounted || !portalRoot) return null;

  return createPortal(
    <div className="siakad-modal-overlay" onClick={onClose}>
      <div 
        className="siakad-modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth, padding: '32px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Simple Header without icons or dividers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
            {title}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'all 0.2s ease',
                opacity: 0.6,
                outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
              aria-label="Tutup modal"
              type="button"
            >
              <i className="ph ph-x" style={{ fontSize: '1rem' }}></i>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer Area without top border dividers */}
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    portalRoot
  );
}
