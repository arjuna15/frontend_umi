'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalShell from '../../components/ModalShell';

export default function DosenElearningPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [fullCourses, setFullCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

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

  // Assignment Modal States
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssTitle, setNewAssTitle] = useState('');
  const [newAssDesc, setNewAssDesc] = useState('');
  const [newAssDeadline, setNewAssDeadline] = useState('');
  const [isCreatingAss, setIsCreatingAss] = useState(false);

  // Submissions Modal States
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingValues, setGradingValues] = useState({});
  const [isSavingGrade, setIsSavingGrade] = useState({});
  const [submissionSearch, setSubmissionSearch] = useState('');

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');
    try {
      const res = await fetch(`/api/siakad/dosen/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      
      setFullCourses(result.courses || []);
      const courseList = result.courses ? result.courses.map(s => ({ id: s.id, name: s.name })) : [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setSelectedCourse(courseList[0].id);
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
    setQuizzes([]);
    setLoadingQuizzes(true);
    try {
      const res = await fetch(`/api/siakad/dosen/courses/${courseId}/sessions`);
      if (res.ok) {
        setSessions(await res.json());
      }
      const quizRes = await fetch(`/api/siakad/dosen/courses/${courseId}/quizzes`);
      if (quizRes.ok) {
        setQuizzes(await quizRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle || !uploadSession) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('file', selectedFile);
    formData.append('session_num', uploadSession);

    try {
      const res = await fetch(`/api/siakad/dosen/course/${selectedCourse}/materials`, {
        method: 'POST',
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

    try {
      const res = await fetch(`/api/siakad/dosen/course/${selectedCourse}/meet-link`, {
        method: 'POST',
        headers: { 
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

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssTitle || !newAssDesc || !newAssDeadline) return;
    setIsCreatingAss(true);

    try {
      const res = await fetch(`/api/siakad/course/${selectedCourse}/assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssTitle,
          description: newAssDesc,
          deadline: newAssDeadline
        })
      });
      if (res.ok) {
        window.toast && window.toast('Tugas baru berhasil diterbitkan!');
        setShowAssignmentModal(false);
        setNewAssTitle('');
        setNewAssDesc('');
        setNewAssDeadline('');
        fetchDashboard();
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setIsCreatingAss(false);
    }
  };

  const handleGradeSubmission = async (submissionId, gradeValue) => {
    if (gradeValue === '' || isNaN(gradeValue)) {
      window.toast && window.toast('Masukkan nilai angka yang valid!');
      return;
    }
    
    setIsSavingGrade(prev => ({ ...prev, [submissionId]: true }));

    try {
      const res = await fetch(`/api/siakad/submission/${submissionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: parseFloat(gradeValue) })
      });
      if (res.ok) {
        window.toast && window.toast('Nilai tugas berhasil disimpan!');
        
        // Dynamic refresh
        const refreshedData = await res.json();
        
        // Refresh selected assignment submissions directly in local state
        if (selectedAssignment) {
          const updatedSubs = selectedAssignment.submissions.map(s => 
            s.id === submissionId ? { ...s, grade: parseFloat(gradeValue) } : s
          );
          setSelectedAssignment({
            ...selectedAssignment,
            submissions: updatedSubs
          });
        }
        fetchDashboard();
      } else {
        const err = await res.json();
        window.toast && window.toast('Gagal: ' + (err.message || 'Error'));
      }
    } catch (err) {
      window.toast && window.toast('Error: ' + err.message);
    } finally {
      setIsSavingGrade(prev => ({ ...prev, [submissionId]: false }));
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
        <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
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
              style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', padding: '10px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)' }}
            >
              <i className="ph ph-plus-circle"></i> Buat Kuis / Ujian (CBT)
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
         <div className="siakad-card" style={{ flex: '1 1 300px', padding: '24px', height: 'fit-content', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(196, 30, 58, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ph ph-books" style={{ color: '#C41E3A', fontSize: '1.1rem' }}></i>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: '800' }}>Mata Kuliah Saya</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {courses.map(course => (
              <div 
                key={course.id} 
                onClick={() => loadSessions(course.id)}
                style={{ 
                  padding: '14px', borderRadius: '24px', cursor: 'pointer',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sessions.map((sess, idx) => (
                  <div key={idx} className={`siakad-card stagger-${(idx % 5) + 1}`} style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: '700' }}>Sesi {sess.session}: {sess.title}</h3>
                      <div style={{ display: 'flex', gap: '16px', color: 'var(--color-muted)', fontSize: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(196, 30, 58, 0.1)', color: '#C41E3A', padding: '4px 12px', borderRadius: '50px', fontWeight: '600' }}>
                          <i className="ph ph-file-pdf"></i> {sess.material_count} Materi Terupload
                        </span>
                        {sess.meet_link ? (
                          <a href={sess.meet_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '50px', fontWeight: '600', textDecoration: 'none' }}>
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
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '10px 18px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontWeight: '600', transition: 'all 0.2s' }}
                      >
                        <i className="ph ph-upload-simple"></i> Upload
                      </button>
                      <button 
                        onClick={() => { setMeetSession(sess.session); setMeetUrl(sess.meet_link || ''); setShowMeetModal(true); }} 
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '10px 18px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontWeight: '600', transition: 'all 0.2s' }}
                      >
                        <i className="ph ph-video-camera"></i> Link Meet
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CBT Quizzes Section */}
              <div className="siakad-card" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="ph ph-exam" style={{ color: '#C41E3A' }}></i> Daftar Kuis & Ujian Kelas (CBT)
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                      Kuis, UTS, dan UAS berbasis Computer Based Test.
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/siakad/dosen/elearning/quiz')}
                    style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', padding: '8px 18px', borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)' }}
                  >
                    <i className="ph ph-plus-circle"></i> Buat Kuis / Ujian
                  </button>
                </div>

                {loadingQuizzes ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-muted)' }}>
                    <i className="ph ph-spinner ph-spin" style={{ fontSize: '1.5rem', marginRight: '8px' }}></i> Memuat kuis...
                  </div>
                ) : quizzes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {quizzes.map((quiz, i) => {
                      let categoryBadge = null;
                      if (quiz.category === 'uts') {
                        categoryBadge = (
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f97316', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '2px 10px', borderRadius: '50px' }}>
                            UTS
                          </span>
                        );
                      } else if (quiz.category === 'uas') {
                        categoryBadge = (
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 10px', borderRadius: '50px' }}>
                            UAS
                          </span>
                        );
                      } else {
                        categoryBadge = (
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 10px', borderRadius: '50px' }}>
                            Kuis
                          </span>
                        );
                      }

                      return (
                        <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: '24px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{quiz.title}</strong>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              {categoryBadge}
                              {(quiz.require_proctoring === true || quiz.require_proctoring === 1) && (
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 10px', borderRadius: '50px' }}>
                                  Diawasi AI
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                              <i className="ph ph-question" style={{ marginRight: '6px' }}></i>
                              {quiz.questions?.length || 0} Soal
                              <span style={{ margin: '0 8px' }}>•</span>
                              <i className="ph ph-clock" style={{ marginRight: '6px' }}></i>
                              {quiz.duration_minutes} menit
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-muted)', border: '1px dashed var(--color-border)', borderRadius: '24px' }}>
                    <i className="ph ph-folder-open" style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'block', color: 'var(--color-muted)' }}></i>
                    <p style={{ margin: '0 0 16px 0' }}>Belum ada Kuis/Ujian yang dibuat untuk kelas ini.</p>
                    <button 
                      onClick={() => router.push('/siakad/dosen/elearning/quiz')}
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '8px 18px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Buat Kuis Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignments Card Section (Pindahkan ke dalam kolom kanan agar tidak keluar layout/nabrak) */}
          {selectedCourse && (
            (() => {
              const selectedCourseData = fullCourses.find(c => c.id === selectedCourse);
              return (
                <div className="siakad-card" style={{ padding: '24px 0 0 0', marginTop: '24px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                  <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ph ph-clipboard-text" style={{ color: '#C41E3A' }}></i> Tugas & Kuis E-Learning
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Buat tugas baru dan periksa berkas pengumpulan mahasiswa.</p>
                    </div>
                    <button 
                      onClick={() => setShowAssignmentModal(true)}
                      style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)' }}
                    >
                      <i className="ph ph-plus-circle"></i> Buat Tugas Baru
                    </button>
                  </div>

                  {selectedCourseData?.assignments && selectedCourseData.assignments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedCourseData.assignments.map((ass, i) => (
                        <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: '24px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{ass.title}</strong>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', background: '#C41E3A', padding: '4px 12px', borderRadius: '50px' }}>
                              Deadline: {ass.deadline}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>{ass.description}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text)', fontWeight: '600' }}>
                              <i className="ph ph-users" style={{ marginRight: '6px' }}></i>
                              {ass.submissions?.length || 0} Pengumpulan
                            </span>
                            <button 
                              onClick={() => { 
                                setSelectedAssignment(ass); 
                                const initialGrades = {};
                                ass.submissions?.forEach(sub => {
                                  initialGrades[sub.mahasiswa_id] = sub.grade !== null ? String(sub.grade) : '';
                                });
                                setGradingValues(initialGrades);
                                setShowSubmissionsModal(true); 
                              }}
                              style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', padding: '8px 18px', borderRadius: '50px', color: 'var(--color-text)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                            >
                              <i className="ph ph-eye"></i> Periksa & Nilai
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-muted)', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                      <i className="ph ph-folder-open" style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'block', color: 'var(--color-muted)' }}></i>
                      <p style={{ margin: 0 }}>Belum ada tugas e-learning dibuat untuk kelas ini.</p>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>

      {showUploadModal && (
        <ModalShell
          title={`Upload Materi Sesi ${uploadSession}`}
          icon="ph-upload-simple"
          onClose={() => setShowUploadModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="upload-form" disabled={uploading} style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(196, 30, 58, 0.25)' }}>{uploading ? 'Mengupload...' : 'Upload Materi'}</button>
            </>
          )}
        >
          <form id="upload-form" onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          </form>
        </ModalShell>
      )}

      {showMeetModal && (
        <ModalShell
          title={`Link Virtual Meet Sesi ${meetSession}`}
          icon="ph-video-camera"
          onClose={() => setShowMeetModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowMeetModal(false)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="meet-form" disabled={savingMeet} style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 24px rgba(16, 185, 129, 0.28)' }}>{savingMeet ? 'Menyimpan...' : 'Simpan Link Meet'}</button>
            </>
          )}
        >
          <form id="meet-form" onSubmit={handleMeetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          </form>
        </ModalShell>
      )}

      {showAssignmentModal && (
        <ModalShell
          title="Buat Tugas Baru"
          icon="ph-plus-circle"
          onClose={() => setShowAssignmentModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowAssignmentModal(false)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Batal</button>
              <button type="submit" form="assignment-form" disabled={isCreatingAss} style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 24px rgba(196, 30, 58, 0.28)' }}>{isCreatingAss ? 'Menerbitkan...' : 'Terbitkan Tugas'}</button>
            </>
          )}
        >
          <form id="assignment-form" onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Judul Tugas</label>
              <input 
                type="text" 
                className="siakad-input" 
                value={newAssTitle}
                onChange={e => setNewAssTitle(e.target.value)}
                placeholder="Contoh: Tugas Mandiri 1 - Analisis Algoritma"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Petunjuk / Deskripsi Tugas</label>
              <textarea 
                className="siakad-input" 
                value={newAssDesc}
                onChange={e => setNewAssDesc(e.target.value)}
                placeholder="Ketik deskripsi tugas di sini..."
                style={{ width: '100%', height: '100px', resize: 'vertical' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '600' }}>Batas Waktu (Deadline)</label>
              <input 
                type="datetime-local" 
                className="siakad-input" 
                value={newAssDeadline}
                onChange={e => setNewAssDeadline(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
          </form>
        </ModalShell>
      )}

      {showSubmissionsModal && selectedAssignment && (
        <ModalShell
          title={`Pengumpulan Tugas: ${selectedAssignment.title}`}
          icon="ph-users"
          onClose={() => setShowSubmissionsModal(false)}
          footer={(
            <button type="button" onClick={() => setShowSubmissionsModal(false)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 700 }}>Tutup</button>
          )}
        >
          <div style={{ marginBottom: '16px' }}>
            <input 
              type="text" 
              className="siakad-input" 
              placeholder="Cari mahasiswa berdasarkan nama atau NIM..." 
              value={submissionSearch} 
              onChange={e => setSubmissionSearch(e.target.value)} 
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', color: 'var(--color-text)' }}>Mahasiswa</th>
                  <th style={{ padding: '10px 8px', color: 'var(--color-text)' }}>Status</th>
                  <th style={{ padding: '10px 8px', color: 'var(--color-text)' }}>Berkas</th>
                  <th style={{ padding: '10px 8px', color: 'var(--color-text)', width: '150px' }}>Input Nilai</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const selectedCourseData = fullCourses.find(c => c.id === selectedCourse);
                  const enrolledStudents = selectedCourseData?.grades || [];
                  
                  const filteredStudents = enrolledStudents.filter(gradeObj => {
                    const student = gradeObj.mahasiswa;
                    if (!student) return false;
                    const query = submissionSearch.toLowerCase();
                    return student.name.toLowerCase().includes(query) || student.nim_nip.toLowerCase().includes(query);
                  });

                  if (filteredStudents.length === 0) {
                    return (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)' }}>Tidak ada mahasiswa yang cocok dengan pencarian.</td>
                      </tr>
                    );
                  }

                  return filteredStudents.map((gradeObj, idx) => {
                    const student = gradeObj.mahasiswa;
                    if (!student) return null;

                    const submission = selectedAssignment.submissions?.find(s => s.mahasiswa_id === student.id);
                    const gradeVal = gradingValues[student.id] || '';
                    const isSaving = isSavingGrade[submission?.id] || false;

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>NIM: {student.nim_nip}</div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {submission ? (
                            submission.grade !== null ? (
                              <span style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Sudah Dinilai ({submission.grade})</span>
                            ) : (
                              <span style={{ display: 'inline-block', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Perlu Dinilai</span>
                            )
                          ) : (
                            <span style={{ display: 'inline-block', background: 'rgba(100,116,139,0.1)', color: '#64748b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Belum Mengumpulkan</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {submission ? (
                            <button 
                              onClick={() => window.open(`/api/siakad/submission/${submission.id}/download`, '_blank')}
                              style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              <i className="ph ph-download-simple"></i> Unduh Berkas
                            </button>
                          ) : '-'}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {submission ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input 
                                type="number" 
                                className="siakad-input"
                                value={gradeVal}
                                onChange={e => setGradingValues({ ...gradingValues, [student.id]: e.target.value })}
                                placeholder="0-100"
                                style={{ width: '60px', padding: '6px', fontSize: '0.8rem', textAlign: 'center' }}
                                min="0"
                                max="100"
                              />
                              <button
                                onClick={() => handleGradeSubmission(submission.id, gradeVal)}
                                disabled={isSaving}
                                style={{ background: '#C41E3A', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(196, 30, 58, 0.3)' }}
                              >
                                {isSaving ? <i className="ph ph-spinner ph-spin"></i> : 'Simpan'}
                              </button>
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
