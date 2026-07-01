'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiMonitoring() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
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
              <th style={{ textAlign: 'center' }}>Aksi</th>
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
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      Lihat BAP
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '24px' }}>
          <div className="siakad-card fade-in" style={{ padding: '0', width: '100%', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)' , flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)' }}>Detail BAP: {selectedCourse.name}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>Dosen: {selectedCourse.dosen?.name || '-'}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '1.5rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', background: 'var(--glass-bg)', flex: 1 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Riwayat Pertemuan</h3>
              {(!selectedCourse.attendances || selectedCourse.attendances.length === 0) ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                  Belum ada sesi perkuliahan / presensi yang dicatat.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedCourse.attendances.map((att, idx) => (
                    <div key={idx} style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>Pertemuan ke-{idx + 1}</div>
                        <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Tanggal: {new Date(att.created_at || Date.now()).toLocaleDateString('id-ID')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>
                          Materi Dibagikan
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
