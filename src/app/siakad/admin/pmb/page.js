"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import ModalShell from '../../components/ModalShell';

export default function PMBAdminPage() {
  const router = useRouter();
  const [dashStats, setDashStats] = useState({ total_periods: 0, total_applicants: 0, accepted: 0, rejected: 0, pending: 0 });
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [periodForm, setPeriodForm] = useState({ name: '', academic_year: '', start_date: '', end_date: '', status: 'open', quota: '' });
  const [saving, setSaving] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [showApplicantDetail, setShowApplicantDetail] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchDashboard = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const [dashRes, periodsRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/pmb/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/pmb/periods`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (dashRes.ok) {
        const d = await dashRes.json();
        const s = d.data || d.stats || d;
        setDashStats({ total_periods: s.total_periods || 0, total_applicants: s.total_applicants || 0, accepted: s.accepted || 0, rejected: s.rejected || 0, pending: s.pending || 0 });
      }
      if (periodsRes.ok) {
        const p = await periodsRes.json();
        setPeriods(p.data || p.periods || []);
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data PMB.', type: 'error' });
    } finally { setLoading(false); }
  };

  const savePeriod = async () => {
    setSaving(true);
    try {
      const url = editingPeriod
        ? `${apiUrl}/siakad/pmb/periods/${editingPeriod.id}`
        : `${apiUrl}/siakad/pmb/periods`;
      const method = editingPeriod ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(periodForm)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: `Periode berhasil ${editingPeriod ? 'diperbarui' : 'dibuat'}!`, type: 'success' });
      setShowPeriodModal(false);
      setEditingPeriod(null);
      setPeriodForm({ name: '', academic_year: '', start_date: '', end_date: '', status: 'open', quota: '' });
      fetchDashboard();
    } catch (e) {
      setMessage({ text: 'Gagal menyimpan periode.', type: 'error' });
    } finally { setSaving(false); }
  };

  const openEditPeriod = (p) => {
    setEditingPeriod(p);
    setPeriodForm({ name: p.name || '', academic_year: p.academic_year || '', start_date: p.start_date || '', end_date: p.end_date || '', status: p.status || 'open', quota: p.quota || '' });
    setShowPeriodModal(true);
  };

  const viewApplicants = async (period) => {
    setSelectedPeriod(period);
    setLoadingApplicants(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/pmb/applicants/${period.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setApplicants(data.data || data.applicants || []);
    } catch (e) { setApplicants([]); } finally { setLoadingApplicants(false); }
  };

  const viewApplicantDetail = async (applicant) => {
    try {
      const res = await fetch(`${apiUrl}/siakad/pmb/applicant/${applicant.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShowApplicantDetail(data.data || data.applicant || applicant);
      } else {
        setShowApplicantDetail(applicant);
      }
    } catch (e) { setShowApplicantDetail(applicant); }
  };

  const updateApplicantStatus = async (applicantId, status) => {
    setUpdatingStatus(applicantId);
    try {
      const res = await fetch(`${apiUrl}/siakad/pmb/status/${applicantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: `Status pendaftar berhasil diperbarui ke ${status}.`, type: 'success' });
      if (selectedPeriod) viewApplicants(selectedPeriod);
      fetchDashboard();
      if (showApplicantDetail) setShowApplicantDetail({ ...showApplicantDetail, status });
    } catch (e) {
      setMessage({ text: 'Gagal memperbarui status.', type: 'error' });
    } finally { setUpdatingStatus(null); }
  };

  useEffect(() => { fetchDashboard(); }, [router]);

  const statusBadge = (status) => {
    const colors = { open: '#10b981', closed: '#ef4444', upcoming: '#f59e0b', pending: '#f59e0b', verified: '#3b82f6', accepted: '#10b981', rejected: '#ef4444' };
    const c = colors[status] || '#94a3b8';
    return <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>{status}</span>;
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat PMB...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Periode', value: dashStats.total_periods, icon: 'ph ph-calendar', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Total Pendaftar', value: dashStats.total_applicants, icon: 'ph ph-users', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Diterima', value: dashStats.accepted, icon: 'ph ph-check-circle', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Ditolak', value: dashStats.rejected, icon: 'ph ph-x-circle', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Menunggu', value: dashStats.pending, icon: 'ph ph-clock', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PENERIMAAN</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Penerimaan Mahasiswa Baru</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola periode PMB, verifikasi pendaftar, dan pantau penerimaan.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="siakad-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: s.bg, color: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className={s.icon}></i>
              </div>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem', fontWeight: '600' }}>{s.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Periods + Applicants */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPeriod ? '380px 1fr' : '1fr', gap: '24px' }}>
        {/* Periods List */}
        <div className="siakad-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Periode PMB</h2>
            <button id="btn-add-period" onClick={() => { setEditingPeriod(null); setPeriodForm({ name: '', academic_year: '', start_date: '', end_date: '', status: 'open', quota: '' }); setShowPeriodModal(true); }} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <i className="ph ph-plus"></i> Tambah
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {periods.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '24px 0' }}>Belum ada periode PMB.</p>
            ) : periods.map(p => (
              <div key={p.id} onClick={() => viewApplicants(p)} style={{ padding: '14px 16px', borderRadius: '12px', background: selectedPeriod?.id === p.id ? 'rgba(59,130,246,0.1)' : 'var(--color-surface)', border: selectedPeriod?.id === p.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--color-border)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text)' }}>{p.name || p.academic_year || '-'}</h4>
                  {statusBadge(p.status)}
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: 'var(--color-muted)' }}>{p.academic_year} • Kuota: {p.quota || '-'}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button id={`btn-edit-period-${p.id}`} onClick={e => { e.stopPropagation(); openEditPeriod(p); }} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                    <i className="ph ph-pencil"></i> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        {selectedPeriod && (
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Pendaftar</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{selectedPeriod.name || selectedPeriod.academic_year}</p>
              </div>
              <button onClick={() => setSelectedPeriod(null)} style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            {loadingApplicants ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}><i className="ph ph-spinner" style={{ animation: 'pwaSpin 1s linear infinite', fontSize: '1.5rem' }}></i></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Nama', 'Email', 'Program', 'Status', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada pendaftar.</td></tr>
                    ) : applicants.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text)', fontWeight: '600', cursor: 'pointer' }} onClick={() => viewApplicantDetail(a)}>{a.name || '-'}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-muted)' }}>{a.email || '-'}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-muted)' }}>{a.program_choice || a.program || '-'}</td>
                        <td style={{ padding: '12px 14px' }}>{statusBadge(a.status)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {a.status !== 'verified' && <button id={`btn-verify-${a.id}`} onClick={() => updateApplicantStatus(a.id, 'verified')} disabled={updatingStatus === a.id} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Verifikasi</button>}
                            {a.status !== 'accepted' && <button id={`btn-accept-${a.id}`} onClick={() => updateApplicantStatus(a.id, 'accepted')} disabled={updatingStatus === a.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Terima</button>}
                            {a.status !== 'rejected' && <button id={`btn-reject-${a.id}`} onClick={() => updateApplicantStatus(a.id, 'rejected')} disabled={updatingStatus === a.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Tolak</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Period Modal */}
      {showPeriodModal && (
        <ModalShell
          title={editingPeriod ? 'Edit Periode' : 'Tambah Periode PMB'}
          subtitle="Penerimaan Mahasiswa Baru"
          icon="ph-calendar"
          onClose={() => setShowPeriodModal(false)}
          footer={
            <>
              <button id="btn-cancel-period" onClick={() => setShowPeriodModal(false)} className="btn" style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
              <button id="btn-save-period" onClick={savePeriod} disabled={saving} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', cursor: 'pointer', fontWeight: '600', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          }
        >
          {[
            { label: 'Nama Periode', key: 'name', type: 'text', placeholder: 'Contoh: Gelombang 1' },
            { label: 'Tahun Akademik', key: 'academic_year', type: 'text', placeholder: 'Contoh: 2025/2026' },
            { label: 'Tanggal Mulai', key: 'start_date', type: 'date' },
            { label: 'Tanggal Selesai', key: 'end_date', type: 'date' },
            { label: 'Kuota', key: 'quota', type: 'number', placeholder: 'Jumlah kuota' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              <input id={`input-period-${f.key}`} type={f.type} value={periodForm[f.key]} onChange={e => setPeriodForm({ ...periodForm, [f.key]: e.target.value })} placeholder={f.placeholder || ''} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Status</label>
            <select id="input-period-status" value={periodForm.status} onChange={e => setPeriodForm({ ...periodForm, status: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}>
              <option value="open">Dibuka</option>
              <option value="closed">Ditutup</option>
              <option value="upcoming">Akan Datang</option>
            </select>
          </div>
        </ModalShell>
      )}

      {/* Applicant Detail Modal */}
      {showApplicantDetail && (
        <ModalShell
          title="Detail Pendaftar"
          subtitle="Biodata & Dokumen Calon Mahasiswa"
          icon="ph-user-list"
          onClose={() => setShowApplicantDetail(null)}
          maxWidth="640px"
          footer={
            <>
              <button onClick={() => setShowApplicantDetail(null)} className="btn" style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600' }}>Tutup</button>
              <button id="btn-detail-verify" onClick={() => updateApplicantStatus(showApplicantDetail.id, 'verified')} disabled={updatingStatus === showApplicantDetail.id} className="btn" style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Verifikasi</button>
              <button id="btn-detail-accept" onClick={() => updateApplicantStatus(showApplicantDetail.id, 'accepted')} disabled={updatingStatus === showApplicantDetail.id} className="btn" style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'rgba(16,185,129,0.15)', color: '#10b981', cursor: 'pointer', fontWeight: '600' }}>Terima</button>
              <button id="btn-detail-reject" onClick={() => updateApplicantStatus(showApplicantDetail.id, 'rejected')} disabled={updatingStatus === showApplicantDetail.id} className="btn" style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}>Tolak</button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Nama', value: showApplicantDetail.name },
              { label: 'Email', value: showApplicantDetail.email },
              { label: 'Telepon', value: showApplicantDetail.phone },
              { label: 'Gender', value: showApplicantDetail.gender },
              { label: 'Tanggal Lahir', value: showApplicantDetail.birth_date },
              { label: 'Tempat Lahir', value: showApplicantDetail.birth_place },
              { label: 'Asal Sekolah', value: showApplicantDetail.school_origin },
              { label: 'Program Pilihan', value: showApplicantDetail.program_choice || showApplicantDetail.program },
              { label: 'Status', value: showApplicantDetail.status },
            ].map((f, i) => (
              <div key={i}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: '600', marginBottom: '4px' }}>{f.label}</label>
                <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.92rem', fontWeight: '500' }}>{f.value || '-'}</p>
              </div>
            ))}
          </div>
          {showApplicantDetail.address && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: '600', marginBottom: '4px' }}>Alamat</label>
              <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.92rem' }}>{showApplicantDetail.address}</p>
            </div>
          )}
          {/* Documents */}
          {(showApplicantDetail.documents || []).length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600', marginBottom: '8px' }}>Dokumen & Foto Terunggah</label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {showApplicantDetail.documents.map((doc, i) => {
                  const isImg = doc.type === 'foto' || 
                                (doc.file_url && /\.(jpeg|jpg|png|webp|gif)/i.test(doc.file_url)) || 
                                (doc.original_name && /\.(jpeg|jpg|png|webp|gif)/i.test(doc.original_name));
                  
                  if (isImg) {
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '110px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>{doc.type}</span>
                        <div onClick={() => setLightboxImage(doc.file_url)} style={{ width: '110px', height: '110px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)', cursor: 'zoom-in', background: 'rgba(0,0,0,0.1)', position: 'relative' }}>
                          <img src={doc.file_url} alt={doc.original_name || doc.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{doc.type}</span>
                      <a href={doc.file_url || doc.url || doc.path || '#'} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ph ph-file"></i> Unduh {doc.original_name || doc.type}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ModalShell>
      )}

      {/* Fullscreen Lightbox / Zoom Overlay */}
      {lightboxImage && typeof document !== 'undefined' && createPortal(
        <div onClick={() => setLightboxImage(null)} style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <div style={{ position: 'relative', maxWidth: '85%', maxHeight: '85%' }} onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Detail" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} />
            <button onClick={() => setLightboxImage(null)} style={{ position: 'absolute', top: '-40px', right: '0', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>✕ Tutup</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
