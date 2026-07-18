"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';

export default function TracerStudyAdminPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, response_rate: 0, avg_satisfaction: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ user_search: '', graduation_year: '', program_studi: '' });
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [yearData, setYearData] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [alumniRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/tracer/alumni`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/tracer/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (alumniRes.ok) {
        const ad = await alumniRes.json();
        setAlumni(ad.data || ad.alumni || []);
      }
      if (statsRes.ok) {
        const sd = await statsRes.json();
        const s = sd.data || sd.stats || sd;
        const totalAlumni = s.total_alumni || s.total || 0;
        const totalSurveys = s.total_surveys || s.completed || 0;
        setStats({
          total: totalAlumni,
          completed: totalSurveys,
          response_rate: totalAlumni > 0 ? Math.round((totalSurveys / totalAlumni) * 100) : 0,
          avg_satisfaction: s.avg_satisfaction || s.average_satisfaction || 0
        });
        setSatisfactionData(s.satisfaction_distribution || [
          { label: 'Sangat Puas', value: 35, color: '#10b981' },
          { label: 'Puas', value: 40, color: '#3b82f6' },
          { label: 'Cukup', value: 15, color: '#f59e0b' },
          { label: 'Kurang', value: 10, color: '#ef4444' },
        ]);
        const byYear = s.by_graduation_year || s.year_distribution || [];
        setYearData(byYear.length > 0 ? byYear.map(y => ({ year: String(y.graduation_year || y.year), count: y.total || y.count || 0 })) : [
          { year: '2020', count: 0 },
          { year: '2021', count: 0 },
          { year: '2022', count: 0 },
          { year: '2023', count: 0 },
          { year: '2024', count: 0 },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data tracer study.', type: 'error' });
    } finally { setLoading(false); }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) { setUserSearchResults([]); return; }
    try {
      const res = await fetch(`${apiUrl}/siakad/admin/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.data || [];
        const q = query.toLowerCase();
        const filtered = all.filter(u => 
          (u.role === 'mahasiswa') && 
          ((u.name || '').toLowerCase().includes(q) || (u.nim_nip || '').toLowerCase().includes(q))
        ).slice(0, 5);
        setUserSearchResults(filtered);
      }
    } catch (e) { console.error(e); }
  };

  const addAlumni = async () => {
    if (!selectedUser) {
      setModalError('Pilih user terlebih dahulu dari hasil pencarian.');
      return;
    }
    if (!formData.graduation_year) {
      setModalError('Tahun lulus wajib diisi.');
      return;
    }
    if (!formData.program_studi) {
      setModalError('Program studi wajib dipilih.');
      return;
    }
    setModalError('');
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/tracer/alumni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({
          user_id: selectedUser.id,
          graduation_year: parseInt(formData.graduation_year),
          program_studi: formData.program_studi,
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal menyimpan data');
      }
      setMessage({ text: 'Alumni berhasil ditambahkan!', type: 'success' });
      setShowAddModal(false);
      setModalError('');
      setFormData({ user_search: '', graduation_year: '', program_studi: '' });
      setSelectedUser(null);
      setUserSearchResults([]);
      fetchData();
    } catch (e) {
      setModalError(e.message || 'Gagal menambahkan alumni.');
    } finally { setSaving(false); }
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/tracer/export`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tracer_study_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMessage({ text: 'File CSV berhasil diunduh!', type: 'success' });
    } catch (e) {
      setMessage({ text: 'Gagal mengunduh CSV.', type: 'error' });
    } finally { setExporting(false); }
  };

  useEffect(() => { fetchData(); }, [router]);

  const surveyBadge = (status) => {
    const c = status === 'completed' ? '#10b981' : status === 'partial' ? '#f59e0b' : '#94a3b8';
    const l = status === 'completed' ? 'Selesai' : status === 'partial' ? 'Sebagian' : 'Belum';
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Tracer Study...</h1>
      <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Alumni', value: stats.total, icon: 'ph ph-users', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Survei Selesai', value: stats.completed, icon: 'ph ph-check-circle', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Respons Rate', value: `${stats.response_rate}%`, icon: 'ph ph-chart-line-up', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Rata-rata Kepuasan', value: stats.avg_satisfaction.toFixed ? stats.avg_satisfaction.toFixed(1) : stats.avg_satisfaction, icon: 'ph ph-star', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  // Build conic gradient for pie chart
  const pieTotal = satisfactionData.reduce((a, d) => a + (d.value || 0), 0) || 1;
  let pieGradient = '';
  let cumulative = 0;
  satisfactionData.forEach((d, i) => {
    const pct = (d.value / pieTotal) * 100;
    pieGradient += `${d.color} ${cumulative}% ${cumulative + pct}%`;
    cumulative += pct;
    if (i < satisfactionData.length - 1) pieGradient += ', ';
  });

  const maxYearCount = Math.max(...yearData.map(y => y.count || 0), 1);

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ALUMNI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Tracer Study</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Pantau dan analisis data lulusan serta tingkat kepuasan alumni.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '14px 20px', borderRadius: '50px', marginBottom: '24px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.2rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '40px', height: '40px',   borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className={s.icon}></i>
              </div>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: '600' }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Pie Chart */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Distribusi Kepuasan</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
              background: `conic-gradient(from 180deg, ${satisfactionData.map((d, idx) => `${d.color} ${satisfactionData.slice(0, idx).reduce((acc, curr) => acc + (curr.value / 100) * 360, 0)}deg ${satisfactionData.slice(0, idx + 1).reduce((acc, curr) => acc + (curr.value / 100) * 360, 0)}deg`).join(', ')})`,
              position: 'relative',
              flexShrink: 0
            }}>
              <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%',  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>{stats.response_rate}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Respons</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {satisfactionData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', width: '12px', height: '12px', borderRadius: '3px',  flexShrink: 0 }}></div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{d.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text)', marginLeft: 'auto' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Alumni per Tahun Lulus</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '10px' }}>
            {yearData.map((y, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--apple-red)', marginBottom: '6px' }}>{y.count}</span>
                <div style={{ width: '100%', maxWidth: '50px', borderRadius: '10px', background: 'var(--liquid-bg)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: `${Math.max((y.count / maxYearCount) * 100, 5)}%`, background: 'linear-gradient(180deg, var(--apple-red) 0%, #9b1c2e 100%)', borderRadius: '10px', transition: 'height 0.8s cubic-bezier(0.25,1,0.5,1)', boxShadow: '0 -2px 6px rgba(196,30,58,0.3)' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '700' }}>{y.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Data Alumni</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button id="btn-export-csv" onClick={exportCSV} disabled={exporting} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 18px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
              <i className="ph ph-file-csv"></i> {exporting ? 'Mengunduh...' : 'Export CSV'}
            </button>
            <button id="btn-add-alumni" onClick={() => setShowAddModal(true)} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph ph-plus"></i> Tambah Alumni
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
            <thead>
              <tr>
                {['Nama', 'NIM', 'Program Studi', 'Tahun Lulus', 'Status Survei'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alumni.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data alumni.</td></tr>
              ) : alumni.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{a.user?.name || a.name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.user?.nim_nip || a.nim_nip || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.program_studi || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{a.graduation_year || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{surveyBadge(a.surveys && a.surveys.length > 0 ? 'completed' : 'pending')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Alumni Modal */}
      {showAddModal && (
        <ModalShell
          title="Tambah Alumni"
          subtitle="Pelacakan Lulusan"
          icon="ph-graduation-cap"
          onClose={() => setShowAddModal(false)}
          footer={
            <>
              <button id="btn-cancel-alumni" onClick={() => setShowAddModal(false)} className="btn" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', color: 'var(--color-text)', padding: '10px 20px',   cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Batal</button>
              <button id="btn-confirm-alumni" onClick={addAlumni} disabled={saving} className="siakad-btn-primary" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)', padding: '10px 24px' }}>
                {saving ? 'Menyimpan...' : 'Tambah Alumni'}
              </button>
            </>
          }
        >
          {/* Error message inside modal */}
          {modalError && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph-fill ph-warning-circle" style={{ fontSize: '1.1rem' }}></i>{modalError}
            </div>
          )}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Cari User (Nama/NIM)</label>
            <input id="input-alumni-user_search" className="siakad-input" type="text" value={selectedUser ? `${selectedUser.name} (${selectedUser.nim_nip || ''})` : formData.user_search} onChange={e => { setSelectedUser(null); setModalError(''); setFormData({ ...formData, user_search: e.target.value }); searchUsers(e.target.value); }} placeholder="Ketik min 2 karakter..."  style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: selectedUser ? '2px solid #10b981' : 'var(--inset-border)', color: 'var(--color-text)' }} />
            {selectedUser && <span style={{ position: 'absolute', right: '12px', top: '38px', color: '#10b981', fontSize: '1.1rem' }}><i className="ph-fill ph-check-circle"></i></span>}
            {userSearchResults.length > 0 && !selectedUser && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                {userSearchResults.map(u => (
                  <div key={u.id} onClick={() => { setSelectedUser(u); setUserSearchResults([]); setModalError(''); setFormData({ ...formData, user_search: '' }); }} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text)', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(196,30,58,0.08)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <strong>{u.name}</strong> <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>— {u.nim_nip || u.email}</span>
                  </div>
                ))}
              </div>
            )}
            {formData.user_search.length >= 2 && userSearchResults.length === 0 && !selectedUser && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginTop: '4px', padding: '12px 16px', color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                <i className="ph ph-magnifying-glass" style={{ marginRight: '6px' }}></i>Tidak ada mahasiswa ditemukan
              </div>
            )}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Tahun Lulus</label>
            <input id="input-alumni-graduation_year" className="siakad-input" type="number" value={formData.graduation_year} onChange={e => setFormData({ ...formData, graduation_year: e.target.value })} placeholder="Contoh: 2024" min="2000" max="2099"  style={{ boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: 'var(--liquid-bg)', border: 'var(--inset-border)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Program Studi</label>
            <CustomSelect
              value={formData.program_studi}
              onChange={val => setFormData({ ...formData, program_studi: val })}
              options={[
                { value: 'Sistem Informasi', label: 'Sistem Informasi' },
                { value: 'Teknik Komputer', label: 'Teknik Komputer' },
                { value: 'Manajemen', label: 'Manajemen' },
                { value: 'Ilmu Hukum', label: 'Ilmu Hukum' },
                { value: 'Aktuaria', label: 'Aktuaria' },
                { value: 'Magister Manajemen', label: 'Magister Manajemen' }
              ]}
            />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
