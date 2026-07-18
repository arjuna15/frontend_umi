'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function LitabmasAdminPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/siakad/litabmas/proposals`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } });
      const data = await res.json();
      setProposals(data.data || []);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleReview = async (id, status) => {
    const notes = status === 'rejected' ? prompt('Catatan penolakan:') : '';
    setProcessingId(id);
    try {
      await fetch(`${apiUrl}/siakad/litabmas/proposals/${id}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ status, reviewer_notes: notes }) });
      setMessage({ text: `Proposal ${status === 'approved' ? 'disetujui' : 'ditolak'}.`, type: 'success' }); fetchData();
    } catch(e) { setMessage({ text: 'Gagal.', type: 'error' }); } finally { setProcessingId(null); }
  };

  const statusBadge = (s) => {
    const color = s === 'approved' ? '#10b981' : s === 'rejected' ? '#ef4444' : s === 'draft' ? 'var(--color-muted)' : '#f59e0b';
    const labels = { draft: 'Draf', pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
    return <span className="siakad-badge" style={{ color }}>{labels[s] || s}</span>;
  };

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Review Litabmas...</h1>
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
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Review Litabmas Dosen</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Review, evaluasi, dan setujui usulan proposal penelitian dan pengabdian masyarakat (Litabmas) dari Dosen.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Total Proposal', val: proposals.length, color: '#3b82f6' }, { label: 'Penelitian', val: proposals.filter(p=>p.type==='penelitian').length, color: '#8b5cf6' }, { label: 'Pengabdian', val: proposals.filter(p=>p.type==='pengabdian').length, color: '#10b981' }, { label: 'Menunggu', val: proposals.filter(p=>p.status==='pending').length, color: '#f59e0b' }].map((s,i) => (
          <div key={i} className={`siakad-card stagger-${i+2}`} style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: s.color, margin: '0 0 4px 0' }}>{s.val}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0, fontWeight: '600' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Daftar Proposal</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead><tr>{['Dosen', 'Judul', 'Tipe', 'Anggaran', 'Status', 'Aksi'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {proposals.length === 0 ? <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada proposal.</td></tr> :
              proposals.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.user?.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.type}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{formatCurrency(p.budget)}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status)}</td>
                  <td style={{ padding: '14px 16px' }}>{(p.status === 'pending' || p.status === 'draft') && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleReview(p.id, 'approved')} disabled={processingId === p.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-check"></i> Setuju</button>
                      <button onClick={() => handleReview(p.id, 'rejected')} disabled={processingId === p.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><i className="ph ph-x"></i> Tolak</button>
                    </div>
                  )}</td>
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
