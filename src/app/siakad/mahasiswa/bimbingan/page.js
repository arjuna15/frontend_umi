"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BimbinganAkademikPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const [dashRes, extRes, subRes, availRes] = await Promise.all([
          fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/krs/submission`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/krs/available`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!dashRes.ok) throw new Error('Failed to fetch');
        const result = await dashRes.json();
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        setData(result);

        if (extRes.ok) {
          const extResult = await extRes.json();
          setDashboardExt(extResult);
        }

        if (subRes.ok) {
          const subResult = await subRes.json();
          setSubmission(subResult);
        }

        if (availRes.ok) {
          const availResult = await availRes.json();
          setAvailableCourses(Array.isArray(availResult) ? availResult : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
        <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat bimbingan akademik...
      </div>
    );
  }

  const advisorName = dashboardExt?.advisor?.name || data?.dosen_wali?.name || data?.advisor?.name || data?.wali?.name || 'Belum tersedia';
  const advisorNidn = dashboardExt?.advisor?.nidn || data?.dosen_wali?.nidn || data?.advisor?.nidn || '-';
  const krsStatusRaw = submission?.status || dashboardExt?.krs_status || 'belum_diajukan';
  const krsStatusLabel = {
    approved: 'Disetujui',
    pending: 'Menunggu Persetujuan',
    rejected: 'Ditolak (Butuh Revisi)',
    belum_diajukan: 'Belum Diajukan'
  }[krsStatusRaw] || 'Belum Diajukan';
  const krsStatusColor = krsStatusRaw === 'approved' ? '#10b981' : krsStatusRaw === 'pending' ? '#f59e0b' : krsStatusRaw === 'rejected' ? '#ef4444' : 'var(--color-muted)';
  const approvalDeadline = dashboardExt?.krs_deadline || dashboardExt?.submission_deadline || dashboardExt?.upcoming_deadlines?.find((item) => String(item.title || item.event || '').toLowerCase().includes('krs'))?.date || '-';
  const selectedCourseIds = Array.isArray(submission?.course_ids)
    ? submission.course_ids
    : typeof submission?.course_ids === 'string'
      ? (() => {
          try { return JSON.parse(submission.course_ids); } catch { return []; }
        })()
      : [];
  const approvedSks = selectedCourseIds.reduce((sum, id) => {
    const course = availableCourses.find((item) => String(item.id) === String(id));
    return sum + (course?.sks || 0);
  }, 0);
  const chatHistory = Array.isArray(dashboardExt?.consultations)
    ? dashboardExt.consultations
    : Array.isArray(dashboardExt?.messages)
      ? dashboardExt.messages
      : [];

  const normalizeMessage = (item, index) => {
    const createdAt = item.created_at || item.sent_at || item.time || item.timestamp || null;
    const role = item.sender || item.role || item.author || (item.is_from_student ? 'mahasiswa' : 'dosen');
    const sender = role === 'student' || role === 'mahasiswa' ? 'mahasiswa' : role === 'advisor' || role === 'dosen' || role === 'lecturer' ? 'dosen' : (index % 2 === 0 ? 'dosen' : 'mahasiswa');
    const text = item.text || item.content || item.message || '';
    const time = createdAt
      ? new Date(createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      : (item.time || '');
    return { sender, text, time };
  };

  const messages = chatHistory.map(normalizeMessage).filter((item) => item.text.trim().length > 0);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Bimbingan Akademik</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Konsultasi rencana studi dan akademik dengan Dosen Wali Anda.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Profil Dosen Wali</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>
              {(advisorName || '-').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '--'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>{advisorName}</h4>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>NIDN. {advisorNidn}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="siakad-modal-header">
              <span style={{ color: 'var(--color-muted)' }}>Status KRS</span>
              <span style={{ color: krsStatusColor, fontWeight: 'bold' }}>{krsStatusLabel}</span>
            </div>
            <div className="siakad-modal-header">
              <span style={{ color: 'var(--color-muted)' }}>Batas Persetujuan</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{approvalDeadline}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>SKS Disetujui</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{krsStatusRaw === 'approved' ? `${approvedSks} / 24` : `0 / 24`}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', background: 'var(--glass-bg)' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 'bold' }}>Ruang Konsultasi</h3>
          </div>

          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length > 0 ? messages.map((chat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: chat.sender === 'mahasiswa' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: chat.sender === 'mahasiswa' ? '#4f46e5' : 'var(--glass-bg)',
                  color: chat.sender === 'mahasiswa' ? 'white' : 'var(--color-text)',
                  padding: '12px 16px', borderRadius: '12px', maxWidth: '80%',
                  border: chat.sender === 'mahasiswa' ? 'none' : '1px solid var(--color-border)'
                }}>
                  {chat.text}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '4px' }}>{chat.time}</span>
              </div>
            )) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--color-muted)', gap: '8px' }}>
                <i className="ph ph-chats" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                <p style={{ margin: 0, fontWeight: '600' }}>Belum ada riwayat konsultasi dari backend.</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Begitu endpoint konsultasi aktif, pesan akan tampil di sini.</p>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!message.trim()) return;
              window.toast?.('Fitur konsultasi belum tersambung ke backend.');
              setMessage('');
            }}
            style={{ padding: '16px', borderTop: '1px solid var(--color-border)', background: 'var(--glass-bg)', display: 'flex', gap: '12px' }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan ke Dosen Wali..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
