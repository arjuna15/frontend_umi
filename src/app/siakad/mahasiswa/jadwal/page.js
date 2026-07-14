"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JadwalKalenderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('jadwal');
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const [dashRes, extRes, calRes] = await Promise.all([
          fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/siakad/calendar`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!dashRes.ok) throw new Error('Failed to fetch');
        const result = await dashRes.json();
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        setData(result);

        if (extRes.ok) {
          const extResult = await extRes.json();
          setDashboardExt(extResult);
        }

        if (calRes.ok) {
          const calendarResult = await calRes.json();
          setCalendarEvents(Array.isArray(calendarResult) ? calendarResult : []);
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

  const mappedCalendarEvents = Array.isArray(calendarEvents) ? calendarEvents.map((item) => ({
    date: item.startDate && item.endDate
      ? `${item.startDate} - ${item.endDate}`
      : item.startDate || item.endDate || '-',
    event: item.name || '-',
    type: item.type || 'academic'
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
    <div className="fade-in">
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Jadwal & Kalender</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Lihat jadwal kuliah mingguan dan agenda kegiatan kalender akademik kampus.</p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('jadwal')}
            style={{
              background: activeTab === 'jadwal' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === 'jadwal' ? '#3b82f6' : 'var(--color-muted)',
              border: activeTab === 'jadwal' ? '2px solid #3b82f6' : '1px solid var(--color-border)',
              padding: '10px 22px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <i className="ph ph-calendar-blank" style={{ marginRight: '8px' }}></i> Jadwal Kuliah
          </button>
          <button
            onClick={() => setActiveTab('kalender')}
            style={{
              background: activeTab === 'kalender' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === 'kalender' ? '#3b82f6' : 'var(--color-muted)',
              border: activeTab === 'kalender' ? '2px solid #3b82f6' : '1px solid var(--color-border)',
              padding: '10px 22px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
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
                      <span style={{ display: 'inline-block', minWidth: '130px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.12)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.25)', whiteSpace: 'nowrap' }}>
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
          {mappedCalendarEvents.length > 0 ? mappedCalendarEvents.map((item, i) => (
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
              Belum ada agenda kalender akademik dari backend.
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
