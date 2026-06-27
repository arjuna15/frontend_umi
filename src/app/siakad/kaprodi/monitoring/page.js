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
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data BAP...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Monitoring Perkuliahan <i className="ph ph-chalkboard-teacher" style={{ color: '#3b82f6' }}></i>
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Pantau Berita Acara Perkuliahan (BAP) dan keaktifan kelas.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <table className="siakad-table">
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
                  <td style={{ fontWeight: 600 }}>{course.name} <br/><small style={{ color: '#6b7280', fontWeight: 'normal' }}>{course.code}</small></td>
                  <td>{course.dosen ? course.dosen.name : <span style={{ color: '#ef4444' }}>Belum di-assign</span>}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-users" style={{ color: '#10b981' }}></i>
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
                      <span className="siakad-badge" style={{ background: '#ecfdf5', color: '#059669' }}>Lancar</span>
                    ) : course.materials?.length > 0 ? (
                      <span className="siakad-badge" style={{ background: '#fef3c7', color: '#d97706' }}>Kurang Aktif</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>Kosong</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
