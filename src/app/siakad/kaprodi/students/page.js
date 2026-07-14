'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KaprodiStudents() {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

      <div className="siakad-card stagger-1" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>Distribusi Nilai (Keseluruhan Prodi)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
          {Object.keys(dist).map(key => {
            const count = dist[key];
            const heightPercentage = total > 0 ? (count / total) * 100 : 0;
            const color = key === 'A' ? '#10b981' : key === 'B' ? '#3b82f6' : key === 'C' ? '#f59e0b' : key === 'Belum' ? 'var(--color-muted)' : '#ef4444';
            return (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.9rem' }}>{count}</div>
                <div style={{ width: '40px', background: color, height: `${heightPercentage}%`, minHeight: '4px', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }}></div>
                <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{key}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="siakad-card stagger-2" style={{ padding: '24px 0 0 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Rekapitulasi Nilai Mahasiswa</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1.1rem' }}></i>
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
                fontSize: '0.9rem'
              }} 
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
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
                  <td style={{ padding: '16px 24px', fontWeight: 800, color: ['A', 'A-'].includes(grade.grade) ? '#10b981' : ['E', 'D'].includes(grade.grade) ? '#ef4444' : '#1f2937' }}>
                    {grade.grade || '-'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {grade.grade === null ? (
                      <span className="siakad-badge" style={{ background: 'var(--color-border)', color: 'var(--color-muted)' }}>Belum Dinilai</span>
                    ) : ['E', 'D'].includes(grade.grade) ? (
                      <span className="siakad-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Tidak Lulus</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#dcfce7', color: '#166534' }}>Lulus</span>
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
