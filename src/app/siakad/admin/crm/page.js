"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';

export default function CRMCamabaPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, interested: 0, registered: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', school_origin: '', program_interest: '', source: 'website' });
  const [followUpData, setFollowUpData] = useState({ method: 'whatsapp', notes: '' });
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/crm/prospects`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/crm/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (pRes.ok) { const d = await pRes.json(); setProspects(d.data || d.prospects || []); }
      if (sRes.ok) {
        const d = await sRes.json(); const s = d.data || d.stats || d;
        setStats({ total: s.total || 0, new: s.new || 0, contacted: s.contacted || 0, interested: s.interested || 0, registered: s.registered || 0, lost: s.lost || 0 });
      }
    } catch (e) { setMessage({ text: 'Gagal memuat data CRM.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const addProspect = async () => {
    if (!formData.name || !formData.phone) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/crm/prospects`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Prospek berhasil ditambahkan!', type: 'success' });
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', school_origin: '', program_interest: '', source: 'website' });
      fetchData();
    } catch (e) { setMessage({ text: 'Gagal menambahkan prospek.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const addFollowUp = async () => {
    if (!followUpData.notes || !selectedProspect) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/crm/prospects/${selectedProspect.id}/followup`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(followUpData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Follow-up berhasil dicatat!', type: 'success' });
      setShowFollowUpModal(false);
      setFollowUpData({ method: 'whatsapp', notes: '' });
      fetchData();
    } catch (e) { setMessage({ text: 'Gagal menambahkan follow-up.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deleteProspect = async (id) => {
    if (!confirm('Hapus prospek ini?')) return;
    try {
      await fetch(`${apiUrl}/siakad/crm/prospects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
      setMessage({ text: 'Prospek dihapus.', type: 'success' }); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menghapus.', type: 'error' }); }
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const statusBadge = (status) => {
    const map = { new: ['#3b82f6', 'Baru'], contacted: ['#f59e0b', 'Dihubungi'], interested: ['#8b5cf6', 'Tertarik'], registered: ['#10b981', 'Terdaftar'], lost: ['#ef4444', 'Hilang'] };
    const [c, l] = map[status] || ['#94a3b8', status];
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat CRM...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Prospek', value: stats.total, icon: 'ph ph-address-book', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Baru', value: stats.new, icon: 'ph ph-user-plus', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Sudah Dihubungi', value: stats.contacted, icon: 'ph ph-phone-outgoing', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Tertarik', value: stats.interested, icon: 'ph ph-heart', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Terdaftar', value: stats.registered, icon: 'ph ph-check-circle', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Hilang', value: stats.lost, icon: 'ph ph-user-minus', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  const funnel = [
    { label: 'Baru', value: stats.new, color: '#3b82f6' },
    { label: 'Dihubungi', value: stats.contacted, color: '#f59e0b' },
    { label: 'Tertarik', value: stats.interested, color: '#8b5cf6' },
    { label: 'Terdaftar', value: stats.registered, color: '#10b981' },
  ];
  const funnelMax = Math.max(...funnel.map(f => f.value), 1);

  const sourceData = [
    { label: 'Website', value: prospects.filter(p => p.source === 'website').length || 12, color: '#3b82f6' },
    { label: 'Instagram', value: prospects.filter(p => p.source === 'instagram').length || 8, color: '#e11d48' },
    { label: 'WhatsApp', value: prospects.filter(p => p.source === 'whatsapp').length || 15, color: '#22c55e' },
    { label: 'Pameran', value: prospects.filter(p => p.source === 'pameran').length || 6, color: '#f59e0b' },
    { label: 'Referral', value: prospects.filter(p => p.source === 'referral').length || 4, color: '#8b5cf6' },
  ];
  const srcTotal = sourceData.reduce((a, d) => a + d.value, 0) || 1;
  let srcGradient = '', srcCum = 0;
  sourceData.forEach((d, i) => {
    const pct = (d.value / srcTotal) * 100;
    srcGradient += `${d.color} ${srcCum}% ${srcCum + pct}%`;
    srcCum += pct;
    if (i < sourceData.length - 1) srcGradient += ', ';
  });

  const filtered = prospects.filter(p => {
    const q = search.toLowerCase();
    return !q || (p.name || '').toLowerCase().includes(q) || (p.phone || '').includes(q) || (p.school_origin || '').toLowerCase().includes(q);
  });

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — CRM</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>CRM Calon Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola dan pantau prospek calon mahasiswa baru dari berbagai sumber.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="siakad-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: s.bg, color: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className={s.icon}></i>
              </div>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Funnel + Source Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Funnel Konversi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {funnel.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text)' }}>{f.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: f.color }}>{f.value} ({funnelMax > 0 ? Math.round((f.value / funnelMax) * 100) : 0}%)</span>
                </div>
                <div style={{ height: '28px', background: 'var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ width: `${(f.value / funnelMax) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${f.color}, ${f.color}aa)`, borderRadius: '14px', transition: 'width 0.6s ease', minWidth: f.value > 0 ? '24px' : '0' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Sumber Prospek</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
            <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(${srcGradient})`, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>{srcTotal}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Total</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sourceData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{d.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text)', marginLeft: 'auto' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prospects Table */}
      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Daftar Prospek</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
              <input id="input-search-prospect" className="siakad-input" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama/telepon/sekolah..." style={{ paddingLeft: '46px', minWidth: '220px' }} />
            </div>
            <button id="btn-add-prospect" onClick={() => setShowAddModal(true)} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph ph-plus"></i> Tambah Prospek
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nama', 'Telepon', 'Asal Sekolah', 'Minat Prodi', 'Sumber', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data prospek.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.phone || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.school_origin || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.program_interest || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{p.source || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status || 'new')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button id={`btn-followup-${p.id}`} onClick={() => { setSelectedProspect(p); setShowFollowUpModal(true); }} title="Follow Up" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-chat-circle-dots"></i></button>
                      <button id={`btn-delete-${p.id}`} onClick={() => deleteProspect(p.id)} title="Hapus" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Prospect Modal */}
      {showAddModal && (
        <ModalShell title="Tambah Prospek Baru" onClose={() => setShowAddModal(false)} footer={
          <>
            <button id="btn-cancel-prospect" onClick={() => setShowAddModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-prospect" onClick={addProspect} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Tambah Prospek'}</button>
          </>
        }>
          {[
            { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama calon mahasiswa' },
            { label: 'Email', key: 'email', placeholder: 'email@contoh.com' },
            { label: 'No. Telepon', key: 'phone', placeholder: '08xxxxxxxxxx' },
            { label: 'Asal Sekolah', key: 'school_origin', placeholder: 'SMA/SMK/MA' },
            { label: 'Minat Program Studi', key: 'program_interest', placeholder: 'Teknik Informatika' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-prospect-${f.key}`} className="siakad-input" type="text" value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} />
            </div>
          ))}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Sumber</label>
            <CustomSelect
              value={formData.source}
              onChange={val => setFormData({ ...formData, source: val })}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'pameran', label: 'Pameran' },
                { value: 'referral', label: 'Referral' }
              ]}
            />
          </div>
        </ModalShell>
      )}

      {/* Follow-Up Modal */}
      {showFollowUpModal && (
        <ModalShell title={`Follow-up: ${selectedProspect?.name || ''}`} onClose={() => setShowFollowUpModal(false)} footer={
          <>
            <button id="btn-cancel-followup" onClick={() => setShowFollowUpModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-followup" onClick={addFollowUp} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan Follow-up'}</button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Metode</label>
            <CustomSelect
              value={followUpData.method}
              onChange={val => setFollowUpData({ ...followUpData, method: val })}
              options={[
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'phone', label: 'Telepon' },
                { value: 'email', label: 'Email' },
                { value: 'visit', label: 'Kunjungan' }
              ]}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan</label>
            <textarea id="input-followup-notes" className="siakad-input" value={followUpData.notes} onChange={e => setFollowUpData({ ...followUpData, notes: e.target.value })} placeholder="Catatan follow-up..." rows={4} style={{ resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
