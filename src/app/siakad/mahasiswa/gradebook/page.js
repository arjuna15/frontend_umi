"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaGradebook() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat rapor akademik...
    </div>
  );

  let totalSks = 0;
  let totalBobot = 0;
  data.forEach(item => {
    totalSks += item.sks;
    let bobot = 4;
    if (item.huruf === 'B') bobot = 3;
    if (item.huruf === 'C') bobot = 2;
    if (item.huruf === 'D') bobot = 1;
    if (item.huruf === 'E') bobot = 0;
    totalBobot += (bobot * item.sks);
  });
  const ipSemester = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : 0;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Rapor & Transkrip 🎓</h1>
        <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '1.05rem' }}>Detail evaluasi akademik semester ini, dari tugas harian hingga UAS.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="siakad-card" style={{ flex: '1 1 200px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--glass-bg)', color: 'var(--color-text)' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
            <i className="ph ph-medal"></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Indeks Prestasi Semester</p>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: '#ffffff' }}>{ipSemester}</h1>
          </div>
        </div>
        
        <div className="siakad-card" style={{ flex: '1 1 200px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--glass-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
            <i className="ph ph-books"></i>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text)' }}>Total SKS Lulus</p>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)' }}>{totalSks}</h1>
          </div>
        </div>
      </div>

      <div className="siakad-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: 'var(--glass-bg)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold' }}>Rincian Nilai Mata Kuliah</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="siakad-table" style={{ width: '100%', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Mata Kuliah</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>SKS</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>Tugas (20%)</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>Kuis (20%)</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>UTS (30%)</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>UAS (30%)</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>Angka</th>
                <th style={{ padding: '16px 24px', textAlign: 'center' }}>Mutu</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-text)' }}>{item.course_name}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--color-text)' }}>{item.sks}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>{item.tugas}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>{item.kuis}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>{item.uts}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>{item.uas}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 'bold' }}>{item.akhir}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span className="siakad-badge" style={{
                      background: item.huruf?.startsWith('A') ? 'rgba(16, 185, 129, 0.15)' : 
                                 item.huruf?.startsWith('B') ? 'rgba(59, 130, 246, 0.15)' : 
                                 item.huruf?.startsWith('C') ? 'rgba(234, 179, 8, 0.15)' : 
                                 item.huruf?.startsWith('D') ? 'rgba(249, 115, 22, 0.15)' : 
                                 item.huruf ? 'rgba(239, 68, 68, 0.15)' : 'var(--glass-bg)',
                      color: item.huruf?.startsWith('A') ? '#10b981' : 
                             item.huruf?.startsWith('B') ? '#3b82f6' : 
                             item.huruf?.startsWith('C') ? '#eab308' : 
                             item.huruf?.startsWith('D') ? '#f97316' : 
                             item.huruf ? '#ef4444' : 'var(--color-muted)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '4px 16px'
                    }}>
                      {item.huruf}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
