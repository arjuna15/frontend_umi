"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dashboardExt, setDashboardExt] = useState(null);
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

        // Fetch extended dashboard (Schedules & Deadlines)
        const extRes = await fetch(`${apiUrl}/siakad/mahasiswa/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
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
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data akademik...
    </div>
  );

  const totalSKS = data.krs.reduce((sum, item) => sum + (item.course?.sks || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>Halo, {data.user.name.split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Selamat datang kembali di Portal Akademik Anda.</p>
      </div>

      {/* Statistik Atas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', color: 'var(--color-text)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph ph-student"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Program Studi</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{data.user.prodi}</h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph ph-books"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>Total SKS Diambil</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>{totalSKS} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--color-muted)' }}>SKS</span></h3>
          </div>
        </div>
        <div className="siakad-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--glass-bg)', color: 'var(--color-text)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph ph-chart-line-up"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 4px 0' }}>IPK Sementara</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>3.75</h3>
          </div>
        </div>
      </div>

      {/* Grid Utama (Jadwal & Deadline) */}
      {dashboardExt && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          
          {/* Jadwal Kuliah Hari Ini */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--glass-bg)', color: 'var(--color-text)', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-calendar-check" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Jadwal Hari Ini</h2>
            </div>

            {dashboardExt.schedule_today?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.schedule_today.map((schedule, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--glass-bg)', borderLeft: '4px solid #4f46e5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>Tidak ada jadwal kuliah hari ini. Waktunya bersantai!</p>
            )}
          </div>

          {/* Upcoming Deadlines (To-Do List) */}
          <div className="siakad-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--glass-bg)', color: '#ef4444', padding: '10px', borderRadius: '12px' }}>
                <i className="ph ph-warning-circle" style={{ fontSize: '1.4rem' }}></i>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Timeline & Deadline</h2>
            </div>

            {dashboardExt.upcoming_deadlines?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardExt.upcoming_deadlines.map((deadline, idx) => (
                  <div key={idx} style={{ padding: '16px', background: deadline.due_in_days <= 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)', border: `1px solid ${deadline.due_in_days <= 1 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`, borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)', fontWeight: '700' }}>{deadline.title}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '999px', background: deadline.due_in_days <= 1 ? '#ef4444' : '#f97316', color: 'white' }}>
                        H-{deadline.due_in_days}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text)' }}><i className="ph ph-book-open"></i> {deadline.course}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>Wah, aman! Tidak ada tugas atau kuis dalam waktu dekat.</p>
            )}
          </div>

        </div>
      )}

      {/* Kartu Hasil Studi (KHS) Summary */}
      <div id="khs-print-section" className="siakad-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Kartu Hasil Studi (KHS)</h2>
          <button onClick={() => window.print()} style={{ background: '#4f46e5', border: 'none', padding: '10px 16px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
            <i className="ph ph-printer"></i> Cetak KHS Resmi
          </button>
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
              {data.krs.map((item, i) => (
                <tr key={i}>
                  <td>{item.course?.code}</td>
                  <td>{item.course?.name}</td>
                  <td style={{ color: 'var(--color-muted)' }}>{item.course?.semester}</td>
                  <td>{item.course?.sks}</td>
                  <td>
                    <span className="siakad-badge" style={{
                      background: item.grade === 'A' || item.grade === 'A-' ? '#ecfdf5' : 
                                 item.grade === 'B+' || item.grade === 'B' ? '#eff6ff' : 
                                 item.grade ? '#fef2f2' : '#f3f4f6',
                      color: item.grade === 'A' || item.grade === 'A-' ? '#059669' : 
                             item.grade === 'B+' || item.grade === 'B' ? '#2563eb' : 
                             item.grade ? '#dc2626' : '#6b7280'
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
