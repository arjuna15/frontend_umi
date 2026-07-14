'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import SkeletonLoader from '../../components/SkeletonLoader';
import CustomSelect from '../../components/CustomSelect';

export default function QualityAssurancePage() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [iku, setIku] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('iku');
  const [form, setForm] = useState({ title: '', category: 'standar', academic_year: '2025/2026' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bikinwebdikitaaja.com/api';
  const getToken = () => localStorage.getItem('siakad_token');

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${apiUrl}/siakad/qa/spmi`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } }),
        fetch(`${apiUrl}/siakad/qa/iku`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' } })
      ]);
      const d1 = await r1.json(); const d2 = await r2.json();
      setDocs(d1.data || []); setIku(d2.data || []); setSummary(d2.summary || {});
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const uploadDoc = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/qa/spmi`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setMessage({ text: 'Dokumen SPMI berhasil ditambahkan!', type: 'success' }); setShowModal(false); fetchData(); }
      else { setMessage({ text: 'Gagal menambahkan dokumen.', type: 'error' }); }
    } catch(e) { setMessage({ text: 'Terjadi kesalahan.', type: 'error' }); } finally { setSaving(false); }
  };

  const catColors = { standar: '#3b82f6', audit: '#8b5cf6', evaluasi: '#f59e0b', akreditasi: '#10b981' };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Penjaminan Mutu & IKU...</h1>
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
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PENJAMINAN MUTU</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Penjaminan Mutu & IKU</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola dokumen standar SPMI/SPME dan pantau status pemenuhan 8 Indikator Kinerja Utama Kampus.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {message && <div style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '16px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600' }}>{message.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Total Mahasiswa', val: summary.total_mahasiswa || 0, icon: 'ph-student', color: '#3b82f6' }, { label: 'Total Dosen', val: summary.total_dosen || 0, icon: 'ph-chalkboard-teacher', color: '#8b5cf6' }, { label: 'Total Alumni', val: summary.total_alumni || 0, icon: 'ph-users', color: '#10b981' }, { label: 'Dokumen SPMI', val: docs.length, icon: 'ph-files', color: '#f59e0b' }].map((s,i) => (
          <div key={i} className={`siakad-card stagger-${i+2}`} style={{ padding: '20px', textAlign: 'center' }}>
            <i className={`ph ${s.icon}`} style={{ fontSize: '1.5rem', color: s.color, marginBottom: '8px', display: 'block' }}></i>
            <p style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color, margin: '0 0 4px 0' }}>{s.val}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0, fontWeight: '600' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ key: 'iku', label: 'Dashboard IKU' }, { key: 'spmi', label: 'Dokumen SPMI' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '10px 20px', borderRadius: '50px', border: activeTab === t.key ? '2px solid #3b82f6' : '1px solid var(--color-border)',
            background: activeTab === t.key ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === t.key ? '#3b82f6' : 'var(--color-muted)',
            fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'iku' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>8 Indikator Kinerja Utama (IKU)</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {iku.map((item, i) => {
              const pct = Math.min((item.actual / item.target) * 100, 100);
              const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={item.id} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ color: 'var(--color-text)', fontWeight: '600', margin: 0, fontSize: '0.9rem', flex: 1 }}>
                      <span style={{ color: 'var(--color-muted)', marginRight: '8px', fontWeight: '800' }}>IKU {i + 1}</span>{item.name}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Target: <strong>{item.target}{item.unit}</strong></span>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color }}>{item.actual}{item.unit}</span>
                    </div>
                  </div>
                  <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '10px', background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: 'width 1s cubic-bezier(0.25,1,0.5,1)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'spmi' && (
        <div className="siakad-card stagger-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Dokumen SPMI</h2>
            <button onClick={() => setShowModal(true)} className="siakad-btn-primary" style={{ padding: '10px 20px' }}><i className="ph ph-plus"></i> Tambah Dokumen</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Judul', 'Kategori', 'Tahun Akademik', 'Tanggal'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {docs.length === 0 ? <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada dokumen SPMI.</td></tr> :
                docs.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{d.title}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: catColors[d.category] || '#3b82f6', background: `${catColors[d.category] || '#3b82f6'}18`, textTransform: 'capitalize' }}>{d.category}</span></td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{d.academic_year}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ModalShell title="Tambah Dokumen SPMI" subtitle="Penjaminan Mutu" icon="ph-shield-check" onClose={() => setShowModal(false)}
          footer={<><button onClick={() => setShowModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button onClick={uploadDoc} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button></>}>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Judul Dokumen</label>
            <input className="siakad-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Contoh: Standar Pendidikan 2025" /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Kategori</label>
            <CustomSelect
              value={form.category}
              onChange={val => setForm({...form, category: val})}
              options={[
                { value: 'standar', label: 'Standar' },
                { value: 'audit', label: 'Audit' },
                { value: 'evaluasi', label: 'Evaluasi' },
                { value: 'akreditasi', label: 'Akreditasi' }
              ]}
            /></div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tahun Akademik</label>
            <input className="siakad-input" value={form.academic_year} onChange={e => setForm({...form, academic_year: e.target.value})} placeholder="2025/2026" /></div>
        </ModalShell>
      )}
      </div>
    </div>
  );
}
