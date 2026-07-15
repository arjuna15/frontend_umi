"use client";
import { useEffect, useState, useRef } from 'react';
import ModalShell from '../../components/ModalShell';
import { useRouter } from 'next/navigation';

const defaultWeights = {
  attendance_weight: 10,
  assignment_weight: 20,
  uts_weight: 30,
  uas_weight: 40
};

export default function DosenGradebookPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track editable grade components per student and course-specific weights.
  const [editedGrades, setEditedGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightForm, setWeightForm] = useState({
    attendance_weight: '10',
    assignment_weight: '20',
    uts_weight: '30',
    uas_weight: '40'
  });
  const [weightSaving, setWeightSaving] = useState(false);
  const fileInputRef = useRef(null);

  const getCourseWeights = (course = {}) => ({
    attendance_weight: course.attendance_weight ?? defaultWeights.attendance_weight,
    assignment_weight: course.assignment_weight ?? defaultWeights.assignment_weight,
    uts_weight: course.uts_weight ?? defaultWeights.uts_weight,
    uas_weight: course.uas_weight ?? defaultWeights.uas_weight
  });

  const formatScoreValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return Number(num.toFixed(2)).toString();
  };

  const calculateScoreAndGrade = (components, weights = defaultWeights) => {
    const k = parseFloat(components.kehadiran) || 0;
    const t = parseFloat(components.tugas) || 0;
    const ut = parseFloat(components.uts) || 0;
    const ua = parseFloat(components.uas) || 0;
    const courseWeights = { ...defaultWeights, ...weights };
    const totalWeight = ['attendance_weight', 'assignment_weight', 'uts_weight', 'uas_weight']
      .map(key => parseFloat(courseWeights[key]) || 0)
      .reduce((sum, value) => sum + value, 0);

    const finalScore = totalWeight > 0
      ? ((k * (parseFloat(courseWeights.attendance_weight) || 0)) +
         (t * (parseFloat(courseWeights.assignment_weight) || 0)) +
         (ut * (parseFloat(courseWeights.uts_weight) || 0)) +
         (ua * (parseFloat(courseWeights.uas_weight) || 0))) / totalWeight
      : 0;
    
    let grade = 'E';
    if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 80) grade = 'A-';
    else if (finalScore >= 75) grade = 'B+';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 65) grade = 'B-';
    else if (finalScore >= 60) grade = 'C+';
    else if (finalScore >= 55) grade = 'C';
    else if (finalScore >= 40) grade = 'D';

    return { score: finalScore, grade };
  };

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const activePortal = localStorage.getItem('siakad_portal') || localStorage.getItem('siakad_role');
      const res = await fetch(`${apiUrl}/siakad/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(activePortal ? { 'X-SIAKAD-PORTAL': activePortal } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      if (result.user.role !== 'dosen' && !(result.user.role === 'kaprodi' && activePortal === 'dosen')) return router.push('/siakad/login');
      setData(result);
      
      const initialEdits = {};
      result.jadwal.forEach(course => {
        if (course.grades) {
          course.grades.forEach(g => {
            initialEdits[g.id] = {
              kehadiran: g.attendance_score !== null && g.attendance_score !== undefined ? String(parseFloat(g.attendance_score)) : '',
              tugas: g.assignment_score !== null && g.assignment_score !== undefined ? String(parseFloat(g.assignment_score)) : '',
              uts: g.uts_score !== null && g.uts_score !== undefined ? String(parseFloat(g.uts_score)) : '',
              uas: g.uas_score !== null && g.uas_score !== undefined ? String(parseFloat(g.uas_score)) : '',
              score: g.score !== null && g.score !== undefined ? String(g.score) : '',
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

  useEffect(() => {
    if (!data || !activeCourseId) return;
    const course = data.jadwal.find(item => item.id === activeCourseId);
    if (!course) return;
    setWeightForm({
      attendance_weight: String(course.attendance_weight ?? defaultWeights.attendance_weight),
      assignment_weight: String(course.assignment_weight ?? defaultWeights.assignment_weight),
      uts_weight: String(course.uts_weight ?? defaultWeights.uts_weight),
      uas_weight: String(course.uas_weight ?? defaultWeights.uas_weight)
    });
  }, [data, activeCourseId]);

  const getCourseByGradeId = (gradeId) => {
    return data?.jadwal?.find(course => course.grades?.some(g => g.id === gradeId));
  };

  const handleGradeChange = (gradeId, field, value) => {
    setEditedGrades(prev => {
      const current = prev[gradeId] || {};
      const updated = { ...current, [field]: value };
      const course = getCourseByGradeId(gradeId);
      const { score, grade } = calculateScoreAndGrade(updated, getCourseWeights(course));
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
          attendance_score: edits.kehadiran !== '' && edits.kehadiran !== undefined ? parseFloat(edits.kehadiran) : null,
          assignment_score: edits.tugas !== '' && edits.tugas !== undefined ? parseFloat(edits.tugas) : null,
          uts_score: edits.uts !== '' && edits.uts !== undefined ? parseFloat(edits.uts) : null,
          uas_score: edits.uas !== '' && edits.uas !== undefined ? parseFloat(edits.uas) : null,
          score: edits.score !== '' && edits.score !== undefined ? parseFloat(edits.score) : null,
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
              attendance_score: edits.kehadiran !== '' && edits.kehadiran !== undefined ? parseFloat(edits.kehadiran) : null,
              assignment_score: edits.tugas !== '' && edits.tugas !== undefined ? parseFloat(edits.tugas) : null,
              uts_score: edits.uts !== '' && edits.uts !== undefined ? parseFloat(edits.uts) : null,
              uas_score: edits.uas !== '' && edits.uas !== undefined ? parseFloat(edits.uas) : null,
              score: edits.score !== '' && edits.score !== undefined ? parseFloat(edits.score) : null,
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
          const { score, grade } = calculateScoreAndGrade(updated, getCourseWeights(course));
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
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
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
                  <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}></i>
                  <input 
                    type="text" 
                    placeholder="Cari mahasiswa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 10px 10px 46px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', width: '200px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)' }}
                  />
                </div>
                
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleImportCSV(e, course)}
                />
                              <button onClick={() => setShowWeightModal(true)} style={{ padding: '10px 18px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <i className="ph ph-sliders"></i> Atur Bobot
                </button>

                <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 18px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <i className="ph ph-upload-simple"></i> Import CSV
                </button>
                
                <button onClick={() => handleExportCSV(course)} style={{ padding: '10px 18px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <i className="ph ph-download-simple"></i> Export CSV
                </button>

                <button 
                  onClick={() => handleSaveGrades(course.id)}
                  disabled={savingGrades}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 24px', 
                    borderRadius: '50px', cursor: savingGrades ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: '0 8px 20px rgba(16,185,129,0.3)'
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
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Kehadiran ({formatScoreValue(getCourseWeights(course).attendance_weight)}%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>Tugas ({formatScoreValue(getCourseWeights(course).assignment_weight)}%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UTS ({formatScoreValue(getCourseWeights(course).uts_weight)}%)</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', width: '120px' }}>UAS ({formatScoreValue(getCourseWeights(course).uas_weight)}%)</th>
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
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.tugas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'tugas', e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uts || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uts', e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input 
                            type="number" min="0" max="100" placeholder="0-100"
                            value={edits.uas || ''}
                            onChange={(e) => handleGradeChange(grade.id, 'uas', e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', transition: 'border 0.2s', fontWeight: '500', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{formatScoreValue(edits.score)}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '40px', height: '40px', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.2rem',
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
    {showWeightModal && activeCourseId && (() => {
      const course = data.jadwal.find(item => item.id === activeCourseId);
      if (!course) return null;
      return (
        <ModalShell
          title="Atur Bobot Nilai"
          subtitle={`${course.code} • ${course.name}`}
          icon="ph-sliders"
          onClose={() => setShowWeightModal(false)}
          maxWidth="520px"
          footer={(
            <>
              <button
                type="button"
                onClick={() => setShowWeightModal(false)}
                style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  setWeightSaving(true);
                  const token = localStorage.getItem('siakad_token');
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                  try {
                    const res = await fetch(`${apiUrl}/siakad/dosen/courses/${course.id}/grading-weights`, {
                      method: 'PUT',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        attendance_weight: weightForm.attendance_weight,
                        assignment_weight: weightForm.assignment_weight,
                        uts_weight: weightForm.uts_weight,
                        uas_weight: weightForm.uas_weight
                      })
                    });
                    if (!res.ok) {
                      throw new Error('Gagal menyimpan bobot');
                    }
                    setShowWeightModal(false);
                    await fetchDashboard();
                    window.toast('Bobot nilai berhasil disimpan.');
                  } catch (err) {
                    window.toast('Error: ' + err.message);
                  } finally {
                    setWeightSaving(false);
                  }
                }}
                style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', color: 'white', cursor: 'pointer', fontWeight: 700, opacity: weightSaving ? 0.7 : 1 }}
                disabled={weightSaving}
              >
                {weightSaving ? 'Menyimpan...' : 'Simpan Bobot'}
              </button>
            </>
          )}
        >
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              ['attendance_weight', 'Kehadiran'],
              ['assignment_weight', 'Tugas'],
              ['uts_weight', 'UTS'],
              ['uas_weight', 'UAS']
            ].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>{label} (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={weightForm[key]}
                  onChange={(e) => setWeightForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="siakad-input"
                  style={{ width: '100%' }}
                />
              </div>
            ))}
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              Total bobot dihitung otomatis saat nilai akhir dihitung.
            </p>
          </div>
        </ModalShell>
      );
    })()}
    </div>
  );
}
