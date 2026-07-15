"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function AlumniCareerPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applyData, setApplyData] = useState({ cover_letter: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`${apiUrl}/siakad/career/jobs`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setJobs(d.data || d.jobs || []); }
    } catch (e) { setMessage({ text: 'Gagal memuat lowongan kerja.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const applyJob = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const fd = new FormData();
      if (resumeFile) fd.append('resume', resumeFile);
      fd.append('cover_letter', applyData.cover_letter);
      const res = await fetch(`${apiUrl}/siakad/career/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: fd
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Lamaran berhasil dikirim! Semoga sukses.', type: 'success' });
      setAppliedJobs([...appliedJobs, selectedJob.id]);
      setShowApplyModal(false);
      setApplyData({ cover_letter: '' });
      setResumeFile(null);
    } catch (e) { setMessage({ text: 'Gagal mengirim lamaran.', type: 'error' }); }
    finally { setApplying(false); }
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat Karir...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const typeBadge = (type) => {
    const map = { 'full-time': ['#3b82f6', 'Full-time'], 'part-time': ['#f59e0b', 'Part-time'], 'contract': ['#8b5cf6', 'Kontrak'], 'internship': ['#06b6d4', 'Magang'], 'freelance': ['#10b981', 'Freelance'] };
    const [c, l] = map[type] || ['#94a3b8', type || '-'];
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };

  const types = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || (j.position || j.title || '').toLowerCase().includes(q) || (j.company || j.company_name || '').toLowerCase().includes(q) || (j.location || '').toLowerCase().includes(q);
    const matchType = !filterType || j.employment_type === filterType || j.type === filterType;
    return matchSearch && matchType;
  });

  const jobCounts = { total: jobs.length, fulltime: jobs.filter(j => (j.employment_type || j.type) === 'full-time').length, parttime: jobs.filter(j => (j.employment_type || j.type) === 'part-time').length, other: jobs.filter(j => !['full-time', 'part-time'].includes(j.employment_type || j.type)).length };

  const statCards = [
    { label: 'Total Lowongan', value: jobCounts.total, icon: 'ph ph-briefcase', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Full-time', value: jobCounts.fulltime, icon: 'ph ph-buildings', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Part-time', value: jobCounts.parttime, icon: 'ph ph-clock-afternoon', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Sudah Dilamar', value: appliedJobs.length, icon: 'ph ph-paper-plane-tilt', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — ALUMNI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Portal Karir Alumni</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Temukan lowongan kerja terbaru dan lamar langsung dari portal alumni.</p>
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

      {/* Search & Filter */}
      <div className="siakad-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
            <input id="input-search-jobs" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari posisi, perusahaan, lokasi..." style={{ width: '100%', padding: '12px 14px 12px 40px', fontSize: '0.95rem', borderRadius: '30px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }} />
          </div>
          <select id="filter-employment-type" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '12px 18px', borderRadius: '30px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.9rem', cursor: 'pointer' }}>
            <option value="">Semua Tipe</option>
            {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Job Listings */}
      {filtered.length === 0 ? (
        <div className="siakad-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <i className="ph ph-suitcase-simple" style={{ fontSize: '4rem', color: 'var(--color-muted)', opacity: 0.3, display: 'block', marginBottom: '16px' }}></i>
          <h3 style={{ color: 'var(--color-text)', fontWeight: '700', margin: '0 0 8px' }}>Belum Ada Lowongan</h3>
          <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.95rem' }}>Lowongan kerja belum tersedia saat ini. Silakan cek kembali nanti.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(j => {
            const isExpanded = expandedJob === j.id;
            const isApplied = appliedJobs.includes(j.id) || j.applied;
            return (
              <div key={j.id} className="siakad-card" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s', border: isExpanded ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }} onClick={() => setExpandedJob(isExpanded ? null : j.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="ph ph-briefcase" style={{ color: 'white', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text)' }}>{j.position || j.title || '-'}</h3>
                      <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>{j.company || j.company_name || '-'}</p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-map-pin"></i> {j.location || '-'}</span>
                        {j.salary_range && <span style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}><i className="ph ph-money"></i> {j.salary_range}</span>}
                        {j.deadline && <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-calendar"></i> {j.deadline}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {typeBadge(j.employment_type || j.type)}
                    {isApplied && <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>✓ Sudah Dilamar</span>}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                    {j.description && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }}>Deskripsi</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.7 }}>{j.description}</p>
                      </div>
                    )}
                    {j.requirements && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }}>Persyaratan</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{j.requirements}</p>
                      </div>
                    )}
                    {!isApplied && (
                      <button id={`btn-apply-${j.id}`} onClick={() => { setSelectedJob(j); setShowApplyModal(true); }} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <i className="ph ph-paper-plane-tilt"></i> Lamar Sekarang
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <ModalShell title={`Lamar: ${selectedJob?.position || selectedJob?.title || ''}`} onClose={() => setShowApplyModal(false)} footer={
          <>
            <button id="btn-cancel-apply" onClick={() => setShowApplyModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
            <button id="btn-confirm-apply" onClick={applyJob} disabled={applying} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{applying ? 'Mengirim...' : 'Kirim Lamaran'}</button>
          </>
        }>
          <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(59,130,246,0.15)' }}>
            <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>{selectedJob?.company || selectedJob?.company_name}</span>
            <span style={{ color: 'var(--color-muted)', margin: '0 8px' }}>•</span>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>{selectedJob?.location || '-'}</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Upload Resume (PDF)</label>
            <input id="input-resume-file" type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0] || null)} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Cover Letter</label>
            <textarea id="input-cover-letter" value={applyData.cover_letter} onChange={e => setApplyData({ ...applyData, cover_letter: e.target.value })} placeholder="Tuliskan surat lamaran singkat..." rows={6} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
