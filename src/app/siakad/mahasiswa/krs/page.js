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

  const fetchDashboard = async () => {
    const token = localStorage.getItem('siakad_token');
    if (!token) return router.push('/siakad/login');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const [dashRes, availRes, subRes] = await Promise.all([
        fetch(`${apiUrl}/siakad/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/krs/available`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/siakad/krs/submission`, { headers: { 'Authorization': `Bearer ${token}` } })
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
      alert('Pilih minimal satu mata kuliah!');
      return;
    }
    
    if (!confirm('Yakin ingin mengajukan KRS ini? Anda tidak dapat mengubahnya setelah disubmit hingga ditolak.')) return;
    
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
          semester: 'Ganjil 2026/2027' // Currently hardcoded for demo
        })
      });

      if (res.ok) {
        alert('KRS berhasil diajukan! Menunggu persetujuan Kaprodi.');
        fetchDashboard();
      } else {
        alert('Gagal mengajukan KRS');
      }
    } catch (err) {
      alert('Error: ' + err.message);
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>KRS Online 📝</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Pilih dan ajukan mata kuliah untuk semester ini.</p>
      </div>

      {!krsOpen && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-warning-circle" style={{ color: '#dc2626', fontSize: '1.5rem' }}></i>
          <div>
            <p style={{ margin: 0, color: '#991b1b', fontSize: '1rem', fontWeight: 'bold' }}>Periode Pengisian KRS Ditutup</p>
            <p style={{ margin: '4px 0 0 0', color: '#b91c1c', fontSize: '0.9rem' }}>Saat ini Anda tidak dapat mengisi atau mengubah KRS. Silakan hubungi Admin atau Kaprodi jika ada pertanyaan.</p>
          </div>
        </div>
      )}

      {submission?.status === 'approved' && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-check-circle" style={{ color: '#166534', fontSize: '1.5rem' }}></i>
          <p style={{ margin: 0, color: '#14532d', fontSize: '0.9rem' }}>KRS Anda untuk Semester Ganjil 2026/2027 telah <strong>DISETUJUI</strong> oleh Kaprodi/Dosen Wali. Selamat belajar!</p>
        </div>
      )}

      {submission?.status === 'pending' && (
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-clock-circle" style={{ color: '#b45309', fontSize: '1.5rem' }}></i>
          <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>KRS Anda sedang <strong>MENUNGGU PERSETUJUAN</strong> Kaprodi/Dosen Wali.</p>
        </div>
      )}
      
      {(!submission?.status || submission?.status === 'rejected') && krsOpen && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="ph ph-info" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
          <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>
            {submission?.status === 'rejected' ? 'KRS Anda ditolak. Silakan susun ulang.' : 'Silakan pilih mata kuliah yang ingin diambil semester ini.'}
          </p>
        </div>
      )}

      {krsOpen && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Daftar Mata Kuliah Tersedia</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#f3f4f6', padding: '10px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', color: '#4b5563' }}>
              Total: {totalSKS} SKS
            </div>
            {(!submission?.status || submission?.status === 'rejected') && (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || selectedCourses.length === 0}
                style={{
                  background: (isSubmitting || selectedCourses.length === 0) ? '#9ca3af' : '#2563eb',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px',
                  fontWeight: 'bold', cursor: (isSubmitting || selectedCourses.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
              >
                <i className="ph ph-paper-plane-right"></i> {isSubmitting ? 'Mengajukan...' : 'Ajukan KRS'}
              </button>
            )}
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600', width: '50px' }}>Pilih</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Kode MK</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Mata Kuliah</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Dosen Pengampu</th>
                <th style={{ padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>SKS</th>
              </tr>
            </thead>
            <tbody>
              {availableCourses.map((course, idx) => {
                const isSelected = selectedCourses.includes(course.id);
                const isLocked = submission && (submission.status === 'pending' || submission.status === 'approved');
                
                return (
                  <tr 
                    key={course.id} 
                    onClick={() => toggleCourse(course.id)}
                    style={{ 
                      borderBottom: '1px solid #f3f4f6', 
                      background: isSelected ? '#eff6ff' : 'white',
                      cursor: isLocked ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        width: '20px', height: '20px', border: `2px solid ${isSelected ? '#3b82f6' : '#d1d5db'}`, 
                        borderRadius: '4px', background: isSelected ? '#3b82f6' : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: isLocked ? 0.6 : 1
                      }}>
                        {isSelected && <i className="ph ph-check" style={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}></i>}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#4f46e5' }}>{course.code}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>{course.name}</td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>{course.dosen?.name || 'Belum Ditentukan'}</td>
                    <td style={{ padding: '16px', color: '#4b5563', fontWeight: '600' }}>{course.sks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        </div>
      )}
    </div>
  );
}
