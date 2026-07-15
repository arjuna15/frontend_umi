"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function PPGManagementPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, dropped: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('peserta');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({ name: '', nip: '', school_origin: '', subject: '', batch: '', start_date: '' });
  const [activityData, setActivityData] = useState({ activity_type: 'workshop', title: '', date: '', score: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [batchData, setBatchData] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/ppg/participants`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/ppg/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (pRes.ok) { const d = await pRes.json(); setParticipants(d.data || d.participants || []); }
      if (sRes.ok) {
        const d = await sRes.json(); const s = d.data || d.stats || d;
        setStats({ total: s.total || 0, active: s.active || 0, completed: s.completed || 0, dropped: s.dropped || 0 });
        setBatchData(s.batch_distribution || [
          { batch: 'Angkatan 1', count: 30 }, { batch: 'Angkatan 2', count: 45 },
          { batch: 'Angkatan 3', count: 38 }, { batch: 'Angkatan 4', count: 52 }, { batch: 'Angkatan 5', count: 28 },
        ]);
      }
    } catch (e) { setMessage({ text: 'Gagal memuat data PPG.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const fetchActivities = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/ppg/participants/${id}/activities`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (res.ok) { const d = await res.json(); setActivities(d.data || d.activities || []); }
    } catch (e) { console.error(e); }
  };

  const addParticipant = async () => {
    if (!formData.name || !formData.nip) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/ppg/participants`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Peserta PPG berhasil didaftarkan!', type: 'success' });
      setShowAddModal(false);
      setFormData({ name: '', nip: '', school_origin: '', subject: '', batch: '', start_date: '' });
      fetchData();
    } catch (e) { setMessage({ text: 'Gagal mendaftarkan peserta.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const addActivity = async () => {
    if (!activityData.title || !selectedParticipant) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/ppg/participants/${selectedParticipant.id}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(activityData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Aktivitas berhasil dicatat!', type: 'success' });
      setShowActivityModal(false);
      setActivityData({ activity_type: 'workshop', title: '', date: '', score: '', notes: '' });
      fetchData();
    } catch (e) { setMessage({ text: 'Gagal menambahkan aktivitas.', type: 'error' }); }
    finally { setSaving(false); }
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const statusBadge = (status) => {
    const map = { registered: ['#f59e0b', 'Terdaftar'], active: ['#3b82f6', 'Aktif'], completed: ['#10b981', 'Selesai'], dropped: ['#ef4444', 'Drop Out'] };
    const [c, l] = map[status] || ['#94a3b8', status];
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat PPG...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Peserta', value: stats.total, icon: 'ph ph-users-three', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Aktif', value: stats.active, icon: 'ph ph-user-circle-check', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Selesai', value: stats.completed, icon: 'ph ph-certificate', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Drop Out', value: stats.dropped, icon: 'ph ph-user-minus', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  const maxBatchCount = Math.max(...batchData.map(b => b.count || 0), 1);
  const tabs = [
    { key: 'peserta', label: 'Peserta', icon: 'ph ph-users' },
    { key: 'aktivitas', label: 'Aktivitas', icon: 'ph ph-list-checks' },
    { key: 'statistik', label: 'Statistik', icon: 'ph ph-chart-bar' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PPG</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen PPG</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola peserta dan aktivitas Program Pendidikan Profesi Guru.</p>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-card)', borderRadius: '14px', padding: '4px', border: '1px solid var(--color-border)' }}>
        {tabs.map(t => (
          <button key={t.key} id={`tab-${t.key}`} onClick={() => { setActiveTab(t.key); if (t.key === 'aktivitas' && selectedParticipant) fetchActivities(selectedParticipant.id); }}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s',
              background: activeTab === t.key ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
              color: activeTab === t.key ? 'white' : 'var(--color-muted)' }}>
            <i className={t.icon}></i> {t.label}
          </button>
        ))}
      </div>

      {/* Peserta Tab */}
      {activeTab === 'peserta' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Data Peserta PPG</h2>
            <button id="btn-add-ppg" onClick={() => setShowAddModal(true)} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph ph-plus"></i> Daftarkan Peserta
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nama', 'NIP', 'Sekolah Asal', 'Bidang Studi', 'Angkatan', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada peserta PPG.</td></tr>
                ) : participants.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.name || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{p.nip || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.school_origin || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.subject || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{p.batch || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(p.status || 'registered')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button id={`btn-activity-${p.id}`} onClick={() => { setSelectedParticipant(p); setShowActivityModal(true); }} title="Tambah Aktivitas" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-note-pencil"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aktivitas Tab */}
      {activeTab === 'aktivitas' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Timeline Aktivitas</h2>
          {!selectedParticipant ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
              <i className="ph ph-cursor-click" style={{ fontSize: '3rem', marginBottom: '12px', display: 'block', opacity: 0.4 }}></i>
              <p>Pilih peserta dari tab Peserta untuk melihat aktivitas.</p>
              <button id="btn-goto-peserta" onClick={() => setActiveTab('peserta')} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: '600', marginTop: '12px' }}>Buka Tab Peserta</button>
            </div>
          ) : (
            <>
              <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(59,130,246,0.15)' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>{selectedParticipant.name}</span>
                <span style={{ color: 'var(--color-muted)', margin: '0 8px' }}>•</span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>{selectedParticipant.subject || '-'}</span>
              </div>
              {activities.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '30px' }}>Belum ada aktivitas tercatat.</p>
              ) : activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingLeft: '8px', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ flex: 1, padding: '12px 16px', background: 'var(--color-bg)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.95rem' }}>{a.title}</span>
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{a.date || '-'}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{a.activity_type} {a.score ? `• Nilai: ${a.score}` : ''}</span>
                    {a.notes && <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '6px 0 0' }}>{a.notes}</p>}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Statistik Tab */}
      {activeTab === 'statistik' && (
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Peserta per Angkatan</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', paddingTop: '10px' }}>
            {batchData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>{b.count}</span>
                <div style={{ width: '100%', maxWidth: '50px', height: `${(b.count / maxBatchCount) * 100}%`, minHeight: '10px', background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s ease' }}></div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>{b.batch}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
            <div style={{ padding: '20px', background: 'rgba(59,130,246,0.05)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: '0 0 4px' }}>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>Tingkat Kelulusan</p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', margin: '0 0 4px' }}>{stats.total > 0 ? Math.round((stats.dropped / stats.total) * 100) : 0}%</p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>Tingkat Drop Out</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddModal && (
        <ModalShell title="Daftarkan Peserta PPG" onClose={() => setShowAddModal(false)} footer={
          <>
            <button id="btn-cancel-ppg" onClick={() => setShowAddModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-ppg" onClick={addParticipant} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Daftarkan'}</button>
          </>
        }>
          {[
            { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama peserta', type: 'text' },
            { label: 'NIP', key: 'nip', placeholder: 'Nomor Induk Pegawai', type: 'text' },
            { label: 'Sekolah Asal', key: 'school_origin', placeholder: 'Nama sekolah', type: 'text' },
            { label: 'Bidang Studi', key: 'subject', placeholder: 'Matematika, IPA, dll', type: 'text' },
            { label: 'Angkatan', key: 'batch', placeholder: 'Contoh: Angkatan 5', type: 'text' },
            { label: 'Tanggal Mulai', key: 'start_date', placeholder: '', type: 'date' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-ppg-${f.key}`} type={f.type} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
            </div>
          ))}
        </ModalShell>
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <ModalShell title="Tambah Aktivitas" onClose={() => setShowActivityModal(false)} footer={
          <>
            <button id="btn-cancel-activity" onClick={() => setShowActivityModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-activity" onClick={addActivity} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </>
        }>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jenis Aktivitas</label>
            <select id="input-activity-type" value={activityData.activity_type} onChange={e => setActivityData({ ...activityData, activity_type: e.target.value })} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              {[['workshop', 'Workshop'], ['teaching_practice', 'Praktik Mengajar'], ['exam', 'Ujian'], ['seminar', 'Seminar'], ['assignment', 'Tugas']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {[
            { label: 'Judul', key: 'title', placeholder: 'Judul aktivitas', type: 'text' },
            { label: 'Tanggal', key: 'date', placeholder: '', type: 'date' },
            { label: 'Nilai', key: 'score', placeholder: '0-100', type: 'number' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-activity-${f.key}`} type={f.type} value={activityData[f.key]} onChange={e => setActivityData({ ...activityData, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
            </div>
          ))}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan</label>
            <textarea id="input-activity-notes" value={activityData.notes} onChange={e => setActivityData({ ...activityData, notes: e.target.value })} placeholder="Catatan tambahan..." rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
