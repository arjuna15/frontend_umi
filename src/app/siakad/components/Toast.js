"use client";
import { useState, useEffect } from 'react';

// Singleton event emitter for toasts
export const toast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    // If the message contains "Gagal" or "Error", default to error type
    if (type === 'success' && (message.toLowerCase().includes('gagal') || message.toLowerCase().includes('error'))) {
      type = 'error';
    }
    const event = new CustomEvent('siakad_toast', { detail: { id: Date.now(), message, type } });
    window.dispatchEvent(event);
  } else {
    console.log(`[Toast ${type}] ${message}`);
  }
};

toast.success = (msg) => toast(msg, 'success');
toast.error = (msg) => toast(msg, 'error');
toast.info = (msg) => toast(msg, 'info');
toast.confirm = (msg) => {
  return new Promise((resolve) => {
    const event = new CustomEvent('siakad_confirm', { detail: { message: msg, resolve } });
    window.dispatchEvent(event);
  });
};
toast.prompt = (msg, defaultValue = '') => {
  return new Promise((resolve) => {
    const event = new CustomEvent('siakad_prompt', { detail: { message: msg, defaultValue, resolve } });
    window.dispatchEvent(event);
  });
};
toast.form = (title, fields) => {
  return new Promise((resolve) => {
    const event = new CustomEvent('siakad_form', { detail: { title, fields, resolve } });
    window.dispatchEvent(event);
  });
};

if (typeof window !== 'undefined') {
  window.toast = toast;
}

export function ConfirmModal() {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const handleConfirm = (e) => {
      setModal(e.detail);
    };
    window.addEventListener('siakad_confirm', handleConfirm);
    return () => window.removeEventListener('siakad_confirm', handleConfirm);
  }, []);

  if (!modal) return null;
  return (
    <div className="siakad-modal-overlay">
      <div style={{
        position: 'relative',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '40px 32px',
        maxWidth: '450px',
        width: '90%',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'center',
        overflowX: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0) 70%)', borderRadius: '50%', zIndex: 0, flexShrink: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.1)', border: '2px solid rgba(245, 158, 11, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', flexShrink: 0 }}>
            <i className="ph ph-warning-circle" style={{ fontSize: '3.5rem', color: '#f59e0b' }}></i>
          </div>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1.4rem', fontWeight: 'bold' }}>Perhatian!</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>{modal.message}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(false); setModal(null); }}
              style={{ padding: '14px 24px', borderRadius: '12px', border: '2px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', flex: 1, transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.background = 'var(--glass-bg)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(true); setModal(null); }}
              style={{ padding: '14px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', fontWeight: 'bold', cursor: 'pointer', flex: 1, boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Ya, Lanjutkan
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function PromptModal() {
  const [modal, setModal] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handlePrompt = (e) => {
      setModal(e.detail);
      setInputValue(e.detail.defaultValue || '');
    };
    window.addEventListener('siakad_prompt', handlePrompt);
    return () => window.removeEventListener('siakad_prompt', handlePrompt);
  }, []);

  if (!modal) return null;
  return (
    <div className="siakad-modal-overlay">
      <div style={{
        position: 'relative',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '0',
        maxWidth: '500px',
        width: '90%',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left',
        overflowX: 'hidden'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)', padding: '24px 32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', flexShrink: 0 }}></div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <i className="ph ph-note-pencil" style={{ fontSize: '1.6rem', color: 'white' }}></i> {modal.message}
          </h3>
        </div>
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Masukkan input Anda:</label>
            <input 
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  modal.resolve(inputValue);
                  setModal(null);
                }
              }}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '1.05rem', transition: 'all 0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
              onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(null); setModal(null); }}
              style={{ padding: '12px 24px', borderRadius: '10px', border: '2px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.background = 'var(--glass-bg)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(inputValue); setModal(null); }}
              style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormModal() {
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const handleForm = (e) => {
      setModal(e.detail);
      const initialData = {};
      e.detail.fields.forEach(f => { initialData[f.name] = ''; });
      setFormData(initialData);
    };
    window.addEventListener('siakad_form', handleForm);
    return () => window.removeEventListener('siakad_form', handleForm);
  }, []);

  if (!modal) return null;
  return (
    <div className="siakad-modal-overlay">
      <div style={{
        position: 'relative',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '0',
        maxWidth: '550px',
        width: '90%',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left',
        overflowX: 'hidden'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)', padding: '24px 32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', flexShrink: 0 }}></div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <i className="ph ph-pencil-simple-line" style={{ fontSize: '1.6rem', color: 'white' }}></i> {modal.title}
          </h3>
        </div>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            {modal.fields.map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    autoFocus={f.autoFocus}
                    rows="4"
                    value={formData[f.name]}
                    onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '1.05rem', transition: 'all 0.3s', resize: 'vertical', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                    onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)'; }}
                  />
                ) : (
                  <input 
                    autoFocus={f.autoFocus}
                    type="text"
                    value={formData[f.name]}
                    onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '1.05rem', transition: 'all 0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                    onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)'; }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '24px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(null); setModal(null); }}
              style={{ padding: '12px 24px', borderRadius: '10px', border: '2px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.background = 'var(--glass-bg)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(formData); setModal(null); }}
              style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Simpan & Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('siakad_toast', handleToast);
    return () => window.removeEventListener('siakad_toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'var(--glass-bg)' : 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: t.type === 'error' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.5)',
          color: 'var(--color-text)',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          pointerEvents: 'auto',
          minWidth: '300px',
          borderLeft: t.type === 'error' ? '4px solid #ef4444' : '4px solid #10b981'
        }}>
          {t.type === 'error' ? (
            <i className="ph ph-x-circle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
          ) : t.type === 'info' ? (
            <i className="ph ph-info" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
          ) : (
            <i className="ph ph-check-circle" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
          )}
          <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{t.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
