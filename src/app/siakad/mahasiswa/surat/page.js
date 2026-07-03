"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuratAdministrasiPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAjukan = async () => {
    const formData = await window.toast.form('Ajukan Surat Baru', [
      { name: 'jenis', label: 'Jenis Surat / Layanan', type: 'text', placeholder: 'Contoh: Surat Keterangan Aktif Kuliah' },
      { name: 'alasan', label: 'Keperluan / Alasan', type: 'textarea' }
    ]);

    if (formData && formData.jenis) {
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
            type: formData.jenis,
            note: formData.alasan
          })
        });

        if (res.ok) {
          window.toast('Pengajuan berhasil dikirim!');
          fetchRequests();
        } else {
          window.toast('Gagal mengirim pengajuan.');
        }
      } catch (err) {
        window.toast('Terjadi kesalahan: ' + err.message);
      }
    }
  };

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <div className="siakad-modal-header">
            <div>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Surat & Administrasi</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ajukan surat keterangan dan layanan administrasi akademik.</p>
            </div>
            <button onClick={handleAjukan} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Ajukan Surat Baru
            </button>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Pengajuan</th>
                <th>Status</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ color: 'var(--color-muted)' }}>{formatDate(req.date)}</td>
                  <td style={{ fontWeight: 'bold' }}>{req.type}</td>
                  <td>
                    <span className="siakad-badge" style={{ 
                      background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-muted)' }}>{req.note}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada riwayat pengajuan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
