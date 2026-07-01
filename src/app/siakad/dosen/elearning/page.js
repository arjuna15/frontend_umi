'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenElearningPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/siakad/dosen/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      
      const courseList = result.schedule ? result.schedule.map(s => ({ id: s.course, name: s.course })) : [];
      setCourses(courseList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const token = localStorage.getItem('siakad_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      // Assume courseId is actually a name here due to mock, but in real app it's ID
      // We use 1 as a dummy ID for the mock API call
      const res = await fetch(`${apiUrl}/siakad/dosen/courses/1/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: 'var(--color-muted)' }}>
      <i className="ph ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat E-Learning...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — DOSEN</p>
              <h1 style={{ margin: '0 0 8px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
                Manajemen Sesi E-Learning <i className="ph ph-books" style={{ color: 'white' }}></i>
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>Kelola materi pembelajaran, absensi, dan kuis untuk 14 sesi pertemuan.</p>
            </div>
            <button 
              onClick={() => router.push('/siakad/dosen/elearning/quiz')}
              style={{ background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', flexShrink: 0 }}
            >
              <i className="ph ph-plus-circle"></i> Buat Kuis / Ujian (CBT)
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Course Sidebar */}
        <div className="siakad-card" style={{ flex: '1 1 300px', padding: '20px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--color-text)' }}>Mata Kuliah Saya</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {courses.map(course => (
              <div 
                key={course.id} 
                onClick={() => loadSessions(course.id)}
                style={{ 
                  padding: '12px', borderRadius: '8px', cursor: 'pointer',
                  background: selectedCourse === course.id ? '#eff6ff' : 'transparent',
                  border: selectedCourse === course.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  color: selectedCourse === course.id ? '#1d4ed8' : '#4b5563',
                  fontWeight: selectedCourse === course.id ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {course.name}
              </div>
            ))}
            {courses.length === 0 && <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Tidak ada kelas aktif</div>}
          </div>
        </div>

        {/* Sessions Content */}
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          {!selectedCourse ? (
            <div className="siakad-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>
              <i className="ph ph-arrow-circle-left" style={{ fontSize: '3rem', color: 'var(--color-text)', marginBottom: '16px' }}></i>
              <p>Pilih mata kuliah di samping kiri untuk mengelola 14 sesi pertemuannya.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sessions.map((sess, idx) => (
                <div key={idx} className={`siakad-card stagger-${(idx % 5) + 1}`} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>Sesi {sess.session}: {sess.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--color-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ph ph-file-pdf"></i> {sess.material_count} Materi Terupload
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ph ph-files"></i> 0 Tugas Terlampir
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => window.toast('Simulasi: Berhasil membuka dialog upload materi!')} style={{ background: 'var(--color-border)', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-upload-simple"></i> Upload
                    </button>
                    <button onClick={() => window.toast('Simulasi: Berhasil membuka pengaturan Link Meet!')} style={{ background: 'var(--color-border)', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-video-camera"></i> Link Meet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
