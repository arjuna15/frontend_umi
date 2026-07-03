'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenElearningPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSession, setUploadSession] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Meet Modal States
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetSession, setMeetSession] = useState(null);
  const [meetUrl, setMeetUrl] = useState('');
  const [savingMeet, setSavingMeet] = useState(false);

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
      
      const courseList = result.schedule ? result.schedule.map(s => ({ id: s.course_id, name: s.course })) : [];
      setCourses(courseList);
      if (courseList.length > 0) {
        loadSessions(courseList[0].id);
      }
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
      const res = await fetch(`${apiUrl}/siakad/dosen/courses/${courseId}/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle || !uploadSession) return;
    setUploading(true);

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('file', selectedFile);
    formData.append('session_num', uploadSession);

    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/course/${selectedCourse}/materials`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        window.toast && window.toast('File materi berhasil diupload!');
        setShowUploadModal(false);
        setUploadTitle('');
        setSelectedFile(null);
        loadSessions(selectedCourse);
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMeetSubmit = async (e) => {
    e.preventDefault();
    if (!meetUrl || !meetSession) return;
    setSavingMeet(true);

    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${apiUrl}/siakad/dosen/course/${selectedCourse}/meet-link`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_num: meetSession, meet_url: meetUrl })
      });
      if (res.ok) {
        window.toast && window.toast('Link virtual meet berhasil diperbarui!');
        setShowMeetModal(false);
        setMeetUrl('');
        loadSessions(selectedCourse);
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setSavingMeet(false);
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
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' , flexShrink: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' , flexShrink: 0 }}></div>
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
                  padding: '14px', borderRadius: '12px', cursor: 'pointer',
                  background: selectedCourse === course.id ? 'linear-gradient(135deg, #C41E3A, #9b1c2e)' : 'var(--glass-bg)',
                  border: selectedCourse === course.id ? '1px solid rgba(196,30,58,0.5)' : '1px solid var(--color-border)',
                  color: selectedCourse === course.id ? 'white' : 'var(--color-text)',
                  fontWeight: '600',
                  boxShadow: selectedCourse === course.id ? '0 4px 14px rgba(196,30,58,0.3)' : 'none',
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
        <div style={{ flex: '2 1 500px', minWidth: 0 }}>
          {!selectedCourse ? (
            <div className="siakad-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>
              <i className="ph ph-arrow-circle-left" style={{ fontSize: '3rem', color: 'var(--color-text)', marginBottom: '16px' }}></i>
              <p>Pilih mata kuliah di samping kiri untuk mengelola 14 sesi pertemuannya.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sessions.map((sess, idx) => (
                <div key={idx} className={`siakad-card stagger-${(idx % 5) + 1}`} style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: '700' }}>Sesi {sess.session}: {sess.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--color-muted)', fontSize: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                        <i className="ph ph-file-pdf"></i> {sess.material_count} Materi Terupload
                      </span>
                      {sess.meet_link ? (
                        <a href={sess.meet_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', textDecoration: 'none' }}>
                          <i className="ph ph-video-camera"></i> Link Active Meet
                        </a>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)' }}>
                          <i className="ph ph-video-camera-slash"></i> Belum ada link meet
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => { setUploadSession(sess.session); setShowUploadModal(true); }} 
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontWeight: '600', transition: 'all 0.2s' }}
                    >
                      <i className="ph ph-upload-simple"></i> Upload
                    </button>
                    <button 
                      onClick={() => { setMeetSession(sess.session); setMeetUrl(sess.meet_link || ''); setShowMeetModal(true); }} 
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontWeight: '600', transition: 'all 0.2s' }}
                    >
                      <i className="ph ph-video-camera"></i> Link Meet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload Materi */}
      {showUploadModal && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div className="siakad-modal-header">
              <h3 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-upload-simple" style={{ color: '#C41E3A' }}></i> Upload Materi Sesi {uploadSession}
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Judul Materi</label>
                <input 
                  type="text" 
                  className="siakad-input" 
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Pengenalan Sintaks Dasar Python"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Pilih File</label>
                <input 
                  type="file" 
                  className="siakad-input"
                  onChange={e => setSelectedFile(e.target.files[0])}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed var(--color-border)', padding: '20px', textAlign: 'center' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '8px', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Batal
                </button>
                <button type="submit" disabled={uploading} style={{ background: '#C41E3A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(196, 30, 58, 0.3)' }}>
                  {uploading ? 'Mengupload...' : 'Upload Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Meet Link */}
      {showMeetModal && (
        <div className="siakad-modal-overlay">
          <div className="siakad-modal-content">
            <div className="siakad-modal-header">
              <h3 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph ph-video-camera" style={{ color: '#10b981' }}></i> Link Virtual Meet Sesi {meetSession}
              </h3>
              <button onClick={() => setShowMeetModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <form onSubmit={handleMeetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Google Meet / Zoom URL</label>
                <input 
                  type="url" 
                  className="siakad-input" 
                  value={meetUrl}
                  onChange={e => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowMeetModal(false)} style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '10px 20px', borderRadius: '8px', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Batal
                </button>
                <button type="submit" disabled={savingMeet} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                  {savingMeet ? 'Menyimpan...' : 'Simpan Link Meet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
