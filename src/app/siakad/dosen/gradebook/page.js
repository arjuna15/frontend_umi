"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenGradebookPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'dosen') return router.push('/siakad/login');
        setData(result);
      } catch (err) {
        router.push('/siakad/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat gradebook...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Gradebook & Nilai 📊</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Kelola nilai tugas, UTS, UAS, dan nilai akhir mahasiswa.</p>
        </div>
        <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)' }}>
          <i className="ph-file-xls"></i> Export ke Excel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ 
            background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
            borderRadius: '16px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.18)', overflow: 'hidden' 
          }}>
            <div style={{ background: 'linear-gradient(90deg, rgba(239,246,255,1) 0%, rgba(255,255,255,0) 100%)', padding: '20px 24px', borderBottom: '1px solid rgba(209, 213, 219, 0.3)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 'bold' }}>{course.name}</h3>
              <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: '#1d4ed8' }}>{course.code} • {course.sks} SKS</span>
            </div>
            
            <div style={{ padding: '0', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: 'rgba(243, 244, 246, 0.5)', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Mahasiswa</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Kehadiran (%)</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Rata-Rata Tugas</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Skor Akhir</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Nilai Huruf</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#374151', fontSize: '0.95rem' }}>
                  {course.grades && course.grades.map((grade, j) => {
                    // Mock calculation for UI illustration
                    const attendanceCount = course.attendances?.length || 0;
                    const presentCount = course.attendances?.filter(a => a.records?.find(r => r.mahasiswa_id === grade.mahasiswa_id && r.status === 'present'))?.length || 0;
                    const attendancePercentage = attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : 100;
                    
                    return (
                      <tr key={j} style={{ borderBottom: j === course.grades.length - 1 ? 'none' : '1px solid rgba(229, 231, 235, 0.5)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <strong style={{ display: 'block', color: '#111827' }}>{grade.mahasiswa?.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>NIM: {grade.mahasiswa?.nim_nip}</span>
                        </td>
                        <td style={{ padding: '16px 24px', color: attendancePercentage < 75 ? '#dc2626' : '#059669', fontWeight: 'bold' }}>
                          {attendancePercentage}%
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <input type="number" defaultValue={85} style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>{grade.score || '-'}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <select defaultValue={grade.grade || ''} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontWeight: 'bold', outline: 'none' }}>
                            <option value="">--</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(!course.grades || course.grades.length === 0) && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>Tidak ada mahasiswa di kelas ini.</div>
              )}
            </div>
            
            <div style={{ padding: '16px 24px', background: 'rgba(249, 250, 251, 0.5)', borderTop: '1px solid rgba(229, 231, 235, 0.5)', textAlign: 'right' }}>
              <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Simpan Perubahan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
