"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JadwalKalenderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('jadwal');
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const [dashRes, extRes] = await Promise.all([
          fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!dashRes.ok) throw new Error('Failed to fetch');
        const result = await dashRes.json();
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        setData(result);

        if (extRes.ok) {
          const extResult = await extRes.json();
          setDashboardExt(extResult);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const normalizeScheduleItem = (item) => ({
    day: item.day || item.hari || 'Hari ini',
    time: item.time || [item.start_time, item.end_time].filter(Boolean).join(' - ') || '-',
    course: item.course || item.course_name || item.name || '-',
    room: item.room || item.ruang || '-',
    dosen: item.dosen || item.lecturer || item.dosen_name || '-',
  });

  const rawSchedule = dashboardExt?.weekly_schedule || dashboardExt?.schedule || dashboardExt?.schedule_today || data?.schedule || data?.krs?.map((item) => ({
    day: item.course?.day || item.day,
    time: item.course?.time || item.time,
    course: item.course?.name || item.course_name,
    room: item.course?.room || item.room,
    dosen: item.course?.dosen?.name || item.dosen
  })) || [];
  const schedule = Array.isArray(rawSchedule) ? rawSchedule.map(normalizeScheduleItem).filter((item) => item.course && item.course !== '-') : [];

  const rawEvents = dashboardExt?.upcoming_deadlines || dashboardExt?.deadlines || [];
  const calendarEvents = Array.isArray(rawEvents) ? rawEvents.map((item) => ({
    date: item.date || item.due_date || item.deadline || '-',
    event: item.event || item.title || item.name || '-',
    type: item.type || (item.due_in_days <= 1 ? 'exam' : 'academic')
  })) : [];

  const getEventIcon = (type) => {
    switch(type) {
      case 'finance': return <i className="ph ph-wallet" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>;
      case 'academic': return <i className="ph ph-books" style={{ color: '#3b82f6', fontSize: '1.2rem' }}></i>;
      case 'exam': return <i className="ph ph-exam" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>;
      default: return <i className="ph ph-calendar" style={{ color: 'var(--color-muted)', fontSize: '1.2rem' }}></i>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
        <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat jadwal...
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '36px 40px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(185, 28, 28, 0.15) 0%, rgba(185, 28, 28, 0) 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          flexShrink: 0
        }}></div>

        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '4px 10px',
              borderRadius: '999px',
              marginBottom: '12px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', margin: 0, letterSpacing: '0.05em', fontWeight: '600', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
            </div>
            <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>Jadwal & Kalender</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', margin: 0, fontSize: '0.95rem' }}>Data jadwal dan agenda akademik diambil dari backend.</p>
          </div>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
            flexShrink: 0
          }}>
            <i className="ph ph-calendar-blank" style={{ fontSize: '2rem', color: 'rgba(255, 255, 255, 0.8)' }}></i>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('jadwal')}
          style={{
            background: activeTab === 'jadwal' ? '#0f172a' : 'var(--glass-bg)',
            color: activeTab === 'jadwal' ? 'white' : 'var(--color-text)',
            border: activeTab === 'jadwal' ? 'none' : '1px solid var(--color-border)',
            padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: activeTab === 'jadwal' ? '0 4px 10px rgba(15,23,42,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
          <i className="ph ph-calendar-blank" style={{ marginRight: '8px' }}></i> Jadwal Kuliah
        </button>
        <button
          onClick={() => setActiveTab('kalender')}
          style={{
            background: activeTab === 'kalender' ? '#0f172a' : 'var(--glass-bg)',
            color: activeTab === 'kalender' ? 'white' : 'var(--color-text)',
            border: activeTab === 'kalender' ? 'none' : '1px solid var(--color-border)',
            padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: activeTab === 'kalender' ? '0 4px 10px rgba(15,23,42,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
          <i className="ph ph-calendar-check" style={{ marginRight: '8px' }}></i> Kalender Akademik
        </button>
      </div>

      {activeTab === 'jadwal' && (
        <div className="siakad-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="siakad-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Mata Kuliah</th>
                  <th>Dosen</th>
                  <th>Ruang</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length > 0 ? schedule.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 'bold' }}>{item.day}</td>
                    <td style={{ color: 'var(--color-muted)' }}>{item.time}</td>
                    <td>{item.course}</td>
                    <td style={{ color: 'var(--color-muted)' }}>{item.dosen}</td>
                    <td>
                      <span style={{ display: 'inline-block', minWidth: '130px', textAlign: 'center', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                        {item.room}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada jadwal yang dikirim backend.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'kalender' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {calendarEvents.length > 0 ? calendarEvents.map((item, i) => (
            <div key={i} className="siakad-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
              <div style={{ background: 'var(--glass-bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getEventIcon(item.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>{item.event}</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>{item.date}</p>
              </div>
            </div>
          )) : (
            <div className="siakad-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>
              Belum ada agenda akademik dari backend.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
