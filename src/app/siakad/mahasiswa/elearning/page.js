"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ElearningPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  const activeItem = selectedCourseId 
    ? data.krs.find((item) => item.course?.id === selectedCourseId) 
    : null;

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Page Header */}
      <div className="siakad-page-header" style={{ marginBottom: '24px' }}>
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>E-Learning & Ruang Kelas</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Akses materi kuliah dan kumpulkan tugas Anda dari dosen.</p>
        </div>
      </div>

      {selectedCourseId && activeItem ? (
        /* COURSE DETAIL VIEW */
        <div className="fade-in">
          <button 
            onClick={() => setSelectedCourseId(null)} 
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--color-border)', 
              padding: '10px 18px', 
              borderRadius: '12px', 
              color: 'var(--color-text)', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '20px', 
              transition: 'all 0.3s' 
            }}
            className="btn-back-hover"
          >
            <i className="ph ph-arrow-left"></i> Kembali ke Daftar Kelas
          </button>

          <div className="siakad-card stagger-1">
            <div style={{ background: 'var(--glass-bg)', padding: '24px 32px', borderBottom: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(15,23,42,0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph ph-laptop"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text)', fontWeight: '800', letterSpacing: '-0.02em' }}>{activeItem.course?.name}</h3>
              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: '600', padding: '4px 12px', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', borderRadius: '999px' }}>{activeItem.course?.code} • {activeItem.course?.sks} SKS</span>
            </div>
            
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass-bg)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' , flexShrink: 0 }}>
                    <i className="ph ph-folder-open"></i>
                  </div>
                  Materi Perkuliahan
                </h4>
                {activeItem.course?.materials && activeItem.course.materials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeItem.course.materials.map((mat, j) => (
                      <li key={j}>
                        <a href="#" onClick={(e) => handleDownload(e, mat.id, mat.title)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--glass-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-text)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                          <i className="ph ph-file-pdf" style={{ fontSize: '1.2rem', color: '#ef4444' }}></i> {mat.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>Belum ada materi diunggah.</p>
                )}
              </div>

              {/* Quizzes Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-puzzle-piece" style={{ color: '#3b82f6' }}></i> Kuis & Ujian
                </h4>
                {activeItem.course?.quizzes && activeItem.course.quizzes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeItem.course.quizzes.map((quiz, j) => (
                      <div key={j} style={{ padding: '16px', border: '1px solid rgba(59,130,246,0.2)', background: 'var(--glass-bg)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{quiz.title}</strong>
                            {quiz.category === 'uts' && (
                              <span style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>UTS</span>
                            )}
                            {quiz.category === 'uas' && (
                              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>UAS</span>
                            )}
                            {quiz.category === 'kuis' && (
                              <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Kuis</span>
                            )}
                            {(quiz.require_proctoring === true || quiz.require_proctoring === 1) && (
                              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Diawasi AI</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{quiz.duration_minutes} menit • {quiz.questions?.length || 0} soal</span>
                        </div>
                        {quiz.require_proctoring === true || quiz.require_proctoring === 1 ? (
                          <button type="button" onClick={() => router.push('/siakad/mahasiswa/proctoring')} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="ph ph-eye"></i> Ujian Diawasi
                          </button>
                        ) : (
                          <button type="button" onClick={() => router.push(`/siakad/mahasiswa/elearning/quiz?quizId=${quiz.id}`)} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)' }}>
                            Kerjakan
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                    <i className="ph ph-confetti" style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '8px' }}></i>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-text)' }}>Belum ada kuis aktif.</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Dosen belum menerbitkan kuis untuk kelas ini.</p>
                  </div>
                )}
              </div>

              {/* Assignments Section */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-clipboard-text" style={{ color: '#C41E3A' }}></i> Tugas & Kuis
                </h4>
                {activeItem.course?.assignments && activeItem.course.assignments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeItem.course.assignments.map((ass, j) => {
                      const submission = ass.submissions?.find(s => s.mahasiswa_id === data.user.id);
                      return (
                        <li key={j} style={{ padding: '16px', border: '1px solid rgba(196,30,58,0.2)', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem', flex: '1 1 100%' }}>{ass.title}</strong>
                            <span style={{ background: '#0f172a', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block' }}>Deadline: {ass.deadline}</span>
                          </div>
                          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--color-text)' }}>{ass.description}</p>
                          
                          {submission ? (
                            <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(16,185,129,0.3)' }}>
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
                              style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}
                            >
                              <input 
                                type="file" 
                                name="file" 
                                required 
                                className="siakad-file-input"
                                style={{ flex: '1 1 200px' }} 
                              />
                              <button 
                                type="submit" 
                                style={{ 
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                  color: 'white', 
                                  border: 'none', 
                                  padding: '10px 20px', 
                                  borderRadius: '50px', 
                                  fontSize: '0.85rem', 
                                  fontWeight: 'bold', 
                                  cursor: 'pointer', 
                                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                                  flex: '0 0 auto',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Upload & Kumpulkan
                              </button>
                            </form>
                          )}
                        </li>
                      );
                    })}
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
        </div>
      ) : (
        /* COURSE GRID VIEW (ALL COURSES) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }} className="fade-in">
          {data.krs.map((item, i) => {
            const materialCount = item.course?.materials?.length || 0;
            const quizCount = item.course?.quizzes?.length || 0;
            const assignmentCount = item.course?.assignments?.length || 0;

            return (
              <div 
                key={i} 
                className={`siakad-card stagger-${(i % 5) + 1}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)', background: 'var(--glass-bg)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: '800', lineHeight: '1.3' }}>{item.course?.name}</h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 'bold' }}>{item.course?.code} • {item.course?.sks} SKS</p>
                </div>
                
                <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                  
                  {/* Summary of content */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, textAlign: 'center', background: 'var(--liquid-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px' }}>
                      <i className="ph ph-folder" style={{ fontSize: '1.2rem', color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}></i>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Materi</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{materialCount}</strong>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: 'var(--liquid-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px' }}>
                      <i className="ph ph-puzzle-piece" style={{ fontSize: '1.2rem', color: '#3b82f6', display: 'block', marginBottom: '4px' }}></i>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Kuis</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{quizCount}</strong>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: 'var(--liquid-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px' }}>
                      <i className="ph ph-clipboard-text" style={{ fontSize: '1.2rem', color: '#C41E3A', display: 'block', marginBottom: '4px' }}></i>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Tugas</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{assignmentCount}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCourseId(item.course?.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                      transition: 'all 0.3s'
                    }}
                    className="btn-enter-classroom"
                  >
                    Buka Kelas Virtual <i className="ph ph-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .btn-back-hover:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(-4px);
        }
        .btn-enter-classroom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35) !important;
        }
      `}</style>
    </div>
  );
}
