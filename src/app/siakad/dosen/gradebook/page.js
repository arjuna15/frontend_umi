"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenGradebookPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // We will track raw components: kehadiran (10%), tugas (20%), uts (30%), uas (40%)
  const [editedGrades, setEditedGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);

  const calculateScoreAndGrade = (components) => {
    const k = parseFloat(components.kehadiran) || 0;
    const t = parseFloat(components.tugas) || 0;
    const ut = parseFloat(components.uts) || 0;
    const ua = parseFloat(components.uas) || 0;
    
    const finalScore = (k * 0.1) + (t * 0.2) + (ut * 0.3) + (ua * 0.4);
    
    let grade = 'E';
    if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 80) grade = 'A-';
    else if (finalScore >= 75) grade = 'B+';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 65) grade = 'B-';
    else if (finalScore >= 60) grade = 'C+';
    else if (finalScore >= 55) grade = 'C';
    else if (finalScore >= 40) grade = 'D';

    return { score: finalScore.toFixed(1), grade };
  };

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
      
      const initialEdits = {};
      result.jadwal.forEach(course => {
        if (course.grades) {
          course.grades.forEach(g => {
            // Since we don't store raw components in DB for this demo, 
            // we reverse engineer roughly from the final score if it exists, or just set to 0.
            const s = g.score || 0;
            initialEdits[g.id] = {
              kehadiran: s ? s : '',
              tugas: s ? s : '',
              uts: s ? s : '',
              uas: s ? s : '',
              score: g.score || '',
              grade: g.grade || ''
            };
          });
        }
      });
      setEditedGrades(initialEdits);
      if (result.jadwal.length > 0) setActiveCourseId(result.jadwal[0].id);
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
    setEditedGrades(prev => {
      const current = prev[gradeId];
      const updated = { ...current, [field]: value };
      const { score, grade } = calculateScoreAndGrade(updated);
      return {
        ...prev,
        [gradeId]: {
          ...updated,
          score,
          grade
        }
      };
    });
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
      const promises = course.grades.map(g => {
        const edits = editedGrades[g.id];
        if (!edits) return Promise.resolve();
        
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
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Gradebook...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Sistem Penilaian (Gradebook) 📊</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Input nilai komponen mahasiswa secara interaktif. Nilai akhir akan dihitung otomatis.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {data.jadwal.map(course => (
          <button 
            key={course.id}
            onClick={() => setActiveCourseId(course.id)}
            style={{
              padding: '10px 20px', borderRadius: '999px', fontWeight: 'bold', whiteSpace: 'nowrap',
              background: activeCourseId === course.id ? '#4f46e5' : 'white',
              color: activeCourseId === course.id ? 'white' : '#4b5563',
              border: activeCourseId === course.id ? 'none' : '1px solid #d1d5db',
              boxShadow: activeCourseId === course.id ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {course.code} - {course.name}
          </button>
        ))}
      </div>

      {data.jadwal.map(course => {
        if (course.id !== activeCourseId) return null;
        
        return (
          <div key={course.id} className="siakad-card stagger-1" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'linear-gradient(to right, #1e1b4b, #312e81)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1.25rem' }}>{course.name}</h2>
                <p style={{ color: '#c7d2fe', margin: 0, fontSize: '0.9rem' }}>{course.semester} • {course.sks} SKS</p>
              </div>
              <button 
                onClick={() => handleSaveGrades(course.id)}
                disabled={savingGrades}
                style={{
                  background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', 
                  borderRadius: '8px', cursor: savingGrades ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className={savingGrades ? "ph-spinner ph-spin" : "ph-floppy-disk"}></i> {savingGrades ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Mahasiswa</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Kehadiran (10%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Tugas (20%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UTS (30%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UAS (40%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '100px', background: '#eff6ff', color: '#1e40af' }}>Nilai Akhir</th>
                    <th style={{ padding: '16px 24px', fontWeight: 'bold', width: '100px', background: '#eff6ff', color: '#1e40af' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades && course.grades.map((grade, idx) => {
                    const edits = editedGrades[grade.id] || {};
                    const isPassed = parseFloat(edits.score) >= 60;
                    
                    return (
                      <tr key={grade.id} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.5)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>{grade.mahasiswa?.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{grade.mahasiswa?.nim_nip}</p>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.kehadiran || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'kehadiran', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'rgba(255,255,255,0.8)', transition: 'border 0.2s', fontWeight: '500' }}
                            onFocus={e => e.target.style.borderColor = '#4f46e5'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.tugas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'tugas', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'rgba(255,255,255,0.8)', transition: 'border 0.2s', fontWeight: '500' }}
                            onFocus={e => e.target.style.borderColor = '#4f46e5'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uts || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uts', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'rgba(255,255,255,0.8)', transition: 'border 0.2s', fontWeight: '500' }}
                            onFocus={e => e.target.style.borderColor = '#4f46e5'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uas', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'rgba(255,255,255,0.8)', transition: 'border 0.2s', fontWeight: '500' }}
                            onFocus={e => e.target.style.borderColor = '#4f46e5'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                          />
                        </td>
                        <td style={{ padding: '16px', background: '#eff6ff', borderLeft: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e40af' }}>{edits.score || '-'}</div>
                        </td>
                        <td style={{ padding: '16px 24px', background: '#eff6ff' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '40px', height: '40px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem',
                            background: edits.grade ? (isPassed ? '#dcfce7' : '#fee2e2') : 'rgba(255,255,255,0.5)',
                            color: edits.grade ? (isPassed ? '#166534' : '#991b1b') : '#9ca3af',
                            border: `1px solid ${edits.grade ? (isPassed ? '#86efac' : '#f87171') : '#d1d5db'}`
                          }}>
                            {edits.grade || '-'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!course.grades || course.grades.length === 0) && (
                    <tr>
                      <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                        <i className="ph-users-slash" style={{ fontSize: '3rem', color: '#9ca3af', margin: '0 auto 10px', display: 'block' }}></i>
                        Belum ada mahasiswa yang terdaftar di kelas ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
