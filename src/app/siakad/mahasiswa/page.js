"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '../components/i18n';

export default function MahasiswaDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [gradebook, setGradebook] = useState([]);
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
        
        // Fetch basic info
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
        
        setData(result);

        const [extRes, gradeRes] = await Promise.all([
          fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/siakad/mahasiswa/gradebook`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (extRes.ok) {
          const extResult = await extRes.json();
          setDashboardExt(extResult);
        }

        if (gradeRes.ok) {
          const gradeResult = await gradeRes.json();
          setGradebook(Array.isArray(gradeResult) ? gradeResult : []);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data akademik...
    </div>
  );

  const totalSKS = Array.isArray(data.krs) ? data.krs.reduce((sum, item) => sum + (item.course?.sks || 0), 0) : 0;
  const totalBobot = gradebook.reduce((sum, item) => {
    let bobot = 0;
    if (item.huruf === 'A') bobot = 4.0;
    else if (item.huruf === 'A-') bobot = 3.7;
    else if (item.huruf === 'B+') bobot = 3.3;
    else if (item.huruf === 'B') bobot = 3.0;
    else if (item.huruf === 'B-') bobot = 2.7;
    else if (item.huruf === 'C+') bobot = 2.3;
    else if (item.huruf === 'C') bobot = 2.0;
    else if (item.huruf === 'D') bobot = 1.0;
    return sum + (bobot * (item.sks || 0));
  }, 0);
  const totalGradeSks = gradebook.reduce((sum, item) => sum + (item.sks || 0), 0);
  const currentIpk = totalGradeSks > 0 ? (totalBobot / totalGradeSks).toFixed(2) : '-';

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <div className="siakad-modal-header">
            <div>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{getTranslation('welcome', lang)} {data.user.name?.split(' ')[0] || 'Mahasiswa'}!</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{lang === 'en' ? 'Welcome back to your Academic Portal.' : 'Selamat datang kembali di Portal Akademik Anda.'}</p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', padding: '12px 28px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: 'var(--glass-shadow)', backdropFilter: 'none' }}>
               <div style={{ width: '42px', height: '42px', background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' , flexShrink: 0, border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <i className="ph ph-identification-card" style={{ color: '#60a5fa' }}></i>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>{getTranslation('nim', lang)}</p>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: '800' }}>{data.user.nim_nip || '-'}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Atas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: 'var(--apple-blue)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-student"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>{lang === 'en' ? 'Study Program' : 'Program Studi'}</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{data.user.prodi || '-'}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#C41E3A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-books"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>{lang === 'en' ? 'Total SKS Enrolled' : 'Total SKS Diambil'}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{totalSKS} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--color-muted)' }}>SKS</span></h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-chart-line-up"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>{lang === 'en' ? 'Temporary GPA' : 'IPK Sementara'}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{currentIpk}</h3>
          </div>
        </div>
      </div>

      {/* Grid Utama (Jadwal & Deadline) */}
      {dashboardExt && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px', alignItems: 'start' }}>
          
          {/* Jadwal Kuliah Hari Ini */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: 'var(--color-text)', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-calendar-check" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{getTranslation('class_schedule', lang)}</h2>
            </div>

            {dashboardExt.schedule_today?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.schedule_today.map((schedule, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--glass-bg)', borderLeft: '4px solid var(--apple-blue)', borderTop: 'var(--glass-border)', borderRight: 'var(--glass-border)', borderBottom: 'var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--glass-shadow)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{schedule.course}</h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-clock"></i> {schedule.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-map-pin"></i> {schedule.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>{getTranslation('no_schedule', lang)}</p>
            )}
          </div>

          {/* Upcoming Deadlines (To-Do List) */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--glass-bg)', border: 'var(--inset-border)', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', color: '#C41E3A', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-warning-circle" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{lang === 'en' ? 'Timeline & Deadlines' : 'Timeline & Deadline'}</h2>
            </div>

            {dashboardExt.upcoming_deadlines?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.upcoming_deadlines.map((deadline, idx) => {
                  const isUrgent = Math.ceil(deadline.due_in_days) <= 1;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => router.push(deadline.target_url || '#')} 
                      style={{ 
                        padding: '16px', 
                        background: 'var(--glass-bg)', 
                        borderLeft: `4px solid ${isUrgent ? '#ef4444' : '#f59e0b'}`, 
                        borderTop: 'var(--glass-border)',
                        borderRight: 'var(--glass-border)',
                        borderBottom: 'var(--glass-border)',
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        transition: 'all 0.2s', 
                        boxShadow: 'var(--glass-shadow)'
                      }}
                    >
                      <div className="siakad-modal-header" style={{ marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)', fontWeight: '700' }}>{deadline.title}</h4>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: '800', 
                          padding: '4px 10px', 
                          borderRadius: '50px', 
                          background: 'var(--liquid-bg)', 
                          border: isUrgent ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(245,158,11,0.3)',
                          color: isUrgent ? '#ef4444' : '#f59e0b',
                          boxShadow: 'inset 1px 1px 3px var(--inset-shadow-dark), inset -1px -1px 3px var(--inset-shadow-light)'
                        }}>
                          H-{Math.ceil(deadline.due_in_days)}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}><i className="ph ph-book-open" style={{ marginRight: '6px' }}></i> {deadline.course}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>Tidak ada tenggat waktu dalam waktu dekat.</p>
            )}
          </div>

        </div>
      )}

      {/* Kartu Hasil Studi (KHS) Summary */}
      <div id="khs-print-section" className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '16px' }} className="no-print">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Kartu Hasil Studi (KHS)</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', padding: '10px 24px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}>
              <i className="ph ph-printer"></i> Print View
            </button>
            <button 
              onClick={() => window.open('/api/siakad/export/khs', '_blank')} 
              style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', border: 'none', padding: '10px 24px', borderRadius: '50px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)' }}
            >
              <i className="ph ph-file-pdf"></i> Unduh PDF Resmi
            </button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>Kode MK</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>Mata Kuliah</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>Semester</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>SKS</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.krs) && data.krs.map((item, i) => (
                <tr key={i}>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderLeft: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '16px 0 0 16px',
                    boxShadow: 'inset 3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    fontWeight: 'bold',
                    color: 'var(--color-text)'
                  }}>{item.course?.code}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    color: 'var(--color-text)',
                    fontWeight: '600'
                  }}>{item.course?.name}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    color: 'var(--color-muted)' 
                  }}>{item.course?.semester}</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                    fontWeight: 'bold',
                    color: 'var(--color-text)'
                  }}>{item.course?.sks} SKS</td>
                  <td style={{ 
                    padding: '14px 20px', 
                    background: 'var(--liquid-bg)',
                    borderRight: 'var(--inset-border)',
                    borderTop: 'var(--inset-border)',
                    borderBottom: 'var(--inset-border)',
                    borderRadius: '0 16px 16px 0',
                    boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 14px',
                      borderRadius: '50px',
                      background: 'var(--glass-bg)',
                      border: 'var(--glass-border)',
                      boxShadow: 'var(--glass-shadow)',
                      color: item.grade?.startsWith('A') ? '#10b981' : 
                             item.grade?.startsWith('B') ? '#3b82f6' : 
                             item.grade?.startsWith('C') ? '#f59e0b' : 
                             item.grade?.startsWith('D') ? '#ef4444' : 
                             item.grade ? '#ef4444' : 'var(--color-muted)',
                      fontWeight: '800',
                      fontSize: '0.82rem'
                    }}>
                      {item.grade || 'Menunggu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
