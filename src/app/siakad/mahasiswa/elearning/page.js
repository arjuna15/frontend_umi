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
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'linear-gradient(90deg, rgba(238,242,255,0.7) 0%, rgba(255,255,255,0) 100%)', padding: '24px 32px', borderBottom: '1px solid rgba(199,210,254,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(99,102,241,0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph-laptop"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#312e81', fontWeight: '800', letterSpacing: '-0.02em' }}>{item.course?.name}</h3>
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600', padding: '4px 12px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '999px' }}>{item.course?.code} • {item.course?.sks} SKS</span>
            </div>
            
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ph-folder-open"></i>
                  </div>
                  Materi Perkuliahan
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
                        
                        {ass.submissions && ass.submissions.find(s => s.mahasiswa_id === data.user.id) ? (
                          <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <i className="ph-check-circle"></i> Tugas sudah dikumpulkan. Nilai: {ass.submissions.find(s => s.mahasiswa_id === data.user.id).grade || 'Belum dinilai'}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="file" style={{ fontSize: '0.85rem' }} />
                            <button style={{ background: 'white', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Upload & Kumpulkan</button>
                          </div>
                        )}
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
