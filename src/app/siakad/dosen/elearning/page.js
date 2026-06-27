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
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat E-Learning...
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Manajemen Sesi E-Learning <i className="ph-books" style={{ color: '#3b82f6' }}></i>
          </h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Kelola materi pembelajaran, absensi, dan kuis untuk 14 sesi pertemuan.</p>
        </div>
        <button 
          onClick={() => router.push('/siakad/dosen/elearning/quiz')}
          style={{ background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <i className="ph-plus-circle"></i> Buat Kuis / Ujian (CBT)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Course Sidebar */}
        <div className="siakad-card" style={{ width: '300px', padding: '20px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#1f2937' }}>Mata Kuliah Saya</h3>
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
            {courses.length === 0 && <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Tidak ada kelas aktif</div>}
          </div>
        </div>

        {/* Sessions Content */}
        <div style={{ flex: 1 }}>
          {!selectedCourse ? (
            <div className="siakad-card" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <i className="ph-arrow-circle-left" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '16px' }}></i>
              <p>Pilih mata kuliah di samping kiri untuk mengelola 14 sesi pertemuannya.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sessions.map((sess, idx) => (
                <div key={idx} className={`siakad-card stagger-${(idx % 5) + 1}`} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.1rem' }}>Sesi {sess.session}: {sess.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ph-file-pdf"></i> {sess.material_count} Materi Terupload
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ph-files"></i> 0 Tugas Terlampir
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph-upload-simple"></i> Upload
                    </button>
                    <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph-video-camera"></i> Link Meet
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
