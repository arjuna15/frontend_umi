"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '../components/i18n';

export default function DosenDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('siakad_lang');
      if (savedLang) setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('siakad_token');
          localStorage.removeItem('siakad_role');
          localStorage.removeItem('siakad_user');
          router.push('/siakad/login');
          return;
        }
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
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — PORTAL DOSEN</p>
          <h1 style={{ color: 'white', fontSize: '2.4rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            Selamat Datang, {data.name?.split(' ')[0] || 'Dosen'} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem' }}>{lang === 'en' ? 'Here is the summary of your teaching activities today.' : 'Berikut ringkasan aktivitas mengajar Anda hari ini.'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: lang === 'en' ? 'Total Courses' : 'Total Mata Kuliah', value: courses.length || 0, icon: 'ph-books', color: '#C41E3A', bg: 'rgba(196, 30, 58, 0.15)' },
          { label: getTranslation('class_schedule', lang), value: todaySchedules.length, icon: 'ph-calendar-check', color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' },
          { label: lang === 'en' ? 'Active Notifications' : 'Notifikasi Aktif', value: todos.length, icon: 'ph-bell-ringing', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
          { label: 'Semester', value: data.semester || '-', icon: 'ph-graduation-cap', color: '#C41E3A', bg: 'rgba(196, 30, 58, 0.15)', small: true },
        ].map((stat, i) => (
          <div key={i} className={`siakad-card stagger-${i + 1}`} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`ph ${stat.icon}`} style={{ fontSize: '1.5rem', color: stat.color }}></i>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 4px 0', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
              <p style={{ margin: 0, color: 'var(--color-text)', fontSize: stat.small ? '1.1rem' : '1.9rem', fontWeight: '800', lineHeight: 1 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Jadwal Mengajar Hari Ini */}
        <div className="siakad-card stagger-2" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.55)', boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ph ph-clock" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>{lang === 'en' ? "Today's Teaching Schedule" : 'Jadwal Mengajar Hari Ini'}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {todaySchedules.length > 0 ? todaySchedules.map((sch, i) => (
              <div key={i} style={{ padding: '16px 20px', background: 'var(--glass-bg)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderLeft: '5px solid #C41E3A', borderTop: '1px solid rgba(255,255,255,0.5)', borderRight: '1px solid rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.02)', boxShadow: 'var(--glass-shadow)' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.95rem' }}>{sch.course}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-clock"></i>{sch.time || 'Belum diatur'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-map-pin"></i>{sch.room || 'Belum ada ruang'}</span>
                  </div>
                </div>
                <span style={{ padding: '4px 12px', background: 'rgba(196, 30, 58, 0.15)', color: '#C41E3A', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>
                  {lang === 'en' ? `Session ${sch.meeting || '?'}` : `Sesi ${sch.meeting || '?'}`}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <i className="ph ph-calendar-x" style={{ fontSize: '3rem', marginBottom: '8px', opacity: 0.4 }}></i>
                <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic' }}>{getTranslation('no_schedule', lang)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifikasi & To-Do */}
        <div className="siakad-card stagger-3" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.55)', boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ph ph-bell-ringing" style={{ color: '#f59e0b', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>Notifikasi & To-Do</h3>
            {todos.length > 0 && (
              <span style={{ marginLeft: 'auto', padding: '2px 8px', background: '#f59e0b', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                {todos.length}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {todos.length > 0 ? todos.map((todo, i) => (
              <div key={i} style={{ padding: '14px 20px', background: 'var(--glass-bg)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '5px solid #f59e0b', borderTop: '1px solid rgba(255,255,255,0.5)', borderRight: '1px solid rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.02)', boxShadow: 'var(--glass-shadow)' }}>
                <i className="ph ph-warning-circle" style={{ color: '#f59e0b', fontSize: '1.1rem', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{todo}</span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <i className="ph ph-check-circle" style={{ fontSize: '3rem', marginBottom: '8px', opacity: 0.4 }}></i>
                <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic' }}>Semua tugas sudah selesai! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Mata Kuliah yang Diampu */}
        {courses.length > 0 && (
          <div className="siakad-card stagger-4" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.55)', boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ph ph-books" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
              </div>
              <h3 style={{ margin: 0, color: 'var(--color-text)', fontWeight: '800', fontSize: '1.2rem' }}>Mata Kuliah Diampu</h3>
              <span style={{ marginLeft: 'auto', padding: '4px 12px', background: 'rgba(196, 30, 58, 0.15)', color: '#C41E3A', border: '1px solid rgba(196, 30, 58, 0.25)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>
                {courses.length} MK
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {courses.map((c, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'var(--glass-bg)', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center', transition: 'all 0.2s', borderLeft: '5px solid #C41E3A', borderTop: '1px solid rgba(255,255,255,0.5)', borderRight: '1px solid rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.02)', boxShadow: 'var(--glass-shadow)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.55)', boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ph ph-chalkboard-teacher" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: 'var(--color-text)', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '1px 8px', background: 'rgba(196, 30, 58, 0.15)', color: '#C41E3A', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '600' }}>{c.code}</span>
                      <span style={{ padding: '1px 8px', background: 'rgba(196, 30, 58, 0.15)', color: '#C41E3A', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '600' }}>{c.sks} SKS</span>
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
