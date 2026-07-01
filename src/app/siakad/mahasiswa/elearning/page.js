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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat ruang kelas virtual...
    </div>
  );

  const handleDownload = async (e, id, title) => {
    e.preventDefault();
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/materials/download/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // If the backend redirected (e.g. for external URLs), fetch might just follow it and get the content,
      // or we handle redirect manually. Since the backend sends a redirect for http links,
      // fetch will follow it and download the file.
      if (!res.ok) throw new Error('Gagal mendownload materi');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mendownload materi.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 8px 0' }}>E-Learning & Ruang Kelas</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>Akses materi kuliah dan kumpulkan tugas Anda dari dosen.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.krs.map((item, i) => (
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'var(--glass-bg)', padding: '24px 32px', borderBottom: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(99,102,241,0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph ph-laptop"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)', fontWeight: '800', letterSpacing: '-0.02em' }}>{item.course?.name}</h3>
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '600', padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '999px' }}>{item.course?.code} • {item.course?.sks} SKS</span>
            </div>
            
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass-bg)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ph ph-folder-open"></i>
                  </div>
                  Materi Perkuliahan
                </h4>
                {item.course?.materials && item.course.materials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.course.materials.map((mat, j) => (
                      <li key={j}>
                        <a href="#" onClick={(e) => handleDownload(e, mat.id, mat.title)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--glass-bg)', border: '1px solid #bae6fd', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-text)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                          <i className="ph ph-file-pdf" style={{ fontSize: '1.2rem' }}></i> {mat.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>Belum ada materi diunggah.</p>
                )}
              </div>

              {/* Assignments Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-clipboard-text" style={{ color: '#ef4444' }}></i> Tugas & Kuis
                </h4>
                {item.course?.assignments && item.course.assignments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.course.assignments.map((ass, j) => {
                      const submission = ass.submissions?.find(s => s.mahasiswa_id === data.user.id);
                      return (
                      <li key={j} style={{ padding: '16px', border: '1px solid #fecaca', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem', flex: '1 1 100%' }}>{ass.title}</strong>
                          <span style={{ background: 'var(--glass-bg)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block' }}>Deadline: {ass.deadline}</span>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--color-text)' }}>{ass.description}</p>
                        
                        {submission ? (
                          <div style={{ padding: '8px 12px', background: 'var(--glass-bg)', color: 'var(--color-text)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <i className="ph ph-check-circle"></i> Tugas sudah dikumpulkan. Nilai: {submission.grade || 'Belum dinilai'}
                          </div>
                        ) : (
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const formData = new FormData(e.target);
                              const token = localStorage.getItem('siakad_token');
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                              try {
                                const res = await fetch(`${apiUrl}/siakad/assignment/${ass.id}/submit`, {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token}` },
                                  body: formData,
                                });
                                if (res.ok) {
                                  window.toast('Tugas berhasil dikumpulkan!');
                                  window.location.reload();
                                } else {
                                  window.toast('Gagal mengumpulkan tugas');
                                }
                              } catch (err) {
                                window.toast('Error: ' + err.message);
                              }
                            }}
                            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                          >
                            <input type="file" name="file" required style={{ fontSize: '0.85rem' }} />
                            <button type="submit" style={{ background: 'var(--color-bg)', border: '1px solid #fca5a5', color: 'var(--color-text)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Upload & Kumpulkan</button>
                          </form>
                        )}
                      </li>
                    )})}
                  </ul>
                ) : (
                  <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                    <i className="ph ph-confetti" style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '8px' }}></i>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)' }}>Wah, aman!</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Belum ada tugas atau kuis untuk saat ini.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
