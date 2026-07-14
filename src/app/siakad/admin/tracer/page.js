"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function TracerStudyAdminPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, response_rate: 0, avg_satisfaction: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ user_search: '', graduation_year: '', program: '' });
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
        setStats({
          total: s.total || s.total_alumni || 0,
          completed: s.completed || s.surveys_completed || 0,
          response_rate: s.response_rate || 0,
          avg_satisfaction: s.avg_satisfaction || s.average_satisfaction || 0
        });
        setSatisfactionData(s.satisfaction_distribution || [
          { label: 'Sangat Puas', value: 35, color: '#10b981' },
          { label: 'Puas', value: 40, color: '#3b82f6' },
          { label: 'Cukup', value: 15, color: '#f59e0b' },
          { label: 'Kurang', value: 10, color: '#ef4444' },
        ]);
        setYearData(s.year_distribution || [
          { year: '2020', count: 120 },
          { year: '2021', count: 145 },
          { year: '2022', count: 180 },
          { year: '2023', count: 160 },
          { year: '2024', count: 95 },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data tracer study.', type: 'error' });
    } finally { setLoading(false); }
  };

  const addAlumni = async () => {
    if (!formData.graduation_year) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/tracer/alumni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Alumni berhasil ditambahkan!', type: 'success' });
      setShowAddModal(false);
      setFormData({ user_search: '', graduation_year: '', program: '' });
      fetchData();
    } catch (e) {
      setMessage({ text: 'Gagal menambahkan alumni.', type: 'error' });
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
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
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
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Pie Chart */}
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Distribusi Kepuasan</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
            <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(${pieGradient})`, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>{stats.response_rate}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Respons</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {satisfactionData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{d.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text)', marginLeft: 'auto' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Alumni per Tahun Lulus</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '10px' }}>
            {yearData.map((y, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>{y.count}</span>
                <div style={{ width: '100%', maxWidth: '50px', height: `${(y.count / maxYearCount) * 100}%`, minHeight: '10px', background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s ease' }}></div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '600' }}>{y.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="siakad-card" style={{ padding: '24px' }}>
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{a.name || a.user_name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.nim || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.program || a.prodi || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{a.graduation_year || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{surveyBadge(a.survey_status || 'pending')}</td>
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
              <button id="btn-cancel-alumni" onClick={() => setShowAddModal(false)} className="btn" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--glass-bg)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Batal</button>
              <button id="btn-confirm-alumni" onClick={addAlumni} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px', borderRadius: '10px' }}>
                {saving ? 'Menyimpan...' : 'Tambah Alumni'}
              </button>
            </>
          }
        >
          {[
            { label: 'Cari User', key: 'user_search', placeholder: 'Nama atau NIM...' },
            { label: 'Tahun Lulus', key: 'graduation_year', placeholder: 'Contoh: 2024' },
            { label: 'Program Studi', key: 'program', placeholder: 'Contoh: Teknik Informatika' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-alumni-${f.key}`} type="text" value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </ModalShell>
      )}
    </div>
  );
}
