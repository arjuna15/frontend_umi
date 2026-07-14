'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function SkpiMahasiswaPage() {
  const router = useRouter();
  const [prestasis, setPrestasis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'akademik', level: 'nasional' });
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

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('category', formData.category);
      body.append('level', formData.level);
      const res = await fetch(`${apiUrl}/siakad/skpi/submit`, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body });
      if (res.ok) { setMessage({ text: 'Prestasi berhasil diajukan!', type: 'success' }); setShowModal(false); setFormData({ name: '', category: 'akademik', level: 'nasional' }); fetchData(); }
      else { setMessage({ text: 'Gagal mengajukan prestasi.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const statusBadge = (s) => {
    const colors = { pending: ['#f59e0b','rgba(245,158,11,0.1)'], approved: ['#10b981','rgba(16,185,129,0.1)'], rejected: ['#ef4444','rgba(239,68,68,0.1)'] };
    const c = colors[s] || colors.pending;
    return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: c[0], background: c[1] }}>{s === 'pending' ? 'Menunggu' : s === 'approved' ? 'Disetujui' : 'Ditolak'}</span>;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)' }}>Memuat SKPI...</h1></div>;

  return (
    <div className="siakad-container">
      {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div className="siakad-card stagger-1" style={{ padding: '28px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>SKPI & Prestasi</h1>
            <p style={{ color: 'var(--color-muted)', margin: 0 }}>Kelola pencapaian dan sertifikat prestasi Anda</p>
          </div>
          <button id="btn-add-prestasi" onClick={() => setShowModal(true)} className="siakad-btn-primary" style={{ padding: '12px 24px' }}>
            <i className="ph ph-plus-circle"></i> Tambah Prestasi
          </button>
        </div>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 16px 0' }}>Riwayat Prestasi</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Nama Prestasi', 'Kategori', 'Tingkat', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {prestasis.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data prestasi.</td></tr>
              ) : prestasis.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.level}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalShell title="Tambah Prestasi" subtitle="SKPI & Prestasi" icon="ph-certificate" onClose={() => setShowModal(false)}
          footer={<><button onClick={() => setShowModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button></>}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Nama Prestasi</label>
            <input className="siakad-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Juara 1 Lomba Nasional..." />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kategori</label>
            <select className="siakad-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="akademik">Akademik</option><option value="non-akademik">Non-Akademik</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tingkat</label>
            <select className="siakad-input" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
              <option value="internal">Internal</option><option value="regional">Regional</option><option value="nasional">Nasional</option><option value="internasional">Internasional</option>
            </select>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
