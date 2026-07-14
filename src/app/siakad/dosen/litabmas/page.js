'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function LitabmasDosenPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ type: 'penelitian', title: '', abstract: '', budget: '' });
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

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/litabmas/proposals`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setMessage({ text: 'Proposal berhasil diajukan!', type: 'success' }); setShowModal(false); setForm({ type: 'penelitian', title: '', abstract: '', budget: '' }); fetchData(); }
      else { setMessage({ text: 'Gagal mengajukan proposal.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const statusBadge = (s) => {
    const colors = { draft: ['#6b7280','rgba(107,114,128,0.1)'], pending: ['#f59e0b','rgba(245,158,11,0.1)'], approved: ['#10b981','rgba(16,185,129,0.1)'], rejected: ['#ef4444','rgba(239,68,68,0.1)'] };
    const c = colors[s] || colors.pending;
    const labels = { draft: 'Draf', pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
    return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: c[0], background: c[1] }}>{labels[s] || s}</span>;
  };

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Litabmas...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Litabmas Dosen</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ajukan usulan proposal penelitian ilmiah (Penelitian) dan Pengabdian Kepada Masyarakat (Litabmas).</p>
          </div>
          <button onClick={() => setShowModal(true)} className="siakad-btn-primary" style={{ padding: '12px 24px' }}><i className="ph ph-plus-circle"></i> Ajukan Proposal</button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div className="siakad-card stagger-2" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Riwayat Proposal</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Judul', 'Tipe', 'Anggaran', 'Status', 'Catatan Reviewer'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {proposals.length === 0 ? <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada proposal.</td></tr> :
              proposals.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600', maxWidth: '300px' }}>{p.title}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.type}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{formatCurrency(p.budget)}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{p.reviewer_notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalShell title="Ajukan Proposal" subtitle="Litabmas" icon="ph-projector-screen" onClose={() => setShowModal(false)}
          footer={<><button onClick={() => setShowModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Ajukan'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tipe</label>
            <select className="siakad-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="penelitian">Penelitian</option><option value="pengabdian">Pengabdian Masyarakat</option></select></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Judul</label>
            <input className="siakad-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Judul proposal..." /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Abstrak</label>
            <textarea className="siakad-input" value={form.abstract} onChange={e => setForm({...form, abstract: e.target.value})} placeholder="Abstrak penelitian/pengabdian..." rows={4} style={{ resize: 'vertical' }} /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Pagu Anggaran (Rp)</label>
            <input className="siakad-input" type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Contoh: 15000000" /></div>
        </ModalShell>
      )}
      </div>
    </div>
  );
}
