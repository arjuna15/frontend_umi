"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ElearningPage() {
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

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat ruang kelas virtual...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>E-Learning & Ruang Kelas 📚</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Akses materi kuliah dan kumpulkan tugas Anda dari dosen.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.krs.map((item, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 'bold' }}>{item.course?.name}</h3>
              <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.85rem', color: '#64748b' }}>{item.course?.code} • {item.course?.sks} SKS</span>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph-folder" style={{ color: '#3b82f6' }}></i> Materi Perkuliahan
                </h4>
                {item.course?.materials && item.course.materials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.course.materials.map((mat, j) => (
                      <li key={j}>
                        <a href={mat.content_link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', textDecoration: 'none', color: '#0369a1', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                          <i className="ph-file-pdf" style={{ fontSize: '1.2rem' }}></i> {mat.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>Belum ada materi diunggah.</p>
                )}
              </div>

              {/* Assignments Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph-clipboard-text" style={{ color: '#ef4444' }}></i> Tugas & Kuis
                </h4>
                {item.course?.assignments && item.course.assignments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.course.assignments.map((ass, j) => (
                      <li key={j} style={{ padding: '16px', border: '1px solid #fecaca', background: '#fef2f2', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{ass.title}</strong>
                          <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Deadline: {ass.deadline}</span>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#7f1d1d' }}>{ass.description}</p>
                        <button style={{ background: 'white', border: '1px solid #fca5a5', color: '#b91c1c', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Kumpulkan Tugas</button>
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
