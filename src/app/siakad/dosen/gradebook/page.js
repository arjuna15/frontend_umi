"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenGradebookPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // States to hold the current grades being edited by the user
  const [editedGrades, setEditedGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);

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
      
      // Initialize editedGrades
      const initialEdits = {};
      result.jadwal.forEach(course => {
        if (course.grades) {
          course.grades.forEach(g => {
            initialEdits[g.id] = {
              score: g.score || '',
              grade: g.grade || ''
            };
          });
        }
      });
      setEditedGrades(initialEdits);
    } catch (err) {
      router.push('/siakad/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  const handleGradeChange = (gradeId, field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [gradeId]: {
        ...prev[gradeId],
        [field]: value
      }
    }));
  };

  const handleSaveGrades = async (courseId) => {
    setSavingGrades(true);
    const course = data.jadwal.find(c => c.id === courseId);
    if (!course || !course.grades) {
      setSavingGrades(false);
      return;
    }

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      // Create an array of fetch promises for each grade in this course
      const promises = course.grades.map(g => {
        const edits = editedGrades[g.id];
        if (!edits) return Promise.resolve(); // nothing to update
        
        return fetch(`${apiUrl}/siakad/grade/${g.id}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            score: edits.score !== '' ? edits.score : null,
            grade: edits.grade !== '' ? edits.grade : null
          })
        });
      });

      await Promise.all(promises);
      
      // Refresh data
      await fetchDashboard();
      alert('Berhasil menyimpan nilai untuk mata kuliah ini!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan nilai.');
    } finally {
      setSavingGrades(false);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat gradebook...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Gradebook & Nilai 📊</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '1.05rem' }}>Input dan kelola skor mahasiswa secara Real-Time.</p>
        </div>
        <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)', transition: 'all 0.3s' }}>
          <i className="ph-file-xls" style={{ fontSize: '1.2rem' }}></i> Export ke Excel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'linear-gradient(90deg, rgba(239,246,255,0.8) 0%, rgba(255,255,255,0) 100%)', padding: '24px 32px', borderBottom: '1px solid rgba(219, 234, 254, 0.5)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(37, 99, 235, 0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph-exam"></i>
              </div>
              <div style={{ zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e3a8a', fontWeight: '800' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: '#1d4ed8', fontWeight: '600', padding: '4px 12px', background: 'rgba(29, 78, 216, 0.1)', borderRadius: '999px' }}>{course.code} • {course.sks} SKS</span>
              </div>
            </div>
            
            <div style={{ padding: '0', overflowX: 'auto', background: 'rgba(255,255,255,0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: 'rgba(241, 245, 249, 0.8)' }}>
                    <th style={{ padding: '16px 32px', fontWeight: '800', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Mahasiswa</th>
                    <th style={{ padding: '16px 32px', fontWeight: '800', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Kehadiran</th>
                    <th style={{ padding: '16px 32px', fontWeight: '800', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Skor Akhir (0-100)</th>
                    <th style={{ padding: '16px 32px', fontWeight: '800', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Nilai Huruf</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades && course.grades.map((grade, j) => {
                    const attendanceCount = course.attendances?.length || 0;
                    const presentCount = course.attendances?.filter(a => a.records?.find(r => r.mahasiswa_id === grade.mahasiswa_id && r.status === 'present'))?.length || 0;
                    const attendancePercentage = attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : 100;
                    
                    const editState = editedGrades[grade.id] || { score: '', grade: '' };
                    
                    return (
                      <tr key={j} style={{ borderBottom: j === course.grades.length - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.5)' }}>
                        <td style={{ padding: '20px 32px' }}>
                          <strong style={{ display: 'block', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>{grade.mahasiswa?.name}</strong>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>NIM: {grade.mahasiswa?.nim_nip}</span>
                        </td>
                        <td style={{ padding: '20px 32px', color: attendancePercentage < 75 ? '#ef4444' : '#10b981', fontWeight: '800', fontSize: '1.1rem' }}>
                          {attendancePercentage}%
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                          <input type="number" min="0" max="100" value={editState.score} onChange={e => handleGradeChange(grade.id, 'score', e.target.value)} style={{ width: '80px', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1rem', fontWeight: '700', color: '#0f172a', background: 'rgba(255,255,255,0.8)', outline: 'none' }} placeholder="--" />
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                          <select value={editState.grade} onChange={e => handleGradeChange(grade.id, 'grade', e.target.value)} style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontWeight: '800', outline: 'none', fontSize: '1rem', color: '#0f172a', background: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
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
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.95rem' }}>Tidak ada mahasiswa yang terdaftar di kelas ini.</div>
              )}
            </div>
            
            <div style={{ padding: '24px 32px', background: 'rgba(248, 250, 252, 0.8)', borderTop: '1px solid rgba(226, 232, 240, 0.8)', textAlign: 'right' }}>
              <button disabled={savingGrades} onClick={() => handleSaveGrades(course.id)} style={{ background: savingGrades ? '#94a3b8' : '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: savingGrades ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)', transition: 'all 0.3s' }}>
                {savingGrades ? 'Menyimpan...' : 'Simpan Perubahan Nilai'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
