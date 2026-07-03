'use client';

export default function ModalShell({
  title,
  subtitle = 'Manajemen SIAKAD',
  icon = 'ph-pencil-simple-line',
  onClose,
  maxWidth = '600px',
  children,
  footer,
  iconBg = 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
}) {
  return (
    <div className="siakad-modal-overlay">
      <div className="siakad-modal-content" style={{ maxWidth }}>
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: iconBg,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.25)',
              flexShrink: 0
            }}>
              <i className={`ph ${icon}`} style={{ fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', fontWeight: 700 }}>
                {subtitle}
              </p>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text)' }}>
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text)',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Tutup modal"
            type="button"
          >
            <i className="ph ph-x" style={{ fontSize: '1.1rem' }}></i>
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {children}
        </div>

        {footer ? (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '0 28px 28px 28px',
            borderTop: '1px solid var(--color-border)',
            marginTop: '4px',
            paddingTop: '20px',
            flexWrap: 'wrap'
          }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
