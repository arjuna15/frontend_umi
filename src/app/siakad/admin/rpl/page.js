"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function RPLPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, review: 0, total_sks: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showReview, setShowReview] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [reviewData, setReviewData] = useState({ status: 'approved', credits_recognized: '', reviewer_notes: '' });
  const [monthData, setMonthData] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchData = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [appRes, sRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/rpl/applications`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/rpl/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (appRes.ok) { const d = await appRes.json(); setApplications(d.data || d.applications || []); }
      if (sRes.ok) {
        const sd = await sRes.json(); const s = sd.data || sd.stats || sd;
        setStats({ total: s.total || 0, approved: s.approved || 0, rejected: s.rejected || 0, review: s.review || s.in_review || 0, total_sks: s.total_sks || s.total_credits || 0 });
        setMonthData(s.monthly_distribution || [
          { month: 'Jan', count: 5 }, { month: 'Feb', count: 8 }, { month: 'Mar', count: 12 },
          { month: 'Apr', count: 7 }, { month: 'Mei', count: 15 }, { month: 'Jun', count: 10 },
        ]);
      }
    } catch (e) { console.error(e); setMessage({ text: 'Gagal memuat data RPL.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const submitReview = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/rpl/applications/${selected.id}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: `Pengajuan berhasil di-${reviewData.status === 'approved' ? 'setujui' : 'tolak'}!`, type: 'success' });
      setShowReview(false); setSelected(null); fetchData();
    } catch (e) { setMessage({ text: 'Gagal memproses review.', type: 'error' }); }
    finally { setSaving(false); }
  };

  const openDetail = async (app) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/rpl/applications/${app.id}`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (res.ok) { const d = await res.json(); setSelected(d.data || d.application || app); }
      else setSelected(app);
    } catch (e) { setSelected(app); }
    setShowDetail(true);
  };

  const openReview = (app) => {
    setSelected(app);
    setReviewData({ status: 'approved', credits_recognized: app.credits_recognized || '', reviewer_notes: '' });
    setShowReview(true);
  };

  useEffect(() => { if (!getToken()) router.push('/siakad/login'); else fetchData(); }, []);

  const statusBadge = (s) => {
    const map = { pending: ['#f59e0b', 'Menunggu'], review: ['#3b82f6', 'Dalam Review'], approved: ['#10b981', 'Disetujui'], rejected: ['#ef4444', 'Ditolak'] };
    const [c, l] = map[s] || ['#94a3b8', s];
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>{l}</span>;
  };

  if (loading) return (<div style={{ padding: '24px' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat ...</h1><div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div></div>);

  const statCards = [
    { label: 'Total Pengajuan', value: stats.total, icon: 'ph ph-files', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Disetujui', value: stats.approved, icon: 'ph ph-check-circle', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Ditolak', value: stats.rejected, icon: 'ph ph-x-circle', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Dalam Review', value: stats.review, icon: 'ph ph-hourglass', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Total SKS Diakui', value: stats.total_sks, icon: 'ph ph-graduation-cap', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  const maxMonthCount = Math.max(...monthData.map(m => m.count || 0), 1);
  const filtered = applications.filter(a => !search || (a.name || a.applicant_name || '').toLowerCase().includes(search.toLowerCase()) || (a.institution || a.origin_institution || '').toLowerCase().includes(search.toLowerCase()));

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — RPL</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen RPL</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Rekognisi Pembelajaran Lampau — review dan kelola pengajuan.</p>
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
        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Pengajuan per Bulan</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '10px' }}>
            {monthData.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>{m.count}</span>
                <div style={{ width: '100%', maxWidth: '50px', height: `${(m.count / maxMonthCount) * 100}%`, minHeight: '10px', background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px 8px 4px 4px', transition: 'height 0.5s ease' }}></div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '8px', fontWeight: '600' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="siakad-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 20px 0' }}>Tingkat Persetujuan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '16px' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="var(--color-border)" strokeWidth="12" />
                <circle cx="70" cy="70" r="58" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${(approvalRate / 100) * 364.4} 364.4`} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text)' }}>{approvalRate}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div><span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Disetujui</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div><span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Ditolak</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Daftar Pengajuan RPL</h2>
          <input id="search-rpl" type="text" placeholder="Cari nama atau institusi..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 16px', fontSize: '0.9rem', border: '1px solid var(--color-border)', borderRadius: '10px', background: 'var(--color-bg)', color: 'var(--color-text)', width: '280px' }} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Nama', 'Institusi Asal', 'Prodi Tujuan', 'Pengalaman', 'SKS Diakui', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada pengajuan RPL.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{a.name || a.applicant_name || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.institution || a.origin_institution || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{a.target_program || a.prodi_tujuan || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{a.work_experience || a.pengalaman_kerja || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '700' }}>{a.credits_recognized || a.sks_diakui || 0}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(a.status || 'pending')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button id={`btn-detail-${a.id}`} onClick={() => openDetail(a)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Detail"><i className="ph ph-eye"></i></button>
                      {(a.status === 'pending' || a.status === 'review') && (
                        <button id={`btn-review-${a.id}`} onClick={() => openReview(a)} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Review"><i className="ph ph-stamp"></i></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selected && (
        <ModalShell title="Detail Pengajuan RPL" onClose={() => { setShowDetail(false); setSelected(null); }} footer={
          <button id="btn-close-detail" onClick={() => { setShowDetail(false); setSelected(null); }} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>Tutup</button>
        }>
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              ['Nama', selected.name || selected.applicant_name],
              ['Institusi Asal', selected.institution || selected.origin_institution],
              ['Prodi Tujuan', selected.target_program || selected.prodi_tujuan],
              ['Pengalaman Kerja', selected.work_experience || selected.pengalaman_kerja],
              ['SKS Diakui', selected.credits_recognized || selected.sks_diakui || 0],
              ['Status', selected.status],
              ['Catatan Reviewer', selected.reviewer_notes || '-'],
            ].map(([label, val], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>{val || '-'}</span>
              </div>
            ))}
            {selected.documents && selected.documents.length > 0 && (
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Dokumen</span>
                {selected.documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--color-bg)', borderRadius: '8px', marginBottom: '6px' }}>
                    <i className="ph ph-file-pdf" style={{ color: '#ef4444' }}></i>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{doc.name || doc.filename || `Dokumen ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModalShell>
      )}

      {showReview && selected && (
        <ModalShell title="Review Pengajuan" onClose={() => setShowReview(false)} footer={<>
          <button id="btn-cancel-review" onClick={() => setShowReview(false)} style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
          <button id="btn-submit-review" onClick={submitReview} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>{saving ? 'Memproses...' : 'Simpan Review'}</button>
        </>}>
          <div style={{ marginBottom: '16px', padding: '14px', background: 'var(--color-bg)', borderRadius: '10px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Pemohon</p>
            <p style={{ margin: 0, fontWeight: '700', color: 'var(--color-text)' }}>{selected.name || selected.applicant_name || '-'}</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Keputusan</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['approved', 'rejected'].map(s => (
                <button key={s} id={`btn-decision-${s}`} onClick={() => setReviewData({ ...reviewData, status: s })} style={{ flex: 1, padding: '10px', border: `2px solid ${reviewData.status === s ? (s === 'approved' ? '#10b981' : '#ef4444') : 'var(--color-border)'}`, borderRadius: '10px', cursor: 'pointer', background: reviewData.status === s ? (s === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'transparent', color: reviewData.status === s ? (s === 'approved' ? '#10b981' : '#ef4444') : 'var(--color-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
                  <i className={s === 'approved' ? 'ph ph-check-circle' : 'ph ph-x-circle'} style={{ marginRight: '6px' }}></i>
                  {s === 'approved' ? 'Setujui' : 'Tolak'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Jumlah SKS Diakui</label>
            <input id="input-rpl-credits" type="number" value={reviewData.credits_recognized} onChange={e => setReviewData({ ...reviewData, credits_recognized: e.target.value })} placeholder="Jumlah SKS" style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Catatan Reviewer</label>
            <textarea id="input-rpl-notes" value={reviewData.reviewer_notes} onChange={e => setReviewData({ ...reviewData, reviewer_notes: e.target.value })} placeholder="Catatan review..." rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)', resize: 'vertical' }} />
          </div>
        </ModalShell>
      )}
    </div>
  );
}
