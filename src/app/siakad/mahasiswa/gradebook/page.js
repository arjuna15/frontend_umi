"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '../../components/CustomSelect';
import { getTranslation } from '../../components/i18n';

export default function MahasiswaGradebook() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('Semua');
  const [lang, setLang] = useState('id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('siakad_lang');
      if (savedLang) setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/mahasiswa/gradebook`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [router]);

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return String(Math.round(num));
  };

  const formatValueWithWeight = (value, weight) => {
    const formattedValue = formatNumber(value);
    const formattedWeight = formatNumber(weight);
    return `${formattedValue} (${formattedWeight}%)`;
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat rapor akademik...
    </div>
  );

  let totalSks = 0;
  let totalBobot = 0;
  data.forEach(item => {
    totalSks += item.sks;
    let bobot = 0;
    if (item.huruf === 'A') bobot = 4.0;
    else if (item.huruf === 'A-') bobot = 3.7;
    else if (item.huruf === 'B+') bobot = 3.3;
    else if (item.huruf === 'B') bobot = 3.0;
    else if (item.huruf === 'B-') bobot = 2.7;
    else if (item.huruf === 'C+') bobot = 2.3;
    else if (item.huruf === 'C') bobot = 2.0;
    else if (item.huruf === 'D') bobot = 1.0;
    else if (item.huruf === 'E') bobot = 0;
    
    totalBobot += (bobot * item.sks);
  });
  const ipSemester = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : 0;

  const uniqueSemesters = data && Array.isArray(data) 
    ? Array.from(new Set(data.map(item => item.semester_num).filter(Boolean))).sort((a, b) => a - b)
    : [];

  const selectOptions = [
    { value: "Semua", label: lang === 'en' ? "All Semesters" : "Semua Semester" },
    ...uniqueSemesters.map(sem => ({
      value: String(sem),
      label: `Semester ${sem}`
    }))
  ];

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{getTranslation('gradebook', lang)}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{lang === 'en' ? 'Detail academic evaluation this semester, from homework to final exams.' : 'Detail evaluasi akademik semester ini, dari tugas harian hingga UAS.'}</p>
        </div>
      </div>      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="siakad-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', color: '#f59e0b', border: 'var(--inset-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', flexShrink: 0 }}>
            <i className="ph ph-medal"></i>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{getTranslation('gpa', lang)}</p>
            <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-text)', lineHeight: '1' }}>{ipSemester}</h1>
          </div>
        </div>
        
        <div className="siakad-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', color: 'var(--apple-blue)', border: 'var(--inset-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)', flexShrink: 0 }}>
            <i className="ph ph-books"></i>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--color-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{getTranslation('total_sks', lang)}</p>
            <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-text)', lineHeight: '1' }}>{totalSks}</h1>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ overflow: 'hidden', padding: '24px' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>{lang === 'en' ? 'Course Grades Detail' : 'Rincian Nilai Mata Kuliah'}</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 100%' }}>
            <CustomSelect 
              value={semesterFilter} 
              onChange={val => setSemesterFilter(val)}
              options={selectOptions}
              style={{ flex: '1 1 150px', minWidth: 0 }}
            />
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search course..." : "Cari mata kuliah..."}
              className="siakad-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1 1 150px', minWidth: 0, color: 'var(--color-text)' }}
            />
            <button onClick={() => window.print()} style={{ background: 'var(--glass-bg)', border: 'var(--glass-border)', padding: '10px 24px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: 'var(--glass-shadow)' }}>
              <i className="ph ph-printer"></i> {lang === 'en' ? 'Print Transcript' : 'Cetak Transkrip'}
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>{getTranslation('subject_name', lang)}</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>{getTranslation('sks', lang)}</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>{lang === 'en' ? 'Assignment' : 'Tugas'}</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>{lang === 'en' ? 'Quiz' : 'Kuis'}</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>UTS</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>UAS</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>{lang === 'en' ? 'Score' : 'Angka'}</th>
                <th style={{ padding: '8px 20px', color: 'var(--color-muted)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>{lang === 'en' ? 'Grade' : 'Mutu'}</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredData = data.filter(item => {
                  const matchSearch = item.course_name.toLowerCase().includes(search.toLowerCase());
                  const matchSemester = semesterFilter === 'Semua' || String(item.semester_num) === semesterFilter;
                  return matchSearch && matchSemester;
                });
                if (filteredData.length === 0) {
                  return <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>{lang === 'en' ? 'Course not found.' : 'Mata kuliah tidak ditemukan.'}</td></tr>;
                }
                return filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderLeft: 'var(--inset-border)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      borderRadius: '16px 0 0 16px',
                      boxShadow: 'inset 3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      fontWeight: 'bold',
                      color: 'var(--color-text)'
                    }}>{item.course_name}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center',
                      color: 'var(--color-text)'
                    }}>{item.sks}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center',
                      color: 'var(--color-text)'
                    }}>{formatValueWithWeight(item.tugas, item.assignment_weight)}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center',
                      color: 'var(--color-text)'
                    }}>{formatValueWithWeight(item.kuis, item.attendance_weight)}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center',
                      color: 'var(--color-text)'
                    }}>{formatValueWithWeight(item.uts, item.uts_weight)}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center',
                      color: 'var(--color-text)'
                    }}>{formatValueWithWeight(item.uas, item.uas_weight)}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      boxShadow: 'inset 0 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      color: 'var(--color-text)'
                    }}>{item.akhir}</td>
                    <td style={{ 
                      padding: '14px 20px', 
                      background: 'var(--liquid-bg)',
                      borderRight: 'var(--inset-border)',
                      borderTop: 'var(--inset-border)',
                      borderBottom: 'var(--inset-border)',
                      borderRadius: '0 16px 16px 0',
                      boxShadow: 'inset -3px 3px 5px var(--inset-shadow-dark), inset 0 -3px 5px var(--inset-shadow-light)',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        background: 'var(--glass-bg)',
                        border: 'var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)',
                        color: item.huruf?.startsWith('A') ? '#10b981' : 
                               item.huruf?.startsWith('B') ? '#3b82f6' : 
                               item.huruf?.startsWith('C') ? '#f59e0b' : 
                               item.huruf?.startsWith('D') ? '#ef4444' : 
                               item.huruf ? '#ef4444' : 'var(--color-muted)',
                        fontWeight: '800',
                        fontSize: '0.82rem',
                        padding: '4px 14px',
                        borderRadius: '50px'
                      }}>
                        {item.huruf}
                      </span>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
