"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenElearningPage() {
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

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat modul E-Learning...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Manajemen E-Learning 👨‍🏫</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Kelola materi dan berikan tugas kepada mahasiswa.</p>
        </div>
        <button style={{ background: '#059669', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ph-plus-circle" style={{ fontSize: '1.2rem' }}></i> Buat Tugas Baru
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ background: '#f0fdf4', padding: '20px 24px', borderBottom: '1px solid #dcfce7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#064e3b', fontWeight: 'bold' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: '#047857' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <button style={{ background: 'white', border: '1px solid #a7f3d0', color: '#059669', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <i className="ph-upload-simple"></i> Unggah Materi
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph-folder" style={{ color: '#0ea5e9' }}></i> File Materi 
                </h4>
                {course.materials && course.materials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {course.materials.map((mat, j) => (
                      <li key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                          <i className="ph-file-pdf" style={{ fontSize: '1.2rem', color: '#ef4444' }}></i> {mat.title}
                        </div>
                        <i className="ph-trash" style={{ color: '#ef4444', cursor: 'pointer' }}></i>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>Tidak ada materi.</p>
                )}
              </div>

              {/* Assignments Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph-clipboard-text" style={{ color: '#f59e0b' }}></i> Tugas / Quiz Aktif
                </h4>
                {course.assignments && course.assignments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {course.assignments.map((ass, j) => (
                      <li key={j} style={{ padding: '16px', border: '1px solid #fef3c7', background: '#fffbeb', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong style={{ color: '#b45309', fontSize: '0.95rem' }}>{ass.title}</strong>
                          <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Tenggat: {ass.deadline}</span>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#92400e' }}>{ass.description}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ background: 'white', border: '1px solid #fde68a', color: '#d97706', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Lihat Pengumpulan ({course.grades?.length || 0})</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>Belum ada tugas.</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
