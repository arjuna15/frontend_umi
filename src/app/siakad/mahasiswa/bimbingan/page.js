"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BimbinganAkademikPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const [dashRes, extRes, subRes, availRes, consultRes] = await Promise.all([
          fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/krs/submission`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/krs/available`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/mahasiswa/consultations`, { headers: { 'Authorization': `Bearer ${token}` } })
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

        if (consultRes.ok) {
          const consultResult = await consultRes.json();
          setConsultations(Array.isArray(consultResult.messages) ? consultResult.messages : []);
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
  const chatHistory = consultations.length > 0
    ? consultations
    : Array.isArray(dashboardExt?.consultations)
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
        <div style={{ background: 'var(--glass-bg)', borderRadius: '16px', border: 'var(--glass-border)', padding: '24px', boxShadow: 'var(--glass-shadow)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Profil Dosen Wali</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--apple-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0, boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
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
              <span style={{ 
                color: krsStatusColor, 
                fontWeight: '800', 
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '50px',
                background: 'var(--liquid-bg)',
                border: 'var(--inset-border)',
                boxShadow: 'inset 1px 1px 3px var(--inset-shadow-dark), inset -1px -1px 3px var(--inset-shadow-light)'
              }}>{krsStatusLabel}</span>
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

        <div style={{ background: 'var(--glass-bg)', borderRadius: '16px', border: 'var(--glass-border)', display: 'flex', flexDirection: 'column', height: '500px', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', background: 'var(--glass-bg)' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 'bold' }}>Ruang Konsultasi</h3>
          </div>

          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length > 0 ? messages.map((chat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: chat.sender === 'mahasiswa' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: chat.sender === 'mahasiswa' ? 'var(--apple-blue)' : 'var(--liquid-bg)',
                  color: chat.sender === 'mahasiswa' ? 'white' : 'var(--color-text)',
                  padding: '12px 16px', borderRadius: '16px', maxWidth: '80%',
                  border: chat.sender === 'mahasiswa' ? 'none' : 'var(--inset-border)',
                  boxShadow: chat.sender === 'mahasiswa' ? '0 4px 10px rgba(196,30,58,0.2)' : 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)'
                }}>
                  {chat.text}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '4px' }}>{chat.time}</span>
              </div>
            )) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--color-muted)', gap: '8px' }}>
                <i className="ph ph-chats" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                <p style={{ margin: 0, fontWeight: '600' }}>Belum ada riwayat konsultasi.</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Kirim pesan pertama ke dosen wali untuk memulai konsultasi.</p>
              </div>
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!message.trim()) return;
              const token = localStorage.getItem('siakad_token');
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                const res = await fetch(`${apiUrl}/siakad/mahasiswa/consultations`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ message: message.trim() })
                });
                if (!res.ok) throw new Error('Gagal mengirim pesan konsultasi');
                const result = await res.json();
                if (result?.data) {
                  setConsultations((prev) => [...prev, result.data]);
                }
                window.toast?.('Pesan konsultasi terkirim');
                setMessage('');
              } catch (err) {
                window.toast?.(err.message || 'Gagal mengirim pesan');
              }
            }}
            style={{ padding: '16px', borderTop: '1px solid var(--color-border)', background: 'var(--glass-bg)', display: 'flex', gap: '12px' }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan ke Dosen Wali..."
              className="siakad-input"
              style={{ flex: 1, outline: 'none' }}
            />
            <button type="submit" className="siakad-btn-primary" style={{ padding: '0 24px', borderRadius: '50px' }}>
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
