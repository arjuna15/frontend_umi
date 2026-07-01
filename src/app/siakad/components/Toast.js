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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'center'
      }}>
        <i className="ph ph-warning-circle" style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '16px' }}></i>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)', fontSize: '1.2rem' }}>Konfirmasi</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.5' }}>{modal.message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => { modal.resolve(false); setModal(null); }}
            style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}
          >
            Batal
          </button>
          <button 
            onClick={() => { modal.resolve(true); setModal(null); }}
            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer', flex: 1, boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}
          >
            Ya, Lanjutkan
          </button>
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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)', fontSize: '1.2rem' }}>{modal.message}</h3>
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
          style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #d1d5db', outline: 'none', background: 'white', color: 'black', marginBottom: '24px', fontSize: '1rem', transition: 'border 0.3s' }}
          onFocus={(e) => e.target.style.border = '2px solid #4f46e5'}
          onBlur={(e) => e.target.style.border = '2px solid #d1d5db'}
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => { modal.resolve(null); setModal(null); }}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Batal
          </button>
          <button 
            onClick={() => { modal.resolve(inputValue); setModal(null); }}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}
          >
            OK
          </button>
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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 10002,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        textAlign: 'left'
      }}>
        <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-text)', fontSize: '1.4rem' }}>{modal.title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {modal.fields.map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 'bold' }}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  autoFocus={f.autoFocus}
                  rows="4"
                  value={formData[f.name]}
                  onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #d1d5db', outline: 'none', background: 'white', color: 'black', fontSize: '1rem', transition: 'border 0.3s', resize: 'vertical' }}
                  onFocus={(e) => e.target.style.border = '2px solid #4f46e5'}
                  onBlur={(e) => e.target.style.border = '2px solid #d1d5db'}
                />
              ) : (
                <input 
                  autoFocus={f.autoFocus}
                  type="text"
                  value={formData[f.name]}
                  onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #d1d5db', outline: 'none', background: 'white', color: 'black', fontSize: '1rem', transition: 'border 0.3s' }}
                  onFocus={(e) => e.target.style.border = '2px solid #4f46e5'}
                  onBlur={(e) => e.target.style.border = '2px solid #d1d5db'}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => { modal.resolve(null); setModal(null); }}
            style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Batal
          </button>
          <button 
            onClick={() => { modal.resolve(formData); setModal(null); }}
            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}
          >
            Simpan & Kirim
          </button>
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
