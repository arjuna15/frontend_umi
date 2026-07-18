"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function KerjasamaPage() {
  const router = useRouter();
  const [partnerships, setPartnerships] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiring_soon: 0, top_type: '-' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [formData, setFormData] = useState({ partner_name: '', type: 'industri', mou_number: '', start_date: '', end_date: '', status: 'active', pic: '', description: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/kerjasama/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/kerjasama/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (pRes.ok) { const d = await pRes.json(); setPartnerships(d.data || d.partnerships || []); }
      if (sRes.ok) {
        const sd = await sRes.json(); const s = sd.data || sd.stats || sd;
        setStats({ total: s.total || 0, active: s.active || s.mou_active || 0, expiring_soon: s.expiring_soon || 0, top_type: s.top_type || 'Industri' });
        setTypeData(s.type_distribution || [
          { type: 'Industri', count: 15, color: '#3b82f6' }, { type: 'Pemerintah', count: 8, color: '#8b5cf6' },
          { type: 'Universitas', count: 12, color: '#14b8a6' }, { type: 'NGO', count: 5, color: '#f59e0b' },
        ]);
      }
    } catch (e) { console.error(e); setMessage({ text: 'Gagal memuat data kerjasama.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const savePartnership = async () => {
    if (!formData.partner_name) return;
    setSaving(true);
    try {
      const url = editId ? `${apiUrl}/siakad/kerjasama/${editId}` : `${apiUrl}/siakad/kerjasama/`;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: editId ? 'Kerjasama berhasil diperbarui!' : 'Kerjasama berhasil ditambahkan!', type: 'success' });
      setShowModal(false); resetForm(); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menyimpan kerjasama.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deletePartnership = async (id) => {
    if (!confirm('Hapus kerjasama ini?')) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/kerjasama/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Kerjasama berhasil dihapus.', type: 'success' }); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menghapus kerjasama.', type: 'error' }); }
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setFormData({ partner_name: p.partner_name || '', type: p.type || 'industri', mou_number: p.mou_number || '', start_date: p.start_date || '', end_date: p.end_date || '', status: p.status || 'active', pic: p.pic || '', description: p.description || '' });
    setShowModal(true);
  };

  const resetForm = () => { setEditId(null); setFormData({ partner_name: '', type: 'industri', mou_number: '', start_date: '', end_date: '', status: 'active', pic: '', description: '' }); };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const statusBadge = (s) => { const c = s === 'active' ? '#10b981' : s === 'expired' ? '#ef4444' : '#f59e0b'; const l = s === 'active' ? 'Aktif' : s === 'expired' ? 'Berakhir' : 'Draft'; return <span className="siakad-badge-status" style={{ color: c, borderColor: `${c}33`, minWidth: '110px' }}>{l}</span>; };
  const tBadge = (t) => { const map = { industri: '#3b82f6', pemerintah: '#8b5cf6', universitas: '#14b8a6', ngo: '#f59e0b' }; const c = map[t] || 'var(--color-muted)'; return <span className="siakad-badge-status" style={{ color: c, borderColor: `${c}33`, minWidth: '120px' }}>{t?.charAt(0).toUpperCase() + t?.slice(1)}</span>; };

  if (loading) return (<div style={{ padding: '24px' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat ...</h1><div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', height: '200px' }}></div></div>);

  const statCards = [
    { label: 'Total Kerjasama', value: stats.total, icon: 'ph ph-handshake', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'MoU Aktif', value: stats.active, icon: 'ph ph-seal-check', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Segera Berakhir', value: stats.expiring_soon, icon: 'ph ph-warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Tipe Terbanyak', value: stats.top_type, icon: 'ph ph-trophy', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  const pieTotal = typeData.reduce((a, d) => a + d.count, 0) || 1;
  let pieGradient = '', cumulative = 0;
  typeData.forEach((d, i) => { const pct = (d.count / pieTotal) * 100; pieGradient += `${d.color} ${cumulative}% ${cumulative + pct}%`; cumulative += pct; if (i < typeData.length - 1) pieGradient += ', '; });

  const filtered = Array.isArray(partnerships) ? partnerships.filter(p => !search || (p.partner_name || '').toLowerCase().includes(search.toLowerCase()) || (p.mou_number || '').toLowerCase().includes(search.toLowerCase())) : [];

  const formFields = [
    { label: 'Nama Mitra', key: 'partner_name', placeholder: 'Nama institusi/perusahaan', span: true },
    { label: 'Tipe', key: 'type', type: 'select', options: ['industri', 'pemerintah', 'universitas', 'ngo'] },
    { label: 'No. MoU', key: 'mou_number', placeholder: 'Nomor MoU' },
    { label: 'Tanggal Mulai', key: 'start_date', type: 'date' },
    { label: 'Tanggal Berakhir', key: 'end_date', type: 'date' },
    { label: 'Status', key: 'status', type: 'select', options: ['active', 'expired', 'draft'] },
    { label: 'PIC', key: 'pic', placeholder: 'Person in Charge' },
    { label: 'Deskripsi', key: 'description', placeholder: 'Deskripsi kerjasama', span: true, type: 'textarea' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KERJASAMA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen Kerjasama</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola MoU, kemitraan, dan kolaborasi institusi.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '14px 20px', borderRadius: '50px', marginBottom: '24px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.2rem' }}></i>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className={s.icon}></i></div>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statistik Kerjasama</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text)', margin: 0 }}>Distribusi Tipe Kerjasama</h3>
            </div>
            <span className="siakad-badge-status" style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', minWidth: '120px' }}>
              {pieTotal} Tipe
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
              background: `conic-gradient(from 180deg, ${pieGradient})`,
              position: 'relative',
              flexShrink: 0
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>{pieTotal}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Total</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px', minWidth: '220px', flex: '1 1 220px' }}>
              {typeData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'var(--liquid-bg)', borderRadius: '12px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0, boxShadow: '0 0 0 3px rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: '600' }}>{d.type}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--color-text)', marginLeft: 'auto' }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statistik Kerjasama</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text)', margin: 0 }}>Timeline Kerjasama Aktif</h3>
            </div>
            <span className="siakad-badge-status" style={{ color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.3)', minWidth: '120px' }}>
              {stats.active} Aktif
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }}>
            {(filtered.filter(p => p.status === 'active').slice(0, 6).length > 0 ? filtered.filter(p => p.status === 'active').slice(0, 6) : [
              { partner_name: 'PT Telkom Indonesia', start_date: '2024-01', end_date: '2027-01' },
              { partner_name: 'Kemendikbud', start_date: '2023-06', end_date: '2026-06' },
              { partner_name: 'Univ. Gadjah Mada', start_date: '2024-03', end_date: '2026-03' },
            ]).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--liquid-bg)', borderRadius: '12px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', minWidth: '92px', fontWeight: '600' }}>{p.start_date?.slice(0, 7) || '-'}</span>
                <div style={{ flex: 1, height: '24px', background: 'var(--glass-bg)', borderRadius: '999px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '70%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '999px' }}></div>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' }}>{p.partner_name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', minWidth: '92px', textAlign: 'right', fontWeight: '600' }}>{p.end_date?.slice(0, 7) || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <input id="search-kerjasama" className="siakad-input" type="text" placeholder="Cari mitra atau no. MoU..." value={search} onChange={e => setSearch(e.target.value)} style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', width: '280px' }} />
          <button id="btn-add-kerjasama" onClick={() => { resetForm(); setShowModal(true); }} className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '10px 24px' }}><i className="ph ph-plus"></i> Tambah Kerjasama</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead><tr>
              {['Mitra', 'Tipe', 'No. MoU', 'Periode', 'PIC', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data kerjasama.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.partner_name || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{tBadge(p.type || 'industri')}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.mou_number || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{p.start_date || '-'} — {p.end_date || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.pic || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status || 'active')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button id={`btn-edit-ks-${p.id}`} onClick={() => openEdit(p)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-pencil-simple"></i></button>
                      <button id={`btn-del-ks-${p.id}`} onClick={() => deletePartnership(p.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalShell title={editId ? 'Edit Kerjasama' : 'Tambah Kerjasama'} onClose={() => setShowModal(false)} footer={<>
          <button id="btn-cancel-ks" onClick={() => setShowModal(false)} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: 'var(--color-text)', padding: '10px 20px',   cursor: 'pointer', fontWeight: '600' }}>Batal</button>
          <button id="btn-save-ks" onClick={savePartnership} disabled={saving} className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '10px 24px' }}>{saving ? 'Menyimpan...' : editId ? 'Perbarui' : 'Tambah'}</button>
        </>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formFields.map(f => (
              <div key={f.key} style={{ marginBottom: '4px', gridColumn: f.span ? 'span 2' : undefined }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
                {f.type === 'select' ? (
                  <CustomSelect
                    value={formData[f.key]}
                    onChange={val => setFormData({ ...formData, [f.key]: val })}
                    options={f.options.map(o => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
                  />
                ) : f.type === 'date' ? (
                  <CustomDatePicker
                    value={formData[f.key]}
                    onChange={val => setFormData({ ...formData, [f.key]: val })}
                    placeholder="Pilih tanggal..."
                  />
                ) : f.type === 'textarea' ? (
                  <textarea id={`input-ks-${f.key}`} className="siakad-input" value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder || ''} rows={3} style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)', resize: 'vertical' }} />
                ) : (
                  <input id={`input-ks-${f.key}`} className="siakad-input" type={f.type || 'text'} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder || ''}  style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} />
                )}
              </div>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
