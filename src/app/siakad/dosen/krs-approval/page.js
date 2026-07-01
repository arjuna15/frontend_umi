"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KrsApprovalPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/krs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setSubmissions(result.submissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (!selectedSub) return;
    setProcessing(true);
    
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/krs/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submission_id: selectedSub.id,
          status: status,
          notes: notes
        })
      });

      if (res.ok) {
        window.toast(`KRS berhasil di-${status === 'approved' ? 'Setujui' : 'Tolak'}!`);
        setSelectedSub(null);
        setNotes('');
        fetchSubmissions();
      } else {
        const err = await res.json();
        window.toast('Gagal: ' + (err.message || 'Server Error'));
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text)' }}>Memuat data KRS...</div>;

  return (
    <div className="siakad-page">
      <div className="siakad-header-block mb-4">
        <h1 className="siakad-title">Persetujuan KRS (Dosen Wali)</h1>
        <p className="siakad-subtitle">Validasi rencana studi mahasiswa bimbingan Anda. {pendingCount > 0 && <span style={{ color: 'var(--umiba-red)', fontWeight: 'bold' }}>Ada {pendingCount} KRS menunggu persetujuan.</span>}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="siakad-card p-4 md:col-span-1" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Daftar Mahasiswa</h3>
          {submissions.length === 0 ? (
            <div style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '20px' }}>Tidak ada data mahasiswa bimbingan.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {submissions.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSub(sub);
                    setNotes(sub.notes || '');
                  }}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    background: selectedSub?.id === sub.id ? 'var(--umiba-red)' : 'var(--glass-bg)',
                    color: selectedSub?.id === sub.id ? 'white' : 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{sub.mahasiswa?.name || 'Mahasiswa'}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>NIM: {sub.mahasiswa?.nim || '-'}</div>
                  
                  <div style={{ marginTop: '8px' }}>
                    {sub.status === 'pending' && <span style={{ padding: '2px 6px', background: '#f59e0b', color: 'white', fontSize: '0.7rem', borderRadius: '4px' }}>Menunggu</span>}
                    {sub.status === 'approved' && <span style={{ padding: '2px 6px', background: '#10b981', color: 'white', fontSize: '0.7rem', borderRadius: '4px' }}>Disetujui</span>}
                    {sub.status === 'rejected' && <span style={{ padding: '2px 6px', background: '#ef4444', color: 'white', fontSize: '0.7rem', borderRadius: '4px' }}>Ditolak</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedSub ? (
            <div className="siakad-card p-6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 'bold' }}>{selectedSub.mahasiswa?.name}</h2>
                  <p style={{ margin: 0, color: 'var(--color-muted)' }}>NIM: {selectedSub.mahasiswa?.nim} | Semester: {selectedSub.semester}</p>
                </div>
                <div>
                  {selectedSub.status === 'pending' && <span style={{ padding: '6px 12px', background: '#fef3c7', color: '#d97706', borderRadius: '20px', fontWeight: 'bold' }}>Menunggu Persetujuan</span>}
                  {selectedSub.status === 'approved' && <span style={{ padding: '6px 12px', background: '#d1fae5', color: '#059669', borderRadius: '20px', fontWeight: 'bold' }}>Telah Disetujui</span>}
                  {selectedSub.status === 'rejected' && <span style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '20px', fontWeight: 'bold' }}>Telah Ditolak</span>}
                </div>
              </div>

              <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Mata Kuliah yang Diambil</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Kode</th>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Mata Kuliah</th>
                    <th style={{ padding: '12px', fontWeight: '600' }}>SKS</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedSub.courses || []).map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px' }}>{c.code}</td>
                      <td style={{ padding: '12px' }}>{c.name}</td>
                      <td style={{ padding: '12px' }}>{c.sks}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'rgba(0,0,0,0.02)', fontWeight: 'bold' }}>
                    <td colSpan="2" style={{ padding: '12px', textAlign: 'right' }}>Total SKS:</td>
                    <td style={{ padding: '12px' }}>
                      {(selectedSub.courses || []).reduce((acc, curr) => acc + (parseInt(curr.sks) || 0), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Catatan Dosen Wali (Opsional / Wajib jika Ditolak)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Berikan catatan revisi untuk mahasiswa jika KRS ditolak..."
                  rows="3"
                  className="form-control"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                  disabled={selectedSub.status !== 'pending' && processing}
                ></textarea>
              </div>

              {selectedSub.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleAction('approved')}
                    disabled={processing}
                    style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    <i className="ph ph-check-circle" style={{ marginRight: '8px' }}></i> Setujui KRS
                  </button>
                  <button 
                    onClick={() => handleAction('rejected')}
                    disabled={processing || !notes.trim()}
                    style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', borderRadius: '8px', border: 'none', cursor: (processing || !notes.trim()) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: (processing || !notes.trim()) ? 0.6 : 1 }}
                    title={!notes.trim() ? "Isi catatan terlebih dahulu untuk menolak KRS" : ""}
                  >
                    <i className="ph ph-x-circle" style={{ marginRight: '8px' }}></i> Tolak & Minta Revisi
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="siakad-card p-10" style={{ textAlign: 'center', color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <i className="ph ph-check-square-offset" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              <p>Pilih mahasiswa dari daftar di samping untuk melihat dan memvalidasi KRS mereka.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
