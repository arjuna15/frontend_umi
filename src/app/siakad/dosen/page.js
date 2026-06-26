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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/siakad/dashboard`, {
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

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data akademik...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Selamat datang, {data.user.name}! 👨‍🏫</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Kelola kelas dan nilai mahasiswa Anda dengan mudah.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph-chalkboard"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Total Kelas Diampu</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{data.jadwal.length} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#9ca3af' }}>Kelas</span></h3>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#fef3c7', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="ph-users"></i>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 4px 0' }}>Homebase / Prodi</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{data.user.prodi}</h3>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Daftar Kelas Semester Ini</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: '#e0e7ff', color: '#4338ca', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>{course.code} • {course.sks} SKS</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{course.name}</h3>
              </div>
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#334155', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <i className="ph-pencil-simple"></i> Input Nilai
              </button>
            </div>
            
            <div style={{ padding: '0' }}>
              {course.grades && course.grades.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: '#64748b', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '16px 24px', fontWeight: '600', width: '150px' }}>NIM</th>
                      <th style={{ padding: '16px 24px', fontWeight: '600' }}>Nama Mahasiswa</th>
                      <th style={{ padding: '16px 24px', fontWeight: '600', width: '100px' }}>Skor</th>
                      <th style={{ padding: '16px 24px', fontWeight: '600', width: '120px' }}>Nilai Akhir</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: '#334155', fontSize: '0.95rem' }}>
                    {course.grades.map((grade, j) => (
                      <tr key={j} style={{ borderBottom: j === course.grades.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 24px', fontWeight: '500' }}>{grade.mahasiswa?.nim_nip}</td>
                        <td style={{ padding: '16px 24px' }}>{grade.mahasiswa?.name}</td>
                        <td style={{ padding: '16px 24px' }}>{grade.score || '-'}</td>
                        <td style={{ padding: '16px 24px' }}>
                          {grade.grade ? (
                            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{grade.grade}</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>Kosong</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  <i className="ph-users" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
                  <p style={{ margin: 0 }}>Belum ada mahasiswa yang mengambil kelas ini.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
