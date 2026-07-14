'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function WisudaAdminPage() {
  const router = useRouter();
  const [yudisiums, setYudisiums] = useState([]);
  const [wisudas, setWisudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);
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

  const verifyYudisium = async (id, status) => {
    setProcessingId(id);
    try {
      await fetch(`${apiUrl}/siakad/graduation/yudisium/${id}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ status, is_free_billing: true, is_free_library: true }) });
      setMessage({ text: `Yudisium ${status === 'verified' ? 'diverifikasi' : 'ditolak'}.`, type: 'success' }); fetchData();
    } catch(e) { setMessage({ text: 'Gagal.', type: 'error' }); } finally { setProcessingId(null); }
  };

  const confirmWisuda = async (id) => {
    const seat = prompt('Masukkan nomor kursi wisuda:');
    if (!seat) return;
    setProcessingId(id);
    try {
      await fetch(`${apiUrl}/siakad/graduation/wisuda/${id}/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ seat_number: seat }) });
      setMessage({ text: 'Wisuda dikonfirmasi.', type: 'success' }); fetchData();
    } catch(e) { setMessage({ text: 'Gagal.', type: 'error' }); } finally { setProcessingId(null); }
  };

  const statusBadge = (s) => {
    const colors = { pending: ['#f59e0b','rgba(245,158,11,0.1)'], verified: ['#10b981','rgba(16,185,129,0.1)'], confirmed: ['#10b981','rgba(16,185,129,0.1)'], rejected: ['#ef4444','rgba(239,68,68,0.1)'] };
    const c = colors[s] || colors.pending;
    const labels = { pending: 'Menunggu', verified: 'Terverifikasi', confirmed: 'Dikonfirmasi', rejected: 'Ditolak' };
    return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: c[0], background: c[1] }}>{labels[s] || s}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Kelola Yudisium & Wisuda...</h1>
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
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Kelola Yudisium & Wisuda</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Verifikasi pengajuan kelulusan yudisium mahasiswa dan tentukan nomor kursi wisuda.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}
        <p style={{ color: 'var(--color-muted)', margin: '0 0 24px 0' }}>Verifikasi pengajuan yudisium dan konfirmasi pendaftaran wisuda</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Total Yudisium', val: yudisiums.length, color: '#3b82f6' }, { label: 'Menunggu', val: yudisiums.filter(y=>y.status==='pending').length, color: '#f59e0b' }, { label: 'Terverifikasi', val: yudisiums.filter(y=>y.status==='verified').length, color: '#10b981' }, { label: 'Total Wisuda', val: wisudas.length, color: '#8b5cf6' }].map((s,i) => (
          <div key={i} className={`siakad-card stagger-${i+2}`} style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: s.color, margin: '0 0 4px 0' }}>{s.val}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0, fontWeight: '600' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="siakad-card stagger-3" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Daftar Yudisium</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Mahasiswa', 'Judul Skripsi', 'IPK', 'Status', 'Aksi'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {yudisiums.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data.</td></tr> :
              yudisiums.map(y => (
                <tr key={y.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{y.user?.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{y.thesis_title}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '700' }}>{y.gpa}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(y.status)}</td>
                  <td style={{ padding: '14px 16px' }}>{y.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => verifyYudisium(y.id, 'verified')} disabled={processingId === y.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-check"></i> Verifikasi</button>
                      <button onClick={() => verifyYudisium(y.id, 'rejected')} disabled={processingId === y.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-x"></i> Tolak</button>
                    </div>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {wisudas.length > 0 && (
        <div className="siakad-card stagger-4" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Daftar Wisuda</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Mahasiswa', 'Toga', 'No. Kursi', 'Status', 'Aksi'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>{wisudas.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{w.yudisium?.user?.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{w.toga_size}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{w.seat_number || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(w.status)}</td>
                  <td style={{ padding: '14px 16px' }}>{w.status === 'pending' && <button onClick={() => confirmWisuda(w.id)} disabled={processingId === w.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-check"></i> Konfirmasi</button>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
