'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function SkpiAdminPage() {
  const router = useRouter();
  const [prestasis, setPrestasis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/skpi/list`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } });
      const data = await res.json();
      setPrestasis(data.prestasis || []);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleVerify = async (id, status) => {
    setProcessingId(id);
    try {
      await fetch(`${apiUrl}/siakad/skpi/verify/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify({ status }) });
      setMessage({ text: `Prestasi ${status === 'approved' ? 'disetujui' : 'ditolak'}.`, type: 'success' });
      fetchData();
    } catch(e) { setMessage({ text: 'Gagal memproses.', type: 'error' }); } finally { setProcessingId(null); }
  };

  const statusBadge = (s) => {
    const color = s === 'approved' ? '#10b981' : s === 'rejected' ? '#ef4444' : '#f59e0b';
    const text = s === 'pending' ? 'Menunggu' : s === 'approved' ? 'Disetujui' : 'Ditolak';
    return <span className="siakad-badge" style={{ color }}>{text}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Verifikasi SKPI...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ADMIN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Verifikasi SKPI & Prestasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola, review, dan verifikasi pengajuan portofolio sertifikat prestasi mahasiswa.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div className="siakad-card stagger-2" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Daftar Pengajuan Prestasi</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead><tr>
              {['Mahasiswa', 'Nama Prestasi', 'Kategori', 'Tingkat', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {prestasis.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada pengajuan.</td></tr>
              ) : prestasis.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.user?.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.level}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleVerify(p.id, 'approved')} disabled={processingId === p.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-check"></i> Setuju</button>
                        <button onClick={() => handleVerify(p.id, 'rejected')} disabled={processingId === p.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-x"></i> Tolak</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
