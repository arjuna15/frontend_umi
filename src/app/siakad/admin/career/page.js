"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function CareerCenterPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({ total_jobs: 0, active_jobs: 0, total_applicants: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [tab, setTab] = useState('lowongan');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [formData, setFormData] = useState({ company_name: '', position_title: '', location: '', employment_type: 'Full-time', salary_range: '', description: '', requirements: '', deadline: '', contact_email: '', status: 'open' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [jRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/career/jobs`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/career/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (jRes.ok) { const d = await jRes.json(); setJobs(d.data || d.jobs || []); }
      if (sRes.ok) {
        const sd = await sRes.json(); const s = sd.data || sd.stats || sd;
        setStats({ total_jobs: s.total_jobs || s.total || 0, active_jobs: s.active_jobs || s.active || 0, total_applicants: s.total_applicants || 0, accepted: s.accepted || 0 });
        setMonthlyData(s.monthly_applications || [
          { month: 'Jan', count: 12 }, { month: 'Feb', count: 18 }, { month: 'Mar', count: 25 },
          { month: 'Apr', count: 15 }, { month: 'Mei', count: 30 }, { month: 'Jun', count: 22 },
        ]);
      }
    } catch (e) { console.error(e); setMessage({ text: 'Gagal memuat data career center.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/career/jobs/${jobId}/applications`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (res.ok) { const d = await res.json(); setApplicants(d.data || d.applications || []); }
    } catch (e) { console.error(e); }
  };

  const saveJob = async () => {
    if (!formData.position_title || !formData.company_name) return;
    setSaving(true);
    try {
      const url = editId ? `${apiUrl}/siakad/career/jobs/${editId}` : `${apiUrl}/siakad/career/jobs`;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: editId ? 'Lowongan berhasil diperbarui!' : 'Lowongan berhasil ditambahkan!', type: 'success' });
      setShowModal(false); resetForm(); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menyimpan lowongan.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Hapus lowongan ini?')) return;
    try {
      const res = await fetch(`${apiUrl}/siakad/career/jobs/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Lowongan berhasil dihapus.', type: 'success' }); fetchData();
    } catch (e) { setMessage({ text: 'Gagal menghapus lowongan.', type: 'error' }); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/career/applications/${appId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Status pelamar berhasil diperbarui!', type: 'success' });
      if (selectedJob) fetchApplicants(selectedJob);
    } catch (e) { setMessage({ text: 'Gagal memperbarui status.', type: 'error' }); }
  };

  const openEdit = (j) => {
    setEditId(j.id);
    setFormData({ company_name: j.company_name || '', position_title: j.position_title || '', location: j.location || '', employment_type: j.employment_type || 'Full-time', salary_range: j.salary_range || '', description: j.description || '', requirements: j.requirements || '', deadline: j.deadline || '', contact_email: j.contact_email || '', status: j.status || 'open' });
    setShowModal(true);
  };

  const resetForm = () => { setEditId(null); setFormData({ company_name: '', position_title: '', location: '', employment_type: 'Full-time', salary_range: '', description: '', requirements: '', deadline: '', contact_email: '', status: 'open' }); };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const jobBadge = (s) => { const c = s === 'open' ? '#10b981' : s === 'closed' ? '#ef4444' : '#f59e0b'; const l = s === 'open' ? 'Dibuka' : s === 'closed' ? 'Ditutup' : 'Draft'; return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>; };
  const appBadge = (s) => {
    const map = { pending: ['#f59e0b', 'Menunggu'], reviewed: ['#3b82f6', 'Direview'], shortlisted: ['#8b5cf6', 'Shortlist'], rejected: ['#ef4444', 'Ditolak'], accepted: ['#10b981', 'Diterima'] };
    const [c, l] = map[s] || ['#94a3b8', s]; return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };
  const typeBadge = (t) => { const c = t === 'Full-time' ? '#3b82f6' : t === 'Part-time' ? '#8b5cf6' : t === 'Internship' ? '#14b8a6' : '#f59e0b'; return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{t}</span>; };

  if (loading) return (<div style={{ padding: '24px' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat ...</h1><div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div></div>);

  const statCards = [
    { label: 'Total Lowongan', value: stats.total_jobs, icon: 'ph ph-briefcase', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Lowongan Aktif', value: stats.active_jobs, icon: 'ph ph-check-square', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Pelamar', value: stats.total_applicants, icon: 'ph ph-users', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Diterima', value: stats.accepted, icon: 'ph ph-seal-check', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  const maxMonthCount = Math.max(...monthlyData.map(m => m.count || 0), 1);
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(j => !search || (j.company_name || '').toLowerCase().includes(search.toLowerCase()) || (j.position_title || '').toLowerCase().includes(search.toLowerCase())) : [];
  const tabs = [{ key: 'lowongan', label: 'Lowongan Kerja', icon: 'ph ph-briefcase' }, { key: 'pelamar', label: 'Pelamar', icon: 'ph ph-user-list' }];

  const formFields = [
    { label: 'Nama Perusahaan', key: 'company_name', placeholder: 'Nama perusahaan', span: true },
    { label: 'Posisi', key: 'position_title', placeholder: 'Posisi yang ditawarkan', span: true },
    { label: 'Lokasi', key: 'location', placeholder: 'Contoh: Jakarta' },
    { label: 'Tipe Pekerjaan', key: 'employment_type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Contract'] },
    { label: 'Rentang Gaji', key: 'salary_range', placeholder: 'Contoh: 5-10 Juta' },
    { label: 'Deadline', key: 'deadline', type: 'date' },
    { label: 'Email Kontak', key: 'contact_email', placeholder: 'hr@company.com', span: true },
    { label: 'Deskripsi', key: 'description', placeholder: 'Deskripsi pekerjaan...', span: true, type: 'textarea' },
    { label: 'Persyaratan', key: 'requirements', placeholder: 'Persyaratan pelamar...', span: true, type: 'textarea' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KARIR</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Career Center</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola lowongan kerja dan pantau pelamar.</p>
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

      <div className="siakad-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Pelamar per Bulan</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '10px' }}>
          {monthlyData.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>{m.count}</span>
              <div style={{ width: '100%', maxWidth: '50px', height: `${(m.count / maxMonthCount) * 100}%`, minHeight: '10px', background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s ease' }}></div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '600' }}>{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-bg)', borderRadius: '12px', padding: '4px' }}>
          {tabs.map(t => (
            <button key={t.key} id={`tab-career-${t.key}`} onClick={() => { setTab(t.key); if (t.key === 'pelamar' && jobs.length > 0 && !selectedJob) { setSelectedJob(jobs[0].id); fetchApplicants(jobs[0].id); } }} style={{ flex: 1, padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: tab === t.key ? 'var(--color-card)' : 'transparent', color: tab === t.key ? 'var(--color-text)' : 'var(--color-muted)', boxShadow: tab === t.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              <i className={t.icon}></i> {t.label}
            </button>
          ))}
        </div>

        {tab === 'lowongan' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <input id="search-career" className="siakad-input" type="text" placeholder="Cari perusahaan atau posisi..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '280px' }} />
              <button id="btn-add-job" onClick={() => { resetForm(); setShowModal(true); }} className="siakad-btn-primary" style={{ padding: '10px 24px' }}><i className="ph ph-plus"></i> Tambah Lowongan</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredJobs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)', gridColumn: '1 / -1' }}>Belum ada lowongan.</div>
              ) : filteredJobs.map(j => (
                <div key={j.id} style={{ border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px', background: 'var(--color-bg)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', color: 'var(--color-text)', fontWeight: '700', fontSize: '1rem' }}>{j.position_title || '-'}</h4>
                      <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>{j.company_name || '-'}</p>
                    </div>
                    {jobBadge(j.status || 'open')}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    {j.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-muted)' }}><i className="ph ph-map-pin"></i>{j.location}</span>}
                    {typeBadge(j.employment_type || 'Full-time')}
                    {j.salary_range && <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-money"></i>{j.salary_range}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-users" style={{ color: 'var(--color-muted)' }}></i>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>{j.applicant_count || 0} pelamar</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button id={`btn-edit-job-${j.id}`} onClick={() => openEdit(j)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-pencil-simple"></i></button>
                      <button id={`btn-del-job-${j.id}`} onClick={() => deleteJob(j.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><i className="ph ph-trash"></i></button>
                    </div>
                  </div>
                  {j.deadline && <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--color-muted)' }}><i className="ph ph-calendar" style={{ marginRight: '4px' }}></i>Deadline: {j.deadline}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'pelamar' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Pilih Lowongan</label>
              <CustomSelect
                value={selectedJob || ''}
                onChange={val => { setSelectedJob(val); fetchApplicants(val); }}
                options={[
                  { value: '', label: '-- Pilih Lowongan --' },
                  ...jobs.map(j => ({ value: j.id.toString(), label: `${j.position_title} - ${j.company_name}` }))
                ]}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Nama', 'Email', 'No. HP', 'Tanggal Lamar', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applicants.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>{selectedJob ? 'Belum ada pelamar.' : 'Pilih lowongan terlebih dahulu.'}</td></tr>
                  ) : applicants.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{a.name || a.applicant_name || '-'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.email || '-'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.phone || '-'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{a.applied_at || a.created_at || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>{appBadge(a.status || 'pending')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <CustomSelect
                          value={a.status || 'pending'}
                          onChange={val => updateAppStatus(a.id, val)}
                          options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'reviewed', label: 'Reviewed' },
                            { value: 'shortlisted', label: 'Shortlisted' },
                            { value: 'accepted', label: 'Accepted' },
                            { value: 'rejected', label: 'Rejected' }
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <ModalShell title={editId ? 'Edit Lowongan' : 'Tambah Lowongan'} onClose={() => setShowModal(false)} maxWidth="700px" footer={
          <>
            <button id="btn-cancel-job" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-save-job" onClick={saveJob} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Menyimpan...' : editId ? 'Perbarui' : 'Tambah'}</button>
          </>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formFields.map(f => (
              <div key={f.key} style={{ marginBottom: '4px', gridColumn: f.span ? 'span 2' : undefined }}>
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
                    placeholder="Pilih deadline..."
                  />
                ) : f.type === 'textarea' ? (
                  <textarea id={`input-job-${f.key}`} className="siakad-input" value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder || ''} rows={3} style={{ resize: 'vertical' }} />
                ) : (
                  <input id={`input-job-${f.key}`} className="siakad-input" type={f.type || 'text'} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder || ''} />
                )}
              </div>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
