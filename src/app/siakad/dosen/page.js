'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Dashboard...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Jadwal & Pengingat Anda <i className="ph ph-calendar-check" style={{ color: 'var(--color-text)' }}></i>
        </h2>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>Selamat datang kembali! Berikut adalah ringkasan hari ini.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="siakad-card stagger-1" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph ph-clock" style={{ color: 'var(--color-text)' }}></i> Jadwal Hari Ini
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.schedule && data.schedule.length > 0 ? data.schedule.map((sch, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>{sch.course}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                  <span><i className="ph ph-clock"></i> {sch.time}</span>
                  <span><i className="ph ph-map-pin"></i> {sch.room}</span>
                  <span><i className="ph ph-chalkboard"></i> Sesi {sch.meeting}</span>
                </div>
              </div>
            )) : (
              <div style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Tidak ada jadwal kelas hari ini.</div>
            )}
          </div>
        </div>

        <div className="siakad-card stagger-2" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph ph-list-checks" style={{ color: 'var(--color-text)' }}></i> To-Do List & Notifikasi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.todos && data.todos.map((todo, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'var(--glass-bg)', borderRadius: '8px', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="ph ph-warning-circle" style={{ marginTop: '2px', color: 'var(--color-text)' }}></i>
                <span style={{ fontSize: '0.95rem' }}>{todo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
