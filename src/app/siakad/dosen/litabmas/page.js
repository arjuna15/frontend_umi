'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import SkeletonLoader from '../../components/SkeletonLoader';
import CustomSelect from '../../components/CustomSelect';

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
    const colors = { 
      draft: { color: '#64748b', border: 'rgba(100,116,139,0.3)' }, 
      pending: { color: '#d97706', border: 'rgba(217,119,6,0.3)' }, 
      approved: { color: '#047857', border: 'rgba(4,120,87,0.3)' }, 
      rejected: { color: '#b91c1c', border: 'rgba(185,28,28,0.3)' } 
    };
    const c = colors[s] || colors.pending;
    const labels = { draft: 'Draf', pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
    return (
      <span className="siakad-badge-status" style={{ 
        color: c.color, 
        borderColor: c.border 
      }}>
        {labels[s] || s}
      </span>
    );
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
          <button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--glass-shadow)' }}><i className="ph ph-plus-circle"></i> Ajukan Proposal</button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && (
          <div 
            className="siakad-badge-status" 
            style={{ 
              width: '100%', 
              padding: '14px 20px', 
              borderRadius: '16px', 
              marginBottom: '16px', 
              background: 'var(--glass-bg)',
              color: message.type === 'success' ? '#047857' : '#b91c1c', 
              borderColor: message.type === 'success' ? 'rgba(4,120,87,0.3)' : 'rgba(185,28,28,0.3)',
              fontWeight: '700',
              textAlign: 'left',
              justifyContent: 'flex-start'
            }}
          >
            <i className={message.type === 'success' ? 'ph ph-check-circle' : 'ph ph-x-circle'} style={{ fontSize: '1.2rem', marginRight: '8px', color: message.type === 'success' ? '#047857' : '#b91c1c' }}></i>
            {message.text}
          </div>
        )}

      <div className="stagger-2" style={{ padding: '24px', borderRadius: '24px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Riwayat Proposal</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {proposals.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '16px', boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)' }}>
              Belum ada proposal.
            </div>
          ) : (
            proposals.map(p => (
              <div key={p.id} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '18px 20px',
                background: 'var(--liquid-bg)',
                border: 'var(--inset-border)',
                borderRadius: '16px',
                boxShadow: 'inset 2px 2px 5px var(--inset-shadow-dark), inset -2px -2px 5px var(--inset-shadow-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)' }}>{p.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Tipe: {p.type}</span>
                  </div>
                  <div>{statusBadge(p.status)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Anggaran: </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)' }}>{formatCurrency(p.budget)}</span>
                  </div>
                  {p.reviewer_notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      <strong>Reviewer:</strong> {p.reviewer_notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ModalShell title="Ajukan Proposal" subtitle="Litabmas" icon="ph-projector-screen" onClose={() => setShowModal(false)}
          footer={<><button onClick={() => setShowModal(false)} className="btn" style={{ padding: '10px 20px', border: 'var(--glass-border)', background: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', borderRadius: '50px' }}>Batal</button>
            <button onClick={handleSubmit} disabled={saving} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '800', boxShadow: 'var(--glass-shadow)' }}>{saving ? 'Menyimpan...' : 'Ajukan'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tipe</label>
            <CustomSelect
              value={form.type}
              onChange={val => setForm({...form, type: val})}
              options={[
                { value: 'penelitian', label: 'Penelitian' },
                { value: 'pengabdian', label: 'Pengabdian Masyarakat' }
              ]}
            /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Judul</label>
            <input className="siakad-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Judul proposal..." style={{ width: '100%', boxSizing: 'border-box' }} /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Abstrak</label>
            <textarea className="siakad-input" value={form.abstract} onChange={e => setForm({...form, abstract: e.target.value})} placeholder="Abstrak penelitian/pengabdian..." rows={4} style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box', borderRadius: '16px' }} /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Pagu Anggaran (Rp)</label>
            <input className="siakad-input" type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Contoh: 15000000" style={{ width: '100%', boxSizing: 'border-box' }} /></div>
        </ModalShell>
      )}
      </div>
    </div>
  );
}
