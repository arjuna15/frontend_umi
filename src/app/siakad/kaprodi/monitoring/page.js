'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiMonitoring() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('siakad_token');
      if (!token) {
        router.push('/siakad/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/monitoring`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data BAP...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Monitoring Perkuliahan</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Pantau Berita Acara Perkuliahan (BAP) dan keaktifan kelas.</p>
        </div>
      </div>


      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th>Mata Kuliah</th>
              <th>Dosen Pengampu</th>
              <th>Total Pertemuan</th>
              <th>Materi Uploaded</th>
              <th>Status BAP</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Belum ada kelas aktif.</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 600 }}>{course.name} <br/><small style={{ color: 'var(--color-muted)', fontWeight: 'normal' }}>{course.code}</small></td>
                  <td>{course.dosen ? course.dosen.name : <span style={{ color: '#ef4444' }}>Belum di-assign</span>}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-users" style={{ color: 'var(--color-text)' }}></i>
                      {course.attendances?.length || 0} / 14 Sesi
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-file-pdf" style={{ color: '#ef4444' }}></i>
                      {course.materials?.length || 0} Dokumen
                    </div>
                  </td>
                  <td>
                    {course.materials?.length >= 2 ? (
                      <span className="siakad-badge" style={{ background: '#dcfce7', color: '#166534' }}>Lancar</span>
                    ) : course.materials?.length > 0 ? (
                      <span className="siakad-badge" style={{ background: '#fef3c7', color: '#b45309' }}>Kurang Aktif</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Kosong</span>
                    )}
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
