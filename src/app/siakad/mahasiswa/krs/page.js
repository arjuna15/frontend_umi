"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SkeletonLoader from '../../components/SkeletonLoader';

export default function KRSPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [krsOpen, setKrsOpen] = useState(true);
  const [semesterSetting, setSemesterSetting] = useState('Semester aktif');
  const [searchQuery, setSearchQuery] = useState('');
  const currentSemester = data?.semester || semesterSetting || 'Semester aktif';

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const semesterParam = localStorage.getItem('siakad_semester') || 'Ganjil 2026/2027';
      const [dashRes, availRes, subRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/krs/available?semester=${encodeURIComponent(semesterParam)}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/krs/submission?semester=${encodeURIComponent(semesterParam)}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!dashRes.ok) throw new Error('Failed to fetch');
      const result = await dashRes.json();
      if (result.user.role !== 'mahasiswa') return router.push('/siakad/login');
      
      setData(result);
      const availData = await availRes.json();
      setAvailableCourses(availData);
      
      const subData = await subRes.json();
      setSubmission(subData);

      if (subData && subData.course_ids) {
        setSelectedCourses(subData.course_ids);
      } else {
        setSelectedCourses([]);
      }
    } catch (err) {
      router.push('/siakad/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedKrsStatus = localStorage.getItem('siakad_krs_open');
    if (savedKrsStatus === 'false') {
      setKrsOpen(false);
    }
    setSemesterSetting(localStorage.getItem('siakad_semester') || 'Semester aktif');
    fetchDashboard();
  }, [router]);

  const toggleCourse = (courseId) => {
    if (submission && (submission.status === 'pending' || submission.status === 'approved')) return;
    
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      window.toast('Pilih minimal satu mata kuliah!');
      return;
    }
    
    if (!await window.toast.confirm('Yakin ingin mengajukan KRS ini? Anda tidak dapat mengubahnya setelah disubmit hingga ditolak.')) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem('siakad_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    try {
      const res = await fetch(`${apiUrl}/siakad/krs/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_ids: selectedCourses,
          semester: currentSemester
        })
      });

      if (res.ok) {
        window.toast('KRS berhasil diajukan! Menunggu persetujuan Kaprodi.');
        fetchDashboard();
      } else {
        window.toast('Gagal mengajukan KRS');
      }
    } catch (err) {
      window.toast('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !data) return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text)', margin: '0 0 24px 0' }}>Memuat KRS...</h1>
      <SkeletonLoader type="card" />
      <SkeletonLoader type="table" />
    </div>
  );

  const totalSKS = availableCourses
    .filter(c => selectedCourses.includes(c.id))
    .reduce((sum, c) => sum + c.sks, 0);

  return (
    <div>
      <div className="siakad-page-header">
        <div className="siakad-page-header-glow"></div>
        <div className="siakad-page-header-grid"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — MAHASISWA</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>KRS Online</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Pilih dan ajukan mata kuliah untuk {currentSemester}.</p>
        </div>
      </div>

      {!krsOpen && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-warning-circle" style={{ color: '#ef4444', fontSize: '1.5rem' }}></i>
          <div>
            <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '1rem', fontWeight: 'bold' }}>Periode Pengisian KRS Ditutup</p>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text)', fontSize: '0.9rem' }}>Saat ini Anda tidak dapat mengisi atau mengubah KRS. Silakan hubungi Admin atau Kaprodi jika ada pertanyaan.</p>
          </div>
        </div>
      )}

      {submission?.status === 'approved' && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph ph-check-circle" style={{ color: '#10b981', fontSize: '1.5rem' }}></i>
            <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.9rem' }}>KRS Anda untuk Semester {currentSemester} telah <strong>DISETUJUI</strong> oleh Kaprodi/Dosen Wali. Selamat belajar!</p>
          </div>
          <button 
            onClick={() => window.open('/api/siakad/export/krs', '_blank')}
            style={{ background: '#10b981', border: 'none', padding: '8px 16px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
          >
            <i className="ph ph-file-pdf"></i> Unduh KRS Resmi (PDF)
          </button>
        </div>
      )}

      {submission?.status === 'pending' && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-clock-circle" style={{ color: '#f59e0b', fontSize: '1.5rem' }}></i>
          <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.9rem' }}>KRS Anda sedang <strong>MENUNGGU PERSETUJUAN</strong> Kaprodi/Dosen Wali.</p>
        </div>
      )}
      
      {submission?.status === 'rejected' && krsOpen && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-warning-octagon" style={{ color: '#ef4444', fontSize: '1.5rem' }}></i>
          <div>
            <p style={{ margin: 0, color: '#ef4444', fontSize: '1rem', fontWeight: 'bold' }}>KRS Anda DITOLAK</p>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text)', fontSize: '0.9rem' }}>
              Alasan: {submission?.rejection_reason || 'Silakan konsultasi dengan Dosen Wali dan susun ulang KRS Anda.'}
            </p>
          </div>
        </div>
      )}

      {!submission?.status && krsOpen && (
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-info" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
          <p style={{ margin: 0, color: 'var(--color-text)', fontSize: '0.9rem' }}>
            Silakan pilih mata kuliah yang ingin diambil semester ini.
          </p>
        </div>
      )}

      {krsOpen && (
        <div className="siakad-card" style={{ padding: '24px' }}>

        <div className="siakad-modal-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>Daftar Mata Kuliah Tersedia</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1rem' }}></i>
              <input 
                type="text" 
                placeholder="Cari matkul, kode, dosen..." 
                className="siakad-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  paddingLeft: '46px', 
                  color: 'var(--color-text)',
                  fontSize: '0.85rem'
                }} 
              />
            </div>
            <div style={{ background: 'var(--color-border)', padding: '10px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              Total: {totalSKS} SKS
            </div>
            {(!submission?.status || submission?.status === 'rejected') && (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || selectedCourses.length === 0}
                style={{
                  background: (isSubmitting || selectedCourses.length === 0) ? 'var(--color-muted)' : 'linear-gradient(135deg, #C41E3A 0%, #9b1c2e 100%)',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px',
                  fontWeight: 'bold', cursor: (isSubmitting || selectedCourses.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: (isSubmitting || selectedCourses.length === 0) ? 'none' : '0 4px 12px rgba(196, 30, 58, 0.3)', transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
              >
                <i className="ph ph-paper-plane-right"></i> {isSubmitting ? 'Mengajukan...' : 'Ajukan KRS'}
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '10px' }}>
          <table className="siakad-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Pilih</th>
                <th>Kode MK</th>
                <th>Mata Kuliah</th>
                <th>Dosen Pengampu</th>
                <th>SKS</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredCourses = availableCourses.filter(course => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    course.name?.toLowerCase().includes(query) ||
                    course.code?.toLowerCase().includes(query) ||
                    course.dosen?.name?.toLowerCase().includes(query)
                  );
                });

                if (filteredCourses.length === 0) {
                  return (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>Mata kuliah tidak ditemukan</td>
                    </tr>
                  );
                }

                return filteredCourses.map((course, idx) => {
                  const isSelected = selectedCourses.includes(course.id);
                  const isLocked = submission && (submission.status === 'pending' || submission.status === 'approved');
                  
                  return (
                    <tr 
                      key={course.id} 
                      onClick={() => toggleCourse(course.id)}
                      style={{ 
                        background: isSelected ? 'rgba(59,130,246,0.05)' : 'transparent',
                        cursor: isLocked ? 'default' : 'pointer',
                      }}
                    >
                      <td>
                        <div style={{ 
                          width: '20px', height: '20px', border: `2px solid ${isSelected ? '#0f172a' : 'var(--color-border)'}`, 
                          borderRadius: '4px', background: isSelected ? '#0f172a' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: isLocked ? 0.6 : 1
                        }}>
                          {isSelected && <i className="ph ph-check" style={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}></i>}
                        </div>
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{course.code}</td>
                      <td style={{ fontWeight: '600' }}>{course.name}</td>
                      <td style={{ color: 'var(--color-muted)' }}>{course.dosen?.name || 'Belum Ditentukan'}</td>
                      <td style={{ color: 'var(--color-muted)', fontWeight: '600' }}>{course.sks}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        </div>
      )}
    </div>
  );
}
