"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenGradebookPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // We will track raw components: kehadiran (10%), tugas (20%), uts (30%), uas (40%)
  const [editedGrades, setEditedGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

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
      if (result.jadwal.length > 0 && !activeCourseId) setActiveCourseId(result.jadwal[0].id);
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
      const current = prev[gradeId] || {};
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
      // First, try mass import API if it exists (Subagent added it)
      const gradesToUpdate = course.grades.map(g => {
        const edits = editedGrades[g.id] || {};
        return {
          id: g.id,
          score: edits.score !== '' ? edits.score : null,
          grade: edits.grade !== '' ? edits.grade : null
        };
      });

      const res = await fetch(`${apiUrl}/siakad/dosen/gradebook/import`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: courseId, grades: gradesToUpdate })
      });

      if (res.ok) {
        await fetchDashboard();
        window.toast('Berhasil menyimpan nilai untuk mata kuliah ini!');
      } else {
        // Fallback to individual
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
        window.toast('Berhasil menyimpan nilai!');
      }
    } catch (err) {
      console.error(err);
      window.toast('Gagal menyimpan nilai.');
    } finally {
      setSavingGrades(false);
    }
  };

  const handleExportCSV = (course) => {
    if (!course || !course.grades) return;
    const header = ["NIM", "Nama", "Kehadiran", "Tugas", "UTS", "UAS", "Nilai Akhir", "Grade"];
    const rows = course.grades.map(g => {
      const edits = editedGrades[g.id] || {};
      return [
        g.mahasiswa?.nim_nip || g.mahasiswa?.nim || '',
        g.mahasiswa?.name || '',
        edits.kehadiran || 0,
        edits.tugas || 0,
        edits.uts || 0,
        edits.uas || 0,
        edits.score || 0,
        edits.grade || 'E'
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8," 
      + header.join(",") + "\n" 
      + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nilai_${course.code}_${course.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e, course) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\\n');
      
      const newEdits = { ...editedGrades };
      let importedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(',').map(item => item.replace(/"/g, '').trim());
        const nim = row[0];
        
        // Find matching student
        const gradeObj = course.grades.find(g => (g.mahasiswa?.nim_nip === nim || g.mahasiswa?.nim === nim));
        if (gradeObj) {
          const k = row[2] || 0;
          const t = row[3] || 0;
          const ut = row[4] || 0;
          const ua = row[5] || 0;

          const updated = { kehadiran: k, tugas: t, uts: ut, uas: ua };
          const { score, grade } = calculateScoreAndGrade(updated);
          newEdits[gradeObj.id] = { ...updated, score, grade };
          importedCount++;
        }
      }
      
      setEditedGrades(newEdits);
      window.toast(`Berhasil mengimpor nilai untuk ${importedCount} mahasiswa.`);
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Gradebook...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 100%' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Sistem Penilaian (Gradebook)</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem' }}>Input nilai komponen mahasiswa secara interaktif atau gunakan fitur Import CSV.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {data.jadwal.map(course => (
          <button 
            key={course.id}
            onClick={() => { setActiveCourseId(course.id); setSearchTerm(''); }}
            style={{
              padding: '10px 20px', borderRadius: '999px', fontWeight: 'bold', whiteSpace: 'nowrap',
              background: activeCourseId === course.id ? 'var(--umiba-red)' : 'var(--glass-bg)',
              color: activeCourseId === course.id ? 'white' : 'var(--color-text)',
              border: activeCourseId === course.id ? 'none' : '1px solid var(--color-border)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {course.code} - {course.name}
          </button>
        ))}
      </div>

      {data.jadwal.map(course => {
        if (course.id !== activeCourseId) return null;

        const filteredGrades = (course.grades || []).filter(g => {
          const query = searchTerm.toLowerCase();
          const name = g.mahasiswa?.name?.toLowerCase() || '';
          const nim = g.mahasiswa?.nim_nip?.toLowerCase() || g.mahasiswa?.nim?.toLowerCase() || '';
          return name.includes(query) || nim.includes(query);
        });
        
        return (
          <div key={course.id} className="siakad-card stagger-1" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--color-border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: 'var(--color-text)', margin: '0 0 4px 0', fontSize: '1.25rem' }}>{course.name}</h2>
                <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}>{course.semester} • {course.sks} SKS</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
                  <input 
                    type="text" 
                    placeholder="Cari mahasiswa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', width: '200px' }}
                  />
                </div>
                
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImportCSV(e, course)}
                />
                
                <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 16px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <i className="ph ph-upload-simple"></i> Import CSV
                </button>
                
                <button onClick={() => handleExportCSV(course)} style={{ padding: '10px 16px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <i className="ph ph-download-simple"></i> Export CSV
                </button>

                <button 
                  onClick={() => handleSaveGrades(course.id)}
                  disabled={savingGrades}
                  style={{
                    background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', 
                    borderRadius: '8px', cursor: savingGrades ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className={savingGrades ? "ph-spinner ph-spin" : "ph-floppy-disk"}></i> {savingGrades ? 'Menyimpan...' : 'Simpan Nilai'}
                </button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>Mahasiswa</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Kehadiran (10%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Tugas (20%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UTS (30%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UAS (40%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '100px' }}>Nilai Akhir</th>
                    <th style={{ padding: '16px 24px', fontWeight: 'bold', width: '100px' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade, idx) => {
                    const edits = editedGrades[grade.id] || {};
                    const isPassed = parseFloat(edits.score) >= 60;
                    
                    return (
                      <tr key={grade.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)' }}>{grade.mahasiswa?.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>{grade.mahasiswa?.nim_nip || grade.mahasiswa?.nim}</p>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.kehadiran || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'kehadiran', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.tugas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'tugas', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uts || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uts', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uas', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{edits.score || '-'}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '40px', height: '40px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem',
                            background: edits.grade ? (isPassed ? '#dcfce7' : '#fee2e2') : 'rgba(255,255,255,0.05)',
                            color: edits.grade ? (isPassed ? '#166534' : '#991b1b') : 'var(--color-muted)',
                            border: `1px solid ${edits.grade ? (isPassed ? '#86efac' : '#f87171') : 'var(--color-border)'}`
                          }}>
                            {edits.grade || '-'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredGrades.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>
                        <i className="ph ph-users-slash" style={{ fontSize: '3rem', color: 'var(--color-muted)', margin: '0 auto 10px', display: 'block' }}></i>
                        {searchTerm ? 'Mahasiswa tidak ditemukan.' : 'Belum ada mahasiswa yang terdaftar di kelas ini'}
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
