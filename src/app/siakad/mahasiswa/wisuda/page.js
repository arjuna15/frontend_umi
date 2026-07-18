'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import SkeletonLoader from '../../components/SkeletonLoader';
import CustomSelect from '../../components/CustomSelect';

export default function WisudaMahasiswaPage() {
  const router = useRouter();
  const [yudisiums, setYudisiums] = useState([]);
  const [wisudas, setWisudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showYudModal, setShowYudModal] = useState(false);
  const [showWisModal, setShowWisModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [yudForm, setYudForm] = useState({ thesis_title: '', gpa: '' });
  const [wisForm, setWisForm] = useState({ yudisium_registration_id: '', toga_size: 'L' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${apiUrl}/siakad/graduation/yudisium`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } }),
        fetch(`${apiUrl}/siakad/graduation/wisuda`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } })
      ]);
      const d1 = await r1.json(); const d2 = await r2.json();
      setYudisiums(d1.data || []); setWisudas(d2.data || []);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const submitYudisium = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/graduation/yudisium`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify(yudForm) });
      if (res.ok) { setMessage({ text: 'Pengajuan yudisium berhasil!', type: 'success' }); setShowYudModal(false); fetchData(); }
      else { setMessage({ text: 'Gagal mengajukan yudisium.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const submitWisuda = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/graduation/wisuda`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify(wisForm) });
      if (res.ok) { setMessage({ text: 'Pendaftaran wisuda berhasil!', type: 'success' }); setShowWisModal(false); fetchData(); }
      else { setMessage({ text: 'Gagal mendaftar wisuda.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const statusBadge = (s) => {
    const colors = { pending: '#f59e0b', verified: '#10b981', confirmed: '#10b981', rejected: '#ef4444' };
    const c = colors[s] || colors.pending;
    const labels = { pending: 'Menunggu', verified: 'Terverifikasi', confirmed: 'Dikonfirmasi', rejected: 'Ditolak' };
    return (
      <span style={{ 
        padding: '4px 12px', 
        borderRadius: '50px', 
        fontSize: '0.72rem', 
        fontWeight: '800', 
        color: c, 
        background: 'var(--glass-bg)', 
        border: 'var(--glass-border)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        {labels[s] || s}
      </span>
    );
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Yudisium & Wisuda...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  const verifiedYuds = (Array.isArray(yudisiums) ? yudisiums : []).filter(y => y.status === 'verified' && !(Array.isArray(wisudas) ? wisudas : []).some(w => w.yudisium_registration_id === y.id));

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Yudisium & Wisuda</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola kelayakan berkas yudisium kelulusan Anda dan daftarkan diri untuk seremoni Wisuda.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowYudModal(true)} className="siakad-btn-primary" style={{ padding: '12px 24px' }}><i className="ph ph-graduation-cap"></i> Ajukan Yudisium</button>
            {verifiedYuds.length > 0 && <button onClick={() => { setWisForm({ ...wisForm, yudisium_registration_id: verifiedYuds[0].id }); setShowWisModal(true); }} className="siakad-btn-primary" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}><i className="ph ph-confetti"></i> Daftar Wisuda</button>}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div className="siakad-card stagger-2" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Riwayat Yudisium</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
            <thead><tr>{['Judul Skripsi', 'IPK', 'Bebas Keuangan', 'Bebas Perpus', 'Status'].map(h => <th key={h} style={{ padding: '8px 20px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {yudisiums.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada pengajuan yudisium.</td></tr> :
              yudisiums.map(y => (
                <tr key={y.id}>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderLeft: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '16px 0 0 16px',
                    boxShadow: 'inset 3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    fontWeight: 'bold',
                    color: 'var(--color-text)',
                    maxWidth: '300px'
                  }}>{y.thesis_title}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    color: 'var(--color-text)', 
                    fontWeight: '700' 
                  }}>{y.gpa}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                  }}>{y.is_free_billing ? <i className="ph ph-check-circle" style={{color:'#10b981',fontSize:'1.2rem'}}></i> : <i className="ph ph-x-circle" style={{color:'#ef4444',fontSize:'1.2rem'}}></i>}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                  }}>{y.is_free_library ? <i className="ph ph-check-circle" style={{color:'#10b981',fontSize:'1.2rem'}}></i> : <i className="ph ph-x-circle" style={{color:'#ef4444',fontSize:'1.2rem'}}></i>}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderRight: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '0 16px 16px 0',
                    boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                  }}>{statusBadge(y.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {wisudas.length > 0 && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Pendaftaran Wisuda</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
              <thead><tr>{['Ukuran Toga', 'No. Kursi', 'Status'].map(h => <th key={h} style={{ padding: '8px 20px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>{wisudas.map(w => (
                <tr key={w.id}>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderLeft: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '16px 0 0 16px',
                    boxShadow: 'inset 3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    fontWeight: 'bold',
                    color: 'var(--color-text)'
                  }}>{w.toga_size}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    color: 'var(--color-text)' 
                  }}>{w.seat_number || '-'}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderRight: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '0 16px 16px 0',
                    boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                  }}>{statusBadge(w.status)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {showYudModal && (
        <ModalShell title="Pengajuan Yudisium" subtitle="Wisuda & Yudisium" icon="ph-graduation-cap" onClose={() => setShowYudModal(false)}
          footer={<><button onClick={() => setShowYudModal(false)} style={{ padding: '10px 22px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold', borderRadius: '50px', boxShadow: 'var(--glass-shadow)' }}>Batal</button>
            <button onClick={submitYudisium} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Ajukan'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Judul Skripsi</label>
            <textarea className="siakad-input" value={yudForm.thesis_title} onChange={e => setYudForm({...yudForm, thesis_title: e.target.value})} placeholder="Masukkan judul skripsi..." rows={3} style={{ resize: 'vertical' }} /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>IPK Terakhir</label>
            <input className="siakad-input" type="number" step="0.01" min="0" max="4" value={yudForm.gpa} onChange={e => setYudForm({...yudForm, gpa: e.target.value})} placeholder="Contoh: 3.75" /></div>
        </ModalShell>
      )}      {showWisModal && (
        <ModalShell title="Pendaftaran Wisuda" subtitle="Wisuda & Yudisium" icon="ph-confetti" onClose={() => setShowWisModal(false)}
          footer={<><button onClick={() => setShowWisModal(false)} style={{ padding: '10px 22px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold', borderRadius: '50px', boxShadow: 'var(--glass-shadow)' }}>Batal</button>
            <button onClick={submitWisuda} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Daftar Wisuda'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Ukuran Toga</label>
            <CustomSelect
              value={wisForm.toga_size}
              onChange={val => setWisForm({...wisForm, toga_size: val})}
              options={['S','M','L','XL','XXL'].map(s => ({ value: s, label: s }))}
            /></div>
        </ModalShell>
      )}
      </div>
    </div>
  );
}
