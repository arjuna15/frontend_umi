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
        setSubmissions(allKrs.filter(k => k.status === 'Pending'));
        
        // Mocking history or fetching it if backend supports
        try {
          const histRes = await fetch(`${apiUrl}/siakad/krs`, { headers: { 'Authorization': `Bearer ${token}` } });
          if(histRes.ok) {
            const histData = await histRes.json();
            setHistory(Array.isArray(histData) ? histData : []);
          } else {
            setHistory(allKrs);
          }
        } catch(e) {
          setHistory(allKrs);
        }
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
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' , flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('pending')} style={{ background: activeTab === 'pending' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: activeTab === 'pending' ? '#3b82f6' : 'var(--color-muted)', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' , flexWrap: 'wrap'}}>
          <i className="ph ph-clock"></i> Menunggu Persetujuan ({submissions.length})
        </button>
        <button onClick={() => setActiveTab('history')} style={{ background: activeTab === 'history' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'history' ? '#10b981' : 'var(--color-muted)', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' , flexWrap: 'wrap'}}>
          <i className="ph ph-clock-counter-clockwise"></i> Riwayat KRS Mahasiswa ({history.length})
        </button>
      </div>

      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th>Mahasiswa</th>
              <th>Semester</th>
              <th>Jml Mata Kuliah</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'pending' && submissions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 20px' }}>
                  Belum ada pengajuan KRS yang pending.
                </td>
              </tr>
            ) : activeTab === 'history' && history.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 20px' }}>
                  Belum ada riwayat KRS.
                </td>
              </tr>
            ) : (
              (activeTab === 'pending' ? submissions : history).map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                    {sub.mahasiswa?.name} <br/>
                    <small style={{ color: 'var(--color-muted)' }}>{sub.mahasiswa?.nim_nip}</small>
                  </td>
                  <td>{sub.semester}</td>
                  <td>
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
                  <td>
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
                  <td style={{ textAlign: 'center' }}>
                    {sub.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' , flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => approveKrs(sub.id)}
                          style={{ 
                            background: '#10b981', color: 'white', border: 'none', 
                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                          , flexWrap: 'wrap'}}
                        >
                          <i className="ph ph-check-circle"></i> Setujui
                        </button>
                        <button 
                          onClick={() => openRejectModal(sub.id)}
                          style={{ 
                            background: '#ef4444', color: 'white', border: 'none', 
                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                          , flexWrap: 'wrap'}}
                        >
                          <i className="ph ph-x-circle"></i> Tolak
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Selesai</span>
                    )}
                  </td>
                </tr>
              ))
            )}
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
              <button type="button" onClick={() => setIsRejectModalOpen(false)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="krs-reject-form" style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Konfirmasi Tolak KRS</button>
            </>
          )}
        >
          <form id="krs-reject-form" onSubmit={submitReject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-text)' }}>Alasan Penolakan <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Berikan alasan spesifik agar mahasiswa bisa memperbaikinya (misal: SKS melebihi batas IPS, Prasyarat belum lulus, dll)..."
                required
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', resize: 'vertical' }}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
