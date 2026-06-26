"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MahasiswaDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
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
      <header style={{ background: '#B91C1C', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>SIAKAD Mahasiswa</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Profil Mahasiswa</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: '#4b5563' }}>
            <div><strong>Nama:</strong> {data.user.name}</div>
            <div><strong>NIM:</strong> {data.user.nim_nip}</div>
            <div><strong>Program Studi:</strong> {data.user.prodi}</div>
            <div><strong>Email:</strong> {data.user.email}</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Kartu Hasil Studi (KHS)</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px' }}>Kode MK</th>
                <th style={{ padding: '12px' }}>Mata Kuliah</th>
                <th style={{ padding: '12px' }}>SKS</th>
                <th style={{ padding: '12px' }}>Semester</th>
                <th style={{ padding: '12px' }}>Skor</th>
                <th style={{ padding: '12px' }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data.krs.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{item.course.code}</td>
                  <td style={{ padding: '12px' }}>{item.course.name}</td>
                  <td style={{ padding: '12px' }}>{item.course.sks}</td>
                  <td style={{ padding: '12px' }}>{item.course.semester}</td>
                  <td style={{ padding: '12px' }}>{item.score || '-'}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: item.grade ? '#B91C1C' : '#9ca3af' }}>{item.grade || 'Belum Dinilai'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
