'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiStudents() {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
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
      const res = await fetch(`${apiUrl}/siakad/kaprodi/students/grades`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setGrades(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data Nilai...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Monitoring Nilai Mahasiswa <i className="ph ph-student" style={{ color: '#3b82f6' }}></i>
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Distribusi dan rekapitulasi nilai akhir seluruh mahasiswa di prodi.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th>Mahasiswa</th>
              <th>Mata Kuliah</th>
              <th>Skor Akhir</th>
              <th>Grade</th>
              <th>Status Kelulusan</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Belum ada data nilai yang masuk.</td>
              </tr>
            ) : (
              grades.map(grade => (
                <tr key={grade.id}>
                  <td style={{ fontWeight: 600 }}>{grade.mahasiswa?.name} <br/><small style={{ color: '#6b7280', fontWeight: 'normal' }}>{grade.mahasiswa?.nim_nip}</small></td>
                  <td>{grade.course?.name}</td>
                  <td>{grade.score !== null ? grade.score : '-'}</td>
                  <td style={{ fontWeight: 800, color: ['A', 'A-'].includes(grade.grade) ? '#10b981' : ['E', 'D'].includes(grade.grade) ? '#ef4444' : '#1f2937' }}>
                    {grade.grade || '-'}
                  </td>
                  <td>
                    {grade.grade === null ? (
                      <span className="siakad-badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>Belum Dinilai</span>
                    ) : ['E', 'D'].includes(grade.grade) ? (
                      <span className="siakad-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Tidak Lulus</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#ecfdf5', color: '#10b981' }}>Lulus</span>
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
