"use client";
import { useState, useEffect } from 'react';
import ModalShell from '../../components/ModalShell';
import { useRouter } from 'next/navigation';

export default function SuratAdministrasiPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ jenis: '', alasan: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${apiUrl}/siakad/mahasiswa/letters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAjukan = async (e) => {
    e.preventDefault();
    if (!requestForm.jenis.trim()) return;

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${apiUrl}/siakad/mahasiswa/letters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: requestForm.jenis,
          note: requestForm.alasan
        })
      });

      if (res.ok) {
        window.toast('Pengajuan berhasil dikirim!');
        setShowRequestModal(false);
        fetchRequests();
      } else {
        window.toast('Gagal mengirim pengajuan.');
      }
    } catch (err) {
      window.toast('Terjadi kesalahan: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <div className="siakad-modal-header">
            <div>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Surat & Administrasi</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ajukan surat keterangan dan layanan administrasi akademik.</p>
            </div>
            <button onClick={() => { setRequestForm({ jenis: '', alasan: '' }); setShowRequestModal(true); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Ajukan Surat Baru
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px 0 0 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Daftar Pengajuan Surat</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              placeholder="Cari jenis surat, status, catatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 14px 10px 38px', 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)', 
                outline: 'none', 
                background: 'var(--color-bg)', 
                color: 'var(--color-text)',
                fontSize: '0.9rem'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 24px' }}>Tanggal</th>
                <th style={{ padding: '16px 24px' }}>Jenis Pengajuan</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px' }}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredRequests = requests.filter(req => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    req.type?.toLowerCase().includes(query) ||
                    req.status?.toLowerCase().includes(query) ||
                    req.note?.toLowerCase().includes(query)
                  );
                });

                if (filteredRequests.length === 0) {
                  return (
                    <tr>
                      <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada data pengajuan surat yang cocok.</td>
                    </tr>
                  );
                }

                return filteredRequests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)' }}>{formatDate(req.date)}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>{req.type}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="siakad-badge" style={{ 
                        background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b'
                      }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-muted)' }}>{req.note}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {showRequestModal && (
        <ModalShell
          title="Ajukan Surat Baru"
          icon="ph-file-plus"
          onClose={() => setShowRequestModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowRequestModal(false)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="request-form" style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Simpan & Kirim</button>
            </>
          )}
        >
          <form id="request-form" onSubmit={handleAjukan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Jenis Surat / Layanan</label>
              <input
                type="text"
                className="siakad-input"
                value={requestForm.jenis}
                onChange={(e) => setRequestForm({ ...requestForm, jenis: e.target.value })}
                placeholder="Contoh: Surat Keterangan Aktif Kuliah"
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Keperluan / Alasan</label>
              <textarea
                className="siakad-input"
                rows={5}
                value={requestForm.alasan}
                onChange={(e) => setRequestForm({ ...requestForm, alasan: e.target.value })}
                placeholder="Tulis keperluan pengajuan surat"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
