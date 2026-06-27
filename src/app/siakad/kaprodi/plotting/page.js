'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiPlotting() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

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
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        setDosens(data.dosens);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (courseId, dosenId) => {
    if (!dosenId) return;
    setAssigningId(courseId);
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/kaprodi/courses/${courseId}/plot`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dosen_id: dosenId })
      });
      if (res.ok) {
        alert('Dosen berhasil di-assign ke mata kuliah ini!');
        fetchData();
      } else {
        alert('Gagal assign dosen');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data Kelas...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Plotting Dosen & Kelas <i className="ph ph-users-three" style={{ color: '#3b82f6' }}></i>
        </h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Tugaskan dosen pengampu untuk masing-masing mata kuliah.</p>
      </div>

      <div className="siakad-card stagger-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th>Mata Kuliah</th>
              <th>Kode</th>
              <th>SKS</th>
              <th>Dosen Pengampu Saat Ini</th>
              <th style={{ width: '250px' }}>Ganti/Assign Dosen</th>
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
                  <td style={{ fontWeight: 600 }}>{course.name}</td>
                  <td style={{ color: '#6b7280' }}>{course.code}</td>
                  <td>{course.sks} SKS</td>
                  <td>
                    {course.dosen ? (
                      <span style={{ fontWeight: 500, color: '#1f2937' }}>{course.dosen.name}</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Kosong</span>
                    )}
                  </td>
                  <td>
                    <select 
                      className="siakad-select" 
                      style={{ padding: '6px 12px', width: '100%' }}
                      disabled={assigningId === course.id}
                      onChange={(e) => handleAssign(course.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>{assigningId === course.id ? 'Menyimpan...' : 'Pilih Dosen...'}</option>
                      {dosens.map(dosen => (
                        <option key={dosen.id} value={dosen.id}>{dosen.name}</option>
                      ))}
                    </select>
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
