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
      
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
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

      <div className="siakad-card stagger-2" style={{ overflow: 'hidden' }}>
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
                  <td style={{ fontWeight: 600 }}>{grade.mahasiswa?.name} <br/><small style={{ color: 'var(--color-muted)', fontWeight: 'normal' }}>{grade.mahasiswa?.nim_nip}</small></td>
                  <td>{grade.course?.name}</td>
                  <td>{grade.score !== null ? grade.score : '-'}</td>
                  <td style={{ fontWeight: 800, color: ['A', 'A-'].includes(grade.grade) ? '#10b981' : ['E', 'D'].includes(grade.grade) ? '#ef4444' : '#1f2937' }}>
                    {grade.grade || '-'}
                  </td>
                  <td>
                    {grade.grade === null ? (
                      <span className="siakad-badge" style={{ background: 'var(--color-border)', color: 'var(--color-muted)' }}>Belum Dinilai</span>
                    ) : ['E', 'D'].includes(grade.grade) ? (
                      <span className="siakad-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Tidak Lulus</span>
                    ) : (
                      <span className="siakad-badge" style={{ background: '#dcfce7', color: '#166534' }}>Lulus</span>
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
