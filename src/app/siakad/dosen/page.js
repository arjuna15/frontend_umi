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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)', gap: '12px' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem' }}></i> Memuat Dashboard...
    </div>
  );

  const todaySchedules = data.schedule || [];
  const todos = data.todos || [];
  const courses = data.courses || data.jadwal || [];

  const dayColors = { Senin: '#3b82f6', Selasa: '#10b981', Rabu: '#8b5cf6', Kamis: '#f59e0b', Jumat: '#ef4444', Sabtu: '#06b6d4' };

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)',
        borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(196,30,58,0.2)', filter: 'blur(50px)', pointerEvents: 'none' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', filter: 'blur(40px)', pointerEvents: 'none' , flexShrink: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — PORTAL DOSEN</p>
          <h1 style={{ color: 'white', fontSize: '2.4rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            Selamat Datang, {data.name?.split(' ')[0] || 'Dosen'} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem' }}>Berikut ringkasan aktivitas mengajar Anda hari ini.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Mata Kuliah', value: courses.length || 0, icon: 'ph-books', color: ['#6366f1', '#8b5cf6'], shadow: 'rgba(99,102,241,0.3)' },
          { label: 'Jadwal Hari Ini', value: todaySchedules.length, icon: 'ph-calendar-check', color: ['#10b981', '#059669'], shadow: 'rgba(16,185,129,0.3)' },
          { label: 'Notifikasi Aktif', value: todos.length, icon: 'ph-bell-ringing', color: ['#f59e0b', '#d97706'], shadow: 'rgba(245,158,11,0.3)' },
          { label: 'Semester', value: data.semester || 'Ganjil 24/25', icon: 'ph-graduation-cap', color: ['#C41E3A', '#ef4444'], shadow: 'rgba(196,30,58,0.3)', small: true },
        ].map((stat, i) => (
          <div key={i} className={`siakad-card stagger-${i + 1}`} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, ${stat.color[0]}, ${stat.color[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${stat.shadow}`, flexShrink: 0 }}>
              <i className={`ph ${stat.icon}`} style={{ fontSize: '1.5rem', color: 'white' }}></i>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
              <p style={{ margin: 0, color: 'var(--color-text)', fontSize: stat.small ? '1.1rem' : '1.9rem', fontWeight: '800', lineHeight: 1 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Jadwal Hari Ini */}
        <div className="siakad-card stagger-2" style={{ overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(to right, #1e1b4b, #312e81)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' , flexShrink: 0 }}>
              <i className="ph ph-clock" style={{ color: 'white', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Jadwal Mengajar Hari Ini</h3>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todaySchedules.length > 0 ? todaySchedules.map((sch, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '16px', borderLeft: `4px solid ${dayColors[sch.day] || '#8b5cf6'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '1rem' }}>{sch.course}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    <span><i className="ph ph-clock" style={{ marginRight: '4px' }}></i>{sch.time || 'Belum diatur'}</span>
                    <span><i className="ph ph-map-pin" style={{ marginRight: '4px' }}></i>{sch.room || 'Belum ada ruang'}</span>
                  </div>
                </div>
                <span style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.15)', color: '#6366f1', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                  Sesi {sch.meeting || '?'}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)' }}>
                <i className="ph ph-calendar-x" style={{ fontSize: '3rem', display: 'block', marginBottom: '8px', opacity: 0.4 }}></i>
                <p style={{ margin: 0 }}>Tidak ada jadwal kelas hari ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifikasi & To-Do */}
        <div className="siakad-card stagger-3" style={{ overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(to right, #064e3b, #065f46)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' , flexShrink: 0 }}>
              <i className="ph ph-bell-ringing" style={{ color: 'white', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Notifikasi & To-Do</h3>
            {todos.length > 0 && (
              <span style={{ marginLeft: 'auto', padding: '2px 8px', background: '#f59e0b', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                {todos.length}
              </span>
            )}
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todos.length > 0 ? todos.map((todo, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'var(--glass-bg)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', borderLeft: '4px solid #f59e0b' }}>
                <i className="ph ph-warning-circle" style={{ marginTop: '2px', color: '#f59e0b', fontSize: '1.1rem', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{todo}</span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)' }}>
                <i className="ph ph-check-circle" style={{ fontSize: '3rem', display: 'block', marginBottom: '8px', opacity: 0.4 }}></i>
                <p style={{ margin: 0 }}>Semua tugas sudah selesai! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Mata Kuliah Diampu */}
        {courses.length > 0 && (
          <div className="siakad-card stagger-4" style={{ overflow: 'hidden', gridColumn: '1 / -1' }}>
            <div style={{ background: 'linear-gradient(to right, #7c2d12, #9a3412)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' , flexShrink: 0 }}>
                <i className="ph ph-books" style={{ color: 'white', fontSize: '1.1rem' }}></i>
              </div>
              <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Mata Kuliah yang Diampu</h3>
              <span style={{ marginLeft: 'auto', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>
                {courses.length} MK
              </span>
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {courses.map((c, i) => (
                <div key={i} style={{ padding: '20px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center', transition: 'all 0.2s' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ph ph-chalkboard-teacher" style={{ color: '#6366f1', fontSize: '1.3rem' }}></i>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.95rem' }}>{c.name}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', background: 'rgba(99,102,241,0.15)', color: '#6366f1', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>{c.code}</span>
                      <span style={{ display: 'inline-block', whiteSpace: 'nowrap', padding: '2px 8px', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>{c.sks} SKS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
