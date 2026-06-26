"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DosenElearningPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  
  // Form States
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');

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

  useEffect(() => {
    fetchDashboard();
  }, [router]);

  const handleUploadMateri = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || !selectedCourseId) return;
    
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('file', uploadFile);
    
    try {
      const res = await fetch(`${apiUrl}/siakad/course/${selectedCourseId}/materi`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadFile(null);
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignTitle || !assignDesc || !assignDeadline || !selectedCourseId) return;
    
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/course/${selectedCourseId}/assignment`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: assignTitle,
          description: assignDesc,
          deadline: assignDeadline
        })
      });
      if (res.ok) {
        setShowAssignModal(false);
        setAssignTitle('');
        setAssignDesc('');
        setAssignDeadline('');
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
      <i className="ph-spinner ph-spin" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Memuat data kelas Anda...
    </div>
  );

  const getFileUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
    return backendUrl + (path.startsWith('/') ? path : '/' + path);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Manajemen E-Learning 👨‍🏫</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '1.05rem' }}>Kelola materi dan berikan tugas interaktif kepada mahasiswa Anda.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.jadwal.map((course, i) => (
          <div key={i} className={`siakad-card stagger-${(i % 5) + 1}`}>
            <div style={{ background: 'linear-gradient(90deg, rgba(220,252,231,0.7) 0%, rgba(255,255,255,0) 100%)', padding: '24px 32px', borderBottom: '1px solid rgba(167,243,208,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', color: 'rgba(5,150,105,0.03)', transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <i className="ph-books"></i>
              </div>
              <div style={{ zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#064e3b', fontWeight: '800', letterSpacing: '-0.02em' }}>{course.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.85rem', color: '#059669', fontWeight: '600', padding: '4px 12px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '999px' }}>{course.code} • {course.sks} SKS</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', zIndex: 1 }}>
                <button onClick={() => { setSelectedCourseId(course.id); setShowUploadModal(true); }} style={{ background: 'white', border: '1px solid #6ee7b7', color: '#059669', padding: '10px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(5,150,105,0.1)' }}>
                  <i className="ph-upload-simple"></i> Upload Materi
                </button>
                <button onClick={() => { setSelectedCourseId(course.id); setShowAssignModal(true); }} style={{ background: '#059669', border: '1px solid #047857', color: 'white', padding: '10px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(5,150,105,0.3)' }}>
                  <i className="ph-plus-circle"></i> Buat Tugas
                </button>
              </div>
            </div>

            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

              {/* Materials Section */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ph-folder-open"></i>
                  </div>
                  File Materi Kuliah
                </h4>
                {course.materials && course.materials.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {course.materials.map((mat, j) => (
                      <li key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontSize: '0.95rem', fontWeight: '600' }}>
                          <i className="ph-file-pdf" style={{ fontSize: '1.4rem', color: '#ef4444' }}></i> {mat.title}
                        </div>
                        <a href={getFileUrl(mat.content_link)} target="_blank" rel="noreferrer" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', color: '#0ea5e9', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #e0f2fe' }}>Download</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', padding: '16px', background: 'rgba(241,245,249,0.5)', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>Belum ada materi yang diunggah untuk kelas ini.</p>
                )}
              </div>

              {/* Assignments Section */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ph-clipboard-text"></i>
                  </div>
                  Tugas / Quiz Aktif
                </h4>
                {course.assignments && course.assignments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {course.assignments.map((ass, j) => (
                      <li key={j} style={{ padding: '20px', border: '1px solid rgba(253,230,138,0.5)', background: 'rgba(255,251,235,0.7)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(245,158,11,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <strong style={{ color: '#92400e', fontSize: '1.05rem', fontWeight: '800' }}>{ass.title}</strong>
                          <span style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}>Tenggat: {ass.deadline}</span>
                        </div>
                        <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#b45309', lineHeight: '1.6' }}>{ass.description}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <span style={{ background: 'white', border: '1px solid #fde68a', color: '#d97706', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <i className="ph-users" style={{ marginRight: '6px' }}></i>
                            {ass.submissions?.length || 0} Mahasiswa Mengumpulkan
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', padding: '16px', background: 'rgba(241,245,249,0.5)', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>Belum ada tugas yang diberikan.</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Upload Materi Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Upload Materi Kuliah</h3>
            <form onSubmit={handleUploadMateri} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Judul Materi</label>
                <input type="text" required value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Contoh: Pertemuan 1 - Pengantar" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>File Materi (PDF/PPT/DOC)</label>
                <input type="file" required onChange={e => setUploadFile(e.target.files[0])} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px dashed #cbd5e1', outline: 'none', background: '#f8fafc' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#059669', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(5,150,105,0.3)' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buat Tugas Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Buat Tugas Baru</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Judul Tugas</label>
                <input type="text" required value={assignTitle} onChange={e => setAssignTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Contoh: Tugas Besar 1" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Instruksi Tugas</label>
                <textarea required value={assignDesc} onChange={e => setAssignDesc(e.target.value)} rows="4" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="Jelaskan instruksi tugas secara detail..."></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Batas Waktu (Deadline)</label>
                <input type="date" required value={assignDeadline} onChange={e => setAssignDeadline(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAssignModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#d97706', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(217,119,6,0.3)' }}>Publikasikan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
