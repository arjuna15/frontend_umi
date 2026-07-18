"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MBKMStudentPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [applying, setApplying] = useState(false);
  const [activeTab, setActiveTab] = useState('programs');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`${apiUrl}/siakad/mbkm/programs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const all = data.data || data.programs || [];
      setPrograms(all.filter(p => p.status === 'active'));
      setMySubmissions(data.my_submissions || data.submissions || []);
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data program MBKM.', type: 'error' });
    } finally { setLoading(false); }
  };

  const applyProgram = async (programId) => {
    setApplying(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/mbkm/programs/${programId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Pendaftaran berhasil dikirim!', type: 'success' });
      setShowApplyModal(null);
      fetchData();
    } catch (e) {
      setMessage({ text: 'Gagal mendaftar program.', type: 'error' });
    } finally { setApplying(false); }
  };

  const statusBadge = (status) => {
    const colors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', active: '#3b82f6' };
    const labels = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak', active: 'Aktif' };
    const c = colors[status] || '#94a3b8';
    return (
      <span style={{ 
        background: 'var(--glass-bg)', 
        color: c, 
        padding: '4px 12px', 
        borderRadius: '50px', 
        fontSize: '0.72rem', 
        fontWeight: '800',
        border: 'var(--glass-border)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        {labels[status] || status}
      </span>
    );
  };

  useEffect(() => { fetchData(); }, [router]);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat MBKM...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Program MBKM</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Temukan dan daftar program Merdeka Belajar Kampus Merdeka.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
      {message.text && (
        <div style={{ padding: '14px 20px', borderRadius: '50px', marginBottom: '24px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.2rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'inline-flex', gap: '4px', marginBottom: '24px', background: 'var(--liquid-bg)', padding: '6px', borderRadius: '50px', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
        {[{ key: 'programs', label: 'Program Tersedia', icon: 'ph ph-books' }, { key: 'submissions', label: 'Riwayat Pendaftaran', icon: 'ph ph-clock-counter-clockwise' }].map(tab => (
          <button 
            key={tab.key} 
            id={`tab-${tab.key}`} 
            onClick={() => setActiveTab(tab.key)} 
            style={{ 
              padding: '10px 20px', 
              borderRadius: '30px', 
              border: activeTab === tab.key ? 'var(--glass-border)' : 'none', 
              background: activeTab === tab.key ? 'var(--glass-bg)' : 'transparent', 
              color: activeTab === tab.key ? '#3b82f6' : 'var(--color-muted)', 
              boxShadow: activeTab === tab.key ? 'var(--glass-shadow)' : 'none',
              cursor: 'pointer', 
              fontWeight: '800', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            <i className={tab.icon}></i> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'programs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {programs.length === 0 ? (
            <div className="siakad-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <i className="ph ph-graduation-cap" style={{ fontSize: '3rem', color: 'var(--color-muted)', marginBottom: '12px', display: 'block', opacity: 0.4 }}></i>
              <p style={{ color: 'var(--color-muted)', margin: 0 }}>Belum ada program MBKM yang tersedia saat ini.</p>
            </div>
          ) : programs.map(p => (
            <div key={p.id} className="siakad-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--liquid-bg)', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', fontSize: '1.3rem' }}>
                  <i className="ph ph-graduation-cap"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text)' }}>{p.title}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>{p.period || '-'}</p>
                </div>
              </div>
              {p.description && <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: '0 0 16px 0', lineHeight: '1.5' }}>{p.description}</p>}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                  <i className="ph ph-book-open"></i> {p.sks || '-'} SKS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                  <i className="ph ph-users"></i> {p.submissions_count || 0} pendaftar
                </div>
              </div>
              <button id={`btn-apply-${p.id}`} onClick={() => setShowApplyModal(p)} className="siakad-btn-primary" style={{ width: '100%', marginTop: 'auto', padding: '12px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="ph ph-paper-plane-tilt"></i> Daftar Program
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Riwayat Pendaftaran MBKM</h2>
          {mySubmissions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '30px' }}>Belum ada riwayat pendaftaran.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
                <thead>
                  <tr>
                    {['Program', 'Periode', 'SKS', 'Tanggal Daftar', 'Status'].map(h => (
                      <th key={h} style={{ padding: '8px 20px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map(s => (
                    <tr key={s.id}>
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
                      }}>{s.program_title || s.program?.title || '-'}</td>
                      <td style={{ 
                        padding: '14px 20px', 
                        background: 'var(--liquid-bg)',
                        borderTop: 'var(--inset-border)',
                        borderBottom: 'var(--inset-border)',
                        boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                        color: 'var(--color-muted)' 
                      }}>{s.period || s.program?.period || '-'}</td>
                      <td style={{ 
                        padding: '14px 20px', 
                        background: 'var(--liquid-bg)',
                        borderTop: 'var(--inset-border)',
                        borderBottom: 'var(--inset-border)',
                        boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                        color: 'var(--color-text)',
                        fontWeight: '600'
                      }}>{s.sks || s.program?.sks || '-'} SKS</td>
                      <td style={{ 
                        padding: '14px 20px', 
                        background: 'var(--liquid-bg)',
                        borderTop: 'var(--inset-border)',
                        borderBottom: 'var(--inset-border)',
                        boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                        color: 'var(--color-muted)' 
                      }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID') : '-'}</td>
                      <td style={{ 
                        padding: '14px 20px', 
                        background: 'var(--liquid-bg)',
                        borderRight: 'var(--inset-border)',
                        borderTop: 'var(--inset-border)',
                        borderBottom: 'var(--inset-border)',
                        borderRadius: '0 16px 16px 0',
                        boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                      }}>{statusBadge(s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowApplyModal(null)}>
          <div className="siakad-card" onClick={e => e.stopPropagation()} style={{ padding: '32px', width: '100%', maxWidth: '440px', borderRadius: '20px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                <i className="ph ph-graduation-cap" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Konfirmasi Pendaftaran</h2>
              <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}>Apakah Anda yakin ingin mendaftar program berikut?</p>
            </div>
            <div style={{ background: 'var(--liquid-bg)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)' }}>{showApplyModal.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{showApplyModal.sks} SKS • {showApplyModal.period}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button id="btn-cancel-apply" onClick={() => setShowApplyModal(null)} style={{ padding: '10px 20px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold', boxShadow: 'var(--glass-shadow)' }}>Batal</button>
              <button id="btn-confirm-apply" onClick={() => applyProgram(showApplyModal.id)} disabled={applying} className="siakad-btn-primary" style={{ padding: '10px 24px', borderRadius: '50px' }}>
                {applying ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
