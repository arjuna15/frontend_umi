"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('siakad_token');
      if (!token) return router.push('/siakad/login');

      try {
        const res = await fetch('http://127.0.0.1:8000/api/siakad/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        if (result.user.role !== 'dosen') return router.push('/siakad/login');
        setData(result);
      } catch (err) {
        router.push('/siakad/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('siakad_token');
    localStorage.removeItem('siakad_role');
    router.push('/siakad/login');
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>Memuat data...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#047857', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>SIAKAD Dosen</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Profil Dosen</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: '#4b5563' }}>
            <div><strong>Nama:</strong> {data.user.name}</div>
            <div><strong>NIP:</strong> {data.user.nim_nip}</div>
            <div><strong>Homebase:</strong> {data.user.prodi}</div>
            <div><strong>Email:</strong> {data.user.email}</div>
          </div>
        </div>

        <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>Kelas yang Diampu</h2>
        
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#047857', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              {course.code} - {course.name} ({course.sks} SKS) | {course.semester}
            </h3>
            
            <h4 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1rem', color: '#4b5563' }}>Daftar Mahasiswa:</h4>
            {course.grades && course.grades.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '12px' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px' }}>NIM</th>
                    <th style={{ padding: '12px' }}>Nama Mahasiswa</th>
                    <th style={{ padding: '12px' }}>Skor</th>
                    <th style={{ padding: '12px' }}>Nilai Huruf</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades.map((grade, j) => (
                    <tr key={j} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{grade.mahasiswa?.nim_nip}</td>
                      <td style={{ padding: '12px' }}>{grade.mahasiswa?.name}</td>
                      <td style={{ padding: '12px' }}>{grade.score || '-'}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{grade.grade || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Belum ada mahasiswa terdaftar di kelas ini.</p>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
