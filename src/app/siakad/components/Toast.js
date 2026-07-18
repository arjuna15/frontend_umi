"use client";
import { useState, useEffect } from 'react';

// Singleton event emitter for toasts
export const toast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    // If the message contains "Gagal" or "Error", default to error type
    if (type === 'success' && (message.toLowerCase().includes('gagal') || message.toLowerCase().includes('error'))) {
      type = 'error';
    }
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const event = new CustomEvent('siakad_toast', { detail: { id: uniqueId, message, type } });
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
        background: 'var(--glass-bg)',
        border: 'var(--glass-border)',
        borderRadius: '24px',
        padding: '32px 28px',
        maxWidth: '450px',
        width: 'min(100%, 450px)',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: 'var(--glass-shadow)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'center',
        overflowX: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', flexShrink: 0 }}>
            <i className="ph ph-warning-circle" style={{ fontSize: '3rem', color: '#f59e0b' }}></i>
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)', fontSize: '1.35rem', fontWeight: 'bold' }}>Perhatian!</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '1rem', lineHeight: '1.6' }}>{modal.message}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(false); setModal(null); }}
              style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', flex: '1 1 160px', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(true); setModal(null); }}
              className="siakad-btn-primary"
              style={{ padding: '12px 24px', borderRadius: '50px', flex: '1 1 160px' }}
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
        background: 'var(--glass-bg)',
        border: 'var(--glass-border)',
        borderRadius: '24px',
        padding: '0',
        maxWidth: '500px',
        width: 'min(100%, 500px)',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: 'var(--glass-shadow)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left',
        overflowX: 'hidden'
      }}>
        <div style={{ background: 'var(--liquid-bg)', borderBottom: '1px solid var(--color-border)', padding: '24px 32px', position: 'relative' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
            <i className="ph ph-note-pencil" style={{ fontSize: '1.5rem', color: 'var(--apple-blue)' }}></i> {modal.message}
          </h3>
        </div>
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Masukkan input Anda:</label>
            <input 
              autoFocus
              type="text"
              className="siakad-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  modal.resolve(inputValue);
                  setModal(null);
                }
              }}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(null); setModal(null); }}
              style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(inputValue); setModal(null); }}
              className="siakad-btn-primary"
              style={{ padding: '12px 32px', borderRadius: '50px' }}
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
        background: 'var(--glass-bg)',
        border: 'var(--glass-border)',
        borderRadius: '24px',
        padding: '0',
        maxWidth: '550px',
        width: 'min(100%, 550px)',
        maxHeight: 'calc(100dvh - 48px)',
        overflowY: 'auto',
        boxShadow: 'var(--glass-shadow)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left',
        overflowX: 'hidden'
      }}>
        <div style={{ background: 'var(--liquid-bg)', borderBottom: '1px solid var(--color-border)', padding: '24px 32px', position: 'relative' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
            <i className="ph ph-pencil-simple-line" style={{ fontSize: '1.5rem', color: 'var(--apple-blue)' }}></i> {modal.title}
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
                    className="siakad-input"
                    value={formData[f.name]}
                    onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                ) : (
                  <input 
                    autoFocus={f.autoFocus}
                    type="text"
                    className="siakad-input"
                    value={formData[f.name]}
                    onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '24px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { modal.resolve(null); setModal(null); }}
              style={{ padding: '12px 24px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}
            >
              Batal
            </button>
            <button 
              onClick={() => { modal.resolve(formData); setModal(null); }}
              className="siakad-btn-primary"
              style={{ padding: '12px 32px', borderRadius: '50px' }}
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
