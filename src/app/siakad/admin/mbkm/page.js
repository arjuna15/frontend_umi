"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function MBKMAdminPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, submissions: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', sks: '', period: '', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const getToken = () => localStorage.getItem('siakad_token');

  const fetchPrograms = async () => {
    const token = getToken();
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`${apiUrl}/siakad/mbkm/programs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const list = data.data || data.programs || [];
      setPrograms(list);
      const active = list.filter(p => p.status === 'active').length;
      const totalSubs = list.reduce((acc, p) => acc + (p.submissions_count || 0), 0);
      const approvedSubs = list.reduce((acc, p) => acc + (p.approved_count || 0), 0);
      setStats({ total: list.length, active, submissions: totalSubs, approved: approvedSubs });
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Gagal memuat data program MBKM.', type: 'error' });
    } finally { setLoading(false); }
  };

  const createProgram = async () => {
    if (!formData.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/siakad/mbkm/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage({ text: 'Program MBKM berhasil dibuat!', type: 'success' });
      setShowCreateModal(false);
      setFormData({ title: '', description: '', sks: '', period: '', status: 'active' });
      fetchPrograms();
    } catch (e) {
      setMessage({ text: 'Gagal membuat program.', type: 'error' });
    } finally { setSaving(false); }
  };

  const deleteProgram = async (id) => {
    if (!confirm('Hapus program ini?')) return;
    try {
      await fetch(`${apiUrl}/siakad/mbkm/programs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      setMessage({ text: 'Program berhasil dihapus.', type: 'success' });
      fetchPrograms();
    } catch (e) {
      setMessage({ text: 'Gagal menghapus program.', type: 'error' });
    }
  };

  const viewSubmissions = async (program) => {
    setShowSubmissions(program);
    try {
      const res = await fetch(`${apiUrl}/siakad/mbkm/programs/${program.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSubmissions(data.submissions || data.data?.submissions || []);
    } catch (e) { setSubmissions([]); }
  };

  const handleSubmission = async (submissionId, action) => {
    setProcessingId(submissionId);
    try {
      await fetch(`${apiUrl}/siakad/mbkm/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ action })
      });
      setMessage({ text: `Submission ${action === 'approve' ? 'disetujui' : 'ditolak'}.`, type: 'success' });
      if (showSubmissions) viewSubmissions(showSubmissions);
      fetchPrograms();
    } catch (e) {
      setMessage({ text: 'Gagal memproses submission.', type: 'error' });
    } finally { setProcessingId(null); }
  };

  useEffect(() => { fetchPrograms(); }, [router]);

  const statusBadge = (status) => {
    const colors = { active: '#10b981', inactive: '#94a3b8', closed: '#ef4444', pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };
    const c = colors[status] || '#94a3b8';
    return (
      <span style={{ background: `${c}20`, color: c, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>{status}</span>
    );
  };

  if (loading) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat MBKM...</h1>
      <div className="siakad-card" style={{ padding: '24px', height: '200px' }}></div>
    </div>
  );

  const statCards = [
    { label: 'Total Program', value: stats.total, icon: 'ph ph-books', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Program Aktif', value: stats.active, icon: 'ph ph-check-circle', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Pendaftar', value: stats.submissions, icon: 'ph ph-users', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Disetujui', value: stats.approved, icon: 'ph ph-seal-check', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  return (
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — PROGRAM</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Program MBKM</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Kelola program Merdeka Belajar Kampus Merdeka dan pendaftaran mahasiswa.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, color: message.type === 'success' ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className={message.type === 'success' ? "ph-fill ph-check-circle" : "ph-fill ph-warning-circle"} style={{ fontSize: '1.4rem' }}></i>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
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

      {/* Programs Table */}
      <div className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Daftar Program MBKM</h2>
          <button id="btn-create-program" onClick={() => setShowCreateModal(true)} className="btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph ph-plus"></i> Tambah Program
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Judul Program', 'SKS', 'Periode', 'Status', 'Pendaftar', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada program MBKM.</td></tr>
              ) : programs.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => viewSubmissions(p)}>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.title}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)' }}>{p.sks || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted)' }}>{p.period || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>{statusBadge(p.status)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: '600' }}>{p.submissions_count || 0}</td>
                  <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                    <button id={`btn-delete-program-${p.id}`} onClick={() => deleteProgram(p.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                      <i className="ph ph-trash"></i> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Program Modal */}
      {showCreateModal && (
        <ModalShell
          title="Tambah Program MBKM"
          subtitle="Manajemen Program"
          icon="ph-graduation-cap"
          onClose={() => setShowCreateModal(false)}
          footer={
            <>
              <button id="btn-cancel-create" onClick={() => setShowCreateModal(false)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Batal</button>
              <button id="btn-confirm-create" onClick={createProgram} disabled={saving} className="siakad-btn-primary" style={{ padding: '10px 24px' }}>
                {saving ? 'Menyimpan...' : 'Simpan Program'}
              </button>
            </>
          }
        >
          {[
            { label: 'Judul Program', key: 'title', type: 'text', placeholder: 'Masukkan judul program' },
            { label: 'Deskripsi', key: 'description', type: 'textarea', placeholder: 'Deskripsi program' },
            { label: 'Jumlah SKS', key: 'sks', type: 'number', placeholder: 'Contoh: 20' },
            { label: 'Periode', key: 'period', type: 'text', placeholder: 'Contoh: 2025/2026 Ganjil' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea id={`input-${f.key}`} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', color: 'var(--color-text)' }} />
              ) : (
                <input id={`input-${f.key}`} type={f.type} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box', color: 'var(--color-text)' }} />
              )}
            </div>
          ))}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: '600' }}>Status</label>
            <select id="input-status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', boxSizing: 'border-box' }}>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="closed">Ditutup</option>
            </select>
          </div>
        </ModalShell>
      )}

      {/* Submissions Modal */}
      {showSubmissions && (
        <ModalShell
          title={`Pendaftar: ${showSubmissions.title}`}
          subtitle={`${submissions.length} pendaftar ditemukan`}
          icon="ph-users"
          onClose={() => setShowSubmissions(null)}
          footer={
            <button id="btn-close-submissions" onClick={() => setShowSubmissions(null)} className="btn" style={{ padding: '10px 20px', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Tutup</button>
          }
        >
          {submissions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '20px' }}>Belum ada pendaftar.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Mahasiswa', 'NIM', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-muted)', borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', color: 'var(--color-text)', fontWeight: '600' }}>{s.student_name || s.user_name || '-'}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted)' }}>{s.nim || '-'}</td>
                    <td style={{ padding: '12px' }}>{statusBadge(s.status)}</td>
                    <td style={{ padding: '12px' }}>
                      {s.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button id={`btn-approve-${s.id}`} onClick={() => handleSubmission(s.id, 'approve')} disabled={processingId === s.id} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                            <i className="ph ph-check"></i> Setuju
                          </button>
                          <button id={`btn-reject-${s.id}`} onClick={() => handleSubmission(s.id, 'reject')} disabled={processingId === s.id} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                            <i className="ph ph-x"></i> Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ModalShell>
      )}
    </div>
  );
}
