"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
  const [gradebook, setGradebook] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Halo, {data.user.name?.split(' ')[0] || 'Mahasiswa'}!</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Selamat datang kembali di Portal Akademik Anda.</p>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '12px 28px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '14px', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' , flexShrink: 0, border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <i className="ph ph-identification-card" style={{ color: '#60a5fa' }}></i>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>NIM Mahasiswa</p>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: '800' }}>{data.user.nim_nip || '-'}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Atas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#0f172a', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-student"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Program Studi</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{data.user.prodi || '-'}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(196,30,58,0.1)', color: '#C41E3A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-books"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Total SKS Diambil</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{totalSKS} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--color-muted)' }}>SKS</span></h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' , flexShrink: 0 }}>
            <i className="ph ph-chart-line-up"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>IPK Sementara</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{currentIpk}</h3>
          </div>
        </div>
      </div>

      {/* Grid Utama (Jadwal & Deadline) */}
      {dashboardExt && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          
          {/* Jadwal Kuliah Hari Ini */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#0f172a', color: 'white', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-calendar-check" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Jadwal Hari Ini</h2>
            </div>

            {dashboardExt.schedule_today?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.schedule_today.map((schedule, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--glass-bg)', borderLeft: '4px solid #1e1b4b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--color-text)' }}>{schedule.course}</h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-clock"></i> {schedule.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><i className="ph ph-map-pin"></i> {schedule.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>Tidak ada jadwal kuliah hari ini.</p>
            )}
          </div>

          {/* Upcoming Deadlines (To-Do List) */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(196,30,58,0.1)', color: '#C41E3A', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-warning-circle" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Timeline & Deadline</h2>
            </div>

            {dashboardExt.upcoming_deadlines?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.upcoming_deadlines.map((deadline, idx) => (
                  <div key={idx} onClick={() => router.push(deadline.target_url || '#')} style={{ padding: '16px', background: Math.ceil(deadline.due_in_days) <= 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${Math.ceil(deadline.due_in_days) <= 1 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`, borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}>
                    <div className="siakad-modal-header">
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)', fontWeight: '700' }}>{deadline.title}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '999px', background: Math.ceil(deadline.due_in_days) <= 1 ? '#ef4444' : '#f59e0b', color: 'white' }}>
                        H-{Math.ceil(deadline.due_in_days)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text)' }}><i className="ph ph-book-open"></i> {deadline.course}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>Tidak ada tenggat waktu dalam waktu dekat.</p>
            )}
          </div>

        </div>
      )}

      {/* Kartu Hasil Studi (KHS) Summary */}
      <div id="khs-print-section" className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }} className="no-print">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 4px 0' }}>Kartu Hasil Studi (KHS)</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '10px 24px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
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
          <table className="siakad-table">
            <thead>
              <tr>
                <th>Kode MK</th>
                <th>Mata Kuliah</th>
                <th>Semester</th>
                <th>SKS</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.krs) && data.krs.map((item, i) => (
                <tr key={i}>
                  <td>{item.course?.code}</td>
                  <td>{item.course?.name}</td>
                  <td style={{ color: 'var(--color-muted)' }}>{item.course?.semester}</td>
                  <td>{item.course?.sks}</td>
                  <td>
                    <span className="siakad-badge" style={{
                      background: item.grade?.startsWith('A') ? 'rgba(16, 185, 129, 0.15)' : 
                                 item.grade?.startsWith('B') ? 'rgba(59, 130, 246, 0.15)' : 
                                 item.grade?.startsWith('C') ? 'rgba(245, 158, 11, 0.15)' : 
                                 item.grade?.startsWith('D') ? 'rgba(239, 68, 68, 0.15)' : 
                                 item.grade ? 'rgba(239, 68, 68, 0.15)' : 'var(--glass-bg)',
                      color: item.grade?.startsWith('A') ? '#10b981' : 
                             item.grade?.startsWith('B') ? '#3b82f6' : 
                             item.grade?.startsWith('C') ? '#f59e0b' : 
                             item.grade?.startsWith('D') ? '#ef4444' : 
                             item.grade ? '#ef4444' : 'var(--color-muted)',
                      fontWeight: 'bold',
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
