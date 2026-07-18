"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function KepegawaianPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({ total: 0, pns: 0, kontrak: 0, honorer: 0, hadir_hari_ini: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [tab, setTab] = useState('pegawai');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ nip: '', name: '', position: '', department: '', employment_type: 'PNS', join_date: '', phone: '', email: '', salary: '' });
  const [deptData, setDeptData] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [empRes, statsRes, attRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/hrd/employees`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/hrd/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/hrd/attendance`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (empRes.ok) { const d = await empRes.json(); setEmployees(d.data?.data || d.data || d.employees || []); }
      if (statsRes.ok) {
        const sd = await statsRes.json(); const s = sd.data || sd.stats || sd;
        setStats({ total: s.total || 0, pns: s.pns || 0, kontrak: s.kontrak || 0, honorer: s.honorer || 0, hadir_hari_ini: s.hadir_hari_ini || s.present_today || 0 });
        setDeptData(s.department_distribution || [
          { dept: 'Informatika', count: 18 }, { dept: 'Manajemen', count: 14 }, { dept: 'Akuntansi', count: 12 },
          { dept: 'Hukum', count: 9 }, { dept: 'Administrasi', count: 15 },
        ]);
      }
      if (attRes.ok) { const ad = await attRes.json(); setAttendance(ad.data || ad.attendance || []); }
    } catch (e) { console.error(e); setMessage({ text: 'Gagal memuat data kepegawaian.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const saveEmployee = async () => {
    setSaving(true);
    try {
      const url = editId ? `${apiUrl}/siakad/hrd/employees/${editId}` : `${apiUrl}/siakad/hrd/employees`;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: editId ? 'Pegawai berhasil diperbarui!' : 'Pegawai berhasil ditambahkan!', type: 'success' });
      setShowModal(false); resetForm(); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menyimpan data pegawai.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deleteEmployee = async (id) => {
    if (!confirm('Hapus pegawai ini?')) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/hrd/employees/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Pegawai berhasil dihapus.', type: 'success' }); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menghapus pegawai.', type: 'error' }); }
  };

  const openEdit = (emp) => {
    setEditId(emp.id);
    setFormData({ nip: emp.nip || '', name: emp.name || '', position: emp.position || '', department: emp.department || '', employment_type: emp.employment_type || 'PNS', join_date: emp.join_date || '', phone: emp.phone || '', email: emp.email || '', salary: emp.salary || '' });
    setShowModal(true);
  };

  const resetForm = () => { setEditId(null); setFormData({ nip: '', name: '', position: '', department: '', employment_type: 'PNS', join_date: '', phone: '', email: '', salary: '' }); };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const statusBadge = (s) => { const c = s === 'active' ? '#10b981' : s === 'retired' ? '#f59e0b' : '#ef4444'; const l = s === 'active' ? 'Aktif' : s === 'retired' ? 'Pensiun' : 'Nonaktif'; return <span className="siakad-badge-status" style={{ color: c, borderColor: `${c}33`, minWidth: '110px' }}>{l}</span>; };
  const typeBadge = (t) => { const c = t === 'PNS' ? '#3b82f6' : t === 'Kontrak' ? '#8b5cf6' : '#f59e0b'; return <span className="siakad-badge-status" style={{ color: c, borderColor: `${c}33`, minWidth: '110px' }}>{t}</span>; };
  const attBadge = (s) => { const c = s === 'hadir' ? '#10b981' : s === 'izin' ? '#3b82f6' : s === 'sakit' ? '#f59e0b' : '#ef4444'; return <span className="siakad-badge-status" style={{ color: c, borderColor: `${c}33`, minWidth: '110px' }}>{s?.charAt(0).toUpperCase() + s?.slice(1)}</span>; };

  if (loading) return (<div style={{ padding: '24px' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat ...</h1><div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div></div>);

  const statCards = [
    { label: 'Total Pegawai', value: stats.total, icon: 'ph ph-users-three', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'PNS', value: stats.pns, icon: 'ph ph-identification-badge', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Kontrak', value: stats.kontrak, icon: 'ph ph-file-text', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Honorer', value: stats.honorer, icon: 'ph ph-handshake', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Hadir Hari Ini', value: stats.hadir_hari_ini, icon: 'ph ph-check-square', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  const pieData = [
    { label: 'PNS', value: stats.pns || 12, color: '#3b82f6' },
    { label: 'Kontrak', value: stats.kontrak || 8, color: '#8b5cf6' },
    { label: 'Honorer', value: stats.honorer || 5, color: '#f59e0b' },
  ];
  const pieTotal = pieData.reduce((a, d) => a + d.value, 0) || 1;
  let pieGradient = '', cumulative = 0;
  pieData.forEach((d, i) => { const pct = (d.value / pieTotal) * 100; pieGradient += `${d.color} ${cumulative}% ${cumulative + pct}%`; cumulative += pct; if (i < pieData.length - 1) pieGradient += ', '; });
  const maxDeptCount = Math.max(...deptData.map(d => d.count || 0), 1);

  const filtered = Array.isArray(employees) ? employees.filter(e => !search || (e.name || '').toLowerCase().includes(search.toLowerCase()) || (e.nip || '').includes(search)) : [];
  const tabs = [{ key: 'pegawai', label: 'Data Pegawai', icon: 'ph ph-user-list' }, { key: 'kehadiran', label: 'Kehadiran', icon: 'ph ph-calendar-check' }, { key: 'penggajian', label: 'Penggajian', icon: 'ph ph-wallet' }];

  const formFields = [
    { label: 'NIP', key: 'nip', placeholder: 'Nomor Induk Pegawai' },
    { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama lengkap pegawai' },
    { label: 'Jabatan', key: 'position', placeholder: 'Contoh: Dosen Tetap' },
    { label: 'Departemen', key: 'department', placeholder: 'Contoh: Informatika' },
    { label: 'Tipe Pegawai', key: 'employment_type', type: 'select', options: ['PNS', 'Kontrak', 'Honorer'] },
    { label: 'Tanggal Bergabung', key: 'join_date', type: 'date' },
    { label: 'No. Telepon', key: 'phone', placeholder: '08xxxxxxxxxx' },
    { label: 'Email', key: 'email', placeholder: 'email@umiba.ac.id' },
    { label: 'Gaji Pokok', key: 'salary', placeholder: 'Contoh: 5000000', type: 'number' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — HRD</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Kepegawaian</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola data pegawai, kehadiran, dan penggajian.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="siakad-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: s.bg, color: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className={s.icon}></i></div>
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
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statistik HRD</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text)', margin: 0 }}>Distribusi Tipe Pegawai</h3>
            </div>
            <span className="siakad-badge-status" style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', minWidth: '120px' }}>
              {pieTotal} Pegawai
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '160px', height: '160px', borderRadius: '50%', boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)', background: `conic-gradient(${pieGradient})`, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)' }}>{pieTotal}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Total</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px', minWidth: '220px', flex: '1 1 220px' }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'var(--liquid-bg)', borderRadius: '12px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0, boxShadow: '0 0 0 3px rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: '600' }}>{d.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--color-text)', marginLeft: 'auto' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="siakad-card" style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statistik HRD</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text)', margin: 0 }}>Pegawai per Departemen</h3>
            </div>
            <span className="siakad-badge-status" style={{ color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.3)', minWidth: '120px' }}>
              {stats.total} Total
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', minHeight: '220px', paddingTop: '10px' }}>
            {deptData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '6px' }}>{d.count}</span>
                <div style={{ width: '100%', maxWidth: '50px', height: `${(d.count / maxDeptCount) * 100}%`, minHeight: '10px', background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '12px 12px 4px 4px', transition: 'height 0.5s ease', boxShadow: '0 8px 18px rgba(59,130,246,0.18)' }}></div>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>{d.dept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} type="button" id={`tab-${t.key}`} onClick={() => setTab(t.key)} className={tab === t.key ? 'active' : ''} style={{ background: tab === t.key ? 'var(--liquid-bg)' : 'var(--glass-bg)', color: tab === t.key ? 'var(--apple-red)' : 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: tab === t.key ? 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)' : 'var(--glass-shadow)', padding: '12px 18px', borderRadius: '999px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', flex: '0 1 auto' }}>
              <i className={t.icon}></i> {t.label}
            </button>
          ))}
        </div>

        {tab === 'pegawai' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <input id="search-pegawai" className="siakad-input" type="text" placeholder="Cari NIP atau nama..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '280px' }} />
            <button id="btn-add-pegawai" onClick={() => { resetForm(); setShowModal(true); }} className="siakad-btn-primary" style={{ padding: '10px 24px' }}><i className="ph ph-plus"></i> Tambah Pegawai</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['NIP', 'Nama', 'Jabatan', 'Departemen', 'Tipe', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data pegawai.</td></tr>
                ) : filtered.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{e.nip || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{e.name || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{e.position || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{e.department || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>{typeBadge(e.employment_type || 'PNS')}</td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(e.status || 'active')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button id={`btn-edit-${e.id}`} onClick={() => openEdit(e)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-pencil-simple"></i></button>
                        <button id={`btn-del-${e.id}`} onClick={() => deleteEmployee(e.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}

        {tab === 'kehadiran' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['Tanggal', 'Nama', 'Check-in', 'Check-out', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data kehadiran.</td></tr>
                ) : attendance.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.date || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{a.employee_name || a.name || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{a.check_in || '-'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{a.check_out || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>{attBadge(a.status || 'hadir')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'penggajian' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['Nama', 'Jabatan', 'Tipe', 'Gaji Pokok', 'Tunjangan', 'Total'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data penggajian.</td></tr>
                ) : employees.map(e => {
                  const sal = Number(e.salary) || 0;
                  const tunj = Math.round(sal * 0.25);
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{e.name || '-'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{e.position || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>{typeBadge(e.employment_type || 'PNS')}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>Rp {sal.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>Rp {tunj.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '700' }}>Rp {(sal + tunj).toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ModalShell title={editId ? 'Edit Pegawai' : 'Tambah Pegawai'} onClose={() => setShowModal(false)} footer={<>
          <button id="btn-cancel-emp" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
          <button id="btn-save-emp" onClick={saveEmployee} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : editId ? 'Perbarui' : 'Tambah'}</button>
        </>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formFields.map(f => (
              <div key={f.key} style={{ marginBottom: '4px', gridColumn: f.key === 'name' || f.key === 'email' ? 'span 2' : undefined }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
                {f.type === 'select' ? (
                  <CustomSelect
                    value={formData[f.key]}
                    onChange={val => setFormData({ ...formData, [f.key]: val })}
                    options={f.options.map(o => ({ value: o, label: o }))}
                  />
                ) : f.type === 'date' ? (
                  <CustomDatePicker
                    value={formData[f.key]}
                    onChange={val => setFormData({ ...formData, [f.key]: val })}
                    placeholder="Pilih tanggal..."
                  />
                ) : (
                  <input id={`input-${f.key}`} className="siakad-input" type={f.type || 'text'} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder || ''} />
                )}
              </div>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
