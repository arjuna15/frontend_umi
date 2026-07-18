'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiStudents() {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      fetchData();
    });

    return () => cancelAnimationFrame(frame);
  }, [fetchData]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat Data Nilai...
    </div>
  );

  const calculateGradeDistribution = () => {
    const dist = { A: 0, B: 0, C: 0, D: 0, E: 0, Belum: 0 };
    let total = 0;
    grades.forEach(g => {
      total++;
      if (['A', 'A-'].includes(g.grade)) dist.A++;
      else if (['B+', 'B', 'B-'].includes(g.grade)) dist.B++;
      else if (['C+', 'C'].includes(g.grade)) dist.C++;
      else if (['D'].includes(g.grade)) dist.D++;
      else if (['E'].includes(g.grade)) dist.E++;
      else dist.Belum++;
    });
    return { dist, total };
  };

  const { dist, total } = calculateGradeDistribution();

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — KAPRODI</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Monitoring Nilai Mahasiswa</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Distribusi dan rekapitulasi nilai akhir seluruh mahasiswa di prodi.</p>
        </div>
      </div>

      <div className="siakad-card stagger-1" style={{ marginBottom: '30px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-text)', fontWeight: 'bold' }}>Distribusi Nilai (Keseluruhan Prodi)</h3>
        <div style={{ height: '320px', width: '100%', padding: '20px 16px', background: 'var(--liquid-bg)', border: 'var(--inset-border)', borderRadius: '20px', boxShadow: 'inset 2px 2px 4px var(--inset-shadow-dark), inset -2px -2px 4px var(--inset-shadow-light)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: '16px', paddingBottom: '10px' }}>
            {Object.keys(dist).map(key => {
              const count = dist[key];
              const heightPercentage = total > 0 ? (count / total) * 100 : 0;
              const color = key === 'A' ? '#059669' : key === 'B' ? '#C41E3A' : key === 'C' ? '#f59e0b' : key === 'Belum' ? 'var(--color-muted)' : '#ef4444';
              return (
                <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', height: '100%' }}>
                  <div style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.9rem' }}>{count}</div>
                  <div style={{ width: '40px', background: color, height: `${heightPercentage}%`, minHeight: '4px', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.35), inset -1px -1px 2px rgba(0,0,0,0.08)' }}></div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{key}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', overflow: 'hidden', borderRadius: '24px', background: 'var(--glass-bg)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Rekapitulasi Nilai Mahasiswa</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem', zIndex: 10 }}></i>
            <input 
              className="siakad-input"
              type="text" 
              placeholder="Cari nama, NIM, mata kuliah, grade..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                paddingLeft: '46px', 
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                boxShadow: 'inset 4px 4px 8px var(--inset-shadow-dark), inset -4px -4px 8px var(--inset-shadow-light)',
                background: 'var(--liquid-bg)',
                border: 'var(--inset-border)',
                borderRadius: '50px',
                outline: 'none'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px', width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', border: 'var(--glass-border)', boxShadow: 'var(--glass-shadow)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px 24px' }}>Mahasiswa</th>
              <th style={{ padding: '16px 24px' }}>Mata Kuliah</th>
              <th style={{ padding: '16px 24px' }}>Skor Akhir</th>
              <th style={{ padding: '16px 24px' }}>Grade</th>
              <th style={{ padding: '16px 24px' }}>Status Kelulusan</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filteredGrades = grades.filter(grade => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  grade.mahasiswa?.name?.toLowerCase().includes(query) ||
                  grade.mahasiswa?.nim_nip?.toLowerCase().includes(query) ||
                  grade.course?.name?.toLowerCase().includes(query) ||
                  grade.grade?.toLowerCase().includes(query)
                );
              });

              if (filteredGrades.length === 0) {
                return (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>Tidak ada data nilai yang cocok.</td>
                  </tr>
                );
              }

              return filteredGrades.map(grade => (
                <tr key={grade.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{grade.mahasiswa?.name} <br/><small style={{ color: 'var(--color-muted)', fontWeight: 'normal' }}>{grade.mahasiswa?.nim_nip}</small></td>
                  <td style={{ padding: '16px 24px' }}>{grade.course?.name}</td>
                  <td style={{ padding: '16px 24px' }}>{grade.score !== null ? grade.score : '-'}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 800, color: ['A', 'A-'].includes(grade.grade) ? '#059669' : ['E', 'D'].includes(grade.grade) ? '#ef4444' : 'var(--color-text)' }}>
                    {grade.grade || '-'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {grade.grade === null ? (
                      <span className="siakad-badge" style={{ background: 'var(--color-border)', color: 'var(--color-muted)', borderRadius: '50px', padding: '4px 12px' }}>Belum Dinilai</span>
                    ) : ['E', 'D'].includes(grade.grade) ? (
                      <span className="siakad-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '50px', padding: '4px 12px' }}>Tidak Lulus</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#059669', borderRadius: '50px', padding: '4px 12px' }}>Lulus</span>
                    )}
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
