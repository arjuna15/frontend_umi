'use client';
import { useState, useEffect } from 'react';
import ModalShell from '../../components/ModalShell';
import { useRouter } from 'next/navigation';

export default function KaprodiKrs() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [history, setHistory] = useState([]);
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      if (!token) {
        router.push('/siakad/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

      const [dashRes, krsRes, availRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/siakad/krs/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/siakad/krs/available`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (dashRes.ok && krsRes.ok) {
        const dashData = await dashRes.json();
        const krsData = await krsRes.json();
        const availData = availRes.ok ? await availRes.json() : [];
        
        setData(dashData);
        setAvailableCourses(availData);
        
        const allKrs = Array.isArray(krsData) ? krsData : [];
        setSubmissions(allKrs.filter(k => String(k.status).toLowerCase() === 'pending'));
        setHistory(allKrs.filter(k => String(k.status).toLowerCase() !== 'pending'));
      } else {
        router.push('/siakad/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveKrs = async (id) => {
    if (!await window.toast.confirm('Setujui KRS ini?')) return;
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/krs/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        window.toast('KRS berhasil disetujui!');
        fetchData(); // reload
      } else {
        window.toast('Gagal menyetujui KRS');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  const openRejectModal = (id) => {
    setSelectedRejectId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!await window.toast.confirm('Tolak pengajuan KRS ini dengan alasan tersebut?')) return;
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/krs/reject/${selectedRejectId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        window.toast('KRS berhasil ditolak!');
        setIsRejectModalOpen(false);
        fetchData(); // reload
      } else {
        window.toast('Gagal menolak KRS');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat tabel KRS...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Persetujuan KRS Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Tinjau dan setujui Kartu Rencana Studi mahasiswa.</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setActiveTab('pending')}
          className={activeTab === 'pending' ? 'active' : ''}
          style={{ background: activeTab === 'pending' ? 'rgba(196, 30, 58, 0.15)' : 'var(--glass-bg)', color: activeTab === 'pending' ? '#C41E3A' : 'var(--color-muted)', border: activeTab === 'pending' ? '2px solid #C41E3A' : 'var(--glass-border)', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', flexWrap: 'wrap', boxShadow: activeTab === 'pending' ? 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' : 'var(--glass-shadow)' }}>
          <i className="ph ph-clock"></i> Menunggu Persetujuan ({submissions.length})
        </button>
        <button onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'active' : ''}
          style={{ background: activeTab === 'history' ? 'rgba(196, 30, 58, 0.15)' : 'var(--glass-bg)', color: activeTab === 'history' ? '#C41E3A' : 'var(--color-muted)', border: activeTab === 'history' ? '2px solid #C41E3A' : 'var(--glass-border)', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', flexWrap: 'wrap', boxShadow: activeTab === 'history' ? 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' : 'var(--glass-shadow)' }}>
          <i className="ph ph-clock-counter-clockwise"></i> Riwayat KRS Mahasiswa ({history.length})
        </button>
      </div>      <div className="siakad-card stagger-1" style={{ padding: '24px 0 0 0', overflow: 'hidden', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>
            {activeTab === 'pending' ? 'Daftar Pengajuan Pending' : 'Riwayat Pengajuan'}
          </h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem', zIndex: 10 }}></i>
            <input 
              className="siakad-input"
              type="text" 
              placeholder="Cari nama mahasiswa atau NIM..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '46px', 
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
                background: 'var(--liquid-bg)',
                border: 'var(--inset-border)',
                borderRadius: '50px',
                outline: 'none'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px' }}>Mahasiswa</th>
              <th style={{ padding: '16px' }}>Semester</th>
              <th style={{ padding: '16px' }}>Jml Mata Kuliah</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filteredSubmissions = submissions.filter(sub => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  sub.mahasiswa?.name?.toLowerCase().includes(query) ||
                  sub.mahasiswa?.nim_nip?.toLowerCase().includes(query)
                );
              });

              const filteredHistory = history.filter(sub => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  sub.mahasiswa?.name?.toLowerCase().includes(query) ||
                  sub.mahasiswa?.nim_nip?.toLowerCase().includes(query)
                );
              });

              if (activeTab === 'pending' && filteredSubmissions.length === 0) {
                return (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 20px' }}>
                      Tidak ada pengajuan KRS pending yang cocok dengan pencarian.
                    </td>
                  </tr>
                );
              }

              if (activeTab === 'history' && filteredHistory.length === 0) {
                return (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 20px' }}>
                      Tidak ada riwayat KRS yang cocok dengan pencarian.
                    </td>
                  </tr>
                );
              }

              return (activeTab === 'pending' ? filteredSubmissions : filteredHistory).map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, color: 'var(--color-text)' }}>
                    {sub.mahasiswa?.name} <br/>
                    <small style={{ color: 'var(--color-muted)' }}>{sub.mahasiswa?.nim_nip}</small>
                  </td>
                  <td style={{ padding: '16px' }}>{sub.semester}</td>
                  <td style={{ padding: '16px' }}>
                    {(() => {
                      const cIds = sub.course_ids ? (typeof sub.course_ids === 'string' ? JSON.parse(sub.course_ids) : sub.course_ids) : [];
                      const cCodes = cIds.map(id => availableCourses.find(c => c.id === parseInt(id))?.code).filter(Boolean).join(', ');
                      return (
                        <>
                          <div>{cIds.length} Matkul</div>
                          {cCodes && <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px', maxWidth: '200px', lineHeight: '1.4' }}>{cCodes}</div>}
                        </>
                      );
                    })()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="siakad-badge" style={{ 
                      background: sub.status === 'Approved' ? '#dcfce7' : sub.status === 'Rejected' ? '#fee2e2' : '#fef3c7', 
                      color: sub.status === 'Approved' ? '#166534' : sub.status === 'Rejected' ? '#991b1b' : '#b45309' 
                    }}>
                      {sub.status}
                    </span>
                    {sub.reason && sub.status === 'Rejected' && (
                      <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '6px', maxWidth: '150px' }}>
                        Alasan: {sub.reason}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {sub.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' , flexWrap: 'wrap', alignItems: 'center' }}>
                        <button 
                          onClick={() => approveKrs(sub.id)}
                          style={{ 
                            background: 'var(--glass-bg)', color: '#059669', border: 'var(--glass-border)', 
                            padding: '8px 18px', borderRadius: '50px', cursor: 'pointer',
                            fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                            flexWrap: 'wrap', boxShadow: 'var(--glass-shadow)' }}
                        >
                          <i className="ph ph-check-circle"></i> Setujui
                        </button>
                        <button 
                          onClick={() => openRejectModal(sub.id)}
                          style={{ 
                            background: 'var(--glass-bg)', color: '#ef4444', border: 'var(--glass-border)', 
                            padding: '8px 18px', borderRadius: '50px', cursor: 'pointer',
                            fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                            flexWrap: 'wrap', boxShadow: 'var(--glass-shadow)' }}
                        >
                          <i className="ph ph-x-circle"></i> Tolak
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Selesai</span>
                    )}
                  </td>
                </tr>
              ));
            })()}
          </tbody>
          </table>
        </div>
      </div>

      {isRejectModalOpen && (
        <ModalShell
          title="Penolakan KRS Mahasiswa"
          icon="ph-x-circle"
          onClose={() => setIsRejectModalOpen(false)}
          footer={(
            <>
              <button type="button" onClick={() => setIsRejectModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700, boxShadow: 'var(--glass-shadow)' }}>Batal</button>
              <button type="submit" form="krs-reject-form" style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>Konfirmasi Tolak KRS</button>
            </>
          )}
        >
          <form id="krs-reject-form" onSubmit={submitReject} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Alasan Penolakan <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Berikan alasan spesifik agar mahasiswa bisa memperbaikinya (misal: SKS melebihi batas IPS, Prasyarat belum lulus, dll)..."
                required
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '16px', border: 'var(--inset-border)', background: 'var(--liquid-bg)', color: 'var(--color-text)', resize: 'vertical', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', outline: 'none' }}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
